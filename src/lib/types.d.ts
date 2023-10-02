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

export type EventDetails = {
	eventId: number;
	ownerId: number;
	ownerType: 'user' | 'organization';
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	status: string;
	category: string;
	venue: string;
	ticketPrice: number | null;
	terms: string | null;
	thumbnailId: string;
	imageIds: string[];
	videoId: string | null;
	organization: {
		organizationId: number;
		name: string;
		ownerId: number;
		about: string;
		verified: boolean;
		logoId: string | null;
		bannerId: string | null;
	} | null;
	user: {
		userId: number;
		name: string;
		dateCreated: Date;
		avatarId: string | null;
	} | null;
	subEvents: Array<SubEvent>;
};

type SubEvent = {
	name: string;
	description: string;
	subEventId: number;
	dateTime: Date;
	category: {
		name: string;
		categoryId: number;
	} | null;
	venue: string | null;
};

export type OrganizationDetails = {
	organizationId: number;
	name: string;
	about: string;
	verified: boolean;
	dateCreated: Date;
	logoId: string | null;
	bannerId: string | null;
	owner: {
		userId: number;
		name: string;
		avatarId: string | null;
	} | null;
};

export type User = {
	avatarId: string | null;
	userId: number;
	name: string;
	dateCreated: Date;
};

export type UserProfile = {
	avatarId: string | null;
	userId: number;
	name: string;
	dateCreated: Date;
	about: string | null;
};

type Category = {
	categoryId: number;
	name: string;
};

type Organization = {
	organizationId: number;
	name: string;
	verified: boolean;
	logoId: string | null;
};

type TicketDetails = {
	eventId: number;
	price: number;
	type: number;
	ticketsTotal: number;
	ticketsAvailable: number;
	name: string | null;
	startDate: string | null;
	venue: string | null;
	terms: string | null;
};

type FormError = {
	[key: string]: null | string;
};

type EventFormData = {
	name: string;
	description: string;
	ownerId: number;
	startDate: string;
	endDate: string;
	category: number;
	venue: string;
};

type EventMediaFormData = {
	thumbnail: FileList;
	pictures: FileList;
};

type SubEventsFormData = {
	name: string;
	description: string;
	datetime: string;
	categoryId: number;
	venue: string;
}[];

type EventTicketFormData = {
	price: number;
	ticketsTotal: number;
	type: number;
	status: number;
	terms: string | null;
};
