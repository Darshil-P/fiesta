<script lang="ts">
	let slider: HTMLDivElement;
	export let pictures: string[];

	function sliderLeft(): void {
		const x =
			slider.scrollLeft === 0
				? slider.clientWidth * slider.childElementCount
				: slider.scrollLeft - slider.clientWidth;
		slider.scroll(x, 0);
	}

	function sliderRight(): void {
		const x =
			slider.scrollLeft === slider.scrollWidth - slider.clientWidth
				? 0
				: slider.scrollLeft + slider.clientWidth;
		slider.scroll(x, 0);
	}
</script>

<div class="card variant-glass-surface grid w-full grid-cols-[auto_1fr_auto] items-center">
	<button
		type="button"
		class="variant-ringed-surface variant-glass btn-icon btn-icon-sm z-10"
		on:click={sliderLeft}
	>
		<span class="material-symbols-outlined">navigate_before</span>
	</button>
	<div
		bind:this={slider}
		class="hide-scrollbar relative -left-9 flex aspect-video w-[110.5%] snap-x snap-mandatory overflow-x-auto scroll-smooth"
	>
		{#each pictures as imageUrl}
			<img
				class="mx-auto snap-center rounded-container-token"
				src={imageUrl}
				alt="event"
				loading="lazy"
			/>
		{/each}
	</div>
	<button
		type="button"
		class="variant-ringed-surface variant-glass btn-icon btn-icon-sm z-10"
		on:click={sliderRight}
	>
		<span class="material-symbols-outlined">navigate_next</span>
	</button>
</div>
