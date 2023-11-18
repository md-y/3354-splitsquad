<script lang="ts">
	import { updateUserStore } from '$lib/stores/user';
	import { createEventDispatcher } from 'svelte';
	import ModalButton from './ModalButton.svelte';
	const dispatch = createEventDispatcher();

	export let endpoint: string;
	export let method: string = 'GET';
	export let body: BodyInit | undefined = undefined;
	export let className: string = 'btn-primary';
	export let confirm = false;

	async function handleClick() {
		const res = await fetch(endpoint, { method, body });
		if (res.status < 400) dispatch('response', await res.json());
		await updateUserStore();
	}
</script>

{#if confirm}
	<ModalButton title="Confirm" on:finish={handleClick} buttonClass={className}>
		<div slot="button">
			<slot />
		</div>
		<p>Are you sure? Press "Finish" to continue.</p>
	</ModalButton>
{:else}
	<button on:click={handleClick} class="btn {className}"><slot /></button>
{/if}
