export type Result<T, E> = ResultOk<T> | ResultError<E>;

interface ResultOk<T> {
  readonly ok: true;
  readonly data: T;
  readonly error: undefined;

  unwrap(): T;
  expect(message: string): T;
}

interface ResultError<E> {
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
  ok<T, E = unknown>(data: T): Result<T, E> {
    return {
      ok: true,
      data,
      error: undefined,

      unwrap() {
        return this.data;
      },
      expect() {
        return this.data;
      },
    } as const;
  },

  error<E, T = unknown>(error: E): Result<T, E> {
    return {
      ok: false,
      data: undefined,
      error,

      unwrap() {
        throw new UnwrappedError(this.error);
      },
      expect(message) {
        throw new UnwrappedError(this.error, message);
      },
    };
  },
};
