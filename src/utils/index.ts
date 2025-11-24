import z from 'zod';

export function generateRandomId(): string {
  return Math.trunc(Math.random() * 0xffffffff).toString(16);
}

export function formatDate(
  isoDate?: string,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, options);
}

export function formatDateTime(
  isoDate?: string,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleString(undefined, options);
}

export function dateToMs(isoDate: string) {
  if (!isoDate) return 0;
  const date = new Date(isoDate);
  return date.valueOf();
}

export function groupBy<T, Key extends string | symbol>(
  items: Iterable<T>,
  callbackFn: (element: T, index: number) => Key,
): Partial<Record<Key, T[]>> {
  const map = {} as Record<Key, T[]>;

  let index = 0;
  for (const element of items) {
    const key = callbackFn(element, index);

    if (key in map) {
      map[key].push(element);
    } else {
      map[key] = [element];
    }

    index++;
  }

  return map;
}

export function removeIf<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): T[];
export function removeIf<T, S extends T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => value is S,
): Exclude<T, S>[];
export function removeIf<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): T[] {
  let filteredIndex = 0;

  for (let i = 0; i < array.length; i++) {
    if (!(i in array)) continue;
    const val = array[i];
    if (!predicate(val, i, array)) array[filteredIndex++] = val;
  }

  array.length = filteredIndex;
  return array;
}

export function fallibleArray<I extends z.ZodType>(
  schema: I,
): (arr: unknown[]) => z.output<I>[] {
  return (arr) => {
    const items = [];
    for (const item of arr) {
      const result = schema.safeParse(item);
      if (result.success) {
        items.push(result.data);
      }
    }
    return items;
  };
}

export function isZodError(thing: unknown): thing is z.ZodError {
  return thing instanceof z.ZodError;
}

export function parseOrError<I extends z.ZodType>(
  schema: I,
): z.ZodTransform<z.output<I> | z.ZodError<z.output<I>>> {
  return z.transform((data) => {
    const parsed = schema.safeParse(data);
    return parsed.success ? parsed.data : parsed.error;
  });
}
