import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNovelDto } from './dto/create-novel.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as path from "path";
import * as fs from "fs";
import { v4 as uuid } from 'uuid';
import { NovelInfo } from './interfaces/novel-info.interface.js';
import { GetNovelsQueryDto } from './dto/get-novels-query.dto.js';
import { NovelRateService } from '../novel-rate/novel-rate.service.js';
import { BookmarksService } from '../bookmarks/bookmarks.service.js';
import { ChapterService } from '../chapter/chapter.service.js';
import { SavedService } from '../saved/saved.service.js';
import { GetUserNovelsDto } from './dto/get-user-novels.dto.js';
import { GetChaptetrsQueryDto } from '../chapter/dto/get-chapters-query.dto.js';


@Injectable()
export class NovelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rateService: NovelRateService,
    private readonly bookmarksService: BookmarksService,
    private readonly chapterService: ChapterService,
    private readonly SavedService: SavedService,
    // TODO: private readonly commentService: CommentService,
  ) { }
  async create(
    userId: string,
    file: Express.Multer.File,
    dto: CreateNovelDto,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        canAddNovel: false
      }
    });

    if (user) throw new ForbiddenException();

    const imagePath = await this.saveImage(file);
    const genres = [...new Set(dto.genres ?? [])];

    try {
      const novel = await this.prismaService.novel.create({
        data: {
          title: dto.title,
          description: dto.description,
          language: dto.language,
          imagePath,
          userId,

          genres: {
            create: genres?.map((genre) => ({
              genre,
            })) || [],
          },
        },
      });

      return { id: novel.id };
    } catch (err) {
      this.deleteImage(imagePath);
      throw err;
    }
  }

  async getById(novelId: string) {
    const result = await this.prismaService.novel.findFirst({
      where: {
        id: novelId,
        isHidden: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imagePath: true,
        language: true,
        genres: {
          select: {
            genre: true,
          },
        },
        user: {
          select: {
            nickname: true
          }
        }
      },
    });

    if (!result) throw new NotFoundException();

    const novel: NovelInfo = {
      ...result,
      genres: result.genres.map((g) => g.genre),

    };

    return novel;
  }

  async getFullNovelInfo(userId: string | null, novelId: string) {
    const novel = await this.getById(novelId);
    const novelRate = await this.rateService.getRate(novel.id);
    let lastChapterId: string | null = null;
    let hasReadedBefore = false;
    let isSaved = false;

    try {
      const bookmark = await this.bookmarksService.getBookmark(userId ?? "", novel.id);
      lastChapterId = bookmark.id;
    } catch (err) {
      if (err instanceof HttpException && err.getStatus() === 500) {
        throw err;
      }

      const firstChapter = await this.chapterService.findFirst(novel.id);
      lastChapterId = firstChapter?.id ?? null;
      hasReadedBefore = (firstChapter?.chapterNumber! ?? 0) > 1;
    }

    isSaved = await this.SavedService.checkIfSaved(userId ?? "", novel.id);

    return {
      ...novel,
      novelRate,
      lastChapterId,
      isSaved,
      hasReadedBefore
    };
  }

  async getList(dto: GetNovelsQueryDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const skip = (page - 1) * limit;

    const sortBy = dto.sortBy ?? 'rates';
    const order = dto.order ?? 'desc';

    const where: any = {
      isHidden: false,
    };

    // search
    if (dto.search) {
      where.title = {
        contains: dto.search,
        mode: 'insensitive',
      };
    }

    // genres
    if (dto.genres?.length) {
      where.AND = dto.genres.map(genre => ({
        genres: {
          some: {
            genre: genre,
          },
        },
      }));
    }

    // sorting
    let orderBy: any = {};

    if (sortBy === "rates") {
      orderBy = {
        avgRate: order,
      };
    } else {
      orderBy = {
        [sortBy]: order,
      };
    }

    const [novels, total] = await Promise.all([
      this.prismaService.novel.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          imagePath: true,
          title: true,
        }
      }),

      this.prismaService.novel.count({ where }),
    ]);

    return {
      novels: novels.map(n => ({
        ...n,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: dto,
    };
  }

  async getUserNovels(
    userId: string,
    dto: GetUserNovelsDto,
  ) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const skip = (page - 1) * limit;

    const where = {
      userId,
      isHidden: false,
    };

    const [novels, total] = await Promise.all([
      this.prismaService.novel.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },

        select: {
          id: true,
          title: true,
          imagePath: true,

          _count: {
            select: {
              chapters: true,
              rates: true,
            },
          },

          rates: {
            select: {
              rate: true,
            },
          },
        },
      }),

      this.prismaService.novel.count({
        where,
      }),
    ]);


    return {
      novels: novels.map(novel => {
        const count = novel.rates.length;

        const average =
          count > 0
            ? novel.rates.reduce((sum, r) => sum + r.rate, 0) / count
            : 0;

        return {
          id: novel.id,
          title: novel.title,
          imagePath: novel.imagePath,

          chaptersCount: novel._count.chapters,

          rating: {
            average: Number(average.toFixed(2)),
            count: novel._count.rates,
          },
        };
      }),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      filters: dto,
    };
  }

  async getNovelForManage(novelId: string, dto: GetChaptetrsQueryDto) {
    const novel = await this.prismaService.novel.findFirst({
      where: {
        id: novelId,
        isHidden: false,
      },
      select: {
        id: true,
        title: true,
        imagePath: true,
      },
    });

    if (!novel) {
      throw new NotFoundException();
    }

    const chapters = await this.chapterService.getAll(novelId, dto);

    return {
      novel,
      ...chapters,
    };
  }

  getPopular(limit = 5) {
    return this.getList({
      limit,
      sortBy: 'rates',
      order: 'desc',
    });
  }

  getLatest(limit = 5) {
    return this.getList({
      limit,
      sortBy: 'createdAt',
      order: 'desc',
    });
  }

  getRecentlyUpdated(limit = 5) {
    return this.getList({
      limit,
      sortBy: 'updatedAt',
      order: 'desc',
    });
  }

  async update(
    userId: string,
    novelId: string,
    file: Express.Multer.File | undefined,
    dto: CreateNovelDto
  ) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        canAddNovel: false,
      },
    });

    if (user) throw new ForbiddenException();

    const existingNovel = await this.prismaService.novel.findFirst({
      where: {
        id: novelId,
        userId,
        isHidden: false,
      },
    });

    if (!existingNovel) {
      throw new NotFoundException();
    }

    const oldImage = existingNovel.imagePath;

    let imagePath = oldImage;

    if (file) {
      imagePath = await this.saveImage(file);
    }

    const updated = await this.prismaService.novel.update({
      where: { id: novelId },
      data: {
        title: dto.title,
        description: dto.description,
        language: dto.language,
        imagePath,
        genres: {
          deleteMany: {},
          create: dto.genres.map(g => ({ genre: g })),
        },
      },
    });

    if (file && oldImage) {
      await this.deleteImage(oldImage);
    }

    return { id: updated.id };
  }

  async deleteById(userId: string, novelId: string) {
    const novel = await this.prismaService.novel.delete({
      where: {
        id: novelId,
        userId: userId
      }
    });

    if (!novel) throw new NotFoundException();

    this.deleteImage(novel.imagePath);

    return { succes: true };
  }

  private async saveImage(
    image: Express.Multer.File
  ): Promise<string> {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'public', 'images', 'uploads');

    const extension = path.extname(image.originalname);

    const fileName = `${uuid()}${extension}`;

    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, image.buffer);

    return fileName;
  }

  private async deleteImage(fileName: string): Promise<void> {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'public', 'images', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if ((err as any).code !== 'ENOENT') {
        throw err;
      }
    }
  }
}
