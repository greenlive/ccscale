'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsTrackerWrapper() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  
  useEffect(() => {
    // Lazy load the AnalyticsTracker only on the client side
    import('./AnalyticsTracker').then(mod => {
      setComponent(() => mod.default);
    }).catch(err => {
      console.error('Failed to load AnalyticsTracker:', err);
    });
  }, []);
  
  if (!Component) {
    return null;
  }
  
  return <Component />;
}