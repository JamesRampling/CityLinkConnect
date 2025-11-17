import '#server/types';

import { JWT_SECRET } from '#server/secrets';
import { Responses } from '#server/utils/Responses';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';

const AuthenticationStatus = z.object({
  is_admin: z.coerce.boolean(),
  iat: z.coerce.number().int().pipe(z.coerce.date()),
  exp: z.coerce.number().int().pipe(z.coerce.date()),
  sub: z.coerce.number().int().nonnegative(),
});
export type AuthenticationStatus = z.infer<typeof AuthenticationStatus>;

export function authenticate<R, B>(
  req: Request<R, unknown, B>,
  res: Response,
  next: NextFunction,
) {
  const [bearer, token] = req.headers.authorization?.split(' ') ?? [];

  if (bearer === 'Bearer') {
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      const status = AuthenticationStatus.parse(verified);

      req.authentication = status;

      next();
      return;
    } catch {
      Responses.error(res, {
        type: 'unauthorized',
        status: 401,
        title: 'Invalid authentication token.',
      });
    }
  } else {
    Responses.error(res, {
      type: 'unauthorized',
      status: 401,
      title: 'This resource requires authorization.',
    });
  }
}

export function authorize<R, B>(
  predicate: (
    request: Request<R, unknown, B>,
    auth: AuthenticationStatus,
  ) => boolean,
) {
  return (req: Request<R, unknown, B>, res: Response, next: NextFunction) => {
    if (req.authentication === undefined) {
      Responses.error(res, {
        type: 'unauthorized',
        status: 401,
        title: 'This resource requires authorization.',
      });
    } else if (!predicate(req, req.authentication)) {
      Responses.error(res, {
        type: 'forbidden',
        status: 403,
        title: 'You do not have permission to access this resource.',
      });
    } else next();
  };
}

export const authorizeAdmin = authorize((_, auth) => auth.is_admin);
