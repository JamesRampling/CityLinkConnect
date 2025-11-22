import type { DatabaseConfig } from '#server/database';
import {
  mutateRows,
  queryAll,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { Announcement } from '#shared/models';
import z from 'zod';

export default {
  getAll: queryAll(
    Announcement,
    /*sql*/ `SELECT * FROM Announcements ORDER BY sort_datetime DESC;`,
  ),
  getFromId: queryUnique(
    z.int(),
    Announcement,
    /*sql*/ `SELECT * FROM Announcements WHERE announcement_id = ?;`,
  ),
  insert: mutateRows(
    Announcement.omit({ announcement_id: true }),
    /*sql*/ `
    INSERT INTO Announcements (sort_datetime, config)
           VALUES ($sort_datetime, $config);`,
  ),
  update: mutateRows(
    Announcement.extend({ announcement_id: z.int() }),
    /*sql*/ `
    UPDATE Announcements
    SET sort_datetime = $sort_datetime, config = $config
    WHERE announcement_id = $announcement_id;
    `,
  ),
  delete: mutateRows(
    z.int(),
    /*sql*/ `DELETE FROM Announcements WHERE announcement_id = ?;`,
  ),
} satisfies DatabaseConfig;
