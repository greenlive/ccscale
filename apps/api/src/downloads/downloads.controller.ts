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
import { DownloadsService } from './downloads.service';

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
  findOne(@Param('id') id: string) {
    return this.downloadsService.findOne(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a download' })
  @ApiResponse({ status: 201, description: 'Download created' })
  create(@Body() createDownloadDto: any) {
    return this.downloadsService.create(createDownloadDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a download' })
  @ApiResponse({ status: 200, description: 'Download updated' })
  @ApiResponse({ status: 404, description: 'Download not found' })
  update(@Param('id') id: string, @Body() updateDownloadDto: any) {
    return this.downloadsService.update(parseInt(id), updateDownloadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a download' })
  @ApiResponse({ status: 200, description: 'Download deleted' })
  @ApiResponse({ status: 404, description: 'Download not found' })
  remove(@Param('id') id: string) {
    return this.downloadsService.remove(parseInt(id));
  }

  @Post(':id/increment')
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({ status: 200, description: 'Download count incremented' })
  incrementCount(@Param('id') id: string) {
    return this.downloadsService.incrementDownloadCount(parseInt(id));
  }
}