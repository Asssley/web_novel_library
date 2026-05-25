import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import type { Response } from "express";

@Controller('api/auth')
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

}
