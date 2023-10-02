import type { Event, UserProfile } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const profileResponse = await fetch('/api/users/profile');
	const userProfile: UserProfile = await profileResponse.json();

	const eventsResponse = await fetch('/api/users/events');
	const userEvents: Array<Event> = await eventsResponse.json();

	return {
		userProfile,
		userEvents
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
