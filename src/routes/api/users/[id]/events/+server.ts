import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventMembersTable, eventsTable, organizationsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const userId = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(userId);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const events = await db
		.select({ eventsTable })
		.from(eventsTable)
		.leftJoin(eventMembersTable, eq(eventMembersTable.eventId, eventsTable.eventId))
		.innerJoin(
			usersTable,
			or(
				eq(usersTable.userId, eventMembersTable.userId),
				and(eq(eventsTable.ownerType, 'user'), eq(eventsTable.ownerId, usersTable.userId))
			)
		)
		.leftJoin(
			organizationsTable,
			and(
				eq(eventsTable.ownerType, 'user'),
				eq(organizationsTable.organizationId, eventsTable.ownerId)
			)
		)
		.where(eq(usersTable.userId, userId));

	if (events.length == 0) {
		throw error(404, 'Events Not Found');
	}

	const userEvents = events.map((event) => {
		return event.eventsTable;
	});

	return jsonResponse(JSON.stringify(userEvents));
}) satisfies RequestHandler;
