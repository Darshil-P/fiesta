<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EventForm from '$lib/components/EventForm.svelte';
	import EventMediaForm from '$lib/components/EventMediaForm.svelte';
	import EventTicketForm from '$lib/components/EventTicketForm.svelte';
	import SubEventsForm from '$lib/components/SubEventsForm.svelte';
	import type {
		EventFormData,
		EventMediaFormData,
		EventTicketFormData,
		SubEventsFormData
	} from '$lib/types';
	import { Step, Stepper } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	const user = $page.data.user;

	let redirectTimer = 4;
	let redirectCancelled = false;

	const redirectUser = async () => {
		for (let i = redirectTimer; i > 0; i--) {
			redirectTimer = i;
			await new Promise((r) => setTimeout(r, 1000));
		}
		if (!redirectCancelled) {
			goto('/login');
		}
	};

	onMount(() => {
		if (!user) {
			redirectUser();
		}
	});

	onDestroy(() => {
		redirectCancelled = true;
	});

	export let data: PageData;
	const { categories, organizations } = data;

	let eventFormData: EventFormData = {
		name: 'Sample Event',
		description: 'lorem ipsum',
		ownerId: 0,
		startDate: new Date().toISOString().substring(0, 10),
		endDate: new Date().toISOString().substring(0, 10),
		category: 1,
		venue: 'Mithibai College'
	};
	let eventMediaFormData: EventMediaFormData = {
		thumbnail: [] as unknown as FileList,
		pictures: [] as unknown as FileList
	};
	let subEventFormData: SubEventsFormData = [];
	let eventTicketFormData: EventTicketFormData = {
		type: 0,
		price: 100,
		ticketsTotal: 100,
		status: 0,
		terms: ''
	};
	let formInvalid: boolean;

	let formError: string | null;

	function onNextHandler(e: CustomEvent): void {
		console.log(eventFormData);
		console.log(eventMediaFormData);
		console.log(subEventFormData);
		console.log(eventTicketFormData);
	}
	function onBackHandler(e: CustomEvent): void {
		console.log('event:prev', e.detail);
	}
	function onStepHandler(e: CustomEvent): void {
		console.log('event:step', e.detail);
	}
	async function onCompleteHandler(e: CustomEvent): Promise<void> {
		console.log('event:complete', e.detail);
		formError = null;

		let eventTerms: string | null = null;

		if (eventTicketFormData.terms != '') {
			eventTerms = eventTicketFormData.terms;
		}

		const eventDetails = {
			event: {
				name: eventFormData.name,
				description: eventFormData.description,
				ownerId: 0,
				ownerType: eventFormData.ownerId == 0 ? 'user' : 'organization',
				startDate: eventFormData.startDate,
				endDate: eventFormData.endDate,
				status: eventTicketFormData.status == 0 ? 'upcoming' : 'selling',
				categoryId: eventFormData.category,
				venue: eventFormData.venue,
				terms: eventTerms ?? undefined
			},
			subEvents: subEventFormData,
			ticket: {
				price: eventTicketFormData.price,
				ticketsTotal: eventTicketFormData.ticketsTotal,
				type: eventTicketFormData.type
			}
		};

		const formData = new FormData();

		formData.append('body', JSON.stringify(eventDetails));
		formData.append('thumbnail', eventMediaFormData.thumbnail[0]);
		for (const picture of eventMediaFormData.pictures) {
			formData.append('images', picture);
		}

		const response = await fetch('/api/events', {
			method: 'POST',
			body: formData
		});

		const jsonResponse = await response.json();

		if (response.status == 401) {
			formError = jsonResponse.message;
		}

		if (response.status == 415) {
			formError = jsonResponse.message;
		}

		if (response.status == 201) {
			goto(`/events/${jsonResponse.eventId}`);
		}

		console.log(jsonResponse);

		formError = 'Something went wrong, please try again later';
	}
</script>

{#if user}
	<Stepper
		on:next={onNextHandler}
		on:back={onBackHandler}
		on:step={onStepHandler}
		on:complete={onCompleteHandler}
	>
		<Step bind:locked={formInvalid}>
			<svelte:fragment slot="header">Event Info</svelte:fragment>
			<EventForm bind:formData={eventFormData} bind:formInvalid {categories} {organizations} />
		</Step>
		<Step bind:locked={formInvalid}>
			<svelte:fragment slot="header">Upload Event Media</svelte:fragment>
			<EventMediaForm bind:formData={eventMediaFormData} bind:formInvalid />
		</Step>
		<Step>
			<svelte:fragment slot="header">Sub Events</svelte:fragment>
			<SubEventsForm bind:formData={subEventFormData} {categories} />
		</Step>
		<Step bind:locked={formInvalid}>
			<svelte:fragment slot="header">Final Step</svelte:fragment>
			<EventTicketForm bind:formData={eventTicketFormData} bind:formInvalid />
			{#if formError}
				<p class="variant-ghost-error mx-40 p-1 px-2 text-sm">
					{formError}
				</p>
			{/if}
		</Step>
	</Stepper>
{:else}
	<div class="card m-40 p-8 text-center">
		<header class="header text-3xl">Looks Like you're not logged in</header>
		<p class="p-8 text-xl">
			Redirecting you to <a href="/login" class="anchor">Login</a> page...
		</p>
		<span class="text-2xl">{redirectTimer}</span>
	</div>
{/if}
