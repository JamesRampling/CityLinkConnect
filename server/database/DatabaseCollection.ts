import type { DatabaseSync, SQLInputValue, StatementSync } from 'node:sqlite';
import z from 'zod';

export interface DatabaseCollection<T> {
  getAll(): T[];
  getSingle(id: number): T;
  update(entry: T): void;
  insert(entry: T): void;
  delete(id: number): void;
}

export class SqLiteDatabaseCollection<T extends z.ZodObject>
  implements DatabaseCollection<z.infer<T>>
{
  constructor(options: SqLiteDatabaseOptions<T>) {
    this.zodType = options.zodType;
    this.database = options.database;
    this.getAllStatement = options.getAllStatement;
    this.getSingleStatement = options.getSingleStatement;
    this.updateStatement = options.updateStatement;
    this.insertStatement = options.insertStatement;
    this.deleteStatement = options.deleteStatement;
  }

  private zodType: T;
  private database: DatabaseSync;
  private getAllStatement: StatementSync;
  private getSingleStatement: StatementSync;
  private updateStatement: StatementSync;
  private insertStatement: StatementSync;
  private deleteStatement: StatementSync;

  getAll(): z.infer<T>[] {
    const value = this.getAllStatement.all();
    console.log(value);
    return z.array(this.zodType).parse(value);
  }

  getSingle(id: number): z.infer<T> {
    const value = this.getSingleStatement.get(id);
    return this.zodType.parse(value);
  }

  update(entry: z.infer<T>): void {
    // TODO: handle complex data type such as objects.
    this.updateStatement.run(entry as Record<string, SQLInputValue>);
  }

  insert(entry: z.infer<T>): void {
    // TODO: handle complex data type such as objects.
    this.insertStatement.run(entry as Record<string, SQLInputValue>);
  }

  delete(id: number): void {
    this.deleteStatement.run(id);
  }
}

export interface SqLiteDatabaseOptions<T extends z.ZodObject> {
  zodType: T;
  database: DatabaseSync;
  getAllStatement: StatementSync;
  getSingleStatement: StatementSync;
  updateStatement: StatementSync;
  insertStatement: StatementSync;
  deleteStatement: StatementSync;
}
