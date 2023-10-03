import type { UserProfile } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const userId = Number.parseInt(params.userId);
	const profileResponse = await fetch(`/api/users/profile/${userId}`);

	if (profileResponse.status == 404) {
		throw redirect(303, '/');
	}

	const userProfile: UserProfile = await profileResponse.json();
	return userProfile;
};
