'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TOOLS } from '@/lib/tools-config';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-2xl border-b border-white/[0.07] py-3' : 'py-5'
      } px-6 md:px-12`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-white no-underline group">
          <div className="w-8 h-8 bg-accent rounded-lg grid place-items-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
              <rect x="3" y="1" width="10" height="13" rx="1.5" stroke="#0a0a0f" strokeWidth="1.8"/>
              <path d="M5 5h6M5 8h6M5 11h4" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-black text-lg tracking-tight">
            PDF<span className="text-accent">Forge</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="/#tools" className="text-muted hover:text-white text-sm font-medium transition-colors no-underline">Tools</Link></li>
          <li><Link href="/#features" className="text-muted hover:text-white text-sm font-medium transition-colors no-underline">Features</Link></li>
          <li><Link href="/blog" className="text-muted hover:text-white text-sm font-medium transition-colors no-underline">Blog</Link></li>
          <li><Link href="/#privacy" className="text-muted hover:text-white text-sm font-medium transition-colors no-underline">Privacy</Link></li>
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/#tools" className="btn-primary text-sm py-2.5 px-5">
            Start Free →
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/[0.07] pt-4 grid grid-cols-2 gap-2">
          {TOOLS.slice(0, 8).map(tool => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-2 text-muted text-sm py-2 px-3 rounded-lg hover:bg-white/[0.04] hover:text-white transition-all no-underline"
              onClick={() => setMenuOpen(false)}
            >
              <span>{tool.icon}</span>
              <span className="font-medium">{tool.name}</span>
            </Link>
          ))}
          <Link
            href="/#tools"
            className="col-span-2 btn-primary text-sm py-2.5 text-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            See All {TOOLS.length} Tools →
          </Link>
        </div>
      )}
    </nav>
  );
}
