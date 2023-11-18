import type { RequestHandler } from './$types';
import { createResponse, getFullUser } from '$lib/util/server';

export const GET: RequestHandler = async ({ params }) => {
	return createResponse(await getFullUser(params.id));
};
