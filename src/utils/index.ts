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
