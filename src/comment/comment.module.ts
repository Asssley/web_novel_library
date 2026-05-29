import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CommentController } from './api/comment.controller.js';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
