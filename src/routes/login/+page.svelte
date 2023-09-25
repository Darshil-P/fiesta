<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form method="POST" class="card mx-auto my-16 flex h-fit max-w-xs flex-col gap-6 p-4">
	<h2 class="h2 font-bold">Login</h2>
	{#if form}<p class="text-error-50">{form.message}</p>{/if}
	<label class="label">
		<span>Email</span>
		<input
			class="input p-2"
			name="email"
			type="email"
			placeholder="example@mail.com"
			value="APIEmail2@gmail.com"
		/>
	</label>
	<label class="label">
		<span>Password</span>
		<input class="input p-2" name="password" type="password" value="APIName2@1234" />
	</label>
	<button type="submit" class="input variant-filled-primary btn mx-auto max-w-xs text-lg font-bold">
		Submit
	</button>
</form>
