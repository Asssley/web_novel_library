import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isDev } from '../common/utils/is-dev.util.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import type { CreateUserDto } from '../user/dto/create-user.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { Request, Response } from 'express';
import { comparePasswords, hashPassword } from '../common/utils/password.util.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) { }

  async register(res: Response, dto: CreateUserDto) {
    const hashedPassword = await hashPassword(dto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          nickname: dto.nickname,
          email: dto.email,
          password: hashedPassword
        }
      });

      this.auth(res, user.id)
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const target = err.meta?.target as string[] | undefined;

        if (target?.includes('email')) {
          throw new ConflictException('Email already exists');
        }

        if (target?.includes('nickname')) {
          throw new ConflictException('Nickname already exists');
        }

        throw new ConflictException('Unique constraint violation');
      }
      throw err;
    }
  }

  async login(res: Response, dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      },
      select: {
        id: true,
        password: true,
        role: true
      }
    });

    if (!user || !(await comparePasswords(dto.password, user.password))) {
      throw new UnauthorizedException();
    }

    this.auth(res, user.id);
  }

  async logout(res: Response) {
    res.clearCookie("access_token");
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies["access_token"];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id
        },
        select: {
          id: true
        }
      });

      if (!user) {
        throw new NotFoundException();
      }

      return this.auth(res, user.id);
    }
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        role: true
      }
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  private auth(res: Response, id: string) {
    const accessToken = this.generateToken(id);

    this.setCookie(res, accessToken);
  }

  private generateToken(id: string) {
    const payload: JwtPayload = { id };
    const accessToken = this.jwtService.sign(payload, { });

    return accessToken ;
  }

  private setCookie(res: Response, value: string) {
    res.cookie("access_token", value, {
      httpOnly: true,
      secure: !isDev(),
      sameSite: 'lax',
      path: "/"
    });
  }
}
