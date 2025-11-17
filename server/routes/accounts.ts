import { authenticate, authorizeAdmin } from '#server/authentication';
import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { JWT_SECRET } from '#server/environment';
import { raise, ResponseError, Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { User } from '#shared/models';
import argon2 from 'argon2';
import { Router } from 'express';
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
      title: 'Incorrect email or password.',
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

    Responses.ok(res, { ...user, token });
  },
);

route.get('/info', authenticate, (req, res) => {
  if (!req.authentication?.sub) {
    throw new ResponseError({
      type: 'unauthorized',
      title: 'This resource requires authorization.',
      status: 401,
    });
  }

  const user = db.Users.getFromId(req.authentication.sub).or_throw(
    queryErrorToResponse,
  );

  Responses.ok(res, user);
});

route.get('/', authenticate, authorizeAdmin, (_, res) => {
  Responses.ok(res, { users: db.Users.getAll() });
});

export default route;
