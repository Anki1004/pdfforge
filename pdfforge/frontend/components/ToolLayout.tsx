import Link from 'next/link';
import { TOOLS, Tool, COLOR_CONFIG } from '@/lib/tools-config';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  relatedTools?: string[];
}

export function ToolLayout({ tool, children, relatedTools }: ToolLayoutProps) {
  const col = COLOR_CONFIG[tool.color];
  const related = relatedTools
    ? TOOLS.filter(t => relatedTools.includes(t.id) && t.id !== tool.id).slice(0, 4)
    : TOOLS.filter(t => t.id !== tool.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8">
        <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
        <span>/</span>
        <Link href="/#tools" className="hover:text-white transition-colors no-underline">Tools</Link>
        <span>/</span>
        <span style={{ color: col.text }}>{tool.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* ─── Tool Panel ─── */}
        <div>
          {/* Tool Header */}
          <div className="flex items-start gap-4 mb-8">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center text-3xl flex-shrink-0"
              style={{ background: col.bg }}
            >
              {tool.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display font-black text-3xl tracking-tight">{tool.name}</h1>
                {tool.processing === 'server' && (
                  <span className="text-xs bg-surface3 text-muted2 px-2 py-0.5 rounded-full">Server ⚡</span>
                )}
              </div>
              <p className="text-muted leading-relaxed">{tool.longDescription}</p>
            </div>
          </div>

          {/* The tool form */}
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 md:p-8">
            {children}
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <aside className="space-y-6">
          {/* Privacy card */}
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
            <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <span>🔒</span> Privacy First
            </h3>
            <ul className="space-y-2 text-xs text-muted list-none p-0 m-0">
              {tool.processing === 'browser' && (
                <>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> 100% browser-side processing</li>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> Zero files uploaded to any server</li>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> Works offline after page load</li>
                </>
              )}
              {tool.processing === 'server' && (
                <>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> Server processes file then deletes it</li>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> No storage, no logging</li>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> TLS-encrypted transfer</li>
                </>
              )}
              {tool.processing === 'hybrid' && (
                <>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> Text mode: 100% browser-side</li>
                  <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> Rasterize: server processed &amp; deleted</li>
                </>
              )}
              <li className="flex items-center gap-2"><span className="text-accent-green">✓</span> GDPR-compliant</li>
            </ul>
          </div>

          {/* Related tools */}
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
            <h3 className="font-display font-bold text-sm mb-3">Other PDF Tools</h3>
            <div className="space-y-1.5">
              {related.map(t => {
                const c = COLOR_CONFIG[t.color];
                return (
                  <Link
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors no-underline group"
                  >
                    <span
                      className="w-8 h-8 rounded-lg grid place-items-center text-sm flex-shrink-0"
                      style={{ background: c.bg }}
                    >
                      {t.icon}
                    </span>
                    <span className="text-sm text-muted group-hover:text-white transition-colors font-medium">{t.name}</span>
                    <span className="ml-auto text-muted group-hover:text-white text-xs">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
