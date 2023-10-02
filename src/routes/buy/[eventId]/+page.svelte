<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	const paymentMethods = [
		{ key: 'wallet', value: 'Wallet' },
		{ key: 'upi_payment', value: 'UPI Payment' },
		{ key: 'credit_card', value: 'Credit Card' },
		{ key: 'debit_card', value: 'Debit Card' }
	];

	export let data: PageServerData;

	const { ticketDetails } = data;

	let paymentMethod = 'wallet';
</script>

<div class="card variant-ghost-surface mx-auto my-16 max-w-md p-8">
	<header>
		<h3 class="h3 pb-4 text-center font-bold">Booking Summary</h3>
	</header>
	<hr />
	<div class="my-4 grid grid-cols-2 gap-2 px-4">
		<h5 class="h5">Event:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			{ticketDetails.name}
		</p>

		<h5 class="h5">Event Date:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			{new Date(ticketDetails.startDate ?? '').toLocaleDateString()}
		</p>

		<h5 class="h5">Event Venue:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			{ticketDetails.venue}
		</p>

		<h5 class="h5">Price:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			₹ : {ticketDetails.price}
		</p>
	</div>
	<hr />
	<form method="POST" class="grid grid-cols-1 gap-6 p-4" use:enhance>
		<input name="paymentMethod" hidden bind:value={paymentMethod} />
		{#if ticketDetails.type == 1}
			<label class="label grid grid-cols-2 gap-4">
				<span class="col-span-2 font-bold">Select payment Method</span>
				{#each paymentMethods as method}
					<button
						type="button"
						class="chip text-sm font-bold {paymentMethod === method.key
							? 'variant-filled'
							: 'variant-outline-surface'}"
						on:click={() => {
							paymentMethod = method.key;
						}}
						on:keypress
					>
						<span>{method.value}</span>
					</button>
				{/each}
			</label>
			<hr />
		{/if}
		<footer>
			<button type="submit" class="variant-filled-primary btn w-full font-bold">
				Confirm
				{#if ticketDetails.type == 1}
					Payment
				{/if}
			</button>
		</footer>
	</form>
</div>
