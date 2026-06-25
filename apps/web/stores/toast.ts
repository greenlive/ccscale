'use client';

import { create } from 'zustand';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  duration: number; // ms
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: ({ kind, title, description, duration = 4000 }) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: Toast = { id, kind, title, description, duration };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/**
 * useToast — React hook returning localized-aware convenience methods.
 * Use this in components so titles can be looked up via useTranslations.
 */
export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    push,
    success: (title: string, description?: string) => push({ kind: 'success', title, description }),
    error: (title: string, description?: string) => push({ kind: 'error', title, description, duration: 6000 }),
    info: (title: string, description?: string) => push({ kind: 'info', title, description }),
    warning: (title: string, description?: string) => push({ kind: 'warning', title, description }),
    dismiss: useToastStore((s) => s.dismiss),
  };
}

/**
 * Imperative API for non-React code (event handlers, fetch callbacks).
 * Use the hook version in React components for full i18n support.
 */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'error', title, description, duration: 6000 }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'info', title, description }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'warning', title, description }),
};