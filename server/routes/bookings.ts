import { db } from '#server/database';
import { Responses } from '#server/utils/responses';
import { validate } from '#server/utils/validate';
import { Router } from 'express';

const route = Router();

route.get('/', (_req, res) => {
  const bookings = db.Bookings.allJoined();
  Responses.ok(res, bookings);
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;

  const booking = db.Bookings.singleJoined(id);

  if (booking) {
    Responses.ok(res, booking);
  } else {
    Responses.notFound(res);
  }
});

export default route;
