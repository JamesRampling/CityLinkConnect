import z from 'zod';

export const AnnouncementXML = z.object({
  title: z.string(),
  date: z.iso.date(),
  content: z.string(),
});

export const ServiceXML = z.object({
  name: z.string(),
  description: z.string(),
  fees: z.record(z.string(), z.record(z.string(), z.string())).optional(),
});
