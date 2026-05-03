import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserProfile } from './dto/profile-user.dto.js';
import { UpdateEmailDto } from './dto/update-email.dto.js';
import { hashPassword } from '../common/utils/password.util.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<string> {
    const hashedPassword = await hashPassword(dto.password);

    try {
      const user = await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          password: hashedPassword
        }
      });
      return user.id;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw err;
    }
  }

  async updateEmail(id: string, dto: UpdateEmailDto): Promise<string> {
    const email = dto.email;

    try {
      const user = await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          email
        }
      });

      return user.id;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const target = err.meta?.target as string[] | undefined;

        if (target?.includes('email')) {
          throw new ConflictException('Email already exists');
        }

        throw new ConflictException('Unique constraint violation');
      }
      throw err;
    }
  }

  async getProfileData(id: string): Promise<UserProfile> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      },
      select: {
        nickname: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

}

