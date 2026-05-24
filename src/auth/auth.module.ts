import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController as AuthControllerApi } from './api/auth.controller.js';
import { AuthController as AuthControllerView } from './view/auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../config/jwt.config.js';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  controllers: [AuthControllerApi, AuthControllerView],
  providers: [AuthService, JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig
    })
  ],
})
export class AuthModule { }
