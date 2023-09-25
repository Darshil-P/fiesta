import { jsonResponse } from '$lib/server/helper';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ cookies }) => {
	cookies.delete('access_token', { path: '/', secure: false });
	cookies.delete('refresh_token', { path: '/', secure: false });

	return jsonResponse(JSON.stringify('User Logged Out'));
}) satisfies RequestHandler;
