import type { RequestHandler } from 'express';

import { type Message } from '#shared/message';

export default (async (req, res) => {
  await new Promise((r) => setTimeout(r, 1000));

  const num = Math.round(Math.random() * 100);
  const msg = { num, message: 'Hi!' } satisfies Message;

  res.type('application/json');
  res.send(JSON.stringify(msg));
}) satisfies RequestHandler;
