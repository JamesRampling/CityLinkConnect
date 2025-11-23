import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { User } from '#shared/models';
import z from 'zod';

export default {
  getAll: queryAll(
    User.extend({ is_admin: z.coerce.boolean() }),
    /*sql*/ `
    SELECT Users.*, Authentication.is_admin FROM Users
      LEFT JOIN Authentication ON Users.user_id = Authentication.user_id;
    `,
  ),

  getFromId: queryUnique(
    z.int(),
    User,
    /*sql*/ `SELECT * FROM Users WHERE user_id = ?;`,
  ),

  getFromEmail: queryUnique(
    z.email(),
    User,
    /*sql*/ `SELECT * FROM Users WHERE email = ?;`,
  ),

  insert: mutateRows(
    User.omit({ user_id: true }),
    /*sql*/ `
    INSERT INTO Users (given_names, last_name, email, phone)
           VALUES ($given_names, $last_name, $email, $phone);`,
  ),

  update: mutateRows(
    User.extend({ user_id: z.int() }),
    /*sql*/ `
    UPDATE Users
      SET
        given_names = $given_names,
        last_name = $last_name,
        email = $email,
        phone = $phone
      WHERE user_id = $user_id;`,
  ),

  delete: mutateRows(z.int(), /*sql*/ `DELETE FROM Users WHERE user_id = ?;`),
} satisfies DatabaseConfig;
