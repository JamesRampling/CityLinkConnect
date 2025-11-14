import { User } from '#shared/models';
import { post } from '@/api/factories';
import z from 'zod';

export default {
  register: post(
    '/api/account/register',
    User.extend({ password: z.string() }),
    User,
  ),

  login: post(
    '/api/account/login',
    z.object({ email: z.email(), password: z.string() }),
    z.jwt(),
  ),
};
