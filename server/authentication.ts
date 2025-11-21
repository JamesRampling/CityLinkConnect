import { JWT_SECRET } from '#server/environment';
import { Responses } from '#server/utils/Responses';
import { AuthenticationStatus } from '#shared/models';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';

export function maybeAuthenticate<R, B>(
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
    } catch {
      Responses.error(res, {
        type: 'unauthorized',
        status: 401,
        title: 'Invalid authentication token.',
      });
    }
  }

  next();
}

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
    auth: z.infer<typeof AuthenticationStatus>,
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
