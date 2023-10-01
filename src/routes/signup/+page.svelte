<script lang="ts">
	import { enhance } from '$app/forms';
	import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '$lib/constants';
	import type { FormError } from '$lib/types';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let formData = {
		name: 'YourName',
		email: 'darshil@gmail.com',
		mobile: '9234567890',
		password: 'Darshil@1234',
		rePassword: 'Darshil@1234'
	};

	let formError: FormError = {
		name: null,
		email: null,
		mobile: null,
		password: null,
		rePassword: null
	};

	$: formValid =
		(formError.name ||
			formError.email ||
			formError.mobile ||
			formError.password ||
			formError.rePassword) == null;

	let visibility = false;

	const validateName = () => {
		if (!NAME_REGEX.test(formData.name)) {
			return (formError.name = 'Name cannot contain special characters or numbers');
		}
		formError.name = null;
	};

	const validateMobile = () => {
		if (!PHONE_REGEX.test(formData.mobile)) {
			return (formError.mobile = 'Invalid Phone Number');
		}
		formError.mobile = null;
	};

	const validateEmail = () => {
		if (!EMAIL_REGEX.test(formData.email)) {
			return (formError.email = 'Invalid Email');
		}
		formError.email = null;
	};

	const validatePassword = () => {
		if (!PASSWORD_REGEX.test(formData.password)) {
			return (formError.password =
				'Password must contain uppercase, lowercase, numerical & a special character');
		}
		formError.password = null;

		if (formData.password != formData.rePassword) {
			return (formError.rePassword = "Passwords don't match");
		}
		formError.rePassword = null;
	};

	const toggleVisibility = () => (visibility = !visibility);
</script>

<form
	method="POST"
	class="card variant-ghost-surface mx-auto my-8 grid max-w-3xl grid-cols-2 gap-6 px-32 py-6"
	use:enhance
>
	<h2 class="h2 col-span-2 mx-auto font-bold">Let's get started</h2>
	<hr class="col-span-2" />
	{#if form}
		<span class="variant-ghost-error col-span-2 p-0.5 px-2 text-xs">
			{#if form.invalid}
				<ul class="ml-4 list-disc">
					<li>Name cannot contain special characters or numbers</li>
					<li>Phone number must be a valid</li>
					<li>Email address must be valid</li>
					<li>Password must contain uppercase, lowercase, numerical & a special character</li>
				</ul>
			{/if}
			{form.alreadyExist
				? 'Email or phone already registered'
				: form.error
				? 'Something went wrong, try again later'
				: ''}
		</span>
	{/if}
	<label class="label col-span-2">
		<span>Name</span>
		<input
			class="input p-2"
			bind:value={formData.name}
			on:input={validateName}
			type="text"
			name="name"
			placeholder="Your Name"
			required
			autocapitalize="words"
		/>
		{#if formError.name && formData.name != ''}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.name}</div>
		{/if}
	</label>
	<label class="label">
		<span>Phone</span>
		<input
			class="input p-2"
			bind:value={formData.mobile}
			on:input={validateMobile}
			name="mobile"
			type="text"
			placeholder="Phone Number"
			required
		/>
		{#if formError.mobile && formData.mobile != ''}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.mobile}</div>
		{/if}
	</label>
	<label class="label">
		<span>Email</span>
		<input
			class="input p-2"
			name="email"
			type="email"
			placeholder="example@mail.com"
			bind:value={formData.email}
			on:input={validateEmail}
			required
		/>
		{#if formError.email && formData.email != ''}
			<div class="variant-ghost-error p-0.5 px-2 text-xs">{formError.email}</div>
		{/if}
	</label>
	<label class="label">
		<span>Password</span>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			{#if visibility}
				<input
					class="input p-2"
					bind:value={formData.password}
					on:input={validatePassword}
					name="password"
					type="text"
					required
					autocomplete="off"
				/>
			{:else}
				<input
					class="input p-2"
					bind:value={formData.password}
					on:input={validatePassword}
					name="password"
					type="password"
					required
				/>
			{/if}
			<a on:mousedown={toggleVisibility} href="/signup" class="material-symbols-outlined my-auto">
				{visibility ? 'visibility' : 'visibility_off'}
			</a>
		</div>
	</label>
	<label class="label">
		<span>Re-Enter Password</span>
		<input
			class="input p-2"
			bind:value={formData.rePassword}
			on:input={validatePassword}
			on:paste={(event) => event.preventDefault()}
			name="password"
			type="password"
			required
		/>
	</label>
	{#if formError.password && formData.password != ''}
		<div class="variant-ghost-error col-span-2 p-0.5 px-2 text-xs">{formError.password}</div>
	{/if}
	{#if formError.rePassword && formData.rePassword != ''}
		<div class="variant-ghost-error col-span-2 p-0.5 px-2 text-xs">{formError.rePassword}</div>
	{/if}
	<button
		type="submit"
		disabled={!formValid}
		class="input variant-filled-primary btn col-span-2 mx-auto max-w-xs text-lg font-bold"
	>
		Create Account
	</button>
</form>
