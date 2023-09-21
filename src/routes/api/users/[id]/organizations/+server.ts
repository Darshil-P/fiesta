import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationMembersTable, organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, or, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().required();

const selectUserOrganizations = db
	.select({
		organizationId: organizationsTable.organizationId,
		name: organizationsTable.name,
		verified: organizationsTable.verified,
		logoId: organizationsTable.logoId
	})
	.from(organizationsTable)
	.leftJoin(
		organizationMembersTable,
		eq(organizationMembersTable.organizationId, organizationsTable.organizationId)
	)
	.where(
		or(
			eq(organizationMembersTable.userId, sql.placeholder('userId')),
			eq(organizationsTable.ownerId, sql.placeholder('userId'))
		)
	)
	.prepare('select_user_organizations');

export const GET = (async ({ params }) => {
	const userId = Number.parseInt(params.id ?? '');

	const { error: validationError } = requestSchema.validate(userId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const userOrganizations = await selectUserOrganizations.execute({ userId });

	if (userOrganizations.length == 0) {
		throw error(404, 'Organizations Not Found');
	}

	return jsonResponse(JSON.stringify(userOrganizations));
}) satisfies RequestHandler;
