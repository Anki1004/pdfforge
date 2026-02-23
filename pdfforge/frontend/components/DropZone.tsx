'use client';
import { useCallback } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { formatBytes } from '@/lib/pdf-client';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  maxSize?: number; // bytes
  hint?: string;
  label?: string;
}

const MAX_DEFAULT = 100 * 1024 * 1024; // 100MB default
const RASTERIZE_WARN = 50 * 1024 * 1024; // warn at 50MB for heavy ops

export function DropZone({ onFiles, multiple = false, maxSize = MAX_DEFAULT, hint, label }: DropZoneProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    onFiles(accepted);
  }, [onFiles]);

  const opts: DropzoneOptions = {
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple,
    maxSize,
  };
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone(opts);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          p-8 text-center
          ${isDragActive
            ? 'border-accent bg-accent/[0.04] scale-[1.01]'
            : 'border-white/10 bg-surface2 hover:border-white/20 hover:bg-surface2/80'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="text-3xl mb-2">{isDragActive ? '📂' : '📄'}</div>
        <p className="text-sm font-medium text-white mb-1">
          {isDragActive ? 'Drop your PDF here' : (label || (multiple ? 'Drop PDFs here or click to browse' : 'Drop PDF here or click to browse'))}
        </p>
        <p className="text-xs text-muted">
          {hint || `PDF only · Max ${formatBytes(maxSize)}`}
        </p>
      </div>

      {fileRejections.length > 0 && (
        <div className="status-error mt-2 text-xs">
          ⚠️ {fileRejections[0].errors[0].message}
        </div>
      )}
    </div>
  );
}

// ─── Sortable File List (for merge) ─────────────────────────────────────────
interface SortableFile { file: File; id: string; }
interface FileListProps {
  files: SortableFile[];
  onReorder: (files: SortableFile[]) => void;
  onRemove: (id: string) => void;
}

export function SortableFileList({ files, onReorder, onRemove }: FileListProps) {
  if (!files.length) return null;

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIdx === toIdx) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(fromIdx, 1);
    newFiles.splice(toIdx, 0, moved);
    onReorder(newFiles);
  };

  return (
    <div className="mt-3 space-y-1.5">
      {files.map((sf, idx) => (
        <div
          key={sf.id}
          draggable
          onDragStart={e => handleDragStart(e, idx)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, idx)}
          className="flex items-center gap-2.5 bg-surface2 border border-white/[0.07] rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing group hover:border-white/15 transition-colors"
        >
          <span className="text-muted text-base flex-shrink-0 group-hover:text-muted2 transition-colors">⠿</span>
          <span className="text-base flex-shrink-0">📄</span>
          <span className="flex-1 text-sm font-medium text-white truncate" title={sf.file.name}>{sf.file.name}</span>
          <span className="text-xs text-muted bg-surface3 px-2 py-0.5 rounded-full flex-shrink-0">{formatBytes(sf.file.size)}</span>
          <button
            onClick={() => onRemove(sf.id)}
            className="w-5 h-5 rounded-full bg-accent-red/10 text-accent-red text-xs flex-shrink-0 grid place-items-center hover:bg-accent-red/25 transition-colors"
          >✕</button>
        </div>
      ))}
      <p className="text-xs text-accent-green flex items-center gap-1.5 mt-1">
        <span>✓</span> {files.length} file{files.length > 1 ? 's' : ''} queued — drag to reorder
      </p>
    </div>
  );
}

// ─── Single File Display ─────────────────────────────────────────────────────
interface SingleFileProps { file: File | null; onRemove: () => void; }
export function SingleFileDisplay({ file, onRemove }: SingleFileProps) {
  if (!file) return null;
  return (
    <div className="mt-3 flex items-center gap-2.5 bg-surface2 border border-white/[0.07] rounded-xl px-3 py-2.5">
      <span className="text-base">📄</span>
      <span className="flex-1 text-sm font-medium text-white truncate">{file.name}</span>
      <span className="text-xs text-muted bg-surface3 px-2 py-0.5 rounded-full">{formatBytes(file.size)}</span>
      <button
        onClick={onRemove}
        className="w-5 h-5 rounded-full bg-accent-red/10 text-accent-red text-xs grid place-items-center hover:bg-accent-red/25 transition-colors"
      >✕</button>
    </div>
  );
}

// ─── Size Warning ─────────────────────────────────────────────────────────────
export function FileSizeWarning({ file, isHeavyOp = false }: { file: File | null; isHeavyOp?: boolean }) {
  if (!file) return null;
  if (isHeavyOp && file.size > RASTERIZE_WARN) {
    return (
      <div className="status-warning mt-2 text-xs">
        ⚠️ Large file ({formatBytes(file.size)}). This operation is memory-intensive. Large PDFs may be slow or fail on mobile devices.
      </div>
    );
  }
  return null;
}
