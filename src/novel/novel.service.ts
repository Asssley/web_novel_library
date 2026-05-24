import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNovelDto } from './dto/create-novel.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as path from "path";
import * as fs from "fs";
import { v4 as uuid } from 'uuid';
import { NovelInfo } from './interfaces/novel-info.interface.js';
import { GetNovelsQueryDto } from './dto/get-novels-query.dto.js';


@Injectable()
export class NovelService {
  constructor(private readonly prismaService: PrismaService) { }

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

      return { data: { id: novel.id } };
    } catch (err) {
      this.deleteImage(imagePath);
      throw err;
    }
  }

  async getById(novelId: string) {
    const novel = await this.prismaService.novel.findFirst({
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
      },
    });

    if (!novel) throw new NotFoundException();

    const result: NovelInfo = {
      ...novel,
      genres: novel.genres.map((g) => g.genre),

    };

    return { novel: result };
  }

  async getList(dto: GetNovelsQueryDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const skip = (page - 1) * limit;

    const sortBy = dto.sortBy ?? 'title';
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

    if (sortBy === 'rating') {
      orderBy = [
        {
          rates: {
            weightedRate: order,
          },
        },
      ]
    } else if (sortBy === 'updatedAt') {
      orderBy = {
        chapters: {
          _count: order,
        },
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

  getPopular(limit = 5) {
    return this.getList({
      limit,
      sortBy: 'rating',
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

  async updateImage(
    userId: string,
    novelId: string,
    file: Express.Multer.File,
  ) {
    const novel = await this.prismaService.novel.findFirst({
      where: {
        id: novelId
      }
    });

    if (!novel) throw new NotFoundException();

    if (novel.userId !== userId) throw new ForbiddenException();

    this.saveImage(file, novel.imagePath);

    return { succes: true };
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
    image: Express.Multer.File,
    imageName?: string,
  ): Promise<string> {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'public', 'images', 'uploads');

    const extension = path.extname(image.originalname);

    const fileName = imageName ?? `${uuid()}${extension}`;

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
