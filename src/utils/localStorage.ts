import { Result } from '#shared/utils/Result';
import z from 'zod';

export function setItem(key: string, item: unknown) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function getItem<T extends z.ZodType>(
  key: string,
  schema: T,
): Result<z.infer<T>, z.ZodError<z.infer<T>> | 'not-found' | SyntaxError> {
  try {
    const itemString = localStorage.getItem(key);
    if (itemString === null) return Result.err('not-found');

    const json = JSON.parse(itemString);
    return Result.ok(schema.parse(json));
  } catch (e) {
    if (e instanceof z.ZodError || e instanceof SyntaxError) {
      return Result.err(e);
    }
    throw e;
  }
}
