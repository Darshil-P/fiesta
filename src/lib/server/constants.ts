export const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
export const fileLocation = {
	eventThumbnail: 'src/lib/uploads/images/events/thumbnail',
	eventPictures: 'src/lib/uploads/images/events/pictures',
	organizationLogo: 'src/lib/uploads/images/organizations/logo',
	organizationBanner: 'src/lib/uploads/images/organizations/banner',
	userAvatar: 'src/lib/uploads/images/avatar'
};

export const protectedRoutes = [
	'/api/events',
	'/api/events/[id]/invite',
	'/api/organizations',
	'/api/organizations/[id]/invite',
	'/api/users/events',
	'/api/users/invitations',
	'/api/users/invitations/[id]/accept',
	'/api/users/invitations/[id]/reject',
	'/api/users/organizations',
	'/api/users/profile'
];
