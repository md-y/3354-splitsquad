import { createHash } from 'node:crypto';
import { error, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';

export function generatePasswordHash(password: string, salt: string) {
	const hashContent = password + salt;
	const hashStr = createHash('sha256').update(hashContent).digest('hex');
	return hashStr;
}

export function createResponse(body: string | object | null) {
	if (body == null) throw error(404, 'Response was null');
	if (typeof body === 'string') return new Response(body);
	return new Response(JSON.stringify(body), {
		headers: {
			'content-type': 'application/json'
		}
	});
}

export function getRequestClaims(cookies: Cookies) {
	const jwtCookie = cookies.get('splitsquad_jwt');
	if (!jwtCookie) throw error(401, 'Not authenticated');
	const claims = jwt.verify(jwtCookie, env.AUTH_SECRET) as { id: string };
	return claims;
}

export async function getFullUser(id: string) {
	if (!id) return null;
	return await prisma.user.findFirst({
		where: { id },
		include: {
			friends: true,
			receivedFriendRequests: {
				include: { sender: true }
			},
			sentFriendRequests: {
				include: { recipient: true }
			},
			groups: true,
			splits: {
				include: {
					members: {
						select: {
							id: true,
							username: true
						}
					}
				}
			},
			receivedDirectPayments: true,
			receivedSplitRequests: {
				include: {
					sender: {
						select: {
							username: true
						}
					}
				}
			},
			sentDirectPayments: true,
			paymentAccounts: true,
			sentSplitRequests: {
				include: {
					recipient: {
						select: {
							username: true
						}
					}
				}
			},
			ownedSplits: {
				include: {
					members: {
						select: {
							id: true,
							username: true
						}
					}
				}
			},
			notifications: true,
			sentSplitPayments: true,
			receivedSplitPayments: true
		}
	});
}

export async function sendNotification(userId: string, content: string) {
	return await prisma.notification.create({
		data: {
			userId,
			content,
			timestamp: new Date()
		}
	});
}
