import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { User } from '#shared/models';
import z from 'zod';

export default {
  getAll: queryAll(User, /*sql*/ `SELECT * FROM Users;`),
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
} satisfies DatabaseConfig;
