<script lang="ts">
	import type { FormError } from '$lib/types';

	const ticketTypes = [
		{ key: 0, value: 'Free' },
		{ key: 1, value: 'Paid' }
	];

	const eventStatus = [
		{ key: 0, value: 'Upcoming' },
		{ key: 1, value: 'Selling' }
	];

	export let formData = {
		eventStatus: 0,
		ticketType: 0,
		ticketsTotal: 100,
		ticketPrice: 100
	};

	export let formError: FormError = {
		ticketsTotal: null,
		ticketPrice: null
	};

	export let formInvalid;
	$: formInvalid = Object.values(formError).some((err) => err != null);

	const validateTicketPrice = () => {
		if (formData.ticketType == 0) {
			formError.ticketPrice = null;
			return (formData.ticketPrice = 0);
		}
		if (formData.ticketPrice == null || formData.ticketPrice < 50 || formData.ticketPrice > 500) {
			return (formError.ticketPrice = 'Ticket price must be within the range 50 - 500');
		}
		formError.ticketPrice = null;
	};

	const validateTicketsTotal = () => {
		if (!Number.isInteger(formData.ticketsTotal)) {
			return (formError.ticketsTotal = 'Invalid number');
		}

		if (formData.ticketsTotal == null || formData.ticketsTotal < 1 || formData.ticketsTotal > 100) {
			return (formError.ticketsTotal = 'Total Tickets must be within the range 1 - 100');
		}
		formError.ticketsTotal = null;
	};

	$: amountDisabled = formData.ticketType == 0;
</script>

<div class="grid grid-cols-4">
	<span class="col-span-1" />
	<form class="col-span-2 grid grid-cols-2 gap-6">
		<label class="label">
			<span class="font-bold">Event Status</span>
			<select bind:value={formData.eventStatus} class="select">
				{#each eventStatus as status}
					<option value={status.key}>{status.value} </option>
				{/each}
			</select>
		</label>
		<label class="label">
			<span class="font-bold">Total Tickets</span>
			<input
				bind:value={formData.ticketsTotal}
				on:input={validateTicketsTotal}
				class="input p-2"
				type="number"
				placeholder="Total number of tickets"
			/>
			{#if formError.ticketsTotal}
				<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.ticketsTotal}</div>
			{/if}
		</label>
		<label class="label">
			<span class="font-bold">Type</span>
			<div class="my-auto mt-4 flex flex-row gap-4 align-middle">
				{#each ticketTypes as type}
					<button
						class="chip text-sm font-bold {formData.ticketType === type.key
							? 'variant-filled'
							: 'variant-outline-surface'}"
						on:click={() => {
							formData.ticketType = type.key;
							formData.ticketPrice = 100;
							validateTicketPrice();
						}}
						on:keypress
					>
						<span>{type.value}</span>
					</button>
				{/each}
			</div>
		</label>
		<label>
			<span class="font-bold">Price</span>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">
					<span class="material-symbols-outlined">currency_rupee</span>
				</div>
				<input
					bind:value={formData.ticketPrice}
					on:input={validateTicketPrice}
					class="input p-2"
					type="number"
					disabled={amountDisabled}
					placeholder="Ticket Price"
				/>
			</div>
			{#if formError.ticketPrice}
				<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.ticketPrice}</div>
			{/if}
		</label>
		<div class="col-span-2">
			<p>Note:</p>
			<ul class="ml-4 list-disc">
				<li>Ticket details for "Upcoming" events will not be visible.</li>
				<li>Users can buy tickets if event status is "Selling".</li>
				<li>To sell more than 100 tickets, the user or the organization must be verified.</li>
				<li>To sell tickets for more than ₹500, the user or the organization must be verified.</li>
				<li>The event will be visible publically once you click on the "Complete" button.</li>
			</ul>
		</div>
	</form>
	<span class="col-span-1" />
</div>
