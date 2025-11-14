import type { ApiError } from '#shared/errors';
import { Result } from '#shared/utils/Result';
import type z from 'zod';

interface UnknownError<T = unknown> {
  type: 'unknown-error';
  error: T;
}

interface ResponseParseFail {
  type: 'response-parse-fail';
  error: z.ZodError;
}

type Error = UnknownError | ResponseParseFail | z.infer<typeof ApiError>;

export async function fetch2(
  route: string,
  method: RequestInit['method'],
  data: z.input<typeof inputSchema>,
  inputSchema?: z.ZodType,
  outputSchema?: z.ZodType,
  auth?: string,
  headers: Record<string, string> = {},
): Promise<Result<z.infer<typeof outputSchema>, Error>> {
  const response = await fetch(route, {
    method,
    headers: {
      ...headers,
      ...(inputSchema ? { 'Content-Type': 'application/json' } : {}),
      ...(outputSchema ? { Accept: 'application/json' } : {}),
      ...(auth ? { Authorization: auth } : {}),
    },
  });
  throw Error('Not implemented yet.');
}
