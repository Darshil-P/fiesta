import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const categories = await fetch('/api/dropdown/categories');
	const organizations = await fetch('/api/users/organizations');

	return {
		categories: await categories.json(),
		organizations: await organizations.json()
	};
};
