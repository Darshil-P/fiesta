import { error, type HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error: err }) => {
	if (err instanceof Error) {
		if (err.message.includes('duplicate')) {
			throw error(409, err.message);
		}

		console.log(err.stack);
	}
};
