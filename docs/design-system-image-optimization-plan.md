# CC Scale Design System & Image Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Claude-inspired warm parchment design system from DESIGN.md and add comprehensive image compression/optimization capabilities.

**Architecture:** 
- Overhaul Tailwind config and CSS variables to match the warm parchment theme
- Update shared UI components (Button, Card, Input) with new design
- Enhance FileUpload component with client-side image compression
- Add responsive image handling with Next.js Image blur placeholders

**Tech Stack:** Tailwind CSS 3.4, React 18, Next.js 14, Canvas API (for image compression)

---

## Context

The current CC Scale B2B platform uses a generic cool blue-gray theme. We need to implement the warm, parchment-inspired design system from DESIGN.md that evokes a literary salon atmosphere with terracotta accents and warm neutrals. Additionally, the image upload system needs optimization for file size, compression, and format handling.

## File Structure Overview

### Files to Modify:
1. `packages/ui/tailwind.config.ts` - Complete color palette, border radius, font family overhaul
2. `apps/web/app/globals.css` - CSS variables update
3. `apps/admin/app/globals.css` - CSS variables update (match web)
4. `packages/ui/src/button.tsx` - Update variants with ring shadows and warm styling
5. `packages/ui/src/card.tsx` - Update border radius and shadow
6. `packages/ui/src/input.tsx` - Update border radius and focus states
7. `apps/admin/components/FileUpload.tsx` - Add client-side image compression
8. `apps/web/components/ProductGallery.tsx` - Add blur placeholders

### Files to Create:
1. `packages/ui/src/lib/imageCompression.ts` - Image compression utility
2. `docs/design-system-implementation.md` - Implementation reference

---

### Task 1: Update Tailwind Config with Warm Parchment Theme

**Files:**
- Modify: `packages/ui/tailwind.config.ts`

- [ ] **Step 1: Read current tailwind.config.ts**

```typescript
// Current file already read - see exploration results
```

- [ ] **Step 2: Replace color palette with warm parchment theme**

```typescript
import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Claude-inspired warm palette
        primary: {
          DEFAULT: '#141413', // Anthropic Near Black
          foreground: '#faf9f5', // Ivory
        },
        secondary: {
          DEFAULT: '#e8e6dc', // Warm Sand
          foreground: '#4d4c48', // Charcoal Warm
        },
        accent: {
          DEFAULT: '#c96442', // Terracotta Brand
          foreground: '#faf9f5', // Ivory
        },
        destructive: {
          DEFAULT: '#b53333', // Error Crimson
          foreground: '#faf9f5', // Ivory
        },
        muted: {
          DEFAULT: '#f0eee6', // Border Cream
          foreground: '#87867f', // Stone Gray
        },
        // Additional warm neutrals from DESIGN.md
        parchment: '#f5f4ed',
        ivory: '#faf9f5',
        'warm-sand': '#e8e6dc',
        'dark-surface': '#30302e',
        'charcoal-warm': '#4d4c48',
        'olive-gray': '#5e5d59',
        'stone-gray': '#87867f',
        'dark-warm': '#3d3d3a',
        'warm-silver': '#b0aea5',
        'border-cream': '#f0eee6',
        'border-warm': '#e8e6dc',
        'border-dark': '#30302e',
        'ring-warm': '#d1cfc5',
        terracotta: '#c96442',
        coral: '#d97757',
        'focus-blue': '#3898ec', // Only cool color, for accessibility focus rings
      },
      borderRadius: {
        // Proper border radius scale from DESIGN.md
        sm: '4px',
        DEFAULT: '8px', // Standard buttons/cards
        md: '8px',
        lg: '12px', // Primary buttons/inputs
        xl: '16px', // Featured containers
        '2xl': '32px', // Hero/media
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'PingFang SC',
          'Microsoft YaHei',
          'Noto Sans SC',
          'sans-serif',
        ],
        serif: [
          'Georgia',
          'ui-serif',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      boxShadow: {
        // Ring-based shadow system
        'ring-warm': '0px 0px 0px 1px #d1cfc5',
        'ring-terracotta': '0px 0px 0px 1px #c96442',
        'ring-deep': '0px 0px 0px 1px #c2c0b6',
        'whisper': 'rgba(0,0,0,0.05) 0px 4px 24px',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
```

- [ ] **Step 3: Commit the Tailwind config change**

```bash
cd /d/program_self_develop/b2b/by_claude_vol
git add packages/ui/tailwind.config.ts
git commit -m "feat: update tailwind config with warm parchment theme"
```

---

### Task 2: Update Web App Global CSS

