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
			console.log(err);
			throw error(404, 'referring entity (id) does not exist');
		}

		console.log(err.stack);
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	if (!protectedRoutes.includes(event.route.id ?? '')) {
		return await resolve(event);
	}
	console.log('Accessing Secure Route');

	const accessToken = event.cookies.get('access_token');
	if (!accessToken) {
		console.log('No Access Token');
		throw error(401);
	}

	try {
		console.log('Verifying Access Token');
		const userId = verifyAccessToken(accessToken);
		event.locals.userId = userId;
	} catch (e) {
		console.log('Access Token Invalid');
		if (e instanceof JsonWebTokenError && e.name == 'TokenExpiredError') {
			const refreshToken = event.cookies.get('refresh_token') as string;
			if (refreshToken) {
				console.log('Refresh Token Available, Refreshing');
				try {
					const tokens = refreshTokens(accessToken, refreshToken);
					event.cookies.set('access_token', tokens.accessToken, { path: '/' });
					event.cookies.set('refresh_token', tokens.refreshToken, { path: '/' });
					console.log('Tokens Refreshed');
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
