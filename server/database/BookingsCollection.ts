import type { SQLiteJoinedDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import { Booking, BookingWithRelations } from '#shared/models';
import type { SQLOutputValue } from 'node:sqlite';

export const BookingsCollectionConfig = {
  zodSchema: Booking,
  joinedZodSchema: BookingWithRelations,

  allSQL: /*sql*/ `
    SELECT * FROM Bookings;
  `,

  allJoinedSQL: /*sql*/ `
    SELECT * FROM Bookings
      LEFT JOIN Users ON Bookings.user_id = Users.user_id
      LEFT JOIN Services ON Bookings.service_id = Services.service_id;
  `,

  singleSQL: /*sql*/ `
    SELECT * FROM Bookings
      WHERE booking_id = $id;
  `,

  singleJoinedSQL: /*sql*/ `
    SELECT * FROM Bookings
      LEFT JOIN Users ON Bookings.user_id = Users.user_id
      LEFT JOIN Services ON Bookings.service_id = Services.service_id
      WHERE booking_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Bookings (user_id, service_id, booking_datetime, notes)
      VALUES ($user_id, $service_id, $booking_datetime, $notes);
  `,

  updateSQL: /*sql*/ `
    UPDATE Bookings
      SET
        user_id = $user_id,
        service_id = $service_id,
        booking_datetime = $booking_datetime,
        notes = $notes
      WHERE booking_id = $booking_id;
  `,

  deleteSQL: /*sql*/ `
    DELETE FROM Bookings WHERE booking_id = $id;
  `,

  mapRowsToJoinedObjects: (rows) =>
    rows.map((row: Record<string, SQLOutputValue>) => {
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
          : null;

      const service =
        typeof service_id === 'number' ? { service_id, config } : null;

      return {
        booking_id,
        user_id,
        service_id,
        booking_datetime,
        notes,
        user,
        service,
      };
    }),
} satisfies SQLiteJoinedDatabaseCollectionConfig<
  typeof Booking,
  typeof BookingWithRelations
>;
