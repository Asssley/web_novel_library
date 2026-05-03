import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserProfile } from './dto/profile-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { comparePasswords, hashPassword } from '../common/utils/password.util';
import { Prisma } from '../generated/prisma/client';

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
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
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
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException();
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

