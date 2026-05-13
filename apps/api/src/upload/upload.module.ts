import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage, StorageEngine } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AuthModule } from '../auth/auth.module';

// File filter types
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf'],
  all: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf'],
};

// Max file sizes (in bytes)
const FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 200 * 1024 * 1024, // 200MB
  document: 50 * 1024 * 1024, // 50MB
  all: 200 * 1024 * 1024, // 200MB default for uploads
};

// Custom storage engine that uses uploadType from URL params
const createStorage = (): StorageEngine => {
  return diskStorage({
    destination: (req, file, cb) => {
      // Extract uploadType from req.params (set by NestJS路由)
      const uploadType = req.params.uploadType || 'general';

      const fs = require('fs');
      const dir = `./uploads/${uploadType}`;

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueId = uuidv4();
      const ext = extname(file.originalname);
      cb(null, `${uniqueId}${ext}`);
    },
  });
};

// File filter that allows all configured types
const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const uploadType = req.params.uploadType || 'general';

  const allowedByType: Record<string, string[]> = {
    'product-image': ['image/jpeg', 'image/png', 'image/webp'],
    'category-image': ['image/jpeg', 'image/png', 'image/webp'],
    'product-video': ['video/mp4', 'video/webm'],
    'testimonial': ['image/jpeg', 'image/png'],
    'client-logo': ['image/png', 'image/svg+xml'],
    'factory-image': ['image/jpeg', 'image/png'],
    'general': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  };

  const allowedTypes = allowedByType[uploadType] || allowedByType.general;

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed for ${uploadType}`), false);
  }
};

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      storage: createStorage(),
      fileFilter,
      limits: {
        fileSize: FILE_SIZES.all,
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}