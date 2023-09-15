<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	export let imageUrl: string;
	export let title: string;
	export let verified: boolean;
</script>

<div class="card min-w-[320px] max-w-[272px] p-4">
	<div class="flex flex-row">
		<Avatar src={imageUrl} width="max-w-[64px]" rounded="rounded-full" />
		<h4 class="h4 my-auto ml-4 mr-auto h-8 overflow-hidden whitespace-nowrap overflow-ellipsis">
			{title}
		</h4>
		{#if verified}
			<span class="material-symbols-outlined my-auto pb-1">verified</span>
		{/if}
	</div>
</div>
