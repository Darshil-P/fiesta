<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import ScrollContainer from '$lib/components/ScrollContainer.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<h1 class="py-6 pl-16 text-3xl font-bold">Upcoming Events</h1>
<ScrollContainer>
	{#each data.upcomingEvents as event}
		<EventCard
			detailsLink={`/events/${event.eventId}`}
			passLink={`/buy/${event.eventId}`}
			title={event.name}
			imageUrl={`/uploads/images/events/thumbnail/` + event.thumbnailId}
			hostedBy={event.organization?.name ?? event.user?.name ?? 'organizer'}
			datetime={new Date(event.startDate)}
			category={event.category}
			status={event.status}
			price={event.status == 'selling' ? event.ticketPrice ?? 0 : -1}
			venue={event.venue}
		/>
	{/each}
</ScrollContainer>
