import prisma from '$lib/prisma';
import { createResponse, getFullUser, getRequestClaims, sendNotification } from '$lib/util/server';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
	const body = (await request.json()) as { name: string; members: string[] };

	const claims = getRequestClaims(cookies);
	const myId = claims.id;
	const user = await prisma.user.findFirst({ where: { id: myId }, select: { friends: true } });
	const friendIds = (user?.friends ?? []).map((f) => f.id);
	if (body.members.some((id) => !friendIds.includes(id) && id != myId)) {
		throw error(400, 'Non-friend member included');
	}

	if (!body.members.includes(myId)) body.members.push(myId);

	const group = await prisma.group.create({
		data: {
			name: body.name,
			members: {
				connect: body.members.map((id) => ({ id }))
			}
		},
		include: {
			members: true
		}
	});

	const newUser = await getFullUser(myId);

	for (const member of group.members) {
		await sendNotification(member.id, `You have been added to a new group: "${group.name}."`);
	}

	return createResponse(newUser?.groups ?? null);
};
