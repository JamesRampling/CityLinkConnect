import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryFiltered,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { Booking, Service, User } from '#shared/models';
import z from 'zod';

const BookingWithService = z.transform<
  z.infer<typeof Booking> & z.infer<typeof Service>,
  z.infer<typeof Booking> & { service: z.infer<typeof Service> }
>(
  ({
    booking_datetime,
    booking_id,
    notes,
    user_id,
    service_id,
    config,
    is_hidden,
  }) => ({
    booking_datetime,
    booking_id,
    notes,
    user_id,
    service_id,
    service: { service_id, config, is_hidden },
  }),
);

const BookingWithUserAndService = z.transform<
  z.infer<typeof Booking> & z.infer<typeof Service> & z.infer<typeof User>,
  z.infer<typeof Booking> & {
    service: z.infer<typeof Service>;
    user: z.infer<typeof User>;
  }
>(
  ({
    booking_id,
    booking_datetime,
    notes,
    service_id,
    config,
    is_hidden,
    user_id,
    given_names,
    last_name,
    email,
    phone,
  }) => ({
    booking_id,
    booking_datetime,
    notes,
    user_id,
    user: { user_id, given_names, last_name, email, phone },
    service_id,
    service: { service_id, config, is_hidden },
  }),
);

export default {
  getAll: queryAll(
    BookingWithUserAndService,
    /*sql*/ `
    SELECT * FROM Bookings
      JOIN Services ON Bookings.service_id = Services.service_id
      JOIN Users ON Bookings.user_id = Users.user_id
      ORDER BY Bookings.booking_datetime DESC;`,
  ),

  getAllByUserId: queryFiltered(
    z.int(),
    BookingWithService,
    /*sql*/ `
      SELECT * FROM Bookings
        JOIN Services ON Bookings.service_id = Services.service_id
        WHERE Bookings.user_id = ?;`,
  ),

  getFromId: queryUnique(
    z.int(),
    BookingWithUserAndService,
    /*sql*/ `
      SELECT * FROM Bookings
        JOIN Services ON Bookings.service_id = Services.service_id
        JOIN Users ON Bookings.user_id = Users.user_id
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
