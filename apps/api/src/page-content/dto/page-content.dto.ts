import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePageContentDto {
  @ApiProperty({ description: 'Unique page identifier (e.g., about, guarantee, contact)' })
  @IsString()
  pageKey: string;

  @ApiProperty({ description: 'Title in English' })
  @IsString()
  titleEn: string;

  @ApiProperty({ description: 'Title in Chinese' })
  @IsString()
  titleZh: string;

  @ApiPropertyOptional({ description: 'Content in English (HTML allowed)' })
  @IsOptional()
  @IsString()
  contentEn?: string;

  @ApiPropertyOptional({ description: 'Content in Chinese (HTML allowed)' })
  @IsOptional()
  @IsString()
  contentZh?: string;

  @ApiPropertyOptional({ description: 'Meta description in English' })
  @IsOptional()
  @IsString()
  metaEn?: string;

  @ApiPropertyOptional({ description: 'Meta description in Chinese' })
  @IsOptional()
  @IsString()
  metaZh?: string;
}

export class UpdatePageContentDto {
  @ApiPropertyOptional({ description: 'Title in English' })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({ description: 'Title in Chinese' })
  @IsOptional()
  @IsString()
  titleZh?: string;

  @ApiPropertyOptional({ description: 'Content in English (HTML allowed)' })
  @IsOptional()
  @IsString()
  contentEn?: string;

  @ApiPropertyOptional({ description: 'Content in Chinese (HTML allowed)' })
  @IsOptional()
  @IsString()
  contentZh?: string;

  @ApiPropertyOptional({ description: 'Meta description in English' })
  @IsOptional()
  @IsString()
  metaEn?: string;

  @ApiPropertyOptional({ description: 'Meta description in Chinese' })
  @IsOptional()
  @IsString()
  metaZh?: string;
}