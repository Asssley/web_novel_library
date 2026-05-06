import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNovelDto } from './dto/create-novel.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as path from "path";
import * as fs from "fs";
import { v4 as uuid } from 'uuid';
import { NovelInfo } from './interfaces/novel-info.interface.js';


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

    const imagePath = this.saveImage(file);
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

    return { data: { novel: result } };
  }

  async deleteById(userId: string, novelId: string) {
    const novel = await this.prismaService.novel.delete({
      where: {
        id: novelId,
        userId: userId
      }
    });

    if (!novel) throw new NotFoundException();

    return { succes: true };
  }

  private saveImage(
    image: Express.Multer.File,
    imageName?: string,
  ): string {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');

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
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
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
