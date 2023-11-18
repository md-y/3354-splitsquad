import prisma from '$lib/prisma';
import { createResponse, getFullUser, getRequestClaims, sendNotification } from '$lib/util/server';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ cookies, params, url }) => {
	const claims = getRequestClaims(cookies);
	const userId = claims.id;
	const reqId = params.id;

	const accepted = url.searchParams.has('accept');

	const deletedReq = await prisma.friendRequest.delete({
		where: {
			id: reqId,
			recipientId: userId
		}
	});

	if (accepted) {
		const recipient = await prisma.user.update({
			where: { id: deletedReq.recipientId },
			data: { friends: { connect: { id: deletedReq.senderId } } }
		});
		await prisma.user.update({
			where: { id: deletedReq.senderId },
			data: { friends: { connect: { id: deletedReq.recipientId } } }
		});
		await sendNotification(
			deletedReq.senderId,
			`${recipient.username} has accepted your friend request.`
		);
	} else {
		const recipient = await prisma.user.findFirst({ where: { id: deletedReq.senderId } });
		await sendNotification(
			deletedReq.senderId,
			`${recipient?.username ?? '[Unknown]'} has declined your friend request.`
		);
	}

	const user = await getFullUser(userId);

	return createResponse(user?.receivedFriendRequests ?? null);
};

export const POST: RequestHandler = async ({ cookies, params }) => {
	const claims = getRequestClaims(cookies);
	const myId = claims.id;
	const friendId = params.id;

	await prisma.friendRequest.create({
		data: {
			senderId: myId,
			recipientId: friendId
		}
	});

	const user = await getFullUser(myId);

	await sendNotification(
		friendId,
		`${user?.username ?? '[Unknown]'} has sent you a friend request.`
	);

	return createResponse(user?.sentFriendRequests ?? null);
};
