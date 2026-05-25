import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service.js';
import { ChapterController } from './chapter.controller.js';

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService]
})
export class ChapterModule {}
