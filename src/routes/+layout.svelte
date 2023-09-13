<script>
	// Your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import 'material-symbols';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
<AppShell>
	<AppBar
		gridColumns="grid-cols-3"
		slotLead="place-self-center"
		slotDefault="place-self-start"
		slotTrail="place-content-center hidden 2xl:flex"
	>
		<svelte:fragment slot="lead">
			<img src="fiesta.svg" alt="fiesta logo" />
		</svelte:fragment>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] h-12">
			<input type="text" placeholder="Search" class="px-4 w-72" />
			<select class="w-40 px-2 mr-2">
				<option value="0" disabled selected hidden>City</option>
			</select>
			<button class="btn input-group-shim w-14">
				<span class="material-symbols-outlined">search</span>
			</button>
		</div>
		<svelte:fragment slot="trail">
			<button class="btn variant-filled-primary">
				<span><span class="material-symbols-outlined align-middle">local_activity</span></span>
				<span>List Event</span>
			</button>
			<button class="btn variant-outline-primary rounded-3xl">
				<span class="material-symbols-outlined align-middle mr-1">login</span>
				<span>Login</span>
			</button>
		</svelte:fragment>
	</AppBar>
	<slot />
</AppShell>
