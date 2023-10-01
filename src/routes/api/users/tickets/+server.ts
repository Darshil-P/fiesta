import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { ticketsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

const selectUserTickets = db
	.select({
		ticketId: ticketsTable.ticketId,
		userId: ticketsTable.userId,
		eventId: ticketsTable.eventId,
		status: ticketsTable.status,
		transactionId: ticketsTable.transactionId
	})
	.from(ticketsTable)
	.where(eq(ticketsTable.userId, sql.placeholder('userId')))
	.prepare('select_user_tickets');

export const GET = (async ({ locals }) => {
	const userId = locals.user.userId;
	console.log(userId);

	const userTickets = await selectUserTickets.execute({ userId });

	if (userTickets.length == 0) {
		throw error(404, 'Tickets Not Found');
	}

	return jsonResponse(JSON.stringify(userTickets));
}) satisfies RequestHandler;
