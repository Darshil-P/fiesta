import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, eventTicketsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { sql, type InferInsertModel } from 'drizzle-orm';
import { writeFile } from 'fs';
import joi from 'joi';
import sharp from 'sharp';
import shortUUID from 'short-uuid';

type NewEvent = InferInsertModel<typeof eventsTable>;
type NewEventTicket = InferInsertModel<typeof eventTicketsTable>;
const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
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

const insertEvent = db
	.insert(eventsTable)
	.values({
		ownerId: sql.placeholder('ownerId'),
		ownerType: sql.placeholder('ownerType'),
		name: sql.placeholder('name'),
		description: sql.placeholder('description'),
		startDate: sql.placeholder('startDate'),
		endDate: sql.placeholder('endDate'),
		status: sql.placeholder('status'),
		category: sql.placeholder('category'),
		thumbnailId: sql.placeholder('thumbnailId'),
		terms: sql.placeholder('terms'),
		imageIds: sql<string[]>`${sql.placeholder('imageIds')}`,
		videoId: sql.placeholder('videoId')
	})
	.returning()
	.prepare('insert_event');

const insertEventTicket = db
	.insert(eventTicketsTable)
	.values({
		eventId: sql.placeholder('eventId'),
		price: sql.placeholder('price'),
		ticketsTotal: sql.placeholder('ticketsTotal'),
		ticketsAvailable: sql.placeholder('ticketsAvailable'),
		type: sql.placeholder('type')
	})
	.prepare('insert_event_ticket');

export const POST = (async ({ request }) => {
	const formData = await request.formData();
	const requestBodyEvent = JSON.parse(formData.get('event') as string);
	const requestBodyTicket = JSON.parse(formData.get('ticket') as string);
	const thumbnail = formData.get('thumbnail') as File;
	const images = formData.getAll('images') as File[];

	if (!requestBodyEvent) {
		throw error(400, 'must provide event details');
	}

	let { error: validationError } = requestSchemaEvent.validate(requestBodyEvent);
	if (!validationError && requestBodyTicket) {
		validationError = requestSchemaTicket.validate(requestBodyTicket).error;
	}
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	if (!thumbnail) throw error(400, 'thumbnail required');
	if (!supportedImageTypes.includes(thumbnail.type)) {
		throw error(415, 'unsupported image format');
	}
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
		videoId: undefined
	};

	const newEvent = await insertEvent.execute(eventData);

	if (requestBodyTicket) {
		const ticketData: NewEventTicket = {
			eventId: newEvent[0].eventId,
			price: requestBodyTicket.price,
			ticketsTotal: requestBodyTicket.ticketsTotal,
			ticketsAvailable: requestBodyTicket.ticketsAvailable,
			type: requestBodyTicket.type ?? 0
		};

		await insertEventTicket.execute(ticketData);
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
