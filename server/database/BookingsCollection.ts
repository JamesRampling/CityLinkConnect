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
    this.getAllStatement = database.prepare(/*sql*/ `
      SELECT * FROM Bookings
        LEFT JOIN Users ON Bookings.user_id = Users.user_id
        LEFT JOIN Services ON Bookings.service_id = Services.service_id;
    `);

    this.getSingleStatement = database.prepare(/*sql*/ `
      SELECT * FROM Bookings
        LEFT JOIN Users ON Bookings.user_id = Users.user_id
        LEFT JOIN Services ON Bookings.service_id = Services.service_id
        WHERE booking_id = $id;
    `);

    this.insertStatement = database.prepare(/*sql*/ `
      INSERT INTO Bookings (booking_id, user_id, service_id, booking_datetime, notes) VALUES (
        NULL,
        $user_id,
        $service_id,
        $booking_datetime,
        $notes
      );
    `);

    this.updateStatement = database.prepare(/*sql*/ `
      UPDATE Bookings
      SET
        user_id = $user_id,
        service_id = $service_id,
        booking_datetime = $booking_datetime,
        notes = $notes
      WHERE booking_id = $booking_id;
    `);

    this.deleteStatement = database.prepare(/*sql*/ `
      DELETE FROM Bookings WHERE booking_id = $id;
    `);

    this.insertStatement.setAllowBareNamedParameters(true);
    this.insertStatement.setAllowUnknownNamedParameters(true);
    this.updateStatement.setAllowBareNamedParameters(true);
    this.updateStatement.setAllowUnknownNamedParameters(true);
    this.deleteStatement.setAllowBareNamedParameters(true);
    this.deleteStatement.setAllowUnknownNamedParameters(true);
  }

  private getAllStatement: StatementSync;
  private getSingleStatement: StatementSync;
  private insertStatement: StatementSync;
  private updateStatement: StatementSync;
  private deleteStatement: StatementSync;

  getAll(): z.infer<typeof BookingWithRelations>[] {
    const data = this.getAllStatement.all().map(mapToBookingWithRelations);
    return z.array(BookingWithRelations).parse(data);
  }

  getSingle(id: number): z.infer<typeof BookingWithRelations> | undefined {
    const data = this.getSingleStatement.get({ id });
    if (!data) return undefined;
    return BookingWithRelations.parse(mapToBookingWithRelations(data));
  }

  insert(entry: z.infer<typeof Booking>): number | undefined {
    const input = Booking.safeParse(entry);
    if (!input.success) return;

    const inputValues = filterNonSQLInputValues(input.data);
    const result = this.insertStatement.run(inputValues);
    if (result.changes === 0) return;

    return Number(result.lastInsertRowid);
  }

  update(entry: z.infer<typeof Booking>): boolean {
    const input = Booking.safeParse(entry);
    if (!input.success) return false;

    const inputValues = filterNonSQLInputValues(input.data);
    const result = this.updateStatement.run(inputValues);

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
