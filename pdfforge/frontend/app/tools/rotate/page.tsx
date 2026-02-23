'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, CheckGroup } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { rotatePdf, downloadBlob } from '@/lib/pdf-client';

const ANGLE_OPTIONS = [
  { value: '90',  label: '↻ 90° Clockwise' },
  { value: '270', label: '↺ 90° Counter-clockwise' },
  { value: '180', label: '↕ 180° Flip' },
];
const PAGES_OPTIONS = [
  { value: 'all',      label: 'All pages' },
  { value: 'even',     label: 'Even pages' },
  { value: 'odd',      label: 'Odd pages' },
  { value: 'specific', label: 'Specific pages' },
];

export default function RotatePage() {
  const tool = TOOL_MAP['rotate'];
  const [file, setFile]       = useState<File | null>(null);
  const [angle, setAngle]     = useState('90');
  const [pagesMode, setPages] = useState('all');
  const [specific, setSpec]   = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus]   = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const result = await rotatePdf(file, parseInt(angle), pagesMode, specific, setProgress);
      downloadBlob(result, 'rotated.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: `Pages rotated by ${angle}°! Download started.` });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Rotation failed.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['reorder','split','merge']}>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />
      <div className="mt-5 space-y-4">
        <div>
          <label className="label">Rotation angle</label>
          <CheckGroup items={ANGLE_OPTIONS} value={angle} onChange={setAngle} />
        </div>
        <div>
          <label className="label">Apply to</label>
          <CheckGroup items={PAGES_OPTIONS} value={pagesMode} onChange={setPages} />
        </div>
        {pagesMode === 'specific' && (
          <div>
            <label className="label">Page numbers (comma-separated)</label>
            <input className="input-field" placeholder="1, 3, 5" value={specific} onChange={e => setSpec(e.target.value)} />
          </div>
        )}
      </div>
      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Rotating…</> : '🔄 Rotate & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
