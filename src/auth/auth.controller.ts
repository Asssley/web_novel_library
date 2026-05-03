import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from "express";
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.register(res, dto);

    return { success: true };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(res, dto);

    return { success: true };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);

    return { succes: true }
  }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("no", 'Useer', "USER", "ds")
  @Post('me')
  async me(@Req() req) {
    return req.user;
  }
}
