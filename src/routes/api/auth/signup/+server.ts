import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '$lib/server/regex';
import { userCredentialsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { InferModel } from 'drizzle-orm';
import joi from 'joi';

export const POST = (async ({ request }) => {
	type NewUser = Omit<InferModel<typeof usersTable, 'insert'>, 'dateCreated'>;
	type NewUserCredential = Omit<InferModel<typeof userCredentialsTable, 'insert'>, 'userId'>;
	const requestBody = await request.json();

	const requestSchema = joi.object({
		name: joi.string().regex(NAME_REGEX).required(),
		email: joi.string().email().required(),
		mobile: joi.string().regex(PHONE_REGEX).required(),
		password: joi.string().regex(PASSWORD_REGEX).required()
	});

	const { error: validationError } = requestSchema.validate(requestBody);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	requestBody.password = await bcrypt.hash(requestBody.password, 12);

	const newUserCredential: NewUserCredential = requestBody;
	const newUser: NewUser = requestBody;

	const userCredentials = await db
		.insert(userCredentialsTable)
		.values(newUserCredential)
		.returning();

	newUser.userId = userCredentials[0].userId;

	const users = await db.insert(usersTable).values(newUser).returning();

	return jsonResponse(JSON.stringify(users[0]), 201);
}) satisfies RequestHandler;
