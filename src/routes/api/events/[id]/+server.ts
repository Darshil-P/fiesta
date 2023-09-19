import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	categoriesTable,
	eventsTable,
	organizationsTable,
	subEventsTable,
	usersTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const eventId = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(eventId);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const events = await db
		.select()
		.from(eventsTable)
		.leftJoin(
			organizationsTable,
			and(
				eq(eventsTable.ownerType, 'organization'),
				eq(eventsTable.ownerId, organizationsTable.organizationId)
			)
		)
		.leftJoin(
			usersTable,
			and(eq(eventsTable.ownerType, 'user'), eq(eventsTable.ownerId, usersTable.userId))
		)
		.where(eq(eventsTable.eventId, eventId));

	const subEvents = await db
		.select()
		.from(subEventsTable)
		.innerJoin(categoriesTable, eq(subEventsTable.categoryId, categoriesTable.categoryId))
		.where(eq(subEventsTable.eventId, eventId));

	if (events.length == 0) {
		throw error(404, 'Event Not Found');
	}

	const eventDetails = {
		...events[0].events,
		organization: events[0].organizations,
		user: events[0].users,
		subEvents: subEvents.map((subEvent) => {
			return {
				...subEvent.sub_events,
				category: subEvent.categories
			};
		})
	};

	return jsonResponse(JSON.stringify(eventDetails));
}) satisfies RequestHandler;
