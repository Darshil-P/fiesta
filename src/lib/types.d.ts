export type Event = {
	eventId: number;
	name: string;
	startDate: string;
	endDate: string;
	status: string;
	venue: string;
	category: string;
	thumbnailId: string;
	ownerType: 'user' | 'organization';
	ticketPrice: number | null;
	organization: {
		organizationId: number;
		name: string;
		verified: boolean;
	} | null;
	user: {
		name: string;
		userId: number;
	} | null;
};
