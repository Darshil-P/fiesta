<script>
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar
	gridColumns="grid-cols-5"
	slotLead="place-self-start"
	slotDefault="place-self-start col-span-3"
	slotTrail="place-content-end"
	regionRowMain="max-w-7xl place-self-center"
>
	<svelte:fragment slot="lead">
		<img src="/fiesta.svg" alt="fiesta logo" />
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
		<button class="variant-filled-primary btn">
			<span class="material-symbols-outlined mt-px align-middle">local_activity</span>
			<span class="font-bold">List Event</span>
		</button>
		<button class="variant-outline-primary btn rounded-3xl">
			<span class="material-symbols-outlined mr-1 align-middle">login</span>
			<span class="mb-0.5 font-bold">Login</span>
		</button>
	</svelte:fragment>
</AppBar>
