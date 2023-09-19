import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, eventTicketsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import type { InferInsertModel } from 'drizzle-orm';
import { writeFile } from 'fs';
import joi from 'joi';
import sharp from 'sharp';
import shortUUID from 'short-uuid';

export const POST = (async ({ request }) => {
	type NewEvent = InferInsertModel<typeof eventsTable>;
	type NewEventTicket = InferInsertModel<typeof eventTicketsTable>;
	const formData = await request.formData();
	const requestBodyEvent = JSON.parse(formData.get('event') as string);
	const requestBodyTicket = JSON.parse(formData.get('ticket') as string);
	const thumbnail = formData.get('thumbnail') as File;
	const images = formData.getAll('images') as File[];
	const suuid = shortUUID();

	const requestSchemaEvent = joi.object({
		name: joi.string().min(3).max(80).required(),
		description: joi.string().max(4000).required(),
		ownerId: joi.number().precision(0).required(),
		ownerType: joi.string().valid('user', 'organization').required(),
		startDate: joi.date().min(Date.now()).required(),
		endDate: joi.date().min(joi.ref('startDate')).required(),
		status: joi.string(),
		category: joi.string(),
		terms: joi.string().max(4000)
	});

	const requestSchemaTicket = joi.object({
		price: joi.number().required(),
		ticketsTotal: joi.number().precision(0).required(),
		ticketsAvailable: joi.number().precision(0).max(joi.ref('ticketsTotal')).required(),
		type: joi.number().precision(0)
	});

	const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

	if (!requestBodyEvent) throw error(400, 'must provide event details');
	let { error: validationError } = requestSchemaEvent.validate(requestBodyEvent);
	if (!validationError && requestBodyTicket) {
		validationError = requestSchemaTicket.validate(requestBodyTicket).error;
	}
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}
	if (!thumbnail) throw error(400, 'thumbnail required');
	if (!supportedImageTypes.includes(thumbnail.type)) throw error(415, 'unsupported image format');
	if (images.length > 0 && !images.every((image) => supportedImageTypes.includes(image.type))) {
		throw error(415, 'unsupported image format');
	}

	let processedThumbnail: Buffer;
	const thumbnailId = suuid.new();
	try {
		const imageData = await thumbnail.arrayBuffer();
		processedThumbnail = await sharp(imageData)
			.resize({ height: 360, width: 640, fit: 'inside' })
			.webp({ quality: 90 })
			.toBuffer();
	} catch (e) {
		throw error(415, 'unsupported image format');
	}

	const processedImages: Buffer[] = [];
	const imageIds: Array<string> = [];
	try {
		for (const image of images) {
			const imageData = await image.arrayBuffer();
			const processedImage = await sharp(imageData)
				.resize({ height: 360, width: 640, fit: 'inside' })
				.webp({ quality: 90 })
				.toBuffer();
			processedImages.push(processedImage);
			imageIds.push(suuid.new());
		}
	} catch (e) {
		throw error(415, 'unsupported image format');
	}

	const eventData: NewEvent = {
		name: requestBodyEvent.name,
		description: requestBodyEvent.description,
		startDate: requestBodyEvent.startDate,
		endDate: requestBodyEvent.endDate,
		status: requestBodyEvent.status,
		category: requestBodyEvent.category,
		thumbnailId: thumbnailId,
		eventId: requestBodyEvent.eventId,
		ownerId: requestBodyEvent.ownerId,
		ownerType: requestBodyEvent.ownerType,
		terms: requestBodyEvent.terms,
		imageIds: imageIds,
		videoId: null
	};

	const newEvent = await db.insert(eventsTable).values(eventData).returning();

	if (requestBodyTicket) {
		const ticketData: NewEventTicket = {
			eventId: newEvent[0].eventId,
			price: requestBodyTicket.price,
			ticketsTotal: requestBodyTicket.ticketsTotal,
			ticketsAvailable: requestBodyTicket.ticketsAvailable,
			type: undefined
		};

		await db.insert(eventTicketsTable).values(ticketData);
	}

	let writeError;
	writeFile(
		`src/lib/uploads/images/events/thumbnail/${thumbnailId}.webp`,
		processedThumbnail,
		(err) => (writeError = err)
	);
	if (writeError) throw error(500, 'unable to save image, try again later');

	processedImages.map((processedImage) => {
		writeFile(
			`src/lib/uploads/images/events/pictures/${imageIds.pop()}.webp`,
			processedImage,
			(err) => (writeError = err)
		);
	});
	if (writeError) throw error(500, 'unable to save image, try again later');

	return jsonResponse(JSON.stringify(newEvent));
}) satisfies RequestHandler;
