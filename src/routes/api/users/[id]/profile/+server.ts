import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().required();

const selectUserProfile = db
	.select()
	.from(usersTable)
	.where(eq(usersTable.userId, sql.placeholder('userId')))
	.prepare('select_user_profile');

export const GET = (async ({ params }) => {
	const userId = Number.parseInt(params.id ?? '');

	const { error: validationError } = requestSchema.validate(userId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const users = await selectUserProfile.execute({ userId });

	if (users.length == 0) {
		throw error(404, 'User Not Found');
	}

	const userProfile = users[0];

	return jsonResponse(JSON.stringify(userProfile));
}) satisfies RequestHandler;
