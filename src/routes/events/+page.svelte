<script lang="ts">
	import EventForm from '$lib/components/EventForm.svelte';
	import EventMediaForm from '$lib/components/EventMediaForm.svelte';
	import SubEventsForm from '$lib/components/SubEventsForm.svelte';
	import { Step, Stepper } from '@skeletonlabs/skeleton';

	let locked = true;

	let eventFormData: any;
	let eventMediaFormData: any;
	let formInvalid: boolean;

	function onNextHandler(e: CustomEvent): void {
		console.log(eventFormData);
		console.log(eventMediaFormData);
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

<Stepper
	on:next={onNextHandler}
	on:back={onBackHandler}
	on:step={onStepHandler}
	on:complete={onCompleteHandler}
>
	<Step bind:locked={formInvalid}>
		<svelte:fragment slot="header">Event Info</svelte:fragment>
		<EventForm bind:formData={eventFormData} bind:formInvalid />
	</Step>
	<Step bind:locked={formInvalid}>
		<svelte:fragment slot="header">Upload Event Media</svelte:fragment>
		<EventMediaForm bind:formData={eventMediaFormData} bind:formInvalid />
	</Step>
	<Step>
		<svelte:fragment slot="header">Sub Events</svelte:fragment>
		<SubEventsForm />
	</Step>
	<Step {locked}>
		<svelte:fragment slot="header">Final Step</svelte:fragment>
	</Step>
</Stepper>
