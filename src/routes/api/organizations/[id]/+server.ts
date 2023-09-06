import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const organizationId = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(organizationId);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizations = await db
		.select()
		.from(organizationsTable)
		.where(eq(organizationsTable.organizationId, organizationId));

	if (organizations.length == 0) {
		throw error(404, 'Organization Not Found');
	}

	const organizationDetails = organizations[0];

	return jsonResponse(JSON.stringify(organizationDetails));
}) satisfies RequestHandler;
