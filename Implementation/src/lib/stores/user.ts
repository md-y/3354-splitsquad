import { base } from '$app/paths';
import type { FullUser } from '$lib/types';
import { get, writable } from 'svelte/store';

export const userStore = writable<FullUser>();

export async function updateUserStore() {
	const userRes = await fetch(`${base}/model/user/${get(userStore).id}`);
	const userBody: FullUser = await userRes.json();
	userStore.set(userBody);
}
