import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {};

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const response = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		if (response.status == 400) {
			return fail(400, { email: true });
		}

		if (response.status == 401) {
			return fail(401, { password: true });
		}

		if (response.status == 404) {
			return fail(404, { notFound: true });
		}

		if (response.status == 200) {
			throw redirect(303, '/');
		}

		return fail(500, { error: true });
	}
};
