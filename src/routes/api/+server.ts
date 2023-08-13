import { db } from '$lib/server/db';
import { testTable } from '$lib/server/schema';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async () => {
	await db.insert(testTable).values({
		data: 'data'
	});
	return new Response(JSON.stringify('Done'));
}) satisfies RequestHandler;
