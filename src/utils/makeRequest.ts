import { ApiError } from '#shared/errors';
import { Result } from '#shared/utils/Result';
import z from 'zod';

interface UnknownError<T = unknown> {
  type: 'unknown-error';
  error: T;
}

interface InvalidServerResponse {
  type: 'invalid-server-response';
}

interface ResponseParseFail {
  type: 'response-parse-fail';
  error: z.ZodError;
}

type Error =
  | UnknownError
  | InvalidServerResponse
  | ResponseParseFail
  | z.infer<typeof ApiError>;

type GetResult<T> = Result<T, Error>;
type PostResult<T> = Result<T, Error>;
type PutResult<T> = Result<T, Error>;
type DeleteResult = Result<undefined, Error>;

interface GetRequestOptions<Output extends z.ZodType> {
  method: 'GET';
  outputSchema: Output;
  inputSchema?: undefined;
  data?: undefined;
  route: string;
  headers?: Record<string, string>;
}

interface PostRequestOptions<
  Input extends z.ZodType,
  Output extends z.ZodType,
> {
  method: 'POST';
  outputSchema: Output;
  inputSchema: Input;
  data: z.input<Input>;
  route: string;
  headers?: Record<string, string>;
}

interface PutRequestOptions<Input extends z.ZodType, Output extends z.ZodType> {
  method: 'PUT';
  outputSchema: Output;
  inputSchema: Input;
  data: z.input<Input>;
  route: string;
  headers?: Record<string, string>;
}

interface DeleteRequestOptions {
  method: 'DELETE';
  outputSchema?: undefined;
  inputSchema?: undefined;
  data?: undefined;
  route: string;
  headers?: Record<string, string>;
}

type RequestOptions<
  Output extends z.ZodType = z.ZodType,
  Input extends z.ZodType = z.ZodType,
> =
  | GetRequestOptions<Output>
  | PostRequestOptions<Input, Output>
  | PutRequestOptions<Input, Output>
  | DeleteRequestOptions;

export async function makeRequest<Out extends z.ZodType>(
  options: GetRequestOptions<Out>,
): Promise<GetResult<z.infer<Out>>>;
export async function makeRequest<Out extends z.ZodType, In extends z.ZodType>(
  options: PostRequestOptions<In, Out>,
): Promise<PostResult<z.infer<Out>>>;
export async function makeRequest<Out extends z.ZodType, In extends z.ZodType>(
  options: PutRequestOptions<In, Out>,
): Promise<PutResult<z.infer<Out>>>;
export async function makeRequest(
  options: DeleteRequestOptions,
): Promise<DeleteResult>;
export async function makeRequest(
  options: RequestOptions,
): Promise<Result<unknown, Error>> {
  const { route, method, headers, inputSchema, outputSchema, data } = options;

  try {
    const response = await fetch(route, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : null,
    });

    const isJsonContentType =
      response.headers.get('Content-Type') === 'application/json';

    if (isJsonContentType && outputSchema && response.ok) {
      const json = await response.json();
      const obj = outputSchema.parse(json);
      return Result.ok(obj);
    }

    if ((method === 'POST' || method === 'PUT') && response.status === 204) {
      return Result.ok(inputSchema.parse(data));
    }

    if (response.status === 204 && method === 'DELETE') {
      return Result.ok(undefined);
    }

    if (isJsonContentType && response.status >= 400) {
      const error = await response.json();
      const obj = ApiError.parse(error);
      return Result.error(obj);
    }

    return Result.error({ type: 'invalid-server-response' });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return Result.error({ type: 'response-parse-fail', error: e });
    }

    return Result.error({ type: 'unknown-error', error: e });
  }
}
