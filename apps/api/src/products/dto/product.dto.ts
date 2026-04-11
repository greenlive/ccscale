import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSpecDto {
  @ApiProperty()
  @IsString()
  keyEn: string;

  @ApiProperty()
  @IsString()
  keyZh: string;

  @ApiProperty()
  @IsString()
  valueEn: string;

  @ApiProperty()
  @IsString()
  valueZh: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsString()
  nameZh: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descriptionZh?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shortDescEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shortDescZh?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceMin?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceMax?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  moq?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  leadTime?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [ProductSpecDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecDto)
  @IsOptional()
  specs?: ProductSpecDto[];
}

export class UpdateProductDto extends CreateProductDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;
}
