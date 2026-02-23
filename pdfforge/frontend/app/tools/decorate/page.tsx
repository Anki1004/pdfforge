'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, RangeSlider, ColorPicker } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { decoratePdf, downloadBlob } from '@/lib/pdf-client';

export default function DecoratePage() {
  const tool = TOOL_MAP['decorate'];
  const [file, setFile]         = useState<File | null>(null);
  const [showHeader, setHeader] = useState(true);
  const [showFooter, setFooter] = useState(true);
  const [showBorder, setBorder] = useState(false);
  const [headerText, setHt]     = useState('');
  const [footerText, setFt]     = useState('');
  const [color, setColor]       = useState('#1a56db');
  const [barH, setBarH]         = useState(24);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading]   = useState(false);

  const handle = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    if (!showHeader && !showFooter && !showBorder) { toast.error('Select at least one decoration.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const result = await decoratePdf(file, { showHeader, showFooter, showBorder, headerText, footerText, color, barHeight: barH }, setProgress);
      downloadBlob(result, 'decorated.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'Decoration applied! Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Decoration failed.' });
    } finally { setLoading(false); }
  };

  const CheckToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <button type="button" className={`checkbox-item ${checked ? 'checked' : ''}`} onClick={() => onChange(!checked)}>
      {label}
    </button>
  );

  return (
    <ToolLayout tool={tool} relatedTools={['page-numbers','watermark','annotate']}>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />

      <div className="mt-5 space-y-4">
        <div>
          <label className="label">Elements to add</label>
          <div className="flex flex-wrap gap-2">
            <CheckToggle label="Header bar" checked={showHeader} onChange={setHeader} />
            <CheckToggle label="Footer bar" checked={showFooter} onChange={setFooter} />
            <CheckToggle label="Page border" checked={showBorder} onChange={setBorder} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Header text</label>
            <input className="input-field" placeholder="Your organization name" value={headerText} onChange={e => setHt(e.target.value)} />
          </div>
          <div>
            <label className="label">Footer text</label>
            <input className="input-field" placeholder="Confidential" value={footerText} onChange={e => setFt(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Accent color" value={color} onChange={setColor} />
          <RangeSlider label="Bar height" min={12} max={50} value={barH} onChange={setBarH} suffix="px" />
        </div>
      </div>

      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Decorating…</> : '✨ Decorate & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
