import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, organizationsTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, gt, sql } from 'drizzle-orm';

const selectUpcomingEvents = db
	.select({
		eventId: eventsTable.eventId,
		name: eventsTable.name,
		startDate: eventsTable.startDate,
		endDate: eventsTable.endDate,
		status: eventsTable.status,
		category: eventsTable.category,
		thumbnailId: eventsTable.thumbnailId,
		ownerType: eventsTable.ownerType,
		organization: {
			organizationId: organizationsTable.organizationId,
			name: organizationsTable.name,
			verified: organizationsTable.verified
		},
		user: {
			userId: usersTable.userId,
			name: usersTable.name
		}
	})
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
	.where(gt(eventsTable.startDate, sql`CURRENT_DATE`))
	.prepare('select_upcoming_events');

export const GET = (async () => {
	const upcomingEvents = await selectUpcomingEvents.execute();

	if (upcomingEvents.length == 0) {
		throw error(404, 'No Events Found');
	}

	return jsonResponse(JSON.stringify(upcomingEvents));
}) satisfies RequestHandler;
