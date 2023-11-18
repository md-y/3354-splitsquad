import type { getFullUser } from './util/server';

export type FullUser = NonNullable<Awaited<ReturnType<typeof getFullUser>>>;
