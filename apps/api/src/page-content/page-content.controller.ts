import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PageContentService } from './page-content.service';
import { CreatePageContentDto, UpdatePageContentDto } from './dto/page-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('page-content')
@Controller('page-content')
export class PageContentController {
  constructor(private readonly pageContentService: PageContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all page contents' })
  @ApiResponse({ status: 200, description: 'Return all page contents' })
  findAll() {
    return this.pageContentService.findAll();
  }

  @Get(':pageKey')
  @ApiOperation({ summary: 'Get page content by page key' })
  @ApiQuery({ name: 'keys', required: false, description: 'Comma-separated page keys to fetch multiple' })
  @ApiResponse({ status: 200, description: 'Return the page content' })
  @ApiResponse({ status: 404, description: 'Page content not found' })
  async findOne(
    @Param('pageKey') pageKey: string,
    @Query('keys') keys?: string,
  ) {
    if (keys) {
      const pageKeys = keys.split(',').map(k => k.trim());
      return this.pageContentService.findByKeys(pageKeys);
    }
    return this.pageContentService.findByKey(pageKey);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create page content' })
  @ApiResponse({ status: 201, description: 'Page content created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Page content already exists' })
  create(@Body() createDto: CreatePageContentDto) {
    return this.pageContentService.create(createDto);
  }

  @Post('upsert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update page content (upsert)' })
  @ApiResponse({ status: 200, description: 'Page content upserted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  upsert(@Body() createDto: CreatePageContentDto) {
    return this.pageContentService.upsert(createDto);
  }

  @Put(':pageKey')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update page content' })
  @ApiResponse({ status: 200, description: 'Page content updated' })
  @ApiResponse({ status: 404, description: 'Page content not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('pageKey') pageKey: string,
    @Body() updateDto: UpdatePageContentDto,
  ) {
    return this.pageContentService.update(pageKey, updateDto);
  }

  @Delete(':pageKey')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete page content' })
  @ApiResponse({ status: 200, description: 'Page content deleted' })
  @ApiResponse({ status: 404, description: 'Page content not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('pageKey') pageKey: string) {
    return this.pageContentService.delete(pageKey);
  }
}