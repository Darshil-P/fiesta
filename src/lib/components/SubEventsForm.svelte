<script lang="ts">
	export let categories = [
		{ id: 1, value: 'Option 1' },
		{ id: 2, value: 'Option 2' },
		{ id: 3, value: 'Option 3' },
		{ id: 4, value: 'Option 4' },
		{ id: 5, value: 'Option 5' }
	];

	let type = 'Free';

	function section(c: string): void {
		type = c;
	}

	let amountDisabled: boolean;
	$: amountDisabled = type == 'Free';

	let valueMultiple = [1, 2];

	let subEvents = [
		{ id: 1, name: 'Sub Event 1' },
		{ id: 2, name: 'Sub Event 2' },
		{ id: 3, name: 'Sub Event 3' }
	];
</script>

<div class="grid grid-cols-1 gap-16">
	<div class="grid grid-cols-2 gap-6">
		<label class="label col-span-2">
			<span class="font-bold">Event Title</span>
			<input class="input p-2" type="text" placeholder="Title of your event" />
		</label>
		<label class="label col-span-2">
			<span class="font-bold">Event Description</span>
			<textarea class="textarea p-2" rows="6" placeholder="Description of your event" />
		</label>
		<label class="label">
			<span class="font-bold">Start Date</span>
			<br />
			<input
				type="datetime-local"
				style="color-scheme: dark;"
				class="input w-full p-2 rounded-token"
			/>
		</label>
		<label class="label">
			<span class="font-bold">End Date</span>
			<br />
			<input
				type="datetime-local"
				style="color-scheme: dark;"
				class="input w-full p-2 rounded-token"
			/>
		</label>
		<label class="label">
			<span class="font-bold">Event Venue</span>
			<input class="input p-2" type="text" placeholder="Location of your event" />
		</label>
		<label class="label">
			<span class="font-bold">Category</span>
			<select class="select">
				{#each categories as category}
					<option value={category.id}>{category.value} </option>
				{/each}
			</select>
		</label>
		<button class="variant-outline-primary btn col-span-2 mx-auto w-96">
			<span class="material-symbols-outlined mr-2">add</span>
			Add more
		</button>
	</div>

	<div class="flex flex-col gap-4">
		{#each subEvents as subEvent}
			<div class="p- card variant-ghost-surface mx-auto w-[28rem] p-3">
				<div class="flex justify-between">
					<span>{subEvent.name}</span>
					<div class="flex gap-4">
						<span class="material-symbols-outlined">edit</span>
						<span class="material-symbols-outlined">delete</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
