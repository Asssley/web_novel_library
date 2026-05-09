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

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const hashedPassword = await hashPassword(dto.password);

    const user = await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        password: hashedPassword
      }
    });

    return { succes: true };
  }

  async updateEmail(id: string, dto: UpdateEmailDto) {
    const email = dto.email;

    const user = await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        email
      }
    });

    return { succes: true };
  }

  async getProfileData(id: string) {
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

    if (!user) throw new NotFoundException();

    return user;
  }

}

