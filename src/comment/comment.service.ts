import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto.js';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, novelId: string, dto: CreateCommentDto) {
    const novel = await this.prisma.novel.findUnique({
      where: {
        id: novelId,
      },
      select: {
        id: true,
        user: {
          select: {
            canComment: true
          }
        }
      },
    });

    if (!novel) throw new NotFoundException();

    if (novel.user.canComment === false) {
      throw new ForbiddenException('Comments are disabled');
    }

    const comment = await this.prisma.comment.create({
      data: {
        text: dto.text,
        userId,
        novelId,
      },
      select: {
        id: true
      }
    });

    return comment;
  }

  async getAll(userId: string | null, novelId: string, dto: GetCommentsQueryDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 15;

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: {
          novelId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
          rates: {
            select: {
              isPositive: true,
              userId: true
            }
          }
        },
      }),

      this.prisma.comment.count({
        where: {
          novelId,
        },
      }),
    ]);

    const preparedComments = comments.map(comment => {
      const likesCount = comment.rates.filter(r => r.isPositive).length;
      const dislikesCount = comment.rates.filter(r => !r.isPositive).length;

      const userRate = userId
        ? comment.rates.find(r => r.userId === userId)
        : null;

      return {
        ...comment,
        likesCount,
        dislikesCount,
        userReaction: userRate
          ? (userRate.isPositive ? 'like' : 'dislike')
          : null,
      };
    });

    return {
      comments: preparedComments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) throw new NotFoundException();

    if (comment.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { success: true };
  }
}