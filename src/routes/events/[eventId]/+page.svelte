<script lang="ts">
	import InfoCard from '$lib/components/InfoCard.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import SubEventCard from '$lib/components/SubEventCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export const { eventDetails } = data;
	const date = new Date(eventDetails.startDate);
	const pictures = eventDetails.imageIds.map((id) => `/uploads/images/events/pictures/${id}`);
	const organizer = {
		name: eventDetails.organization?.name ?? eventDetails.user?.name,
		imageUrl: eventDetails.organization
			? `/uploads/images/organizations/logo/${eventDetails.organization.logoId}`
			: `/uploads/images/users/avatar/${eventDetails.user?.avatarId}`
	};
</script>

<div class="grid grid-cols-8 place-content-between gap-12">
	<div class="col-span-5">
		<Slider {pictures} />
		<p class="mt-4 py-2 text-xl font-bold">About</p>
		<p>
			{data.eventDetails.description}
		</p>
		<div>
			{#each data.eventDetails.subEvents as subEvent}
				<SubEventCard
					name={subEvent.name}
					description={subEvent.description}
					datetime={new Date(subEvent.dateTime)}
					category={subEvent.category?.name}
					venue={subEvent.venue}
				/>
			{/each}
		</div>
		{#if data.eventDetails.terms}
			<p class="mt-4 py-2 text-xl font-bold">Terms & Conditions</p>
			<p>
				{@html data.eventDetails.terms.replace(/\n/g, '<br>')}
			</p>
		{/if}
	</div>
	<div class="sticky top-0 col-span-3 h-fit max-w-sm justify-self-end">
		<div class="card variant-ringed-surface variant-glass mb-2 h-fit max-w-sm rounded-xl p-4">
			<header>
				<p class="text-4xl font-semibold">{data.eventDetails.name}</p>
			</header>
			<p class="my-2 text-neutral-300">
				Hosted by: {eventDetails.organization?.name ?? eventDetails.user?.name}
			</p>
			<div class="flex pt-1">
				<div
					class="card variant-gradient-tertiary-secondary min-w-[64px] self-start rounded-xl bg-gradient-to-br p-1 text-center"
				>
					<p>{date.toDateString().substring(4, 7)}</p>
					<p class="text-2xl">{date.getDate()}</p>
				</div>
				<div class="px-6">
					<p class="line-clamp-1 w-64 overflow-ellipsis break-words">
						Category: {eventDetails.category}
					</p>
					<p class="line-clamp-2 w-56 overflow-ellipsis break-words">
						Venue: {eventDetails.venue}
					</p>
					<p class=" text-xl">
						{#if eventDetails.ticketPrice ?? -1 >= 0}
							₹ : {eventDetails.ticketPrice == 0 ? 'Free!' : eventDetails.ticketPrice}
						{/if}
					</p>
				</div>
			</div>
			<iframe
				title="location"
				class="mt-4 w-full rounded-xl"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60321.73829590083!2d72.77151233125002!3d19.102889200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c856a7d54355%3A0xd8481ebbaccd8149!2sSVKM&#39;s%20Mithibai%20College%20of%20Arts!5e0!3m2!1sen!2sin!4v1695580494653!5m2!1sen!2sin"
				height="128"
				loading="lazy"
			/>
			<footer class="mt-4">
				{#if eventDetails.status == 'selling'}
					<a
						href={`/buy/${eventDetails.eventId}`}
						class="variant-filled-primary btn w-full font-bold">Get Your Pass!</a
					>
				{:else}
					<span class="variant-ringed-primary badge w-full p-2">Coming Soon!</span>
				{/if}
			</footer>
		</div>
		<p class="mt-4 py-2 text-xl font-bold">Organizer</p>
		<InfoCard
			href={eventDetails.organization
				? `/organization/${eventDetails.organization.organizationId}`
				: `/profile/${eventDetails.user?.userId}`}
			title={organizer.name ?? ''}
			verified={eventDetails.organization?.verified ?? false}
			imageUrl={organizer.imageUrl}
		/>
	</div>
</div>
