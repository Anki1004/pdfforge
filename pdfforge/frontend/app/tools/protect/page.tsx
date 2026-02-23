'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay } from '@/components/DropZone';
import { ProgressBar, StatusMessage, CheckGroup } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { apiProtect } from '@/lib/api';
import { downloadBlob } from '@/lib/pdf-client';

export default function ProtectPage() {
  const tool = TOOL_MAP['protect'];
  const [file, setFile]     = useState<File | null>(null);
  const [pass, setPass]     = useState('');
  const [pass2, setPass2]   = useState('');
  const [owner, setOwner]   = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success'|'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!file)          { toast.error('Upload a PDF first.'); return; }
    if (!pass)          { toast.error('Enter a password.'); return; }
    if (pass !== pass2) { toast.error('Passwords do not match.'); return; }
    setLoading(true); setStatus(null); setProgress(5);
    try {
      const blob = await apiProtect(file, { userPassword: pass, ownerPassword: owner || undefined }, setProgress);
      downloadBlob(blob, 'protected.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'AES-256 password protection applied! Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.response?.data?.detail || e.message || 'Protection failed.' });
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout tool={tool} relatedTools={['unlock','watermark','compress']}>
      <div className="status-info mb-5 text-xs">
        ⚡ Uses <strong>qpdf</strong> server-side for real <strong>AES-256 encryption</strong> — far stronger than browser-only options.
      </div>
      <DropZone onFiles={f => setFile(f[0])} />
      <SingleFileDisplay file={file} onRemove={() => setFile(null)} />

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className="label">User password (to open)</label>
          <input className="input-field" type="password" placeholder="Enter password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <div>
          <label className="label">Confirm password</label>
          <input className="input-field" type="password" placeholder="Repeat password" value={pass2} onChange={e => setPass2(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <label className="label">Owner password (optional — controls permissions)</label>
        <input className="input-field" type="password" placeholder="Leave blank to auto-generate" value={owner} onChange={e => setOwner(e.target.value)} />
      </div>

      <button className="btn-action mt-5" onClick={handle} disabled={loading || !file}>
        {loading ? <><span className="spinner" />Encrypting on server…</> : '🔒 Protect & Download'}
      </button>
      {loading && <ProgressBar value={progress} label="Uploading & encrypting with qpdf…" />}
      {status && <StatusMessage type={status.type} message={status.msg} />}
    </ToolLayout>
  );
}
