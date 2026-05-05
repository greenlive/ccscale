'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, FileUp, Loader } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import {
  compressImage,
  getCompressionOptionsForUploadType,
  formatFileSize,
  type CompressionResult,
} from '@cc-scale/ui';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadedFile {
  id: string;
  file: File;
  originalFile?: File;
  preview: string;
  type: 'image' | 'video';
  isMain?: boolean;
  compression?: CompressionResult;
  isServerUrl?: boolean;
  uploadedUrl?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  type?: 'image' | 'video' | 'any';
  label?: string;
  hint?: string;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  showMainImageToggle?: boolean;
  uploadType?: 'product-image' | 'product-video' | 'testimonial' | 'client-logo' | 'factory-image' | 'general';
}

const DEFAULT_HINTS: Record<string, { hint: string; maxSizeMB: number }> = {
  'product-image': {
    hint: 'JPG/PNG, 800×800px, 白底, ≤5MB (自动压缩)',
    maxSizeMB: 5,
  },
  'product-video': {
    hint: 'MP4, 1920×1080, ≤200MB, 时长30秒-1分钟',
    maxSizeMB: 200,
  },
  'testimonial': {
    hint: 'JPG/PNG, 200×200px (头像), 或 800×600px (其他), ≤3MB (自动压缩)',
    maxSizeMB: 3,
  },
  'client-logo': {
    hint: 'PNG透明背景, 200×80px (网页), 400×200px (后台), ≤2MB',
    maxSizeMB: 2,
  },
  'factory-image': {
    hint: 'JPG/PNG, 1920×1080px (16:9), 展示公司规模, ≤10MB (自动压缩)',
    maxSizeMB: 10,
  },
  'general': {
    hint: 'JPG/PNG/WebP, ≤10MB (自动压缩优化)',
    maxSizeMB: 10,
  },
};

