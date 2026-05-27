import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetChaptetrsQueryDto } from './dto/get-chapters-query.dto.js';

@Injectable()
export class ChapterService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(userId: string, novelId: string, dto: CreateChapterDto) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
        isHidden: false
      },
      select: {
        userId: true,
        _count: {
          select: {
            chapters: true
          }
        }
      }
    });

    if (!novel) throw new NotFoundException();

    if (novel.userId !== userId) throw new ForbiddenException();

    const chapterNumber = novel._count.chapters + 1

    const chapter = await this.prismaService.chapter.create({
      data: {
        novelId: novelId,
        chapterNumber: chapterNumber,
        title: dto.title,
        text: dto.text
      }
    });

    return { succes: true }
  }

  async getAll(novelId: string, dto: GetChaptetrsQueryDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 50;

    const skip = (page - 1) * limit;

    const [chapters, total] = await Promise.all([
      this.prismaService.chapter.findMany({
        where: {
          novelId: novelId,
          novel: {
            isHidden: false
          }
        },
        skip,
        take: limit,
        orderBy: {
          chapterNumber: "asc"
        },
        select: {
          id: true,
          chapterNumber: true,
          title: true,
        }
      }),

      this.prismaService.chapter.count({
        where: {
          novelId: novelId,
          novel: {
            isHidden: false
          }
        },
      }),
    ]);

    return {
      chapters: chapters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: dto,
    };
  }

  async getById(chapterId: string) {
    const chapter = await this.prismaService.chapter.findUnique({
      where: {
        id: chapterId,
        novel: {
          isHidden: false
        }
      },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        text: true,
      }
    });

    if (!chapter) throw new NotFoundException();

    return chapter;
  }

  async findFirst(novelId: string) {
    const chapter = await this.prismaService.chapter.findFirst({
      where: {
        chapterNumber: 1,
        novel: {
          isHidden: false,
          id: novelId
        }
      },
      select: {
        id: true,
        chapterNumber: true
      }
    });

    return chapter;
  }

  async update(userId: string, novelId: string, chapterId: string, dto: UpdateChapterDto) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
        userId: userId,
      },
      select: {
        id: true,
        isHidden: true
      }
    });

    if (!novel || novel.isHidden) throw new NotFoundException();
    if (!novel) throw new ForbiddenException();


    const chapter = await this.prismaService.chapter.update({
      where: {
        id: chapterId
      },
      data: {
        ...dto
      }
    });

    if (!chapter) throw new NotFoundException();

    return { succes: true };
  }

  async delete(userId: string, novelId: string, chapterId: string) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
        userId: userId
      },
      select: {
        id: true,
        isHidden: true
      }
    });

    if (!novel || novel.isHidden) throw new NotFoundException();
    if (!novel) throw new ForbiddenException();

    const chapter = await this.prismaService.chapter.delete({
      where: {
        id: chapterId,
        novelId: novelId
      },
    });

    if (!chapter) throw new NotFoundException();

    return { succes: true }
  }
}
