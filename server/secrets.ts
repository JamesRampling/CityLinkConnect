import { die } from '#server/utils/Responses';
import { env } from 'process';

process.loadEnvFile();

export const JWT_SECRET = Buffer.from(
  env.JWT_SECRET ?? die('JWT_SECRET was not set!'),
  'base64url',
);
