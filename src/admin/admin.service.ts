import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetUsersQueryDto, UserStatusFilter } from './dto/get-users-for-admin-query.dto.js';
import { Role } from '../generated/enums.js';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async getUsers(dto: GetUsersQueryDto) {
    const page = dto.page ?? 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const order = dto.order ?? 'asc';

    const where: any = {};

    if (dto.search) {
      where.OR = [
        {
          nickname: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (dto.role && dto.role !== 'ALL') {
      where.role = dto.role;
    }

    if (dto.status && dto.status !== 'ALL') {
      switch (dto.status) {
        case 'ACTIVE':
          where.canComment = true;
          where.canAddNovel = true;
          break;

        case 'COMMENT_BLOCKED':
          where.canComment = false;
          break;

        case 'NOVEL_BLOCKED':
          where.canAddNovel = false;
          break;

        case 'FULL_BLOCKED':
          where.canComment = false;
          where.canAddNovel = false;
          break;
      }
    }

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          nickname: order,
        },
        select: {
          id: true,
          role: true,
          nickname: true,
          email: true,
          canAddNovel: true,
          canComment: true,
          createdAt: true,
        },
      }),

      this.prismaService.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: dto ?? {},
    };
  }

  async toggleComment(role: Role, userId: string) {
    const user = await this.getUserOrThrow(userId);

    if (user.role === role) {
      throw new ForbiddenException('Cannot modify same role');
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        canComment: !user.canComment,
      },
    });
  }

  async toggleNovelPermission(role: Role, userId: string) {
    const user = await this.getUserOrThrow(userId);

    if (user.role === 'SUPERADMIN') {
      throw new ForbiddenException('Cannot modify SUPERADMIN');
    }

    if (user.role === role) {
      throw new ForbiddenException('Cannot modify same role');
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        canAddNovel: !user.canAddNovel,
      },
    });
  }

  async toggleRole(role: Role, userId: string) {
    const user = await this.getUserOrThrow(userId);

    if (user.role === 'SUPERADMIN') {
      throw new ForbiddenException('Cannot modify SUPERADMIN');
    }

    if (user.role === role) {
      throw new ForbiddenException('Cannot modify same role');
    }

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        role: newRole,
      },
    });
  }

  private async getUserOrThrow(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        canAddNovel: true,
        canComment: true,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }
}