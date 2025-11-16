import AnnouncementsCollection from '#server/database/collections/AnnouncementsCollection';
import AuthenticationCollection from '#server/database/collections/AuthenticationCollection';
import UsersCollection from '#server/database/collections/UsersCollection';
import schema, { schemaVersion } from '#server/database/schema';
import seed_test_data from '#server/database/seed_test_data';
import { DatabaseSync } from 'node:sqlite';

const database =
  process.env.NODE_ENV === 'production'
    ? new DatabaseSync(process.env.DATABASE_PATH ?? 'database.sqlite')
    : new DatabaseSync(':memory:');

const actualSchemaVersion =
  database.prepare(`PRAGMA user_version;`).get()?.user_version ?? 0;

if (actualSchemaVersion === 0) {
  database.exec(schema);
} else if (actualSchemaVersion !== schemaVersion) {
  process.stderr.write(
    `Loaded schema version ${actualSchemaVersion} not compatible with ${schemaVersion}.\n`,
  );
  process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
  database.exec(seed_test_data);
}

export const db = {
  execTransaction<R>(fn: () => R): R {
    let result: R;

    if (database.isTransaction) throw Error('transactions must not be nested');

    try {
      database.exec('BEGIN TRANSACTION');
      result = fn();

      database.exec('COMMIT TRANSACTION');
      return result;
    } catch (e) {
      database.exec('ROLLBACK TRANSACTION');
      throw e;
    }
  },

  Users: initializeCollection(database, UsersCollection),
  Authentication: initializeCollection(database, AuthenticationCollection),

  Announcements: initializeCollection(database, AnnouncementsCollection),
};

export type DatabaseConfig = Record<string, (db: DatabaseSync) => unknown>;

type DatabaseCollection<T> = {
  [key in keyof T]: T[key] extends (db: DatabaseSync) => infer F ? F : never;
};

function initializeCollection<T extends DatabaseConfig>(
  database: DatabaseSync,
  collection: T,
): DatabaseCollection<T> {
  const entries = [];

  for (const key in collection) {
    const fn = collection[key];
    entries.push([key, fn(database)]);
  }

  return Object.fromEntries(entries);
}
