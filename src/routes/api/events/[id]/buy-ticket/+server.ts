import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	eventsTable,
	eventTicketsTable,
	ticketsTable,
	transactionsTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, type InferInsertModel } from 'drizzle-orm';
import joi from 'joi';

const requestSchema = joi.object({
	eventId: joi.number().precision(0).required(),
	paymentMethod: joi.string().required(),
	subEventIds: joi.array()
});

type NewTransaction = InferInsertModel<typeof transactionsTable>;
type NewTicket = InferInsertModel<typeof ticketsTable>;

const selectEventStatus = db
	.select({
		eventId: eventsTable.eventId,
		status: eventsTable.status
	})
	.from(eventsTable)
	.where(eq(eventsTable.eventId, sql.placeholder('eventId')))
	.prepare('select_event_status');

const selectEventTicket = db
	.select({
		eventId: eventTicketsTable.eventId,
		price: eventTicketsTable.price,
		type: eventTicketsTable.type,
		ticketsTotal: eventTicketsTable.ticketsTotal,
		ticketsAvailable: eventTicketsTable.ticketsAvailable
	})
	.from(eventTicketsTable)
	.where(eq(eventTicketsTable.eventId, sql.placeholder('eventId')))
	.prepare('select_event_ticket');

const insertTransaction = db
	.insert(transactionsTable)
	.values({
		amount: sql.placeholder('amount'),
		paymentMethod: sql.placeholder('paymentMethod')
	})
	.returning()
	.prepare('insert_transaction');

const insertTicket = db
	.insert(ticketsTable)
	.values({
		userId: sql.placeholder('userId'),
		eventId: sql.placeholder('eventId'),
		status: sql.placeholder('status'),
		transactionId: sql.placeholder('transactionId'),
		subEventIds: sql<number[]>`${sql.placeholder('subEventIds')}`
	})
	.prepare('insert_ticket');

const setTicketAvailability = db
	.update(eventTicketsTable)
	.set({
		ticketsAvailable: sql<number>`${sql.placeholder('ticketsAvailable')}`
	})
	.where(eq(eventTicketsTable.eventId, sql.placeholder('eventId')))
	.prepare('set_ticket_availability');

const setEventStatusSold = db
	.update(eventsTable)
	.set({
		status: 'soldout'
	})
	.where(eq(eventsTable.eventId, sql.placeholder('eventId')))
	.prepare('set_event_status_sold');

export const POST = (async ({ request, params, locals }) => {
	const userId = locals.userId;
	const eventId = Number.parseInt(params.id ?? '');
	const requestBody = await request.json();

	const { error: validationError } = requestSchema.validate({ eventId, ...requestBody });
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const { paymentMethod, subEventIds } = requestBody;

	const event = await selectEventStatus.execute({ eventId });
	if (event.length == 0) throw error(400, 'event not found');
	if (event[0].status != 'selling') throw error(400, 'event is currently not selling any tickets');

	const eventTicket = (await selectEventTicket.execute({ eventId }))[0];
	if (eventTicket.ticketsAvailable <= 0) {
		await setEventStatusSold.execute({ eventId });
		throw error(410, 'tickets unavailable / sold-out');
	}

	const newTransaction: NewTransaction = {
		amount: eventTicket.price,
		paymentMethod: paymentMethod
	};
	const transaction = (await insertTransaction.execute(newTransaction))[0];

	const newTicket: NewTicket = {
		eventId: eventId,
		userId: userId,
		status: 'booked',
		transactionId: transaction.transactionId,
		subEventIds: subEventIds ?? []
	};
	await insertTicket.execute(newTicket);

	const ticketsAvailable = eventTicket.ticketsAvailable - 1;

	if (ticketsAvailable <= 0) {
		await setEventStatusSold.execute({ eventId });
	}

	await setTicketAvailability.execute({ eventId, ticketsAvailable });

	return jsonResponse(JSON.stringify('Ticked Booked'));
}) satisfies RequestHandler;
