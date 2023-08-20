import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, type InferModel } from 'drizzle-orm';
import joi from 'joi';

export const GET = (async ({ url }) => {
	const userId = Number(url.searchParams.get('id'));

	if (Number.isNaN(userId) || !Number.isInteger(userId) || userId == 0) {
		throw error(400, 'Required parameter "id" must be an integer');
	}

	const users = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.userId, Number(userId)));

	if (users.length == 0) {
		throw error(404, 'User not found');
	}

	return jsonResponse(JSON.stringify(users));
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	type NewUser = Omit<InferModel<typeof usersTable, 'insert'>, 'id' | 'dateCreated'>;
	const newUser: NewUser = await request.json();

	const userSchema = joi.object({
		name: joi.string().alphanum().min(2).max(64).required(),
		email: joi.string().email().required()
	});

	const { error: validationError } = userSchema.validate(newUser);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const users = await db.insert(usersTable).values(newUser).returning();

	return jsonResponse(JSON.stringify(users), 201);
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
	const userId = Number(url.searchParams.get('id'));

	if (Number.isNaN(userId) || !Number.isInteger(userId) || userId == 0) {
		throw error(400, 'Required parameter "id" must be an integer');
	}

	await db.delete(usersTable).where(eq(usersTable.userId, Number(userId)));

	return new Response(JSON.stringify(`Deleted User ${userId}`));
}) satisfies RequestHandler;
