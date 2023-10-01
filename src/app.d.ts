// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				avatarId: string | null;
				userId: number;
				name: string;
				dateCreated: Date;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
