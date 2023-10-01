<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let formData = {
		email: 'darshil@gmail.com',
		password: 'Darshil@1234'
	};

	let visibility = false;

	export let form: ActionData;

	const toggleVisibility = () => (visibility = !visibility);
</script>

<form
	method="POST"
	class="card variant-ghost-surface mx-auto my-8 grid max-w-3xl gap-6 px-32 py-6"
	use:enhance
>
	<h2 class="h2 mx-auto font-bold">Login</h2>
	<hr />
	{#if form}
		<p class="variant-ghost-error p-0.5 px-2 text-xs">
			{form.email
				? 'Invalid Email'
				: form.notFound
				? 'Email Not Registered'
				: form.password
				? 'Incorrect Password'
				: form.error
				? 'Something went wrong, please try again later'
				: ''}
		</p>
	{/if}
	<label class="label">
		<span>Email</span>
		<input
			class="input p-2"
			name="email"
			type="email"
			placeholder="example@mail.com"
			required
			bind:value={formData.email}
		/>
	</label>
	<label class="label">
		<span>Password</span>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			{#if visibility}
				<input
					class="input p-2"
					bind:value={formData.password}
					name="password"
					type="text"
					required
				/>
			{:else}
				<input
					class="input p-2"
					bind:value={formData.password}
					name="password"
					type="password"
					required
				/>
			{/if}
			<a on:mousedown={toggleVisibility} href="/login" class="material-symbols-outlined my-auto">
				{visibility ? 'visibility' : 'visibility_off'}
			</a>
		</div>
	</label>
	<span class="text-right text-sm">
		Dont have an Account? <a href="/signup" class="anchor">Create one now</a>
	</span>
	<button class="input variant-filled-primary btn mx-auto max-w-xs text-lg font-bold" type="submit">
		Submit
	</button>
</form>
