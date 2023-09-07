import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { rolesTable } from '$lib/server/schema';
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

	const roles = await db
		.select()
		.from(rolesTable)
    .where(eq(rolesTable.organizationId, organizationId));

	if (roles.length == 0) {
		throw error(404, 'Roles Not Found');
	}

	const organizationRoles = roles;

	return jsonResponse(JSON.stringify(organizationRoles));
}) satisfies RequestHandler;
