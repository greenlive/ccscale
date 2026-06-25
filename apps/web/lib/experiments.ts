/**
 * Lightweight A/B testing framework
 * - Persistent variant assignment via cookie (no flicker across reloads)
 * - SSR-safe (assigns on first client render after hydration)
 * - Emits exposure events to window.dataLayer for GTM/GA4
 * - Zero dependencies
 *
 * Usage:
 *   const variant = useExperiment('inquiry_layout', { variants: ['drawer', 'modal'], control: 'drawer' })
 *   if (variant === 'modal') return <ModalInquiry />
 */

export type Variant = string;

export interface ExperimentConfig {
  /** Unique experiment key */
  key: string;
  /** Available variants. The first is typically the control. */
  variants: Variant[];
  /** Variant to assign to new users when cookie absent (default: variants[0]) */
  defaultVariant?: Variant;
  /** Optional: weighted distribution (must sum to 1.0). If omitted, variants are evenly distributed. */
  weights?: number[];
}

const COOKIE_NAME = 'cc-scale-exp';

interface CookieData {
  [experimentKey: string]: Variant;
}

function readCookie(): CookieData {
  if (typeof document === 'undefined') return {};
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return {};
  try {
    return JSON.parse(decodeURIComponent(raw.split('=')[1]));
  } catch {
    return {};
  }
}

function writeCookie(data: CookieData) {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(data));
  // 1 year persistence
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

function pickVariant(cfg: ExperimentConfig): Variant {
  if (cfg.weights && cfg.weights.length === cfg.variants.length) {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < cfg.variants.length; i++) {
      cumulative += cfg.weights[i];
      if (r <= cumulative) return cfg.variants[i];
    }
    return cfg.variants[cfg.variants.length - 1];
  }
  const idx = Math.floor(Math.random() * cfg.variants.length);
  return cfg.variants[idx];
}

/**
 * Get the assigned variant for an experiment.
 * - Reads cookie first (so reloads stay consistent)
 * - If absent, picks one and persists it
 * - Emits an `experiment_exposure` event to dataLayer on first assignment
 */
export function getVariant(cfg: ExperimentConfig): Variant {
  const cookies = readCookie();
  if (cookies[cfg.key]) return cookies[cfg.key];

  const variant = pickVariant(cfg);
  cookies[cfg.key] = variant;
  writeCookie(cookies);

  // Emit exposure (GTM/GA4 will pick this up via dataLayer)
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'experiment_exposure',
      experiment_key: cfg.key,
      experiment_variant: variant,
    });
  }

  return variant;
}

/**
 * Force a specific variant (for QA or testing).
 */
export function forceVariant(key: string, variant: Variant): void {
  const cookies = readCookie();
  cookies[key] = variant;
  writeCookie(cookies);
}

/**
 * Reset all experiment assignments (debug only).
 */
export function resetExperiments(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  }
}

// ----- Experiment definitions (single source of truth) -----

export const EXPERIMENTS = {
  inquiry_layout: {
    key: 'inquiry_layout',
    variants: ['drawer', 'modal'],
    defaultVariant: 'drawer',
  },
  inquiry_position: {
    key: 'inquiry_position',
    variants: ['bottom_right', 'bottom_center'],
    defaultVariant: 'bottom_right',
    weights: [0.5, 0.5],
  },
} as const satisfies Record<string, ExperimentConfig>;

export type ExperimentKey = keyof typeof EXPERIMENTS;