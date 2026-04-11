'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-4xl font-bold text-[#0A1628] mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-8">
                Please try refreshing the page.
              </p>
              <button
                onClick={reset}
                className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
