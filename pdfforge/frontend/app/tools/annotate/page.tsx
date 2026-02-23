'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, ColorPicker } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { annotatePdf, downloadBlob } from '@/lib/pdf-client';

export default function AnnotatePage() {
  const tool = TOOL_MAP['annotate'];
  const [file, setFile]       = useState<File | null>(null);
  const [text, setText]       = useState('');
  const [pageNum, setPage]    = useState(1);
  const [fontSize, setFs]     = useState(12);
  const [textColor, setTc]    = useState('#cc0000');
  const [bgColor, setBg]      = useState('#ffff99');
  const [x, setX]             = useState(50);
  const [y, setY]             = useState(100);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]   = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!file)         { toast.error('Upload a PDF first.'); return; }
    if (!text.trim())  { toast.error('Enter annotation text.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const result = await annotatePdf(file, { text, pageNum, fontSize, textColor, bgColor, x, y }, setProgress);
      downloadBlob(result, 'annotated.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: `Annotation added to page ${pageNum}! Download started.` });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Annotation failed.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['sign','watermark','decorate']}>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />

      <div className="mt-5 space-y-4">
        <div>
          <label className="label">Annotation text</label>
          <textarea
            className="input-field resize-y min-h-[80px]"
            placeholder="Enter your annotation text here…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Target page</label>
            <input className="input-field" type="number" min={1} value={pageNum} onChange={e => setPage(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Font size</label>
            <input className="input-field" type="number" min={6} max={72} value={fontSize} onChange={e => setFs(Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Text color" value={textColor} onChange={setTc} />
          <ColorPicker label="Background color" value={bgColor} onChange={setBg} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">X position (pts from left)</label>
            <input className="input-field" type="number" value={x} onChange={e => setX(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Y position (pts from bottom)</label>
            <input className="input-field" type="number" value={y} onChange={e => setY(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Annotating…</> : '📝 Annotate & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
