import {
  apiFetch,
  checkResponseWithBody,
  checkResponseWithoutBody,
} from '@/api/apiFetch';
import z from 'zod';

export function requestInOut<
  Input extends z.ZodType,
  Output extends z.ZodType,
  Authenticate extends boolean,
>(
  method: RequestInit['method'],
  route: string,
  inputSchema: Input,
  outputSchema: Output,
  authenticate: Authenticate,
) {
  return async (
    body: z.input<Input>,
    ...[arg0, arg1]: Authenticate extends true
      ? [auth: z.infer<z.ZodJWT>, signal?: AbortSignal]
      : [signal?: AbortSignal]
  ) => {
    const [auth, signal] = authenticate
      ? [arg0 as string, arg1]
      : [undefined, arg0 as AbortSignal | undefined];

    const response = apiFetch(
      route,
      method,
      body,
      inputSchema,
      outputSchema,
      auth,
      signal,
    );

    return await checkResponseWithBody(response, outputSchema);
  };
}

export function requestIn<
  Input extends z.ZodType,
  Authenticate extends boolean,
>(
  method: RequestInit['method'],
  route: string,
  inputSchema: Input,
  authenticate: Authenticate,
) {
  return async (
    body: z.input<Input>,
    ...[arg0, arg1]: Authenticate extends true
      ? [auth: z.infer<z.ZodJWT>, signal?: AbortSignal]
      : [signal?: AbortSignal]
  ) => {
    const [auth, signal] = authenticate
      ? [arg0 as string, arg1]
      : [undefined, arg0 as AbortSignal | undefined];
    const response = apiFetch(
      route,
      method,
      body,
      inputSchema,
      undefined,
      auth,
      signal,
    );
    return await checkResponseWithoutBody(response);
  };
}
