import { ApiError } from '#shared/errors';
import { Result } from '#shared/utils/Result';
import { apiFetch, parseResultBody } from '@/api/apiFetch';
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
interface DataParseError<T> {
  type: 'fetch-data-parse';
  error: Error | z.ZodError<T>;
}

/**
 * The error object (ApiError) failed to be parsed.
 */
interface ErrorObjectParseError {
  type: 'fetch-error-obj-parse';
  error: Error | z.ZodError<typeof ApiError>;
}

type FetchResult<T> = Result<
  T,
  | z.infer<typeof ApiError>
  | FetchError
  | DataParseError<T>
  | ErrorObjectParseError
>;

export function post<Input extends z.ZodType, Output extends z.ZodType>(
  route: string,
  inputSchema: Input,
  outputSchema: Output,
) {
  return async (
    body: z.input<Input>,
    auth?: z.infer<z.ZodJWT>,
    signal?: AbortSignal,
  ): Promise<FetchResult<z.infer<Output>>> => {
    let status: number | undefined;

    try {
      const response = await apiFetch(
        route,
        'POST',
        body,
        inputSchema,
        outputSchema,
        auth,
        signal,
      );
      status = response.status;

      if (response.ok) {
        const { ok, data, error } = await parseResultBody(
          response,
          outputSchema,
        );

        if (ok) {
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
  };
}

export function postNoResponseContent<Input extends z.ZodType>(
  route: string,
  inputSchema: Input,
) {
  return async (
    body: z.input<Input>,
    auth?: z.infer<z.ZodJWT>,
    signal?: AbortSignal,
  ): Promise<FetchResult<undefined>> => {
    let status: number | undefined;

    try {
      const response = await apiFetch(
        route,
        'POST',
        body,
        inputSchema,
        undefined,
        auth,
        signal,
      );

      if (response.ok) {
        return Result.ok(undefined);
      }
      const { ok, data, error } = await parseResultBody(response, ApiError);

      if (ok) {
        return Result.error(data);
      }

      return Result.error({ type: 'fetch-error-obj-parse', status, error });
    } catch (error) {
      return Result.error({ type: 'fetch-error', status, error });
    }
  };
}
