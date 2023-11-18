<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="container">
	<form action="?/login" method="post">
		{#if form?.missing}
			<div class="alert alert-danger" role="alert">Missing username/password</div>
		{/if}
		{#if form?.incorrect}
			<div class="alert alert-danger" role="alert">Username/Password is incorrect</div>
		{/if}
		{#if form?.existing}
			<div class="alert alert-danger" role="alert">This username is taken</div>
		{/if}

		<div class="mb-3">
			<label for="usernameInput" class="form-label">Username</label>
			<input type="text" class="form-control" id="usernameInput" name="username" required />
		</div>
		<div class="mb-3">
			<label for="emailPassword" class="form-label">Password</label>
			<input type="password" class="form-control" id="emailPassword" name="password" required />
		</div>
		<button type="submit" class="btn btn-primary"> Login </button>
		<button type="submit" class="btn btn-primary" formaction="?/signup"> Signup </button>
	</form>
</div>
