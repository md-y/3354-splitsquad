<script lang="ts">
	import { base } from '$app/paths';
	import EndpointButton from '$lib/components/EndpointButton.svelte';
	import ModalButton from '$lib/components/ModalButton.svelte';
	import { updateUserStore, userStore } from '$lib/stores/user';
	import { getFormData } from '$lib/util/client';
	import type { Prisma } from '@prisma/client';

	let groupsSearch: string = '';
	let groups: typeof $userStore.groups = [];
	$: groups = $userStore.groups.filter(
		(f) => groupsSearch == '' || f.name.toLowerCase().includes(groupsSearch.toLowerCase())
	);

	let newGroupForm: HTMLFormElement;
	async function newGroupSubmit() {
		if (!newGroupForm) return;
		let { friend, name } = getFormData(newGroupForm);
		if (name === '') name = 'Unnamed Group';
		if (!Array.isArray(friend)) friend = [friend];

		await fetch(`${base}/controller/group`, {
			method: 'POST',
			body: JSON.stringify({ name, members: friend })
		});
		await updateUserStore();
	}

	async function getGroupEditInfo(id: string) {
		const res = await fetch(`${base}/model/group/${id}`);
		const body = (await res.json()) as Prisma.GroupGetPayload<{ include: { members: true } }>;
		const nonFriends = body.members.filter((m) => !$userStore.friends.some((f) => f.id === m.id));
		return {
			candidates: nonFriends.concat($userStore.friends),
			group: body
		};
	}

	let editGroupForm: HTMLFormElement;
	async function updateGroup(id: string) {
		const { member, name } = getFormData<{ member: string | string[]; name: string }>(
			editGroupForm
		);
		const members = typeof member === 'string' ? [member] : member ?? [];
		await fetch(`${base}/controller/group/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				members,
				name
			})
		});
		await updateUserStore();
	}
</script>

<div class="col">
	<h1>Groups</h1>
	<br />
	<div class="input-group mb-3">
		<input
			type="text"
			class="form-control"
			placeholder="Search"
			aria-label="Search"
			aria-describedby="basic-addon1"
			bind:value={groupsSearch}
		/>
	</div>
	<ModalButton title="Select Friends" buttonText="New Group" on:finish={newGroupSubmit}>
		<form bind:this={newGroupForm}>
			<input
				type="text"
				class="form-control"
				placeholder="Name"
				aria-label="Name"
				aria-describedby="basic-addon1"
				name="name"
			/>
			<br />
			{#each $userStore.friends as friend}
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						value={friend.id}
						name="friend"
						id="group-select-{friend.id}"
					/>
					<label class="form-check-label" for="group-select-{friend.id}">{friend.username}</label>
				</div>
			{/each}
		</form>
	</ModalButton>
	<div class="mb-2" />
	{#each groups as group}
		<div class="card">
			<div class="card-body">
				<h5 class="card-title">{group.name}</h5>
				<a href="{base}/group/{group.id}" class="btn btn-primary">View</a>
				<ModalButton title="Edit Group" buttonText="Edit" on:finish={() => updateGroup(group.id)}>
					{#await getGroupEditInfo(group.id) then groupInfo}
						<form bind:this={editGroupForm}>
							<input
								type="text"
								class="form-control"
								placeholder="Name"
								aria-label="Name"
								aria-describedby="basic-addon1"
								name="name"
								value={groupInfo.group.name}
							/>
							<br />
							{#each groupInfo.candidates as candidate}
								<div class="form-check">
									<input
										class="form-check-input"
										type="checkbox"
										value={candidate.id}
										name="member"
										id="group-edit-{candidate.id}"
										checked={groupInfo.group.members.some((m) => m.id === candidate.id)}
									/>
									<label class="form-check-label" for="group-select-{candidate.id}">
										{candidate.username}
									</label>
								</div>
							{/each}
						</form>
					{/await}
				</ModalButton>
				<EndpointButton
					endpoint={`${base}/controller/group/${group.id}`}
					method="DELETE"
					className="btn-danger"
				>
					Remove
				</EndpointButton>
			</div>
		</div>
	{/each}
</div>
