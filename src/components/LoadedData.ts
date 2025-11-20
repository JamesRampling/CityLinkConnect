import type { Result } from '#shared/utils/Result';

export interface LoadedData<T, E> {
  update(data: Result<T, E> | Promise<Result<T, E>>): Promise<void>;
  execute(): Promise<void>;
}

export type LoadedDataFromAction<
  Action extends () => Promise<Result<unknown, unknown>>,
> = Action extends () => Promise<Result<infer T, infer E>>
  ? LoadedData<T, E>
  : never;