**Files:**
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Replace CSS variables with warm theme**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Warm parchment theme from DESIGN.md */
    --background: 48 20% 94%; /* #f5f4ed - Parchment */
    --foreground: 30 5% 8%;   /* #141413 - Anthropic Near Black */
    --card: 51 33% 97%;        /* #faf9f5 - Ivory */
    --card-foreground: 30 5% 8%;
    --popover: 51 33% 97%;
    --popover-foreground: 30 5% 8%;
    --primary: 30 5% 8%;        /* #141413 - Anthropic Near Black */
    --primary-foreground: 51 33% 97%;
    --secondary: 40 14% 89%;    /* #e8e6dc - Warm Sand */
    --secondary-foreground: 45 4% 29%; /* #4d4c48 - Charcoal Warm */
    --accent: 17 54% 52%;       /* #c96442 - Terracotta Brand */
    --accent-foreground: 51 33% 97%;
    --destructive: 0 56% 45%;    /* #b53333 - Error Crimson */
    --destructive-foreground: 51 33% 97%;
    --muted: 45 20% 92%;         /* #f0eee6 - Border Cream */
    --muted-foreground: 50 5% 52%; /* #87867f - Stone Gray */
    --border: 45 20% 92%;         /* #f0eee6 - Border Cream */
    --input: 40 14% 89%;          /* #e8e6dc - Warm Sand */
    --ring: 17 54% 52%;           /* #c96442 - Terracotta */
    --radius: 0.5rem;              /* 8px - Standard radius */
  }

  .dark {
    --background: 30 5% 8%;        /* #141413 - Deep Dark */
    --foreground: 51 33% 97%;
    --card: 60 2% 19%;             /* #30302e - Dark Surface */
    --card-foreground: 51 33% 97%;
    --popover: 60 2% 19%;
    --popover-foreground: 51 33% 97%;
    --primary: 51 33% 97%;
    --primary-foreground: 30 5% 8%;
    --secondary: 60 2% 19%;
    --secondary-foreground: 51 33% 97%;
    --accent: 17 54% 52%;
    --accent-foreground: 51 33% 97%;
    --destructive: 0 62% 50%;
    --destructive-foreground: 51 33% 97%;
    --muted: 60 2% 19%;
    --muted-foreground: 45 7% 67%; /* #b0aea5 - Warm Silver */
    --border: 60 2% 19%;            /* #30302e - Border Dark */
    --input: 60 2% 19%;
    --ring: 45 7% 67%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-parchment text-foreground font-sans;
  }
  /* Serif for all h1-h6 headlines per DESIGN.md */
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif font-medium; /* Weight 500 only, no bold */
  }
  h1 {
    @apply text-4xl md:text-5xl lg:text-6xl leading-tight; /* 1.10 line-height */
  }
  h2 {
    @apply text-3xl md:text-4xl lg:text-5xl leading-snug; /* 1.20 line-height */
  }
  h3 {
    @apply text-2xl md:text-3xl leading-relaxed; /* 1.30 line-height */
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  /* Improve touch targets on mobile */
  @media (pointer: coarse) {
    button, a, input, select, [role="button"] {
      min-height: 44px;
      min-width: 44px;
    }
  }
  /* Prevent text size adjust on mobile */
  html {
    -webkit-text-size-adjust: 100%;
  }
  /* Body text line-height 1.60 for editorial reading experience */
  p {
    @apply leading-relaxed;
  }
}
```

- [ ] **Step 2: Commit the web globals.css change**

```bash
git add apps/web/app/globals.css
git commit -m "feat: update web globals.css with warm parchment theme"
```

---

### Task 3: Update Admin App Global CSS

**Files:**
- Modify: `apps/admin/app/globals.css`

- [ ] **Step 1: Replace CSS variables with warm theme (same as web app)**

Use the same content as Task 2 Step 1.

- [ ] **Step 2: Commit the admin globals.css change**

```bash
git add apps/admin/app/globals.css
git commit -m "feat: update admin globals.css with warm parchment theme"
```

---

### Task 4: Update Button Component with Ring Shadows

**Files:**
- Modify: `packages/ui/src/button.tsx`

- [ ] **Step 1: Update button variants with ring shadows and warm styling**

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary: Dark Charcoal (Anthropic Near Black)
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-ring-warm hover:shadow-ring-deep',
        // Terracotta Brand accent - only for primary CTAs
        accent: 'bg-terracotta text-ivory hover:bg-terracotta/90 shadow-ring-terracotta',
        // Outline with warm border
        outline: 'border border-border-warm bg-background hover:bg-warm-sand hover:text-charcoal-warm shadow-ring-warm',
        // Warm Sand secondary
        secondary: 'bg-warm-sand text-charcoal-warm hover:bg-warm-sand/80 shadow-ring-warm',
        // Ghost - subtle hover
        ghost: 'hover:bg-warm-sand hover:text-charcoal-warm',
        // Destructive - Error Crimson
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // White Surface button from DESIGN.md
        'white-surface': 'bg-white text-primary hover:bg-warm-sand rounded-xl shadow-whisper',
        // Dark Charcoal inverted
        'dark-charcoal': 'bg-dark-surface text-ivory hover:bg-dark-surface/90 shadow-ring-warm rounded-lg',
      },
      size: {
        // Asymmetric padding for icon-first layout (0px 12px 0px 8px)
        // For standard buttons, balanced padding
        default: 'h-10 px-4 py-2 rounded-lg',
        sm: 'h-9 px-3 text-xs rounded-md',
        lg: 'h-12 px-8 text-base rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 2: Commit the Button component change**

```bash
git add packages/ui/src/button.tsx
git commit -m "feat: update button component with ring shadows and warm theme"
```

---

### Task 5: Update Card Component

**Files:**
- Modify: `packages/ui/src/card.tsx`

- [ ] **Step 1: Read current card.tsx**

- [ ] **Step 2: Update Card with warm theme styling**

```typescript
import * as React from 'react';
import { cn } from './lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border border-border-cream bg-ivory text-foreground shadow-whisper',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-serif font-medium leading-snug tracking-tight text-foreground',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-stone-gray leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

