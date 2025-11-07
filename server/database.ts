import { AnnouncementsCollectionConfig } from '#server/database/AnnouncementsCollection';
import { AuthenicationCollectionConfig } from '#server/database/AuthenticationCollection';
import { BookingsCollectionConfig } from '#server/database/BookingsCollection';
import {
  SQLiteDatabaseCollection,
  SQLiteJoinedDatabaseCollection,
} from '#server/database/DatabaseCollection';
import { FeedbackCollectionConfig } from '#server/database/FeedbackCollection';
import schema, { schemaVersion } from '#server/database/schema';
import seed_test_data from '#server/database/seed_test_data';
import { ServicesCollectionConfig } from '#server/database/ServicesCollection';
import { UsersCollectionConfig } from '#server/database/UsersCollection';
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

  Bookings: new SQLiteJoinedDatabaseCollection(
    database,
    BookingsCollectionConfig,
  ),

  Announcements: new SQLiteDatabaseCollection(
    database,
    AnnouncementsCollectionConfig,
  ),

  Feedback: new SQLiteDatabaseCollection(database, FeedbackCollectionConfig),

  Services: new SQLiteDatabaseCollection(database, ServicesCollectionConfig),

  Users: new SQLiteJoinedDatabaseCollection(database, UsersCollectionConfig),

  Authentication: new SQLiteDatabaseCollection(
    database,
    AuthenicationCollectionConfig,
  ),
};
