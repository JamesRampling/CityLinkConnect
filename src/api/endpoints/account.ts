import { User } from '#shared/models';
import { requestIn, requestInOut } from '@/api/factories';
import z from 'zod';

export default {
  register: requestIn(
    'POST',
    '/api/account/register',
    User.extend({ password: z.string() }),
    false,
  ),

  login: requestInOut(
    'POST',
    '/api/account/login',
    z.object({ email: z.email(), password: z.string() }),
    z.jwt(),
    true,
  ),
};
