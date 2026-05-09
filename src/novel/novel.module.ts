import { Module } from '@nestjs/common';
import { NovelService } from './novel.service.js';
import { NovelController } from './novel.controller.js';

@Module({
  controllers: [NovelController],
  providers: [NovelService],
  exports: [NovelService]
})
export class NovelModule {}
