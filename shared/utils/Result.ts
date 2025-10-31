export type Result<R, E> = ResultOk<R> | ResultError<E>;

interface ResultOk<T> {
  ok: true;
  data: T;
  error: undefined;
}

interface ResultError<T> {
  ok: false;
  data: undefined;
  error: T;
}

export const Result = {
  ok<R, E = unknown>(data: R): Result<R, E> {
    return { ok: true, data, error: undefined };
  },

  error<E, R = unknown>(detail: E): Result<R, E> {
    return { ok: false, data: undefined, error: detail };
  },
};
