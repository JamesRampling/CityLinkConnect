import { ResponseError } from '#server/utils/Responses';
import { Result } from '#shared/utils/Result';
import type {
  DatabaseSync,
  SQLInputValue,
  StatementResultingChanges,
} from 'node:sqlite';
import z from 'zod';

export function queryAll<O extends z.ZodType>(
  outputSchema: O,
  query: string,
): (database: DatabaseSync) => () => z.output<z.ZodArray<O>> {
  return (database: DatabaseSync) => {
    const statement = database.prepare(query);
    statement.setAllowBareNamedParameters(true);

    return () => {
      const rows = statement.all();
      return outputSchema.array().parse(rows);
    };
  };
}

export function queryUnique<I extends z.ZodType, O extends z.ZodType>(
  inputSchema: I,
  outputSchema: O,
  query: string,
): (
  database: DatabaseSync,
) => (input: z.input<I>) => Result<z.output<O> | undefined, QueryError> {
  return (database) => {
    const statement = database.prepare(query);
    statement.setAllowBareNamedParameters(true);

    return (input) => {
      const row = validateSqlParameters(inputSchema, input).and_then(
        (inner) => {
          try {
            // type-safety: the type of the result is `SQLInputValue | Record<string, SQLInputValue>`,
            // on their own, both types of the union are valid inputs to `get` under different overloads.
            // TypeScript cannot yet resolve cases like this (see issue #14107), so we just assert the type.
            return Result.ok(statement.get(inner as unknown as SQLInputValue));
          } catch (error) {
            const errcode = getSQLiteErrorCode(error);
            return Result.err(
              errcode !== undefined
                ? { type: 'sqlite-error', errcode }
                : { type: 'unknown-error', error },
            );
          }
        },
      );

      return row.map((row) =>
        row !== undefined ? outputSchema.parse(row) : undefined,
      );
    };
  };
}

export function mutateRows<I extends z.ZodType>(
  inputSchema: I,
  query: string,
): (
  database: DatabaseSync,
) => (input: z.input<I>) => Result<MutationResult, QueryError> {
  return (database) => {
    const statement = database.prepare(query);
    statement.setAllowBareNamedParameters(true);

    return (input) => {
      const changes = validateSqlParameters(
        inputSchema,
        input,
      ).and_then<StatementResultingChanges>((inner) => {
        try {
          // type-safety: see `queryUnique`
          return Result.ok(statement.run(inner as unknown as SQLInputValue));
        } catch (error) {
          const errcode = getSQLiteErrorCode(error);
          return Result.err(
            errcode !== undefined
              ? { type: 'sqlite-error', errcode }
              : { type: 'unknown-error', error },
          );
        }
      });

      return changes.map((inner) => {
        return {
          rows_changed: Number(inner.changes),
          last_row_id: Number(inner.lastInsertRowid),
        } satisfies MutationResult;
      });
    };
  };
}

function validateSqlParameters<I extends z.ZodType>(
  schema: I,
  input: z.input<I>,
): Result<SQLInputValue | Record<string, SQLInputValue>, QueryError> {
  const result = z
    .union([
      schema.transform(toSqlInput),
      // cast to any is required due to technical limitations in Zod
      schema.pipe(z.any()).pipe(z.record(z.string(), z.transform(toSqlInput))),
    ])
    .safeParse(input);

  if (!result.success)
    return Result.err({
      type: 'validation-error',
      issues: result.error.issues,
    });

  return Result.ok(result.data);
}

function toSqlInput(
  value: unknown,
  ctx: z.RefinementCtx | z.core.ParsePayload,
): SQLInputValue {
  if (
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'string' ||
    value === null ||
    value instanceof Uint8Array
  ) {
    return value;
  } else if (value === false) {
    return 0;
  } else if (value === true) {
    return 1;
  } else if (value === undefined) {
    return null;
  } else if (value instanceof Date) {
    return value.toISOString();
  } else {
    ctx.issues.push({
      code: 'custom',
      input: value,
      message: 'input was not a valid SQLite value',
    });

    return z.NEVER;
  }
}

interface MutationResult {
  rows_changed: number;
  last_row_id: number;
}

type QueryError = ValidationError | NodeSQLiteError | UnknownError;

interface ValidationError {
  type: 'validation-error';
  issues?: z.core.$ZodIssue[];
}

interface NodeSQLiteError {
  type: 'sqlite-error';
  errcode: number;
}

interface UnknownError {
  type: 'unknown-error';
  error?: unknown;
}

export function queryErrorToResponse(error: QueryError): ResponseError {
  if (
    error.type === 'sqlite-error' &&
    sqliteConstraintErrorCodes.includes(error.errcode)
  ) {
    return new ResponseError({
      type: 'constraint-error',
      status: 400,
      title: 'The request violated a database constraint.',
    });
  } else {
    return new ResponseError({
      type: 'server-error',
      status: 500,
      title: 'An unknown database error occured.',
      details: error,
    });
  }
}

function getSQLiteErrorCode(e: unknown): number | undefined {
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

const sqliteConstraintErrorCodes = [
  19, 275, 531, 3091, 787, 1043, 1299, 2835, 1555, 2579, 1811, 2067, 2323,
];
