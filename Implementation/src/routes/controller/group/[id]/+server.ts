import prisma from '$lib/prisma';
import { createResponse, getRequestClaims, sendNotification } from '$lib/util/server';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ cookies, params }) => {
	const id = params.id;

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const group = await prisma.group.delete({
		where: {
			id,
			members: {
				some: {
					id: myId
				}
			}
		},
		include: {
			members: true
		}
	});

	for (const member of group.members) {
		await sendNotification(member.id, `Group "${group.name}" has been deleted.`);
	}

	return createResponse(group);
};

export const PUT: RequestHandler = async ({ request, cookies, params }) => {
	const body = (await request.json()) as {
		members: string[];
		name: string;
	};

	const id = params.id;

	const claims = getRequestClaims(cookies);
	const myId = claims.id;

	const oldGroup = await prisma.group.findFirst({
		where: {
			id,
			members: {
				some: {
					id: myId
				}
			}
		},
		include: { members: true }
	});

	if (!oldGroup) throw error(404, 'Group not found');

	const removedMembers = oldGroup.members
		.filter((m) => !body.members.includes(m.id))
		.map((m) => m.id);

	const newMembers = body.members.filter((id) => !oldGroup.members.some((m) => m.id == id));

	const newGroup = await prisma.group.update({
		where: {
			id,
			members: {
				some: {
					id: myId
				}
			}
		},
		data: {
			name: body.name,
			members: {
				connect: body.members.map((id) => ({ id })),
				disconnect: removedMembers.map((id) => ({ id }))
			}
		},
		include: {
			members: true
		}
	});

	for (const member of removedMembers) {
		await sendNotification(member, `You have been removed from group: "${oldGroup.name}."`);
	}

	if (newMembers.length > 0) {
		for (const member of oldGroup.members) {
			await sendNotification(
				member.id,
				`Added ${newMembers.length} member(s) to the group "${newGroup.name}."`
			);
		}
	}

	for (const member of newMembers) {
		await sendNotification(member, `You have been added to a new group: "${newGroup.name}."`);
	}

	return createResponse(newGroup);
};
