import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import type { TestOptions } from './tests/test';

dotenv.config();

const config: PlaywrightTestConfig<TestOptions> = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /.+\.(test|spec)\.[jt]s/
};

export default config;
