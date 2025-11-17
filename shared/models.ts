import { AnnouncementContent, ServiceContent } from '#shared/xmlModels';
import { z } from 'zod';

const tableId = z.int().nonnegative();

export const Service = z.object({
  service_id: tableId.default(0),
  config: z.string(),
});

export const ServiceWithXML = Service.extend({ config: ServiceContent });

export const User = z.object({
  user_id: tableId.default(0),
  given_names: z.string().nonempty(),
  last_name: z.string().nonempty(),
  email: z.email(),
  phone: z.string().regex(/0[0-9]{9}/, 'Must be a valid phone number.'),
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
  subject: z.string().min(3),
  message: z.string().min(10),
});

export const Announcement = z.object({
  announcement_id: tableId.default(0),
  sort_datetime: z.iso.datetime({ local: true }),
  config: z.string(),
});

export const AnnouncementWithXML = Announcement.extend({
  config: AnnouncementContent,
});
