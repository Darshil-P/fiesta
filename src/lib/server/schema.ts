import { sql } from 'drizzle-orm';
import {
	boolean,
	customType,
	date,
	doublePrecision,
	integer,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	unique
} from 'drizzle-orm/pg-core';

export const identity = (name: string) =>
	customType<{
		data: number;
		notNull: true;
		default: true;
	}>({
		dataType() {
			return 'INTEGER GENERATED ALWAYS AS IDENTITY';
		}
	})(name);

export const usersTable = pgTable('users', {
	userId: integer('user_id')
		.primaryKey()
		.references(() => userCredentialsTable.userId),
	name: text('name').notNull(),
	dateCreated: timestamp('date_created', { withTimezone: true })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	avatarId: text('avatar_id')
});

export const ticketsTable = pgTable('tickets', {
	ticketId: identity('ticket_id').notNull().primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => usersTable.userId),
	eventId: integer('event_id')
		.notNull()
		.references(() => eventsTable.eventId),
	transactionId: integer('transaction_id')
		.notNull()
		.unique()
		.references(() => transactionsTable.transactionId),
	subEventIds: integer('sub_event_ids').array().default([]),
	status: text('status').notNull()
});

export const transactionsTable = pgTable('transactions', {
	transactionId: identity('transaction_id').notNull().primaryKey(),
	amount: doublePrecision('amount').notNull(),
	timestamp: timestamp('timestamp', { withTimezone: true })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	paymentMethod: text('payment_method').notNull()
});

export const permissionsTable = pgTable(
	'permissions',
	{
		permissionId: identity('permission_id').notNull().primaryKey(),
		permission: text('permission').notNull()
	},
	(permissions) => {
		return {
			permissionUniqueIndex: unique().on(permissions.permission)
		};
	}
);

export const rolesTable = pgTable('roles', {
	roleId: identity('role_id').notNull().primaryKey(),
	organizationId: integer('organization_id')
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
	organizationId: identity('organization_id').notNull().primaryKey(),
	ownerId: integer('owner_id')
		.references(() => usersTable.userId)
		.notNull(),
	name: text('name').notNull(),
	about: text('about').notNull(),
	verified: boolean('verified').notNull().default(false),
	dateCreated: timestamp('date_created', { withTimezone: true })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	logoId: text('logo_id'),
	bannerId: text('banner_id')
});

export const membersTable = pgTable(
	'members',
	{
		memberId: identity('member_id').notNull().primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.userId),
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

export const eventsTable = pgTable('events', {
	eventId: identity('event_id').notNull().primaryKey(),
	ownerId: integer('owner_id').notNull(),
	ownerType: text('owner_type').notNull().$type<'user' | 'organization'>(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	status: text('status').notNull(),
	venue: text('venue').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categoriesTable.categoryId),
	terms: text('terms'),
	thumbnailId: text('thumbnail_id').notNull(),
	imageIds: text('image_ids').array().notNull().default([]),
	videoId: text('video_id')
});

export const categoriesTable = pgTable(
	'categories',
	{
		categoryId: identity('category_id').notNull().primaryKey(),
		name: text('name').notNull()
	},
	(categories) => ({
		categoryNameUniqueIndex: unique().on(categories.name)
	})
);

export const subEventsTable = pgTable('sub_events', {
	subEventId: identity('sub_event_id').notNull().primaryKey(),
	eventId: integer('event_id')
		.notNull()
		.references(() => eventsTable.eventId),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categoriesTable.categoryId),
	datetime: timestamp('datetime', { withTimezone: true }).notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	venue: text('venue')
});

export const userCredentialsTable = pgTable(
	'user_credentials',
	{
		userId: identity('user_id').notNull().primaryKey(),
		mobile: text('mobile').notNull(),
		email: text('email').notNull(),
		password: text('password').notNull()
	},
	(userCredentials) => ({
		mobileUnique: unique().on(userCredentials.mobile),
		emailUnique: unique().on(userCredentials.email)
	})
);

export const eventTicketsTable = pgTable('event_tickets', {
	eventId: integer('event_id')
		.references(() => eventsTable.eventId)
		.primaryKey(),
	price: doublePrecision('price').notNull(),
	type: smallint('type').notNull().default(0),
	ticketsTotal: integer('tickets_total').notNull(),
	ticketsAvailable: integer('tickets_available').notNull()
});

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
		),
		organizationMemberUnique: unique().on(organizationMembers.memberId)
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
		eventUserUnique: unique().on(eventMembers.eventId, eventMembers.userId),
		eventMemberUnique: unique().on(eventMembers.memberId)
	})
);

export const eventInvitesTable = pgTable(
	'event_invites',
	{
		invitationId: integer('invitation_id')
			.notNull()
			.references(() => invitationsTable.invitationId),
		eventId: integer('event_id')
			.notNull()
			.references(() => eventsTable.eventId)
	},
	(eventInvites) => ({
		eventInvitesPrimaryKey: primaryKey(eventInvites.invitationId, eventInvites.eventId)
	})
);

export const invitationsTable = pgTable('invitations', {
	invitationId: identity('invitation_id').notNull().primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => usersTable.userId),
	inviter: integer('inviter')
		.notNull()
		.references(() => usersTable.userId),
	status: text('status').notNull().default('pending')
});

export const organizationInvitesTable = pgTable(
	'organization_invites',
	{
		invitationId: integer('invitation_id')
			.notNull()
			.references(() => invitationsTable.invitationId),
		organizationId: integer('organization_id')
			.notNull()
			.references(() => organizationsTable.organizationId)
	},
	(organizationInvites) => ({
		organizationInvitesPrimaryKey: primaryKey(
			organizationInvites.invitationId,
			organizationInvites.organizationId
		)
	})
);
