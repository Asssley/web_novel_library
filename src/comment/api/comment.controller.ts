import { Controller, Get, Post, Delete, Param, Body, Query, Req, UseGuards, } from '@nestjs/common';
import { CommentService } from '../comment.service.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { GetCommentsQueryDto } from '../dto/get-comments-query.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('api/novels/:novelId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Param('novelId') novelId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const userId = req.user.id;

    return this.commentService.create(userId, novelId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async delete(
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    const userId = req.user.id;

    return this.commentService.delete(userId, commentId);
  }
}