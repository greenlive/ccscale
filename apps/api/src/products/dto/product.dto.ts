import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ImageType {
  MAIN = 'MAIN',
  DETAIL = 'DETAIL',
}

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

export class ProductImageDto {
  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional()
  @IsEnum(ImageType)
  @IsOptional()
  type?: ImageType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  altEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  altZh?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
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
  mainImages?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  detailImages?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  videos?: string;

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoTitleEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoTitleZh?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoDescEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoDescZh?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoKeywordsEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoKeywordsZh?: string;

  // B2B 核心卖点（JSON数组字符串）
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coreSellingPointsEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coreSellingPointsZh?: string;

  // B2B 应用场景
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  applicationScenariosEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  applicationScenariosZh?: string;

  // B2B FAQ（JSON数组字符串）
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  faqEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  faqZh?: string;

  // B2B 认证（JSON数组字符串）
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  certifications?: string;

  // B2B 贸易信息
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  hsCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingTerms?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  warrantyInfo?: string;

  // B2B 包装信息
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  packagingInfoEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  packagingInfoZh?: string;

  // B2B 工厂信息
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  manufacturerName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  factoryLocation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productionCapacity?: string;

  @ApiPropertyOptional({ type: [ProductSpecDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecDto)
  @IsOptional()
  specs?: ProductSpecDto[];

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  images?: ProductImageDto[];
}

export class UpdateProductDto extends CreateProductDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;
}
