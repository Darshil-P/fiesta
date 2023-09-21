import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import {
	memberRolesTable,
	membersTable,
	organizationMembersTable,
	organizationsTable,
	rolesTable,
	usersTable
} from '$lib/server/schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import Joi from 'joi';

const requestSchema = Joi.number().required();

const selectOrganizationMembers = db
	.select({ membersTable, usersTable, roles: sql`json_agg(roles)` })
	.from(organizationsTable)
	.rightJoin(
		organizationMembersTable,
		eq(organizationsTable.organizationId, organizationMembersTable.organizationId)
	)
	.where(eq(organizationsTable.organizationId, sql.placeholder('organizationId')))
	.innerJoin(membersTable, eq(membersTable.memberId, organizationMembersTable.memberId))
	.innerJoin(usersTable, eq(usersTable.userId, membersTable.userId))
	.leftJoin(memberRolesTable, eq(memberRolesTable.memberId, membersTable.memberId))
	.innerJoin(rolesTable, eq(rolesTable.roleId, memberRolesTable.roleId))
	.groupBy(membersTable.memberId, usersTable.userId)
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

	const response = organizationMembers.map((member) => {
		return {
			...member.membersTable,
			...member.usersTable,
			roles: member.roles
		};
	});

	return jsonResponse(JSON.stringify(response));
}) satisfies RequestHandler;
