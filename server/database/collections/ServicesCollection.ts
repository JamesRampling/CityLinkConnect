import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { Service } from '#shared/models';
import z from 'zod';

export default {
  getAll: queryAll(Service, /*sql*/ `SELECT * FROM Services;`),

  getFromId: queryUnique(
    z.int(),
    Service,
    /*sql*/ `SELECT * FROM Services WHERE service_id = ?;`,
  ),

  insert: mutateRows(
    Service.omit({ service_id: true }),
    /*sql*/ `
    INSERT INTO Services (config)
           VALUES ($config);`,
  ),

  update: mutateRows(
    Service.extend({ service_id: z.int() }),
    /*sql*/ `
    UPDATE Services
    SET config = $config
    WHERE service_id = $service_id;
    `,
  ),

  delete: mutateRows(
    z.int(),
    /*sql*/ `DELETE FROM Services WHERE service_id = ?;`,
  ),
} satisfies DatabaseConfig;
