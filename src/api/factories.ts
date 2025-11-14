import { makeRequest } from '@/api/makeRequest';
import type z from 'zod';

export function post<Input extends z.ZodType, Output extends z.ZodType>(
  route: string,
  inputSchema: Input,
  outputSchema: Output,
) {
  return (data: z.input<Input>, auth?: z.infer<z.ZodJWT>) =>
    makeRequest({
      method: 'POST',
      inputSchema,
      outputSchema,
      route,
      data,
      auth,
    });
}
