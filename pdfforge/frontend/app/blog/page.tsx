import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'PDF Guides & How-To Articles',
  description: 'Free guides on working with PDFs — how to compress, merge, sign, protect, and convert PDF files. Practical tutorials for everyday PDF tasks.',
  openGraph: {
    title: 'PDF Guides & How-To Articles | PDFForge',
    description: 'Practical PDF tutorials — merge, compress, sign, protect, and more.',
  },
};

const categories = ['All', 'How-To', 'Education', 'Reviews', 'Business'];

function CategoryBadge({ category }: { category: string }) {
  const colours: Record<string, string> = {
    'How-To':    'bg-accent/10 text-accent border-accent/20',
    'Education': 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    'Reviews':   'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    'Business':  'bg-accent-green/10 text-accent-green border-accent-green/20',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colours[category] ?? 'bg-white/5 text-muted border-white/10'}`}>
      {category}
    </span>
  );
}

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-accent/[0.1] border border-accent/20 text-accent text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          PDF Guides & Tutorials
        </div>
        <h1 className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-4">
          Learn Everything About PDFs
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Practical how-to guides, tool comparisons, and expert advice for anyone who works with PDF files.
        </p>
      </div>

      {/* Featured Post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group block bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-accent/30 hover:bg-white/[0.05] transition-all duration-300 mb-12 no-underline"
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-5">
            <CategoryBadge category={featured.category} />
            <span className="text-xs text-muted">{featured.readTime}</span>
            <span className="text-xs text-muted">{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-3 group-hover:text-accent transition-colors">
            {featured.title}
          </h2>
          <p className="text-muted leading-relaxed max-w-2xl mb-5">{featured.description}</p>
          <span className="text-accent text-sm font-medium group-hover:underline">Read article →</span>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-accent/30 hover:bg-white/[0.05] transition-all duration-300 no-underline"
          >
            <div className="flex items-center gap-2 mb-4">
              <CategoryBadge category={post.category} />
              <span className="text-xs text-muted ml-auto">{post.readTime}</span>
            </div>
            <h3 className="font-display font-semibold text-base leading-snug mb-2 group-hover:text-accent transition-colors flex-1">
              {post.title}
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">{post.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-muted">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="text-accent text-xs font-medium group-hover:underline">Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
