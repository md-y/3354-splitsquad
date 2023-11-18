<script lang="ts">
	import { userStore } from '$lib/stores/user';

	export let value = '';
	export let label = 'Select Payment Account';
</script>

<select class="form-select" aria-label={label} name="account" required bind:value>
	<option selected value="">{label}</option>
	{#each $userStore.paymentAccounts as account}
		<option value={account.id}>{account.name}</option>
	{/each}
</select>
