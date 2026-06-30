import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { CreateSiteSettingDto, UpdateSiteSettingDto, BulkUpdateSiteSettingDto, BulkUpdateSiteSettingsPayload } from './dto/site-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update a site setting' })
  @ApiResponse({ status: 201, description: 'Setting created/updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  upsert(@Body() createSettingDto: CreateSiteSettingDto) {
    return this.siteSettingsService.upsert(createSettingDto);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a site setting' })
  @ApiResponse({ status: 200, description: 'Setting updated' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSiteSettingDto,
  ) {
    return this.siteSettingsService.update(key, updateSettingDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update site settings' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  bulkUpdate(@Body() payload: BulkUpdateSiteSettingsPayload) {
    return this.siteSettingsService.bulkUpdate(payload.settings);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a site setting' })
  @ApiResponse({ status: 200, description: 'Setting deleted' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('key') key: string) {
    return this.siteSettingsService.remove(key);
  }
}
