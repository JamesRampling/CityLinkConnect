import type { SQLiteDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import { Booking, BookingWithRelations } from '#shared/models';
import type { SQLOutputValue } from 'node:sqlite';

export const BookingsCollectionConfig = {
  inZodSchema: Booking,
  outZodSchema: BookingWithRelations,

  getAllSQL: /*sql*/ `
    SELECT * FROM Bookings
      LEFT JOIN Users ON Bookings.user_id = Users.user_id
      LEFT JOIN Services ON Bookings.service_id = Services.service_id;
  `,

  getSingleSQL: /*sql*/ `
    SELECT * FROM Bookings
      LEFT JOIN Users ON Bookings.user_id = Users.user_id
      LEFT JOIN Services ON Bookings.service_id = Services.service_id
      WHERE booking_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Bookings (booking_id, user_id, service_id, booking_datetime, notes)
      VALUES (NULL, $user_id, $service_id, $booking_datetime, $notes);
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

  mapRowsToObjects: (rows) =>
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
    }),
} satisfies SQLiteDatabaseCollectionConfig<
  typeof Booking,
  typeof BookingWithRelations
>;
