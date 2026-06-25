'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { PRESET_BLUR_PLACEHOLDERS } from '@/lib/utils/image-utils';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  blurType?: 'thumbnail' | 'card' | 'hero' | 'product' | 'avatar';
  customBlurDataURL?: string;
  showLoader?: boolean;
}

/**
 * Optimized Image component with built-in LQIP (Low Quality Image Placeholder) support.
 * Features:
 * - Automatic blur placeholder based on image type
 * - Loading skeleton animation
 * - Error state handling
 * - Lazy loading with priority option
 */
export function OptimizedImage({
  src,
  alt,
  blurType = 'product',
  customBlurDataURL,
  showLoader = true,
  className = '',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const blurDataURL = customBlurDataURL || PRESET_BLUR_PLACEHOLDERS[blurType];

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800`}
        style={{ aspectRatio: props.sizes ? undefined : `${props.width || 800}/` }}
      >
        <div className="text-gray-400 text-sm text-center p-4">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span>Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading skeleton */}
      {showLoader && isLoading && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 
            dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 
            animate-pulse`}
          style={{ 
            aspectRatio: props.width && props.height ? `${props.width}/` : undefined 
          }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300`}
        priority={priority}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
