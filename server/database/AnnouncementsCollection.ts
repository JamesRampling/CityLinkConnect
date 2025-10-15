import type { SQLiteDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import { Announcement } from '#shared/models';

export const AnnouncementsCollectionConfig = {
  inZodSchema: Announcement,
  outZodSchema: Announcement,

  getAllSQL: /*sql*/ `
    SELECT * FROM Announcements ORDER BY sort_datetime DESC;
  `,

  getSingleSQL: /*sql*/ `
    SELECT * FROM Announcements WHERE announcement_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Announcements (announcement_id, sort_datetime, config)
      VALUES (NULL, $sort_datetime, $config);
  `,

  updateSQL: /*sql*/ `
    UPDATE Announcements
      SET
        sort_datetime = $sort_datetime,
        config = $config
      WHERE announcement_id = $announcement_id;
  `,

  deleteSQL: /*sql*/ `
    DELETE FROM Announcements WHERE announcement_id = $id;
  `,
} satisfies SQLiteDatabaseCollectionConfig<typeof Announcement>;
