// Prefixes a root-relative path with the deploy base (GitHub Pages serves under /seeblick-glut).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
