import type { MetadataRoute } from 'next';
const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const paths = ['', '/about', '/academics/rankings', '/announcements', '/sports', '/admissions', '/faculty', '/events', '/gallery', '/contact'];
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: base + p, lastModified: new Date() }));
}
