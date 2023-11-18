import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { attemptLogin, attemptSignup } from '$lib/util/auth';
import { base } from '$app/paths';

export const actions = {
	login: async (event) => {
		return await processRequest(event, true);
	},
	signup: async (event) => {
		return await processRequest(event, false);
	}
} satisfies Actions;

async function processRequest({ request, cookies }: RequestEvent, login: boolean) {
	const body = await request.formData();
	const username = body.get('username') as string;
	const password = body.get('password') as string;
	if (!username) return fail(400, { missing: true });
	if (!password) return fail(400, { missing: true });

	let token: string;
	if (login) {
		const attempt = await attemptLogin(username, password);
		if (!attempt) return fail(404, { incorrect: true });
		token = attempt;
	} else {
		const attempt = await attemptSignup(username, password);
		if (!attempt) return fail(404, { existing: true });
		token = attempt;
	}

	cookies.set('splitsquad_jwt', token, { secure: true, path: '/', maxAge: 43200 });
	throw redirect(303, `${base}/dashboard`);
}
