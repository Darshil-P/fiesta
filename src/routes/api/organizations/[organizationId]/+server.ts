import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { organizationsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().precision(0).required();

const selectOrganizationDetails = db
	.select({
		organizationId: organizationsTable.organizationId,
		name: organizationsTable.name,
		about: organizationsTable.about,
		verified: organizationsTable.verified,
		dateCreated: organizationsTable.dateCreated,
		logoId: organizationsTable.logoId,
		bannerId: organizationsTable.bannerId,
		owner: {
			userId: usersTable.userId,
			name: usersTable.name,
			avatarId: usersTable.avatarId
		}
	})
	.from(organizationsTable)
	.where(eq(organizationsTable.organizationId, sql.placeholder('organizationId')))
	.leftJoin(usersTable, eq(usersTable.userId, organizationsTable.ownerId))
	.prepare('select_organization_details');

export const GET = (async ({ params }) => {
	const organizationId = Number.parseInt(params.organizationId ?? '');

	const { error: validationError } = requestSchema.validate(organizationId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizationDetails = await selectOrganizationDetails.execute({ organizationId });

	if (organizationDetails.length == 0) {
		throw error(404, 'Organization Not Found');
	}

	const response = {
		...organizationDetails[0]
	};

	return jsonResponse(JSON.stringify(response));
}) satisfies RequestHandler;
