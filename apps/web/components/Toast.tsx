'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, Toast as ToastItem, ToastKind } from '@/stores/toast';
import { cn } from '@cc-scale/ui';

const icons: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastKind, string> = {
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/80 dark:border-green-800 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/80 dark:border-red-800 dark:text-red-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-100',
  warning: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-100',
};

const iconStyles: Record<ToastKind, string> = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const Icon = icons[toast.kind];

  return (
    <div
      role={toast.kind === 'error' ? 'alert' : 'status'}
      aria-live={toast.kind === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm min-w-[280px] max-w-md',
        'animate-in slide-in-from-right-full fade-in duration-300',
        styles[toast.kind]
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconStyles[toast.kind])} aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity p-0.5"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Toast viewport — renders the stacked list of toasts.
 * Place once at the root layout.
 */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const clear = useToastStore((s) => s.clear);

  // Keyboard: Esc dismisses the topmost toast
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        useToastStore.getState().dismiss(toasts[toasts.length - 1].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toasts.length]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}