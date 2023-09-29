<script lang="ts">
	export let imageUrl: string;
	export let name: string;
</script>

<div class="card variant-ghost-surface mx-auto w-[24rem] p-3">
	<div class="flex justify-between">
		<div class="aspect-video h-16">
			<img src={imageUrl} alt={name} class="h-16 rounded-token" />
		</div>
		<span class="line-clamp-3 w-full overflow-ellipsis break-words px-3 text-sm">
			{name}
		</span>
		<div class="flex gap-4">
			<button class="material-symbols-outlined">delete</button>
		</div>
	</div>
</div>
