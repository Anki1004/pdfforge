'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay, FileSizeWarning } from '@/components/DropZone';
import { ProgressBar, StatusMessage, CheckGroup } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { apiCompress } from '@/lib/api';
import { downloadBlob, formatBytes } from '@/lib/pdf-client';

const QUALITY_OPTIONS = [
  { value: 'screen',   label: '📱 Screen (smallest file, 72 DPI)' },
  { value: 'ebook',    label: '📖 eBook (good quality, 150 DPI)' },
  { value: 'printer',  label: '🖨️ Printer (high quality, 300 DPI)' },
  { value: 'prepress', label: '🎨 Prepress (max quality, 300 DPI)' },
];

export default function CompressPage() {
  const tool = TOOL_MAP['compress'];
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('ebook');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success'|'error'|'warning'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const blob = await apiCompress(file, { quality: quality as any }, setProgress);
      const origKB = (file.size / 1024).toFixed(1);
      const newKB  = (blob.size / 1024).toFixed(1);
      const saving = ((1 - blob.size / file.size) * 100).toFixed(1);
      downloadBlob(blob, 'compressed.pdf');
      setProgress(100);
      const msg = parseFloat(saving) > 0
        ? `✅ ${origKB} KB → ${newKB} KB (saved ${saving}%). Download started.`
        : `Done! ${origKB} KB → ${newKB} KB. Try a lower quality preset for bigger savings.`;
      setStatus({ type: parseFloat(saving) > 0 ? 'success' : 'warning', msg });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.response?.data?.detail || e.message || 'Compression failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['merge','protect','watermark']}>
      <div className="status-info mb-5 text-xs">
        ⚡ This tool uses <strong>Ghostscript</strong> server-side for real compression — up to 80% smaller. Your file is deleted immediately after.
      </div>

      <DropZone onFiles={f => setFile(f[0])} maxSize={100 * 1024 * 1024} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />
      <FileSizeWarning file={file} />

      <div className="mt-5">
        <label className="label">Compression quality</label>
        <CheckGroup
          items={QUALITY_OPTIONS}
          value={quality}
          onChange={setQuality}
        />
        <p className="text-xs text-muted mt-2">
          <strong>eBook</strong> is the best balance for most documents. Use <strong>Screen</strong> for presentations or PDFs only viewed on-screen.
        </p>
      </div>

      <button className="btn-action mt-5" onClick={handleCompress} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Compressing on server…</> : '📦 Compress & Download'}
      </button>

      {loading && <ProgressBar value={progress} label="Uploading & compressing with Ghostscript…" />}
      {status && <StatusMessage type={status.type as any} message={status.msg} />}
    </ToolLayout>
  );
}
