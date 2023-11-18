<script lang="ts">
	import FriendsColumn from './FriendsColumn.svelte';
	import GroupsColumn from './GroupsColumn.svelte';
	import AccountColumn from './AccountColumn.svelte';
	import SplitColumn from './SplitColumn.svelte';
</script>

<div class="row mx-5">
	<SplitColumn />
	<FriendsColumn />
	<GroupsColumn />
	<AccountColumn />
</div>
