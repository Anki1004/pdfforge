'use client';
import { PDFDocument, rgb, degrees, StandardFonts, PDFName } from 'pdf-lib';
import JSZip from 'jszip';

// ─── Utility Helpers ───────────────────────────────────────────────────────
export function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
}
export function downloadBlob(data: Uint8Array | Blob, filename: string) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 8000);
}
export function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}
export async function loadPdf(file: File) {
  const bytes = await file.arrayBuffer();
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

// ─── 1. MERGE ──────────────────────────────────────────────────────────────
export async function mergePdfs(
  files: File[],
  onProgress: (n: number) => void
): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const src = await loadPdf(files[i]);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach(p => merged.addPage(p));
    onProgress(10 + ((i + 1) / files.length) * 80);
  }
  return merged.save({ useObjectStreams: true });
}

// ─── 2. SPLIT ──────────────────────────────────────────────────────────────
export type SplitMode = 'range' | 'every' | 'single';
export async function splitPdf(
  file: File,
  mode: SplitMode,
  ranges: string,
  interval: number,
  onProgress: (n: number) => void
): Promise<Blob> {
  const src   = await loadPdf(file);
  const total = src.getPageCount();
  let groups: number[][] = [];

  if (mode === 'range') {
    ranges.split(',').forEach(r => {
      r = r.trim();
      if (!r) return;
      if (r.includes('-')) {
        const [a, b] = r.split('-').map(Number);
        const arr: number[] = [];
        for (let i = Math.max(1, a); i <= Math.min(b, total); i++) arr.push(i - 1);
        if (arr.length) groups.push(arr);
      } else {
        const n = parseInt(r);
        if (!isNaN(n) && n >= 1 && n <= total) groups.push([n - 1]);
      }
    });
    if (!groups.length) throw new Error('Enter valid page ranges (e.g. 1-3, 5).');
  } else if (mode === 'every') {
    for (let i = 0; i < total; i += interval) {
      const arr: number[] = [];
      for (let j = i; j < Math.min(i + interval, total); j++) arr.push(j);
      groups.push(arr);
    }
  } else {
    for (let i = 0; i < total; i++) groups.push([i]);
  }

  const zip = new JSZip();
  for (let gi = 0; gi < groups.length; gi++) {
    const newPdf = await PDFDocument.create();
    const pages  = await newPdf.copyPages(src, groups[gi]);
    pages.forEach(p => newPdf.addPage(p));
    const out   = await newPdf.save({ useObjectStreams: true });
    const g     = groups[gi];
    const label = g.length === 1 ? `page-${g[0]+1}` : `pages-${g[0]+1}-${g[g.length-1]+1}`;
    zip.file(`${label}.pdf`, out);
    onProgress(10 + ((gi + 1) / groups.length) * 82);
  }
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

// ─── 3. WATERMARK ──────────────────────────────────────────────────────────
export interface WatermarkOptions {
  text: string; color: string; opacity: number;
  angle: number; fontSize: number; position: string;
}
export async function addWatermark(
  file: File,
  opts: WatermarkOptions,
  onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf  = await loadPdf(file);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const col  = hexToRgb(opts.color);
  onProgress(40);
  pdf.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(opts.text, opts.fontSize);
    const margin = 30;
    if (opts.position === 'tile') {
      const stepX = Math.max(textWidth + 40, 200), stepY = Math.max(opts.fontSize + 40, 150);
      for (let y = -height; y < height * 2; y += stepY)
        for (let x = -width; x < width * 2; x += stepX)
          page.drawText(opts.text, { x, y, size: opts.fontSize, font, color: col, opacity: opts.opacity / 100, rotate: degrees(opts.angle) });
    } else {
      let x = 0, y = 0;
      if (opts.position === 'center')       { x = width/2 - textWidth/2; y = height/2; }
      else if (opts.position === 'top-left')    { x = margin; y = height - opts.fontSize - margin; }
      else if (opts.position === 'top-right')   { x = width - textWidth - margin; y = height - opts.fontSize - margin; }
      else if (opts.position === 'bottom-left') { x = margin; y = margin; }
      else if (opts.position === 'bottom-right'){ x = width - textWidth - margin; y = margin; }
      page.drawText(opts.text, { x, y, size: opts.fontSize, font, color: col, opacity: opts.opacity / 100, rotate: degrees(opts.angle) });
    }
  });
  onProgress(90);
  return pdf.save({ useObjectStreams: true });
}

// ─── 4. ROTATE ─────────────────────────────────────────────────────────────
export async function rotatePdf(
  file: File, angle: number, pagesMode: string, specific: string,
  onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf = await loadPdf(file);
  const total = pdf.getPageCount();
  let indices: number[] = [];
  if (pagesMode === 'all')   indices = Array.from({length:total}, (_,i)=>i);
  else if (pagesMode==='even') indices = Array.from({length:total},(_,i)=>i).filter(i=>(i+1)%2===0);
  else if (pagesMode==='odd')  indices = Array.from({length:total},(_,i)=>i).filter(i=>(i+1)%2===1);
  else {
    indices = specific.split(',').map(s=>parseInt(s.trim())-1).filter(i=>i>=0&&i<total);
    if (!indices.length) throw new Error('No valid page numbers entered.');
  }
  indices.forEach(i => {
    const page = pdf.getPage(i);
    const cur = page.getRotation().angle;
    page.setRotation(degrees((cur + angle) % 360));
  });
  onProgress(90);
  return pdf.save({ useObjectStreams: true });
}

