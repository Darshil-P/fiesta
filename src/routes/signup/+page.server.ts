import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {};

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const mobile = formData.get('mobile');
		const password = formData.get('password');

		const body = new FormData();

		body.append(
			'user',
			JSON.stringify({
				name,
				email,
				mobile,
				password
			})
		);

		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			body
		});

		if (response.status == 400) {
			return fail(400, { invalid: true });
		}

		if (response.status == 409) {
			return fail(409, { alreadyExist: true });
		}

		if (response.status == 201) {
			throw redirect(303, '/login');
		}

		if (response.status == 500) {
			return fail(500, { error: true });
		}

		return fail(400, { invalid: true });
	}
};
