import { SqLiteDatabaseCollection } from '#server/database/DatabaseCollection';
import { Booking } from '#shared/models';
import { DatabaseSync } from 'node:sqlite';

export const database = new DatabaseSync(':memory:');

database.exec(/*sql*/ `
CREATE TABLE Services (
  service_id INTEGER PRIMARY KEY NOT NULL,
  config BLOB NOT NULL
);

CREATE TABLE Users (
  user_id INTEGER PRIMARY KEY NOT NULL,
  given_names TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE
);

CREATE TABLE Bookings (
  booking_id INTEGER PRIMARY KEY NOT NULL,
  user_id NULL REFERENCES Users,
  service_id NULL REFERENCES Services,
  booking_datetime TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE Feedback (
  feedback_id INTEGER PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL
);

CREATE TABLE Announcements (
  announcement_id INTEGER PRIMARY KEY NOT NULL,
  sort_date TEXT NOT NULL,
  config BLOB NOT NULL
);

INSERT INTO Bookings (booking_id, user_id, service_id, booking_datetime, notes) VALUES (1, NULL, NULL, '2025-10-10', 'note');
`);

export const bookings = new SqLiteDatabaseCollection({
  database,
  zodType: Booking,
  getSingleStatement: database.prepare(
    `SELECT * FROM Bookings WHERE booking_id = ?;`,
  ),
  getAllStatement: database.prepare(`SELECT * FROM Bookings;`),
  updateStatement: database.prepare(`
    UPDATE Bookings
    SET
      user_id = $userId,
      service_id = $serviceId,
      booking_datetime = $bookingDateTime,
      notes = $notes
    WHERE booking_id = $booking_id;
  `),
  insertStatement: database.prepare(`
    INSERT INTO Bookings (booking_id, user_id, service_id, booking_datetime, notes) VALUES (
      $booking_id,
      $userId,
      $serviceId,
      $bookingDateTime,
      $notes
    );
  `),
  deleteStatement: database.prepare(
    `DELETE FROM Bookings WHERE booking_id = ?;`,
  ),
});
