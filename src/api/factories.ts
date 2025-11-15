import {
  apiFetch,
  checkResponseWithBody,
  checkResponseWithoutBody,
} from '@/api/apiFetch';
import z from 'zod';

type RouteParams<Route extends string> =
  Route extends `${string}:${string}/${infer Rest}`
    ? [unknown, ...RouteParams<`/${Rest}`>]
    : Route extends `${string}:${string}`
      ? [unknown]
      : [];

function makeRoute<Route extends string>(route: Route) {
  const parts = route.split(/:[^\/]+/);

  const builder = (...params: RouteParams<Route>) => {
    let r = '';
    for (let i = 0; i < parts.length; i++) {
      r += parts[i];
      r += params[i]?.toString() ?? '';
    }
    return r;
  };

  builder.paramCount = parts.length - 1;
  return builder;
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function requestInOut<
  Input extends z.ZodType,
  Output extends z.ZodType,
  Authenticate extends boolean,
  Route extends string,
>(
  method: RequestMethod,
  baseRoute: Route,
  inputSchema: Input,
  outputSchema: Output,
  authenticate: Authenticate,
) {
  const route = makeRoute(baseRoute);

  return async (
    ...args: [
      ...Parameters<typeof route>,
      body: z.input<Input>,
      ...(Authenticate extends true
        ? [auth: z.infer<z.ZodJWT>, signal?: AbortSignal]
        : [signal?: AbortSignal]),
    ]
  ) => {
    const [params, body, auth, signal] = authenticate
      ? [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          args.shift(),
          args.shift() as string,
          args.shift() as AbortSignal | undefined,
        ]
      : [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          args.shift(),
          undefined,
          args.shift() as AbortSignal | undefined,
        ];

    const response = apiFetch(
      route(...params),
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
  Route extends string,
>(
  method: RequestMethod,
  baseRoute: Route,
  inputSchema: Input,
  authenticate: Authenticate,
) {
  const route = makeRoute(baseRoute);
  return async (
    ...args: [
      ...Parameters<typeof route>,
      body: z.input<Input>,
      ...(Authenticate extends true
        ? [auth: z.infer<z.ZodJWT>, signal?: AbortSignal]
        : [signal?: AbortSignal]),
    ]
  ) => {
    const [params, body, auth, signal] = authenticate
      ? [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          args.shift(),
          args.shift() as string,
          args.shift() as AbortSignal | undefined,
        ]
      : [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          args.shift(),
          undefined,
          args.shift() as AbortSignal | undefined,
        ];

    const response = apiFetch(
      route(...params),
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

export function requestOut<
  Output extends z.ZodType,
  Authenticate extends boolean,
  Route extends string,
>(
  method: RequestMethod,
  baseRoute: Route,
  outputSchema: Output,
  authenticate: Authenticate,
) {
  const route = makeRoute(baseRoute);
  return async (
    ...args: [
      ...Parameters<typeof route>,
      ...(Authenticate extends true
        ? [auth: z.infer<z.ZodJWT>, signal?: AbortSignal]
        : [signal?: AbortSignal]),
    ]
  ) => {
    const [params, auth, signal] = authenticate
      ? [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          args.shift() as string,
          args.shift() as AbortSignal | undefined,
        ]
      : [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          undefined,
          args.shift() as AbortSignal | undefined,
        ];

    const response = apiFetch(
      route(...params),
      method,
      undefined,
      undefined,
      outputSchema,
      auth,
      signal,
    );

    return await checkResponseWithBody(response, outputSchema);
  };
}

export function request<Authenticate extends boolean, Route extends string>(
  method: RequestMethod,
  baseRoute: Route,
  authenticate: Authenticate,
) {
  const route = makeRoute(baseRoute);
  return async (
    ...args: [
      ...Parameters<typeof route>,
      ...(Authenticate extends true
        ? [auth: z.infer<z.ZodJWT>, signal?: AbortSignal]
        : [signal?: AbortSignal]),
    ]
  ) => {
    const [params, auth, signal] = authenticate
      ? [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          args.shift() as string,
          args.shift() as AbortSignal | undefined,
        ]
      : [
          args.splice(0, route.paramCount) as Parameters<typeof route>,
          undefined,
          args.shift() as AbortSignal | undefined,
        ];

    const response = apiFetch(
      route(...params),
      method,
      undefined,
      undefined,
      undefined,
      auth,
      signal,
    );
    return await checkResponseWithoutBody(response);
  };
}
