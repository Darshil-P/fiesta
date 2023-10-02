import { protectedRoutes } from '$lib/server/constants';
import { refreshTokens, verifyAccessToken } from '$lib/server/jwt';
import { error, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const handleError: HandleServerError = ({ error: err, event }) => {
	if (err instanceof Error) {
		if (event.route.id?.startsWith('/api/')) {
			if (err.message.includes('violates unique constraint')) {
				throw error(409, err.message);
			}
			if (err.message.includes('violates foreign key constraint')) {
				throw error(404, 'referring entity (id) does not exist');
			}

			console.log(err.message);
		}

		if (err.message.includes('Not found')) {
			throw redirect(303, '/');
		}

		console.log(err.stack);
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('access_token');

	if (!protectedRoutes.includes(event.route.id ?? '')) {
		if (!accessToken) {
			return await resolve(event);
		}

		try {
			const user = verifyAccessToken(accessToken);
			event.locals.user = user;
		} catch (e) {
			return await resolve(event);
		}
	}

	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	try {
		const user = verifyAccessToken(accessToken);
		event.locals.user = user;
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError && e.name == 'TokenExpiredError') {
			const refreshToken = event.cookies.get('refresh_token') as string;
			if (refreshToken) {
				try {
					const tokens = refreshTokens(accessToken, refreshToken);
					event.cookies.set('access_token', tokens.accessToken, { path: '/', secure: false });
					event.cookies.set('refresh_token', tokens.refreshToken, { path: '/', secure: false });
					event.locals.user = verifyAccessToken(tokens.accessToken);
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
