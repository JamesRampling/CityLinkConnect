import {
  filterNonSQLInputValues,
  type DatabaseCollection,
} from '#server/database/DatabaseCollection';
import { Booking, BookingWithRelations } from '#shared/models';
import type { DatabaseSync, SQLOutputValue, StatementSync } from 'node:sqlite';
import z from 'zod';

export class BookingsCollection
  implements
    DatabaseCollection<
      z.infer<typeof Booking>,
      z.infer<typeof BookingWithRelations>
    >
{
  constructor(database: DatabaseSync) {
    this.database = database;
    this.getAllStatement = this.database.prepare(/*sql*/ `
      SELECT * FROM Bookings
        JOIN Users ON Bookings.user_id = Users.user_id
        JOIN Services ON Bookings.service_id = Services.service_id;
    `);

    this.getSingleStatement = this.database.prepare(/*sql*/ `
      SELECT * FROM Bookings
        JOIN Users ON Bookings.user_id = Users.user_id
        JOIN Services ON Bookings.service_id = Services.service_id;
        WHERE booking_id = $id;
    `);

    this.updateStatement = this.database.prepare(/*sql*/ `
      UPDATE Bookings
      SET
        user_id = $user_id,
        service_id = $service_id,
        booking_datetime = $booking_datetime,
        notes = $notes
      WHERE booking_id = $booking_id;
    `);

    this.insertStatement = this.database.prepare(/*sql*/ `
      INSERT INTO Bookings (booking_id, user_id, service_id, booking_datetime, notes) VALUES (
        $booking_id,
        $user_id,
        $service_id,
        $booking_datetime,
        $notes
      );
    `);

    this.deleteStatement = this.database.prepare(/*sql*/ `
      DELETE FROM Bookings WHERE booking_id = $id;
    `);
  }

  private database: DatabaseSync;
  private getAllStatement: StatementSync;
  private getSingleStatement: StatementSync;
  private updateStatement: StatementSync;
  private insertStatement: StatementSync;
  private deleteStatement: StatementSync;

  getAll(): z.infer<typeof BookingWithRelations>[] {
    const data = this.getAllStatement.all().map(mapToBookingWithRelations);
    return BookingWithRelations.array().parse(data);
  }

  getSingle(id: number): z.infer<typeof BookingWithRelations> | undefined {
    const data = this.getSingleStatement.get({ id });
    if (!data) return undefined;
    return BookingWithRelations.parse(mapToBookingWithRelations(data));
  }

  update(entry: z.infer<typeof Booking>): boolean {
    const input = Booking.safeParse(entry);
    if (!input.success) return false;

    const inputValues = filterNonSQLInputValues(input.data);
    const result = this.updateStatement.run(inputValues);

    return result.changes > 0;
  }

  insert(entry: z.infer<typeof Booking>): boolean {
    const input = Booking.safeParse(entry);
    if (!input.success) return false;

    const inputValues = filterNonSQLInputValues(input.data);
    const result = this.insertStatement.run(inputValues);

    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = this.deleteStatement.run({ id });
    return result.changes > 0;
  }
}

function mapToBookingWithRelations(row: Record<string, SQLOutputValue>) {
  const {
    // Bookings fields
    booking_id,
    user_id,
    service_id,
    booking_datetime,
    notes,
    // Users fields
    given_names,
    last_name,
    email,
    phone,
    // Services fields
    config,
  } = row;

  const user =
    typeof user_id === 'number'
      ? { user_id, given_names, last_name, email, phone }
      : undefined;

  const service =
    typeof service_id === 'number' ? { service_id, config } : undefined;

  return {
    booking_id,
    user_id,
    service_id,
    booking_datetime,
    notes,
    user,
    service,
  };
}
