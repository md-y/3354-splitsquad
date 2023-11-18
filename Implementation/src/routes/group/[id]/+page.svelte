<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import type { Prisma } from '@prisma/client';

	type FullGroup = Prisma.GroupGetPayload<{ include: { members: true } }>;

	let group = $userStore.groups.find((f) => f.id === $page.params.id)!;

	async function getFullGroup(): Promise<FullGroup> {
		return fetch(`${base}/model/group/${group.id}`).then((res) => res.json());
	}
</script>

{#await getFullGroup() then group}
	<div class="row">
		<div class="col-8 m-4 mt-0">
			<h2>Members</h2>
			{#each group.members as member}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							{member.username}
						</h5>
					</div>
				</div>
			{/each}
		</div>
		<div class="col" />
	</div>
{/await}
