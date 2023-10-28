import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) throw redirect(303, '/login');

	const response = await fetch('/api/users/booking-history');

	const bookingsList = await response.json();

	return {
		bookings: bookingsList
	};
};
