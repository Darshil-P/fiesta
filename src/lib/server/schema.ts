import { sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	userId: serial('user_id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	dateCreated: timestamp('date_created', { withTimezone: true })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});
