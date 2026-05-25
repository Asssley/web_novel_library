import { Module } from '@nestjs/common';
import { NovelService } from './novel.service.js';
import { NovelController as NovelApiController } from './api/novel.controller.js';
import { NovelController as NovelViewController } from './view/novel.controller.js';
import { NovelRateModule } from '../novel-rate/novel-rate.module.js';
import { BookmarksModule } from '../bookmarks/bookmarks.module.js';
import { ChapterModule } from '../chapter/chapter.module.js';
import { SavedModule } from '../saved/saved.module.js';


@Module({
  controllers: [
    NovelApiController,
    NovelViewController
  ],
  providers: [NovelService],
  exports: [NovelService],
  imports: [
    NovelRateModule,
    BookmarksModule,
    ChapterModule,
    SavedModule
  ]
})
export class NovelModule { }
