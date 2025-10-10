import { Booking } from '#shared/models';
import { DatabaseSync, StatementSync, type SQLInputValue } from 'node:sqlite';
import z, { ZodObject } from 'zod';

interface DatabaseCollection<T> {
  getAll(): T[];
  getSingle(id: number): T;
  update(entry: T): void;
  insert(entry: T): void;
  delete(id: number): void;
}

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

interface SqLiteDatabaseOptions<T extends ZodObject> {
  zodType: T;
  database: DatabaseSync;
  getAllStatement: StatementSync;
  getSingleStatement: StatementSync;
  updateStatement: StatementSync;
  insertStatement: StatementSync;
  deleteStatement: StatementSync;
}

class SqLiteDatabaseCollection<T extends ZodObject, TObj = z.infer<T>>
  implements DatabaseCollection<TObj>
{
  constructor(options: SqLiteDatabaseOptions<T>) {
    this.zodType = options.zodType;
    this.database = database;
    this.getAllStatement = options.getAllStatement;
    this.getSingleStatement = options.getSingleStatement;
    this.updateStatement = options.updateStatement;
    this.insertStatement = options.insertStatement;
    this.deleteStatement = options.deleteStatement;
  }

  private zodType: T;
  private database: DatabaseSync;
  private getAllStatement: StatementSync;
  private getSingleStatement: StatementSync;
  private updateStatement: StatementSync;
  private insertStatement: StatementSync;
  private deleteStatement: StatementSync;

  getAll(): TObj[] {
    const value = this.getAllStatement.all();
    console.log(value);
    return z.array(this.zodType).parse(value);
  }

  getSingle(id: number): TObj {
    const value = this.getSingleStatement.get(id);
    return this.zodType.parse(value);
  }

  update(entry: TObj): void {
    // TODO: handle complex data type such as objects.
    this.updateStatement.run(entry as Record<string, SQLInputValue>);
  }

  insert(entry: TObj): void {
    // TODO: handle complex data type such as objects.
    this.insertStatement.run(entry as Record<string, SQLInputValue>);
  }

  delete(id: number): void {
    this.deleteStatement.run(id);
  }
}

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
