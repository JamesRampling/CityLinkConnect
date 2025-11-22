import { Announcement, AnnouncementWithXML } from '#shared/models';
import { request, requestIn, requestInOut, requestOut } from '@/api/factories';
import { fallibleArray } from '@/utils';
import z from 'zod';

const baseUrl = `/api/announcements`;

export default {
  /**
   * Get a list of all the announcements.
   */
  all: requestOut(
    `GET`,
    baseUrl,
    z.array(z.unknown()).transform(fallibleArray(AnnouncementWithXML)),
    false,
  ),

  /**
   * Get a single announcement by its ID.
   */
  single: requestOut(`GET`, `${baseUrl}/:id`, Announcement, false),

  /**
   * Get a single announcement by its ID with its config as a JavaScript object.
   */
  singleJs: requestOut(`GET`, `${baseUrl}/:id`, AnnouncementWithXML, false),

  /**
   * Create a new announcement, requires authentication with admin permissions.
   * @returns Ok with the new announcement, or error if request failed.
   */
  create: requestInOut(
    `POST`,
    baseUrl,
    Announcement.omit({ announcement_id: true }),
    Announcement,
    true,
  ),

  /**
   * Update an existing announcement, requires authentication with admin
   * permissions.
   */
  update: requestIn(
    `PUT`,
    `${baseUrl}/:id`,
    Announcement.omit({ announcement_id: true }),
    true,
  ),

  /**
   * Delete an announcement, requires authentication with admin permissions.
   */
  delete: request(`DELETE`, `${baseUrl}/:id`, true),
};
