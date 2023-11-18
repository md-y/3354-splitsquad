import prisma from '$lib/prisma';
import { createResponse, getRequestClaims } from '$lib/util/server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	if (body.default) {
		await prisma.paymentAccount.updateMany({
			where: { ownerId: myId, default: true },
			data: { default: false }
		});
	}

	const account = await prisma.paymentAccount.create({
		data: {
			balance: 0,
			default: body.default,
			name: body.name,
			ownerId: myId
		}
	});

	return createResponse(account);
};
