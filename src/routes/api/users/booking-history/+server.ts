import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, ticketsTable, transactionsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

const selectUserBookings = db
	.select({
		ticketId: ticketsTable.ticketId,
		userId: ticketsTable.userId,
		eventId: ticketsTable.eventId,
		status: ticketsTable.status,
		name: eventsTable.name,
		thumbnailId: eventsTable.thumbnailId,
		startDate: eventsTable.startDate,
		venue: eventsTable.venue,
		transactionId: transactionsTable.transactionId,
		amount: transactionsTable.amount,
		timestamp: transactionsTable.timestamp,
		paymentMethod: transactionsTable.paymentMethod
	})
	.from(ticketsTable)
	.where(eq(ticketsTable.userId, sql.placeholder('userId')))
	.leftJoin(transactionsTable, eq(ticketsTable.transactionId, transactionsTable.transactionId))
	.leftJoin(eventsTable, eq(eventsTable.eventId, ticketsTable.eventId))
	.prepare('select_user_bookings');

export const GET = (async ({ locals }) => {
	const userId = locals.user.userId;

	const userBookings = await selectUserBookings.execute({ userId });

	if (userBookings.length == 0) {
		throw error(404, 'Tickets Not Found');
	}

	console.log(userBookings);

	return jsonResponse(JSON.stringify(userBookings));
}) satisfies RequestHandler;
