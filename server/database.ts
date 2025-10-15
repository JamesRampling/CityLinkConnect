import { AnnouncementsCollectionConfig } from '#server/database/AnnouncementsCollection';
import { BookingsCollectionConfig } from '#server/database/BookingsCollection';
import { SQLiteDatabaseCollection } from '#server/database/DatabaseCollection';
import { FeedbackCollectionConfig } from '#server/database/FeedbackCollection';
import { ServicesCollectionConfig } from '#server/database/ServicesCollection';
import { UsersCollectionConfig } from '#server/database/UsersCollection';
import { DatabaseSync } from 'node:sqlite';

export const database = new DatabaseSync(':memory:');

database.exec(/*sql*/ `
CREATE TABLE Services (
  service_id INTEGER PRIMARY KEY NOT NULL,
  config TEXT NOT NULL
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
  sort_datetime TEXT NOT NULL,
  config TEXT NOT NULL
);

-- Seed with some example data
INSERT INTO Services (config) VALUES
  ('{"name":"Service 1"}'),
  ('{"name":"Service 2"}'),
  ('{"name":"Service 3"}');

INSERT INTO Users (given_names, last_name, email, phone) VALUES
  ('John', 'Doe', 'j.doe@example.com', '+1234567890'),
  ('Jane', 'Smith', 'j.smith@example.com', '0412345678');

INSERT INTO Bookings (user_id, service_id, booking_datetime, notes) VALUES
  (1, 1, '2024-06-15T10:00:00Z', 'First booking'),
  (2, NULL, '2024-06-16T14:30:00Z', 'Second booking'),
  (2, 3, '2024-06-16T14:30:00Z', 'Third booking');

INSERT INTO Announcements (sort_datetime, config) VALUES
  ('2024-06-10T09:00:00Z', '{"title":"Announcement 1","content":"Content for announcement 1."}'),
  ('2024-06-12T15:00:00Z', '{"title":"Announcement 2","content":"Content for announcement 2."}');

INSERT INTO Feedback (email, subject, message) VALUES
  ('example@example.com', 'Feedback Subject', 'This is a feedback message.'),
  ('example2@example.com', 'Feedback Subject 2', 'This is a feedback message 2.');

`);

export const Bookings = new SQLiteDatabaseCollection(
  database,
  BookingsCollectionConfig,
);

export const Announcements = new SQLiteDatabaseCollection(
  database,
  AnnouncementsCollectionConfig,
);

export const Feedback = new SQLiteDatabaseCollection(
  database,
  FeedbackCollectionConfig,
);

export const Services = new SQLiteDatabaseCollection(
  database,
  ServicesCollectionConfig,
);

export const Users = new SQLiteDatabaseCollection(
  database,
  UsersCollectionConfig,
);
