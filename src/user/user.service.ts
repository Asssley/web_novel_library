import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  async getUserStats(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const [
      novelCount,
      savedCount,
      ratedCount,
      commentsCount,
      commentRates,
    ] = await Promise.all([
      this.prismaService.novel.count({
        where: { userId },
      }),
      
      this.prismaService.savedNovels.count({
        where: { userId },
      }),

      this.prismaService.novelRate.count({
        where: { userId },
      }),

      this.prismaService.comment.count({
        where: { userId },
      }),

      this.prismaService.commentRate.groupBy({
        by: ['isPositive'],
        where: { userId },
        _count: true,
      }),
    ]);

    const likes =
      commentRates.find(r => r.isPositive === true)?._count ?? 0;

    const dislikes =
      commentRates.find(r => r.isPositive === false)?._count ?? 0;

    return {
      user,
      stats: {
        createdNovels: novelCount,
        savedNovels: savedCount,
        ratedNovels: ratedCount,
        comments: commentsCount,
        commentLikes: likes,
        commentDislikes: dislikes,
      },
    };
  }
}


