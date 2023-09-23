import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventInvitesTable, invitationsTable, userCredentialsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';

import { eq, sql, type InferInsertModel } from 'drizzle-orm';
import joi from 'joi';

type NewInvitation = InferInsertModel<typeof invitationsTable>;
type NewEventInvite = InferInsertModel<typeof eventInvitesTable>;

const requestSchema = joi.object({
	eventId: joi.number().precision(0).required(),
	email: joi.string().email().required()
});

const selectUserCredentials = db
	.select({
		userId: userCredentialsTable.userId
	})
	.from(userCredentialsTable)
	.where(eq(userCredentialsTable.email, sql.placeholder('email')))
	.prepare('select_inviting_user');

const insertInvitation = db
	.insert(invitationsTable)
	.values({
		userId: sql.placeholder('userId'),
		inviter: sql.placeholder('inviter')
	})
	.returning()
	.prepare('insert_invitation');

const insertEventInvite = db
	.insert(eventInvitesTable)
	.values({
		invitationId: sql.placeholder('invitationId'),
		eventId: sql.placeholder('eventId')
	})
	.prepare('insert_event_invite');

export const POST = (async ({ request, locals, params }) => {
	const requestBody = await request.json();
	const eventId = Number.parseInt(params.eventId ?? '');
	const inviter = locals.userId;

	const { error: validationError } = requestSchema.validate({ eventId, ...requestBody });
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const email = requestBody.email;

	const users = await selectUserCredentials.execute({ email });

	if (users.length == 0) {
		throw error(404, 'user not found');
	}

	const userId = users[0].userId;

	if (userId == inviter) throw error(400, 'cannot invite yourself');

	const newInvitation: NewInvitation = {
		userId,
		inviter
	};
	const invitation = await insertInvitation.execute(newInvitation);

	const newEventInvite: NewEventInvite = {
		invitationId: invitation[0].invitationId,
		eventId: eventId
	};
	await insertEventInvite.execute(newEventInvite);

	return jsonResponse(JSON.stringify('Invitation Sent'), 201);
}) satisfies RequestHandler;
