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

bookingsRoute.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    res.send({ error: 'Invalid booking ID' });
    return;
  }

  const booking = Bookings.getSingle(id);
  if (booking === undefined) {
    res.status(404);
    res.send({ error: 'Booking not found' });
    return;
  }

  res.send(booking);
});

bookingsRoute.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    res.send({ error: 'Invalid booking ID' });
    return;
  }

  const success = Bookings.delete(id);
  if (!success) {
    res.status(404);
    res.send({ error: 'Booking not found' });
    return;
  }

  res.status(204);
  res.send();
});

bookingsRoute.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400);
    res.send({ error: 'Invalid booking ID' });
    return;
  }

  const result = Booking.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    res.send(result.error);
    return;
  }

  if (result.data.booking_id !== 0 && result.data.booking_id !== id) {
    res.status(400);
    res.send({ error: 'Booking ID in URL and body do not match' });
    return;
  }

  result.data.booking_id = id;

  const success = Bookings.update(result.data);
  if (!success) {
    res.status(404);
    res.send({ error: 'Booking not found' });
    return;
  }

  res.send(Bookings.getSingle(id));
});

export default bookingsRoute;
