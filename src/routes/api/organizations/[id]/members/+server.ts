import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { membersTable, organizationMembersTable, usersTable } from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().required();

const selectOrganizationMembers = db
	.select({
		memberId: membersTable.memberId,
		userId: usersTable.userId,
		name: usersTable.name,
		avatarId: usersTable.avatarId
	})
	.from(organizationMembersTable)
	.where(eq(organizationMembersTable.organizationId, sql.placeholder('organizationId')))
	.leftJoin(membersTable, eq(membersTable.memberId, organizationMembersTable.memberId))
	.leftJoin(usersTable, eq(usersTable.userId, membersTable.userId))
	.prepare('select_organization_members');

export const GET = (async ({ params }) => {
	const organizationId = Number.parseInt(params.id ?? '');

	const { error: validationError } = requestSchema.validate(organizationId);
	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const organizationMembers = await selectOrganizationMembers.execute({ organizationId });

	if (organizationMembers.length == 0) {
		throw error(404, 'Members Not Found');
	}

	return jsonResponse(JSON.stringify(organizationMembers));
}) satisfies RequestHandler;
