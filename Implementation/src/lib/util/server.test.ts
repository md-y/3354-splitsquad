import { describe, it, expect } from 'vitest';
import { generatePasswordHash } from './server';

// Correct hashes generated manually using: https://emn178.github.io/online-tools/sha256.html

describe('password hash generation test', () => {
	it('returns the correct hash for a common password and salt', () => {
		const password = 'password123';
		const salt = 'salt123';
		const correctHash = 'bb4609fd7ede19a1a39bb73b2b84e41284e7df890458f63358323e81718a0954';
		const generatedHash = generatePasswordHash(password, salt);
		expect(correctHash).eq(generatedHash);
	});
	it('returns the correct empty hash for an empty password and salt', () => {
		const emptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
		const generatedHash = generatePasswordHash('', '');
		expect(emptyHash).eq(generatedHash);
	});
	it('returns the correct hash for a very long password and salt', () => {
		const longPassword = new Array(200).fill('a').join('');
		const longSalt = new Array(200).fill('s').join('');
		const correctHash = '5cd768ee0d1286342583e9ef8dce5786892f4921ba2235c6e3ce39befbfb6f02';
		const generatedHash = generatePasswordHash(longPassword, longSalt);
		expect(correctHash).eq(generatedHash);
	});
	it('returns the correct hash for non-ASCII characters', () => {
		const password = '😂😂👌👌';
		const salt = 'ぁぁぁぁ';
		const correctHash = 'f386474a7906bb5070f4153aa525f9efd9805588df9ed8b04a3f7ed8456fc3db';
		const generatedHash = generatePasswordHash(password, salt);
		expect(correctHash).eq(generatedHash);
	});
});
