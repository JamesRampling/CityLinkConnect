import { Responses } from '#server/utils/responses';
import type { RequestHandler } from 'express';
import z from 'zod';

type InferParams<T> = {
  [Property in keyof T]: z.infer<AcceptsString<T[Property]>>;
};

type AcceptsString<T> = z.input<T> extends string ? T : AcceptsUnknown<T>;
type AcceptsUnknown<T> = unknown extends z.input<T> ? T : never;

export function validate<
  RouteParamsSchema extends Record<string, z.ZodType>,
  QueryParamsSchema extends Record<string, z.ZodType>,
  ReqBodySchema extends z.ZodType,
>({
  route,
  body,
}: {
  route?: RouteParamsSchema;
  body?: ReqBodySchema;
}): RequestHandler<
  InferParams<RouteParamsSchema>,
  unknown,
  z.infer<ReqBodySchema>,
  InferParams<QueryParamsSchema>
> {
  return (req, res, next) => {
    let routeError: z.ZodError | undefined;
    if (route) {
      const routeSchema = z.looseObject(route);
      const result = routeSchema.safeParse(req.params);
      if (result.success) {
        req.route = result.data;
      } else {
        routeError = result.error;
      }
    }

    let bodyError: z.ZodError | undefined;
    if (body) {
      const result = body.safeParse(req.body);
      if (result.success) {
        req.body = result.data;
      } else {
        bodyError = result.error;
      }
    }

    if (routeError || bodyError) {
      Responses.error(res, {
        type: 'validation-error',
        title: 'Request failed data validation.',
        status: 400,
        body_issues: bodyError ? z.flattenError(bodyError).fieldErrors : null,
        route_issues: routeError
          ? z.flattenError(routeError).fieldErrors
          : null,
      });

      return;
    }

    next();
  };
}
