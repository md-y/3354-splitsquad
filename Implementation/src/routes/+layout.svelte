<script lang="ts">
	import { base } from '$app/paths';
	import NotificationButton from '$lib/components/NotificationButton.svelte';
	import { updateUserStore, userStore } from '$lib/stores/user';
	import { onDestroy } from 'svelte';
	import '../app.scss';
	import type { PageData } from './$types';

	export let data: PageData;
	if (data.user) {
		userStore.set(data.user);
	}

	// Occasionally update the user store
	const userUpdateInterval = setInterval(() => {
		if ($userStore) updateUserStore();
	}, 5000);

	onDestroy(() => {
		clearInterval(userUpdateInterval);
	});
</script>

<svelte:head>
	<title>Splitsquad</title>
</svelte:head>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-5 justify-content-between px-4">
	<a class="navbar-brand" href="{base}/dashboard"> Splitsquad </a>
	{#if $userStore}
		<div class="d-flex gap-4">
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon" />
			</button>
			<h4>Welcome {$userStore.username}!</h4>
			<NotificationButton />
			<a href="{base}/expenses" class="btn btn-outline-primary">My Expenses</a>
			<a href="{base}/controller/logout" class="btn btn-outline-primary">Logout</a>
		</div>
	{/if}
</nav>
<slot />
