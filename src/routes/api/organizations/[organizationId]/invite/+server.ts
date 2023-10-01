import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	invitationsTable,
	organizationInvitesTable,
	userCredentialsTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';

import { eq, sql, type InferInsertModel } from 'drizzle-orm';
import joi from 'joi';

type NewInvitation = InferInsertModel<typeof invitationsTable>;
type NewOrganizationInvite = InferInsertModel<typeof organizationInvitesTable>;

const requestSchema = joi.object({
	organizationId: joi.number().precision(0).required(),
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

const insertOrganizationInvite = db
	.insert(organizationInvitesTable)
	.values({
		invitationId: sql.placeholder('invitationId'),
		organizationId: sql.placeholder('organizationId')
	})
	.prepare('insert_organization_invite');

export const POST = (async ({ request, locals, params }) => {
	const requestBody = await request.json();
	const organizationId = Number.parseInt(params.organizationId ?? '');
	const inviter = locals.user.userId;

	const { error: validationError } = requestSchema.validate({ organizationId, ...requestBody });
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

	const newOrganizationInvite: NewOrganizationInvite = {
		invitationId: invitation[0].invitationId,
		organizationId: organizationId
	};
	await insertOrganizationInvite.execute(newOrganizationInvite);

	return jsonResponse(JSON.stringify('Invitation Sent'), 201);
}) satisfies RequestHandler;
