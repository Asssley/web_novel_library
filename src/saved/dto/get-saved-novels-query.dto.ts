import { Equals, IsInt, IsString, Min } from "class-validator";

export class GetSavedNovelsQueryDto {
  @IsInt()
  @Min(1)
  page?: number;

  @IsInt()
  @Min(1)
  limit?: number;

  @IsString()
  @Equals(['title', 'rating', 'updatedAt', 'createdAt'])
  sortBy?: 'title' | 'rating' | 'updatedAt' | 'createdAt';

  @IsString()
  @Equals(['asc', 'desc'])
  order?: 'asc' | 'desc';
}