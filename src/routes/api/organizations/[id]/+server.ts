import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const id = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(id);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizationDetails = await db
		.select()
		.from(organizationsTable)
		.where(eq(organizationsTable.organizationId, id));

	if (organizationDetails.length == 0) {
		throw error(404, 'Organization Not Found');
	}

	return jsonResponse(JSON.stringify(organizationDetails[0]));
}) satisfies RequestHandler;
