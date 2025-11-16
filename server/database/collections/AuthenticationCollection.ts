import type { DatabaseConfig } from '#server/database';
import { mutateRows, queryUnique } from '#server/database/DatabaseCollection';
import z from 'zod';

const AuthenticationEntry = z.object({
  user_id: z.int(),
  argon2_hash: z.string(),
  is_admin: z.coerce.boolean().default(false),
});

export default {
  get: queryUnique(
    z.int(),
    AuthenticationEntry,
    /*sql*/ `SELECT * FROM Authentication WHERE user_id = ?;`,
  ),
  insert: mutateRows(
    AuthenticationEntry,
    /*sql*/ `INSERT INTO Authentication (user_id, argon2_hash, is_admin)
                    VALUES ($user_id, $argon2_hash, $is_admin);`,
  ),
} satisfies DatabaseConfig;
