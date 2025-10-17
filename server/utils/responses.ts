import type { ApiError } from '#shared/errors';
import { type Response } from 'express';
import type z from 'zod';

export const Responses = {
  ok(res: Response, data?: unknown) {
    if (data === undefined) {
      this.noContent(res);
    } else {
      res.status(200).json(data).end();
    }
  },

  created(res: Response, data?: unknown) {
    if (data === undefined) {
      res.status(201).end();
    } else {
      res.status(201).json(data).end();
    }
  },

  noContent(res: Response) {
    res.status(204).end();
  },

  error(res: Response, details: z.infer<typeof ApiError>) {
    res.status(details.status).json(details).end();
  },

  notFound(res: Response, message = 'The requested item was not found.') {
    this.error(res, { type: 'not-found', status: 404, title: message });
  },
};
