import { PASSWORD_REGEX } from '$lib/constants';
import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { generateTokens } from '$lib/server/jwt';
import { userCredentialsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';
import joi from 'joi';

const requestSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().regex(PASSWORD_REGEX).required()
});

const selectUsersCredentials = db
	.select({ userId: userCredentialsTable.userId, password: userCredentialsTable.password })
	.from(userCredentialsTable)
	.where(
		sql.placeholder('email')
			? eq(sql`lower(${userCredentialsTable.email})`, sql`lower(${sql.placeholder('email')})`)
			: eq(userCredentialsTable.mobile, sql.placeholder('mobile'))
	)
	.prepare('select_user_credentials');

const selectUser = db
	.select({
		userId: usersTable.userId,
		name: usersTable.name,
		dateCreated: usersTable.dateCreated,
		avatarId: usersTable.avatarId
	})
	.from(usersTable)
	.where(eq(usersTable.userId, sql.placeholder('userId')))
	.prepare('select_user');

export const POST = (async ({ request, cookies }) => {
	const requestBody = await request.json();

	const { error: validationError } = requestSchema.validate(requestBody);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const { email, password } = requestBody;
	const userCredentials = await selectUsersCredentials.execute({ email, password });

	if (userCredentials.length == 0) {
		throw error(404, 'Email or Mobile not Registered');
	}

	const validPass = await bcrypt.compare(password, userCredentials[0].password);

	if (!validPass) {
		throw error(401, 'Incorrect Password');
	}

	const user = await selectUser.execute({ userId: userCredentials[0].userId });

	const { accessToken, refreshToken } = generateTokens({ user: user[0] });

	cookies.set('access_token', accessToken, { path: '/', secure: false });
	cookies.set('refresh_token', refreshToken, { path: '/', secure: false });

	return jsonResponse(JSON.stringify('User Authorized'));
}) satisfies RequestHandler;
