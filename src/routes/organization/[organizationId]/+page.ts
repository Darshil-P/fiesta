import type { OrganizationDetails } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await fetch(`/api/organizations/${params.organizationId}`);
	const organizationDetails: OrganizationDetails = await response.json();
	return { organizationDetails };
};
