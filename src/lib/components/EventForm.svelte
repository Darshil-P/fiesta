<script lang="ts">
	import type { Category, EventFormData, FormError, Organization } from '$lib/types';

	export let organizations: Array<Organization>;
	export let categories: Array<Category>;
	export let formData: EventFormData;
	export let formInvalid;

	let formError: FormError = {
		title: null,
		description: null,
		startDate: null,
		endDate: null,
		venue: null
	};

	let errorMessage: null | string;
	let isSingleDayEvent = true;
	let isSelfOrganized = true;

	const toggleIsSingleDayEvent = () => {
		formData.endDate = formData.startDate;
		validateDate();
		isSingleDayEvent = !isSingleDayEvent;
	};

	const toggleIsSelfOrganized = () => {
		formData.ownerId = 0;
		isSelfOrganized = !isSelfOrganized;
	};

	const validateDate = () => {
		if (isSingleDayEvent) formData.endDate = formData.startDate;
		if (formData.startDate == '') {
			return (errorMessage = 'Please select event starting date');
		}

		if (!isSingleDayEvent && formData.endDate == '') {
			return (errorMessage = 'Please select event ending date');
		}

		if (Date.parse(formData.startDate) < Date.parse(new Date().toISOString().substring(0, 10))) {
			return (errorMessage = 'Start date cannot be earlier than today');
		}

		if (Date.parse(formData.endDate) < Date.parse(formData.startDate)) {
			return (errorMessage = 'End date cannot be earlier than start date');
		}

		errorMessage = null;
	};

	$: formInvalid =
		errorMessage ||
		Object.values(formError).some((err) => err != null) ||
		Object.values(formData).some((v) => v === '') != false;
</script>

<form class="grid grid-cols-2 gap-6">
	<label class="label col-span-2">
		<span class="font-bold">Event Title</span>
		<input
			bind:value={formData.name}
			on:input={() =>
				(formError.title = formData.name == '' ? 'Title field cannot be empty' : null)}
			class="input p-2"
			type="text"
			maxlength="100"
			placeholder="Title of your event"
			required
		/>
		{#if formError.title}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.title}</div>
		{/if}
	</label>
	<label class="label col-span-2">
		<span class="font-bold">Event Description</span>
		<textarea
			bind:value={formData.description}
			on:input={() =>
				(formError.description = formData.description == '' ? 'Description cannot be empty' : null)}
			class="textarea p-2"
			rows="6"
			maxlength="4000"
			placeholder="Description of your event"
			required
		/>
		{#if formError.description}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.description}</div>
		{/if}
	</label>
	<label class="label">
		<span class="font-bold">Start Date</span>
		<br />
		<input
			bind:value={formData.startDate}
			on:change={validateDate}
			type="date"
			min={new Date().toISOString().substring(0, 10)}
			style="color-scheme: dark;"
			class="input w-full p-2 rounded-token"
		/>
		{#if formError.startDate}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.startDate}</div>
		{/if}
	</label>
	<label class="label">
		<span class="font-bold">End Date</span>
		<br />
		<input
			bind:value={formData.endDate}
			on:change={validateDate}
			type="date"
			min={formData.startDate}
			style="color-scheme: dark;"
			disabled={isSingleDayEvent}
			class="input w-full p-2 rounded-token"
		/>
		{#if formError.endDate}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.endDate}</div>
		{/if}
	</label>
	<label class="flex items-center space-x-2">
		<input
			on:click={toggleIsSingleDayEvent}
			class="checkbox"
			type="checkbox"
			checked={isSingleDayEvent}
		/>
		<p class="font-bold">This is a single day event</p>
	</label>
	<label class="flex items-center space-x-2">
		<input
			on:click={toggleIsSelfOrganized}
			class="checkbox"
			type="checkbox"
			checked={isSelfOrganized}
		/>
		<p class="font-bold">This is a self organized event</p>
	</label>
	<label class="label">
		<span class="font-bold">Event Venue</span>
		<input
			bind:value={formData.venue}
			on:input={() =>
				(formError.venue = formData.venue == '' ? 'Venue field cannot be empty' : null)}
			class="input p-2"
			type="text"
			placeholder="Location of your event"
		/>
		{#if formError.venue}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.venue}</div>
		{/if}
	</label>
	<label class="label">
		<span class="font-bold">Organization</span>
		<select bind:value={formData.ownerId} disabled={isSelfOrganized} class="select">
			<option value={0}>Self Organized</option>
			{#each organizations as organization}
				<option value={organization.organizationId}>{organization.name} </option>
			{/each}
		</select>
	</label>
	<label class="label">
		<span class="font-bold">Category</span>
		<select bind:value={formData.category} class="select">
			{#each categories as category}
				<option value={category.categoryId}>{category.name} </option>
			{/each}
		</select>
	</label>
	{#if errorMessage}
		<p class="variant-ghost-error col-span-2 p-0.5 px-2 text-xs">
			{errorMessage}
		</p>
	{/if}
</form>
