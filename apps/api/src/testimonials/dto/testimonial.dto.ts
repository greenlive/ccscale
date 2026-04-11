import { IsString, IsOptional, IsNumber, IsBoolean, IsUrl, Min, Max, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ description: 'Customer name in English' })
  @IsString()
  nameEn: string;

  @ApiProperty({ description: 'Customer name in Chinese' })
  @IsString()
  nameZh: string;

  @ApiPropertyOptional({ description: 'Company name in English' })
  @IsString()
  @IsOptional()
  companyEn?: string;

  @ApiPropertyOptional({ description: 'Company name in Chinese' })
  @IsString()
  @IsOptional()
  companyZh?: string;

  @ApiPropertyOptional({ description: 'Country in English' })
  @IsString()
  @IsOptional()
  countryEn?: string;

  @ApiPropertyOptional({ description: 'Country in Chinese' })
  @IsString()
  @IsOptional()
  countryZh?: string;

  @ApiPropertyOptional({ description: 'Avatar image URL' })
  @ValidateIf((o) => o.avatarUrl !== undefined && o.avatarUrl !== null && o.avatarUrl !== '')
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ description: 'Testimonial content in English' })
  @IsString()
  contentEn: string;

  @ApiProperty({ description: 'Testimonial content in Chinese' })
  @IsString()
  contentZh: string;

  @ApiPropertyOptional({ description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Is active/visible' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTestimonialDto {
  @ApiPropertyOptional({ description: 'Customer name in English' })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Customer name in Chinese' })
  @IsString()
  @IsOptional()
  nameZh?: string;

  @ApiPropertyOptional({ description: 'Company name in English' })
  @IsString()
  @IsOptional()
  companyEn?: string;

  @ApiPropertyOptional({ description: 'Company name in Chinese' })
  @IsString()
  @IsOptional()
  companyZh?: string;

  @ApiPropertyOptional({ description: 'Country in English' })
  @IsString()
  @IsOptional()
  countryEn?: string;

  @ApiPropertyOptional({ description: 'Country in Chinese' })
  @IsString()
  @IsOptional()
  countryZh?: string;

  @ApiPropertyOptional({ description: 'Avatar image URL' })
  @ValidateIf((o) => o.avatarUrl !== undefined && o.avatarUrl !== null && o.avatarUrl !== '')
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Testimonial content in English' })
  @IsString()
  @IsOptional()
  contentEn?: string;

  @ApiPropertyOptional({ description: 'Testimonial content in Chinese' })
  @IsString()
  @IsOptional()
  contentZh?: string;

  @ApiPropertyOptional({ description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Is active/visible' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
