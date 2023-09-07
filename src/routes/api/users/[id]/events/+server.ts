import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventMembersTable, eventsTable, organizationsTable, usersTable } from '$lib/server/schema';
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

	const events = await db
		.select({ eventsTable, organizationsTable })
		.from(eventsTable)
		.rightJoin(eventMembersTable, eq(eventMembersTable.eventId, eventsTable.eventId))
		.innerJoin(usersTable, eq(usersTable.userId, eventMembersTable.userId))
		.leftJoin(organizationsTable, eq(organizationsTable.organizationId, eventsTable.organizationId))
		.where(eq(usersTable.userId, userId));

	if (events.length == 0) {
		throw error(404, 'Events Not Found');
	}

	const userEvents = events.map((event) => {
		return {
			...event.eventsTable,
			organization: event.organizationsTable
		};
	});

	return jsonResponse(JSON.stringify(userEvents));
}) satisfies RequestHandler;
