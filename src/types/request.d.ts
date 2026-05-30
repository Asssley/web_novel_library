import { Lang } from '../generated/enums.js';

declare global {
  namespace Express {
    interface Request {
      lang?: Lang;
      user?: { id: string }
    }
  }
}

export {};