import { db } from '#server/database';
import { numberOrUndefined } from '#server/utils/numberOrUndefined';
import { Announcement } from '#shared/models';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const announcements = db.Announcements.getAll();
  res.send(announcements);
});

router.get('/:id', (req, res) => {
  const id = numberOrUndefined(req.params.id);
  if (!id) {
    res.statusCode = 400;
    res.send({ message: 'Id parameter is invalid.' });
    return;
  }

  const announcement = db.Announcements.getSingle(id);

  if (announcement) {
    res.send(announcement);
  } else {
    res.statusCode = 404;
    res.send({ message: 'The announcement was not found.' });
  }
});

router.post('/', (req, res) => {
  const result = Announcement.safeParse(req.body);

  if (result.success) {
    result.data.announcement_id = 0;
    const id = db.Announcements.insert(result.data);

    if (id) {
      res.statusCode = 201;
      res.send(db.Announcements.getSingle(id));
      return;
    }

    res.statusCode = 500;
    res.send({ message: 'An error occurred while creating the announcement.' });
  } else {
    res.statusCode = 400;
    res.send({
      message: 'Announcement is not valid.',
      details: result.error.issues,
    });
  }
});

router.put('/:id', (req, res) => {
  const id = numberOrUndefined(req.params.id);
});

router.delete('/:id', (req, res) => {
  const id = numberOrUndefined(req.params.id);
});

export default router;
