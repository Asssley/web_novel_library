import { Module } from '@nestjs/common';
import { NovelRateService } from './novel-rate.service.js';
import { NovelRateController } from './novel-rate.controller.js';

@Module({
  controllers: [NovelRateController],
  providers: [NovelRateService],
  exports: [NovelRateService]
})
export class NovelRateModule { }
