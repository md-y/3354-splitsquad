import prisma from '$lib/prisma';
import { createResponse, getRequestClaims, sendNotification } from '$lib/util/server';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ cookies, url, params }) => {
	const accountId = url.searchParams.get('account');
	const id = params.id;

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const req = await prisma.splitRequest.findFirst({ where: { id } });

	if (!req) throw error(404, 'Unknown split request');

	if (!accountId) {
		if (myId !== req.senderId) throw error(401, 'Missing account id');

		// Forgive request
		await prisma.splitRequest.delete({ where: { id } });
		const split = await prisma.split.update({
			where: { id: req.splitId! },
			data: { total: { decrement: req.amount } }
		});

		await sendNotification(
			req.recipientId,
			`Your split request of $${req.amount} from "${split.name}" has been forgiven.`
		);
	} else {
		// Pay request
		const senderAccount = await prisma.paymentAccount.findFirst({
			where: { id: accountId },
			include: { owner: true }
		});
		if (!senderAccount) {
			throw error(404, 'Withdrawal account is missing');
		}
		if (myId !== senderAccount.ownerId) {
			throw error(401, 'You must be the account owner to pay this');
		}
		if (senderAccount.balance < req.amount) {
			throw error(400, 'Balance is too little');
		}

		if (!req.splitId) throw error(500, 'Invalid split request, missing split relation: ' + req.id);
		const split = await prisma.split.findFirst({ where: { id: req.splitId } });
		if (!split) throw error(500, 'Invalid split request, invalid split relation: ' + req.id);

		await prisma.splitRequest.delete({ where: { id } });
		await prisma.split.update({
			where: { id: req.splitId! },
			data: { totalPayed: { increment: req.amount } }
		});
		// Add to owner's account
		await prisma.paymentAccount.update({
			where: { id: split.paymentAccountId },
			data: { balance: { increment: req.amount } }
		});
		// Remove from sender's account
		await prisma.paymentAccount.update({
			where: { id: senderAccount.id },
			data: { balance: { decrement: req.amount } }
		});

		// Record split payment
		await prisma.splitPayment.create({
			data: {
				amount: req.amount,
				recipientId: split.ownerId,
				senderId: senderAccount.ownerId,
				timestamp: new Date()
			}
		});

		// Send notification
		await sendNotification(
			req.senderId,
			`You have received a split payment of $${req.amount} for "${split.name}" by ${senderAccount.owner.username}.`
		);
	}

	return createResponse(req);
};
