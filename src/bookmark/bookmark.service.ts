import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) { }

  async getBookmark(userId: string, novelId: string) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        novelId_userId: {
          userId: userId,
          novelId: novelId
        },
      },
      select: {
        chapter: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            text: true,
          }
        }
      }
    });

    if (!bookmark) {
      const firstChapter = await this.prismaService.chapter.findFirst({
        where: {
          novelId: novelId,
          chapterNumber: 1
        },
        select: {
          id: true,
          chapterNumber: true,
          title: true,
          text: true,
        }
      });

      if (!firstChapter) throw new NotFoundException();

      return firstChapter;
    }

    return bookmark.chapter
  }

  async update(userId: string, novelId: string, chapterId: string) {
    const bookmark = await this.prismaService.bookmark.upsert({
      where: {
        novelId_userId: {
          userId: userId,
          novelId: novelId
        }
      },
      create: {
        userId: userId,
        novelId: novelId,
        chapterId: chapterId
      },
      update: {
        chapterId: chapterId
      }
    });

    return { succes: true };
  }
}
