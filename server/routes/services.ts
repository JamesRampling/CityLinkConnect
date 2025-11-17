import { authenticate, authorizeAdmin } from '#server/authentication';
import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Service } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', (_, res) => {
  Responses.ok(res, db.Services.getAll());
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const id = req.params.id;

  const value = db.Services.getFromId(id).or_throw(queryErrorToResponse);

  if (value === undefined) {
    Responses.notFound(res);
  } else {
    Responses.ok(res, value);
  }
});

route.post(
  '/',
  validate({ route: { id: 'int' }, body: Service.omit({ service_id: true }) }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const value = req.body;
    const { last_row_id: id } =
      db.Services.insert(value).or_throw(queryErrorToResponse);

    Responses.ok(res, { ...value, service_id: id });
  },
);

route.put(
  '/:id',
  validate({ route: { id: 'int' }, body: Service.omit({ service_id: true }) }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const id = req.params.id;
    const value = req.body;

    const { rows_changed } = db.Services.update({
      ...value,
      service_id: id,
    }).or_throw(queryErrorToResponse);

    if (rows_changed) {
      Responses.noContent(res);
    } else {
      Responses.notFound(res, 'The announcement was not found.');
    }
  },
);

route.delete(
  '/:id',
  validate({ route: { id: 'int' } }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const { id } = req.params;

    db.Services.delete(id).or_throw(queryErrorToResponse);

    Responses.noContent(res);
  },
);

export default route;
