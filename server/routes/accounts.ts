import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { JWT_SECRET } from '#server/secrets';
import { raise, ResponseError, Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { User } from '#shared/models';
import argon2 from 'argon2';
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';

const route = Router();

route.post(
  '/register',
  validate({
    body: User.omit({ user_id: true }).extend({ password: z.string().min(8) }),
  }),
  async (req, res) => {
    const { password, ...user } = req.body;

    const argon2_hash = await argon2.hash(password);

    db.execTransaction(() => {
      const { last_row_id: user_id } =
        db.Users.insert(user).or_throw(queryErrorToResponse);

      db.Authentication.insert({ user_id, argon2_hash }).or_throw(
        queryErrorToResponse,
      );
    });

    Responses.noContent(res);
  },
);

route.post(
  '/login',
  validate({ body: z.object({ email: z.email(), password: z.string() }) }),
  async (req, res) => {
    const err = new ResponseError({
      type: 'unauthorized',
      status: 401,
      title: 'Failed to log in.',
    });

    const { email, password } = req.body;

    const user =
      db.Users.getFromEmail(email).or_throw(queryErrorToResponse) ?? raise(err);
    const auth =
      db.Authentication.get(user.user_id).or_throw(queryErrorToResponse) ??
      raise(err);

    if (!(await argon2.verify(auth.argon2_hash, password))) throw err;

    const token = jwt.sign({ is_admin: auth.is_admin }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1d',
      subject: user.user_id.toString(),
    });

    Responses.ok(res, token);
  },
);

route.post('/info', authenticate, (_, res) => {
  Responses.noContent(res);
});

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

export default route;
