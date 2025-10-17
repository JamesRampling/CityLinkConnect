import { db } from '#server/database';
import { Responses } from '#server/utils/responses';
import { validate } from '#server/utils/validate';
import { Announcement } from '#shared/models';
import { Router } from 'express';
import z from 'zod';

const route = Router();

route.get('/', (_req, res) => {
  const announcements = db.Announcements.getAll();
  Responses.ok(res, announcements);
});

route.get(
  '/:id',
  validate({ route: { id: z.coerce.number() } }),
  (req, res) => {
    const { id } = req.params;

    const announcement = db.Announcements.getSingle(id);

    if (announcement) {
      Responses.ok(res, announcement);
    } else {
      Responses.notFound(res, 'The announcement was not found.');
    }
  },
);

route.post('/', validate({ body: Announcement }), (req, res) => {
  const announcement = { ...req.body, announcement_id: 0 };
  const id = db.Announcements.insert(announcement);

  if (id) {
    Responses.created(res, { ...announcement, announcement_id: id });
  } else {
    Responses.error(res, {
      type: 'server-error',
      status: 500,
      title: 'An error occurred while creating the announcement.',
    });
  }
});

route.put(
  '/:id',
  validate({ route: { id: z.coerce.number() }, body: Announcement }),
  (req, res) => {
    const { id } = req.params;
    const announcement = { ...req.body, announcement_id: id };

    if (db.Announcements.update(announcement)) {
      Responses.noContent(res);
      return;
    } else {
      Responses.notFound(res);
      return;
    }
  },
);

route.delete(
  '/:id',
  validate({ route: { id: z.coerce.number() } }),
  (req, res) => {
    const { id } = req.params;
    db.Announcements.delete(id);
    Responses.noContent(res);
  },
);

export default route;
