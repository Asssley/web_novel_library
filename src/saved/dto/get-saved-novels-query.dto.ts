import { Equals, IsNumber, IsString, Min } from "class-validator";

export class GetSavedNovelsQueryDto {
  @IsNumber()
  @Min(1)
  page?: number;

  @IsNumber()
  @Min(1)
  limit?: number;

  @IsString()
  @Equals(['title', 'rating', 'updatedAt', 'createdAt'])
  sortBy?: 'title' | 'rating' | 'updatedAt' | 'createdAt';

  @IsString()
  @Equals(['asc', 'desc'])
  order?: 'asc' | 'desc';
}