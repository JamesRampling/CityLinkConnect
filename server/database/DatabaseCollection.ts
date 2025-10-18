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

export interface DatabaseCollection<In, Out = In> {
  all(): Out[];
  single(id: number): Out | undefined;
  insert(entry: In): ChangeResult<In>;
  update(entry: In): ChangeResult<In>;
  delete(id: number): boolean;
}

export interface JoinedDatabaseCollection<Table, JoinedTable>
  extends DatabaseCollection<Table> {
  allJoined(): JoinedTable[];
  singleJoined(id: number): JoinedTable | undefined;
}

export interface SQLiteDatabaseCollectionConfig<
  TableSchema extends z.ZodObject,
> {
  zodSchema: TableSchema;
  allSQL: string;
  singleSQL: string;
  insertSQL: string;
  updateSQL: string;
  deleteSQL: string;
  mapObjectToRow?: (obj: z.infer<TableSchema>) => Record<string, SQLInputValue>;
  mapRowsToObjects?: (query: Record<string, SQLOutputValue>[]) => unknown[];
}

export interface SQLiteJoinedDatabaseCollectionConfig<
  TableSchema extends z.ZodObject,
  JoinedTableSchema extends z.ZodObject,
> extends SQLiteDatabaseCollectionConfig<TableSchema> {
  joinedZodSchema: JoinedTableSchema;
  allJoinedSQL: string;
  singleJoinedSQL: string;
  mapRowsToJoinedObjects?: (
    query: Record<string, SQLOutputValue>[],
  ) => unknown[];
}

export class SQLiteDatabaseCollection<TableSchema extends z.ZodObject>
  implements DatabaseCollection<z.infer<TableSchema>>
{
  constructor(
    database: DatabaseSync,
    config: SQLiteDatabaseCollectionConfig<TableSchema>,
  ) {
    this.zodSchema = config.zodSchema;

    this.allStatement = database.prepare(config.allSQL);
    this.singleStatement = database.prepare(config.singleSQL);
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

  protected mapRowsToObjects?: (
    query: Record<string, SQLOutputValue>[],
  ) => unknown[];

  protected mapObjectToRow?: (
    obj: z.infer<TableSchema>,
  ) => Record<string, SQLInputValue>;

  protected zodSchema: TableSchema;

  private allStatement: StatementSync;
  private singleStatement: StatementSync;
  private insertStatement: StatementSync;
  private updateStatement: StatementSync;
  private deleteStatement: StatementSync;

  all(): z.infer<TableSchema>[] {
    const rows = this.allStatement.all();
    const data = this.mapRowsToObjects?.(rows) ?? rows;
    return z.array(this.zodSchema).parse(data);
  }

  single(id: number): z.infer<TableSchema> | undefined {
    const rows = this.singleStatement.all({ id });
    const data = this.mapRowsToObjects?.(rows) ?? rows;
    if (!data.length) return undefined;
    return this.zodSchema.parse(data[0]);
  }

  insert(entry: z.infer<TableSchema>): ChangeResult<z.infer<TableSchema>> {
    try {
      const input = this.zodSchema.safeParse(entry);
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

  update(entry: z.infer<TableSchema>): ChangeResult<z.infer<TableSchema>> {
    try {
      const input = this.zodSchema.safeParse(entry);
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

export class SQLiteJoinedDatabaseCollection<
    TableSchema extends z.ZodObject,
    JoinedTableSchema extends z.ZodObject,
  >
  extends SQLiteDatabaseCollection<TableSchema>
  implements
    JoinedDatabaseCollection<z.infer<TableSchema>, z.infer<JoinedTableSchema>>
{
  constructor(
    database: DatabaseSync,
    config: SQLiteJoinedDatabaseCollectionConfig<
      TableSchema,
      JoinedTableSchema
    >,
  ) {
    super(database, config);
    this.joinedZodSchema = config.joinedZodSchema;
    this.allJoinedStatement = database.prepare(config.allJoinedSQL);
    this.singleJoinedStatement = database.prepare(config.singleJoinedSQL);
    this.mapRowsToJoinedObjects = config.mapRowsToJoinedObjects;
  }

  private joinedZodSchema: JoinedTableSchema;

  private allJoinedStatement: StatementSync;
  private singleJoinedStatement: StatementSync;

  private mapRowsToJoinedObjects?: (
    query: Record<string, SQLOutputValue>[],
  ) => unknown[];

  allJoined(): z.infer<JoinedTableSchema>[] {
    const rows = this.allJoinedStatement.all();
    const data = this.mapRowsToJoinedObjects?.(rows) ?? rows;
    console.log(data);
    return z.array(this.joinedZodSchema).parse(data);
  }

  singleJoined(id: number): z.infer<JoinedTableSchema> | undefined {
    const rows = this.singleJoinedStatement.all({ id });
    const data = this.mapRowsToJoinedObjects?.(rows) ?? rows;
    if (!data.length) return;
    return this.joinedZodSchema.parse(data[0]);
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
