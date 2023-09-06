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

export const GET = (async ({ params }) => {
	const id = Number.parseInt(params.id ?? '');

	const requestSchema = Joi.number().required();

	const { error: validationError } = requestSchema.validate(id);

	if (validationError) {
		throw error(400, validationError.details[0].message);
	}

	const data = await db
		.select({ membersTable, usersTable, roles: sql`json_agg(roles)` })
		.from(organizationsTable)
		.rightJoin(
			organizationMembersTable,
			eq(organizationsTable.organizationId, organizationMembersTable.organizationId)
		)
		.innerJoin(membersTable, eq(membersTable.memberId, organizationMembersTable.memberId))
		.innerJoin(usersTable, eq(usersTable.userId, membersTable.userId))
		.leftJoin(memberRolesTable, eq(memberRolesTable.memberId, membersTable.memberId))
		.innerJoin(rolesTable, eq(rolesTable.roleId, memberRolesTable.roleId))
		.where(eq(organizationsTable.organizationId, id))
		.groupBy(membersTable.memberId, usersTable.userId);

	if (data.length == 0) {
		throw error(404, 'Organization Not Found');
	}

	const organizationMembers = data.map((member) => {
		return {
			...member.membersTable,
			...member.usersTable,
			roles: member.roles
		};
	});

	return jsonResponse(JSON.stringify(organizationMembers));
}) satisfies RequestHandler;
