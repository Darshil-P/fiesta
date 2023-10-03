export const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
export const fileLocation = {
	eventThumbnail: 'src/lib/uploads/images/events/thumbnail',
	eventPictures: 'src/lib/uploads/images/events/pictures',
	organizationLogo: 'src/lib/uploads/images/organizations/logo',
	organizationBanner: 'src/lib/uploads/images/organizations/banner',
	userAvatar: 'src/lib/uploads/images/avatar'
};

export const protectedRoutes = [
	'/api/auth/logout',
	'/api/events',
	'/api/events/[eventId]/buy-ticket',
	'/api/events/[eventId]/invite',
	'/api/organizations',
	'/api/organizations/[organizationId]/invite',
	'/api/users/events',
	'/api/users/invitations',
	'/api/users/invitations/[invitationId]/accept',
	'/api/users/invitations/[invitationId]/reject',
	'/api/users/organizations',
	'/api/users/profile/[[userId]]',
	'/api/users/tickets'
];
