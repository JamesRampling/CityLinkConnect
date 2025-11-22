import { AnnouncementContent, ServiceContent } from '#shared/xmlModels';
import { z } from 'zod';

const tableId = z.int().nonnegative();

export const Service = z.object({
  service_id: tableId.default(0),
  config: z.string(),
  is_hidden: z.coerce.boolean(),
});

export const ServiceWithXML = Service.extend({ config: ServiceContent });

export const User = z.object({
  user_id: tableId.default(0),
  given_names: z.string().nonempty(),
  last_name: z.string().nonempty(),
  email: z.email(),
  phone: z.string().regex(/^0[0-9]{9}$/, 'Must be a valid phone number.'),
});

const SecondsToDate = z.codec(z.number(), z.date(), {
  decode: (number) => new Date(number * 1000),
  encode: (date) => date.valueOf() / 1000,
});

export const AuthenticationStatus = z.object({
  is_admin: z.coerce.boolean(),
  iat: z.coerce.number().int().pipe(SecondsToDate),
  exp: z.coerce.number().int().pipe(SecondsToDate),
  sub: z.coerce.number().int().nonnegative(),
});

export const Booking = z.object({
  booking_id: tableId.default(0),
  user_id: tableId,
  service_id: tableId,
  booking_datetime: z.iso.datetime({ local: true }),
  notes: z.string().nullable(),
});

export const Feedback = z.object({
  feedback_id: tableId.default(0),
  email: z.email(),
  subject: z
    .string()
    .min(3, { error: 'Subject must be at least 3 characters long.' }),
  message: z
    .string()
    .min(10, { error: 'Subject must be at least 10 characters long.' }),
});

export const Announcement = z.object({
  announcement_id: tableId.default(0),
  sort_datetime: z.iso.date(),
  config: z.string(),
});

export const AnnouncementWithXML = Announcement.extend({
  config: AnnouncementContent,
});

export const PasswordString = z
  .string()
  .min(8, { error: 'Password must be at least 8 characters long.' })
  .refine((password) => password !== password.toLocaleLowerCase(), {
    error: 'Password must contain an uppercase character.',
  })
  .refine((password) => /\d/.test(password), {
    error: 'Password must contain at least one numeric digit.',
  });
