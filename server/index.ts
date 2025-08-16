import express from 'express';

const app = express();

app.get('/api/number', (req, res) => {
  res.type('text/plain');
  res.send(Math.round(Math.random() * 100));
});

// Do not fallback to index.html for API endpoints
app.use('/api', (req, res) => {
  const url = req.originalUrl.split('?', 1)[0];

  res.status(404);
  res.send(`invalid endpoint: ${url}`);
});

export default app;
