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
