import { sql } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	unique
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	userId: integer('user_id')
		.primaryKey()
		.references(() => userCredentialsTable.userId),
	name: text('name').notNull(),
	dateCreated: timestamp('date_created', { withTimezone: true })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const permissionsTable = pgTable(
	'permissions',
	{
		permissionId: serial('permission_id').primaryKey(),
		permission: text('permission').notNull()
	},
	(permissions) => {
		return {
			permissionUniqueIndex: unique().on(permissions.permission)
		};
	}
);

export const rolesTable = pgTable('roles', {
	roleId: serial('role_id').primaryKey(),
	organization_id: integer('organization_id')
		.notNull()
		.references(() => usersTable.userId),
	name: text('name').notNull()
});

export const rolePermissionsTable = pgTable(
	'role_permissions',
	{
		roleId: integer('role_id')
			.notNull()
			.references(() => rolesTable.roleId),
		permission_id: integer('permission_id')
			.notNull()
			.references(() => permissionsTable.permissionId)
	},
	(rolePermissions) => ({
		rolePermissionPrimaryKey: primaryKey(rolePermissions.roleId, rolePermissions.permission_id)
	})
);

export const organizationsTable = pgTable('organizations', {
	organizationId: serial('organization_id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	verified: boolean('verified').notNull().default(false)
});

export const membersTable = pgTable(
	'members',
	{
		memberId: serial('member_id').primaryKey(),
		userId: integer('user_id').notNull(),
		dateJoined: timestamp('date_joined', { withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(members) => {
		return {
			memberUserUniqueIndex: unique().on(members.memberId, members.userId)
		};
	}
);

export const memberRolesTable = pgTable(
	'member_roles',
	{
		memberId: integer('member_id')
			.notNull()
			.references(() => membersTable.memberId),
		roleId: integer('role_id')
			.notNull()
			.references(() => rolesTable.roleId)
	},
	(memberRoles) => ({
		memberRolePrimaryKey: primaryKey(memberRoles.memberId, memberRoles.roleId)
	})
);

export const eventsTable = pgTable(
	'events',
	{
		eventId: serial('event_id').primaryKey(),
		organizationId: integer('organization_id').references(() => organizationsTable.organizationId),
		isUserOrganized: boolean('is_user_organized').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		startDate: date('start_date').notNull(),
		endDate: date('end_date').notNull(),
		status: text('status').notNull()
	},
	(events) => ({
		organizationIdUniqueIndex: unique().on(events.organizationId)
	})
);

export const categoriesTable = pgTable(
	'categories',
	{
		categoryId: serial('category_id').primaryKey(),
		name: text('name').notNull()
	},
	(categories) => ({
		categoryNameUniqueIndex: unique().on(categories.name)
	})
);

export const subEventsTable = pgTable('sub_events', {
	subEventId: serial('sub_event_id').primaryKey(),
	eventId: integer('event_id')
		.notNull()
		.references(() => eventsTable.eventId),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categoriesTable.categoryId),
	name: text('name').notNull(),
	description: text('description')
});

export const userCredentialsTable = pgTable(
	'user_credentials',
	{
		userId: serial('user_id').primaryKey(),
		mobile: text('mobile').notNull(),
		email: text('email').notNull(),
		password: text('password').notNull()
	},
	(userCredentials) => ({
		mobileUnique: unique().on(userCredentials.mobile),
		emailUnique: unique().on(userCredentials.email)
	})
);

export const organizationMembersTable = pgTable(
	'organization_members',
	{
		organizationId: integer('organization_id').references(() => organizationsTable.organizationId),
		memberId: integer('member_id').references(() => membersTable.memberId),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.userId)
	},
	(organizationMembers) => ({
		organizationMemberPrimaryKey: primaryKey(
			organizationMembers.organizationId,
			organizationMembers.memberId
		),
		organizationUserUnique: unique().on(
			organizationMembers.organizationId,
			organizationMembers.userId
		)
	})
);

export const eventMembersTable = pgTable(
	'event_members',
	{
		eventId: integer('event_id').references(() => eventsTable.eventId),
		memberId: integer('member_id').references(() => membersTable.memberId),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.userId),
		isPermanent: boolean('is_permanent').notNull().default(false)
	},
	(eventMembers) => ({
		eventMemberPrimaryKey: primaryKey(eventMembers.eventId, eventMembers.memberId),
		eventUserUnique: unique().on(eventMembers.eventId, eventMembers.userId)
	})
);
