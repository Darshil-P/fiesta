<script>

	// Your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<slot />
