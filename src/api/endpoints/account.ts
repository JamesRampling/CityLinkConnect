import { User } from '#shared/models';
import { requestIn, requestInOut, requestOut } from '@/api/factories';
import z from 'zod';

const baseUrl = `/api/account`;

export default {
  /**
   * Register a user account.
   * @returns Ok if user account is created, and user can login, or error if
   * request failed.
   */
  register: requestIn(
    'POST',
    `${baseUrl}/register`,
    User.omit({ user_id: true }).extend({ password: z.string() }),
    false,
  ),

  /**
   * Login using an existing user account.
   * @returns Ok with the authentication token to use with following requests if
   * user logged in successfully, or error if request failed.
   */
  login: requestInOut(
    'POST',
    `${baseUrl}/login`,
    z.object({ email: z.email(), password: z.string() }),
    User.extend({ token: z.jwt() }),
    false,
  ),

  /**
   * Get the currently authenticated user account.
   */
  info: requestOut('GET', `${baseUrl}/info`, User, true),

  /**
   * Get all user accounts on the server, requires authentication with admin
   * permissions.
   */
  all: requestOut('GET', baseUrl, User.array(), true),
};
