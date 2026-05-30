import { Module } from '@nestjs/common';
import { CommentRateService } from './comment-rate.service.js';
import { CommentRateController } from './comment-rate.controller.js';

@Module({
  controllers: [CommentRateController],
  providers: [CommentRateService],
})
export class CommentRateModule {}
