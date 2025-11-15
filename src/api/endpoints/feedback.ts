import { Feedback } from '#shared/models';
import { request, requestIn, requestOut } from '@/api/factories';

const baseUrl = '/api/feedback';

export default {
  /**
   * Get list of all feedback sent, requires authentication with admin
   * permissions.
   */
  all: requestOut('GET', baseUrl, Feedback, true),

  /**
   * Delete a feedback entry, requires authentication with admin permission.
   */
  delete: request('DELETE', `${baseUrl}/:id`, true),

  /**
   * Submit a single piece of feedback, does not require authenticating.
   */
  create: requestIn(
    'POST',
    baseUrl,
    Feedback.omit({ feedback_id: true }),
    false,
  ),
};
