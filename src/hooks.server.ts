import { protectedRoutes } from '$lib/server/constants';
import { verifyAccessToken } from '$lib/server/jwt';
import { error, type Handle, type HandleServerError } from '@sveltejs/kit';
import 'dotenv/config';

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

	const accessToken = event.cookies.get('access_token');
	if (!accessToken) {
		throw error(401);
	}

	try {
		const userId = verifyAccessToken(accessToken);
		event.locals.userId = userId;
	} catch (e) {
		throw error(401, 'Unauthorized');
	}

	return await resolve(event);
};
