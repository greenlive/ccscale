import { IsString, IsOptional, IsEmail, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type InquiryStatus = 'NEW' | 'READ' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED' | 'SPAM';
type TrafficSource = 'DIRECT' | 'ORGANIC_SEARCH' | 'PAID_SEARCH' | 'SOCIAL_ORGANIC' | 'SOCIAL_PAID' | 'REFERRAL' | 'EMAIL' | 'AI_SEARCH' | 'DISPLAY' | 'VIDEO' | 'OTHER';
type ReplyMethod = 'EMAIL' | 'WHATSAPP' | 'PHONE' | 'ALIBABA' | 'LINKEDIN' | 'OTHER';

export class CreateInquiryItemDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  productId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productNameEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productNameZh?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateInquiryDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;

  // 来源追踪字段
  @ApiPropertyOptional()
  @IsOptional()
  trafficSource?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  utmSource?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  utmMedium?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  utmCampaign?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  utmContent?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  utmTerm?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referrer?: string;

  @ApiPropertyOptional({ type: [CreateInquiryItemDto] })
  @IsArray()
  @IsOptional()
  items?: CreateInquiryItemDto[];
}

export class UpdateInquiryDto {
  @ApiPropertyOptional()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  // Phase 1 新增字段
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  repliedAt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  repliedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  replyMethod?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  closedReason?: string;
}

export class CreateActivityLogDto {
  @ApiProperty()
  @IsNumber()
  inquiryId: number;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  detail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  performedBy?: string;
}
