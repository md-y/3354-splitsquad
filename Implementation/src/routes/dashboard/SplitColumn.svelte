<script lang="ts">
	import { base } from '$app/paths';
	import AccountDropdown from '$lib/components/AccountDropdown.svelte';
	import EndpointButton from '$lib/components/EndpointButton.svelte';
	import ModalButton from '$lib/components/ModalButton.svelte';
	import { updateUserStore, userStore } from '$lib/stores/user';
	import { getFormData } from '$lib/util/client';
	import type { Prisma } from '@prisma/client';

	let newSplitForm: HTMLFormElement;
	let newSplitFormType: string = 'OneTime';
	async function newSplitRequest() {
		const data = getFormData<Record<string, string | string[]>>(newSplitForm);
		const { account, description, friend, group, name, period, total, type } = data;
		const friends = typeof friend === 'string' ? [friend] : friend ?? [];
		const groups = typeof group === 'string' ? [group] : group ?? [];

		const groupMembers: string[] = [];
		for (const id of groups) {
			const res = await fetch(`${base}/model/group/${id}`);
			const body = (await res.json()) as Prisma.GroupGetPayload<{ include: { members: true } }>;
			groupMembers.push(...body.members.map((m) => m.id));
		}

		const members = Array.from(new Set(friends.concat(groupMembers)));

		await fetch(`${base}/controller/split`, {
			method: 'POST',
			body: JSON.stringify({
				members,
				name,
				description,
				paymentAccountId: account,
				type,
				total: parseFloat(total as string),
				...(period ? { period: parseInt(period as string) } : {})
			})
		});

		await updateUserStore();
	}

	let splitRequestPaymentAccount: string;
	async function paySplitRequest(id: string) {
		if (!splitRequestPaymentAccount) return;

		const res = await fetch(
			`${base}/controller/split/request/${id}?account=${splitRequestPaymentAccount}`,
			{
				method: 'DELETE'
			}
		);

		if (res.status === 400) alert(`Not enough balance.`);

		await updateUserStore();
	}
</script>

<div class="col">
	<h1>Splits</h1>
	<br />
	<ModalButton title="Provide Info" buttonText="New Split" on:finish={newSplitRequest}>
		<form bind:this={newSplitForm}>
			<input
				type="text"
				class="form-control"
				placeholder="Name"
				aria-label="Name"
				aria-describedby="basic-addon1"
				name="name"
				required
			/>
			<br />
			<input
				type="text"
				class="form-control"
				placeholder="Description"
				aria-label="Description"
				aria-describedby="basic-addon1"
				name="description"
				required
			/>
			<br />
			<AccountDropdown />
			<br />
			<input
				type="number"
				class="form-control"
				placeholder="Total ($)"
				aria-label="Total ($)"
				aria-describedby="basic-addon1"
				name="total"
				required
			/>
			<br />
			<select
				class="form-select"
				aria-label="Select Split Type"
				name="type"
				bind:value={newSplitFormType}
				required
			>
				<option selected value="OneTime">One-Time</option>
				<option selected value="Recurring">Recurring</option>
			</select>
			<br />

			{#if newSplitFormType === 'Recurring'}
				<input
					type="number"
					class="form-control"
					placeholder="Period (days)"
					aria-label="Period (days)"
					aria-describedby="basic-addon1"
					name="period"
					required
				/>
				<br />
			{/if}

			<h6>Add Friends</h6>
			{#each $userStore.friends as friend}
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						value={friend.id}
						name="friend"
						id="split-select-{friend.id}"
					/>
					<label class="form-check-label" for="split-select-{friend.id}">{friend.username}</label>
				</div>
			{/each}
			<br />
			<h6>Add Groups</h6>
			{#each $userStore.groups as group}
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						value={group.id}
						name="group"
						id="split-select-{group.id}"
					/>
					<label class="form-check-label" for="split-select-{group.id}">{group.name}</label>
				</div>
			{/each}
		</form>
	</ModalButton>
	<div class="mb-2" />
	{#each $userStore.receivedSplitRequests as req}
		<div class="card border border-danger">
			<div class="card-body">
				<h5 class="card-title">${req.amount} to {req.sender.username}</h5>
				<ModalButton
					title="Select Account to Pay With"
					buttonText="Pay"
					on:finish={() => paySplitRequest(req.id)}
				>
					<AccountDropdown bind:value={splitRequestPaymentAccount} />
				</ModalButton>
			</div>
		</div>
	{/each}
	{#if $userStore.ownedSplits.length > 0}
		<hr />
		<h3>Owned Splits</h3>
		{#each $userStore.ownedSplits as split}
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">{split.name} - ${split.totalPayed} of ${split.total}</h5>
					<p class="card-text">
						{#if split.type === 'Recurring'}
							Recurs every {split.period} days
						{:else}
							One Time Payment
						{/if}
					</p>
					<EndpointButton
						endpoint="{base}/controller/split/{split.id}"
						method="DELETE"
						className="btn-danger"
						confirm={split.totalPayed < split.total}
					>
						Dismiss
					</EndpointButton>
				</div>
			</div>
		{/each}
	{/if}
	{#if $userStore.sentSplitRequests.length > 0}
		<hr />
		<h3>Pending Payments</h3>
		{#each $userStore.sentSplitRequests as req}
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">${req.amount} from {req.recipient.username}</h5>
					<EndpointButton
						endpoint="{base}/controller/split/request/{req.id}"
						method="DELETE"
						confirm
					>
						Forgive
					</EndpointButton>
				</div>
			</div>
			<br />
		{/each}
	{/if}
</div>
