'use client';

import { useEffect } from 'react';
import { Button } from '@cc-scale/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-4xl font-bold text-[#0A1628] mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">
            An error occurred. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} className="bg-accent hover:bg-accent/90">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
