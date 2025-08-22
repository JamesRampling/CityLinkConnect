import type { RequestHandler } from 'express';
import crypto from 'node:crypto';

import type { User } from '#shared/user';

export default (async (req, res) => {
  await new Promise((r) => setTimeout(r, 1000));

  const msg: User = {
    id: crypto.randomUUID(),
    name: ['Alice', 'Bob', 'Carl', 'Dean', 'Evan', 'Fran'][
      Math.floor(Math.random() * 6)
    ],
    date_of_birth: new Date('2000'),
  };

  res.type('application/json');
  res.send(JSON.stringify(msg));
}) satisfies RequestHandler;
