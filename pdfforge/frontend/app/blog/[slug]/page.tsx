import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from '@/lib/blog-posts';
import { TOOLS } from '@/lib/tools-config';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

// Extract FAQ items from post content (h3 tags followed by <p>)
function extractFAQs(html: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  const matches = html.matchAll(/<h3>([\s\S]*?)<\/h3>/g);
  for (const m of matches) {
    faqs.push({
      q: m[1].replace(/<[^>]+>/g, ''),
      a: m[2].replace(/<[^>]+>/g, ''),
    });
  }
  return faqs.slice(0, 8); // Max 8 FAQ items for schema
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(params.slug, 3);
  const faqs = extractFAQs(post.content);

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'PDFForge' },
    publisher: { '@type': 'Organization', name: 'PDFForge', url: 'https://pdfforge.app' },
  };

  // Pick a few tools to suggest based on post slug
  const suggestedToolIds: string[] = [];
  if (post.slug.includes('merge'))           suggestedToolIds.push('merge', 'split', 'compress');
  else if (post.slug.includes('compress'))   suggestedToolIds.push('compress', 'merge', 'protect');
  else if (post.slug.includes('watermark'))  suggestedToolIds.push('watermark', 'remove-watermark', 'protect');
  else if (post.slug.includes('password') || post.slug.includes('protect')) suggestedToolIds.push('protect', 'unlock', 'sign');
  else if (post.slug.includes('sign'))       suggestedToolIds.push('sign', 'protect', 'annotate');
  else if (post.slug.includes('split'))      suggestedToolIds.push('split', 'merge', 'compress');
  else                                        suggestedToolIds.push('merge', 'compress', 'protect');

  const suggestedTools = TOOLS.filter(t => suggestedToolIds.includes(t.id)).slice(0, 3);

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main content */}
          <article>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted mb-8">
              <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors no-underline">Blog</Link>
              <span>/</span>
              <span className="text-white truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {post.category}
                </span>
                <span className="text-xs text-muted">{post.readTime}</span>
                <span className="text-xs text-muted">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="font-display font-black text-[clamp(1.8rem,4vw,3rem)] tracking-tight leading-[1.1] mb-5">
                {post.title}
              </h1>
              <p className="text-muted text-lg leading-relaxed max-w-2xl">{post.description}</p>
            </header>

            {/* Body */}
            <div
              className="blog-content prose-custom"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-white/[0.07]">
              <p className="text-xs text-muted mb-3 uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map(k => (
                  <span key={k} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-muted">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            {/* Try the tools */}
            <div className="sticky top-28 space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <h3 className="font-display font-semibold text-sm mb-4 text-muted uppercase tracking-wider">
                  Try These Free Tools
                </h3>
                <ul className="space-y-3 list-none p-0 m-0">
                  {suggestedTools.map(tool => (
                    <li key={tool.id}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-accent/30 hover:bg-white/[0.06] transition-all no-underline group"
                      >
                        <span className="text-xl">{tool.icon}</span>
                        <div>
                          <p className="text-sm font-medium group-hover:text-accent transition-colors">{tool.name}</p>
                          <p className="text-xs text-muted">{tool.tagline}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/#tools" className="block mt-4 btn-primary text-sm py-2.5 text-center justify-center">
                  View All {TOOLS.length} Tools →
                </Link>
              </div>

              {/* All posts link */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <h3 className="font-display font-semibold text-sm mb-1 uppercase tracking-wider text-muted">More Guides</h3>
                <p className="text-xs text-muted mb-4">Explore all our PDF how-to articles</p>
                <Link href="/blog" className="block text-center text-sm text-accent hover:underline font-medium">
                  Browse all articles →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        <section className="mt-16 pt-12 border-t border-white/[0.07]">
          <h2 className="font-display font-bold text-xl mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map(p => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-accent/30 hover:bg-white/[0.05] transition-all no-underline"
              >
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent self-start mb-3">
                  {p.category}
                </span>
                <h3 className="font-display font-semibold text-sm leading-snug mb-2 group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-muted line-clamp-2 mb-3">{p.description}</p>
                <span className="text-accent text-xs font-medium mt-auto">Read →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
