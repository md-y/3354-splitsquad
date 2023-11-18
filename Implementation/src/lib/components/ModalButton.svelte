<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	let modelOpen = false;
	export let title: string;
	export let buttonText: string = '';
	export let buttonClass: string = 'btn-primary';
</script>

<button type="button" class="btn {buttonClass}" on:click={() => (modelOpen = !modelOpen)}>
	{#if buttonText !== ''}
		{buttonText}
	{:else}
		<slot name="button" />
	{/if}
</button>
<Modal open={modelOpen} on:close={() => (modelOpen = !modelOpen)} {title} on:finish>
	<slot />
</Modal>
