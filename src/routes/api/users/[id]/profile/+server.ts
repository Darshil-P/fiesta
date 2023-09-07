import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { usersTable } from '$lib/server/schema';
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

	const users = await db
		.select()
		.from(usersTable)
    .where(eq(usersTable.userId, userId));

	if (users.length == 0) {
		throw error(404, 'User Not Found');
	}

	const userProfile = users[0];

	return jsonResponse(JSON.stringify(userProfile));
}) satisfies RequestHandler;
