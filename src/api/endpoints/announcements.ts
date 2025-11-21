import { AnnouncementWithXML } from '#shared/models';
import { request, requestIn, requestInOut, requestOut } from '@/api/factories';

const baseUrl = `/api/announcements`;

export default {
  /**
   * Get a list of all the announcements.
   */
  all: requestOut(`GET`, baseUrl, AnnouncementWithXML.array(), false),

  /**
   * Get a single announcement by its ID.
   */
  single: requestOut(`GET`, `${baseUrl}/:id`, AnnouncementWithXML, false),

  /**
   * Create a new announcement, requires authentication with admin permissions.
   * @returns Ok with the new announcement, or error if request failed.
   */
  create: requestInOut(
    `POST`,
    baseUrl,
    AnnouncementWithXML.omit({ announcement_id: true }),
    AnnouncementWithXML,
    true,
  ),

  /**
   * Update an existing announcement, requires authentication with admin
   * permissions.
   */
  update: requestIn(
    `PUT`,
    `${baseUrl}/:id`,
    AnnouncementWithXML.omit({ announcement_id: true }),
    true,
  ),

  /**
   * Delete an announcement, requires authentication with admin permissions.
   */
  delete: request(`DELETE`, `${baseUrl}/:id`, true),
};
