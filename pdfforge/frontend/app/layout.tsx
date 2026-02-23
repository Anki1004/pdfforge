import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pdfforge.app'),
  title: {
    default: 'PDFForge — Free Online PDF Tools',
    template: '%s | PDFForge',
  },
  description:
    'Merge, split, compress, watermark, rotate, sign, and convert PDFs — 100% free, no upload to servers, works in your browser.',
  keywords: [
    'PDF tools', 'merge PDF', 'split PDF', 'compress PDF', 'PDF online',
    'free PDF editor', 'PDF merge online free', 'ilovepdf alternative',
  ],
  openGraph: {
    type: 'website',
    siteName: 'PDFForge',
    title: 'PDFForge — Free Online PDF Tools',
    description: 'The complete PDF toolkit. Merge, compress, split & more — 100% free.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFForge — Free Online PDF Tools',
    description: 'Merge, split, compress, watermark PDFs for free.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-white font-body antialiased">
        {/* Noise grain overlay */}
        <div
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Ambient blobs */}
        <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-accent opacity-[0.07] blur-[140px] pointer-events-none z-0" />
        <div className="fixed bottom-[100px] left-[-150px] w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.06] blur-[140px] pointer-events-none z-0" />
        <div className="fixed top-[50%] left-[40%] w-[400px] h-[400px] rounded-full bg-accent-purple opacity-[0.05] blur-[140px] pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#181828',
              color: '#f0f0f8',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.88rem',
            },
          }}
        />
      </body>
    </html>
  );
}
