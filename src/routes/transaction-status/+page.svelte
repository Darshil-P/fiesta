<script lang="ts">
	import type { PageServerData } from '../$types';

	export let data: PageServerData;
</script>

<div class="card variant-ghost-surface mx-auto my-16 max-w-3xl p-8">
	<h1 class="h1 p-6">
		{#if data.transactionId}
			Transaction Successful!
		{:else}
			Transaction Failed!
		{/if}
	</h1>
	<hr />
	<p class="m-8 text-lg">
		{#if data.notSelling}
			Event is currently not selling tickets, try again later
			<br />
		{/if}
		{#if data.sold}
			Oops! All tickets for this event is sold out!
		{/if}
		{#if data.transactionId}
			Your Transaction ID is {data.transactionId}
			<br />
			<a href="/profile#pass" class="anchor">View your pass</a>
		{/if}
	</p>
	<a class="anchor m-8" href="/">Go to Home Page</a>
</div>
