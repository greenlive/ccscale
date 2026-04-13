import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';
  private readonly baseUrl = process.env.UPLOAD_BASE_URL || '/uploads';

  async deleteFile(filename: string): Promise<boolean> {
    try {
      // Search in all subdirectories
      const dirs = ['product-image', 'product-video', 'testimonial', 'client-logo', 'factory-image', 'general'];

      for (const dir of dirs) {
        const filePath = join(this.uploadDir, dir, filename);
        await fs.unlink(filePath);
        return true;
      }

      // Also try root uploads directory
      const rootPath = join(this.uploadDir, filename);
      await fs.unlink(rootPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  getFileUrl(filePath: string): string {
    // Convert filesystem path to URL path
    const relativePath = filePath.replace(/^\.\//, '');
    return `${this.baseUrl}/${relativePath}`;
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      const dirs = ['product-image', 'product-video', 'testimonial', 'client-logo', 'factory-image', 'general'];

      for (const dir of dirs) {
        const filePath = join(this.uploadDir, dir, filename);
        await fs.access(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
