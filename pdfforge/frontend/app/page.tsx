import type { Metadata } from 'next';
import { TOOLS } from '@/lib/tools-config';
import { ToolCard } from '@/components/ToolCard';

export const metadata: Metadata = {
  title: 'PDFForge — Free Online PDF Tools | Merge, Split, Compress',
  description: 'The complete free online PDF toolkit. Merge, split, compress, watermark, rotate, sign, and more — 100% private, no uploads required.',
};

const features = [
  { icon: '⚡', name: 'Lightning Fast', desc: 'Browser-native processing means no server round trips for most tools. Results in seconds.' },
  { icon: '🔒', name: 'Zero Upload', desc: 'Files never leave your device. All JavaScript processing runs 100% client-side in your browser.' },
  { icon: '🎯', name: 'Precise Control', desc: 'Fine-tune every setting with intuitive controls, sliders, and instant live previews.' },
  { icon: '📱', name: 'Mobile Ready', desc: 'Fully responsive design that works flawlessly on phones, tablets, and desktops.' },
  { icon: '💪', name: 'Server Power', desc: 'Tools that need real compression or encryption use our secure backend with Ghostscript & qpdf.' },
  { icon: '💰', name: 'Always Free', desc: 'No subscriptions, no watermarks on output, no page limits, no hidden costs.' },
];

const stats = [
  { num: '13+', label: 'PDF tools available' },
  { num: '0', label: 'Files uploaded to servers' },
  { num: '100%', label: 'Browser-based processing' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-36 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/[0.1] border border-accent/20 text-accent text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot" />
            100% Secure · Processed in Your Browser
          </div>

          <h1 className="font-display font-black text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.05] tracking-[-0.04em] mb-6">
            The{' '}
            <span className="relative inline-block text-accent">
              Ultimate
              <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-accent opacity-40 rounded" />
            </span>
            <br />
            PDF Toolkit
          </h1>

          <p className="text-lg text-muted leading-relaxed max-w-[540px] mx-auto mb-10 font-light">
            Merge, watermark, split, compress, rotate, sign, and transform your PDFs — all in one place. No uploads. No account. Completely private.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#tools" className="btn-primary text-base px-8 py-4">
              Start Using Tools ↓
            </a>
            <a href="#features" className="btn-ghost text-base px-8 py-4">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden">
          {stats.map(s => (
            <div key={s.label} className="bg-surface px-6 py-5 text-center">
              <div className="font-display font-black text-3xl text-accent tracking-[-0.04em] mb-1">{s.num}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tools Grid ────────────────────────────────────────────── */}
      <section id="tools" className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="section-label">All Tools</div>
          <h2 className="font-display font-black text-[clamp(1.8rem,3vw,2.8rem)] tracking-tight mb-3">
            Everything your PDFs need
          </h2>
          <p className="text-muted max-w-md leading-relaxed">
            Professional-grade tools, browser-first with server power where it counts. Fast, private, and free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </section>

      {/* ── Privacy Strip ─────────────────────────────────────────── */}
      <div id="privacy" className="px-6 max-w-7xl mx-auto mb-16">
        <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 md:p-8 flex flex-wrap items-start md:items-center gap-6">
          <div className="text-4xl flex-shrink-0">🛡️</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg mb-1">Your privacy is our top priority</h3>
            <p className="text-sm text-muted leading-relaxed max-w-lg">
              All PDF processing happens locally in your browser using JavaScript. No files are ever uploaded to any server. Your documents never leave your device.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['🔒 No Upload','🛡️ No Storage','✓ GDPR Safe','🌐 Offline Ready'].map(b => (
              <span key={b} className="badge bg-accent-green/[0.08] border border-accent-green/20 text-accent-green text-xs">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features Grid ─────────────────────────────────────────── */}
      <section id="features" className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="section-label">Why PDFForge</div>
          <h2 className="font-display font-black text-[clamp(1.8rem,3vw,2.8rem)] tracking-tight mb-3">
            Built for speed &amp; simplicity
          </h2>
          <p className="text-muted max-w-md leading-relaxed">
            No learning curve. No installs. Open, upload, done.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden">
          {features.map(f => (
            <div key={f.name} className="bg-surface p-6 md:p-7">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h4 className="font-display font-bold text-sm mb-2">{f.name}</h4>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-3xl mx-auto text-center">
        <h2 className="font-display font-black text-[clamp(1.8rem,3vw,2.5rem)] tracking-tight mb-4">
          Ready to work smarter with PDFs?
        </h2>
        <p className="text-muted mb-8">Pick any tool above and get started in seconds. No account needed.</p>
        <a href="#tools" className="btn-primary text-base px-10 py-4">
          Choose a Tool →
        </a>
      </section>
    </>
  );
}
