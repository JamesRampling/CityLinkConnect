import { z } from 'zod';

export const ServiceFee = z.object({
  title: z.string(),
  prices: z.array(z.object({ variant: z.string(), price: z.string() })),
});

export const Service = z.object({
  name: z.string(),
  description: z.string(),
  fees: z.array(ServiceFee),
});

export const Announcement = z.object({
  title: z.string(),
  date: z.iso.date(),
  content: z.string(),
});

export const Booking = z.object({
  booking_id: z.number(),
  // serviceId: z.number(),
  // userId: z.number(),
  // bookingDateTime: z.iso.datetime(),
  notes: z.string(),
});
