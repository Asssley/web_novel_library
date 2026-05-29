import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { NovelModule } from './novel/novel.module.js';
import { SavedModule } from './saved/saved.module.js';
import { ChapterModule } from './chapter/chapter.module.js';
import { BookmarkModule } from './bookmark/bookmark.module.js';
import { NovelRateModule } from './novel-rate/novel-rate.module.js';
import { APP_GUARD } from '@nestjs/core';
import { OptionalJwtAuthGuard } from './auth/guards/optional-jwt-auth.guard.js';
import { CommentModule } from './comment/comment.module.js';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NovelModule,
    SavedModule,
    ChapterModule,
    BookmarkModule,
    NovelRateModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:APP_GUARD,
      useClass:OptionalJwtAuthGuard
    }
  ],
})
export class AppModule { }
