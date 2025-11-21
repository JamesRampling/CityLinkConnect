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

  getVisible: queryAll(
    Service,
    /*sql*/ `SELECT * FROM Services WHERE is_hidden = FALSE;`,
  ),

  getFromId: queryUnique(
    z.int(),
    Service,
    /*sql*/ `SELECT * FROM Services WHERE service_id = ?;`,
  ),

  insert: mutateRows(
    Service.omit({ service_id: true }),
    /*sql*/ `
    INSERT INTO Services (config, is_hidden)
           VALUES ($config, $is_hidden);`,
  ),

  update: mutateRows(
    Service.extend({ service_id: z.int() }),
    /*sql*/ `
    UPDATE Services
    SET
      config = $config,
      is_hidden = $is_hidden
    WHERE service_id = $service_id;
    `,
  ),
} satisfies DatabaseConfig;
