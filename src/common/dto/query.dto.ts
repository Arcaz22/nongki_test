import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../utils/constants';

export class QueryDTO {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = DEFAULT_PAGE;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = DEFAULT_LIMIT;
}
