import type { Config } from 'tailwindcss';
import sharedConfig from '@cc-scale/ui/tailwind.config';

const config = {
  ...sharedConfig,
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
} satisfies Config;

export default config;
