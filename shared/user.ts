import * as z from 'zod';

export const User = z.object({
  id: z.uuidv4(),
  name: z.string().min(3).max(16),
  date_of_birth: z.coerce.date(),
});

export type User = z.infer<typeof User>;