// ─── 5. PAGE NUMBERS ───────────────────────────────────────────────────────
export interface PageNumberOptions {
  position: string; format: string; startNum: number;
  skipN: number; fontSize: number; color: string;
}
export async function addPageNumbers(
  file: File, opts: PageNumberOptions, onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf  = await loadPdf(file);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const col  = hexToRgb(opts.color);
  const total = pdf.getPageCount();
  const margin = 20;
  pdf.getPages().forEach((page, i) => {
    if (i < opts.skipN) return;
    const { width, height } = page.getSize();
    const num = opts.startNum + (i - opts.skipN);
    let label = '';
    if (opts.format === 'plain') label = String(num);
    else if (opts.format === 'of') label = `Page ${num} of ${total - opts.skipN}`;
    else if (opts.format === 'dash') label = `— ${num} —`;
    else label = `(${num})`;
    const tw = font.widthOfTextAtSize(label, opts.fontSize);
    const isBottom = opts.position.includes('bottom');
    const y = isBottom ? margin : height - margin - opts.fontSize;
    let x = 0;
    if (opts.position.includes('center'))     x = width/2 - tw/2;
    else if (opts.position.includes('right')) x = width - tw - margin;
    else                                      x = margin;
    page.drawText(label, { x, y, size: opts.fontSize, font, color: col });
  });
  onProgress(90);
  return pdf.save({ useObjectStreams: true });
}

// ─── 6. ANNOTATE ───────────────────────────────────────────────────────────
export interface AnnotateOptions {
  text: string; pageNum: number; fontSize: number;
  textColor: string; bgColor: string; x: number; y: number;
}
export async function annotatePdf(
  file: File, opts: AnnotateOptions, onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf  = await loadPdf(file);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const total = pdf.getPageCount();
  const pageIdx = Math.min(Math.max(opts.pageNum - 1, 0), total - 1);
  const page = pdf.getPage(pageIdx);
  const col  = hexToRgb(opts.textColor);
  const bg   = hexToRgb(opts.bgColor);
  const padding = 7, lineH = opts.fontSize * 1.45;
  const lines = opts.text.split('\n');
  const maxW  = lines.reduce((m, l) => Math.max(m, font.widthOfTextAtSize(l, opts.fontSize)), 0);
  const boxW = maxW + padding * 2, boxH = lines.length * lineH + padding * 2;
  page.drawRectangle({ x: opts.x-padding, y: opts.y-padding, width: boxW, height: boxH, color: bg, opacity: 0.92, borderColor: col, borderWidth: 1 });
  lines.forEach((line, i) => page.drawText(line, { x: opts.x, y: opts.y+(lines.length-1-i)*lineH+padding/2, size: opts.fontSize, font, color: col }));
  onProgress(90);
  return pdf.save({ useObjectStreams: true });
}

// ─── 7. REORDER ────────────────────────────────────────────────────────────
export async function reorderPdf(
  file: File, orderStr: string, onProgress: (n: number) => void
): Promise<Uint8Array> {
  const src   = await loadPdf(file);
  const total = src.getPageCount();
  const order = orderStr.split(',').map(s => parseInt(s.trim()) - 1).filter(i => i >= 0 && i < total);
  if (!order.length) throw new Error(`No valid page numbers. This PDF has ${total} pages.`);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, order);
  pages.forEach(p => out.addPage(p));
  onProgress(90);
  return out.save({ useObjectStreams: true });
}

// ─── 8. DECORATE ───────────────────────────────────────────────────────────
export interface DecorateOptions {
  showHeader: boolean; showFooter: boolean; showBorder: boolean;
  headerText: string; footerText: string; color: string; barHeight: number;
}
export async function decoratePdf(
  file: File, opts: DecorateOptions, onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf  = await loadPdf(file);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const col  = hexToRgb(opts.color);
  const total = pdf.getPageCount();
  pdf.getPages().forEach((page, idx) => {
    const { width, height } = page.getSize();
    if (opts.showHeader) {
      page.drawRectangle({ x: 0, y: height - opts.barHeight, width, height: opts.barHeight, color: col });
      if (opts.headerText) {
        const tw = font.widthOfTextAtSize(opts.headerText, 9);
        page.drawText(opts.headerText, { x: width/2 - tw/2, y: height - opts.barHeight + (opts.barHeight-9)/2, size: 9, font, color: rgb(1,1,1) });
      }
    }
    if (opts.showFooter) {
      page.drawRectangle({ x: 0, y: 0, width, height: opts.barHeight, color: col });
      if (opts.footerText) {
        const tw = font.widthOfTextAtSize(opts.footerText, 9);
        page.drawText(opts.footerText, { x: width/2-tw/2, y: (opts.barHeight-9)/2, size: 9, font, color: rgb(1,1,1) });
      }
    }
    if (opts.showBorder) {
      page.drawRectangle({ x: 1.5, y: 1.5, width: width-3, height: height-3, borderColor: col, borderWidth: 3, color: rgb(1,1,1), opacity: 0 });
    }
    onProgress(20 + ((idx+1)/total)*70);
  });
  return pdf.save({ useObjectStreams: true });
}

