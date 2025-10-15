import { z } from 'zod';

export const Service = z.object({
  service_id: z.number().int().nonnegative().default(0),
  config: z.string(),
});

export const User = z.object({
  user_id: z.number().int().nonnegative().default(0),
  given_names: z.string(),
  last_name: z.string(),
  email: z.email(),
  phone: z.string(),
});

export const Booking = z.object({
  booking_id: z.number().int().nonnegative().default(0),
  user_id: z.number().int().nonnegative().nullish(),
  service_id: z.number().int().nonnegative().nullish(),
  booking_datetime: z.iso.datetime(),
  notes: z.string().nullish(),
});

export const Feedback = z.object({
  feedback_id: z.number().int().nonnegative().default(0),
  email: z.email(),
  subject: z.string(),
  message: z.string(),
});

export const Announcement = z.object({
  announcement_id: z.number().int().nonnegative().default(0),
  sort_datetime: z.iso.datetime(),
  config: z.string(),
});

export const BookingWithRelations = Booking.extend({
  user: User.nullish(),
  service: Service.nullish(),
});

export const UserWithRelations = User.extend({ bookings: Booking.array() });

export const ServiceWithRelations = Service.extend({
  bookings: Booking.array(),
});
