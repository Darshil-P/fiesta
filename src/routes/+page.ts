import type { Event } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/events/upcoming');
	const upcomingEvents: Array<Event> = await response.json();

	return { upcomingEvents };
};
