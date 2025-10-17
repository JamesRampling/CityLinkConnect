import { AnnouncementsCollectionConfig } from '#server/database/AnnouncementsCollection';
import { BookingsCollectionConfig } from '#server/database/BookingsCollection';
import { SQLiteDatabaseCollection } from '#server/database/DatabaseCollection';
import { FeedbackCollectionConfig } from '#server/database/FeedbackCollection';
import { ServicesCollectionConfig } from '#server/database/ServicesCollection';
import { UsersCollectionConfig } from '#server/database/UsersCollection';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';

export const database = new DatabaseSync(':memory:');

database.exec(await readFile('./schema.sql', { encoding: 'utf-8' }));

if (process.env.NODE_ENV !== 'production') {
  database.exec(await readFile('./seed_test_data.sql', { encoding: 'utf-8' }));
}

export const db = {
  Bookings: new SQLiteDatabaseCollection(database, BookingsCollectionConfig),

  Announcements: new SQLiteDatabaseCollection(
    database,
    AnnouncementsCollectionConfig,
  ),

  Feedback: new SQLiteDatabaseCollection(database, FeedbackCollectionConfig),

  Services: new SQLiteDatabaseCollection(database, ServicesCollectionConfig),

  Users: new SQLiteDatabaseCollection(database, UsersCollectionConfig),
};
