/**
 * Resolve URL for static data files (public folder).
 * Uses Vite BASE_URL so fetches work in dev and production (including with base path).
 */
export function getStaticDataUrl(path: string): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '') || '';
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${normalized}`;
}
