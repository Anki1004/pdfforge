import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'PDFForge disclaimer — limitations, no legal or professional advice, and your responsibility for file processing outcomes.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-10">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">Legal</span>
        <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight mt-5 mb-3">Disclaimer</h1>
        <p className="text-muted text-sm">Please read before using PDFForge.</p>
      </div>

      <div className="space-y-8 text-[0.95rem] leading-relaxed text-white/80">

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">General Disclaimer</h2>
          <p>PDFForge ("pdfforge.app") provides free online PDF processing tools for general informational and productivity purposes. The service is provided "as is" with no guarantees of accuracy, reliability, completeness, or fitness for any particular purpose.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">No Legal Advice</h2>
          <p>Nothing on PDFForge constitutes legal advice. Information provided in our blog articles, guides, and help documentation is for general informational purposes only and should not be relied upon as legal guidance.</p>
          <p className="mt-3">In particular: information about digital signatures, document legality, copyright, watermark removal rights, and PDF compliance standards (such as PDF/A) is provided for educational purposes only. Laws vary by jurisdiction and change over time. Always consult a qualified legal professional for advice specific to your situation.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">File Processing Disclaimer</h2>
          <p>While we take care to ensure our PDF tools work reliably, file processing always carries inherent risks. We strongly recommend:</p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-muted">
            <li>Always keeping a backup copy of your original file before processing</li>
            <li>Verifying the output file before deleting the original</li>
            <li>Not using PDFForge as your sole storage or archiving solution</li>
          </ul>
          <p className="mt-3">PDFForge is not responsible for any data loss, file corruption, or output quality issues resulting from use of our tools.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Third-Party Links</h2>
          <p>Our blog and help content may link to third-party websites and tools. These links are provided for convenience and informational purposes only. PDFForge does not endorse, control, or take responsibility for the content, privacy practices, or reliability of any third-party websites.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Copyright and Intellectual Property</h2>
          <p>You are responsible for ensuring you have the legal right to process any document using PDFForge. Using PDFForge to remove copyright protection, modify documents you don't own, or circumvent digital rights management systems is prohibited and may violate applicable laws.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Accuracy of Blog Content</h2>
          <p>Our blog articles and guides are written to be helpful and informative based on available information at the time of writing. We do not guarantee the ongoing accuracy of any information, especially in fast-changing areas like software features, legal requirements, or industry standards. Always verify important information from authoritative sources.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-white mb-3">Contact</h2>
          <p>For questions about this disclaimer, contact us at: <strong className="text-white">hello@pdfforge.app</strong></p>
        </section>
      </div>
    </div>
  );
}
