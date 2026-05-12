import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSavedDto } from './dto/create-saved.dto.js';
import { GetSavedNovelsQueryDto } from './dto/get-saved-novels-query.dto.js';

@Injectable()
export class SavedService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(userId: string, dto: CreateSavedDto) {
    const novel = this.prismaService.novel.findUnique({
      where: {
        id: dto.novelId,
        isHidden: false
      },
      select: {
        id: true
      }
    });

    if (!novel) throw new NotFoundException();

    const savedNovel = await this.prismaService.savedNovels.create({
      data: {
        userId: userId,
        novelId: dto.novelId
      }
    });

    return { succes: true }
  }

  async getSavedList(userId: string, dto: GetSavedNovelsQueryDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const skip = (page - 1) * limit;

    const sortBy = dto.sortBy ?? 'title';
    const order = dto.order ?? 'asc';

    const where: any = {
      isHidden: false,
      userId: userId
    };

    // sorting
    let orderBy: any = {};

    if (sortBy === 'rating') {
      orderBy = [
        {
          novelRates: {
            _count: 'desc',
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

  async remove(userId: string, novelId: string) {
    const sacedNovel = await this.prismaService.savedNovels.delete({
      where: {
        novelId_userId: {
          novelId,
          userId,
        },
      },
    });

    if (!sacedNovel) throw new NotFoundException();

    return { succes: true }
  }
}
