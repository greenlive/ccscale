'use client';

import { create } from 'zustand';
import { useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  cycle: () => void;
  // Init runs once on client mount and sets the resolved theme
  init: () => void;
}

const STORAGE_KEY = 'cc-scale-theme';

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemPreference() : mode;
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  // Update meta theme-color for mobile browsers
  const themeColor = resolved === 'dark' ? '#141413' : '#f5f4ed';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  resolved: 'light',
  setMode: (mode) => {
    const resolved = resolveTheme(mode);
    set({ mode, resolved });
    applyTheme(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  },
  cycle: () => {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(get().mode);
    get().setMode(order[(idx + 1) % order.length]);
  },
  init: () => {
    let stored: ThemeMode = 'system';
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'system') stored = v;
    } catch {}
    const resolved = resolveTheme(stored);
    set({ mode: stored, resolved });
    applyTheme(resolved);

    // Listen for system preference changes (when mode === 'system')
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (get().mode === 'system') {
        const r = resolveTheme('system');
        set({ resolved: r });
        applyTheme(r);
      }
    };
    mq.addEventListener('change', handler);
  },
}));

/**
 * ThemeInit — call once in a top-level client component to bootstrap the theme
 * Must be rendered inside a client tree (e.g. inside NextIntlClientProvider).
 */
export function ThemeInit() {
  const init = useThemeStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return null;
}