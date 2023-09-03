import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { userCredentialsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { InferModel } from 'drizzle-orm';
import joi from 'joi';

export const POST = (async ({ request }) => {
	type NewUser = Omit<InferModel<typeof usersTable, 'insert'>, 'dateCreated'>;
	type NewUserCredential = Omit<InferModel<typeof userCredentialsTable, 'insert'>, 'userId'>;
	const data = await request.json();

	const userSchema = joi.object({
		name: joi
			.string()
			.regex(/^[a-zA-Z ,.'-]{2,64}$/)
			.required(),
		email: joi.string().email().required(),
		mobile: joi
			.string()
			.regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
			.required(),
		password: joi
			.string()
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
			.required()
	});

	const { error: validationError } = userSchema.validate(data);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	data.password = await bcrypt.hash(data.password, 12);

	const newUserCredential: NewUserCredential = data;
	const newUser: NewUser = data;

	const userCredentials = await db
		.insert(userCredentialsTable)
		.values(newUserCredential)
		.returning();

	newUser.userId = userCredentials[0].userId;

	const users = await db.insert(usersTable).values(newUser).returning();

	return jsonResponse(JSON.stringify(users[0]), 201);
}) satisfies RequestHandler;
