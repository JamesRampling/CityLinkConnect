import { Bookings } from '#server/database';
import { Booking } from '#shared/models';
import { Router } from 'express';

const bookingsRoute = Router();

bookingsRoute.get('/', (req, res) => {
  const data = Bookings.getAll();
  res.send(data);
});

bookingsRoute.post('/', (req, res) => {
  const result = Booking.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    res.send(result.error);
    return;
  }

  const bookingId = Bookings.insert(result.data);
  if (bookingId === undefined) {
    res.status(500);
    res.send({ error: 'Failed to insert booking' });
    return;
  }

  res.status(201);
  res.send(Bookings.getSingle(bookingId));
});

export default bookingsRoute;
