import { Result } from '#shared/utils/Result';
import z from 'zod';

export function apiFetch(
  route: string,
  method: RequestInit['method'],
  data: z.input<typeof inputSchema>,
  inputSchema?: z.ZodType,
  outputSchema?: z.ZodType,
  auth?: string,
  signal?: AbortSignal,
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetch(route, {
    method,
    headers: {
      ...(inputSchema ? { 'Content-Type': 'application/json' } : {}),
      ...(outputSchema ? { Accept: 'application/json' } : {}),
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });
}

export async function parseResultBody<T extends z.ZodType>(
  response: Response,
  schema: T,
): Promise<
  Result<z.infer<T>, z.ZodError<T> | SyntaxError | TypeError | Error>
> {
  if (response.headers.get('Content-Type') !== 'application/json') {
    return Result.error(TypeError('Content-Type is not application/json.'));
  }

  try {
    const data = await response.json();
    const parsed = schema.parse(data);
    return Result.ok(parsed);
  } catch (e) {
    if (e instanceof Error) {
      return Result.error(e);
    }
    throw e;
  }
}
