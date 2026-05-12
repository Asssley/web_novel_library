import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RateDto } from './dto/rate.dto.js';

@Injectable()
export class NovelRateService {
  constructor(private readonly prismaService: PrismaService) { }

  async setRate(userId: string, novelId: string, dto: RateDto) {
    const rating = await this.prismaService.novelRate.upsert({
      where: {
        userId_novelId: {
          userId: userId,
          novelId: novelId
        }
      },
      create: {
        userId: userId,
        novelId: novelId,
        rate: dto.rate
      },
      update: {
        rate: dto.rate
      }
    });

    return { succes: true }
  }

  async getRate(novelId: string) {
    const rate = await this.prismaService.novelRate.aggregate({
      where: {
        novelId: novelId
      },
      _avg: {
        rate: true
      },
      _count: {
        userId: true
      }
    });

    return {
      rate: {
        avg: rate._avg ?? 0,
        count: rate._count.userId
      }
    }
  }
}
