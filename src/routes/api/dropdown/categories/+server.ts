import { db } from '$lib/server/db';
import { jsonResponse } from '$lib/server/helper';
import { categoriesTable } from '$lib/server/schema';
import type { RequestHandler } from '@sveltejs/kit';

const selectCategories = db
	.select({
		categoryId: categoriesTable.categoryId,
		name: categoriesTable.name
	})
	.from(categoriesTable)
	.prepare('select_categories');

export const GET = (async () => {
	const categories = await selectCategories.execute();

	return jsonResponse(JSON.stringify(categories));
}) satisfies RequestHandler;
