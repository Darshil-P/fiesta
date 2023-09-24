<script lang="ts">
	export let title: string;
	export let hostedBy: string;
	export let imageUrl: string;
	export let datetime: Date;
	export let category: string;
	export let venue: string;
	export let price: number;
</script>

<div
	class="card variant-ringed-surface variant-glass card-hover m-2 min-w-[20rem] rounded-3xl p-px"
>
	<header class="aspect-video">
		<img
			src={imageUrl}
			alt="event"
			height="180px"
			width="320px"
			class="mb-2 aspect-video rounded-t-[24px]"
		/>
	</header>
	<div class="space-y-1 px-4 pb-3">
		<p class="overflow-hidden text-2xl font-bold">{title}</p>
		<p class="text-neutral-300">Hosted by: {hostedBy}</p>
		<div class="flex pt-1">
			<div
				class="card variant-gradient-tertiary-secondary h-14 min-w-[64px] items-center rounded-xl bg-gradient-to-br text-center"
			>
				<p>{datetime.toDateString().substring(4, 7)}</p>
				<p class="text-2xl">{datetime.getDate()}</p>
			</div>
			<div class="px-6">
				<p class="line-clamp-1 w-48 overflow-ellipsis break-words text-sm">
					Category: {category}
				</p>
				<p class="line-clamp-2 w-48 overflow-ellipsis break-words text-sm">
					Venue: {venue}
				</p>
			</div>
		</div>
	</div>
	<hr class="opacity-50" />
	<footer class="flex items-center justify-between p-3">
		<p class="mx-4 text-xl">
			{#if price >= 0}
				₹ : {price == 0 ? 'Free!' : price}
			{/if}
		</p>
		<button class="variant-filled-primary btn btn-sm mx-4 font-bold">Get Your Pass!</button>
	</footer>
</div>
