import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class GetCommentsQueryDto {
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;
}