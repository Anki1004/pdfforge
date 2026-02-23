import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PDFForge privacy policy — how we handle your data, what we collect, and your rights as a user.',
};

const LAST_UPDATED = 'February 1, 2025';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-10">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">Legal</span>
        <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mt-5 mb-3">Privacy Policy</h1>
        <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-8 text-[0.95rem] leading-relaxed text-white/80">

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">1. Overview</h2>
          <p>PDFForge ("we," "our," or "us") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding that information.</p>
          <p className="mt-3">PDFForge is designed with privacy as a core principle. Most PDF processing happens entirely in your browser — your files never leave your device for browser-side tools. Server-side tools process files temporarily and do not retain them.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">2. Information We Collect</h2>
          <h3 className="font-semibold text-white mb-2">2.1 Files You Process</h3>
          <p>For browser-side tools (Merge, Split, Rotate, Watermark, Sign, Annotate, Page Numbers, Reorder, Decorate): <strong className="text-white">your files never leave your device.</strong> Processing happens entirely in your browser using JavaScript. We receive no data about the files you process.</p>
          <p className="mt-3">For server-side tools (Compress, Protect, Unlock, Remove Watermark, Rasterize): your file is transmitted over HTTPS to our secure backend API, processed, and the result is returned to you. <strong className="text-white">We do not log file contents, filenames, or document metadata.</strong> Files are deleted from server memory immediately after processing. We do not retain any copies.</p>

          <h3 className="font-semibold text-white mb-2 mt-4">2.2 Usage Analytics</h3>
          <p>We collect anonymised analytics data to understand how tools are used, which tools are most popular, and how to improve performance. This data includes page views, tool usage events, and general performance metrics. It does not include any file content or personally identifiable information.</p>

          <h3 className="font-semibold text-white mb-2 mt-4">2.3 Server Logs</h3>
          <p>Our hosting infrastructure automatically logs HTTP request metadata including IP addresses, timestamps, request paths, and response codes. These logs are used for security monitoring and are retained for 30 days. IP addresses are anonymised in analytics.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">3. Cookies and Tracking</h2>
          <p>We use minimal cookies necessary for site functionality. We do not use advertising cookies, cross-site tracking cookies, or sell user data to third parties.</p>
          <p className="mt-3">If we use a third-party analytics service (such as Plausible Analytics, a privacy-focused alternative to Google Analytics), it is configured to not use cookies and to anonymise IP addresses.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">4. Third-Party Services</h2>
          <p>PDFForge is hosted on Vercel (frontend) and Railway (backend API). These services may collect server-level logs as part of their infrastructure operation. You can review their privacy policies at vercel.com/legal/privacy-policy and railway.app/legal/privacy.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">5. Children's Privacy</h2>
          <p>PDFForge does not knowingly collect any personal information from children under 13. If you are under 13, please do not use our service or provide any information about yourself.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">6. Your Rights (GDPR / CCPA)</h2>
          <p>Since we collect minimal personal data, most rights requests will be straightforward. You have the right to:</p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-muted">
            <li>Know what personal data we hold about you</li>
            <li>Request deletion of any personal data</li>
            <li>Opt out of analytics (most are anonymous)</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at hello@pdfforge.app.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">7. Security</h2>
          <p>All data transmission is encrypted via HTTPS/TLS. Server-side file processing occurs in isolated request contexts. We do not store processed files and have no long-term file storage infrastructure.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">8. Changes to This Policy</h2>
          <p>We may update this policy to reflect changes in our practices or legal requirements. We'll update the "Last updated" date at the top of this page. Continued use of PDFForge after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">9. Contact</h2>
          <p>For privacy-related questions, email us at: <strong className="text-white">hello@pdfforge.app</strong></p>
        </section>
      </div>
    </div>
  );
}
