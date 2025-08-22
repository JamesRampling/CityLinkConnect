import express from 'express';

import getUser from '#server/getUser';

const app = express();

app.get('/api/user', getUser);

// Do not fallback to index.html for API endpoints
app.use('/api', (req, res) => {
  const url = req.originalUrl.split('?', 1)[0];

  res.status(404);
  res.send(`invalid endpoint: ${url}`);
});

export default app;
