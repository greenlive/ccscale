/**
 * Client-side image compression and optimization utility
 * Uses Canvas API for resizing and quality adjustment
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, default 0.8
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  maintainAspectRatio?: boolean;
}

export interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'image/jpeg',
  maintainAspectRatio: true,
};

// Type-specific optimizations
const UPLOAD_TYPE_OPTIONS: Record<string, Partial<CompressionOptions>> = {
  'product-image': {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    format: 'image/jpeg',
  },
  'testimonial': {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.8,
    format: 'image/jpeg',
  },
  'client-logo': {
    maxWidth: 400,
    maxHeight: 200,
    quality: 0.9,
    format: 'image/png',
  },
  'factory-image': {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'image/jpeg',
  },
  'general': {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'image/jpeg',
  },
};

/**
 * Get dimensions of an image file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return { width: maxWidth, height: maxHeight };
  }

  let width = originalWidth;
  let height = originalHeight;

  // Only resize if image is larger than max dimensions
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  return { width, height };
}

/**
 * Compress a single image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Skip compression for non-image files or GIFs (keep animations)
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return {
      originalFile: file,
      compressedFile: file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 1,
      width: 0,
      height: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = calculateDimensions(
        img.width,
        img.height,
        opts.maxWidth!,
        opts.maxHeight!,
        opts.maintainAspectRatio!
      );

      // Create canvas for compression
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Fill with white background for JPEG (supports transparent -> white)
      if (opts.format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      // Draw and resize image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }

          // Generate appropriate file extension
          const extension = opts.format === 'image/png' ? '.png' :
                           opts.format === 'image/webp' ? '.webp' : '.jpg';
          const originalName = file.name.replace(/\.[^/.]+$/, '');
          const newFileName = `${originalName}${extension}`;

          // Create compressed file
          const compressedFile = new File([blob], newFileName, {
            type: opts.format,
            lastModified: Date.now(),
          });

          resolve({
            originalFile: file,
            compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            compressionRatio: 1 - (compressedFile.size / file.size),
            width,
            height,
          });
        },
        opts.format,
        opts.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Get compression options for specific upload type
 */
export function getCompressionOptionsForUploadType(
  uploadType: string
): CompressionOptions {
  const typeOptions = UPLOAD_TYPE_OPTIONS[uploadType] || UPLOAD_TYPE_OPTIONS.general;
  return { ...DEFAULT_OPTIONS, ...typeOptions };
}

/**
 * Generate blur placeholder for Next.js Image
 * Returns base64 encoded low-quality image placeholder
 */
export async function generateBlurPlaceholder(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Create tiny 20x20 version for blur placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 20;
      canvas.height = 20;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, 20, 20);
      resolve(canvas.toDataURL('image/jpeg', 0.1));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to generate blur placeholder'));
    };

    img.src = url;
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
