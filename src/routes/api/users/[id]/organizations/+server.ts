import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationMembersTable, organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const userId = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(userId);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizations = await db
		.select({ organizationsTable })
		.from(organizationsTable)
		.innerJoin(
			organizationMembersTable,
			eq(organizationMembersTable.organizationId, organizationsTable.organizationId)
		)
		.where(eq(organizationMembersTable.userId, userId));

	if (organizations.length == 0) {
		throw error(404, 'Organizations Not Found');
	}

	const userEvents = organizations.map((organization) => {
		return organization.organizationsTable;
	});

	return jsonResponse(JSON.stringify(userEvents));
}) satisfies RequestHandler;
