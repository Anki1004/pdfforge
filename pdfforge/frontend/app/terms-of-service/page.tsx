import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'PDFForge Terms of Service — acceptable use policy, disclaimers, and terms governing your use of our free PDF tools.',
};

const LAST_UPDATED = 'February 1, 2025';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-10">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">Legal</span>
        <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mt-5 mb-3">Terms of Service</h1>
        <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-8 text-[0.95rem] leading-relaxed text-white/80">

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using PDFForge (available at pdfforge.app), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use PDFForge.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">2. Description of Service</h2>
          <p>PDFForge provides free, browser-based PDF processing tools including but not limited to: merging, splitting, compressing, watermarking, password protecting, rotating, signing, and annotating PDF files.</p>
          <p className="mt-3">PDFForge is provided "as is" and "as available." We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">3. Acceptable Use</h2>
          <p>You agree to use PDFForge only for lawful purposes. You must not use PDFForge to:</p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-muted">
            <li>Process documents containing illegal content</li>
            <li>Circumvent copyright protection or DRM on documents you do not own</li>
            <li>Remove watermarks, signatures, or markings from documents without authorisation</li>
            <li>Process documents belonging to others without their consent</li>
            <li>Attempt to overload, attack, or exploit our infrastructure</li>
            <li>Use automated bots or scripts to abuse the free tier</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">4. Intellectual Property</h2>
          <p>You retain full ownership of all documents you process with PDFForge. We claim no intellectual property rights over files you upload or download.</p>
          <p className="mt-3">The PDFForge software, design, and content (excluding your files) are owned by PDFForge and protected by intellectual property law. You may not copy, reproduce, or redistribute our software or design without written permission.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">5. Privacy and Data</h2>
          <p>Your use of PDFForge is also governed by our <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference. The Privacy Policy explains how we handle the data associated with your use of the service.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">6. Disclaimer of Warranties</h2>
          <p>PDFForge is provided free of charge and without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that the output files will meet your specific requirements.</p>
          <p className="mt-3">We strongly recommend keeping original copies of all files before processing them with any tool, including PDFForge. File processing always carries a risk of data loss.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law, PDFForge shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service, including but not limited to loss of data, files, or business interruption.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">8. Service Availability</h2>
          <p>PDFForge is provided free of charge with no uptime guarantee. We may perform maintenance, upgrades, or modifications that temporarily affect availability. We will endeavour to provide advance notice for significant planned downtime.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">9. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of PDFForge shall be resolved through good-faith negotiation before pursuing formal legal proceedings.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">10. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Updated Terms will be posted at this URL with an updated "Last updated" date. Continued use of PDFForge following changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">11. Contact</h2>
          <p>Questions about these Terms? Email us at: <strong className="text-white">hello@pdfforge.app</strong></p>
        </section>
      </div>
    </div>
  );
}
