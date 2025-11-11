import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { User } from '#shared/models';
import argon2 from 'argon2';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'node:process';
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
      const { last_row_id: user_id } = db.Users.insert(user).expect(
        'Failed to create user.',
      );

      db.Authentication.insert({ user_id, argon2_hash }).expect(
        'Failed to create user.',
      );
    });

    Responses.noContent(res);
  },
);

route.post(
  '/login',
  validate({ body: z.object({ email: z.email(), password: z.string() }) }),
  async (req, res) => {
    const err_msg = 'Failed to log in.';
    const error = () => {
      throw new Error(err_msg);
    };

    const { email, password } = req.body;

    const user = db.Users.getFromEmail(email).unwrap() ?? error();
    const auth = db.Authentication.get(user.user_id).unwrap() ?? error();

    if (!(await argon2.verify(auth.argon2_hash, password))) {
      Responses.error(res, {
        type: 'unauthorized',
        status: 401,
        title: err_msg,
      });
      return;
    }

    const token = jwt.sign(
      { is_admin: auth.is_admin },
      Buffer.from(env.JWT_SECRET ?? error(), 'base64'),
      { algorithm: 'HS256', expiresIn: '1d', subject: user.user_id.toString() },
    );

    Responses.ok(res, token);
  },
);

export default route;