// ─── 9. REMOVE WATERMARK (text filter) ─────────────────────────────────────
export async function removeWatermarkText(
  file: File, keywords: string[], removeAll: boolean, removeOpacity: boolean,
  onProgress: (n: number) => void
): Promise<{ data: Uint8Array; removedCount: number }> {
  const bytes = await file.arrayBuffer();
  let pdfStr = new TextDecoder('latin1').decode(new Uint8Array(bytes));
  let removedCount = 0;
  onProgress(20);
  if (removeAll) {
    pdfStr = pdfStr.replace(/BT[\s\S]*?ET/g, () => { removedCount++; return 'BT ET'; });
  } else {
    keywords.forEach(keyword => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      pdfStr = pdfStr.replace(new RegExp(`\\(([^)]*${escaped}[^)]*)\\)\\s*(Tj|')`, 'gi'), (_, txt, op) => { removedCount++; return `() ${op}`; });
      pdfStr = pdfStr.replace(/\[([\s\S]*?)\]\s*TJ/g, (match, inner) => {
        if (new RegExp(escaped, 'i').test(inner)) { removedCount++; return '[] TJ'; }
        return match;
      });
    });
    if (removeOpacity) {
      pdfStr = pdfStr.replace(/\bca\s+(0\.[0-2]\d*)\b([\s\S]{0,600}?)(BT[\s\S]*?ET)/g, (match, alpha, between, btBlock) => {
        if (/\bTj\b|\bTJ\b/.test(btBlock)) { removedCount++; return `ca ${alpha}${between}BT ET`; }
        return match;
      });
    }
  }
  onProgress(88);
  const outArray = new Uint8Array(pdfStr.length);
  for (let i = 0; i < pdfStr.length; i++) outArray[i] = pdfStr.charCodeAt(i) & 0xff;
  return { data: outArray, removedCount };
}

// ─── 10. COVER BADGE ───────────────────────────────────────────────────────
export async function coverBadge(
  file: File,
  position: string, heightPct: number, widthPct: number, color: string,
  onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf  = await loadPdf(file);
  const col  = hexToRgb(color);
  const pages = pdf.getPages();
  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const rW = width * widthPct, rH = height * heightPct;
    let x = 0, y = 0;
    if      (position === 'bottom-right')  { x = width - rW; y = 0; }
    else if (position === 'bottom-left')   { x = 0;          y = 0; }
    else if (position === 'bottom-center') { x = (width-rW)/2; y = 0; }
    else if (position === 'top-right')     { x = width - rW; y = height - rH; }
    else                                   { x = width - rW; y = 0; }
    page.drawRectangle({ x, y, width: rW, height: rH, color: col, opacity: 1 });
    onProgress(10 + ((idx+1)/pages.length)*85);
  });
  return pdf.save({ useObjectStreams: true });
}

// ─── 11. SIGN ──────────────────────────────────────────────────────────────
export async function signPdf(
  file: File, canvas: HTMLCanvasElement | null, typedText: string,
  sigStyle: string, pageNum: number, yPos: number,
  onProgress: (n: number) => void
): Promise<Uint8Array> {
  const pdf  = await loadPdf(file);
  const total = pdf.getPageCount();
  const pageIdx = Math.min(Math.max(pageNum - 1, 0), total - 1);
  const page = pdf.getPage(pageIdx);
  const { width, height } = page.getSize();
  onProgress(30);
  if (canvas) {
    const imgData = canvas.toDataURL('image/png');
    const base64  = imgData.split(',')[1];
    const imgBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const pngImg = await pdf.embedPng(imgBytes);
    const sigW = Math.min(width * 0.45, 220);
    const sigH = sigW * (canvas.height / canvas.width);
    page.drawImage(pngImg, { x: width/2 - sigW/2, y: yPos, width: sigW, height: sigH, opacity: 0.95 });
  } else {
    const fontMap: Record<string, string> = {
      italic: StandardFonts.TimesRomanItalic,
      bold: StandardFonts.HelveticaBold,
      normal: StandardFonts.TimesRoman,
    };
    const font = await pdf.embedFont(fontMap[sigStyle] || StandardFonts.TimesRomanItalic);
    const fontSize = 28;
    const tw = font.widthOfTextAtSize(typedText, fontSize);
    page.drawText(typedText, { x: Math.max(30, width/2 - tw/2), y: yPos, size: fontSize, font, color: rgb(0, 0, 0.5) });
  }
  onProgress(90);
  return pdf.save({ useObjectStreams: true });
}