export function FileUpload({
  accept,
  multiple = true,
  maxFiles = 10,
  type = 'image',
  label,
  hint,
  files,
  onChange,
  showMainImageToggle = false,
  uploadType = 'general',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressAndProcessFile = useCallback(async (file: File): Promise<UploadedFile> => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Compress images
    let processedFile = file;
    let compression: CompressionResult | undefined;

    if (isImage) {
      const options = getCompressionOptionsForUploadType(uploadType);
      try {
        compression = await compressImage(file, options);
        processedFile = compression.compressedFile;
      } catch (error) {
        console.warn('Compression failed, using original file:', error);
      }
    }

    const preview = URL.createObjectURL(processedFile);

    return {
      id: Math.random().toString(36).substr(2, 9),
      file: processedFile,
      originalFile: isImage ? file : undefined,
      preview,
      type: isImage ? 'image' : 'video',
      isMain: false,
      compression,
    };
  }, [uploadType]);

  const validateAndProcessFiles = useCallback(async (newFiles: File[]): Promise<{ files: UploadedFile[]; errors: string[] }> => {
    const processed: UploadedFile[] = [];
    const errors: string[] = [];
    const maxSizeBytes = (DEFAULT_HINTS[uploadType]?.maxSizeMB || 10) * 1024 * 1024;

    setIsCompressing(true);

    for (const file of newFiles) {
      if (files.length + processed.length >= maxFiles) break;

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (type === 'image' && !isImage) {
        errors.push(`${file.name}: 不是图片文件`);
        continue;
      }
      if (type === 'video' && !isVideo) {
        errors.push(`${file.name}: 不是视频文件`);
        continue;
      }

      // Check original file size first
      if (file.size > maxSizeBytes) {
        const maxMB = DEFAULT_HINTS[uploadType]?.maxSizeMB || 10;
        errors.push(`${file.name}: 超过 ${maxMB}MB 限制`);
        continue;
      }

      try {
        const uploadedFile = await compressAndProcessFile(file);
        uploadedFile.isMain = files.length === 0 && processed.length === 0;
        processed.push(uploadedFile);
      } catch (error) {
        errors.push(`${file.name}: 处理文件失败`);
      }
    }

    setIsCompressing(false);
    return { files: processed, errors };
  }, [files.length, maxFiles, type, uploadType, compressAndProcessFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const { files: processed, errors } = await validateAndProcessFiles(droppedFiles);
    if (processed.length > 0) {
      onChange([...files, ...processed]);
    }
    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
    }
  }, [files, onChange, validateAndProcessFiles]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const { files: processed, errors } = await validateAndProcessFiles(selectedFiles);
    if (processed.length > 0) {
      onChange([...files, ...processed]);
    }
    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [files, onChange, validateAndProcessFiles]);

  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      // Only revoke blob URLs, not server URLs
      if (!fileToRemove.isServerUrl) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
    }
    onChange(files.filter(f => f.id !== id));
  }, [files, onChange]);

  const setMainImage = useCallback((id: string) => {
    onChange(files.map(f => ({
      ...f,
      isMain: f.id === id,
    })));
  }, [files, onChange]);

  const getAcceptString = () => {
    if (accept) return accept;
    if (type === 'image') return 'image/*';
    if (type === 'video') return 'video/*';
    return '*';
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-charcoal-warm">
          {label}
        </label>
      )}

      {files.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
            isDragging
              ? 'border-terracotta bg-terracotta/5'
              : 'border-border-warm hover:border-olive-gray hover:bg-warm-sand/30',
            isCompressing && 'pointer-events-none opacity-60'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptString()}
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="mx-auto w-14 h-14 bg-warm-sand rounded-full flex items-center justify-center mb-4">
            {isCompressing ? (
              <Loader className="h-7 w-7 text-terracotta animate-pulse" />
            ) : type === 'image' ? (
              <ImageIcon className="h-7 w-7 text-olive-gray" />
            ) : type === 'video' ? (
              <Video className="h-7 w-7 text-olive-gray" />
            ) : (
              <FileUp className="h-7 w-7 text-olive-gray" />
            )}
          </div>
          <p className="text-charcoal-warm font-medium">
            {isDragging ? '松开以上传' : isCompressing ? '正在优化图片...' : '拖拽文件到此处上传'}
          </p>
          <p className="text-sm text-stone-gray mt-1">
            或点击选择文件
          </p>
          <p className="text-xs text-olive-gray mt-2">
            {hint || DEFAULT_HINTS[uploadType]?.hint || DEFAULT_HINTS.general.hint}
          </p>
        </div>
      )}

      {uploadErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
          <p className="text-sm font-medium text-destructive mb-1">上传错误:</p>
          <ul className="text-xs text-destructive/80 space-y-1">
            {uploadErrors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="relative group">
              <div
                className={cn(
                  'relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                  file.isMain ? 'border-terracotta shadow-ring-terracotta' : 'border-border-warm'
                )}
                onClick={() => setPreviewFile(file)}
              >
                {file.type === 'image' ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load and it's a server URL, try with full API URL
                      if (file.isServerUrl && !e.currentTarget.src.includes('localhost:8000')) {
                        e.currentTarget.src = `http://localhost:8000${file.preview}`;
                      }
                    }}
                  />
                ) : (
                  <video
                    src={file.isServerUrl ? `http://localhost:8000${file.preview}` : file.preview}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Play icon overlay for videos */}
                {file.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Video className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 shadow-md"
              >
                <X className="h-4 w-4" />
              </button>
              {showMainImageToggle && file.type === 'image' && (
                <button
                  type="button"
                  onClick={() => setMainImage(file.id)}
                  className={cn(
                    'absolute bottom-2 left-2 right-2 text-xs py-1.5 rounded-lg transition-colors shadow-md',
                    file.isMain
                      ? 'bg-terracotta text-white'
                      : 'bg-ivory/95 text-charcoal-warm hover:bg-warm-sand'
                  )}
                >
                  {file.isMain ? '主图' : '设为主图'}
                </button>
              )}
              {/* Compression info */}
              {file.compression && file.compression.compressionRatio > 0.05 && (
                <div className="absolute top-2 left-2 bg-dark-surface/90 text-ivory text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Loader className="h-3 w-3" />
                  <span>-{Math.round(file.compression.compressionRatio * 100)}%</span>
                </div>
              )}
              <p className="text-xs text-stone-gray mt-2 truncate" title={file.file.name}>
                {file.isServerUrl ? file.file.name.split('/').pop() : file.file.name}
              </p>
              <p className="text-xs text-olive-gray">
                {formatFileSize(file.file.size)}
                {file.originalFile && file.file.size < file.originalFile.size && (
                  <span className="text-terracotta ml-1">
                    (原: {formatFileSize(file.originalFile.size)})
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setPreviewFile(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {previewFile.type === 'image' ? (
              <img
                src={previewFile.isServerUrl ? `http://localhost:8000${previewFile.preview}` : previewFile.preview}
                alt={previewFile.file.name}
                className="max-w-full max-h-[85vh] mx-auto object-contain"
              />
            ) : (
              <video
                src={previewFile.isServerUrl ? `http://localhost:8000${previewFile.preview}` : previewFile.preview}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] mx-auto"
              />
            )}
            <div className="text-center mt-4 text-white">
              <p className="font-medium">{previewFile.file.name}</p>
              <p className="text-sm text-white/70">{formatFileSize(previewFile.file.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
