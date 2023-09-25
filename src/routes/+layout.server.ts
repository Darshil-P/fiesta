import { verifyAccessToken } from '$lib/server/jwt';
import type { LayoutServerLoad } from './api/$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');

	try {
		const userId = verifyAccessToken(accessToken ?? '');
		return { userId };
	} catch (e) {
		return { userId: null };
	}
};
