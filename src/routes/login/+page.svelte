<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/user';
	import type { User } from '$lib/types';

	let formData = {
		email: 'darshil@gmail.com',
		password: 'Darshil@1234'
	};

	let errorMessage: null | string;

	let visibility = false;

	const handleLogin = async () => {
		const { email, password } = formData;

		const response = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			})
		});

		if (response.status == 200) {
			const response = await fetch('/api/users/profile');
			const userDetails: User = await response.json();
			userStore.set(userDetails);
			goto('/');
		} else {
			errorMessage = (await response.json()).message;
		}
	};

	const toggleVisibility = () => (visibility = !visibility);
</script>

<form
	method="POST"
	on:submit|preventDefault={handleLogin}
	class="card variant-ghost-surface mx-auto my-8 grid max-w-3xl gap-6 px-32 py-6"
>
	<h2 class="h2 mx-auto font-bold">Login</h2>
	<hr />
	{#if errorMessage}<p class="variant-ghost-error p-0.5 px-2 text-xs">{errorMessage}</p>{/if}
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
	<button class="input variant-filled-primary btn mx-auto max-w-xs text-lg font-bold">
		Submit
	</button>
</form>
