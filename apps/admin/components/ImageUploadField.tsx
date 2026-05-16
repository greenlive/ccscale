'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadType?: string;
  hint?: string;
  previewHeight?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  uploadType = 'general',
  hint = 'Click to upload or paste image URL',
  previewHeight = 'h-24',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress(10);

    try {
      const result = await api.upload<{ url: string }>(`/upload/${uploadType}`, file, uploadType, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success && result.data?.url) {
        onChange(result.data.url);
        setUrlInputValue(result.data.url);
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

  const handleUrlSubmit = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInputValue('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        {label}
      </label>

      {/* Preview or Upload Area */}
      {value ? (
        <div className="relative group">
          <div className="border-2 border-dashed rounded-lg p-2 bg-gray-50">
            <img
              src={value}
              alt={label}
              className={`${previewHeight} max-w-full object-contain rounded`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="p-1.5 bg-white border rounded shadow hover:bg-gray-50 text-gray-600"
              title="Change URL"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-white border rounded shadow hover:bg-gray-50 text-red-500"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : uploading ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
          <Loader className="h-8 w-8 mx-auto mb-2 text-accent animate-spin" />
          <p className="text-sm text-gray-500">Uploading... {Math.round(uploadProgress)}%</p>
        </div>
      ) : showUrlInput ? (
        <div className="space-y-2">
          <input
            type="text"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="https://example.com/image.png"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 text-sm"
            >
              Apply URL
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInputValue(value);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">{hint}</p>
          <p className="text-xs text-gray-400 mt-1">or paste URL</p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* URL Input Toggle */}
      {!value && !uploading && !showUrlInput && (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="text-xs text-accent hover:underline"
        >
          Or paste image URL directly
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}