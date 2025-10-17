import type { ApiError } from '#shared/errors';
import { type Response } from 'express';
import type z from 'zod';

export const Responses = {
  ok(res: Response, data: unknown) {
    res.status(200).json(data);
  },

  created(res: Response, data: unknown) {
    res.status(201).json(data);
  },

  noContent(res: Response) {
    res.status(204);
  },

  notFound(res: Response, message = 'The requested item was not found.') {
    this.error(res, { type: 'not-found', status: 404, title: message });
  },

  error(res: Response, details: z.infer<typeof ApiError>) {
    res.status(details.status).json(details);
  },
};
