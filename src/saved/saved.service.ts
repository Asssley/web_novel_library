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
    const limit = dto.limit ?? 20;

    const skip = (page - 1) * limit;

    const sortBy = dto.sortBy ?? 'rates';
    const order = dto.order ?? 'asc';

    const where: any = {
      userId: userId,
      novel: {
        is: {
          isHidden: false
        }
      }
    };

    // sorting
    let orderBy: any = {};

    if (sortBy === "rates") {
      orderBy = {
        novel: {
          weightedRate: order
        }
      }
    } else {
      orderBy = {
        novel: {
          [sortBy]: order,
        }
      };
    }


    const [novels, total] = await Promise.all([
      this.prismaService.savedNovels.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          novel: {
            select: {
              id: true,
              imagePath: true,
              title: true,
            }
          }
        }
      }),

      this.prismaService.savedNovels.count({ where }),
    ]);

    return {
      novels: novels.map(n => n.novel),
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

  async checkIfSaved(userId: string, novelId: string) {
    const saved = await this.prismaService.savedNovels.count({
      where: {
        userId: userId,
        novelId: novelId
      }
    });

    return saved !== 0;
  }
}
