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
	'/api/organizations',
	'/api/events/[id]/invite',
	'/api/organizations/[id]/invite',
	'/api/users/[id]/events',
	'/api/users/invitations',
	'/api/users/invitations/[id]/accept',
	'/api/users/[id]/organizations',
	'/api/users/[id]/profile'
];
