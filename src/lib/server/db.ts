import { DB_NAME, DB_PASSWORD, DB_USERNAME } from '$env/static/private';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const client = new pg.Client({
	host: 'db',
	port: 5432,
	user: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_NAME
});

await client.connect();
export const db = drizzle(client);
