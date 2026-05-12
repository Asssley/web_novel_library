import { ArrayNotEmpty, Equals, IsArray, IsEnum, IsInt, IsString, Min } from "class-validator";
import { Genre } from "../../generated/enums.js";
import { Transform } from "class-transformer";

export class GetNovelsQueryDto {
  @IsInt()
  @Min(1)
  page?: number;

  @IsInt()
  @Min(1)
  limit?: number;

  @IsString()
  search?: string;

  @IsString()
  @Equals(['title', 'rating', 'updatedAt', 'createdAt'])
  sortBy?: 'title' | 'rating' | 'updatedAt' | 'createdAt';

  @IsString()
  @Equals(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Genre, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value]
  )
  genres?: Genre[];
}