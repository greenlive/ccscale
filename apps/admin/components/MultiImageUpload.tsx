'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, Plus } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface MultiImageUploadProps {
  label: string;
  value: string; // newline-separated URLs
  onChange: (urls: string) => void;
  uploadType?: 'general' | 'company-photos';
  hint?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  label,
  value,
  onChange,
  uploadType = 'company-photos',
  hint = 'Upload multiple images',
  maxImages = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrls = value ? value.split('\n').filter(url => url.trim()) : [];
  const canAddMore = currentUrls.length < maxImages;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - currentUrls.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setUploading(true);
    setError(null);
    setUploadProgress(10);

    try {
      const result = await api.uploadMultiple<{ files: Array<{ url: string }> }>(
        `/upload/${uploadType}/multiple`,
        filesToUpload,
        uploadType,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (result.success && result.data?.files) {
        const newUrls = result.data.files.map(f => f.url);
        const updatedValue = [...currentUrls, ...newUrls].join('\n');
        onChange(updatedValue);
      } else {
        setError(result.error?.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newUrls = currentUrls.filter((_, idx) => idx !== indexToRemove);
    onChange(newUrls.join('\n'));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        {label}
      </label>

      {/* Image Grid */}
      {currentUrls.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {currentUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="w-full h-full border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={url.trim()}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        uploading ? (
          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
            <Loader className="h-8 w-8 mx-auto mb-2 text-accent animate-spin" />
            <p className="text-sm text-gray-500">Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">{hint}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {currentUrls.length}/{maxImages} images
            </p>
          </div>
        )
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}