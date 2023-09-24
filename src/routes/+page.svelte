<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import ScrollContainer from '$lib/components/ScrollContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div color="white" class="mx-auto min-h-screen w-2/3">
	<h1 class="py-6 pl-16 text-3xl font-bold">Upcoming Events</h1>
	<ScrollContainer>
		{#each data.upcomingEvents as event}
			<EventCard
				title={event.name}
				imageUrl={`http://localhost/uploads/images/events/thumbnail/` + event.thumbnailId}
				hostedBy={event.organization?.name ?? event.user?.name ?? 'organizer'}
				datetime={new Date(event.startDate)}
				category={event.category}
				price={event.status == 'selling' ? event.ticketPrice ?? 0 : -1}
				venue={event.venue}
			/>
		{/each}
	</ScrollContainer>
</div>
