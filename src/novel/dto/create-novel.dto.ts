import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Genre, Lang } from "../../generated/enums.js";
import { Transform } from "class-transformer";

export class CreateNovelDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  language!: Lang;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Genre, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value]
  )
  genres!: Genre[]
}
