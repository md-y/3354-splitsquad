import dotenv from 'dotenv';
import { test as base } from '@playwright/test';

dotenv.config();

export type TestOptions = {
	username: string;
	password: string;
	authSecret: string;
};

export const test = base.extend<TestOptions>({
	username: process.env.TEST_USERNAME,
	password: process.env.TEST_PASSWORD,
	authSecret: process.env.AUTH_SECRET
});
