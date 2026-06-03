import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';

export enum UserRoleFilter {
  ALL = 'ALL',
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum UserStatusFilter {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMMENT_BLOCKED = 'COMMENT_BLOCKED',
  NOVEL_BLOCKED = 'NOVEL_BLOCKED',
  FULL_BLOCKED = 'FULL_BLOCKED',
}

export class GetUsersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRoleFilter)
  role?: UserRoleFilter;

  @IsOptional()
  @IsEnum(UserStatusFilter)
  status?: UserStatusFilter;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;
}