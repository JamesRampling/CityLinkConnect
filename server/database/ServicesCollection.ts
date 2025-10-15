import type { SQLiteDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import { Service } from '#shared/models';

export const ServicesCollectionConfig = {
  inZodSchema: Service,
  outZodSchema: Service,

  getAllSQL: /*sql*/ `
    SELECT * FROM Services;
  `,

  getSingleSQL: /*sql*/ `
    SELECT * FROM Services
      WHERE Services.service_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Services (service_id, config)
      VALUES (NULL, $config);
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
