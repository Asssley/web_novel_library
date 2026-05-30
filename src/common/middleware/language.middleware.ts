import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Lang } from '../../generated/enums.js';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const langFromCookie = req.cookies?.lang;

    const allowedLangs = ['ENGLISH', 'UKRAINIAN'] as const;

    if (allowedLangs.includes(langFromCookie)) {
      req.lang = langFromCookie as Lang;
    } else {
      req.lang = 'ENGLISH';
    }

    next();
  }
}