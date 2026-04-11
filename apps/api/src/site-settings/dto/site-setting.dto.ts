import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSiteSettingDto {
  @ApiProperty({ description: 'Setting key' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ description: 'Setting value' })
  @IsString()
  @IsOptional()
  value?: string;
}

export class UpdateSiteSettingDto {
  @ApiPropertyOptional({ description: 'Setting value' })
  @IsString()
  @IsOptional()
  value?: string;
}

export class BulkUpdateSiteSettingDto {
  @ApiProperty({ description: 'Setting key' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Setting value' })
  @IsString()
  value: string;
}
