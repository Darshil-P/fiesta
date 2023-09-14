<script>
	// Your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	import { AppBar } from '$lib';
	import { AppShell } from '@skeletonlabs/skeleton';
	import 'material-symbols';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
<AppShell>
	<AppBar />
	<slot />
</AppShell>
