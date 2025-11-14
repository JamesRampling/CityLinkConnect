import { User } from '#shared/models';
import { post, postNoResponseContent } from '@/api/factories';
import z from 'zod';

export default {
  register: postNoResponseContent(
    '/api/account/register',
    User.extend({ password: z.string() }),
  ),

  login: post(
    '/api/account/login',
    z.object({ email: z.email(), password: z.string() }),
    z.jwt(),
  ),
};
