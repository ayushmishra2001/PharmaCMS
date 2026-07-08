/**
 * Image Utilities for Responsive Breakpoints, ALT Text, and SEO Title management.
 * Supports fallback to standard string URLs.
 */

export interface EnhancedImagePayload {
  original: string;
  large: string;
  medium: string;
  thumbnail: string;
  alt: string;
  title: string;
}

/**
 * Safely extracts the image source URL for a given breakpoint.
 * Fallbacks to the raw URL if not JSON-structured.
 */
export function getImgSrc(
  imgStr: string | undefined,
  size: 'thumbnail' | 'medium' | 'large' | 'original' = 'original'
): string {
  if (!imgStr) return '';
  if (imgStr.startsWith('{"')) {
    try {
      const obj = JSON.parse(imgStr) as EnhancedImagePayload;
      return obj[size] || obj.original || imgStr;
    } catch (e) {
      return imgStr;
    }
  }
  return imgStr;
}

/**
 * Safely extracts the ALT text for a given image.
 */
export function getImgAlt(imgStr: string | undefined, fallback: string = ''): string {
  if (!imgStr) return fallback;
  if (imgStr.startsWith('{"')) {
    try {
      const obj = JSON.parse(imgStr) as EnhancedImagePayload;
      return obj.alt || fallback;
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
}

/**
 * Safely extracts the SEO title / caption for a given image.
 */
export function getImgTitle(imgStr: string | undefined, fallback: string = ''): string {
  if (!imgStr) return fallback;
  if (imgStr.startsWith('{"')) {
    try {
      const obj = JSON.parse(imgStr) as EnhancedImagePayload;
      return obj.title || fallback;
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
}
