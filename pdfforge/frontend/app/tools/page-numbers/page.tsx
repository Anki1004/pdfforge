'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, RangeSlider, ColorPicker } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { addPageNumbers, downloadBlob } from '@/lib/pdf-client';

const POS_OPTIONS = [
  { value: 'bottom-center', label: '⬇ Bottom center' },
  { value: 'bottom-right',  label: '↘ Bottom right' },
  { value: 'bottom-left',   label: '↙ Bottom left' },
  { value: 'top-center',    label: '⬆ Top center' },
  { value: 'top-right',     label: '↗ Top right' },
  { value: 'top-left',      label: '↖ Top left' },
];
const FMT_OPTIONS = [
  { value: 'plain',  label: '1, 2, 3…' },
  { value: 'of',     label: 'Page 1 of N' },
  { value: 'dash',   label: '— 1 —' },
  { value: 'parens', label: '(1)' },
];

export default function PageNumbersPage() {
  const tool = TOOL_MAP['page-numbers'];
  const [file, setFile]       = useState<File | null>(null);
  const [position, setPos]    = useState('bottom-center');
  const [format, setFmt]      = useState('plain');
  const [startNum, setStart]  = useState(1);
  const [skipN, setSkip]      = useState(0);
  const [fontSize, setFs]     = useState(11);
  const [color, setColor]     = useState('#333333');
  const [progress, setProgress] = useState(0);
  const [status, setStatus]   = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const result = await addPageNumbers(file, { position, format, startNum, skipN, fontSize, color }, setProgress);
      downloadBlob(result, 'numbered.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'Page numbers added! Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Failed to add page numbers.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['decorate','watermark','annotate']}>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className="label">Position</label>
          <select className="select-field" value={position} onChange={e => setPos(e.target.value)}>
            {POS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Format</label>
          <select className="select-field" value={format} onChange={e => setFmt(e.target.value)}>
            {FMT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Start from number</label>
          <input className="input-field" type="number" min={1} value={startNum} onChange={e => setStart(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Skip first N pages</label>
          <input className="input-field" type="number" min={0} value={skipN} onChange={e => setSkip(Number(e.target.value))} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <RangeSlider label="Font size" min={8} max={24} value={fontSize} onChange={setFs} suffix="px" />
        <ColorPicker label="Text color" value={color} onChange={setColor} />
      </div>

      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Adding numbers…</> : '🔢 Add Page Numbers & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
