import '#server/database';
import announcementsRoute from '#server/routes/announcements';
import bookingsRoute from '#server/routes/bookings';
import feedbackRoute from '#server/routes/feedback';
import servicesRoute from '#server/routes/services';
import { Responses } from '#server/utils/Responses';
import express, { Router } from 'express';

const app = express();

app.use(express.json());

app.use(
  '/api',
  Router()
    .use('/announcements', announcementsRoute)
    .use('/bookings', bookingsRoute)
    .use('/feedback', feedbackRoute)
    .use('/services', servicesRoute),

  // Do not fallback to index.html for API endpoints
  (req, res) => {
    const url = req.originalUrl.split('?', 1)[0];
    Responses.notFound(res, `Invalid endpoint: ${url}`);
  },
);

export default app;
