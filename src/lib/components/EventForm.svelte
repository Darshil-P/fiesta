<script lang="ts">
	import type { FormError } from '$lib/types';

	export let organizations = [
		{ id: 1, value: 'Option 1' },
		{ id: 2, value: 'Option 2' },
		{ id: 3, value: 'Option 3' },
		{ id: 4, value: 'Option 4' },
		{ id: 5, value: 'Option 5' }
	];

	export let categories = [
		{ id: 1, value: 'Option 1' },
		{ id: 2, value: 'Option 2' },
		{ id: 3, value: 'Option 3' },
		{ id: 4, value: 'Option 4' },
		{ id: 5, value: 'Option 5' }
	];

	const ticketTypes = [
		{ key: 0, value: 'Free' },
		{ key: 1, value: 'Paid' }
	];

	export let formData = {
		title: 'Sample Event',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel orci porta non pulvinar neque laoreet. Mattis nunc sed blandit libero volutpat sed cras ornare. Sit amet tellus cras adipiscing enim eu. Eu non diam phasellus vestibulum lorem sed risus ultricies. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque. Sed vulputate mi sit amet mauris commodo. Phasellus vestibulum lorem sed risus. Condimentum vitae sapien pellentesque habitant morbi tristique senectus et. Sodales ut eu sem integer vitae justo eget. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Lorem mollis aliquam ut porttitor leo a diam. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris. Cras fermentum odio eu feugiat. Faucibus turpis in eu mi bibendum neque. Sed augue lacus viverra vitae congue eu consequat ac.',
		startDate: new Date().toISOString().substring(0, 10),
		endDate: new Date().toISOString().substring(0, 10),
		venue: 'Mithibai College',
		organization: 0,
		category: 1,
		ticketType: 0,
		ticketPrice: 100
	};

	export let formError: FormError = {
		title: null,
		description: null,
		startDate: null,
		endDate: null,
		venue: null,
		ticketPrice: null
	};

	export let formInvalid;
	$: formInvalid =
		errorMessage ||
		Object.values(formError).some((err) => err != null) ||
		Object.values(formData).some((v) => v === '') != false;

	let errorMessage: null | string;
	let isSingleDayEvent = false;
	let isSelfOrganized = true;

	const toggleIsSingleDayEvent = () => {
		formData.endDate = formData.startDate;
		validateDate();
		isSingleDayEvent = !isSingleDayEvent;
	};

	const toggleIsSelfOrganized = () => {
		formData.organization = 0;
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

	const validateTicketPrice = () => {
		if (ticketType == 0) {
			formError.ticketPrice = null;
			return (formData.ticketPrice = 0);
		}
		if (
			formData.ticketPrice == null ||
			formData.ticketPrice < 100 ||
			formData.ticketPrice > 10000
		) {
			return (formError.ticketPrice = 'Ticket price must be within the range 100 - 10000');
		}
		formError.ticketPrice = null;
	};

	let ticketType = 0;
	$: amountDisabled = ticketType == 0;
</script>

<form class="grid grid-cols-2 gap-6">
	<label class="label col-span-2">
		<span class="font-bold">Event Title</span>
		<input
			bind:value={formData.title}
			on:input={() =>
				(formError.title = formData.title == '' ? 'Title field cannot be empty' : null)}
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
		<select bind:value={formData.organization} disabled={isSelfOrganized} class="select">
			<option value={0}>Self Organized</option>
			{#each organizations as organization}
				<option value={organization.id}>{organization.value} </option>
			{/each}
		</select>
	</label>
	<label class="label">
		<span class="font-bold">Category</span>
		<select bind:value={formData.category} class="select">
			{#each categories as category}
				<option value={category.id}>{category.value} </option>
			{/each}
		</select>
	</label>
	<label class="label">
		<span class="font-bold">Ticket</span>
		<div class="my-auto mt-4 flex flex-row gap-4 align-middle">
			{#each ticketTypes as type}
				<button
					class="chip text-sm font-bold {ticketType === type.key
						? 'variant-filled'
						: 'variant-outline-surface'}"
					on:click={() => {
						ticketType = type.key;
						validateTicketPrice();
					}}
					on:keypress
				>
					<span>{type.value}</span>
				</button>
			{/each}
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">
					<span class="material-symbols-outlined">currency_rupee</span>
				</div>
				<input
					bind:value={formData.ticketPrice}
					on:input={validateTicketPrice}
					class="input p-2"
					type="number"
					min="100"
					max="10000"
					disabled={amountDisabled}
					placeholder="Ticket Price"
				/>
			</div>
		</div>
		{#if formError.ticketPrice}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.ticketPrice}</div>
		{/if}
	</label>
	{#if errorMessage}
		<p class="variant-ghost-error col-span-2 p-0.5 px-2 text-xs">
			{errorMessage}
		</p>
	{/if}
</form>