- [ ] **Step 3: Commit the Card component change**

```bash
git add packages/ui/src/card.tsx
git commit -m "feat: update card component with warm parchment theme"
```

---

### Task 6: Update Input Component

**Files:**
- Modify: `packages/ui/src/input.tsx`

- [ ] **Step 1: Read current input.tsx**

- [ ] **Step 2: Update Input with proper border radius and focus states**

```typescript
import * as React from 'react';
import { cn } from './lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-border-warm bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

- [ ] **Step 3: Commit the Input component change**

```bash
git add packages/ui/src/input.tsx
git commit -m "feat: update input component with warm theme and focus styling"
```

---

### Task 7: Create Image Compression Utility

**Files:**
- Create: `packages/ui/src/lib/imageCompression.ts`

- [ ] **Step 1: Create image compression utility**

```typescript
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
```

- [ ] **Step 2: Add exports to ui package index**

Read and update `packages/ui/src/index.ts` to export the new utilities.

- [ ] **Step 3: Commit the image compression utility**

```bash
git add packages/ui/src/lib/imageCompression.ts
git commit -m "feat: add client-side image compression utility"
```

---

### Task 8: Enhance FileUpload Component with Compression

**Files:**
- Modify: `apps/admin/components/FileUpload.tsx`

- [ ] **Step 1: Import compression utilities**

Add to top of file:
```typescript
import {
  compressImage,
  getCompressionOptionsForUploadType,
  formatFileSize,
  generateBlurPlaceholder,
  type CompressionResult,
} from '@cc-scale/ui';
```

- [ ] **Step 2: Update UploadedFile interface**

Add compression and blurPlaceholder fields.

- [ ] **Step 3: Add compression state and function**

Add async compression processing.

- [ ] **Step 4: Update validateAndProcessFiles to use compression**

Make it async and add compression logic.

- [ ] **Step 5: Update handleDrop and handleFileInput for async**

Handle promise-based validation.

- [ ] **Step 6: Add compression info display**

Show compression savings in UI.

- [ ] **Step 7: Commit the FileUpload enhancements**

```bash
git add apps/admin/components/FileUpload.tsx
git commit -m "feat: add image compression to FileUpload component"
```

---

### Task 9: Update Web App Layout with Parchment Background

**Files:**
- Modify: `apps/web/app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx**

- [ ] **Step 2: Update background from bg-white to bg-parchment**

- [ ] **Step 3: Commit the layout change**

```bash
git add apps/web/app/layout.tsx
git commit -m "feat: update web layout with parchment background"
```

---

### Task 10: Update ProductGallery with Blur Placeholders

**Files:**
- Modify: `apps/web/components/ProductGallery.tsx`

- [ ] **Step 1: Read current ProductGallery.tsx**

- [ ] **Step 2: Add blurDataURL to Next.js Image components**

- [ ] **Step 3: Commit the ProductGallery enhancement**

```bash
git add apps/web/components/ProductGallery.tsx
git commit -m "feat: add blur placeholders to ProductGallery"
```

---

## Verification

### How to Test the Changes:

1. **Build the UI package:**
```bash
cd /d/program_self_develop/b2b/by_claude_vol
npm run build --filter=@cc-scale/ui
```

2. **Run the web app:**
```bash
npm run dev --filter=web
```
Visit http://localhost:3000 and verify:
- Warm parchment background (#f5f4ed)
- Terracotta accent buttons (#c96442)
- Serif fonts for headlines
- Proper border radius on components

3. **Run the admin app:**
```bash
npm run dev --filter=admin
```
Visit http://localhost:3001 and test image upload:
- Upload large images (>2MB)
- Verify compression happens automatically
- Check file size savings display

4. **Check all components:**
- Buttons have ring shadows
- Cards use warm ivory background
- Inputs have 12px radius
- All headlines use serif font at weight 500

---

## Summary

This plan implements:
1. ✅ Complete warm parchment theme from DESIGN.md
2. ✅ Terracotta accent color system
3. ✅ Serif headlines + sans UI typography
4. ✅ Proper border radius scale
5. ✅ Ring-based shadow system
6. ✅ Client-side image compression with Canvas API
7. ✅ Type-specific optimization for product images, logos, etc.
8. ✅ Blur placeholders for Next.js Image
9. ✅ Compression ratio display in upload UI

All changes follow the design principles from DESIGN.md while maintaining backward compatibility with existing functionality.
