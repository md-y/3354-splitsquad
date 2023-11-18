import { expect } from '@playwright/test';
import { test } from './test';
import jwt from 'jsonwebtoken';

test('login with correct user info', async ({ page, username, password, authSecret }) => {
	// Navigate to index page
	await page.goto('/');

	// Fill in form with test credentials info
	await page.getByLabel('Username').click();
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').click();
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Login' }).click();

	// Wait until the dashboard is loaded
	await page.waitForURL('/dashboard', { timeout: 4000 });

	// Check to make sure the authentication token was set as a cookie
	const cookies = await page.context().cookies();
	const tokenCookie = cookies.find((cookie) => cookie.name === 'splitsquad_jwt');
	expect(tokenCookie).not.toBeUndefined();

	// Verify the token was sent by our server by using our authentication secret, and decode it
	const tokenPayload = jwt.verify(tokenCookie!.value, authSecret) as Record<string, string>;

	// Our token is a JWT, so it contains information about our user such as their username
	expect(tokenPayload.username).toEqual(username);

	// Cleanup
	await page.close();
});

test('login with incorrect password', async ({ page, username, password }) => {
	// Navigate to index page
	await page.goto('/');

	// This will catch the login request response
	const loginResponse = page.waitForResponse('/?/login');

	// Fill in form with fake credentials
	await page.getByLabel('Username').click();
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').click();
	await page.getByLabel('Password').fill('bad password: ' + password);
	await page.getByRole('button', { name: 'Login' }).click();

	// Wait for the login response, and expect a 400 range error response
	const res = await loginResponse;
	const status = res.status();
	expect(status).toBeGreaterThanOrEqual(400);
	expect(status).toBeLessThan(500);

	await page.close();
});
