import { Users } from '#server/database';
import bookingsRoute from '#server/routes/bookings';
import express from 'express';

const app = express();

app.use(express.json());

app.use('/api/bookings', bookingsRoute);

// Temporary endpoint to test user/service/booking joins.
app.get('/api/users', (req, res) => {
  res.send(Users.getAll());
});

// Do not fallback to index.html for API endpoints
app.use('/api', (req, res) => {
  const url = req.originalUrl.split('?', 1)[0];

  res.status(404);
  res.send(`invalid endpoint: ${url}`);
});

export default app;
