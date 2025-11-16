import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { authenticate, authorizeAdmin } from '#server/routes/accounts';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Feedback } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', authenticate, authorizeAdmin, (_, res) => {
  Responses.ok(res, db.Feedback.getAll());
});

route.get(
  '/:id',
  validate({ route: { id: 'int' } }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const id = req.params.id;

    const value = db.Feedback.getFromId(id).or_throw(queryErrorToResponse);

    if (value === undefined) {
      Responses.notFound(res);
    } else {
      Responses.ok(res, value);
    }
  },
);

route.post(
  '/',
  validate({ body: Feedback.omit({ feedback_id: true }) }),
  (req, res) => {
    const value = req.body;
    const { last_row_id: id } =
      db.Feedback.insert(value).or_throw(queryErrorToResponse);

    Responses.ok(res, { ...value, feedback_id: id });
  },
);

route.delete(
  '/:id',
  validate({ route: { id: 'int' } }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const { id } = req.params;

    db.Feedback.delete(id).or_throw(queryErrorToResponse);

    Responses.noContent(res);
  },
);

export default route;
