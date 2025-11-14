import type { AuthenticationStatus } from '#server/routes/accounts';

declare global {
  namespace Express {
    export interface Request {
      authentication?: AuthenticationStatus;
    }
  }
}
