<script lang="ts">
	import { base } from '$app/paths';
	import { updateUserStore, userStore } from '$lib/stores/user';
	import { onMount } from 'svelte';

	let notifications: typeof $userStore.notifications;
	$: notifications = $userStore.notifications.sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);

	onMount(async () => {
		await fetch(`${base}/controller/notifications/readcount`, {
			method: 'PUT',
			body: JSON.stringify({ count: $userStore.notifications.length })
		});
		await updateUserStore();
	});
</script>

<div class="m-4">
	<h1>Notifications</h1>
	<br />
	{#each notifications as notification}
		<div class="card p-2">
			<div class="card-body">
				<h5 class="card-title">
					{notification.content}
				</h5>
				<p class="card-text">{notification.timestamp}</p>
			</div>
		</div>
	{/each}
</div>
