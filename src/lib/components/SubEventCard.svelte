<script lang="ts">
	export let name: string;
	export let description: string;
	export let datetime: Date;
	export let venue: string | null;
	export let category: string | undefined;
</script>

<div class="card my-4 grid w-[768px] grid-cols-3 p-4">
	<div class="flex">
		<div
			class="card variant-gradient-tertiary-secondary min-w-[64px] self-start rounded-xl bg-gradient-to-br p-1 text-center"
		>
			<p>{datetime.toDateString().substring(4, 7)}</p>
			<p class="text-2xl">{datetime.getDate()}</p>
		</div>
		<div class="px-6">
			<p class="text-sm">
				{datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Onwards
			</p>
			{#if venue}
				<p class="line-clamp-2 max-w-[144px] overflow-ellipsis break-words text-sm">
					Venue: {venue}
				</p>
			{/if}
			{#if category}
				<p class="line-clamp-1 max-w-[144px] overflow-ellipsis break-words text-sm">
					{category}
				</p>
			{/if}
		</div>
	</div>
	<div class="col-span-2 text-left">
		<p class="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-bold">
			{name}
		</p>
		<p class="text-sm">
			{description}
		</p>
	</div>
</div>
