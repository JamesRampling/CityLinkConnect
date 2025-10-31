import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Announcement } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', (_req, res) => {
  const announcements = db.Announcements.all();
  Responses.ok(res, announcements);
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;

  const announcement = db.Announcements.single(id);

  if (announcement) {
    Responses.ok(res, announcement);
  } else {
    Responses.notFound(res, 'The announcement was not found.');
  }
});

route.post('/', validate({ body: Announcement }), (req, res) => {
  const announcement = { ...req.body, announcement_id: 0 };

  const { ok, data, error } = db.Announcements.insert(announcement);

  if (ok) {
    Responses.created(res, { ...announcement, announcement_id: data.rowId });
  } else {
    Responses.serverError(
      res,
      'An error occurred while updating the announcement.',
      error,
    );
  }
});

route.put(
  '/:id',
  validate({ route: { id: 'int' }, body: Announcement }),
  (req, res) => {
    const { id } = req.params;
    const announcement = { ...req.body, announcement_id: id };

    const { ok, error } = db.Announcements.update(announcement);

    if (ok) {
      Responses.ok(res, announcement);
    } else if (error.type === 'non-existent-id') {
      Responses.notFound(res);
    } else {
      Responses.serverError(
        res,
        'An error occurred while updating the announcement.',
        error,
      );
    }
  },
);

route.delete('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;
  const { ok, error } = db.Announcements.delete(id);

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
