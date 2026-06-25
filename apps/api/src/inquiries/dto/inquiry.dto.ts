import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsNumber,
  IsIn,
  MaxLength,
  Min,
  Max,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const INQUIRY_STATUSES = ['NEW', 'READ', 'IN_PROGRESS', 'REPLIED', 'CLOSED', 'SPAM'] as const;
export const TRAFFIC_SOURCES = [
  'DIRECT',
  'ORGANIC_SEARCH',
  'PAID_SEARCH',
  'SOCIAL_ORGANIC',
  'SOCIAL_PAID',
  'REFERRAL',
  'EMAIL',
  'AI_SEARCH',
  'DISPLAY',
  'VIDEO',
  'OTHER',
] as const;
export const REPLY_METHODS = ['EMAIL', 'WHATSAPP', 'PHONE', 'ALIBABA', 'LINKEDIN', 'OTHER'] as const;

export class CreateInquiryItemDto {
  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  productId?: number;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  productNameEn?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  productNameZh?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 1_000_000 })
  @IsNumber()
  @Min(1)
  @Max(1_000_000)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}

export class CreateInquiryDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ maxLength: 200 })
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiPropertyOptional({ maxLength: 30 })
  @IsString()
  @MaxLength(30)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ maxLength: 30 })
  @IsString()
  @MaxLength(30)
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ maxLength: 80 })
  @IsString()
  @MaxLength(80)
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ maxLength: 80 })
  @IsString()
  @MaxLength(80)
  @IsOptional()
  city?: string;

  @ApiProperty({ minLength: 5, maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional({ maxLength: 60 })
  @IsString()
  @MaxLength(60)
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ enum: TRAFFIC_SOURCES })
  @IsOptional()
  @IsIn(TRAFFIC_SOURCES as readonly string[])
  trafficSource?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  utmSource?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  utmMedium?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  utmCampaign?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  utmContent?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  utmTerm?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  referrer?: string;

  @ApiPropertyOptional({ maxLength: 2000, description: 'Cloudflare Turnstile token (recommended in production)' })
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  turnstileToken?: string;

  @ApiPropertyOptional({ type: [CreateInquiryItemDto], maxItems: 50 })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateInquiryItemDto)
  @IsOptional()
  items?: CreateInquiryItemDto[];
}

export class UpdateInquiryDto {
  @ApiPropertyOptional({ enum: INQUIRY_STATUSES })
  @IsOptional()
  @IsIn(INQUIRY_STATUSES as readonly string[])
  status?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  repliedAt?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  repliedBy?: string;

  @ApiPropertyOptional({ enum: REPLY_METHODS })
  @IsOptional()
  @IsIn(REPLY_METHODS as readonly string[])
  replyMethod?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  closedReason?: string;
}

export class CreateActivityLogDto {
  @ApiProperty()
  @IsNumber()
  inquiryId: number;

  @ApiProperty({ maxLength: 60 })
  @IsString()
  @MaxLength(60)
  action: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  detail?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  performedBy?: string;
}

// List query DTO for paginated endpoints (inquiries, products, etc.)
export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
