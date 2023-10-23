import type { TicketDetails } from '$lib/types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const eventId = params.eventId;

	const response = await fetch(`/api/events/${eventId}/ticket-details`);

	if (response.status == 404) {
		throw error(404, 'Event not found');
	}

	const ticketDetails: TicketDetails = await response.json();

	return { ticketDetails };
};

export const actions: Actions = {
	default: async ({ request, fetch, params }) => {
		const eventId = Number.parseInt(params.eventId ?? '');
		const formData = await request.formData();
		const paymentMethod = formData.get('paymentMethod');

		const response = await fetch(`/api/events/${eventId}/buy-ticket`, {
			method: 'POST',
			body: JSON.stringify({
				paymentMethod,
				subEventIds: []
			})
		});

		const responseJson = await response.json();

		if (response.status == 200) {
			throw redirect(
				303,
				`/transaction-status?response=${encodeURIComponent(
					JSON.stringify({ status: 200, transactionId: responseJson.transactionId })
				)}`
			);
		}

		throw redirect(
			303,
			`/transaction-status?response=${encodeURIComponent(
				JSON.stringify({ status: response.status })
			)}`
		);
	}
};
