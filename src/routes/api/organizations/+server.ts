import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import type { InferInsertModel } from 'drizzle-orm';
import { writeFile } from 'fs';
import joi from 'joi';
import sharp from 'sharp';
import shortUUID from 'short-uuid';

export const POST = (async ({ request }) => {
	type NewOrganization = InferInsertModel<typeof organizationsTable>;
	const formData = await request.formData();
	const requestBody = JSON.parse(formData.get('organization') as string);
	const logo = formData.get('logo') as File;
	const banner = formData.get('banner') as File;
	const suuid = shortUUID();

	const requestSchema = joi.object({
		name: joi.string().min(3).max(80).required(),
		about: joi.string().max(4000).required()
	});

	const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

	if (!requestBody) throw error(400, 'must provide organization details');
	if (
		(logo && !supportedImageTypes.includes(logo.type)) ||
		(banner && !supportedImageTypes.includes(banner.type))
	) {
		throw error(415, 'unsupported image format');
	}

	const { error: validationError } = requestSchema.validate(requestBody);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	let processedLogo: Buffer | null = null;
	let logoId;
	if (logo) {
		logoId = suuid.new();
		try {
			const imageData = await logo.arrayBuffer();
			processedLogo = await sharp(imageData)
				.resize({ height: 360, width: 360 })
				.webp({ quality: 90 })
				.toBuffer();
		} catch (e) {
			throw error(415, 'unsupported image format');
		}
	}

	let processedBanner: Buffer | null = null;
	let bannerId;
	if (banner) {
		bannerId = suuid.new();
		try {
			const imageData = await banner.arrayBuffer();
			processedBanner = await sharp(imageData)
				.resize({
					height: 640,
					width: 1600,
					fit: 'cover',
					position: sharp.gravity.north
				})
				.webp({ quality: 90 })
				.toBuffer();
		} catch (e) {
			throw error(415, 'unsupported image format');
		}
	}

	const organizationData: NewOrganization = {
		name: requestBody.name,
		about: requestBody.about,
		logoId: logoId,
		bannerId: bannerId
	};

	const newOrganization = await db.insert(organizationsTable).values(organizationData).returning();

	if (logoId || bannerId) {
		let writeError;
		processedLogo &&
			writeFile(
				`src/lib/uploads/images/organizations/logo/${logoId}.webp`,
				processedLogo,
				(err) => (writeError = err)
			);
		if (writeError) throw error(500, 'unable to save image, try again later');

		processedBanner &&
			writeFile(
				`src/lib/uploads/images/organizations/banner/${bannerId}.webp`,
				processedBanner,
				(err) => (writeError = err)
			);
		if (writeError) throw error(500, 'unable to save image, try again later');
	}

	return jsonResponse(JSON.stringify(newOrganization));
}) satisfies RequestHandler;
