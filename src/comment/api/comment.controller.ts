import { Controller, Get, Post, Delete, Param, Body, Query, Req, } from '@nestjs/common';
import { CommentService } from '../comment.service.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { GetCommentsQueryDto } from '../dto/get-comments-query.dto.js';

@Controller('api/novels/:novelId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  async create(
    @Req() req,
    @Param('novelId') novelId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const userId = req.user.id;

    return this.commentService.create(userId, novelId, dto);
  }

  @Delete(':commentId')
  async delete(
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    const userId = req.user.id;

    return this.commentService.delete(userId, commentId);
  }
}