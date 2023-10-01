import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { invitationsTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';

import { and, eq, sql } from 'drizzle-orm';
import joi from 'joi';

const requestSchema = joi.number().precision(0).required();

const selectUserInvitations = db
	.select({
		invitationId: invitationsTable.invitationId,
		userId: invitationsTable.userId,
		status: invitationsTable.status
	})
	.from(invitationsTable)
	.where(
		and(
			eq(invitationsTable.invitationId, sql.placeholder('invitationId')),
			eq(invitationsTable.userId, sql.placeholder('userId'))
		)
	)
	.prepare('select_user_invite_status');

const setInvitationStatusRejected = db
	.update(invitationsTable)
	.set({
		status: 'rejected'
	})
	.where(eq(invitationsTable.invitationId, sql.placeholder('invitationId')))
	.prepare('set_invitation_status_rejected');

export const POST = (async ({ locals, params }) => {
	const invitationId = Number.parseInt(params.invitationId ?? '');
	const userId = locals.user.userId;

	const { error: validationError } = requestSchema.validate(invitationId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const userInvites = await selectUserInvitations.execute({ invitationId, userId });

	if (userInvites.length == 0) throw error(404, 'Invitation not found');

	const invite = userInvites[0];

	if (invite.status != 'pending') {
		throw error(400, 'This invitation has already been accepted / rejected');
	}

	await setInvitationStatusRejected.execute({ invitationId });

	return jsonResponse(JSON.stringify('Invitation Rejected'), 200);
}) satisfies RequestHandler;
