import prisma from '$lib/prisma';
import { createResponse, getRequestClaims } from '$lib/util/server';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const user = await prisma.user.update({
		where: { id: myId },
		data: {
			readNotificationCount: body.count
		},
		select: { readNotificationCount: true }
	});

	return createResponse(user);
};
