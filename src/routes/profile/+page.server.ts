import type { UserProfile } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const response = await fetch('/api/users/profile');
	const userProfile: UserProfile = await response.json();

	return {
		userProfile
	};
};

export const actions = {
	default: async ({ fetch }) => {
		const response = await fetch('/api/auth/logout', { method: 'POST' });

		if (response.status == 200) {
			throw redirect(303, '/');
		}
	}
};
