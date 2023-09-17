import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import type { InferInsertModel } from 'drizzle-orm';
import { writeFile } from 'fs';
import joi from 'joi';
import sharp from 'sharp';
import shortUUID from 'short-uuid';

export const POST = (async ({ request }) => {
	type NewEvent = InferInsertModel<typeof eventsTable>;
	const formData = await request.formData();
	const requestBody = JSON.parse(formData.get('event') as string);
	const thumbnail = formData.get('thumbnail') as File;
	const images = formData.getAll('images') as File[];
	const suuid = shortUUID();

	const requestSchema = joi.object({
		name: joi.string().min(3).max(80).required(),
		description: joi.string().max(4000).required(),
		startDate: joi.date().min(Date.now()).required(),
		endDate: joi.date().min(joi.ref('startDate')).required(),
		status: joi.string(),
		category: joi.string(),
		userId: joi.number(),
		organizationId: joi.number(),
		terms: joi.string().max(4000)
	});
	const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

	if (!requestBody) throw error(400, 'must provide event details');
	if (!thumbnail) throw error(400, 'thumbnail required');
	if (!supportedImageTypes.includes(thumbnail.type)) throw error(415, 'unsupported image format');
	if (images.length > 0 && !images.every((image) => supportedImageTypes.includes(image.type))) {
		throw error(415, 'unsupported image format');
	}

	const { error: validationError } = requestSchema.validate(requestBody);

	if (validationError) {
		throw error(400, validationError.details[0].message);
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

	const eventData: NewEvent = requestBody;

	const newEvent = await db
		.insert(eventsTable)
		.values({ ...eventData, thumbnailId: thumbnailId, imageIds: imageIds })
		.returning();

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
