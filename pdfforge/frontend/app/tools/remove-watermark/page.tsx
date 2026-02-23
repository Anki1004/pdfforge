'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ToolLayout } from '@/components/ToolLayout';
import { DropZone, SingleFileDisplay, FileSizeWarning } from '@/components/DropZone';
import { ProgressBar, StatusMessage, CheckGroup, RangeSlider, ColorPicker } from '@/components/FormElements';
import { TOOL_MAP } from '@/lib/tools-config';
import { removeWatermarkText, coverBadge, downloadBlob } from '@/lib/pdf-client';
import { apiRasterize } from '@/lib/api';

type Tab = 'text' | 'raster' | 'cover';

const COVER_POS = [
  { value: 'bottom-right',  label: '↘ Bottom-right (Gamma/Canva default)' },
  { value: 'bottom-left',   label: '↙ Bottom-left' },
  { value: 'bottom-center', label: '⬇ Bottom-center' },
  { value: 'top-right',     label: '↗ Top-right' },
];
const DPI_OPTIONS = [
  { value: '72',  label: '72 DPI — fast, small file' },
  { value: '144', label: '144 DPI — balanced (default)' },
  { value: '216', label: '216 DPI — high quality' },
];

export default function RemoveWatermarkPage() {
  const tool = TOOL_MAP['remove-watermark'];
  const [tab, setTab] = useState<Tab>('text');

  // Text filter state
  const [textFile, setTextFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const [removeAll, setRemoveAll] = useState(false);
  const [rmOpacity, setRmOpacity] = useState(true);

  // Rasterize state
  const [rasterFile, setRasterFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState('144');

  // Cover badge state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPos, setCoverPos] = useState('bottom-right');
  const [coverH, setCoverH] = useState(10);
  const [coverW, setCoverW] = useState(30);
  const [coverColor, setCoverColor] = useState('#ffffff');

  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState<{ type: 'success'|'error'|'info'|'warning'; msg: string } | null>(null);
  const [loading, setLoading]   = useState(false);

  const reset = () => { setProgress(0); setStatus(null); };

  const handleTextFilter = async () => {
    if (!textFile) { toast.error('Upload a PDF first.'); return; }
    if (!keywords.trim() && !removeAll) { toast.error('Enter watermark text to remove, or enable "Remove ALL text".'); return; }
    setLoading(true); reset();
    try {
      const kws = keywords.split(',').map(k => k.trim()).filter(Boolean);
      const { data, removedCount } = await removeWatermarkText(textFile, kws, removeAll, rmOpacity, setProgress);
      downloadBlob(data, 'watermark-removed.pdf');
      setProgress(100);
      const msg = removedCount > 0
        ? `Removed ${removedCount} watermark instance(s)! Download started.`
        : 'No exact text match found. The watermark may be image-based — try the Rasterize tab.';
      setStatus({ type: removedCount > 0 ? 'success' : 'info', msg });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Text filter failed. Try Rasterize tab.' });
    } finally { setLoading(false); }
  };

  const handleRasterize = async () => {
    if (!rasterFile) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); reset();
    try {
      const blob = await apiRasterize(rasterFile, { dpi: parseInt(dpi) }, setProgress);
      downloadBlob(blob, 'watermark-removed.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'Rasterized on server — all overlays removed! Download started. (Text is now image-based.)' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.response?.data?.detail || e.message || 'Rasterization failed.' });
    } finally { setLoading(false); }
  };

  const handleCover = async () => {
    if (!coverFile) { toast.error('Upload a PDF first.'); return; }
    setLoading(true); reset();
    try {
      const result = await coverBadge(coverFile, coverPos, coverH / 100, coverW / 100, coverColor, setProgress);
      downloadBlob(result, 'badge-covered.pdf');
      setProgress(100);
      setStatus({ type: 'success', msg: 'Badge covered on all pages! Text stays selectable. Download started.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message || 'Cover badge failed.' });
    } finally { setLoading(false); }
  };

  const tabClass = (t: Tab) =>
    `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-surface text-white' : 'text-muted hover:text-white'}`;

  return (
    <ToolLayout tool={tool} relatedTools={['watermark','compress','protect']}>
      {/* Method tabs */}
      <div className="flex gap-1 bg-surface2 p-1 rounded-xl mb-5">
        <button className={tabClass('text')}   onClick={() => setTab('text')}>✏️ Text Filter</button>
        <button className={tabClass('raster')} onClick={() => setTab('raster')}>🖼️ Rasterize</button>
        <button className={tabClass('cover')}  onClick={() => setTab('cover')}>🎯 Cover Badge</button>
      </div>

      {/* ── TEXT FILTER ─────────────────────── */}
      {tab === 'text' && (
        <>
          <div className="status-info mb-4 text-xs">
            ℹ️ Best for text-based watermarks like "DRAFT", "SAMPLE", "CONFIDENTIAL". Runs 100% in your browser.
          </div>
          <DropZone onFiles={f => setTextFile(f[0])} />
          <SingleFileDisplay file={textFile} onRemove={() => setTextFile(null)} />
          <div className="mt-4">
            <label className="label">Watermark text to remove (comma-separated)</label>
            <input className="input-field" placeholder="CONFIDENTIAL, DRAFT, Sample" value={keywords} onChange={e => setKeywords(e.target.value)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: 'Remove low-opacity text elements', checked: rmOpacity, set: setRmOpacity },
              { label: 'Remove ALL text (nuclear option)', checked: removeAll, set: setRemoveAll },
            ].map(({ label, checked, set }) => (
              <button key={label} type="button" className={`checkbox-item ${checked ? 'checked' : ''}`} onClick={() => set(!checked)}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn-action mt-5" onClick={handleTextFilter} disabled={loading || !textFile}>
            {loading ? <><span className="spinner" />Processing…</> : '🚫 Remove Watermark & Download'}
          </button>
        </>
      )}

      {/* ── RASTERIZE ───────────────────────── */}
      {tab === 'raster' && (
        <>
          <div className="status-info mb-4 text-xs">
            ⚡ Converts pages to images server-side — removes <strong>all</strong> overlays, stamps, and watermarks regardless of how they were added. Output text is image-based (not selectable).
          </div>
          <DropZone onFiles={f => setRasterFile(f[0])} hint="PDF only · Heavy operation — max 50 MB recommended" />
          <SingleFileDisplay file={rasterFile} onRemove={() => setRasterFile(null)} />
          <FileSizeWarning file={rasterFile} isHeavyOp />
          <div className="mt-4">
            <label className="label">Render quality</label>
            <CheckGroup items={DPI_OPTIONS} value={dpi} onChange={setDpi} />
          </div>
          <button className="btn-action mt-5" onClick={handleRasterize} disabled={loading || !rasterFile}>
            {loading ? <><span className="spinner" />Rasterizing on server…</> : '🖼️ Rasterize & Download'}
          </button>
          {loading && <ProgressBar value={progress} label="Uploading & rendering pages on server…" />}
        </>
      )}

      {/* ── COVER BADGE ─────────────────────── */}
      {tab === 'cover' && (
        <>
          <div className="status-info mb-4 text-xs">
            🎯 Paints a solid rectangle over badge positions. Ideal for "Made with Gamma", Canva, or Slidesgo logos. Text stays selectable. 100% browser-side.
          </div>
          <DropZone onFiles={f => setCoverFile(f[0])} />
          <SingleFileDisplay file={coverFile} onRemove={() => setCoverFile(null)} />
          <div className="mt-4">
            <label className="label">Badge position</label>
            <CheckGroup items={COVER_POS} value={coverPos} onChange={setCoverPos} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <RangeSlider label="Cover height" min={3} max={25} value={coverH} onChange={setCoverH} suffix="%" />
            <RangeSlider label="Cover width"  min={10} max={70} value={coverW} onChange={setCoverW} suffix="%" />
          </div>
          <div className="mt-4">
            <ColorPicker label="Cover color (match your PDF background)" value={coverColor} onChange={setCoverColor} />
          </div>
          <button className="btn-action mt-5" onClick={handleCover} disabled={loading || !coverFile}>
            {loading ? <><span className="spinner" />Covering…</> : '🎯 Cover Badge & Download'}
          </button>
        </>
      )}

      {tab !== 'raster' && loading && <ProgressBar value={progress} />}
      {status && <StatusMessage type={status.type as any} message={status.msg} />}
    </ToolLayout>
  );
}
