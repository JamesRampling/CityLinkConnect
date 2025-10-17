import type {
  DatabaseSync,
  SQLInputValue,
  SQLOutputValue,
  StatementSync,
} from 'node:sqlite';
import z from 'zod';

export type ChangeResult<T> =
  | ChangeSuccess
  | ChangeNoAction
  | ValidationError<T>
  | NodeSQLiteError
  | { type: 'error'; error: unknown };

interface ChangeSuccess {
  type: 'success';
  changes: number;
  rowId: number;
}

interface ChangeNoAction {
  type: 'no-action';
}

interface ValidationError<T> {
  type: 'validation-error';
  issues?: { [P in keyof T]?: string[] };
}

interface NodeSQLiteError {
  type: 'sqlite-error';
  errcode: number;
}

export interface DatabaseCollection<TIn, TOut = TIn> {
  getAll(): TOut[];
  getSingle(id: number): TOut | undefined;
  insert(entry: TIn): ChangeResult<TIn>;
  update(entry: TIn): ChangeResult<TIn>;
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

  insert(entry: z.infer<TIn>): ChangeResult<z.infer<TIn>> {
    try {
      const input = this.inZodSchema.safeParse(entry);
      if (!input.success) {
        return {
          type: 'validation-error',
          issues: z.flattenError(input.error).fieldErrors,
        };
      }

      const inputValues = convertObjectToSQLInputParams(
        this.mapObjectToRow?.(input.data) ?? input.data,
      );

      const { changes, lastInsertRowid } =
        this.insertStatement.run(inputValues);

      return changes
        ? {
            type: 'success',
            changes: Number(changes),
            rowId: Number(lastInsertRowid),
          }
        : { type: 'no-action' };
    } catch (e) {
      const errcode = getNodeSQLiteErrorCode(e);
      return errcode !== undefined
        ? { type: 'sqlite-error', errcode }
        : { type: 'error', error: e };
    }
  }

  update(entry: z.infer<TIn>): ChangeResult<z.infer<TIn>> {
    try {
      const input = this.inZodSchema.safeParse(entry);
      if (!input.success) {
        return {
          type: 'validation-error',
          issues: z.flattenError(input.error).fieldErrors,
        };
      }

      const inputValues = convertObjectToSQLInputParams(
        this.mapObjectToRow?.(input.data) ?? input.data,
      );

      const { changes, lastInsertRowid } =
        this.updateStatement.run(inputValues);

      return changes
        ? {
            type: 'success',
            changes: Number(changes),
            rowId: Number(lastInsertRowid),
          }
        : { type: 'no-action' };
    } catch (e) {
      const errcode = getNodeSQLiteErrorCode(e);
      return errcode !== undefined
        ? { type: 'sqlite-error', errcode }
        : { type: 'error', error: e };
    }
  }

  delete(id: number): boolean {
    try {
      const result = this.deleteStatement.run({ id });
      return result.changes > 0;
    } catch (_e) {
      return !!_e && false;
    }
  }
}

export function convertObjectToSQLInputParams(
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

function getNodeSQLiteErrorCode(e: unknown): number | undefined {
  if (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    e.code === 'ERR_SQLITE_ERROR' &&
    'errcode' in e &&
    typeof e.errcode === 'number'
  ) {
    return e.errcode;
  }
}
