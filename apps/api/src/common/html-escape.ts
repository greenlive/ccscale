/**
 * Minimal HTML escape for safe interpolation into email HTML.
 *
 * Mirrors lodash's escape: escapes &, <, >, ", and '.
 * Use whenever you insert user-controlled strings into HTML email bodies.
 */
export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return '';
  const s = String(input);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape a value intended for an href="..." attribute.
 * Strips dangerous URL schemes (javascript:, data:, vbscript:).
 */
export function escapeUrl(input: unknown): string {
  const s = String(input ?? '').trim();
  if (/^(javascript|data|vbscript):/i.test(s)) return '#';
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
