'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, CheckGroup } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { signPdf, downloadBlob } from '@/lib/pdf-client';

const SIG_STYLES = [
  { value: 'italic', label: 'Italic' },
  { value: 'bold', label: 'Bold' },
  { value: 'normal', label: 'Regular' },
];
const PEN_COLORS = [
  { value: '#000080', label: 'Dark Blue' },
  { value: '#000000', label: 'Black' },
  { value: '#c00000', label: 'Dark Red' },
];
const VPOS_OPTIONS = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'custom', label: 'Custom Y' },
];

export default function SignPage() {
  const tool = TOOL_MAP['sign'];
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'draw'|'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [sigStyle, setSigStyle] = useState('italic');
  const [pageNum, setPageNum] = useState(1);
  const [vpos, setVpos] = useState('bottom');
  const [customY, setCustomY] = useState(80);
  const [penColor, setPenColor] = useState('#000080');
  const [penWidth, setPenWidth] = useState(3);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Init canvas
  useEffect(() => {
    if (mode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = penColor;
    ctx.lineWidth   = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, [mode]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const t = 'touches' in e ? e.touches[0] : e;
    return {
      x: (t.clientX - rect.left) * (canvas.width / rect.width),
      y: (t.clientY - rect.top)  * (canvas.height / rect.height),
    };
  };
  const onMouseDown = (e: React.MouseEvent) => {
    const c = canvasRef.current; if (!c || !ctxRef.current) return;
    drawing.current = true;
    lastPos.current = getPos(e, c);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drawing.current || !canvasRef.current || !ctxRef.current) return;
    const pos = getPos(e, canvasRef.current);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(lastPos.current.x, lastPos.current.y);
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
    lastPos.current = pos;
  };
  const onMouseUp = () => { drawing.current = false; };
  const clearCanvas = () => {
    const c = canvasRef.current; if (c && ctxRef.current) ctxRef.current.clearRect(0, 0, c.width, c.height);
  };

  // Update pen color/width live
  useEffect(() => { if (ctxRef.current) { ctxRef.current.strokeStyle = penColor; ctxRef.current.lineWidth = penWidth; } }, [penColor, penWidth]);

  const handleSign = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    if (mode === 'type' && !typedName.trim()) { toast.error('Type your signature name.'); return; }
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasDrawing = imgData.data.some((v, i) => i % 4 === 3 && v > 0);
      if (!hasDrawing) { toast.error('Draw your signature on the canvas first.'); return; }
    }

    const sigYMap: Record<string, number> = { bottom: 70, center: -1, top: -2, custom: customY };
    let yPos = sigYMap[vpos];
    if (vpos === 'center') yPos = 0; // handled in lib by passing -1
    if (vpos === 'custom') yPos = customY;

    setLoading(true); setStatus(null); setProgress(10);
    try {
      const canvas = mode === 'draw' ? canvasRef.current : null;
      const result = await signPdf(file, canvas, typedName, sigStyle, pageNum, yPos, setProgress);
      downloadBlob(result, 'signed.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: `Signature added to page ${pageNum}! Download started.` });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Signing failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['annotate','protect','watermark']}>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />

      {/* Mode tabs */}
      <div className="flex gap-1 bg-surface2 p-1 rounded-xl mt-5 mb-4">
        {(['draw','type'] as const).map(m => (
          <button
            key={m}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-surface text-white' : 'text-muted'}`}
            onClick={() => setMode(m)}
          >
            {m === 'draw' ? '✏️ Draw Signature' : '⌨️ Type Signature'}
          </button>
        ))}
      </div>

      {mode === 'draw' ? (
        <div>
          <div
            className="relative border-2 border-white/10 rounded-xl bg-white overflow-hidden cursor-crosshair"
            style={{ touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              width={600} height={160}
              style={{ width: '100%', display: 'block' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-300">Sign here</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="btn-ghost flex-1 py-2 text-sm rounded-xl" onClick={clearCanvas}>🗑 Clear</button>
            <select
              className="flex-1 bg-surface2 border border-white/[0.07] rounded-xl text-white text-sm px-3 cursor-pointer"
              value={penColor} onChange={e => setPenColor(e.target.value)}
            >
              {PEN_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select
              className="flex-1 bg-surface2 border border-white/[0.07] rounded-xl text-white text-sm px-3 cursor-pointer"
              value={penWidth} onChange={e => setPenWidth(Number(e.target.value))}
            >
              <option value={2}>Thin</option>
              <option value={3}>Medium</option>
              <option value={5}>Thick</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="label">Type your name</label>
            <input className="input-field italic text-lg" placeholder="Your Full Name" value={typedName} onChange={e => setTypedName(e.target.value)} />
          </div>
          <div>
            <label className="label">Style</label>
            <CheckGroup items={SIG_STYLES} value={sigStyle} onChange={setSigStyle} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="label">Place on page</label>
          <input className="input-field" type="number" min={1} value={pageNum} onChange={e => setPageNum(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Vertical position</label>
          <select className="select-field" value={vpos} onChange={e => setVpos(e.target.value)}>
            {VPOS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {vpos === 'custom' && (
        <div className="mt-3">
          <label className="label">Custom Y position (pts from bottom)</label>
          <input className="input-field" type="number" value={customY} onChange={e => setCustomY(Number(e.target.value))} />
        </div>
      )}

      <button className="btn-action mt-5" onClick={handleSign} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Signing…</> : '✍️ Sign & Download'}
      </button>

      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
