import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import expressLayouts from 'express-ejs-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  app.useStaticAssets(join(__dirname, '..', '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', '..', 'views'));
  app.setViewEngine('ejs');

  app.use(expressLayouts);
  app.set('layout', join(__dirname, '..', '..', '..', 'views', 'layouts', 'main.ejs'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
