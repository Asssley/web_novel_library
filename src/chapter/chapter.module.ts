import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service.js';
import { ChapterController as ChapterApiController } from './api/chapter.controller.js';
import { ChapterController as ChapterViewController} from './api/chapter.controller.js';

@Module({
  controllers: [
    ChapterApiController,
    ChapterViewController,
  ],
  providers: [ChapterService],
  exports: [ChapterService]
})
export class ChapterModule {}
