import prisma from '$lib/prisma';
import { createResponse, getRequestClaims } from '$lib/util/server';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, cookies, params }) => {
	const body = await request.json();

	const accountId = params.id;
	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const account = await prisma.paymentAccount.update({
		where: { id: accountId, ownerId: myId },
		data: {
			name: body.name,
			default: body.default
		}
	});

	if (body.default) {
		// Remove default from all other payment accounts
		await prisma.paymentAccount.updateMany({
			where: { ownerId: myId, NOT: { id: accountId } },
			data: {
				default: false
			}
		});
	}

	return createResponse(account);
};
