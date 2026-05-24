import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RateDto } from './dto/rate.dto.js';

@Injectable()
export class NovelRateService {
  constructor(private readonly prismaService: PrismaService) { }

  async setRate(userId: string, novelId: string, dto: RateDto) {
    await this.prismaService.novelRate.upsert({
      where: {
        userId_novelId: {
          userId,
          novelId,
        },
      },
      create: {
        userId,
        novelId,
        rate: dto.rate,
      },
      update: {
        rate: dto.rate,
      },
    });

    const stats = await this.prismaService.novelRate.aggregate({
      where: {
        novelId,
      },
      _avg: {
        rate: true,
      },
      _count: {
        rate: true,
      },
    });

    const averageRate = stats._avg.rate || 0;
    const ratingsCount = stats._count.rate || 0;

    const globalStats = await this.prismaService.novelRate.aggregate({
      _avg: {
        rate: true,
      },
    });

    const globalAverage = globalStats._avg.rate || 0;

    const minVotes = 10;

    const weightedRate =
      (ratingsCount / (ratingsCount + minVotes)) * averageRate +
      (minVotes / (ratingsCount + minVotes)) * globalAverage;

    await this.prismaService.novel.update({
      where: {
        id: novelId,
      },
      data: {
        weightedRate,
      },
    });

    return { success: true };
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
