import { ArrayNotEmpty, Equals, IsArray, IsEnum, IsNumber, IsString, Min } from "class-validator";
import { Genre, Lang } from "../../generated/enums.js";
import { Transform } from "class-transformer";

export class GetNovelsQueryDto {
  @IsNumber()
  @Min(1)
  page?: number;

  @IsNumber()
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

  @IsString()
  @IsEnum(Lang)
  language?: Lang;
}