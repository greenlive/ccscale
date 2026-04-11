import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { CreateSiteSettingDto, UpdateSiteSettingDto, BulkUpdateSiteSettingDto } from './dto/site-setting.dto';

@ApiTags('site-settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all site settings' })
  @ApiResponse({ status: 200, description: 'Return all site settings as key-value pairs' })
  findAll() {
    return this.siteSettingsService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get site setting by key' })
  @ApiResponse({ status: 200, description: 'Return the site setting' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  findOne(@Param('key') key: string) {
    return this.siteSettingsService.findOne(key);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update a site setting' })
  @ApiResponse({ status: 201, description: 'Setting created/updated' })
  upsert(@Body() createSettingDto: CreateSiteSettingDto) {
    return this.siteSettingsService.upsert(createSettingDto);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update a site setting' })
  @ApiResponse({ status: 200, description: 'Setting updated' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  update(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSiteSettingDto,
  ) {
    return this.siteSettingsService.update(key, updateSettingDto);
  }

  @Put()
  @ApiOperation({ summary: 'Bulk update site settings' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  bulkUpdate(@Body() settings: BulkUpdateSiteSettingDto[]) {
    return this.siteSettingsService.bulkUpdate(settings);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a site setting' })
  @ApiResponse({ status: 200, description: 'Setting deleted' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  remove(@Param('key') key: string) {
    return this.siteSettingsService.remove(key);
  }
}
