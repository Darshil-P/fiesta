<script lang="ts">
	import type { User } from '$lib/types';
	import { AppBar, Avatar, LightSwitch } from '@skeletonlabs/skeleton';

	export let user: User;
</script>

<AppBar
	gridColumns="grid-cols-5"
	slotLead="place-self-start"
	slotDefault="place-self-start col-span-3"
	slotTrail="place-content-end"
	regionRowMain="max-w-7xl place-self-center"
>
	<svelte:fragment slot="lead">
		<a href="/"><img src="/fiesta.svg" alt="fiesta logo" /></a>
	</svelte:fragment>
	<div class="input-group input-group-divider h-12 grid-cols-[auto_1fr_auto]">
		<input type="text" placeholder="Search" class="w-72 px-4" />
		<select class="mr-2 w-40 px-2">
			<option value="0" disabled selected hidden>City</option>
		</select>
		<button class="input-group-shim btn w-14">
			<span class="material-symbols-outlined">search</span>
		</button>
	</div>
	<svelte:fragment slot="trail">
		<a href="/events" class="variant-filled-primary btn">
			<span class="material-symbols-outlined mt-px align-middle">local_activity</span>
			<span class="font-bold">List Event</span>
		</a>
		{#if user}
			<a href="/profile" class="variant-outline-primary btn btn-sm rounded-3xl">
				<Avatar
					src={`/uploads/images/avatar/${user.avatarId}`}
					width="max-w-[64px] w-8"
					rounded="rounded-full"
				/>
				<span
					class="mb-0.5 line-clamp-1 max-w-[96px] overflow-ellipsis whitespace-break-spaces break-words font-bold"
					>{user.name}</span
				>
			</a>
		{:else}
			<a href="/login" class="variant-outline-primary btn rounded-3xl">
				<span class="material-symbols-outlined mr-1 align-middle">login</span>
				<span class="mb-0.5 font-bold">Login</span>
			</a>
		{/if}
		<LightSwitch class="min-w-[48px]" />
	</svelte:fragment>
</AppBar>
