// LQIP (Low Quality Image Placeholder) utilities
// Generates lightweight blur placeholders for Next.js Image components

export interface BlurPlaceholder {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

// SVG-based blur placeholder generator
// Creates a tiny (10px wide) blurred version as base64
export function generateBlurPlaceholder(
  width: number = 800,
  height: number = 600,
  color: string = '#f5f4ed'
): string {
  // Create a tiny SVG that will be blurred by CSS
  const svg = 
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0  ">
      <rect width="100%" height="100%" fill=""/>
    </svg>`
  ;
  
  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Generate a colored blur placeholder based on dominant image color
export function generateColorBlurPlaceholder(
  dominantColor: string = '#f5f4ed',
  fallbackColor: string = '#e8e6dc'
): string {
  const color = dominantColor || fallbackColor;
  const svg = 
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'>
      <rect width='1' height='1' fill=''/>
    </svg>`
  ;
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Preset blur placeholders for common image sizes
export const PRESET_BLUR_PLACEHOLDERS = {
  thumbnail: generateBlurPlaceholder(100, 100),
  card: generateBlurPlaceholder(400, 300),
  hero: generateBlurPlaceholder(1920, 1080),
  product: generateBlurPlaceholder(800, 800),
  avatar: generateBlurPlaceholder(64, 64),
};

// Extract dominant color from image URL for better placeholder
// This is a simplified version - in production, you might want to use a service
export async function extractDominantColor(imageUrl: string): Promise<string> {
  try {
    // In a real implementation, you would:
    // 1. Use a image processing service
    // 2. Call a serverless function that analyzes the image
    // 3. Use a CDN that provides color extraction
    
    // For now, return a neutral placeholder color
    return '#f5f4ed';
  } catch {
    return '#f5f4ed';
  }
}

// Preload hook for images
export function useImagePreload(src: string) {
  if (typeof window !== 'undefined' && src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }
  return () => {};
}
