import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'PDFForge is a free browser-based PDF toolkit. Learn about our mission to provide private, fast, and free PDF tools to everyone.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-10">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">About</span>
        <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mt-5 mb-4">About PDFForge</h1>
        <p className="text-muted text-lg">Free, private, fast PDF tools for everyone.</p>
      </div>

      <div className="space-y-8 text-[0.95rem] leading-relaxed text-white/80">
        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Our Mission</h2>
          <p>PDFForge was built on a simple premise: everyone should be able to work with PDF files without paying for expensive software, creating accounts, or uploading sensitive documents to unknown servers.</p>
          <p className="mt-3">We believe privacy-first tools and professional-grade quality aren't mutually exclusive. PDFForge processes most files entirely in your browser — your documents never leave your device unless you explicitly choose server-side features for tasks that genuinely require it (like Ghostscript-powered compression).</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">What We Build</h2>
          <p>PDFForge is a growing collection of browser-based PDF utilities. Currently we offer {' '}
            <Link href="/#tools" className="text-accent hover:underline">13+ tools</Link>, including:</p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-muted">
            <li>PDF Merge — combine multiple PDFs into one</li>
            <li>PDF Split — extract pages or split by range</li>
            <li>PDF Compress — Ghostscript-powered file size reduction</li>
            <li>PDF Protect — AES-256 password encryption</li>
            <li>PDF Sign — draw, type, or upload your signature</li>
            <li>Watermark, Rotate, Annotate, Reorder, and more</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Our Privacy-First Approach</h2>
          <p>Unlike many free PDF tools, PDFForge doesn't harvest your documents for training data, doesn't retain processed files on servers, and doesn't require an account to use any tool. We process files locally in your browser using JavaScript libraries (pdf-lib) wherever possible, and use a secure server-side pipeline only for computationally intensive tasks like compression.</p>
          <p className="mt-3">When server processing is used, files are processed and discarded immediately — we do not log file contents, filenames, or document metadata.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Technology</h2>
          <p>PDFForge is built with:</p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-muted">
            <li><strong className="text-white">Frontend</strong>: Next.js, TypeScript, Tailwind CSS</li>
            <li><strong className="text-white">Client-side PDF processing</strong>: pdf-lib (open source)</li>
            <li><strong className="text-white">Server-side processing</strong>: FastAPI, Ghostscript, qpdf</li>
            <li><strong className="text-white">Hosting</strong>: Vercel (frontend), Railway (backend)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Contact & Feedback</h2>
          <p>We're actively developing new tools and improving existing ones. If you've encountered a bug, have a feature request, or want to report an issue, we'd love to hear from you.</p>
          <p className="mt-3">
            <Link href="/contact" className="text-accent hover:underline">Get in touch via our contact page →</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
