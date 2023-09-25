<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/user';
	import type { User } from '$lib/types';
	import type { ActionData } from '../events/$types';

	export let form: ActionData;

	let formData = {
		email: 'APIEmail2@gmail.com',
		password: 'APIName2@1234'
	};

	let errorMessage = '';

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
		}
	};
</script>

<div class="card mx-auto my-16 flex h-fit max-w-xs flex-col gap-6 p-4">
	<h2 class="h2 font-bold">Login</h2>
	{#if form}<p class="text-error-50">{errorMessage}</p>{/if}
	<label class="label">
		<span>Email</span>
		<input
			class="input p-2"
			name="email"
			type="email"
			placeholder="example@mail.com"
			bind:value={formData.email}
		/>
	</label>
	<label class="label">
		<span>Password</span>
		<input class="input p-2" bind:value={formData.password} name="password" type="password" />
	</label>
	<button
		on:click={handleLogin}
		class="input variant-filled-primary btn mx-auto max-w-xs text-lg font-bold"
	>
		Submit
	</button>
</div>
