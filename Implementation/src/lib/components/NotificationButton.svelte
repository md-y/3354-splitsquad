<script lang="ts">
	import { base } from '$app/paths';
	import { userStore } from '$lib/stores/user';

	let unreadCount = 0;
	$: if ($userStore?.notifications) {
		unreadCount = $userStore.notifications.length - $userStore.readNotificationCount;
	}
</script>

<a href="{base}/notifications" class="btn btn-outline-primary">
	Notifications
	{#if unreadCount > 0}
		<span class="badge bg-danger">{unreadCount}</span>
	{/if}
</a>
