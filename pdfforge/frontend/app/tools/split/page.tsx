'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, CheckGroup } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { splitPdf, downloadBlob } from '@/lib/pdf-client';

const MODE_OPTIONS = [
  { value: 'range',  label: 'By page range' },
  { value: 'every',  label: 'Every N pages' },
  { value: 'single', label: 'All individual pages' },
];

export default function SplitPage() {
  const tool = TOOL_MAP['split'];
  const [file, setFile]       = useState<File | null>(null);
  const [mode, setMode]       = useState('range');
  const [ranges, setRanges]   = useState('');
  const [interval, setInt]    = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [progress, setProgress]   = useState(0);
  const [status, setStatus]   = useState<{ type: 'success'|'error'|'info'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = async (files: File[]) => {
    const f = files[0]; setFile(f);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch { setPageCount(null); }
  };

  const handleSplit = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const blob = await splitPdf(file, mode as any, ranges, interval, setProgress);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'split-pages.zip'; a.click();
      setProgress(100);
      setStatus({ type: 'success', msg: 'Split complete! ZIP download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Split failed.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['merge','reorder','rotate']}>
      <DropZone onFiles={onFile} />
      <SingleFileDisplay file={file} onRemove={() => { setFile(null); setPageCount(null); }} />
      {pageCount !== null && (
        <div className="status-info mt-2 text-xs">ℹ️ This PDF has <strong>{pageCount}</strong> pages.</div>
      )}

      <div className="mt-5">
        <label className="label">Split method</label>
        <CheckGroup items={MODE_OPTIONS} value={mode} onChange={setMode} />
      </div>

      {mode === 'range' && (
        <div className="mt-4">
          <label className="label">Page ranges (e.g. 1-3, 5, 7-10)</label>
          <input className="input-field" placeholder="1-3, 5, 7-10" value={ranges} onChange={e => setRanges(e.target.value)} />
        </div>
      )}
      {mode === 'every' && (
        <div className="mt-4">
          <label className="label">Split every N pages</label>
          <input className="input-field" type="number" min={1} value={interval} onChange={e => setInt(Number(e.target.value))} />
        </div>
      )}

      <button className="btn-action mt-5" onClick={handleSplit} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Splitting…</> : '✂️ Split & Download ZIP'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
