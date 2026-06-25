/**
 * Magic-byte (file signature) detection.
 *
 * Reads the first 12 bytes of a buffer and infers a normalized MIME type
 * and safe extension. We do not depend on `file-type` to keep the bundle
 * small; the supported list covers images, video and PDFs that we accept.
 *
 * Returns null when the buffer does not match any known signature.
 */

export type SniffResult = { mime: string; ext: string };

// 12-byte signature table (hex)
const SIGNATURES: Array<{ mime: string; ext: string; sig: number[]; offset?: number }> = [
  // Images
  { mime: 'image/jpeg', ext: 'jpg', sig: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', ext: 'png', sig: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/gif', ext: 'gif', sig: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', ext: 'webp', sig: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // "RIFF" + 4 bytes + "WEBP"
  // SVG is text-based, validated below
  // PDF
  { mime: 'application/pdf', ext: 'pdf', sig: [0x25, 0x50, 0x44, 0x46] },
  // Video
  { mime: 'video/mp4', ext: 'mp4', sig: [0x00, 0x00, 0x00] }, // need more checks; use ISO BMFF check
  { mime: 'video/webm', ext: 'webm', sig: [0x1a, 0x45, 0xdf, 0xa3] },
  { mime: 'video/quicktime', ext: 'mov', sig: [0x00, 0x00, 0x00] }, // ftyp
];

function startsWith(buf: Buffer, sig: number[], offset = 0): boolean {
  if (buf.length < offset + sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (buf[offset + i] !== sig[i]) return false;
  }
  return true;
}

export function sniffMimeType(buf: Buffer): SniffResult | null {
  if (!buf || buf.length < 4) return null;

  if (startsWith(buf, [0xff, 0xd8, 0xff])) return { mime: 'image/jpeg', ext: 'jpg' };
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { mime: 'image/png', ext: 'png' };
  if (startsWith(buf, [0x47, 0x49, 0x46, 0x38])) return { mime: 'image/gif', ext: 'gif' };
  if (startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && buf.length >= 12 && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    return { mime: 'image/webp', ext: 'webp' };
  }
  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46])) return { mime: 'application/pdf', ext: 'pdf' };
  if (startsWith(buf, [0x1a, 0x45, 0xdf, 0xa3])) return { mime: 'video/webm', ext: 'webm' };
  // MP4 / MOV: bytes 4..7 are "ftyp"
  if (buf.length >= 8 && buf.slice(4, 8).toString('ascii') === 'ftyp') {
    const brand = buf.slice(8, 12).toString('ascii');
    if (brand === 'qt  ' || brand.startsWith('qt')) return { mime: 'video/quicktime', ext: 'mov' };
    return { mime: 'video/mp4', ext: 'mp4' };
  }
  // SVG: text-based XML
  const head = buf.slice(0, 256).toString('utf8').trimStart();
  if (/^<\?xml[\s\S]*?<\s*svg[\s>]/i.test(head) || /^<\s*svg[\s>]/i.test(head)) {
    return { mime: 'image/svg+xml', ext: 'svg' };
  }
  return null;
}

/**
 * Map an uploadType to the set of allowed MIME types (after magic-byte check).
 */
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  'product-image': ['image/jpeg', 'image/png', 'image/webp'],
  'category-image': ['image/jpeg', 'image/png', 'image/webp'],
  'product-video': ['video/mp4', 'video/webm', 'video/quicktime'],
  'testimonial': ['image/jpeg', 'image/png'],
  'client-logo': ['image/png', 'image/svg+xml'],
  'factory-image': ['image/jpeg', 'image/png'],
  'general': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

export const MAX_BYTES_BY_TYPE: Record<string, number> = {
  'product-image': 10 * 1024 * 1024,
  'category-image': 5 * 1024 * 1024,
  'product-video': 200 * 1024 * 1024,
  'testimonial': 5 * 1024 * 1024,
  'client-logo': 2 * 1024 * 1024,
  'factory-image': 15 * 1024 * 1024,
  'general': 10 * 1024 * 1024,
};
