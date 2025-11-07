import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { User } from '#shared/models';
import argon2 from 'argon2';
import { Router } from 'express';
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
      const { rowId: user_id } = db.Users.insert(user).expect(
        'Failed to create user.',
      );

      db.Authentication.insert({ user_id, argon2_hash }).expect(
        'Failed to create user.',
      );
    });

    Responses.noContent(res);
  },
);

export default route;
