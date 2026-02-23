'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { reorderPdf, downloadBlob } from '@/lib/pdf-client';

export default function ReorderPage() {
  const tool = TOOL_MAP['reorder'];
  const [file, setFile]       = useState<File | null>(null);
  const [order, setOrder]     = useState('');
  const [pageCount, setCount] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]   = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = async (files: File[]) => {
    const f = files[0]; setFile(f);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      setCount(pdf.getPageCount());
    } catch { setCount(null); }
  };

  const handle = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    if (!order.trim()) { toast.error('Enter the new page order.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const result = await reorderPdf(file, order, setProgress);
      downloadBlob(result, 'reordered.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'Pages reordered! Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Reorder failed.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['split','rotate','merge']}>
      <DropZone onFiles={onFile} />
      <SingleFileDisplay file={file} onRemove={() => { setFile(null); setCount(null); }} />
      {pageCount !== null && (
        <div className="status-info mt-2 text-xs">
          ℹ️ This PDF has <strong>{pageCount}</strong> pages. To reverse order, enter:{' '}
          <code className="bg-surface3 px-1 rounded text-accent-green">{Array.from({length:pageCount},(_,i)=>pageCount-i).join(',')}</code>
        </div>
      )}
      <div className="mt-5">
        <label className="label">New page order (comma-separated)</label>
        <input
          className="input-field"
          placeholder={pageCount ? `e.g. 3,1,2,4 — ${pageCount} pages total` : 'e.g. 3,1,2,4'}
          value={order}
          onChange={e => setOrder(e.target.value)}
        />
        <p className="text-xs text-muted mt-1.5">You can omit pages to exclude them from the output.</p>
      </div>
      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Reordering…</> : '↕️ Reorder & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
