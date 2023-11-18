import prisma from '$lib/prisma';
import { createResponse, getRequestClaims, sendNotification } from '$lib/util/server';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ cookies, params }) => {
	const claims = getRequestClaims(cookies);
	const userId = claims.id;
	const friendId = params.id;

	const user = await prisma.user.update({
		where: { id: userId },
		data: { friends: { disconnect: { id: friendId } } },
		include: { friends: true }
	});

	await prisma.user.update({
		where: { id: friendId },
		data: { friends: { disconnect: { id: userId } } }
	});

	await sendNotification(friendId, `${user.username} has removed you as a friend`);

	return createResponse(user);
};
