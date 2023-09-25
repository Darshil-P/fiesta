<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	export let imageUrl: string;
	export let title: string;
	export let verified: boolean;
	export let href: string;
</script>

<a {href} class="card variant-ringed-surface variant-glass card-hover block w-full p-4">
	<section class="flex flex-row">
		<Avatar src={imageUrl} width="max-w-[64px]" rounded="rounded-full" />
		<h4 class="h4 my-auto ml-4 mr-auto h-8 overflow-hidden overflow-ellipsis whitespace-nowrap">
			{title}
		</h4>
		{#if verified}
			<span class="material-symbols-outlined my-auto pb-1">verified</span>
		{/if}
	</section>
</a>
