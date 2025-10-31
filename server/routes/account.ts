import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { User } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.post(
  '/register',
  validate({ body: User.omit({ user_id: true }) }),
  (req, res) => {
    const user = { ...req.body, user_id: 0 };

    const { ok, data, error } = db.Users.insert(user);

    if (ok) {
      Responses.created(res, db.Users.single(data.rowId));
    } else {
      if (error.type === 'sqlite-error' && error.errcode === 2067) {
        Responses.error(res, {
          type: 'already-exists',
          status: 409,
          title: 'The user already exists.',
        });
      } else {
        Responses.serverError(res, 'something went wrong', error);
      }
    }
  },
);

export default route;
