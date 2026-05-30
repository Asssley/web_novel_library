import { Type } from "class-transformer";
import { IsBoolean } from "class-validator";

export class UpdateCommentRateDto {
  
  @Type(() => Boolean)
  @IsBoolean()
  rate!: boolean
}
