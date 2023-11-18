<script lang="ts">
	import { base } from '$app/paths';
	import { updateUserStore, userStore } from '$lib/stores/user';
	import EndpointButton from '$lib/components/EndpointButton.svelte';
	import ModalButton from '$lib/components/ModalButton.svelte';
	import type { FullUser } from '$lib/types';
	import AccountDropdown from '$lib/components/AccountDropdown.svelte';
	import { getFormData } from '$lib/util/client';

	let friendsSearch: string = '';
	let friends: typeof $userStore.friends = [];
	$: friends = $userStore.friends.filter(
		(f) => friendsSearch == '' || f.username.toLowerCase().includes(friendsSearch.toLowerCase())
	);

	let receivedFriendRequests: typeof $userStore.receivedFriendRequests = [];
	$: receivedFriendRequests = $userStore.receivedFriendRequests.filter(
		(f) =>
			friendsSearch == '' || f.sender.username.toLowerCase().includes(friendsSearch.toLowerCase())
	);

	let sentFriendRequests: typeof $userStore.sentFriendRequests = [];
	$: sentFriendRequests = $userStore.sentFriendRequests.filter(
		(f) =>
			friendsSearch == '' ||
			f.recipient.username.toLowerCase().includes(friendsSearch.toLowerCase())
	);

	let usersForNewFriendModal: FullUser[] = [];
	async function getAllNonFriendUsers() {
		const res = await fetch(`${base}/model/user`);
		const users = (await res.json()) as FullUser[];
		usersForNewFriendModal = users.filter(
			(u) =>
				!$userStore.friends.some((f) => f.id == u.id) &&
				$userStore.id != u.id &&
				!$userStore.receivedFriendRequests.some((f) => f.senderId == u.id) &&
				!$userStore.sentFriendRequests.some((f) => f.recipientId == u.id)
		);
		return usersForNewFriendModal;
	}

	let directPaymentForm: HTMLFormElement;
	async function sendDirectPayment(friend: string) {
		const { account, amount, description } = getFormData(directPaymentForm);
		if (!account || !amount || !description) {
			alert('Missing Data');
			return;
		}

		if (!confirm('Are you sure?')) return;

		const res = await fetch(`${base}/controller/payment/direct`, {
			method: 'POST',
			body: JSON.stringify({
				account,
				amount: parseFloat(amount as string),
				description,
				recipient: friend
			})
		});
		if (res.status === 400) alert(`Not enough balance.`);

		await updateUserStore();
	}
</script>

<div class="col">
	<h1>Friends</h1>
	<br />
	<div class="input-group mb-3">
		<input
			type="text"
			class="form-control"
			placeholder="Search"
			aria-label="Search"
			aria-describedby="basic-addon1"
			bind:value={friendsSearch}
		/>
	</div>
	<ModalButton title="Select Friend" buttonText="Add Friend">
		<ul class="list-group">
			{#await getAllNonFriendUsers()}
				<p>Loading...</p>
			{:then}
				{#each usersForNewFriendModal as user}
					<li class="list-group-item">
						{user.username}
						<EndpointButton
							endpoint={`${base}/controller/friend/request/${user.id}`}
							on:response={() =>
								(usersForNewFriendModal = usersForNewFriendModal.filter((f) => f.id !== user.id))}
							className="btn-primary"
							method="POST"
						>
							+
						</EndpointButton>
					</li>
				{/each}
			{/await}
		</ul>
	</ModalButton>
	<div class="mb-2" />
	{#each friends as friend}
		<div class="card">
			<div class="card-body">
				<h5 class="card-title">{friend.username}</h5>
				<a href="{base}/friend/{friend.id}" class="btn btn-primary">View</a>
				<ModalButton
					title="Send Direct Payment To {friend.username}"
					buttonText="Direct Payment"
					on:finish={() => sendDirectPayment(friend.id)}
				>
					<form bind:this={directPaymentForm}>
						<div class="mb-3">
							<input class="form-control" name="amount" placeholder="Amount ($)" type="number" />
						</div>
						<div class="mb-3">
							<input
								class="form-control"
								name="description"
								placeholder="Description"
								type="text"
							/>
						</div>
						<div class="mb-3">
							<AccountDropdown />
						</div>
					</form>
				</ModalButton>
				<EndpointButton
					endpoint={`${base}/controller/friend/${friend.id}`}
					method="DELETE"
					className="btn-danger"
				>
					Remove
				</EndpointButton>
			</div>
		</div>
		<br />
	{/each}

	{#if receivedFriendRequests.length > 0}
		<hr />
		<h3>Inbound Requests</h3>
		{#each receivedFriendRequests as req}
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">{req.sender.username}</h5>
					<EndpointButton
						endpoint={`${base}/controller/friend/request/${req.id}?accept`}
						method="DELETE"
						className="btn-success"
					>
						Accept
					</EndpointButton>
					<EndpointButton
						endpoint={`${base}/controller/friend/request/${req.id}`}
						method="DELETE"
						className="btn-danger"
					>
						Deny
					</EndpointButton>
				</div>
			</div>
		{/each}
	{/if}

	{#if sentFriendRequests.length > 0}
		<hr />
		<h3>Outbound Requests</h3>
		{#each sentFriendRequests as req}
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">{req.recipient.username}</h5>
				</div>
			</div>
		{/each}
	{/if}
</div>
