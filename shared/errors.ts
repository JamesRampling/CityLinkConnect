import z from 'zod';

const validationIssues = z.object().catchall(z.array(z.string()));
export const ValidationError = z.object({
  type: z.literal('validation-error'),
  title: z.string(),
  status: z.literal(400),
  body_issues: validationIssues.nullable(),
  route_issues: validationIssues.nullable(),
});

export const NotFoundError = z.object({
  type: z.literal('not-found'),
  title: z.string(),
  status: z.literal(404),
});

export const UnauthorizedError = z.object({
  type: z.literal('unauthorized'),
  title: z.string(),
  status: z.literal(401),
});

export const ForbiddenError = z.object({
  type: z.literal('forbidden'),
  title: z.string(),
  status: z.literal(403),
});

export const ServerError = z.object({
  type: z.literal('server-error'),
  title: z.string(),
  status: z.literal(500),
  details: z.any().optional(),
});

export const ApiError = z.discriminatedUnion('type', [
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ServerError,
]);
