<script>
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar
	gridColumns="lg:grid-cols-8 xl:grid-cols-4"
	slotLead="place-self-end"
	slotDefault="place-self-center align-middle lg:col-span-4 xl:col-span-2"
	slotTrail="hidden lg:flex lg:place-content-end lg:col-span-3 xl:col-span-1 xl:place-content-start"
>
	<svelte:fragment slot="lead">
		<img src="fiesta.svg" alt="fiesta logo" class="" />
	</svelte:fragment>
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] h-12">
		<input type="text" placeholder="Search" class="px-4 w-full max-w-72" />
		<select class="w-40 px-2 mr-2">
			<option value="0" disabled selected hidden>City</option>
		</select>
		<button class="btn input-group-shim w-14">
			<span class="material-symbols-outlined">search</span>
		</button>
	</div>
	<svelte:fragment slot="trail">
		<button class="btn variant-filled-primary">
			<span class="material-symbols-outlined align-middle mt-px">local_activity</span>
			<span class="font-bold">List Event</span>
		</button>
		<button class="btn variant-outline-primary rounded-3xl">
			<span class="material-symbols-outlined align-middle mr-1">login</span>
			<span class="font-bold mb-0.5">Login</span>
		</button>
	</svelte:fragment>
</AppBar>
