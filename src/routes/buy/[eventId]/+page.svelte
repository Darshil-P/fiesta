<script lang="ts">
	import { enhance } from '$app/forms';
	import { CARDCVV_REGEX, CARDNUMBER_REGEX, PHONE_REGEX, UPIID_REGEX } from '$lib/constants';
	import type { FormError } from '$lib/types';
	import type { PageServerData } from './$types';

	let walletBalance = 5000;
	let formValid = true;

	const paymentMethods = [
		{ key: 'wallet', value: 'Wallet' },
		{ key: 'upi_payment', value: 'UPI Payment' },
		{ key: 'credit_card', value: 'Credit Card' },
		{ key: 'debit_card', value: 'Debit Card' }
	];

	const formData = {
		upiId: ''
	};

	const cardData = {
		cardNumber: '',
		nameOnCard: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: ''
	};

	const formError: FormError = {
		upiId: null
	};

	const cardError: FormError = {
		cardNumber: '',
		nameOnCard: '',
		cvv: ''
	};

	let formVerify: FormError = {
		upiId: null
	};

	const validateForm = () => {
		if (paymentMethod == paymentMethods[0]) {
			return (formValid = true);
		}

		if (paymentMethod == paymentMethods[1]) {
			return (formValid = formVerify.upiId != null);
		}

		if (paymentMethod == paymentMethods[2] || paymentMethod == paymentMethods[3]) {
			return (formValid = !(
				Object.values(cardError).some((err) => err != null) ||
				Object.values(cardData).some((v) => v === '') != false
			));
		}

		formValid = false;
	};

	const validateUPI = () => {
		formValid = false;
		formVerify.upiId = null;

		if (formData.upiId == '') {
			return (formError.upiId = 'Field Cannot be Empty');
		}

		if (UPIID_REGEX.test(formData.upiId)) {
			return (formError.upiId = null);
		}

		if (PHONE_REGEX.test(formData.upiId)) {
			return (formError.upiId = null);
		}

		formError.upiId = 'Invalid UPI Id';
	};

	const verifyUPI = (event: MouseEvent) => {
		event.preventDefault();
		validateUPI();

		if (!formError.upiId) {
			formValid = true;
			return (formVerify.upiId = 'UPI Verified!');
		}
		formVerify.upiId = null;
	};

	const validateCardNumber = () => {
		formValid = false;
		if (cardData.cardNumber == '') {
			return (cardError.cardNumber = 'Card Number is required');
		}

		if (!CARDNUMBER_REGEX.test(cardData.cardNumber)) {
			return (cardError.cardNumber = 'Invalid Card Number');
		}

		cardError.cardNumber = null;
		validateForm();
	};

	const validateCVV = () => {
		formValid = false;

		if (cardData.cvv == '') {
			return (cardError.cvv = 'CVV is required');
		}

		if (!CARDCVV_REGEX.test(cardData.cvv)) {
			return (cardError.cvv = 'Invalid CVV');
		}

		cardError.cvv = null;
		validateForm();
	};

	export let data: PageServerData;

	const { ticketDetails } = data;

	let paymentMethod = paymentMethods[0];
</script>

