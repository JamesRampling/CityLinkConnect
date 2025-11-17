import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryFiltered,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { Booking, Service } from '#shared/models';
import z from 'zod';

const BookingJoinTransform = z.transform<
  z.infer<typeof Booking> & z.infer<typeof Service>,
  z.infer<typeof Booking> & { service: z.infer<typeof Service> }
>((input) => {
  const { booking_datetime, booking_id, notes, user_id, service_id, config } =
    input;
  return {
    booking_datetime,
    booking_id,
    notes,
    service_id,
    user_id,
    service: { service_id, config },
  };
});

export default {
  getAll: queryAll(
    BookingJoinTransform,
    /*sql*/ `
    SELECT * FROM Bookings
      LEFT JOIN Services ON Bookings.service_id = Services.service_id;`,
  ),

  getAllByUserId: queryFiltered(
    z.int(),
    BookingJoinTransform,
    /*sql*/ `
      SELECT * FROM Bookings
        LEFT JOIN Services ON Bookings.service_id = Services.service_id
        WHERE user_id = ?;`,
  ),

  getFromId: queryUnique(
    z.int(),
    BookingJoinTransform,
    /*sql*/ `
      SELECT * FROM Bookings
        LEFT JOIN Services ON Bookings.service_id = Services.service_id
        WHERE booking_id = ?;`,
  ),

  insert: mutateRows(
    Booking.omit({ booking_id: true }),
    /*sql*/ `
    INSERT INTO Bookings (user_id, service_id, booking_datetime, notes)
           VALUES ($user_id, $service_id, $booking_datetime, $notes);`,
  ),

  update: mutateRows(
    Booking.extend({ booking_id: z.int() }),
    /*sql*/ `
    UPDATE Bookings
    SET
      user_id = $user_id,
      service_id = $service_id,
      booking_datetime = $booking_datetime,
      notes = $notes
    WHERE booking_id = $booking_id;
    `,
  ),

  delete: mutateRows(
    z.int(),
    /*sql*/ `DELETE FROM Bookings WHERE booking_id = ?;`,
  ),
} satisfies DatabaseConfig;
