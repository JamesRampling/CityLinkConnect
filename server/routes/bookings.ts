import { bookings } from '#server/database';
import { Router } from 'express';

const bookingsRoute = Router();

bookingsRoute.get('/a', (req, res) => {
  res.send(5);
});

bookingsRoute.get('/', (req, res) => {
  const data = bookings.getAll();
  res.send(data);
});

// bookingsRoute.post('/', (req, res) => {
// })

export default bookingsRoute;
