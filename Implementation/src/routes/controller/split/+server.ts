import prisma from '$lib/prisma';
import { createResponse, getRequestClaims, sendNotification } from '$lib/util/server';
import type { Split } from '@prisma/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
	const body = (await request.json()) as Split & { members: string[] };

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const members = body.members.filter((id) => id !== myId);

	const split = await prisma.split.create({
		data: {
			name: body.name,
			total: body.total,
			totalPayed: 0,
			type: body.type,
			description: body.description,
			members: {
				connect: members.map((id) => ({ id }))
			},
			ownerId: myId,
			paymentAccountId: body.paymentAccountId,
			period: body.period ?? undefined
		},
		include: {
			owner: true
		}
	});

	for (const id of members) {
		await prisma.splitRequest.create({
			data: {
				amount: body.total / members.length,
				recipientId: id,
				senderId: myId,
				splitId: split.id
			}
		});

		await sendNotification(
			id,
			`You have been added to a split "${split.name}" by ${split.owner.username}.`
		);
	}

	return createResponse(split);
};
