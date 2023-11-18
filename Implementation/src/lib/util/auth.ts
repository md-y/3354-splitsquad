import prisma from '$lib/prisma';
import { timingSafeEqual, randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import { generatePasswordHash } from '$lib/util/server';

export async function attemptLogin(username: string, password: string): Promise<string | null> {
	const user = await prisma.user.findFirst({
		where: { username: { equals: username } },
		include: { credentials: true }
	});

	if (!user) return null;

	const hashContent = generatePasswordHash(password, user.credentials.salt);

	if (
		user.credentials.password.length !== hashContent.length ||
		!timingSafeEqual(Buffer.from(user.credentials.password, 'hex'), Buffer.from(hashContent, 'hex'))
	) {
		return null;
	}

	return signToken(user.id, user.username);
}

export async function attemptSignup(username: string, password: string): Promise<string | null> {
	const existingUser = await prisma.user.findFirst({ where: { username: username } });
	if (existingUser) return null;

	const salt = randomBytes(32).toString('hex');
	const passwordHash = generatePasswordHash(password, salt);

	const credentials = await prisma.userCredentials.create({
		data: {
			password: passwordHash,
			salt
		}
	});

	const user = await prisma.user.create({
		data: {
			username,
			credentialsId: credentials.id
		}
	});

	return signToken(user.id, user.username);
}

function signToken(id: string, username: string) {
	const token = jwt.sign(
		{
			id,
			username
		},
		env.AUTH_SECRET
	);
	return token;
}
