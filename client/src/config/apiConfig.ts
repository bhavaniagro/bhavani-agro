export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');

/**
 * The server's base origin (protocol + host, no /api suffix).
 * Used to resolve uploaded-file URLs stored in documents.
 */
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

/**
 * Rewrites a stored document fileUrl so it works regardless of environment.
 *
 * Problem: documents uploaded in local dev have fileUrl values like
 *   http://localhost:4000/uploads/...
 * These break in the deployed application.
 *
 * Fix: replace the origin of any stored localhost URL with the configured
 * SERVER_BASE_URL so the link always points to the correct server.
 */
export function resolveDocumentUrl(fileUrl: string | undefined): string | undefined {
  if (!fileUrl) return fileUrl;
  try {
    const parsed = new URL(fileUrl);
    // Only rewrite URLs whose host is a localhost variant
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      const configuredOrigin = new URL(SERVER_BASE_URL).origin;
      return `${configuredOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // fileUrl is not a valid URL — return it as-is
  }
  return fileUrl;
}
