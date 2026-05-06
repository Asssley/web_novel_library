import { IsString, IsUUID } from "class-validator";

export class NovelIdDto {
  @IsString()
  @IsUUID()
  novelId!: string;
}