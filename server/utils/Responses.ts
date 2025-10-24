import type { ApiError, NotFoundError, ServerError } from '#shared/errors';
import { type Response } from 'express';
import type z from 'zod';

export const Responses = {
  ok<T>(res: Response<T>, data: T) {
    res.status(200).json(data).end();
  },

  created<T>(res: Response<T>, data?: T) {
    if (data === undefined) {
      res.status(201).end();
    } else {
      res.status(201).json(data).end();
    }
  },

  noContent(res: Response) {
    res.status(204).end();
  },

  error<T extends z.infer<typeof ApiError>>(res: Response<T>, details: T) {
    res.status(details.status).json(details).end();
  },

  notFound(
    res: Response<z.infer<typeof NotFoundError>>,
    title = 'The requested item was not found.',
  ) {
    this.error(res, { type: 'not-found', status: 404, title });
  },

  serverError(
    res: Response<z.infer<typeof ServerError>>,
    title = 'An internal server error occurred.',
    err?: unknown,
  ) {
    // Fix JSON serialization not writing non-enumerable properties such as
    // Error properties.
    const details =
      err instanceof Object
        ? JSON.stringify(err, Object.getOwnPropertyNames(err))
        : JSON.stringify(err);

    this.error(res, {
      type: 'server-error',
      status: 500,
      title,
      details: JSON.parse(details),
    });
  },
};
