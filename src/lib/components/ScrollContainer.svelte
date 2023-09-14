<script lang="ts">
	let carousel: HTMLDivElement;

	function scrollLeft(): void {
		let x = carousel.scrollWidth;
		if (carousel.scrollLeft !== 0) x = carousel.scrollLeft - carousel.clientWidth;
		carousel.scroll(x, 0);
	}

	function scrollRight(): void {
		let x = 0;
		// -1 is used because different browsers use different methods to round scrollWidth pixels.
		if (carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 1)
			x = carousel.scrollLeft + carousel.clientWidth;
		carousel.scroll(x, 0);
	}
</script>

<div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
	<!-- Button: Left -->
	<button type="button" class="btn-icon variant-filled" on:click={scrollLeft}>
		<span class="material-symbols-outlined">navigate_before</span>
	</button>
	<!-- Carousel -->
	<div
		bind:this={carousel}
		class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto hide-scrollbar"
	>
		<slot />
	</div>
	<!-- Button-Right -->
	<button type="button" class="btn-icon variant-filled" on:click={scrollRight}>
		<span class="material-symbols-outlined">navigate_next</span>
	</button>
</div>
