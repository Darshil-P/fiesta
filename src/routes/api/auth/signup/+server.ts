import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '$lib/server/regex';
import { userCredentialsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { sql, type InferInsertModel } from 'drizzle-orm';
import joi from 'joi';

type NewUser = InferInsertModel<typeof usersTable>;
type NewUserCredential = InferInsertModel<typeof userCredentialsTable>;

const requestSchema = joi.object({
	name: joi.string().regex(NAME_REGEX).required(),
	email: joi.string().email().required(),
	mobile: joi.string().regex(PHONE_REGEX).required(),
	password: joi.string().regex(PASSWORD_REGEX).required()
});

const insertUserCredentials = db
	.insert(userCredentialsTable)
	.values({
		mobile: sql.placeholder('mobile'),
		email: sql.placeholder('email'),
		password: sql.placeholder('password')
	})
	.returning()
	.prepare('insert_user_credentials');

const insertUser = db
	.insert(usersTable)
	.values({
		userId: sql.placeholder('userId'),
		name: sql.placeholder('name')
	})
	.returning()
	.prepare('insert_user');

export const POST = (async ({ request }) => {
	const requestBody = await request.json();

	const { error: validationError } = requestSchema.validate(requestBody);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const { name, email, mobile, password: passwordText } = requestBody;
	const password = await bcrypt.hash(passwordText, 12);

	const newUserCredential: NewUserCredential = {
		mobile,
		email,
		password
	};
	const userCredentials = await insertUserCredentials.execute(newUserCredential);

	const newUser: NewUser = {
		userId: userCredentials[0].userId,
		name
	};
	const users = await insertUser.execute(newUser);

	return jsonResponse(JSON.stringify(users[0]), 201);
}) satisfies RequestHandler;
