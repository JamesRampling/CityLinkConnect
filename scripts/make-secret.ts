import { randomBytes } from 'node:crypto';

console.log(randomBytes(256).toString('base64url'));
