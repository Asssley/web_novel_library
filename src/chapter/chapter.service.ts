import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetChaptetrsQueryDto } from './dto/get-chapters-query.dto.js';
import { BookmarksService as BookmarkService } from '../bookmark/bookmark.service.js';
import { TranslationService } from '../translation/translation.service.js';
import { Lang } from '../generated/enums.js';
import { mapListPage } from '../common/mappers/chapter-list.mapper.js';
import { mapChapterPage } from '../common/mappers/chapter-details.mapper.js';

@Injectable()
export class ChapterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookmarkService: BookmarkService,
    private readonly translationService: TranslationService,
  ) { }

  async create(userId: string, novelId: string, dto: CreateChapterDto) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
      },
      select: {
        userId: true,
        language: true,
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

    await this.prismaService.novel.update({
      where: {
        id: novelId
      },
      data: {
        updatedAt: new Date()
      }
    });

    const targetLang = novel.language === 'ENGLISH' ? "UKRAINIAN" : "ENGLISH";

    const translatedText = await this.translationService.translate(dto.text, targetLang);
    const translatedTitle = await this.translationService.translate(dto.title, targetLang);

    await this.prismaService.chapterTranslation.create({
      data: {
        chapterId: chapter.id,
        title: translatedTitle,
        text: translatedText,
        language: targetLang
      }
    });

    return { succes: true }
  }

  async getAll(novelId: string, dto: GetChaptetrsQueryDto, lang: Lang) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 50;

    const skip = (page - 1) * limit;

    const [chapters, total] = await Promise.all([
      this.prismaService.chapter.findMany({
        where: {
          novelId: novelId,
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
          updatedAt: true,
          translations: {
            where: {
              language: lang
            },
            select: {
              title: true,
            }
          }
        }
      }),

      this.prismaService.chapter.count({
        where: {
          novelId: novelId,
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
    };
  }

  async getById(chapterId: string, lang: Lang) {
    const chapter = await this.prismaService.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        text: true,
        translations: {
          where: {
            language: lang
          },
          select: {
            title: true,
            text: true
          }
        },
        novel: {
          select: {
            id: true,
            title: true,
            translations: {
              where: {
                language: lang
              },
              select: {
                title: true,
              }
            }
          }
        }
      }
    });

    if (!chapter) throw new NotFoundException();

    return chapter;
  }

  async getIdByChapterNumber(novelId: string, chapterNumber: number) {
    const chapter = await this.prismaService.chapter.findFirst({
      where: {
        chapterNumber: chapterNumber,
        novel: {
          id: novelId,
        }
      },
      select: {
        id: true,
      }
    });

    return chapter?.id ?? null;
  }

  async findFirst(novelId: string, lang: Lang) {
    const chapter = await this.prismaService.chapter.findFirst({
      where: {
        chapterNumber: 1,
        novel: {
          id: novelId
        }
      },
      select: {
        id: true,
        chapterNumber: true,
        translations: {
          where: {
            language: lang
          },
          select: {
            title: true,
            text: true
          }
        }

      }
    });

    return chapter;
  }

  async getListPageData(
    novelId: string,
    dto: GetChaptetrsQueryDto,
    lang: Lang,
  ) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
      },
      select: {
        id: true,
        title: true,
        translations: {
          where: {
            language: lang,
          },
          select: {
            title: true,
          },
        },
      },
    });

    if (!novel) {
      throw new NotFoundException();
    }

    const chaptersData = await this.getAll(novelId, dto, lang);

    return mapListPage(novel, chaptersData);
  }

  async getChapterPageData(
    userId: string | null,
    novelId: string,
    chapterId: string,
    lang: Lang,
  ) {
    const chapter = await this.getById(chapterId, lang);

    const [prevChapterId, nextChapterId] = await Promise.all([
      this.getIdByChapterNumber(novelId, chapter.chapterNumber - 1),
      this.getIdByChapterNumber(novelId, chapter.chapterNumber + 1),
    ]);

    if (userId) {
      await this.bookmarkService.update(userId, novelId, chapterId);
    }


    const res = mapChapterPage({
      chapter,
      prevChapterId,
      nextChapterId,
    });

    return res;
  }

  async update(userId: string, novelId: string, chapterId: string, dto: UpdateChapterDto) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
        userId: userId,
      },
      select: {
        id: true,
        language: true
      }
    });

    if (!novel) throw new ForbiddenException();

    const chapter = await this.prismaService.chapter.update({
      where: {
        id: chapterId
      },
      data: {
        ...dto
      }
    });

    await this.prismaService.novel.update({
      where: {
        id: novelId
      },
      data: {
        updatedAt: new Date()
      }
    });

    const targetLang = novel.language === 'ENGLISH' ? "UKRAINIAN" : "ENGLISH";

    let data: any = {}

    if (dto.text) {
      const translatedText = await this.translationService.translate(dto.text, targetLang);
      data.text = translatedText;
    }
    if (dto.title) {
      const translatedTitle = await this.translationService.translate(dto.title, targetLang);
      data.title = translatedTitle;
    }

    await this.prismaService.chapterTranslation.upsert({
      where: {
        chapterId_language: {
          chapterId: chapter.id,
          language: targetLang
        }
      },
      update: {
        ...data
      },
      create: {
        chapterId: chapter.id,
        language: targetLang,
        ...data
      }
    });

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
      }
    });

    if (!novel) throw new ForbiddenException();

    const chapter = await this.prismaService.chapter.delete({
      where: {
        id: chapterId,
        novelId: novelId
      },
    });

    await this.prismaService.novel.update({
      where: {
        id: novelId
      },
      data: {
        updatedAt: new Date()
      }
    });

    return { succes: true }
  }

  async deleteLast(userId: string, novelId: string) {
    const novel = await this.prismaService.novel.findUnique({
      where: {
        id: novelId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!novel) throw new ForbiddenException();

    const lastChapter = await this.prismaService.chapter.findFirst({
      where: {
        novelId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    if (!lastChapter) throw new NotFoundException();

    await this.prismaService.chapter.delete({
      where: {
        id: lastChapter.id,
      },
    });

    await this.prismaService.novel.update({
      where: { id: novelId },
      data: { updatedAt: new Date() },
    });

    return { success: true };
  }
}
