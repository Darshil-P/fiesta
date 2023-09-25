<script lang="ts">
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

	let type = 'Free';

	function section(c: string): void {
		type = c;
	}

	let amountDisabled: boolean;
	$: amountDisabled = type == 'Free';
</script>

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
		<span class="font-bold">Organization</span>
		<select class="select">
			{#each organizations as organization}
				<option value={organization.id}>{organization.value} </option>
			{/each}
		</select>
	</label>
	<label class="label">
		<span class="font-bold">Category</span>
		<select class="select">
			{#each categories as category}
				<option value={category.id}>{category.value} </option>
			{/each}
		</select>
	</label>
	<label class="label">
		<span class="font-bold">Ticket</span>
		<div class="my-auto mt-4 flex flex-row gap-4 align-middle">
			{#each ['Free', 'Paid'] as c}
				<button
					class="chip text-sm font-bold {type === c ? 'variant-filled' : 'variant-outline-surface'}"
					on:click={() => {
						section(c);
					}}
					on:keypress
				>
					<span>{c}</span>
				</button>
			{/each}
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">
					<span class="material-symbols-outlined">currency_rupee</span>
				</div>
				<input
					class="input p-2"
					type="number"
					disabled={amountDisabled}
					placeholder="Ticket Price"
				/>
			</div>
		</div>
	</label>
</div>
