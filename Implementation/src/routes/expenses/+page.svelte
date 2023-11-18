<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import type { DirectPayment, SplitPayment } from '@prisma/client';
	import { page } from '$app/stores';

	function dateSort(a: DirectPayment | SplitPayment, b: DirectPayment | SplitPayment) {
		return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
	}

	let incoming = 0;
	let outgoing = 0;
	let profit = 0;
	$: {
		incoming = [...$userStore.receivedDirectPayments, ...$userStore.receivedSplitPayments].reduce(
			(total, p) => (total += p.amount),
			0
		);
		outgoing = [...$userStore.sentDirectPayments, ...$userStore.sentSplitPayments].reduce(
			(total, p) => (total += p.amount),
			0
		);
		profit = incoming - outgoing;
	}
</script>

<div class="m-4">
	<div class="card p-2 mb-4">
		<div class="card-body">
			<h3 class="card-title">
				<b>Total Expenses</b>
			</h3>
			<div class="card-text">
				<h4>Incoming <span class="text-success">${incoming}</span></h4>
				<h4>Outgoing <span class="text-danger">-${outgoing}</span></h4>
				<br />
				<h4>
					Profit
					{#if profit > 0}
						<span class="text-success">${profit}</span>
					{:else}
						<span class="text-danger">-${Math.abs(profit)}</span>
					{/if}
				</h4>
			</div>
		</div>
	</div>
	<br />
	<div class="row">
		<div class="col">
			<h3>Sent Split Payments</h3>
			{#each $userStore.sentSplitPayments.sort(dateSort) as payment}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							${payment.amount}
						</h5>
						<p class="card-text">{payment.timestamp}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="col">
			<h3>Sent Direct Payments</h3>
			{#each $userStore.sentDirectPayments.sort(dateSort) as payment}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							${payment.amount}
						</h5>
						<p class="card-text">{payment.timestamp}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="col">
			<h3>Received Split Payments</h3>
			{#each $userStore.receivedSplitPayments.sort(dateSort) as payment}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							${payment.amount}
						</h5>
						<p class="card-text">{payment.timestamp}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="col">
			<h3>Received Direct Payments</h3>
			{#each $userStore.receivedDirectPayments.sort(dateSort) as payment}
				<div class="card p-2 mb-4">
					<div class="card-body">
						<h5 class="card-title">
							${payment.amount}
						</h5>
						<p class="card-text">{payment.timestamp}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
