import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss({
			safelist: {
				// any selectors that begin with "hljs-" will not be purged
				greedy: [/^hljs-/]
			}
		}),
		SvelteKitPWA({
			devOptions: {
				enabled: true
			},
			includeAssets: ['icons/favicon.ico'],
			manifest: {
				name: 'Fiesta',
				short_name: 'Fiesta',
				description: 'My Awesome App description',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'icons/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'icons/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: 'icons/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	]
});
