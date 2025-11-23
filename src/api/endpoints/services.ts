import { Service, ServiceWithXML } from '#shared/models';
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
   * Get a list of all the services, including hidden services, requires
   * authentication with admin permissions.
   */
  allAdmin: requestOut(
    'GET',
    `${baseUrl}/all`,
    z.array(z.unknown()).transform(fallibleArray(ServiceWithXML)),
    true,
  ),

  /**
   * Get a single service by its id.
   */
  single: requestOut('GET', `${baseUrl}/:id`, Service, true),

  /**
   * Get a single service by its id with its config as a JavaScript object.
   */
  singleJs: requestOut('GET', `${baseUrl}/:id`, ServiceWithXML, true),

  /**
   * Create a new service, requires authentication with admin permissions.
   * @returns Ok with the created service, or error if request failed.
   */
  create: requestInOut(
    'POST',
    baseUrl,
    Service.omit({ service_id: true }),
    Service,
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
