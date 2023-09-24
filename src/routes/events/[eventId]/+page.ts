import type { EventDetails } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/events/${params.eventId}`);
	const eventDetails: EventDetails = await response.json();
	return { eventDetails };
};
