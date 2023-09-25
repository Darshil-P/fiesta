import { protectedRoutes } from '$lib/server/constants';
import { refreshTokens, verifyAccessToken } from '$lib/server/jwt';
import { error, type Handle, type HandleServerError } from '@sveltejs/kit';
import 'dotenv/config';
import { JsonWebTokenError } from 'jsonwebtoken';

export const handleError: HandleServerError = ({ error: err }) => {
	if (err instanceof Error) {
		if (err.message.includes('violates unique constraint')) {
			throw error(409, err.message);
		}
		if (err.message.includes('violates foreign key constraint')) {
			throw error(404, 'referring entity (id) does not exist');
		}

		console.log(err.stack);
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	if (!protectedRoutes.includes(event.route.id ?? '')) {
		return await resolve(event);
	}

	const accessToken = event.cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	try {
		const userId = verifyAccessToken(accessToken);
		event.locals.userId = userId;
	} catch (e) {
		if (e instanceof JsonWebTokenError && e.name == 'TokenExpiredError') {
			const refreshToken = event.cookies.get('refresh_token') as string;
			if (refreshToken) {
				try {
					const tokens = refreshTokens(accessToken, refreshToken);
					event.cookies.set('access_token', tokens.accessToken, { path: '/', secure: false });
					event.cookies.set('refresh_token', tokens.refreshToken, { path: '/', secure: false });
					event.locals.userId = verifyAccessToken(tokens.accessToken);
					return await resolve(event);
				} catch (e) {
					console.log('Token Refresh Failed:');
					console.log(e);
				}
			}
		}
		throw error(401, 'Unauthorized');
	}

	return await resolve(event);
};
