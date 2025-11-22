import { Booking, Service, ServiceWithXML } from '#shared/models';
import { requestIn, requestInOut, requestOut } from '@/api/factories';
import { fallibleArray } from '@/utils';
import z from 'zod';

const baseUrl = '/api/services';

export default {
  /**
   * Get a list of all the available services.
   */
  all: requestOut(
    'GET',
    baseUrl,
    z.array(z.unknown()).transform(fallibleArray(ServiceWithXML)),
    false,
  ),

  /**
   * Get a single service by its id.
   */
  single: requestOut('GET', `${baseUrl}/:id`, Service, true),

  singleJs: requestOut('GET', `${baseUrl}/:id`, ServiceWithXML, true),

  /**
   * Create a new service, requires authentication with admin permissions.
   * @returns Ok with the created service, or error if request failed.
   */
  create: requestInOut(
    'POST',
    baseUrl,
    Service.omit({ service_id: true }),
    Booking,
    true,
  ),

  /**
   * Update an existing service, requires authentication with admin permissions.
   */
  update: requestIn(
    'PUT',
    `${baseUrl}/:id`,
    Service.omit({ service_id: true }),
    true,
  ),
};
