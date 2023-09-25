import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const response = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			})
		});

		if (response.status == 200) {
			throw redirect(302, '/');
		}

		return await response.json();
	}
} satisfies Actions;
