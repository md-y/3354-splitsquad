import type { RequestHandler } from './$types';
import { createResponse } from '$lib/util/server';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async () => {
	return createResponse(await prisma.split.findMany());
};
