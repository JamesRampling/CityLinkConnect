import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { authenticate, authorizeAdmin } from '#server/routes/accounts';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Booking } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', (_, res) => {
  Responses.ok(res, db.Bookings.getAll());
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const id = req.params.id;

  const value = db.Bookings.getFromId(id).or_throw(queryErrorToResponse);

  if (value === undefined) {
    Responses.notFound(res);
  } else {
    Responses.ok(res, value);
  }
});

route.post(
  '/',
  validate({ body: Booking.omit({ booking_id: true }) }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const value = req.body;
    const { last_row_id: id } =
      db.Bookings.insert(value).or_throw(queryErrorToResponse);

    Responses.ok(res, { ...value, booking_id: id });
  },
);

route.put(
  '/:id',
  validate({ route: { id: 'int' }, body: Booking.omit({ booking_id: true }) }),
  authenticate,
  authorizeAdmin,
  (req, res) => {
    const id = req.params.id;
    const values = req.body;

    const { rows_changed } = db.Bookings.update({
      ...values,
      booking_id: id,
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

    db.Bookings.delete(id).or_throw(queryErrorToResponse);

    Responses.noContent(res);
  },
);

export default route;
