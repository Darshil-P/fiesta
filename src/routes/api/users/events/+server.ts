import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	categoriesTable,
	eventMembersTable,
	eventsTable,
	organizationsTable,
	usersTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, or, sql } from 'drizzle-orm';

const selectUserEvents = db
	.select({
		eventId: eventsTable.eventId,
		ownerType: eventsTable.ownerType,
		name: eventsTable.name,
		startDate: eventsTable.startDate,
		endDate: eventsTable.endDate,
		status: eventsTable.status,
		category: categoriesTable.name,
		thumbnailId: eventsTable.thumbnailId,
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
		eventMembersTable,
		and(
			eq(eventMembersTable.eventId, eventsTable.eventId),
			eq(eventMembersTable.userId, sql.placeholder('userId'))
		)
	)
	.leftJoin(
		usersTable,
		and(eq(eventsTable.ownerType, 'user'), eq(eventsTable.ownerId, usersTable.userId))
	)
	.leftJoin(
		organizationsTable,
		and(
			eq(eventsTable.ownerType, 'organization'),
			eq(organizationsTable.organizationId, eventsTable.ownerId)
		)
	)
	.where(
		or(
			eq(usersTable.userId, sql.placeholder('userId')),
			eq(eventMembersTable.userId, sql.placeholder('userId'))
		)
	)
	.leftJoin(categoriesTable, eq(categoriesTable.categoryId, eventsTable.categoryId))
	.prepare('select_user_events');

export const GET = (async ({ locals }) => {
	const userId = locals.user.userId;

	const userEvents = await selectUserEvents.execute({ userId });

	if (userEvents.length == 0) {
		throw error(404, 'Events Not Found');
	}

	return jsonResponse(JSON.stringify(userEvents));
}) satisfies RequestHandler;
