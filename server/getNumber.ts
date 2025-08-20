import type { RequestHandler } from 'express';

export default (async (req, res) => {
  await new Promise((r) => setTimeout(r, 1000));
  res.type('text/plain');
  res.send(Math.round(Math.random() * 100));
}) satisfies RequestHandler;
