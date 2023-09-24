import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	categoriesTable,
	eventTicketsTable,
	eventsTable,
	organizationsTable,
	subEventsTable,
	usersTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().precision(0).required();

const selectEventDetails = db
	.select({
		eventId: eventsTable.eventId,
		ownerId: eventsTable.ownerId,
		ownerType: eventsTable.ownerType,
		name: eventsTable.name,
		description: eventsTable.description,
		startDate: eventsTable.startDate,
		endDate: eventsTable.endDate,
		status: eventsTable.status,
		venue: eventsTable.venue,
		ticketPrice: eventTicketsTable.price,
		category: eventsTable.category,
		terms: eventsTable.terms,
		thumbnailId: eventsTable.thumbnailId,
		imageIds: eventsTable.imageIds,
		videoId: eventsTable.videoId,
		organization: {
			organizationId: organizationsTable.organizationId,
			name: organizationsTable.name,
			ownerId: organizationsTable.ownerId,
			about: organizationsTable.about,
			verified: organizationsTable.verified,
			logoId: organizationsTable.logoId,
			bannerId: organizationsTable.bannerId
		},
		user: {
			userId: usersTable.userId,
			name: usersTable.name,
			dateCreated: usersTable.dateCreated,
			avatarId: usersTable.avatarId
		}
	})
	.from(eventsTable)
	.where(eq(eventsTable.eventId, sql.placeholder('eventId')))
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
	.leftJoin(eventTicketsTable, eq(eventTicketsTable.eventId, eventsTable.eventId))
	.prepare('select_event_details');

const selectSubEvents = db
	.select({
		name: subEventsTable.name,
		description: subEventsTable.description,
		subEventId: subEventsTable.subEventId,
		dateTime: subEventsTable.datetime,
		category: {
			categoryId: categoriesTable.categoryId,
			name: categoriesTable.name
		}
	})
	.from(subEventsTable)
	.where(eq(subEventsTable.eventId, sql.placeholder('eventId')))
	.leftJoin(categoriesTable, eq(categoriesTable.categoryId, subEventsTable.categoryId))
	.prepare('select_sub_events');

export const GET = (async ({ params }) => {
	const eventId = Number.parseInt(params.eventId ?? '');

	const { error: validationError } = requestSchema.validate(eventId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const eventDetails = await selectEventDetails.execute({ eventId });

	if (eventDetails.length == 0) {
		throw error(404, 'Event Not Found');
	}

	const subEvents = await selectSubEvents.execute({ eventId });

	const response = {
		...eventDetails[0],
		subEvents: subEvents
	};

	return jsonResponse(JSON.stringify(response));
}) satisfies RequestHandler;
