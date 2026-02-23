'use client';
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SortableFileList } from '@/components/DropZone';
import { ProgressBar, StatusMessage } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { mergePdfs, downloadBlob } from '@/lib/pdf-client';

interface SortableFile { file: File; id: string; }
let nextId = 0;

export default function MergePage() {
  const tool = TOOL_MAP['merge'];
  const [files, setFiles] = useState<SortableFile[]>([]);
  const [filename, setFilename] = useState('merged-document');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles.map(f => ({ file: f, id: String(nextId++) }))]);
  }, []);

  const handleMerge = async () => {
    if (files.length < 2) { toast.error('Upload at least 2 PDF files.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const result = await mergePdfs(files.map(f => f.file), setProgress);
      downloadBlob(result, `${filename.replace(/\.pdf$/i,'')}.pdf`);
      setProgress(100);
      setStatus({ type: 'success', msg: `Merged ${files.length} files successfully! Download started.` });
    } catch(e: any) {
      setStatus({ type: 'error', msg: e.message || 'Failed to merge PDFs.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['split','compress','reorder']}>
      <DropZone onFiles={onDrop} multiple label="Drop multiple PDFs here or click to browse" />

      <SortableFileList
        files={files}
        onReorder={setFiles}
        onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))}
      />

      <div className="mt-5">
        <label className="label">Output filename</label>
        <input
          className="input-field"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          placeholder="merged-document"
        />
      </div>

      <button
        className="btn-action mt-5"
        onClick={handleMerge}
        disabled={loading || files.length < 2}
      >
        {loading ? <><span className="spinner" />Merging…</> : '🔗 Merge & Download'}
      </button>

      {loading && <ProgressBar value={progress} label={`Merging ${files.length} files…`} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
