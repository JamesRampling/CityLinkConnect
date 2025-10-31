import { Result } from '#shared/utils/Result';
import type {
  DatabaseSync,
  SQLInputValue,
  SQLOutputValue,
  StatementSync,
} from 'node:sqlite';
import z from 'zod';

export interface DatabaseCollection<Table> {
  all(): Table[];
  single(id: number): Table | undefined;
  insert(entry: Table): ChangeResult<Table>;
  update(entry: Table): ChangeResult<Table>;
  delete(id: number): DeleteResult;
}

export interface JoinedDatabaseCollection<Table, JoinedTable>
  extends DatabaseCollection<Table> {
  allJoined(): JoinedTable[];
  singleJoined(id: number): JoinedTable | undefined;
}

export type DeleteResult = Result<undefined, DeleteError>;
type DeleteError = NonExistentIdError | NodeSQLiteError | UnknownError;

export type ChangeResult<T> = Result<ChangeOk, ChangeError<T>>;
type ChangeError<T> =
  | ValidationError<T>
  | NonExistentIdError
  | NodeSQLiteError
  | UnknownError;

interface ChangeOk {
  changes: number;
  rowId: number;
}

interface NonExistentIdError {
  type: 'non-existent-id';
}

interface ValidationError<T> {
  type: 'validation-error';
  issues?: { [P in keyof T]?: string[] };
}

interface NodeSQLiteError {
  type: 'sqlite-error';
  errcode: number;
}

interface UnknownError {
  type: 'unknown-error';
  error?: unknown;
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
}

type MappedField<T, Destination> = T extends object
  ? MappedObject<T, Destination>
  : Destination;

/**
 * Map an object's property types to the {@link Destination} type.
 */
export type MappedObject<Obj, Destination> = {
  [Key in keyof Obj]: Obj[Key] extends (infer T)[]
    ? MappedField<T, Destination>[]
    : MappedField<Obj[Key], Destination>;
};

export interface SQLiteJoinedDatabaseCollectionConfig<
  TableSchema extends z.ZodObject,
  JoinedTableSchema extends z.ZodObject,
> extends SQLiteDatabaseCollectionConfig<TableSchema> {
  joinedZodSchema: JoinedTableSchema;
  allJoinedSQL: string;
  singleJoinedSQL: string;
  mapRowsToJoinedObjects?: (
    query: Record<string, SQLOutputValue>[],
  ) => MappedObject<z.input<JoinedTableSchema>, SQLOutputValue>[];
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

    this.insertStatement.setAllowBareNamedParameters(true);
    this.insertStatement.setAllowUnknownNamedParameters(true);
    this.updateStatement.setAllowBareNamedParameters(true);
    this.updateStatement.setAllowUnknownNamedParameters(true);
    this.deleteStatement.setAllowBareNamedParameters(true);
    this.deleteStatement.setAllowUnknownNamedParameters(true);
  }

  protected zodSchema: TableSchema;

  private allStatement: StatementSync;
  private singleStatement: StatementSync;
  private insertStatement: StatementSync;
  private updateStatement: StatementSync;
  private deleteStatement: StatementSync;

  all(): z.infer<TableSchema>[] {
    const rows = this.allStatement.all();
    return z.array(this.zodSchema).parse(rows);
  }

  single(id: number): z.infer<TableSchema> | undefined {
    const rows = this.singleStatement.get({ id });
    if (!rows) return undefined;
    return this.zodSchema.parse(rows);
  }

  insert(entry: z.infer<TableSchema>): ChangeResult<z.infer<TableSchema>> {
    try {
      const input = this.zodSchema.safeParse(entry);
      if (!input.success) {
        return Result.error({
          type: 'validation-error',
          issues: z.flattenError(input.error).fieldErrors,
        });
      }

      const inputValues = convertObjectToSQLInputParams(input.data);

      const { changes, lastInsertRowid } =
        this.insertStatement.run(inputValues);

      return changes
        ? Result.ok({
            changes: Number(changes),
            rowId: Number(lastInsertRowid),
          })
        : Result.error({ type: 'non-existent-id' });
    } catch (e) {
      const errcode = getNodeSQLiteErrorCode(e);
      return Result.error(
        errcode !== undefined
          ? { type: 'sqlite-error', errcode }
          : { type: 'unknown-error', error: e },
      );
    }
  }

  update(entry: z.infer<TableSchema>): ChangeResult<z.infer<TableSchema>> {
    try {
      const input = this.zodSchema.safeParse(entry);
      if (!input.success) {
        return Result.error({
          type: 'validation-error',
          issues: z.flattenError(input.error).fieldErrors,
        });
      }

      const inputValues = convertObjectToSQLInputParams(input.data);

      const { changes, lastInsertRowid } =
        this.updateStatement.run(inputValues);

      return changes
        ? Result.ok({
            changes: Number(changes),
            rowId: Number(lastInsertRowid),
          })
        : Result.error({ type: 'non-existent-id' });
    } catch (e) {
      const errcode = getNodeSQLiteErrorCode(e);
      return Result.error(
        errcode !== undefined
          ? { type: 'sqlite-error', errcode }
          : { type: 'unknown-error', error: e },
      );
    }
  }

  delete(id: number): DeleteResult {
    try {
      const result = this.deleteStatement.run({ id });
      return result.changes > 0
        ? Result.ok(undefined)
        : Result.error({ type: 'non-existent-id' });
    } catch (e) {
      console.log(e?.toString());
      const errcode = getNodeSQLiteErrorCode(e);
      return Result.error(
        errcode !== undefined
          ? { type: 'sqlite-error', errcode }
          : { type: 'unknown-error', error: e },
      );
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
