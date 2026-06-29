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
  Logger,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ALLOWED_MIME_TYPES, MAX_BYTES_BY_TYPE, sniffMimeType } from '../common/magic-bytes';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  /**
   * Read the first 16 bytes from disk to verify the file is what the
   * client claimed. The first line of defense is the multer `fileFilter`,
   * but a malicious client can still forge `Content-Type`. We trust the
   * sniffed MIME over the declared one, and reject on mismatch.
   */
  private async verifyMagic(uploadType: string, filepath: string, declaredMime: string): Promise<{ mime: string; ext: string }> {
    const fd = await fs.open(filepath, 'r');
    try {
      const buf = Buffer.alloc(16);
      await fd.read(buf, 0, 16, 0);
      const sniff = sniffMimeType(buf);
      if (!sniff) {
        throw new BadRequestException('File content could not be recognized');
      }
      const allowed = ALLOWED_MIME_TYPES[uploadType] || ALLOWED_MIME_TYPES.general;
      if (!allowed.includes(sniff.mime)) {
        // Reject mismatched uploads. The file is still on disk; clean it up.
        await fd.close().catch(() => undefined);
        await fs.unlink(filepath).catch(() => undefined);
        throw new BadRequestException(`File type ${sniff.mime} is not allowed for ${uploadType}`);
      }
      // Also reject if declared type is wildly different from sniffed type.
      // (e.g. client says image/jpeg but file is application/pdf)
      if (declaredMime !== sniff.mime && !(declaredMime === 'image/jpeg' && sniff.mime === 'image/jpeg')) {
        await fs.unlink(filepath).catch(() => undefined);
        throw new BadRequestException(
          `Declared Content-Type ${declaredMime} does not match file content (${sniff.mime})`,
        );
      }
      return sniff;
    } finally {
      await fd.close().catch(() => undefined);
    }
  }

  private renameToCorrectExt(filepath: string, ext: string): Promise<string> {
    if (extname(filepath).toLowerCase() === `.${ext}`) return Promise.resolve(filepath);
    const newPath = filepath.replace(extname(filepath), `.${ext}`);
    return fs.rename(filepath, newPath).then(() => newPath);
  }

  @Post(':uploadType')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
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
    if (!file) throw new BadRequestException('No file provided');

    const maxSize = MAX_BYTES_BY_TYPE[uploadType] || MAX_BYTES_BY_TYPE.general;
    if (file.size > maxSize) {
      // multer deletes the file on its own size error; but we double-check.
      await fs.unlink(file.path).catch(() => undefined);
      throw new BadRequestException(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    const sniffed = await this.verifyMagic(uploadType, file.path, file.mimetype);
    const finalPath = await this.renameToCorrectExt(file.path, sniffed.ext);
    const finalName = finalPath.split(/[\\/]/).pop()!;
    const relativePath = `uploads/${uploadType}/${finalName}`;

    return {
      url: this.uploadService.getFileUrl(relativePath),
      filename: finalName,
      originalName: file.originalname,
      size: file.size,
      mimetype: sniffed.mime,
      path: relativePath,
    };
  }

  @Post(':uploadType/multiple')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files' })
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadMultipleFiles(
    @Param('uploadType') uploadType: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) throw new BadRequestException('No files provided');

    const maxSize = MAX_BYTES_BY_TYPE[uploadType] || MAX_BYTES_BY_TYPE.general;
    const results: Array<Record<string, unknown> | null> = [];

    for (const file of files) {
      try {
        if (file.size > maxSize) {
          await fs.unlink(file.path).catch(() => undefined);
          results.push(null);
          continue;
        }
        const sniffed = await this.verifyMagic(uploadType, file.path, file.mimetype);
        const finalPath = await this.renameToCorrectExt(file.path, sniffed.ext);
        const finalName = finalPath.split(/[\\/]/).pop()!;
        const relativePath = `uploads/${uploadType}/${finalName}`;
        results.push({
          url: this.uploadService.getFileUrl(relativePath),
          filename: finalName,
          originalName: file.originalname,
          size: file.size,
          mimetype: sniffed.mime,
          path: relativePath,
        });
      } catch (err) {
        // One bad file should not kill the whole batch
        this.logger.warn(`Skipped file in batch upload: ${(err as Error).message}`);
        await fs.unlink(file.path).catch(() => undefined);
        results.push(null);
      }
    }

    const filtered = results.filter(Boolean);
    return { files: filtered, count: filtered.length, rejected: results.length - filtered.length };
  }

  @Delete(':uploadType/:filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(
    @Param('uploadType') uploadType: string,
    @Param('filename') filename: string,
  ) {
    // Sanitize both path segments: only allow [A-Za-z0-9._-]
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(uploadType)) {
      throw new BadRequestException('Invalid upload type');
    }
    if (!/^[A-Za-z0-9._-]{1,200}$/.test(filename)) {
      throw new BadRequestException('Invalid filename');
    }
    const deleted = await this.uploadService.deleteFile(`uploads/${uploadType}/${filename}`);
    if (!deleted) throw new NotFoundException('File not found');
    return { message: 'File deleted successfully' };
  }
}
