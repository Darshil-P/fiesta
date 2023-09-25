<script lang="ts">
	// Your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	import { AppBar, Footer } from '$lib';
	import { AppShell } from '@skeletonlabs/skeleton';
	import 'material-symbols';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
<AppShell>
	<svelte:fragment slot="header">
		<AppBar />
	</svelte:fragment>
	<div class="mx-auto min-h-screen max-w-7xl p-4">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
