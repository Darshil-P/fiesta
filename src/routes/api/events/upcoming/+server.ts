import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, gt, sql } from 'drizzle-orm';

export const GET = (async () => {
	const data = await db
		.select()
		.from(eventsTable)
		.leftJoin(organizationsTable, eq(eventsTable.organizationId, organizationsTable.organizationId))
		.where(gt(eventsTable.startDate, sql`CURRENT_DATE`));

	if (data.length == 0) {
		throw error(404, 'No Events Found');
	}

	const eventDetails = data;

	return jsonResponse(JSON.stringify(eventDetails));
}) satisfies RequestHandler;
