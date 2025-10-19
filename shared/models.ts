import { z } from 'zod';

const tableId = z.int().nonnegative();

export const Service = z.object({
  service_id: tableId.default(0),
  config: z.string(),
});

export const User = z.object({
  user_id: tableId.default(0),
  given_names: z.string(),
  last_name: z.string(),
  email: z.email(),
  phone: z.string(),
});

export const Booking = z.object({
  booking_id: tableId.default(0),
  user_id: tableId.nullable(),
  service_id: tableId.nullable(),
  booking_datetime: z.iso.datetime(),
  notes: z.string().nullable(),
});

export const Feedback = z.object({
  feedback_id: tableId.default(0),
  email: z.email(),
  subject: z.string(),
  message: z.string(),
});

export const Announcement = z.object({
  announcement_id: tableId.default(0),
  sort_datetime: z.iso.datetime(),
  config: z.string(),
});

/**
 * Extended Booking model that includes the User and Service type.
 */
export const BookingWithRelations = Booking.extend({
  user: User.nullable(),
  service: Service.nullable(),
});

/**
 * Extended User model that includes their Bookings (with Service type).
 */
export const UserWithRelations = User.extend({
  bookings: Booking.extend({ service: Service.nullable() }).array(),
});
