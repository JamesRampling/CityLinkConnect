import { ApiError } from '#shared/errors';
import { Result } from '#shared/utils/Result';
import z from 'zod';

/**
 * Generic error has occurred.
 */
interface FetchError {
  type: 'fetch-error';
  status?: number;
  error: unknown;
}

/**
 * The response body object failed to be parsed.
 */
interface DataParseError<T extends z.ZodType | undefined> {
  type: 'fetch-data-parse';
  status: number;
  error: Error | z.ZodError<T>;
}

/**
 * The error object (ApiError) failed to be parsed.
 */
interface ErrorObjectParseError {
  type: 'fetch-error-obj-parse';
  status: number;
  error: Error | z.ZodError<typeof ApiError>;
}

export type FetchResult<T extends z.ZodType | undefined> = Result<
  T extends undefined ? undefined : z.infer<T>,
  | z.infer<typeof ApiError>
  | FetchError
  | DataParseError<T>
  | ErrorObjectParseError
>;

export function apiFetch(
  route: string,
  method: RequestInit['method'],
  body: z.input<typeof inputSchema>,
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
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
}

export async function checkResponseWithBody<Output extends z.ZodType>(
  res: Promise<Response>,
  outputSchema: Output,
): Promise<FetchResult<Output>> {
  let status: number | undefined;

  try {
    const response = await res;
    status = response.status;

    if (response.ok) {
      const { ok, data, error } = await parseResultBody(response, outputSchema);

      if (ok) {
        // @ts-expect-error Cannot assign to conditional type that allows
        // undefined or zod type.
        return Result.ok(data);
      }

      return Result.error({ type: 'fetch-data-parse', status, error });
    }

    const { ok, data, error } = await parseResultBody(response, ApiError);

    if (ok) {
      return Result.error(data);
    }

    return Result.error({ type: 'fetch-error-obj-parse', status, error });
  } catch (error) {
    return Result.error({ type: 'fetch-error', error, status });
  }
}

export async function checkResponseWithoutBody(
  res: Promise<Response>,
): Promise<FetchResult<undefined>> {
  let status: number | undefined;
  try {
    const response = await res;
    status = response.status;

    if (response.ok) {
      return Result.ok(undefined);
    }
    const { ok, data, error } = await parseResultBody(response, ApiError);

    if (ok) {
      return Result.error(data);
    }

    return Result.error({ type: 'fetch-error-obj-parse', status, error });
  } catch (error) {
    return Result.error({ type: 'fetch-error', error, status });
  }
}

export async function parseResultBody<T extends z.ZodType>(
  response: Response,
  schema: T,
): Promise<
  Result<z.infer<T>, z.ZodError<T> | SyntaxError | TypeError | Error>
> {
  if (!response.headers.get('Content-Type')?.startsWith('application/json')) {
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
