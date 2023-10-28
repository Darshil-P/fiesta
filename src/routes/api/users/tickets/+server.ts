import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, ticketsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, gt, sql } from 'drizzle-orm';

const selectUserTickets = db
	.select({
		ticketId: ticketsTable.ticketId,
		userId: ticketsTable.userId,
		eventId: ticketsTable.eventId,
		status: ticketsTable.status,
		transactionId: ticketsTable.transactionId,
		name: eventsTable.name,
		thumbnailId: eventsTable.thumbnailId,
		startDate: eventsTable.startDate,
		venue: eventsTable.venue
	})
	.from(ticketsTable)
	.where(
		and(
			eq(ticketsTable.userId, sql.placeholder('userId')),
			gt(eventsTable.endDate, sql`${new Date().toISOString().substring(0, 10)}`)
		)
	)
	.leftJoin(eventsTable, eq(eventsTable.eventId, ticketsTable.eventId))
	.prepare('select_user_tickets');

export const GET = (async ({ locals }) => {
	const userId = locals.user.userId;

	const userTickets = await selectUserTickets.execute({ userId });

	if (userTickets.length == 0) {
		throw error(404, 'Tickets Not Found');
	}

	return jsonResponse(JSON.stringify(userTickets));
}) satisfies RequestHandler;
