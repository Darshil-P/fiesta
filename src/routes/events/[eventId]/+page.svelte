<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export const { eventDetails } = data;
	export const date = new Date(eventDetails.startDate);
</script>

<div class="grid grid-cols-2 place-content-between gap-8">
	<div>
		<img
			src={`/uploads/images/events/pictures/${data.eventDetails.imageIds[2]}`}
			alt="event"
			class="max-w-3xl rounded-3xl"
		/>
		<p class="mt-4 py-2 text-xl font-bold">About</p>
		<p>
			{data.eventDetails.description}
		</p>
		<p class="mt-4 py-2 text-xl font-bold">Terms & Conditions</p>
		<p>
			{data.eventDetails.terms}
		</p>
	</div>
	<div class="sticky top-0 h-96 max-w-sm justify-self-end">
		<div class="card variant-ringed-surface variant-glass mb-2 h-fit max-w-sm rounded-xl p-4">
			<header>
				<p class="text-4xl font-semibold">{data.eventDetails.name}</p>
			</header>
			<p class="my-2 text-neutral-300">
				Hosted by: {eventDetails.organization?.name ?? eventDetails.user?.name}
			</p>
			<div class="flex pt-1">
				<div
					class="card variant-gradient-tertiary-secondary min-w-[64px] self-start rounded-xl bg-gradient-to-br p-1 text-center"
				>
					<p>{date.toDateString().substring(4, 7)}</p>
					<p class="text-2xl">{date.getDate()}</p>
				</div>
				<div class="px-6">
					<p class="line-clamp-1 w-64 overflow-ellipsis break-words">
						Category: {eventDetails.category}
					</p>
					<p class="line-clamp-2 w-56 overflow-ellipsis break-words">
						Venue: {eventDetails.venue}dddddddd ddddddddd dddddddd d ddddddd d
					</p>
					<p class=" text-xl">
						{#if eventDetails.ticketPrice ?? -1 >= 0}
							₹ : {eventDetails.ticketPrice == 0 ? 'Free!' : eventDetails.ticketPrice}
						{/if}
					</p>
				</div>
			</div>
			<iframe
				title="location"
				class="mt-4 w-full rounded-xl"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1884.3372105404335!2d72.83561141078123!3d19.1657237872348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7ea09014a99%3A0x10bf2f18ae42adc8!2sSethia%20Sea-View!5e0!3m2!1sen!2sin!4v1695562277871!5m2!1sen!2sin"
				height="128"
				loading="lazy"
			></iframe>
			<footer class="mt-4">
				<button class="variant-filled-primary btn w-full font-bold">Get Your Pass!</button>
			</footer>
		</div>
	</div>
</div>
