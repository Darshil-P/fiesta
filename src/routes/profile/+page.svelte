<script lang="ts">
	import { enhance } from '$app/forms';
	import ScrollContainer from '$lib/components/ScrollContainer.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { userProfile, userEvents } = data;
</script>

<div>
	<h2 class="h2 px-16 py-6 font-bold">Your Profile</h2>

	<div class="my-8 flex flex-row gap-6 px-16">
		<Avatar
			src={`/uploads/images/avatar/${userProfile.avatarId}`}
			width="max-w-[128px]"
			rounded="rounded-full"
		/>
		<div class="my-auto flex w-full flex-col gap-3">
			<span class="flex flex-row">
				<p class="my-auto overflow-hidden overflow-ellipsis whitespace-nowrap text-4xl font-bold">
					{userProfile.name}
				</p>
			</span>
			<p class="text-lg">Joined: {new Date(userProfile.dateCreated).toLocaleDateString()}</p>
		</div>
		<form method="POST" use:enhance>
			<button
				type="submit"
				class="variant-outline-primary btn my-8 h-fit place-self-end rounded-3xl"
			>
				Logout
			</button>
		</form>
	</div>

	<div class="my-4 px-16">
		<h3 class="h3 py-2 font-bold">About</h3>
		<p class="max-w-2xl">{userProfile.about}</p>
	</div>

	<div class="my-4">
		<h3 class="h3 px-16 py-4 font-bold">Your Events</h3>
		<ScrollContainer>
			{#each data.userEvents as event}
				<div
					class="card variant-ringed-surface variant-glass card-hover relative m-2 min-w-[20rem] max-w-xs rounded-3xl p-px"
				>
					<a class="absolute bottom-0 left-0 right-0 top-0" href={`/events/${event.eventId}`}
						>&nbsp</a
					>
					<header class="aspect-video">
						<img
							src={`/uploads/images/events/thumbnail/` + event.thumbnailId}
							alt={event.name}
							width="320px"
							class="mb-2 aspect-video overflow-hidden rounded-t-[24px]"
						/>
					</header>
					<div class="space-y-1 px-4 pb-3">
						<p class="overflow-hidden text-2xl font-bold">{event.name}</p>
						<p class="text-neutral-300">
							Hosted by: {event.organization?.name ?? event.user?.name ?? 'organizer'}
						</p>
						<div class="flex pt-1">
							<div
								class="card variant-gradient-tertiary-secondary h-14 min-w-[64px] items-center rounded-xl bg-gradient-to-br text-center"
							>
								<p>{new Date(event.startDate).toDateString().substring(4, 7)}</p>
								<p class="text-2xl">{new Date(event.startDate).getDate()}</p>
							</div>
							<div class="px-6">
								<p class="line-clamp-1 w-48 overflow-ellipsis break-words text-sm">
									Category: {event.category}
								</p>
								<p class="line-clamp-2 w-48 overflow-ellipsis break-words text-sm">
									Venue: {event.venue}
								</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</ScrollContainer>
	</div>
</div>
