import type { SQLiteDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import z from 'zod';

const AuthenticationEntry = z.object({
  user_id: z.int().nonnegative(),
  argon2_hash: z.string(),
  is_admin: z.coerce.boolean().default(false),
});

export const AuthenicationCollectionConfig = {
  zodSchema: AuthenticationEntry,

  allSQL: /*sql*/ `SELECT NULL;`,

  singleSQL: /*sql*/ `
    SELECT * FROM Authentication WHERE user_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Authentication (user_id, argon2_hash, is_admin)
      VALUES ($user_id, $argon2_hash, $is_admin);
  `,

  updateSQL: /*sql*/ `
    UPDATE Authentication
      SET
        argon2_hash = $argon2_hash,
        is_admin = $is_admin
      WHERE user_id = $user_id;
  `,

  deleteSQL: /*sql*/ `SELECT NULL;`,
} satisfies SQLiteDatabaseCollectionConfig<typeof AuthenticationEntry>;
