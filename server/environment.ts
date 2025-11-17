import { die } from '#server/utils/Responses';

function tryLoadEnv(path?: string) {
  try {
    process.loadEnvFile(path);
  } catch {}
}

tryLoadEnv();

if (process.env.NODE_ENV === 'production') {
  tryLoadEnv('.env.production');
} else if (process.env.NODE_ENV === 'development') {
  tryLoadEnv('.env.development');
}

export const JWT_SECRET = Buffer.from(
  process.env.JWT_SECRET ?? die('JWT_SECRET was not set!'),
  'base64url',
);

export const DATABASE_PATH =
  process.env.DATABASE_PATH ??
  (process.env.NODE_ENV === 'production' ? 'database.sqlite' : ':memory:');
