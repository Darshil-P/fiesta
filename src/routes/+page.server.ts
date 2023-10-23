import type { Event } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/events/upcoming');
	if (response.status == 200) {
		const upcomingEvents: Array<Event> = await response.json();
		return { upcomingEvents };
	}

	return { upcomingEvents: [] };
};
