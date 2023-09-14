<script lang="ts">
	export let title: String;
	export let hostedBy: String;
	export let datetime: Date;
	export let venue: String;
	export let price: number;
</script>

<div class="card min-w-[20rem] rounded-3xl variant-glass variant-ringed-surface p-px">
	<header class="aspect-video">
		<img
			src="https://www.lightstalking.com/wp-content/uploads/backlit-beach-color-258109-3-1024x576.jpg"
			alt="event"
			class="aspect-video rounded-t-[24px]"
		/>
	</header>
	<div class="p-4 space-y-4">
		<h3 class="h3 font-bold overflow-hidden">{title}</h3>
		<h6 class="h6 text-neutral-300">Hoster by: {hostedBy}</h6>
		<div class="flex">
			<div
				class="card bg-gradient-to-br variant-gradient-tertiary-secondary aspect-square w-20 text-center p-1 rounded-xl align-middle my-auto"
			>
				<h4 class="h4">{datetime.toDateString().substring(4, 7)}</h4>
				<h2 class="h2">{datetime.getDate()}</h2>
			</div>
			<div class="px-6">
				<h5 class="h5">
					{datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Onwards
				</h5>
				<h5 class="h5">{venue}</h5>
				<h5 class="h5">₹ : {price > 0 ? price + ' Onwards' : 'Free!'}</h5>
			</div>
		</div>
	</div>
	<hr class="opacity-50" />
	<footer class="p-4 flex items-center">
		<button class="btn variant-filled-primary font-bold mx-auto">Get Your Pass!</button>
	</footer>
</div>
