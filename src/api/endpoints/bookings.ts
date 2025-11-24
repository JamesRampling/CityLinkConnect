import { Booking, User } from '#shared/models';
import { ServiceOrError } from '@/api/endpoints/services';
import { request, requestInOut, requestOut } from '@/api/factories';

const baseUrl = '/api/bookings';

export const BookingWithService = Booking.extend({ service: ServiceOrError });

export const BookingWithUserAndService = Booking.extend({
  service: ServiceOrError,
  user: User,
});

export default {
  /**
   * Get list of all the current user's service bookings.
   */
  all: requestOut('GET', baseUrl, BookingWithService.array(), true),

  /**
   * Get a single service booking, requires authentication with either admin
   * permissions, or the owning user.
   */
  single: requestOut('GET', `${baseUrl}/:id`, BookingWithUserAndService, true),

  /**
   * Create a new service booking, new booking will belong to the user that
   * created it.
   * @returns Ok with the new service booking that was created, or error if
   * request failed.
   */
  create: requestInOut(
    'POST',
    baseUrl,
    Booking.omit({ booking_id: true, user_id: true }),
    Booking,
    true,
  ),

  /**
   * Get list of every service booking made by every user.
   */
  allAdmin: requestOut(
    'GET',
    `${baseUrl}/all`,
    BookingWithUserAndService.array(),
    true,
  ),

  /**
   * Updates an existing service booking, requires authentication admin
   * permissions.
   */
  update: requestInOut(
    'PUT',
    `${baseUrl}/:id`,
    Booking.omit({ booking_id: true }),
    Booking,
    true,
  ),

  /**
   * Deletes an existing service booking, requires authentication with admin
   * permissions.
   */
  delete: request('DELETE', `${baseUrl}/:id`, true),
};
