import { IsString, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ description: 'Client name in English' })
  @IsString()
  nameEn: string;

  @ApiProperty({ description: 'Client name in Chinese' })
  @IsString()
  nameZh: string;

  @ApiProperty({ description: 'Client logo URL' })
  @IsUrl()
  logoUrl: string;

  @ApiPropertyOptional({ description: 'Client website URL' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Is active/visible' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateClientDto {
  @ApiPropertyOptional({ description: 'Client name in English' })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Client name in Chinese' })
  @IsString()
  @IsOptional()
  nameZh?: string;

  @ApiPropertyOptional({ description: 'Client logo URL' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Client website URL' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Is active/visible' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
