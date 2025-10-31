import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Service } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', (_req, res) => {
  const services = db.Services.all();
  Responses.ok(res, services);
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;
  const service = db.Services.single(id);
  if (service) {
    Responses.ok(res, service);
  } else {
    Responses.notFound(res);
  }
});

route.post(
  '/',
  validate({ body: Service.omit({ service_id: true }) }),
  (req, res) => {
    const service = { ...req.body, service_id: 0 };
    const { ok, data, error } = db.Services.insert(service);
    if (ok) {
      Responses.created(res, { ...service, service_id: data.rowId });
    } else {
      Responses.serverError(
        res,
        'An error occurred while creating the service.',
        error,
      );
    }
  },
);

route.put(
  '/:id',
  validate({ route: { id: 'int' }, body: Service.omit({ service_id: true }) }),
  (req, res) => {
    const { id } = req.params;
    const service = { ...req.body, service_id: id };

    const { ok, error } = db.Services.update(service);
    if (ok) {
      Responses.ok(res, service);
    } else if (error.type === 'non-existent-id') {
      Responses.notFound(res);
    } else {
      Responses.serverError(
        res,
        'An error occurred while updating the service.',
        error,
      );
    }
  },
);

route.delete('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;
  const { ok, error } = db.Services.delete(id);

  if (ok || error.type === 'non-existent-id') {
    Responses.noContent(res);
  } else {
    Responses.serverError(
      res,
      'An error occurred while deleting the service.',
      error,
    );
  }
});

export default route;
