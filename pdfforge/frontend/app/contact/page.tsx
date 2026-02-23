import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with PDFForge for bug reports, feature requests, or general questions about our free PDF tools.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-10">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">Contact</span>
        <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mt-5 mb-4">Get in Touch</h1>
        <p className="text-muted text-lg">We read every message. Typical response time: 24–48 hours on business days.</p>
      </div>

      <div className="grid gap-6 mb-10">
        {[
          {
            icon: '🐛',
            title: 'Bug Reports',
            desc: 'Found something broken? Tell us your browser, OS, and what happened. Include the file size if relevant.',
          },
          {
            icon: '💡',
            title: 'Feature Requests',
            desc: 'Have an idea for a new tool or improvement? We prioritise based on demand.',
          },
          {
            icon: '🔒',
            title: 'Privacy Concerns',
            desc: 'Questions about how we handle your data? Read our Privacy Policy first, then reach out if you have further questions.',
          },
          {
            icon: '🤝',
            title: 'Business Enquiries',
            desc: 'API access, white-label solutions, or partnership opportunities.',
          },
        ].map(item => (
          <div
            key={item.title}
            className="flex gap-4 p-5 bg-white/[0.03] border border-white/[0.07] rounded-xl"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
        <h2 className="font-display font-bold text-lg mb-2">Email Us</h2>
        <p className="text-muted text-sm mb-6">Send your message to the address below. For bug reports, please include your browser name and version.</p>

        <div className="flex items-center gap-3 p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent flex-shrink-0">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-medium">hello@pdfforge.app</span>
        </div>

        <p className="text-xs text-muted mt-4">We aim to respond within 1–2 business days. For urgent issues, please include "URGENT" in the subject line.</p>
      </div>
    </div>
  );
}