<div class="card variant-ghost-surface mx-auto my-16 max-w-md p-8">
	<header>
		<h3 class="h3 pb-4 text-center font-bold">Booking Summary</h3>
	</header>
	<hr />
	<div class="my-4 grid grid-cols-2 gap-2 px-4">
		<h5 class="h5">Event:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			{ticketDetails.name}
		</p>

		<h5 class="h5">Event Date:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			{new Date(ticketDetails.startDate ?? '').toLocaleDateString()}
		</p>

		<h5 class="h5">Event Venue:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			{ticketDetails.venue}
		</p>

		<h5 class="h5">Price:</h5>
		<p class="line-clamp-1 overflow-ellipsis break-words">
			₹ : {ticketDetails.price}
		</p>
	</div>
	<hr />
	<form method="POST" class="grid grid-cols-1 gap-6 p-4" use:enhance>
		<input name="paymentMethod" hidden bind:value={paymentMethod} />
		{#if ticketDetails.type == 1}
			<label class="label grid grid-cols-2 gap-4">
				<span class="col-span-2 font-bold">Select payment Method</span>
				{#each paymentMethods as method}
					<button
						type="button"
						class="chip text-sm font-bold {paymentMethod === method
							? 'variant-filled'
							: 'variant-outline-surface'}"
						on:click={() => {
							paymentMethod = method;
							validateForm();
						}}
					>
						<span>{method.value}</span>
					</button>
				{/each}
			</label>
			<hr />

			{#if paymentMethod == paymentMethods[0]}
				Your Wallet Balance is: {walletBalance}
				<br />
				Balance after payment: {walletBalance - ticketDetails.price}
			{/if}

			{#if paymentMethod == paymentMethods[1]}
				<label class="label">
					<span class="font-bold">UPI ID</span>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input
							bind:value={formData.upiId}
							on:input={validateUPI}
							type="text"
							class="input p-2 rounded-token"
						/>
						<button
							class="variant-filled-surface font-semibold"
							on:click={(event) => verifyUPI(event)}>Verify</button
						>
					</div>

					{#if formError.upiId}
						<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.upiId}</div>
					{/if}

					{#if formVerify.upiId}
						<div class="variant-ghost-success p-0.5 px-2 text-xs">{formVerify.upiId}</div>
					{/if}
				</label>
			{/if}

			{#if paymentMethod == paymentMethods[2] || paymentMethod == paymentMethods[3]}
				<div class="grid grid-cols-2 gap-4">
					<label class="label col-span-2">
						<span class="font-bold">{paymentMethod.value} Number</span>
						<input
							bind:value={cardData.cardNumber}
							on:input={validateCardNumber}
							class="input p-2"
							type="text"
							maxlength="100"
							required
						/>
						{#if cardError.cardNumber}
							<div class="variant-ghost-error p-0.5 px-2 text-xs">{cardError.cardNumber}</div>
						{/if}
					</label>
					<label class="label col-span-2">
						<span class="font-bold">Name on Card</span>
						<input
							bind:value={cardData.nameOnCard}
							on:input={() =>
								(cardError.nameOnCard = cardData.nameOnCard == '' ? 'Name cannot be empty' : null)}
							class="input p-2"
							type="text"
							maxlength="100"
							placeholder="Name on Card"
							required
						/>
						{#if cardError.nameOnCard}
							<div class="variant-ghost-error p-0.5 px-2 text-xs">{cardError.nameOnCard}</div>
						{/if}
					</label>
					<label class="label">
						<span class="font-bold">Expiry Date</span>
						<div class="input-group input-group-divider grid-cols-[4fr_5fr]">
							<input
								bind:value={cardData.expiryMonth}
								type="number"
								min={new Date().toISOString().substring(5, 7)}
								placeholder="MM"
								style="color-scheme: dark;"
								class="input w-full p-2 rounded-token"
							/>
							<input
								bind:value={cardData.expiryYear}
								type="number"
								min={new Date().toISOString().substring(0, 4)}
								placeholder="YYYY"
								style="color-scheme: dark;"
								class="input w-full p-2 rounded-token"
							/>
						</div>
					</label>

					<label class="label">
						<span class="font-bold">CVV</span>
						<br />
						<input
							bind:value={cardData.cvv}
							on:input={validateCVV}
							type="text"
							minlength="3"
							maxlength="3"
							class="input w-full p-2 rounded-token"
						/>
						{#if cardError.cvv}
							<div class="variant-ghost-error p-0.5 px-2 text-xs">{cardError.cvv}</div>
						{/if}
					</label>
				</div>
			{/if}

			<hr />
		{/if}
		<footer>
			<button
				type="submit"
				disabled={!formValid}
				class="variant-filled-primary btn w-full font-bold"
			>
				Confirm
				{#if ticketDetails.type == 1}
					Payment
				{/if}
			</button>
		</footer>
	</form>
</div>
