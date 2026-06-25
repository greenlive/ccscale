import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductSortBy {
  NAME_EN = 'nameEn',
  NAME_ZH = 'nameZh',
  PRICE_MIN = 'priceMin',
  PRICE_MAX = 'priceMax',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ORDER = 'order',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ListProductsQueryDto {
  @ApiPropertyOptional({ default: 'en' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ enum: ProductSortBy, default: ProductSortBy.ORDER })
  @IsEnum(ProductSortBy, { message: 'sortBy must be one of: ' + Object.values(ProductSortBy).join(', ') })
  @IsOptional()
  sortBy?: ProductSortBy;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}