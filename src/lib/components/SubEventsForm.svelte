<script lang="ts">
	import type { Category, FormError } from '$lib/types';

	export let categories: Array<Category>;

	type SubEvent = {
		title: string;
		description: string;
		datetime: string;
		venue: string;
		category: number;
	};

	const subEvent: SubEvent = {
		title: 'Sub-Event 1',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel orci porta non pulvinar neque laoreet. Mattis nunc sed blandit libero volutpat sed cras ornare. Sit amet tellus cras adipiscing enim eu. Eu non diam phasellus vestibulum lorem sed risus ultricies. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque. Sed vulputate mi sit amet mauris commodo. Phasellus vestibulum lorem sed risus. Condimentum vitae sapien pellentesque habitant morbi tristique senectus et. Sodales ut eu sem integer vitae justo eget. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Lorem mollis aliquam ut porttitor leo a diam. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris. Cras fermentum odio eu feugiat. Faucibus turpis in eu mi bibendum neque. Sed augue lacus viverra vitae congue eu consequat ac.',
		datetime: new Date().toISOString().substring(0, 16),
		venue: 'Mithibai College',
		category: 1
	};

	export let formData = {
		subEvents: [] as Array<SubEvent>
	};

	let currentSubEvent = 0;

	let errorMessage: null | string;

	export let formError: FormError = {
		title: null,
		description: null,
		datetime: null,
		venue: null
	};

	const validateDate = () => {
		if (subEvent.datetime == '') {
			return (errorMessage = 'Please select event starting date');
		}

		if (Date.parse(subEvent.datetime) < Date.parse(new Date().toISOString().substring(0, 10))) {
			return (errorMessage = 'Start date cannot be earlier than today');
		}

		errorMessage = null;
	};

	const resetSubEvent = () => {
		currentSubEvent = formData.subEvents.length;
		subEvent.title = '';
		subEvent.description = '';
		subEvent.datetime = new Date().toISOString().substring(0, 16);
		subEvent.venue = '';
		subEvent.category = 1;
	};

	const handleAddSubEvent = () => {
		formData.subEvents = [...formData.subEvents, { ...subEvent }];
		resetSubEvent();
	};

	const handleEdit = (index: number) => {
		console.log(`Edit ${index}`);
		currentSubEvent = index;
		const editSubEvent = formData.subEvents[index];
		subEvent.title = editSubEvent.title;
		subEvent.description = editSubEvent.description;
		subEvent.datetime = editSubEvent.datetime;
		subEvent.venue = editSubEvent.venue;
		subEvent.category = editSubEvent.category;
	};

	const handleSaveSubEvent = () => {
		const subEvents = [...formData.subEvents];
		subEvents[currentSubEvent] = { ...subEvent };
		formData.subEvents = subEvents;
		resetSubEvent();
	};

	const handleDelete = (index: number) => {
		const subEvents = [...formData.subEvents];
		subEvents.splice(index, 1);
		formData.subEvents = subEvents;
	};
</script>

<div class="grid grid-cols-3 gap-16">
	<div class="col-span-2 grid grid-cols-2 gap-6">
		<label class="label col-span-2">
			<span class="font-bold">Event Title</span>
			<input
				bind:value={subEvent.title}
				on:input={() => {
					formError.title = subEvent.title == '' ? 'Title field cannot be empty' : null;
				}}
				class="input p-2"
				type="text"
				placeholder="Title of your event"
			/>
			{#if formError.title}
				<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.title}</div>
			{/if}
		</label>
		<label class="label col-span-2">
			<span class="font-bold">Event Description</span>
			<textarea
				bind:value={subEvent.description}
				on:input={() => {
					formError.description =
						subEvent.description == '' ? 'Description field cannot be empty' : null;
				}}
				class="textarea p-2"
				rows="6"
				placeholder="Description of your event"
			/>
			{#if formError.description}
				<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.description}</div>
			{/if}
		</label>
		<label class="label">
			<span class="font-bold">Date & Time</span>
			<br />
			<input
				bind:value={subEvent.datetime}
				on:input={validateDate}
				type="datetime-local"
				style="color-scheme: dark;"
				class="input w-full p-2 rounded-token"
			/>
			{#if formError.datetime}
				<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.datetime}</div>
			{/if}
		</label>
		<label class="label">
			<span class="font-bold">Event Venue</span>
			<input
				bind:value={subEvent.venue}
				on:input={() => {
					formError.venue = subEvent.venue == '' ? 'Venue field cannot be empty' : null;
				}}
				class="input p-2"
				type="text"
				placeholder="Location of your event"
			/>
			{#if formError.venue}
				<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.venue}</div>
			{/if}
		</label>
		<label class="label">
			<span class="font-bold">Category</span>
			<select bind:value={subEvent.category} class="imput select p-2">
				{#each categories as category}
					<option value={category.categoryId}>{category.name} </option>
				{/each}
			</select>
		</label>
		<span />
		<p class="col-span-2">Make sure to click the <b>+ Add</b> button to save your sub-event!</p>
		{#if currentSubEvent == formData.subEvents.length}
			<button
				on:click={handleAddSubEvent}
				disabled={Object.values(subEvent).some((v) => v == '')}
				class="variant-outline-primary btn col-span-2 mx-auto w-96"
			>
				<span class="material-symbols-outlined mr-2">add</span>
				Add
			</button>
		{:else}
			<button
				on:click={handleSaveSubEvent}
				disabled={Object.values(subEvent).some((v) => v == '')}
				class="variant-outline-primary btn col-span-2 mx-auto w-96"
			>
				<span class="material-symbols-outlined mr-2">check</span>
				Save
			</button>
		{/if}
	</div>

	<div class="flex max-h-[34rem] flex-col gap-4 overflow-auto">
		<span class="font-bold">Added events</span>
		{#each formData.subEvents as subEvent, i}
			<div class="card variant-ghost-surface w-full p-3">
				<div class="flex justify-between">
					<span class="line-clamp-1 w-full overflow-ellipsis break-words px-3">
						{subEvent.title}
					</span>
					<div class="flex gap-4">
						<button on:click={() => handleEdit(i)} class="material-symbols-outlined"> edit </button>
						<button on:click={() => handleDelete(i)} class="material-symbols-outlined">
							delete
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if errorMessage}
		<p class="variant-ghost-error p-0.5 px-2 text-xs">
			{errorMessage}
		</p>
	{/if}
</div>
