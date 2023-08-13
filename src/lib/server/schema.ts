import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const testTable = pgTable('test', {
	id: serial('id').primaryKey(),
	data: varchar('data', { length: 255 }).notNull()
});
