import type { RequestHandler } from './$types';
import { createResponse } from '$lib/util/server';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
	return createResponse(
		await prisma.group.findFirst({
			where: { id: params.id },
			include: { members: true }
		})
	);
};
