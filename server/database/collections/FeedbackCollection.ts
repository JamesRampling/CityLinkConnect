import {
  mutateRows,
  queryAll,
  queryUnique,
} from '#server/database/DatabaseCollection';
import { Feedback } from '#shared/models';
import z from 'zod';

export default {
  getAll: queryAll(Feedback, /*sql*/ `SELECT * FROM Feedback;`),

  getFromId: queryUnique(
    z.int(),
    Feedback,
    /*sql*/ `SELECT * FROM Feedback WHERE feedback_id = ?;`,
  ),

  insert: mutateRows(
    Feedback.omit({ feedback_id: true }),
    /*sql*/ `
      INSERT INTO Feedback (email, subject, message)
        VALUES ($email, $subject, $message);`,
  ),

  delete: mutateRows(
    z.int(),
    /*sql*/ `DELETE FROM Feedback WHERE feedback_id = ?;`,
  ),
};
