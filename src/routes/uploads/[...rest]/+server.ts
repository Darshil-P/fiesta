import { error, type RequestHandler } from '@sveltejs/kit';
import { promises as fs } from 'fs';

export const GET = (async ({ params }) => {
	const path = params.rest;
	try {
		const asset = await fs.readFile(`src/lib/uploads/${path}`);
		return new Response(asset, {
			headers: {
				'Content-Type': 'image/webp'
			}
		});
	} catch (_) {
		throw error(404, 'Image Not Found');
	}
}) satisfies RequestHandler;
