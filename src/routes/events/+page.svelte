<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EventForm from '$lib/components/EventForm.svelte';
	import EventMediaForm from '$lib/components/EventMediaForm.svelte';
	import EventTicketForm from '$lib/components/EventTicketForm.svelte';
	import SubEventsForm from '$lib/components/SubEventsForm.svelte';
	import { Step, Stepper } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	const user = $page.data.user;

	let redirectTimer = 4;

	const redirectUser = async () => {
		for (let i = redirectTimer; i > 0; i--) {
			redirectTimer = i;
			await new Promise((r) => setTimeout(r, 1000));
		}
		goto('/login');
	};

	if (!user) {
		redirectUser();
	}

	export let data: PageData;
	const { categories, organizations } = data;

	let eventFormData: any;
	let eventMediaFormData: any;
	let subEventFormData: any;
	let eventTicketFormData: any;
	let formInvalid: boolean;

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
	function onCompleteHandler(e: CustomEvent): void {
		console.log('event:complete', e.detail);
		alert('Complete!');
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
