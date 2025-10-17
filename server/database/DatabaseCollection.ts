import type {
  DatabaseSync,
  SQLInputValue,
  SQLOutputValue,
  StatementSync,
} from 'node:sqlite';
import z from 'zod';

export interface DatabaseCollection<TIn, TOut = TIn> {
  getAll(): TOut[];
  getSingle(id: number): TOut | undefined;
  insert(entry: TIn): number | undefined;
  update(entry: TIn): boolean;
  delete(id: number): boolean;
}

export interface SQLiteDatabaseCollectionConfig<
  TIn extends z.ZodObject,
  TOut extends z.ZodObject = TIn,
> {
  inZodSchema: TIn;
  outZodSchema: TOut;
  getAllSQL: string;
  getSingleSQL: string;
  insertSQL: string;
  updateSQL: string;
  deleteSQL: string;
  mapObjectToRow?: (obj: z.infer<TIn>) => Record<string, SQLInputValue>;
  mapRowsToObjects?: (
    queryOutput: Record<string, SQLOutputValue>[],
  ) => unknown[];
}

export class SQLiteDatabaseCollection<
  TIn extends z.ZodObject,
  TOut extends z.ZodObject = TIn,
> implements DatabaseCollection<z.infer<TIn>, z.infer<TOut>>
{
  constructor(
    database: DatabaseSync,
    config: SQLiteDatabaseCollectionConfig<TIn, TOut>,
  ) {
    this.inZodSchema = config.inZodSchema;
    this.outZodSchema = config.outZodSchema;

    this.getAllStatement = database.prepare(config.getAllSQL);
    this.getSingleStatement = database.prepare(config.getSingleSQL);
    this.insertStatement = database.prepare(config.insertSQL);
    this.updateStatement = database.prepare(config.updateSQL);
    this.deleteStatement = database.prepare(config.deleteSQL);

    this.mapObjectToRow = config.mapObjectToRow;
    this.mapRowsToObjects = config.mapRowsToObjects;

    this.insertStatement.setAllowBareNamedParameters(true);
    this.insertStatement.setAllowUnknownNamedParameters(true);
    this.updateStatement.setAllowBareNamedParameters(true);
    this.updateStatement.setAllowUnknownNamedParameters(true);
    this.deleteStatement.setAllowBareNamedParameters(true);
    this.deleteStatement.setAllowUnknownNamedParameters(true);
  }

  private mapRowsToObjects?: (
    queryOutput: Record<string, SQLOutputValue>[],
  ) => unknown[];

  private mapObjectToRow?: (obj: z.infer<TIn>) => Record<string, SQLInputValue>;

  private inZodSchema: TIn;
  private outZodSchema: TOut;

  private getAllStatement: StatementSync;
  private getSingleStatement: StatementSync;
  private insertStatement: StatementSync;
  private updateStatement: StatementSync;
  private deleteStatement: StatementSync;

  getAll(): z.infer<TOut>[] {
    const rows = this.getAllStatement.all();
    const data = this.mapRowsToObjects?.(rows) ?? rows;
    return z.array(this.outZodSchema).parse(data);
  }

  getSingle(id: number): z.infer<TOut> | undefined {
    const rows = this.getSingleStatement.all({ id });
    const data = this.mapRowsToObjects?.(rows) ?? rows;
    if (!data.length) return undefined;
    return this.outZodSchema.parse(data[0]);
  }

  insert(entry: z.infer<TIn>): number | undefined {
    const input = this.inZodSchema.safeParse(entry);
    if (!input.success) return;

    let inputValues = this.mapObjectToRow?.(input.data) ?? input.data;
    inputValues = filterNonSQLInputValues(inputValues);

    const result = this.insertStatement.run(inputValues);
    if (result.changes === 0) return;

    return Number(result.lastInsertRowid);
  }

  update(entry: z.infer<TIn>): boolean {
    const input = this.inZodSchema.safeParse(entry);
    if (!input.success) return false;

    let inputValues = this.mapObjectToRow?.(input.data) ?? input.data;
    inputValues = filterNonSQLInputValues(inputValues);

    const result = this.updateStatement.run(inputValues);

    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = this.deleteStatement.run({ id });
    return result.changes > 0;
  }
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
