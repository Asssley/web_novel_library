import { Module } from '@nestjs/common';
import { NovelService } from './novel.service.js';
import { NovelController as NovelApiController } from './api/novel.controller.js';
import { NovelController as NovelViewController } from './view/novel.controller.js';
import { NovelRateModule } from '../novel-rate/novel-rate.module.js';
import { BookmarkModule } from '../bookmark/bookmark.module.js';
import { ChapterModule } from '../chapter/chapter.module.js';
import { SavedModule } from '../saved/saved.module.js';
import { CommentModule } from '../comment/comment.module.js';
import { TranslationModule } from '../translation/translation.module.js';


@Module({
  controllers: [
    NovelApiController,
    NovelViewController
  ],
  providers: [NovelService],
  exports: [NovelService],
  imports: [
    NovelRateModule,
    BookmarkModule,
    ChapterModule,
    SavedModule,
    CommentModule,
    TranslationModule
  ]
})
export class NovelModule { }
