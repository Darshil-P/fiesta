<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const getDateTime = (dateTime: Date) => {
		return `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime
			.getFullYear()
			.toString()
			.slice(-2)}, ${dateTime.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		})}`;
	};
</script>

<h2 class="h2">Booking History</h2>

{#each data.bookings as booking}
	<div
		class="card variant-ringed-surface variant-glass relative m-8 grid max-w-[840px] grid-cols-3 rounded-lg p-px"
	>
		<a href={`/events/${booking.eventId}`}>
			<img
				src={`/uploads/images/events/thumbnail/` + booking.thumbnailId}
				alt={booking.name}
				width="226px"
				class="m-2 mb-2 aspect-video overflow-hidden rounded-[8px]"
			/>
		</a>

		<div class="col-span-2 flex justify-evenly">
			<div class="space-y-1 p-3">
				<p class="line-clamp-1 overflow-hidden text-xl font-bold">{booking.name}</p>
				<p class="line-clamp-1 overflow-hidden font-semibold">
					Event Date: {booking.startDate}
				</p>
				<p class="line-clamp-1 overflow-ellipsis break-words font-semibold">
					Venue: {booking.venue}
				</p>
				<p class="line-clamp-1 overflow-hidden font-semibold">
					Pass ID: {booking.ticketId}
				</p>
			</div>
			<div class="space-y-1 p-3">
				<p class="line-clamp-1 overflow-hidden font-semibold">
					Transaction ID: {booking.transactionId}
				</p>
				<p class="line-clamp-1 overflow-hidden font-semibold">
					Amount: {booking.amount}
				</p>
				<p class="line-clamp-1 overflow-ellipsis break-words font-semibold">
					Booking Time: {getDateTime(new Date(booking.timestamp))}
				</p>
				<p class="line-clamp-1 overflow-hidden font-semibold">
					Payment Method: {booking.paymentMethod}
				</p>
			</div>
		</div>
	</div>
{/each}
