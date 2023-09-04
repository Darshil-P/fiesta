import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { PASSWORD_REGEX } from '$lib/server/regex';
import { userCredentialsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import joi from 'joi';

export const POST = (async ({ request }) => {
	const data = await request.json();

	const schema = joi.object({
		email: joi.string().email().required(),
		password: joi.string().regex(PASSWORD_REGEX).required()
	});

	const { error: validationError } = schema.validate(data);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const userCredentials = await db
		.select({ password: userCredentialsTable.password })
		.from(userCredentialsTable)
		.where(
			data.email
				? eq(userCredentialsTable.email, data.email)
				: eq(userCredentialsTable.mobile, data.mobile)
		);

	if (userCredentials.length == 0) {
		throw error(404, 'Email or Mobile not Registered');
	}

	const validPass = await bcrypt.compare(data.password, userCredentials[0].password);

	if (!validPass) {
		throw error(401, 'Incorrect Password');
	}

	return jsonResponse(JSON.stringify('User Authorized'));
}) satisfies RequestHandler;
