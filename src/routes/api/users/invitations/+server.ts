import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { eventInvitesTable, invitationsTable, organizationInvitesTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

const selectUserInvitations = db
	.select({
		invitationId: invitationsTable.invitationId,
		userId: invitationsTable.userId,
		inviter: invitationsTable.inviter,
		status: invitationsTable.status,
		eventId: eventInvitesTable.eventId,
		organizationId: organizationInvitesTable.organizationId
	})
	.from(invitationsTable)
	.where(eq(invitationsTable.userId, sql.placeholder('userId')))
	.leftJoin(eventInvitesTable, eq(eventInvitesTable.invitationId, invitationsTable.invitationId))
	.leftJoin(
		organizationInvitesTable,
		eq(organizationInvitesTable.invitationId, invitationsTable.invitationId)
	)
	.prepare('select_user_invites');

export const GET = (async ({ locals }) => {
	const userId = locals.userId;

	const userInvites = await selectUserInvitations.execute({ userId });

	if (userInvites.length == 0) {
		throw error(404, 'Invites Not Found');
	}

	return jsonResponse(JSON.stringify(userInvites));
}) satisfies RequestHandler;
