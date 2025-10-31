import type { SQLiteDatabaseCollectionConfig } from '#server/database/DatabaseCollection';
import { Feedback } from '#shared/models';

export const FeedbackCollectionConfig = {
  zodSchema: Feedback,

  allSQL: /*sql*/ `
    SELECT * FROM Feedback;
  `,

  singleSQL: /*sql*/ `
    SELECT * FROM Feedback WHERE feedback_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Feedback (email, subject, message)
      VALUES ($email, $subject, $message);
  `,

  updateSQL: /*sql*/ `
    UPDATE Feedback
      SET
        email = $email,
        subject = $subject,
        message = $message
      WHERE feedback_id = $feedback_id;
  `,

  deleteSQL: /*sql*/ `
    DELETE FROM Feedback WHERE feedback_id = $id;
  `,
} satisfies SQLiteDatabaseCollectionConfig<typeof Feedback>;
