import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Allowed MIME types per upload type
const UPLOAD_TYPE_MIME_TYPES: Record<string, string[]> = {
  'product-image': ['image/jpeg', 'image/png', 'image/webp'],
  'product-video': ['video/mp4', 'video/webm'],
  'testimonial': ['image/jpeg', 'image/png'],
  'client-logo': ['image/png', 'image/svg+xml'],
  'factory-image': ['image/jpeg', 'image/png'],
  'general': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

// Max sizes per upload type (in bytes)
const UPLOAD_TYPE_MAX_SIZES: Record<string, number> = {
  'product-image': 10 * 1024 * 1024, // 10MB
  'product-video': 200 * 1024 * 1024, // 200MB
  'testimonial': 5 * 1024 * 1024, // 5MB
  'client-logo': 2 * 1024 * 1024, // 2MB
  'factory-image': 15 * 1024 * 1024, // 15MB
  'general': 10 * 1024 * 1024, // 10MB
};

// Dynamic storage for multer
const createStorage = (uploadType: string) => ({
  storage: {
    destination: (req: any, file: Express.Multer.File, cb: Function) => {
      cb(null, `./uploads/${uploadType}`);
    },
    filename: (req: any, file: Express.Multer.File, cb: Function) => {
      const uniqueId = uuidv4();
      const ext = file.originalname.split('.').pop();
      cb(null, `${uniqueId}.${ext}`);
    },
  },
});

// File filter factory
const createFileFilter = (uploadType: string) => {
  return (req: any, file: Express.Multer.File, cb: Function) => {
    const allowedTypes = UPLOAD_TYPE_MIME_TYPES[uploadType] || UPLOAD_TYPE_MIME_TYPES.general;
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`File type ${file.mimetype} is not allowed for ${uploadType}`), false);
    }
  };
};

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':uploadType')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('uploadType') uploadType: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const maxSize = UPLOAD_TYPE_MAX_SIZES[uploadType] || UPLOAD_TYPE_MAX_SIZES.general;
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    const url = this.uploadService.getFileUrl(`uploads/${uploadType}/${file.filename}`);
    return {
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: `uploads/${uploadType}/${file.filename}`,
    };
  }

  @Post(':uploadType/multiple')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files' })
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadMultipleFiles(
    @Param('uploadType') uploadType: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const maxSize = UPLOAD_TYPE_MAX_SIZES[uploadType] || UPLOAD_TYPE_MAX_SIZES.general;
    const results = [];

    for (const file of files) {
      if (file.size > maxSize) {
        continue; // Skip oversized files
      }
      results.push({
        url: this.uploadService.getFileUrl(`uploads/${uploadType}/${file.filename}`),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: `uploads/${uploadType}/${file.filename}`,
      });
    }

    return {
      files: results,
      count: results.length,
    };
  }

  @Delete(':uploadType/:filename')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(
    @Param('uploadType') uploadType: string,
    @Param('filename') filename: string,
  ) {
    const deleted = await this.uploadService.deleteFile(`uploads/${uploadType}/${filename}`);
    if (!deleted) {
      throw new NotFoundException('File not found');
    }
    return { message: 'File deleted successfully' };
  }
}
