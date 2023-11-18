<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let open = false;
	export let showBackdrop = true;
	export let title: string = '';

	const modalClose = () => {
		open = false;
		dispatch('close');
	};
</script>

{#if open}
	<div
		class="modal"
		id="sampleModal"
		tabindex="-1"
		role="dialog"
		aria-labelledby="sampleModalLabel"
		aria-hidden={false}
	>
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="sampleModalLabel">{title}</h5>
					<button
						type="button"
						class="close"
						data-dismiss="modal"
						aria-label="Close"
						on:click={modalClose}
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<slot />
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-primary"
						on:click={() => {
							modalClose();
							dispatch('finish');
						}}
					>
						Finish
					</button>
				</div>
			</div>
		</div>
	</div>
	{#if showBackdrop}
		<div class="modal-backdrop show" />
	{/if}
{/if}

<style>
	.modal {
		display: block;
	}
</style>
