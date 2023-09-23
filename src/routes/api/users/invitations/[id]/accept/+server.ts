import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	eventInvitesTable,
	eventMembersTable,
	invitationsTable,
	membersTable,
	organizationInvitesTable,
	organizationMembersTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';

import { and, eq, sql, type InferInsertModel } from 'drizzle-orm';
import joi from 'joi';

type NewMember = InferInsertModel<typeof membersTable>;
type NewEventMember = InferInsertModel<typeof eventMembersTable>;
type NewOrganizationMember = InferInsertModel<typeof organizationMembersTable>;

const requestSchema = joi.number().precision(0).required();

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
	.where(
		and(
			eq(invitationsTable.invitationId, sql.placeholder('invitationId')),
			eq(invitationsTable.userId, sql.placeholder('userId'))
		)
	)
	.leftJoin(eventInvitesTable, eq(eventInvitesTable.invitationId, invitationsTable.invitationId))
	.leftJoin(
		organizationInvitesTable,
		eq(organizationInvitesTable.invitationId, invitationsTable.invitationId)
	)
	.prepare('select_user_invite');

const selectEventMember = db
	.select({
		memberId: eventMembersTable.memberId
	})
	.from(eventMembersTable)
	.where(eq(eventMembersTable.userId, sql.placeholder('userId')))
	.prepare('select_invite_event_member');

const selectOrganizationMember = db
	.select({
		memberId: organizationMembersTable.memberId
	})
	.from(organizationMembersTable)
	.where(eq(organizationMembersTable.userId, sql.placeholder('userId')))
	.prepare('select_invite_organization_member');

const insertMember = db
	.insert(membersTable)
	.values({
		userId: sql.placeholder('userId')
	})
	.returning()
	.prepare('insert_member');

const insertEventMember = db
	.insert(eventMembersTable)
	.values({
		userId: sql.placeholder('userId'),
		memberId: sql.placeholder('memberId'),
		eventId: sql.placeholder('eventId')
	})
	.prepare('insert_event_member');

const insertOrganizationMember = db
	.insert(organizationMembersTable)
	.values({
		userId: sql.placeholder('userId'),
		memberId: sql.placeholder('memberId'),
		organizationId: sql.placeholder('organizationId')
	})
	.prepare('insert_organization_member');

const setInvitationStatusAccepted = db
	.update(invitationsTable)
	.set({
		status: 'accepted'
	})
	.where(eq(invitationsTable.invitationId, sql.placeholder('invitationId')))
	.prepare('set_invitation_status_accepted');

export const POST = (async ({ locals, params }) => {
	const invitationId = Number.parseInt(params.id ?? '');
	const userId = locals.userId;

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

	if (invite.eventId) {
		const member = await selectEventMember.execute({ userId });
		if (member.length != 0) throw error(400, 'user is already a member');
	} else {
		const member = await selectOrganizationMember.execute({ userId });
		if (member.length != 0) throw error(400, 'user is already a member');
	}

	const newMember: NewMember = {
		userId
	};
	const member = await insertMember.execute(newMember);

	const memberId = member[0].memberId;

	if (invite.eventId) {
		const newEventMember: NewEventMember = {
			userId,
			memberId,
			eventId: invite.eventId
		};
		await insertEventMember.execute(newEventMember);
	} else {
		const newOrganizationMember: NewOrganizationMember = {
			userId,
			memberId,
			organizationId: invite.organizationId
		};
		await insertOrganizationMember.execute(newOrganizationMember);
	}

	await setInvitationStatusAccepted.execute({ invitationId });

	return jsonResponse(JSON.stringify('Invitation Accepted'), 200);
}) satisfies RequestHandler;
