<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { ...userProfile } = data;
</script>

<div>
	<h2 class="h2 px-16 py-6 font-bold">Profile</h2>

	<div class="my-8 flex flex-row gap-6 px-16">
		<Avatar
			src={`/uploads/images/avatar/${userProfile.avatarId}`}
			width="max-w-[128px]"
			rounded="rounded-full"
		/>
		<div class="my-auto flex w-full flex-col gap-3">
			<span class="flex flex-row">
				<p class="my-auto overflow-hidden overflow-ellipsis whitespace-nowrap text-4xl font-bold">
					{userProfile.name}
				</p>
			</span>
			<p class="text-lg">Joined: {new Date(userProfile.dateCreated).toLocaleDateString()}</p>
		</div>
	</div>

	<div class="my-4 px-16">
		<h3 class="h3 py-2 font-bold">About Me</h3>
		<p class="max-w-2xl">{userProfile.about}</p>
	</div>
</div>
