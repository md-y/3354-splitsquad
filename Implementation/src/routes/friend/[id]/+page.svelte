<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import type { DirectPayment, SplitPayment } from '@prisma/client';
	import { page } from '$app/stores';

	let friend = $userStore.friends.find((f) => f.id === $page.params.id)!;

	function dateSort(a: DirectPayment | SplitPayment, b: DirectPayment | SplitPayment) {
		return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
	}

	let sentPayments: (DirectPayment | SplitPayment)[];
	let receivedPayments: (DirectPayment | SplitPayment)[];
	$: {
		sentPayments = [...$userStore.sentDirectPayments, ...$userStore.sentSplitPayments]
			.filter((p) => p.recipientId === friend.id)
			.sort(dateSort);
		receivedPayments = [...$userStore.receivedDirectPayments, ...$userStore.receivedSplitPayments]
			.filter((p) => p.senderId === friend.id)
			.sort(dateSort);
	}
</script>

<div class="m-4">
	<h1>Expense History</h1>
	<br />
	<div class="row">
		<div class="col">
			<h3>Sent Payments</h3>
			{#each sentPayments as payment}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							${payment.amount}
							{#if 'description' in payment}
								<span class="badge bg-warning">Direct</span>
							{:else}
								<span class="badge bg-success">Split</span>
							{/if}
						</h5>
						<p class="card-text">{payment.timestamp}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="col">
			<h3>Received Payments</h3>
			{#each receivedPayments as payment}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							${payment.amount}
							{#if 'description' in payment}
								<span class="badge bg-warning">Direct</span>
							{:else}
								<span class="badge bg-success">Split</span>
							{/if}
						</h5>
						<p class="card-text">{payment.timestamp}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
