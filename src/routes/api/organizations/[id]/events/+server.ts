import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const organizationId = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(organizationId);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const events = await db
		.select()
		.from(eventsTable)
		.where(and(eq(eventsTable.ownerType, 'organization'), eq(eventsTable.ownerId, organizationId)));

	if (events.length == 0) {
		throw error(404, 'Events Not Found');
	}

	const organizationEvents = events;

	return jsonResponse(JSON.stringify(organizationEvents));
}) satisfies RequestHandler;
