import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('downloads')
@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all downloads' })
  @ApiResponse({ status: 200, description: 'Return all downloads' })
  findAll() {
    return this.downloadsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get download by id' })
  @ApiResponse({ status: 200, description: 'Return the download' })
  @ApiResponse({ status: 404, description: 'Download not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.downloadsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a download' })
  @ApiResponse({ status: 201, description: 'Download created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createDownloadDto: CreateDownloadDto) {
    return this.downloadsService.create(createDownloadDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a download' })
  @ApiResponse({ status: 200, description: 'Download updated' })
  @ApiResponse({ status: 404, description: 'Download not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDownloadDto: UpdateDownloadDto) {
    return this.downloadsService.update(id, updateDownloadDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a download' })
  @ApiResponse({ status: 200, description: 'Download deleted' })
  @ApiResponse({ status: 404, description: 'Download not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.downloadsService.remove(id);
  }

  @Post(':id/increment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({ status: 200, description: 'Download count incremented' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  incrementCount(@Param('id', ParseIntPipe) id: number) {
    return this.downloadsService.incrementDownloadCount(id);
  }
}