<script lang="ts">
	import { base } from '$app/paths';
	import ModalButton from '$lib/components/ModalButton.svelte';
	import { updateUserStore, userStore } from '$lib/stores/user';
	import { getFormData } from '$lib/util/client';

	let accountForm: HTMLFormElement;
	async function addNewAccount() {
		const { name, default: isDefault } = getFormData(accountForm);
		await fetch(`${base}/controller/account`, {
			method: 'POST',
			body: JSON.stringify({
				name,
				default: new Boolean(isDefault) == true
			})
		});

		await updateUserStore();
	}

	let editAccountForm: HTMLFormElement;
	async function editAccount(id: string) {
		const { name, default: isDefault } = getFormData(editAccountForm);
		await fetch(`${base}/controller/account/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				name,
				default: new Boolean(isDefault) == true
			})
		});

		await updateUserStore();
	}
</script>

<div class="col">
	<h1>Accounts</h1>
	<br />
	<ModalButton
		title="Add New Payment Account"
		buttonText="New Payment Account"
		on:finish={addNewAccount}
	>
		<form bind:this={accountForm}>
			<div class="mb-3">
				<input class="form-control" name="name" placeholder="Name" type="text" />
			</div>
			<div class="form-check mb-3">
				<input
					class="form-check-input"
					type="checkbox"
					value="true"
					id="checkDefault"
					name="default"
				/>
				<label class="form-check-label" for="checkDefault">Default?</label>
			</div>
		</form>
	</ModalButton>
	{#each $userStore.paymentAccounts.sort((a, b) => b.balance - a.balance) as account}
		<div class="card mt-4">
			<div class="card-body">
				<h5 class="card-title">
					{account.name}
					{#if account.default}
						<span class="badge bg-success">Default</span>
					{/if}
				</h5>
				<p class="card-text">
					${account.balance}
				</p>
				<ModalButton
					title="Edit Account"
					buttonText="Edit"
					on:finish={() => editAccount(account.id)}
				>
					<form bind:this={editAccountForm}>
						<div class="mb-3">
							<input
								class="form-control"
								name="name"
								placeholder="Name"
								type="text"
								value={account.name}
							/>
						</div>
						<div class="form-check mb-3">
							<input
								class="form-check-input"
								type="checkbox"
								value="true"
								id="checkDefault"
								name="default"
								checked={account.default}
							/>
							<label class="form-check-label" for="checkDefault">Default?</label>
						</div>
					</form>
				</ModalButton>
			</div>
		</div>
	{/each}
</div>
