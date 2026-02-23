import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-config';
import { BLOG_POSTS } from '@/lib/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://pdfforge.app';
  const now  = new Date().toISOString();

  const home: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map(tool => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
  ];

  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    { url: `${base}/about`,            lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${base}/contact`,          lastModified: now, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${base}/privacy-policy`,   lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${base}/disclaimer`,       lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
  ];

  return [...home, ...toolPages, ...blogIndex, ...blogPosts, ...legalPages];
}
