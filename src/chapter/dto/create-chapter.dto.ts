import { IsNotEmpty, IsString } from "class-validator";

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;
}
