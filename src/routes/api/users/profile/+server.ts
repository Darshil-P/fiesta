import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

const selectUserProfile = db
	.select()
	.from(usersTable)
	.where(eq(usersTable.userId, sql.placeholder('userId')))
	.prepare('select_user_profile');

export const GET = (async ({ locals }) => {
	const userId = locals.userId;

	const users = await selectUserProfile.execute({ userId });

	if (users.length == 0) {
		throw error(404, 'User Not Found');
	}

	const userProfile = users[0];

	return jsonResponse(JSON.stringify(userProfile));
}) satisfies RequestHandler;
