import '#server/database';
import announcementsRoute from '#server/routes/announcements';
import bookingsRoute from '#server/routes/bookings';
import express from 'express';

const app = express();

app.use(express.json());

app.use('/api/announcements', announcementsRoute);

app.use('/api/bookings', bookingsRoute);

// Do not fallback to index.html for API endpoints
app.use('/api', (req, res) => {
  const url = req.originalUrl.split('?', 1)[0];

  res.status(404);
  res.send(`invalid endpoint: ${url}`);
});

export default app;
