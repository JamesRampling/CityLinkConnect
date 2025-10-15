import type { SQLInputValue } from 'node:sqlite';

export interface DatabaseCollection<TIn, TOut = TIn> {
  getAll(): TOut[];
  getSingle(id: number): TOut | undefined;
  update(entry: TIn): boolean;
  insert(entry: TIn): boolean;
  delete(id: number): boolean;
}

export function filterNonSQLInputValues(
  obj: Record<string, unknown>,
): Record<string, SQLInputValue> {
  const entries: [string, SQLInputValue][] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof value === 'number' ||
      typeof value === 'bigint' ||
      typeof value === 'string' ||
      value === null ||
      value instanceof Uint8Array
    ) {
      // Directly supported types
      entries.push([key, value]);
    } else if (value === undefined) {
      // Convert undefined to null
      entries.push([key, null]);
    } else if (value instanceof Date) {
      // Convert Date to ISO string
      entries.push([key, value.toISOString()]);
    }
  }

  return Object.fromEntries(entries);
}
