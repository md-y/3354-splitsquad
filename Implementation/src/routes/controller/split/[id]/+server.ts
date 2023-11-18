import prisma from '$lib/prisma';
import { createResponse, getRequestClaims, sendNotification } from '$lib/util/server';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ cookies, params }) => {
	const id = params.id;

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const split = await prisma.split.findFirst({
		where: { id, ownerId: myId },
		include: { requests: true }
	});

	if (!split) throw error(404, 'Unknown split');

	for (const req of split.requests) {
		await prisma.splitRequest.delete({ where: { id: req.id } });
	}

	const deletedSplit = await prisma.split.delete({
		where: { id: split.id },
		include: { members: true }
	});

	for (const member of deletedSplit.members) {
		await sendNotification(member.id, `Split "${deletedSplit.name}" has by deleted.`);
	}

	return createResponse(deletedSplit);
};
