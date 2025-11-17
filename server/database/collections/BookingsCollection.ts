import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryFiltered,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { Booking } from '#shared/models';
import z from 'zod';

export default {
  getAll: queryAll(Booking, /*sql*/ `SELECT * FROM Bookings;`),

  getAllByUserId: queryFiltered(
    z.int(),
    Booking,
    /*sql*/ `SELECT * FROM Bookings WHERE user_id = ?;`,
  ),

  getFromId: queryUnique(
    z.int(),
    Booking,
    /*sql*/ `SELECT * FROM Bookings WHERE booking_id = ?;`,
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
