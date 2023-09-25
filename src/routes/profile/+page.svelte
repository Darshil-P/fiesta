<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/user';
	import { Avatar } from '@skeletonlabs/skeleton';

	if (!$userStore) {
		goto('/login');
	}

	const userProfile = $userStore!;

	const handleLogout = async () => {
		userStore.set(null);
		const response = await fetch('/api/auth/logout', { method: 'POST' });

		if (response.status == 200) {
			goto('/');
		}
	};
</script>

<h1 class="py-6 text-3xl font-bold">Your Profile</h1>

<div class="my-8 flex flex-row gap-6">
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
	<button
		on:click={handleLogout}
		class="variant-outline-primary btn my-8 h-fit place-self-end rounded-3xl"
	>
		Logout
	</button>
</div>
