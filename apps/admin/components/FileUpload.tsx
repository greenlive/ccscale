'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, FileUp } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  isMain?: boolean;
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
    hint: 'JPG/PNG, 800×800px, 白底, ≤5MB',
    maxSizeMB: 5,
  },
  'product-video': {
    hint: 'MP4, 1920×1080, ≤200MB, 时长30秒-1分钟',
    maxSizeMB: 200,
  },
  'testimonial': {
    hint: 'JPG/PNG, 200×200px (头像), 或 800×600px (其他), ≤3MB',
    maxSizeMB: 3,
  },
  'client-logo': {
    hint: 'PNG透明背景, 200×80px (网页), 400×200px (后台), ≤2MB',
    maxSizeMB: 2,
  },
  'factory-image': {
    hint: 'JPG/PNG, 1920×1080px (16:9), 展示公司规模, ≤10MB',
    maxSizeMB: 10,
  },
  'general': {
    hint: 'JPG/PNG/WebP, ≤10MB',
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndProcessFiles = useCallback((newFiles: File[]): { files: UploadedFile[]; errors: string[] } => {
    const processed: UploadedFile[] = [];
    const errors: string[] = [];
    const maxSizeBytes = (DEFAULT_HINTS[uploadType]?.maxSizeMB || 10) * 1024 * 1024;

    for (const file of newFiles) {
      if (files.length + processed.length >= maxFiles) break;

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (type === 'image' && !isImage) {
        errors.push(`${file.name}: Not an image file`);
        continue;
      }
      if (type === 'video' && !isVideo) {
        errors.push(`${file.name}: Not a video file`);
        continue;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        const maxMB = DEFAULT_HINTS[uploadType]?.maxSizeMB || 10;
        errors.push(`${file.name}: Exceeds ${maxMB}MB limit`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      processed.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type: isImage ? 'image' : 'video',
        isMain: files.length === 0 && processed.length === 0,
      });
    }

    return { files: processed, errors };
  }, [files.length, maxFiles, type, uploadType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const { files: processed, errors } = validateAndProcessFiles(droppedFiles);
    if (processed.length > 0) {
      onChange([...files, ...processed]);
    }
    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
    }
  }, [files, onChange, validateAndProcessFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const { files: processed, errors } = validateAndProcessFiles(selectedFiles);
    if (processed.length > 0) {
      onChange([...files, ...processed]);
    }
    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
    }
  }, [files, onChange, validateAndProcessFiles]);

  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
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
        <label className="block text-sm font-medium text-gray-700">
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
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
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
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {type === 'image' ? (
              <ImageIcon className="h-6 w-6 text-gray-500" />
            ) : type === 'video' ? (
              <Video className="h-6 w-6 text-gray-500" />
            ) : (
              <FileUp className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <p className="text-gray-700 font-medium">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {hint || DEFAULT_HINTS[uploadType]?.hint || DEFAULT_HINTS.general.hint}
          </p>
        </div>
      )}

      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-800 mb-1">Upload Error:</p>
          <ul className="text-xs text-red-600 space-y-1">
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
              <div className={cn(
                'aspect-square rounded-lg overflow-hidden border-2',
                file.isMain ? 'border-accent' : 'border-gray-200'
              )}>
                {file.type === 'image' ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={file.preview}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              {showMainImageToggle && file.type === 'image' && (
                <button
                  type="button"
                  onClick={() => setMainImage(file.id)}
                  className={cn(
                    'absolute bottom-2 left-2 right-2 text-xs py-1 rounded transition-colors',
                    file.isMain
                      ? 'bg-accent text-white'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {file.isMain ? 'Main Image' : 'Set as Main'}
                </button>
              )}
              <p className="text-xs text-gray-500 mt-1 truncate">
                {file.file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
