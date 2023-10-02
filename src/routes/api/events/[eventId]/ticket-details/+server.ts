import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventTicketsTable, eventsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().precision(0).required();

const selectTicketDetails = db
	.select({
		eventId: eventTicketsTable.eventId,
		price: eventTicketsTable.price,
		type: eventTicketsTable.type,
		ticketsTotal: eventTicketsTable.ticketsTotal,
		ticketsAvailable: eventTicketsTable.ticketsAvailable,
		name: eventsTable.name,
		startDate: eventsTable.startDate,
		venue: eventsTable.venue,
		terms: eventsTable.terms
	})
	.from(eventTicketsTable)
	.where(eq(eventTicketsTable.eventId, sql.placeholder('eventId')))
	.leftJoin(eventsTable, eq(eventsTable.eventId, sql.placeholder('eventId')))
	.prepare('select_event_ticket_etails');

export const GET = (async ({ params }) => {
	const eventId = Number.parseInt(params.eventId ?? '');

	const { error: validationError } = requestSchema.validate(eventId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const eventTicketDetails = await selectTicketDetails.execute({ eventId });

	if (eventTicketDetails.length == 0) {
		throw error(404, 'Event Not Found');
	}

	const response = eventTicketDetails[0];

	return jsonResponse(JSON.stringify(response));
}) satisfies RequestHandler;
