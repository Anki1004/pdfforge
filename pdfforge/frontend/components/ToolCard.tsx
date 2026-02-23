'use client';
import Link from 'next/link';
import { Tool, COLOR_CONFIG } from '@/lib/tools-config';

interface ToolCardProps { tool: Tool; index: number; }

export function ToolCard({ tool, index }: ToolCardProps) {
  const col = COLOR_CONFIG[tool.color];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block no-underline"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div
        className="relative group flex flex-col gap-4 p-6 rounded-2xl border bg-surface cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle at top left, ${col.hover}, transparent 60%)` }}
        />

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl grid place-items-center text-2xl flex-shrink-0 relative z-10"
          style={{ background: col.bg }}
        >
          {tool.icon}
        </div>

        {/* Content */}
        <div className="flex-1 relative z-10">
          <h3 className="font-display font-bold text-base text-white mb-1.5 tracking-tight">{tool.name}</h3>
          <p className="text-muted text-sm leading-relaxed">{tool.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between relative z-10">
          <span
            className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{ background: col.bg, color: col.text }}
          >
            {tool.tag}
          </span>
          {tool.processing === 'server' && (
            <span className="text-[10px] text-muted bg-surface3 px-2 py-0.5 rounded-full">Server ⚡</span>
          )}
          <span className="text-muted group-hover:text-white transition-colors">→</span>
        </div>
      </div>
    </Link>
  );
}
