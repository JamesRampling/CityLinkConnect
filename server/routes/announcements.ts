import { db } from '#server/database';
import { Responses } from '#server/utils/responses';
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
  const result = db.Announcements.insert(announcement);

  if (result.type === 'success') {
    Responses.created(res, { ...announcement, announcement_id: result.rowId });
  } else {
    Responses.serverError(
      res,
      'An error occurred while updating the item.',
      result,
    );
  }
});

route.put(
  '/:id',
  validate({ route: { id: 'int' }, body: Announcement }),
  (req, res) => {
    const { id } = req.params;
    const announcement = { ...req.body, announcement_id: id };
    const result = db.Announcements.update(announcement);

    if (result.type === 'success') {
      Responses.noContent(res);
    } else if (result.type === 'no-action') {
      Responses.notFound(res);
    } else {
      Responses.serverError(
        res,
        'An error occurred while updating the item.',
        result,
      );
    }
  },
);

route.delete('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;
  db.Announcements.delete(id);
  Responses.noContent(res);
});

export default route;
