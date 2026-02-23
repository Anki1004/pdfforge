'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { apiUnlock } from '@/lib/api';
import { downloadBlob } from '@/lib/pdf-client';

export default function UnlockPage() {
  const tool = TOOL_MAP['unlock'];
  const [file, setFile]     = useState<File | null>(null);
  const [pass, setPass]     = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!file) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const blob = await apiUnlock(file, { password: pass }, setProgress);
      downloadBlob(blob, 'unlocked.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'PDF unlocked! Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.response?.data?.detail || e.message || 'Wrong password or unlock failed.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['protect','compress','merge']}>
      <div className="status-info mb-5 text-xs">
        ℹ️ You must know the current password. Only use on PDFs you legally own.
      </div>
      <DropZone onFiles={f => setFile(f[0])} label="Upload your protected PDF" />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />
      <div className="mt-5">
        <label className="label">Current PDF password</label>
        <input className="input-field" type="password" placeholder="Enter the PDF password" value={pass} onChange={e => setPass(e.target.value)} />
      </div>
      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Unlocking…</> : '🔓 Unlock & Download'}
      </button>
      {loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
