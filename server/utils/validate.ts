import { Responses } from '#server/utils/responses';
import type { RequestHandler } from 'express';
import z from 'zod';

/**
 * Create a Zod codec that converts between a JSON string and type-safe
 * Zod-parsed value. https://zod.dev/codecs#jsonschema
 * @param schema The Zod schema to convert between json-object forms.
 */
export function jsonCodec<T extends z.ZodType>(
  schema: T,
): z.ZodCodec<z.ZodString, T> {
  return z.codec(z.string(), schema, {
    decode: (jsonString, ctx) => {
      try {
        return JSON.parse(jsonString);
      } catch (err: unknown) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'json_string',
          input: jsonString,
          message: err instanceof Error ? err.message : undefined,
        });
        return z.NEVER;
      }
    },
    encode: (value) => JSON.stringify(value),
  });
}

/**
 * Built-in transforms aliased with their key, e.g. 'string' or 'number'.
 */
const typeTransforms = {
  string: z.transform((v: string) => v),
  number: z.transform((v: string) => Number(v)),
  int: z.transform((v: string) => Number.parseInt(v, 10)),
};

/** A list of available aliased types, e.g. 'string', 'number'. */
type TypeTransformOptions = keyof typeof typeTransforms;

/** Either one of the available aliased types, or any Zod type that accepts a
 * string as its input. */
type RouteParamOption = TypeTransformOptions | z.ZodType<unknown, string>;

/**
 * Converts a record of route parameter names -> {@link TypeTransformOptions} to
 * a record of parameter names to their output types, e.g. number.
 */
type RouteParams<Route extends Record<string, RouteParamOption>> = {
  // For each entry in the record, determine its output type.
  [Param in keyof Route]: Route[Param] extends TypeTransformOptions
    ? // Get the output type of an aliased transform.
      z.output<(typeof typeTransforms)[Route[Param]]>
    : // Get the output type of the Zod type.
      z.output<Route[Param]>;
};

/**
 * Express.js middleware to validate and parse input values to a defined type.
 */
export function validate<
  Route extends Record<string, RouteParamOption>,
  Body extends z.ZodType,
>({
  route,
  body,
}: {
  /** A record of route parameter names to their expected types. */
  route?: Route;
  /** The Zod schema to validate the body content against. */
  body?: Body;
}): RequestHandler<RouteParams<Route>, unknown, z.infer<Body>> {
  return (req, res, next) => {
    let routeError: z.ZodError | undefined;
    if (route) {
      const routeSchema = z.looseObject(
        Object.fromEntries(
          Object.entries(route).map(([p, t]) => [
            p,
            typeof t === 'string' ? typeTransforms[t] : t,
          ]),
        ),
      );
      const result = routeSchema.safeParse(req.params);
      if (result.success) {
        req.params = result.data as RouteParams<Route>;
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

    if (!routeError && !bodyError) {
      console.log(req.params);
      next();
      return;
    }

    Responses.error(res, {
      type: 'validation-error',
      title: 'Request failed data validation.',
      status: 400,
      body_issues: bodyError ? z.flattenError(bodyError).fieldErrors : null,
      route_issues: routeError ? z.flattenError(routeError).fieldErrors : null,
    });
  };
}
