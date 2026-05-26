import { ArrayNotEmpty, IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Genre } from "../../generated/enums.js";
import { Transform, Type } from "class-transformer";

export class GetNovelsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['rates', 'updatedAt', 'createdAt'])
  sortBy?: 'rates' | 'updatedAt' | 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Genre, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value]
  )
  genres?: Genre[];
}