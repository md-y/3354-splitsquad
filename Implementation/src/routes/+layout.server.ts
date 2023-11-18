import type { LayoutServerLoad } from './$types';
import { base } from '$app/paths';
import { getRequestClaims } from '$lib/util/server';
import type { FullUser } from '$lib/types';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	try {
		const claims = getRequestClaims(cookies);
		return {
			user: (await fetch(`${base}/model/user/${claims.id}`).then((res) =>
				res.json()
			)) as Promise<FullUser>
		};
	} catch {
		return {
			user: null
		};
	}
};
