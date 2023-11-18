import type { RequestHandler } from './$types';
import { createResponse } from '$lib/util/server';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
	return createResponse(
		await prisma.split.findFirst({
			where: { id: params.id },
			include: { members: true, owner: true, paymentAccount: true, payments: true }
		})
	);
};
