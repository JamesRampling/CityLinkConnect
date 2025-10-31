import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Booking } from '#shared/models';
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

route.post(
  '/',
  validate({ body: Booking.omit({ booking_id: true }) }),
  (req, res) => {
    const errorTitle = 'An error occurred while creating the booking.';
    const booking = { ...req.body, booking_id: 0 };

    const { ok, data, error } = db.Bookings.insert(booking);
    if (!ok) {
      Responses.serverError(res, errorTitle, error);
      return;
    }

    const newBooking = db.Bookings.singleJoined(data.rowId);
    if (newBooking) {
      Responses.created(res, newBooking);
    } else {
      Responses.serverError(res, errorTitle);
    }
  },
);

route.put(
  '/:id',
  validate({ route: { id: 'int' }, body: Booking.omit({ booking_id: true }) }),
  (req, res) => {
    const errorTitle = 'An error occurred while updating the booking.';
    const { id } = req.params;
    const booking = { ...req.body, booking_id: id };

    const { ok, error } = db.Bookings.update(booking);

    if (!ok) {
      if (error.type === 'non-existent-id') {
        Responses.notFound(res, 'The booking was not found.');
      } else {
        Responses.serverError(res, errorTitle, error);
      }
      return;
    }

    const updatedBooking = db.Bookings.singleJoined(id);
    if (updatedBooking) {
      Responses.ok(res, updatedBooking);
    } else {
      Responses.serverError(res, errorTitle);
    }
  },
);

route.delete('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;
  const { ok, error } = db.Bookings.delete(id);

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
