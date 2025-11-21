import type { AuthenticationStatus } from '#shared/models';
import type z from 'zod';

declare module 'express-serve-static-core' {
  export interface Request {
    authentication?: z.infer<typeof AuthenticationStatus>;
  }
}
