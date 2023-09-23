import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { rolesTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().precision(0).required();

const selectOrganizationRoles = db
	.select()
	.from(rolesTable)
	.where(eq(rolesTable.organizationId, sql.placeholder('organizationId')))
	.prepare('select_organization_roles');

export const GET = (async ({ params }) => {
	const organizationId = Number.parseInt(params.organizationId ?? '');

	const { error: validationError } = requestSchema.validate(organizationId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizationRoles = await selectOrganizationRoles.execute({ organizationId });

	if (organizationRoles.length == 0) {
		throw error(404, 'Roles Not Found');
	}

	return jsonResponse(JSON.stringify(organizationRoles));
}) satisfies RequestHandler;
