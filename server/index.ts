import '#server/database';
import accountsRoute from '#server/routes/accounts';
import announcementsRoute from '#server/routes/announcements';
import bookingsRoute from '#server/routes/bookings';
import feedbackRoute from '#server/routes/feedback';
import servicesRoute from '#server/routes/services';
import { Responses } from '#server/utils/Responses';
import express, {
  Router,
  type ErrorRequestHandler,
  type RequestHandler,
} from 'express';

process.loadEnvFile();

const app = express();

app.use(express.json());

app.use(
  '/api',
  Router()
    .use('/account', accountsRoute)
    .use('/announcements', announcementsRoute)
    .use('/bookings', bookingsRoute)
    .use('/feedback', feedbackRoute)
    .use('/services', servicesRoute),

  // Do not fallback to index.html for API endpoints
  ((req, res) => {
    const url = req.originalUrl.split('?', 1)[0];
    Responses.notFound(res, `Invalid endpoint: ${url}`);
  }) satisfies RequestHandler,

  // Error request handler for API routes, returns error formatted as JSON.
  // Error handlers require all 4 arguments to be recognised correctly.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ((err, _req, res, _next) => {
    console.error(err);
    Responses.serverError(res, 'An unknown error occurred.', err);
  }) satisfies ErrorRequestHandler,
);

export default app;
