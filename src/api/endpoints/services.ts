import { Booking, ServiceWithXML } from '#shared/models';
import { request, requestIn, requestInOut, requestOut } from '@/api/factories';

const baseUrl = '/api/services';

const serviceWithoutId = ServiceWithXML.omit({ service_id: true });

export default {
  /**
   * Get a list of all the available services.
   */
  all: requestOut(
    'GET',
    baseUrl,
    z.array(z.unknown()).transform((arr) => {
      const items = [];
      for (const item of arr) {
        const result = ServiceWithXML.safeParse(item);
        if (result.success) {
          items.push(result.data);
        }
      }
      return items;
    }),
    false,
  ),

  /**
   * Get a single service by its id.
   */
  single: requestOut('GET', `${baseUrl}/:id`, ServiceWithXML, false),

  /**
   * Create a new service, requires authentication with admin permissions.
   * @returns Ok with the created service, or error if request failed.
   */
  create: requestInOut('POST', baseUrl, serviceWithoutId, Booking, true),

  /**
   * Update an existing service, requires authentication with admin permissions.
   */
  update: requestIn('PUT', `${baseUrl}/:id`, serviceWithoutId, true),

  /**
   * Delete a service, requires authentication with admin permissions.
   */
  delete: request('DELETE', `${baseUrl}/:id`, true),
};
