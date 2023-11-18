import prisma from '$lib/prisma';
import { createResponse, getRequestClaims, sendNotification } from '$lib/util/server';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const recipientId: string = body.recipient;
	const senderAccountId = body.account;
	const amount = body.amount;

	const senderAccount = await prisma.paymentAccount.findFirst({
		where: { id: senderAccountId, ownerId: myId },
		include: { owner: true }
	});
	if (!senderAccount) {
		throw error(404, 'Withdrawal account is missing');
	}
	if (senderAccount.balance < amount) {
		throw error(400, 'Balance is too little');
	}

	const recipientAccount = await prisma.paymentAccount.findFirst({
		where: { ownerId: recipientId, default: true }
	});
	if (!recipientAccount) {
		throw error(404, 'Recipient has no account to deposit to');
	}

	const newPayment = await prisma.directPayment.create({
		data: {
			amount,
			description: body.description,
			recipientId,
			recipientAccountId: recipientAccount.id,
			senderAccountId,
			senderId: myId,
			timestamp: new Date()
		}
	});

	await prisma.paymentAccount.update({
		where: { id: recipientAccount.id },
		data: { balance: { increment: amount } }
	});

	await prisma.paymentAccount.update({
		where: { id: senderAccount.id },
		data: { balance: { decrement: amount } }
	});

	await sendNotification(
		recipientId,
		`You have received a direct payment of $${amount} from ${senderAccount.owner.username}.`
	);

	return createResponse(newPayment);
};
