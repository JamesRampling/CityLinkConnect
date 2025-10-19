import { db } from '#server/database';
import { Responses } from '#server/utils/Responses';
import { validate } from '#server/utils/validate';
import { Feedback } from '#shared/models';
import { Router } from 'express';

const route = Router();

route.get('/', (_req, res) => {
  const feedback = db.Feedback.all();
  Responses.ok(res, feedback);
});

route.get('/:id', validate({ route: { id: 'int' } }), (req, res) => {
  const { id } = req.params;
  const feedback = db.Feedback.single(id);
  if (feedback) {
    Responses.ok(res, feedback);
  } else {
    Responses.notFound(res, 'The feedback was not found.');
  }
});

route.post(
  '/',
  validate({ body: Feedback.omit({ feedback_id: true }) }),
  (req, res) => {
    const feedback = { ...req.body, feedback_id: 0 };

    const { ok, data, error } = db.Feedback.insert(feedback);
    if (ok) {
      Responses.created(res, { ...feedback, feedback_id: data.rowId });
    } else {
      Responses.serverError(
        res,
        'There was an error in submitting the feedback.',
        error,
      );
    }
  },
);

export default route;
