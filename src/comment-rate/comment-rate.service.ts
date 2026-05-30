import { Injectable } from '@nestjs/common';
import { UpdateCommentRateDto } from './dto/update-comment-rate.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CommentRateService {
  constructor(private readonly prismaService: PrismaService) { }

  async update(userId: string, commentId: string, dto: UpdateCommentRateDto) {
    const result = await this.prismaService.commentRate.upsert({
      where: {
        userId_commentId: {
          userId: userId,
          commentId: commentId
        }
      },
      update: {
        isPositive: dto.rate
      },
      create: {
        userId: userId,
        commentId: commentId,
        isPositive: dto.rate
      }
    });
    
    return { success: true }
  }

}
