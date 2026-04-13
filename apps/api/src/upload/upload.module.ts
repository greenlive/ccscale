import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

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
  all: 10 * 1024 * 1024, // 10MB default
};

// Storage configuration
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

// File filter
const fileFilter = (allowedTypes: string[]) => {
  return (req: any, file: Express.Multer.File, cb: Function) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  };
};

@Module({
  imports: [
    MulterModule.register({
      storage,
      fileFilter: fileFilter(ALLOWED_MIME_TYPES.all),
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
