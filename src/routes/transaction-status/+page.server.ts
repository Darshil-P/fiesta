import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = ({ url }) => {
	const params = url.searchParams;
	const response = JSON.parse(params.get('response')!);

	if (response.status == 400) {
		return { notSelling: true };
	}
	if (response.status == 410) {
		return { sold: true };
	}
	if (response.status == 200) {
		return { transactionId: response.transactionId };
	}
};
