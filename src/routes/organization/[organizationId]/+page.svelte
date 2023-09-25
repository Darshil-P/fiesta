<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	const { organizationDetails } = data;
</script>

<img
	src={`/uploads/images/organizations/banner/${organizationDetails.bannerId}.webp`}
	alt="organization"
/>

<div class="my-8 flex flex-row gap-6">
	<Avatar
		src={`/uploads/images/organizations/logo/${organizationDetails.logoId}.webp`}
		width="max-w-[128px]"
		rounded="rounded-full"
	/>
	<div class="my-auto flex w-full flex-col gap-3">
		<span class="flex flex-row">
			<p class="my-auto overflow-hidden overflow-ellipsis whitespace-nowrap text-4xl font-bold">
				{organizationDetails.name}
			</p>
			{#if organizationDetails.verified}
				<span class="material-symbols-outlined mx-2 my-auto">verified</span>
			{/if}
		</span>
		<p class="text-lg">Joined: {new Date(organizationDetails.dateCreated).toLocaleDateString()}</p>
	</div>
</div>

<p class="mt-4 py-2 text-2xl font-bold">About</p>
<p>
	{organizationDetails.about}
</p>
