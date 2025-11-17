import type { AuthenticationStatus } from '#server/authentication';

declare module 'express-serve-static-core' {
  export interface Request {
    authentication?: AuthenticationStatus;
  }
}
