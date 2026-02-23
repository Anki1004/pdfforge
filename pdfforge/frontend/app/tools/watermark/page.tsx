'use client';
import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, RangeSlider, ColorPicker, CheckGroup } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { addWatermark, downloadBlob } from '@/lib/pdf-client';

const POSITION_OPTIONS = [
  { value: 'center',       label: '⊕ Center (diagonal)' },
  { value: 'top-left',     label: '↖ Top left' },
  { value: 'top-right',    label: '↗ Top right' },
  { value: 'bottom-left',  label: '↙ Bottom left' },
  { value: 'bottom-right', label: '↘ Bottom right' },
  { value: 'tile',         label: '⊞ Tiled (repeating)' },
];

export default function WatermarkPage() {
  const tool = TOOL_MAP['watermark'];
  const [file, setFile]         = useState<File | null>(null);
  const [text, setText]         = useState('CONFIDENTIAL');
  const [color, setColor]       = useState('#ff0000');
  const [opacity, setOpacity]   = useState(30);
  const [angle, setAngle]       = useState(-35);
  const [fontSize, setFontSize] = useState(60);
  const [position, setPosition] = useState('center');
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading]   = useState(false);

  // Live preview style
  const previewStyle = useMemo(() => ({
    color,
    opacity: opacity / 100,
    transform: `rotate(${angle}deg)`,
    fontSize: `${Math.min(fontSize * 0.45, 32)}px`,
  }), [color, opacity, angle, fontSize]);

  const handleApply = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    if (!text.trim()) { toast.error('Enter watermark text.'); return; }
    setLoading(true); setStatus(null); setProgress(10);
    try {
      const result = await addWatermark(file, { text, color, opacity, angle, fontSize, position }, setProgress);
      downloadBlob(result, 'watermarked.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'Watermark applied to all pages! Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Failed to apply watermark.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['remove-watermark','protect','annotate']}>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />

      <div className="mt-5 space-y-4">
        <div>
          <label className="label">Watermark text</label>
          <input className="input-field" placeholder="CONFIDENTIAL" value={text} onChange={e => setText(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPicker label="Text color" value={color} onChange={setColor} />
          <div>
            <label className="label">Position</label>
            <select className="select-field" value={position} onChange={e => setPosition(e.target.value)}>
              {POSITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <RangeSlider label="Opacity" min={5} max={100} value={opacity} onChange={setOpacity} suffix="%" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RangeSlider label="Rotation" min={-90} max={90} value={angle} onChange={setAngle} suffix="°" />
          <RangeSlider label="Font size" min={12} max={120} value={fontSize} onChange={setFontSize} suffix="px" />
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-5 bg-surface2 border border-white/[0.07] rounded-xl p-4 flex flex-col items-center gap-3">
        <p className="text-xs text-muted self-start">Live preview</p>
        <div className="bg-white rounded-lg w-52 shadow-2xl relative overflow-hidden" style={{ aspectRatio: '0.707' }}>
          <div className="p-4 text-xs text-gray-300 leading-loose">
            Lorem ipsum dolor sit amet,<br />consectetur adipiscing elit.<br />Sed do eiusmod tempor.
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-black uppercase tracking-widest whitespace-nowrap" style={previewStyle}>
              {text || 'WATERMARK'}
            </span>
          </div>
        </div>
      </div>

      <button className="btn-action mt-5" onClick={handleApply} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Applying…</> : '🔏 Apply & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
