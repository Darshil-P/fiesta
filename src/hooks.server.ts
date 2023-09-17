import { error, type HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error: err }) => {
	if (err instanceof Error) {
		if (err.message.includes('duplicate')) {
			throw error(409, err.message);
		}
		if (err.message.includes('violates')) {
			throw error(404, 'referring entity (id) does not exist');
		}

		console.log(err.stack);
	}
};
