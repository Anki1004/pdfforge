import { Metadata } from 'next';
import { TOOL_MAP } from '@/lib/tools-config';

// This file generates the metadata for /tools/[slug]
// Each tool page imports this and re-exports it

export function generateToolMetadata(slug: string): Metadata {
  const tool = TOOL_MAP[slug];
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pdfforge.app'}/tools/${slug}`,
    },
  };
}
