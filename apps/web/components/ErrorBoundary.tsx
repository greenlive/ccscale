'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@cc-scale/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-ivory rounded-xl border border-border-cream p-8 text-center shadow-whisper">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-terracotta" />
            </div>
            <h2 className="text-xl font-serif font-medium text-foreground mb-3">
              Something went wrong
            </h2>
            <p className="text-stone-gray mb-6 text-sm">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <Button
              onClick={this.handleReset}
              variant="accent"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple skeleton loader component
export function Skeleton({
  className = '',
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  if (lines === 1) {
    return (
      <div className={`animate-pulse bg-warm-sand rounded ${className}`} />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-warm-sand rounded h-4 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="bg-ivory rounded-xl border border-border-cream p-6 shadow-whisper animate-pulse">
      <div className="w-full h-48 bg-warm-sand rounded-lg mb-4" />
      <div className="h-6 bg-warm-sand rounded w-3/4 mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-warm-sand rounded w-full" />
        <div className="h-4 bg-warm-sand rounded w-5/6" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 bg-warm-sand rounded w-20" />
        <div className="h-8 bg-warm-sand rounded w-20" />
      </div>
    </div>
  );
}

// Grid skeleton loader
export function GridSkeleton({
  count = 3,
  CardComponent = CardSkeleton,
}: {
  count?: number;
  CardComponent?: typeof CardSkeleton;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  );
}

// List skeleton loader
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-ivory rounded-xl border border-border-cream animate-pulse">
          <div className="w-12 h-12 bg-warm-sand rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-warm-sand rounded w-1/3" />
            <div className="h-3 bg-warm-sand rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
