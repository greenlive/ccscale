import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage, StorageEngine } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AuthModule } from '../auth/auth.module';
import { ALLOWED_MIME_TYPES, MAX_BYTES_BY_TYPE, sniffMimeType } from '../common/magic-bytes';

/**
 * Disk storage that puts each upload under ./uploads/<uploadType>/<uuid>.<ext>.
 * Note: the extension here is overwritten by the magic-byte check below.
 */
const createStorage = (): StorageEngine => {
  return diskStorage({
    destination: (req, file, cb) => {
      const uploadType = req.params.uploadType || 'general';
      const dir = `./uploads/${uploadType}`;
      const fs = require('fs');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueId = uuidv4();
      // We don't trust the client extension; it will be replaced by the magic-byte result.
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uniqueId}${ext || '.bin'}`);
    },
  });
};

/**
 * MimeFilter is the FIRST line of defense. It rejects obviously-wrong
 * Content-Type headers from clients. The second line is the magic-byte
 * check inside the controller, which we still must perform because
 * Content-Type is trivially forgeable.
 */
const mimeFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const uploadType = req.params.uploadType || 'general';
  const allowed = ALLOWED_MIME_TYPES[uploadType] || ALLOWED_MIME_TYPES.general;
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Declared Content-Type ${file.mimetype} is not allowed for ${uploadType}`), false);
  }
};

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      storage: createStorage(),
      fileFilter: mimeFilter,
      // Hard cap; per-type cap is enforced in the controller after sniffing.
      limits: { fileSize: 200 * 1024 * 1024 },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService, MulterModule],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Reserved for future global upload hooks (e.g. virus scan)
  }
}

// Re-export helpers so the controller can use them without re-importing.
export { ALLOWED_MIME_TYPES, MAX_BYTES_BY_TYPE, sniffMimeType };
