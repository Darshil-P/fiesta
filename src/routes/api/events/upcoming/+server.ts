import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, organizationsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, gt, sql } from 'drizzle-orm';

export const GET = (async () => {
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
		.where(gt(eventsTable.startDate, sql`CURRENT_DATE`));

	if (events.length == 0) {
		throw error(404, 'No Events Found');
	}

	const eventDetails = events;

	return jsonResponse(JSON.stringify(eventDetails));
}) satisfies RequestHandler;
