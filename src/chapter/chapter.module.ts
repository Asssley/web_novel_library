import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service.js';
import { ChapterController as ChapterApiController } from './api/chapter.controller.js';
import { ChapterController as ChapterViewController} from './view/chapter.controller.js';
import { BookmarkModule } from '../bookmark/bookmark.module.js';
import { TranslationModule } from '../translation/translation.module.js';

@Module({
  controllers: [
    ChapterApiController,
    ChapterViewController,
  ],
  providers: [ChapterService],
  exports: [ChapterService],
  imports: [BookmarkModule, TranslationModule]
})
export class ChapterModule {}
