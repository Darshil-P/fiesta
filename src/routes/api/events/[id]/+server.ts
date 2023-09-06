import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	categoriesTable,
	eventsTable,
	organizationsTable,
	subEventsTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Joi from 'joi';

export const GET = (async ({ params }) => {
	const id = Number.parseInt(params.id ?? '');

	const eventSchema = Joi.number().required();

	const { error: validationError } = eventSchema.validate(id);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const data = await db
		.select()
		.from(eventsTable)
		.leftJoin(organizationsTable, eq(eventsTable.organizationId, organizationsTable.organizationId))
		.where(eq(eventsTable.eventId, id));

	const subEvents = await db
		.select()
		.from(subEventsTable)
		.innerJoin(categoriesTable, eq(subEventsTable.categoryId, categoriesTable.categoryId))
		.where(eq(subEventsTable.eventId, id));

	if (data.length == 0) {
		throw error(404, 'Event Not Found');
	}

	const eventDetails = {
		...data[0].events,
		organization: {
			...data[0].organizations
		},
		subEvents: subEvents.map((subEvent) => {
			return {
				...subEvent.sub_events,
				category: {
					...subEvent.categories
				}
			};
		})
	};

	return jsonResponse(JSON.stringify(eventDetails));
}) satisfies RequestHandler;
