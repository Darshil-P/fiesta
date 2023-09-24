import { fileLocation, supportedImageTypes } from '$lib/server/constants';
import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventTicketsTable, eventsTable, subEventsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { sql, type InferInsertModel } from 'drizzle-orm';
import { writeFile } from 'fs';
import joi from 'joi';
import sharp from 'sharp';
import shortUUID from 'short-uuid';

type NewEvent = InferInsertModel<typeof eventsTable>;
type NewSubEvent = InferInsertModel<typeof subEventsTable>;
type NewEventTicket = InferInsertModel<typeof eventTicketsTable>;
const suuid = shortUUID();

const requestSchema = joi.object({
	event: joi
		.object({
			name: joi.string().min(3).max(80).required(),
			description: joi.string().max(4000).required(),
			ownerId: joi.number().precision(0).required(),
			ownerType: joi.string().valid('user', 'organization').required(),
			startDate: joi.date().min(Date.now()).required(),
			endDate: joi.date().min(joi.ref('startDate')).required(),
			status: joi.string(),
			category: joi.string(),
			venue: joi.string(),
			terms: joi.string().max(4000)
		})
		.required(),
	subEvents: joi.array().items(
		joi.object({
			name: joi.string().min(3).max(80).required(),
			description: joi.string().max(4000).required(),
			datetime: joi.date().iso().required(),
			categoryId: joi.number().precision(0),
			venue: joi.string()
		})
	),
	ticket: joi.object({
		price: joi.number().required(),
		ticketsTotal: joi.number().precision(0).required(),
		ticketsAvailable: joi.number().precision(0).max(joi.ref('ticketsTotal')).required(),
		type: joi.number().precision(0)
	})
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
		venue: sql.placeholder('venue'),
		thumbnailId: sql.placeholder('thumbnailId'),
		terms: sql.placeholder('terms'),
		imageIds: sql<string[]>`${sql.placeholder('imageIds')}`,
		videoId: sql.placeholder('videoId')
	})
	.returning()
	.prepare('insert_event');

const insertSubEvents = db
	.insert(subEventsTable)
	.values([
		{
			eventId: sql.placeholder('eventId'),
			name: sql.placeholder('name'),
			description: sql.placeholder('description'),
			categoryId: sql.placeholder('categoryId'),
			datetime: sql<Date>`${sql.placeholder('datetime')}`,
			venue: sql.placeholder('venue')
		}
	])
	.returning()
	.prepare('insert_sub_events');

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
	const requestBody = JSON.parse(formData.get('body') as string);
	const thumbnail = formData.get('thumbnail') as File;
	const images = formData.getAll('images') as File[];

	const { error: validationError } = requestSchema.validate(requestBody);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const { event, subEvents, ticket } = requestBody;

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
				.resize({ height: 720, width: 1280, fit: 'inside' })
				.webp({ quality: 90 })
				.toBuffer();
			processedImages.push(processedImage);
			imageIds.push(suuid.new());
		}
	} catch (e) {
		throw error(415, 'unsupported image format');
	}

	const eventData: NewEvent = {
		name: event.name,
		description: event.description,
		startDate: event.startDate,
		endDate: event.endDate,
		status: event.status,
		category: event.category,
		venue: event.venue,
		thumbnailId: thumbnailId,
		eventId: event.eventId,
		ownerId: event.ownerId,
		ownerType: event.ownerType,
		terms: event.terms,
		imageIds: imageIds,
		videoId: undefined
	};

	const newEvent = await insertEvent.execute(eventData);

	if (subEvents) {
		subEvents.forEach(async (subEvent: NewSubEvent) => {
			const subEventData: NewSubEvent = {
				eventId: newEvent[0].eventId,
				name: subEvent.name,
				description: subEvent.description,
				categoryId: subEvent.categoryId,
				datetime: subEvent.datetime,
				venue: subEvent.venue
			};

			await insertSubEvents.execute(subEventData);
		});
	}

	if (ticket) {
		const ticketData: NewEventTicket = {
			eventId: newEvent[0].eventId,
			price: ticket.price,
			ticketsTotal: ticket.ticketsTotal,
			ticketsAvailable: ticket.ticketsAvailable,
			type: ticket.type ?? 0
		};

		await insertEventTicket.execute(ticketData);
	}

	let writeError;
	writeFile(
		`${fileLocation.eventThumbnail}/${thumbnailId}`,
		processedThumbnail,
		(err) => (writeError = err)
	);
	if (writeError) throw error(500, 'unable to save image, try again later');

	processedImages.map((processedImage) => {
		writeFile(
			`${fileLocation.eventPictures}/${imageIds.pop()}`,
			processedImage,
			(err) => (writeError = err)
		);
	});
	if (writeError) throw error(500, 'unable to save image, try again later');

	return jsonResponse(JSON.stringify(newEvent));
}) satisfies RequestHandler;
