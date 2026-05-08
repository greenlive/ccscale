'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, FileUp, Loader, GripVertical } from 'lucide-react';
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
  order?: number;
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

// Re-export UploadedFile for use in pages
export type { UploadedFile };

const DEFAULT_HINTS: Record<string, { hint: string; maxSizeMB: number }> = {
  'product-image': {
    hint: '宽750px，高≤2500px，JPG/WebP，≤3MB/张，第一张为封面',
    maxSizeMB: 3,
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

  // Pre-upload confirmation modal state
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmDragIndex, setConfirmDragIndex] = useState<number | null>(null);
  const [confirmDropIndex, setConfirmDropIndex] = useState<number | null>(null);

  // Drag reordering state for uploaded files
  const [reorderDragIndex, setReorderDragIndex] = useState<number | null>(null);
  const [reorderDropIndex, setReorderDropIndex] = useState<number | null>(null);

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
    const remainingSlots = maxFiles - files.length;

    // 调试日志：检查浏览器返回的文件顺序
    console.log('【FileUpload】用户选择的文件顺序:', newFiles.map((f, i) => `${i}: ${f.name}`));

    setIsCompressing(true);

    // Check if selecting more files than allowed
    if (newFiles.length > remainingSlots) {
      errors.push(`最多只能选择 ${maxFiles} 个文件（当前已有 ${files.length} 个），已跳过多余的 ${newFiles.length - remainingSlots} 个文件`);
    }

    for (let i = 0; i < newFiles.length && processed.length < remainingSlots; i++) {
      const file = newFiles[i];

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
        // For product-image (main images and detail images), don't compress - preserve original quality
        const shouldCompress = uploadType !== 'product-image' && isImage;
        let processedFile = file;
        let compression: CompressionResult | undefined;

        if (shouldCompress) {
          const options = getCompressionOptionsForUploadType(uploadType);
          compression = await compressImage(file, options);
          processedFile = compression.compressedFile;
        }

        const preview = URL.createObjectURL(processedFile);
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file: processedFile,
          originalFile: shouldCompress ? file : undefined,
          preview,
          type: isImage ? 'image' : 'video',
          isMain: false,
          compression,
          order: files.length + processed.length, // 选择顺序
        };

        // Set order based on position in selection
        uploadedFile.isMain = files.length === 0 && processed.length === 0;
        processed.push(uploadedFile);
      } catch (error) {
        errors.push(`${file.name}: 处理文件失败`);
      }
    }

    setIsCompressing(false);
    return { files: processed, errors };
  }, [files.length, maxFiles, type, uploadType]);

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
    // 浏览器会按用户选择顺序返回文件，保持这个顺序
    const selectedFiles = Array.from(e.target.files || []);
    const { files: processed, errors } = await validateAndProcessFiles(selectedFiles);

    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
    }

    if (processed.length > 0) {
      // 直接添加到文件列表，立即显示缩略图（保持选择顺序）
      // processed 已经是按选择顺序排列的
      onChange([...files, ...processed]);
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

  // Pre-upload confirmation modal handlers
  const confirmUpload = useCallback(() => {
    onChange([...files, ...pendingFiles]);
    setShowConfirmModal(false);
    // Clean up preview URLs
    pendingFiles.forEach(f => {
      if (!f.isServerUrl) URL.revokeObjectURL(f.preview);
    });
    setPendingFiles([]);
  }, [files, onChange, pendingFiles]);

  const cancelUpload = useCallback(() => {
    pendingFiles.forEach(f => {
      if (!f.isServerUrl) URL.revokeObjectURL(f.preview);
    });
    setShowConfirmModal(false);
    setPendingFiles([]);
  }, [pendingFiles]);

  const removePendingFile = useCallback((id: string) => {
    const fileToRemove = pendingFiles.find(f => f.id === id);
    if (fileToRemove && !fileToRemove.isServerUrl) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setPendingFiles(prev => prev.filter(f => f.id !== id));
  }, [pendingFiles]);

  // Drag reordering for confirmation modal
  const handleConfirmDragStart = useCallback((idx: number) => {
    setConfirmDragIndex(idx);
  }, []);

  const handleConfirmDrop = useCallback((targetIdx: number) => {
    if (confirmDragIndex === null || confirmDragIndex === targetIdx) return;
    const newFiles = [...pendingFiles];
    const [moved] = newFiles.splice(confirmDragIndex, 1);
    newFiles.splice(targetIdx, 0, moved);
    setPendingFiles(newFiles);
    setConfirmDragIndex(null);
    setConfirmDropIndex(null);
  }, [confirmDragIndex, pendingFiles]);

  const handleConfirmDragEnd = useCallback(() => {
    setConfirmDragIndex(null);
    setConfirmDropIndex(null);
  }, []);

  // Drag reordering for uploaded files
  const handleReorderStart = useCallback((idx: number) => {
    setReorderDragIndex(idx);
  }, []);

  const handleReorderOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setReorderDropIndex(idx);
  }, []);

  const handleReorderDrop = useCallback((targetIdx: number) => {
    if (reorderDragIndex === null || reorderDragIndex === targetIdx) {
      setReorderDragIndex(null);
      setReorderDropIndex(null);
      return;
    }
    const newFiles = [...files];
    const [moved] = newFiles.splice(reorderDragIndex, 1);
    newFiles.splice(targetIdx, 0, moved);
    onChange(newFiles);
    setReorderDragIndex(null);
    setReorderDropIndex(null);
  }, [reorderDragIndex, files, onChange]);

  const handleReorderEnd = useCallback(() => {
    setReorderDragIndex(null);
    setReorderDropIndex(null);
  }, []);

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
            'border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer',
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
          <div className="mx-auto w-10 h-10 bg-warm-sand rounded-full flex items-center justify-center mb-3">
            {isCompressing ? (
              <Loader className="h-5 w-5 text-terracotta animate-pulse" />
            ) : type === 'image' ? (
              <ImageIcon className="h-5 w-5 text-olive-gray" />
            ) : type === 'video' ? (
              <Video className="h-5 w-5 text-olive-gray" />
            ) : (
              <FileUp className="h-5 w-5 text-olive-gray" />
            )}
          </div>
          <p className="text-charcoal-warm font-medium text-sm">
            {isDragging ? '松开以上传' : isCompressing ? '正在优化图片...' : '拖拽文件到此处上传'}
          </p>
          <p className="text-xs text-stone-gray mt-1">
            或点击选择文件
          </p>
          <p className="text-xs text-olive-gray mt-1">
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
        <>
          {/* 调试信息 */}
          <div className="text-xs text-stone-gray mb-2">共 {files.length} 个文件</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {files.map((file, idx) => (
            <div
              key={file.id}
              draggable
              onDragStart={() => handleReorderStart(idx)}
              onDragOver={(e) => handleReorderOver(e, idx)}
              onDragEnd={handleReorderEnd}
              onDrop={() => handleReorderDrop(idx)}
              className={cn(
                'relative group transition-all',
                reorderDragIndex === idx && 'opacity-50',
                reorderDropIndex === idx && 'ring-2 ring-terracotta rounded-xl'
              )}
            >
              <div
                className={cn(
                  'relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer cursor-grab',
                  file.isMain ? 'border-terracotta shadow-ring-terracotta' : 'border-border-warm hover:border-primary/50',
                  reorderDragIndex === idx && 'border-dashed',
                  reorderDropIndex === idx && 'border-terracotta'
                )}
                onClick={() => {
                  // 点击设置为主图（仅图片，且需要showMainImageToggle）
                  if (showMainImageToggle && file.type === 'image') {
                    setMainImage(file.id);
                  } else {
                    setPreviewFile(file);
                  }
                }}
              >
                {/* Drag handle */}
                <div className="absolute top-1 left-1 z-10 bg-dark-surface/70 text-white p-1 rounded opacity-0 group-hover:opacity-100">
                  <GripVertical className="h-4 w-4" />
                </div>
                {/* 主图标志 - 仅在有主图概念时显示 */}
                {showMainImageToggle && file.isMain && (
                  <div className="absolute top-1 right-1 z-10 bg-terracotta text-white text-xs px-2 py-0.5 rounded font-medium">
                    主图
                  </div>
                )}
                {file.type === 'image' ? (
                  <img
                    src={file.isServerUrl
                      ? (file.preview.startsWith('http')
                          ? file.preview
                          : `/uploads/${file.preview.replace(/^\/?uploads\//, '')}`)
                      : file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={file.isServerUrl
                      ? (file.preview.startsWith('http')
                          ? file.preview
                          : `/uploads/${file.preview.replace(/^\/?uploads\//, '')}`)
                      : file.preview}
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
              {/* 移除了设为主图按钮，改用点击图片设置 */}
              {/* Compression info */}
              {file.compression && file.compression.compressionRatio > 0.05 && (
                <div className="absolute top-2 left-2 bg-dark-surface/90 text-ivory text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Loader className="h-3 w-3" />
                  <span>-{Math.round(file.compression.compressionRatio * 100)}%</span>
                </div>
              )}
              <div className="text-center">
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
            </div>
          ))}
        </div>
        </>
      )}

      {/* Pre-upload Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-charcoal-warm">
                确认上传 ({pendingFiles.length}/{maxFiles})
              </h3>
              <button
                onClick={cancelUpload}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5 text-stone-gray" />
              </button>
            </div>

            {/* Instructions */}
            <div className="px-4 py-2 text-sm text-stone-gray bg-gray-50 border-b">
              可拖拽排序调整顺序，点击 ✕ 移除不需要的文件，确认后点击「上传」
            </div>

            {/* File Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {pendingFiles.map((file, idx) => (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={() => handleConfirmDragStart(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setConfirmDropIndex(idx);
                    }}
                    onDragLeave={handleConfirmDragEnd}
                    onDrop={() => handleConfirmDrop(idx)}
                    onDragEnd={handleConfirmDragEnd}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab',
                      confirmDragIndex === idx && 'opacity-50',
                      confirmDropIndex === idx && 'border-terracotta border-dashed'
                    )}
                  >
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Order number */}
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>
                    {/* Remove button */}
                    <button
                      onClick={() => removePendingFile(file.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {/* Drag handle indicator */}
                    <div className="absolute top-1 left-1 bg-black/60 text-white p-0.5 rounded opacity-0 hover:opacity-100">
                      <GripVertical className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={cancelUpload}
                className="flex-1 py-2.5 px-4 border border-border-warm rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmUpload}
                disabled={pendingFiles.length === 0}
                className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                上传 ({pendingFiles.length})
              </button>
            </div>
          </div>
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
                src={previewFile.isServerUrl
                  ? (previewFile.preview.startsWith('http')
                      ? previewFile.preview
                      : `/uploads/${previewFile.preview.replace(/^\/?uploads\//, '')}`)
                  : previewFile.preview}
                alt={previewFile.file.name}
                className="max-w-full max-h-[85vh] mx-auto object-contain"
              />
            ) : (
              <video
                src={previewFile.isServerUrl
                  ? (previewFile.preview.startsWith('http')
                      ? previewFile.preview
                      : `/uploads/${previewFile.preview.replace(/^\/?uploads\//, '')}`)
                  : previewFile.preview}
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
