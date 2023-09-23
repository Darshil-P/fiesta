import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable, organizationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().precision(0).required();

const selectOrganizationEvents = db
	.select({
		eventId: eventsTable.eventId,
		ownerType: eventsTable.ownerType,
		name: eventsTable.name,
		startDate: eventsTable.startDate,
		endDate: eventsTable.endDate,
		status: eventsTable.status,
		category: eventsTable.category,
		thumbnailId: eventsTable.thumbnailId,
		organization: {
			organizationId: organizationsTable.organizationId,
			name: organizationsTable.name,
			verified: organizationsTable.verified
		}
	})
	.from(eventsTable)
	.where(
		and(
			eq(eventsTable.ownerType, 'organization'),
			eq(eventsTable.ownerId, sql.placeholder('organizationId'))
		)
	)
	.leftJoin(organizationsTable, eq(organizationsTable.organizationId, eventsTable.ownerId))
	.prepare('select_organization_events');

export const GET = (async ({ params }) => {
	const organizationId = Number.parseInt(params.organizationId ?? '');

	const { error: validationError } = requestSchema.validate(organizationId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizationEvents = await selectOrganizationEvents.execute({ organizationId });

	if (organizationEvents.length == 0) {
		throw error(404, 'Events Not Found');
	}

	return jsonResponse(JSON.stringify(organizationEvents));
}) satisfies RequestHandler;
