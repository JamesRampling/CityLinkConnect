import '#server/types';

import { authenticate, authorizeAdmin } from '#server/authentication';
import { db } from '#server/database';
import { queryErrorToResponse } from '#server/database/DatabaseCollection';
import { ResponseError, Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Booking } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', authenticate, (req, res) => {
  const auth = req.authentication;
  if (!auth) {
    throw new ResponseError({
      type: 'unauthorized',
      status: 401,
      title: 'This resource requires authorization.',
    });
  }

  Responses.ok(res, db.Bookings.getAllByUserId(auth.sub));
});

route.get('/all', authenticate, authorizeAdmin, (req, res) => {
  Responses.ok(res, db.Bookings.getAll());
});

route.get(
  '/:id',
  validate({ route: { id: 'int' } }),
  authenticate,
  (req, res) => {
    const id = req.params.id;

    const value = db.Bookings.getFromId(id).or_throw(queryErrorToResponse);

    if (
      value &&
      (req.authentication?.is_admin ||
        req.authentication?.sub === value.user_id)
    ) {
      Responses.ok(res, value);
    } else {
      Responses.notFound(res);
    }
  },
);

route.post(
  '/',
  validate({ body: Booking.omit({ booking_id: true, user_id: true }) }),
  authenticate,
  (req, res) => {
    if (!req.authentication?.sub) {
      throw new ResponseError({
        type: 'unauthorized',
        title: 'This resource requires authorization.',
        status: 401,
      });
    }

    const value = { ...req.body, user_id: req.authentication.sub };
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
    if (!req.authentication) {
      throw new ResponseError({
        type: 'unauthorized',
        status: 401,
        title: 'This resource requires authorization.',
      });
    }

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
