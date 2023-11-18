import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('splitsquad_jwt', { secure: true, path: '/' });
	throw redirect(303, `${base}/`);
};
