import { User } from '#shared/models';
import { requestIn, requestInOut } from '@/api/factories';
import z from 'zod';

const baseUrl = `/api/account`;

export default {
  register: requestIn(
    'POST',
    `${baseUrl}/register`,
    User.extend({ password: z.string() }),
    false,
  ),

  login: requestInOut(
    'POST',
    `${baseUrl}/login`,
    z.object({ email: z.email(), password: z.string() }),
    z.jwt(),
    true,
  ),
};
