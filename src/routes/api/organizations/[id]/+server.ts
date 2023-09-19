import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationsTable, usersTable } from '$lib/server/schema';
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

	const organization = await db
		.select({ organizationsTable, usersTable })
		.from(organizationsTable)
		.where(eq(organizationsTable.organizationId, organizationId))
		.leftJoin(usersTable, eq(usersTable.userId, organizationsTable.ownerId));

	if (organization.length == 0) {
		throw error(404, 'Organization Not Found');
	}

	const organizationDetails = {
		...organization[0].organizationsTable,
		owner: organization[0].usersTable
	};

	return jsonResponse(JSON.stringify(organizationDetails));
}) satisfies RequestHandler;
