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

    const user = await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        password: hashedPassword
      }
    });
    return user.id;
  }

  async updateEmail(id: string, dto: UpdateEmailDto): Promise<string> {
    const email = dto.email;

    const user = await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        email
      }
    });

    return user.id;
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

    if (!user) throw new NotFoundException();

    return user;
  }

}

