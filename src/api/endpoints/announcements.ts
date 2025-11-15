import { Announcement } from '#shared/models';
import { request, requestIn, requestInOut, requestOut } from '@/api/factories';

const baseUrl = `/api/announcements`;

export default {
  all: requestOut(`GET`, baseUrl, Announcement, false),

  single: requestOut(`GET`, `${baseUrl}/:id`, Announcement, false),

  create: requestInOut(`POST`, baseUrl, Announcement, Announcement, true),

  update: requestIn(`PUT`, `${baseUrl}/:id`, Announcement, true),

  delete: request(`DELETE`, `${baseUrl}/:id`, true),
};
