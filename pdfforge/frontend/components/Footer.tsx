import Link from 'next/link';
import { TOOLS } from '@/lib/tools-config';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.07] mt-16 pt-12 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 no-underline group">
              <div className="w-7 h-7 bg-accent rounded-lg grid place-items-center">
                <svg viewBox="0 0 18 18" fill="none" className="w-3.5 h-3.5">
                  <rect x="3" y="1" width="10" height="13" rx="1.5" stroke="#0a0a0f" strokeWidth="1.8"/>
                  <path d="M5 5h6M5 8h6M5 11h4" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-black text-base">PDF<span className="text-accent">Forge</span></span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-[200px]">
              Free online PDF tools. No uploads, no sign up. All processing is local.
            </p>
          </div>

          {/* Tools col 1 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted2 mb-3">Edit & Organize</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {TOOLS.filter(t => ['merge','split','rotate','reorder','page-numbers'].includes(t.id)).map(t => (
                <li key={t.id}>
                  <Link href={`/tools/${t.slug}`} className="text-xs text-muted hover:text-white transition-colors no-underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted2 mb-3">Security & Convert</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {TOOLS.filter(t => ['compress','protect','unlock','watermark','remove-watermark'].includes(t.id)).map(t => (
                <li key={t.id}>
                  <Link href={`/tools/${t.slug}`} className="text-xs text-muted hover:text-white transition-colors no-underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted2 mb-3">Enhance</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {TOOLS.filter(t => ['sign','annotate','decorate'].includes(t.id)).map(t => (
                <li key={t.id}>
                  <Link href={`/tools/${t.slug}`} className="text-xs text-muted hover:text-white transition-colors no-underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted2 mb-3">Company</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><Link href="/blog" className="text-xs text-muted hover:text-white transition-colors no-underline">Blog & Guides</Link></li>
              <li><Link href="/about" className="text-xs text-muted hover:text-white transition-colors no-underline">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-muted hover:text-white transition-colors no-underline">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-xs text-muted hover:text-white transition-colors no-underline">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-xs text-muted hover:text-white transition-colors no-underline">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-xs text-muted hover:text-white transition-colors no-underline">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {year} PDFForge. All PDF processing is local. No files leave your device.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacy-policy" className="text-xs text-muted hover:text-white transition-colors no-underline">Privacy</Link>
            <Link href="/terms-of-service" className="text-xs text-muted hover:text-white transition-colors no-underline">Terms</Link>
            <span className="badge bg-accent-green/[0.08] border border-accent-green/20 text-accent-green">🔒 No Upload</span>
            <span className="badge bg-accent-green/[0.08] border border-accent-green/20 text-accent-green">🛡️ GDPR Safe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
