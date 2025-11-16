import { authenticate, authorizeAdmin } from '#server/authentication';
import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Announcement } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', (_, res) => {
  Responses.ok(res, db.Announcements.getAll());
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const id = req.params.id;

  const value = db.Announcements.getFromId(id).or_throw(queryErrorToResponse);

  if (value === undefined) {
    Responses.notFound(res);
  } else {
    Responses.ok(res, value);
  }
});

route.post(
  '/',
  validate({ body: Announcement.omit({ announcement_id: true }) }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const value = req.body;
    const { last_row_id: id } =
      db.Announcements.insert(value).or_throw(queryErrorToResponse);

    Responses.ok(res, { ...value, announcement_id: id });
  },
);

route.put(
  '/:id',
  validate({
    route: { id: 'int' },
    body: Announcement.omit({ announcement_id: true }),
  }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const id = req.params.id;
    const values = req.body;

    const { rows_changed } = db.Announcements.update({
      ...values,
      announcement_id: id,
    }).or_throw(queryErrorToResponse);

    if (rows_changed === 0) {
      Responses.notFound(res);
    } else {
      Responses.noContent(res);
    }
  },
);

route.delete(
  '/:id',
  validate({ route: { id: 'int' } }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const id = req.params.id;

    db.Announcements.delete(id).or_throw(queryErrorToResponse);

    Responses.noContent(res);
  },
);

export default route;
