export type Result<T, E> = (ResultOk<T> | ResultErr<E>) & {
  map<O>(fn: (inner: T) => O): Result<O, E>;
  and_then<O>(fn: (inner: T) => Result<O, E>): Result<O, E>;
  or_else<O>(fn: (error: E) => Result<T, O>): Result<T, O>;
  or_throw(fn: (error: E) => Error): T;
};

interface ResultOk<T> {
  readonly ok: true;
  readonly data: T;
  readonly error: undefined;

  unwrap(): T;
  expect(message: string): T;
}

interface ResultErr<E> {
  readonly ok: false;
  readonly data: undefined;
  readonly error: E;

  unwrap(): never;
  expect(message: string): never;
}

class UnwrappedError extends Error {
  readonly inner: unknown;

  constructor(inner: unknown, message?: string) {
    super(message ?? 'Called unwrap on an error');
    this.inner = inner;
  }
}

export const Result = {
  ok<T, E>(data: T): Result<T, E> {
    return {
      ok: true,
      data,
      error: undefined,

      map(fn) {
        return Result.ok(fn(this.data));
      },

      and_then(fn) {
        return fn(this.data);
      },

      or_else<O>() {
        return this as ResultOk<T> as Result<T, O>;
      },

      or_throw() {
        return this.data;
      },

      unwrap() {
        return this.data;
      },
      expect() {
        return this.data;
      },
    } as const;
  },

  err<T, E>(error: E): Result<T, E> {
    return {
      ok: false,
      data: undefined,
      error,

      map<O>() {
        return this as ResultErr<E> as Result<O, E>;
      },

      and_then<O>() {
        return this as ResultErr<E> as Result<O, E>;
      },

      or_else(fn) {
        return fn(this.error);
      },

      or_throw(fn) {
        throw fn(this.error);
      },

      unwrap() {
        throw new UnwrappedError(this.error);
      },
      expect(message) {
        throw new UnwrappedError(this.error, message);
      },
    } as const;
  },
};
