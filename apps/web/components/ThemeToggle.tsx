'use client';

import { useThemeStore, ThemeMode } from '@/stores/theme';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@cc-scale/ui';

const modes: Array<{ value: ThemeMode; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  // Avoid hydration mismatch — only render icons after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = modes.find((m) => m.value === mode) ?? modes[2];
  const Icon = current.Icon;

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => {
          // Smooth transition on theme change
          const root = document.documentElement;
          root.classList.add('theme-transitioning');
          setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
          window.setTimeout(() => root.classList.remove('theme-transitioning'), 300);
        }}
        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={`Theme: ${current.label}. Click to change.`}
        title={`Theme: ${current.label}`}
      >
        {mounted ? <Icon className="h-4 w-4" /> : <Sun className="h-4 w-4 opacity-0" />}
      </button>
    </div>
  );
}