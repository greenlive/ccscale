'use client';

import { useEffect, useState } from 'react';
import { ExperimentConfig, getVariant, Variant } from '@/lib/experiments';

/**
 * React hook for A/B testing.
 * Returns the assigned variant, picking one on first mount.
 *
 * SSR-safe: returns the default variant on the server to avoid hydration mismatch.
 * The actual assignment happens in useEffect on the client and re-renders if needed.
 */
export function useExperiment(cfg: ExperimentConfig): Variant {
  const [variant, setVariant] = useState<Variant>(
    cfg.defaultVariant ?? cfg.variants[0]
  );

  useEffect(() => {
    const assigned = getVariant(cfg);
    if (assigned !== variant) setVariant(assigned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.key]);

  return variant;
}