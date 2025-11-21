export const schemaVersion = 2;

export default /*sql*/ `
-- Increment version when the schema changes
PRAGMA user_version = ${schemaVersion};

CREATE TABLE Services (
  service_id INTEGER PRIMARY KEY NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE TABLE Authentication (
  user_id INTEGER PRIMARY KEY NOT NULL REFERENCES Users ON DELETE CASCADE,
  argon2_hash TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
`;
