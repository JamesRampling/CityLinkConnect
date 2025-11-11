import type { SQLiteDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import { Service } from '#shared/models';

export const ServicesCollectionConfig = {
  zodSchema: Service,

  allSQL: /*sql*/ `
    SELECT * FROM Services;
  `,

  singleSQL: /*sql*/ `
    SELECT * FROM Services
      WHERE Services.service_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Services (config)
      VALUES ($config);
  `,

  updateSQL: /*sql*/ `
    UPDATE Services
      SET
        config = $config
      WHERE service_id = $service_id;
  `,

  deleteSQL: /*sql*/ `
    DELETE FROM Services WHERE service_id = $id;
  `,
} satisfies SQLiteDatabaseCollectionConfig<typeof Service>;
