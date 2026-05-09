import { IsString, IsUUID } from "class-validator";

export class CreateSavedDto {
  @IsString()
  @IsUUID() 
  novelId!: string;
}