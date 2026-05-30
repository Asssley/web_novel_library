import { Controller, Body, Param, UseGuards, Req, Post } from '@nestjs/common';
import { CommentRateService } from '../comment-rate.service.js';
import { UpdateCommentRateDto } from '../dto/update-comment-rate.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('api/novels/:novelId/comments/:commentId/rate')
export class CommentRateController {
  constructor(private readonly commentRateService: CommentRateService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async update(
    @Req() req,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentRateDto) {
    return this.commentRateService.update(req.user.id, commentId, dto);
  }
}
