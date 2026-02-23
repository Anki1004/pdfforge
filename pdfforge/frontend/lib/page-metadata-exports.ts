// Add this export to each tool page for per-page SEO
// Example for merge/page.tsx — repeat pattern for all tools

// In each tool's page.tsx, add at top:
// import { generateToolMetadata } from '@/lib/tool-metadata';
// export const metadata = generateToolMetadata('merge');  // ← change slug

// Below are the metadata exports already wired into each tool page
// for copy-paste convenience:

export const mergeMetadata      = () => ({ title: 'Merge PDF Files Online Free | PDFForge', description: 'Combine multiple PDFs into one. Drag to reorder. 100% browser-based, no upload.' });
export const splitMetadata      = () => ({ title: 'Split PDF Online Free | PDFForge', description: 'Extract pages or split PDF by range, every N pages, or individual pages.' });
export const compressMetadata   = () => ({ title: 'Compress PDF Online Free — Up to 80% Smaller | PDFForge', description: 'Real Ghostscript compression. Screen, eBook, Printer quality levels.' });
export const watermarkMetadata  = () => ({ title: 'Add Watermark to PDF Online Free | PDFForge', description: 'Custom text watermarks with full opacity, angle, color, and position control.' });
export const rotateMetadata     = () => ({ title: 'Rotate PDF Pages Online Free | PDFForge', description: 'Rotate all, even, odd, or specific PDF pages by 90°, 180°, or 270°.' });
export const protectMetadata    = () => ({ title: 'Password Protect PDF — AES-256 Encryption | PDFForge', description: 'Add strong AES-256 password protection using qpdf. No sign-up required.' });
export const unlockMetadata     = () => ({ title: 'Unlock PDF — Remove Password Online Free | PDFForge', description: 'Remove PDF password protection. Must know the current password.' });
export const pageNumbersMetadata = () => ({ title: 'Add Page Numbers to PDF Online Free | PDFForge', description: 'Insert page numbers with full position, format, and style control.' });
export const signMetadata       = () => ({ title: 'Sign PDF Online Free — Draw or Type Signature | PDFForge', description: 'Draw or type your signature and embed it into any PDF page. No account needed.' });
export const annotateMetadata   = () => ({ title: 'Annotate PDF Online Free | PDFForge', description: 'Add text boxes and sticky-note comments to any PDF page.' });
export const reorderMetadata    = () => ({ title: 'Reorder PDF Pages Online Free | PDFForge', description: 'Rearrange PDF pages in any custom order. Instant download.' });
export const removeWmMetadata   = () => ({ title: 'Remove Watermark from PDF Online Free | PDFForge', description: 'Text filter, rasterize, or cover badge — 3 methods to remove PDF watermarks.' });
export const decorateMetadata   = () => ({ title: 'Decorate PDF — Add Headers, Footers & Borders | PDFForge', description: 'Add branded headers, footers, and page borders. Full color control.' });
