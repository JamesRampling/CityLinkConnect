import { Booking } from '#shared/models';
import { requestInOut, requestOut } from '@/api/factories';

const baseUrl = '/api/bookings';

export default {
  /**
   * Get list of all service bookings, admin gets every booking, regular user
   * gets just their bookings.
   */
  all: requestOut('GET', baseUrl, Booking.array(), true),

  /**
   * Get a single service booking, requires authentication with either admin
   * permissions, or the owning user.
   */
  single: requestOut('GET', `${baseUrl}/:id`, Booking, true),

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
};
