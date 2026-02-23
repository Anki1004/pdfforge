import axios, { AxiosProgressEvent } from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Generic multipart upload helper
async function postFormData(
  endpoint: string,
  formData: FormData,
  onProgress?: (pct: number) => void,
): Promise<Blob> {
  const res = await axios.post(`${BASE}/api${endpoint}`, formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e: AxiosProgressEvent) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 50));
    },
    onDownloadProgress: (e: AxiosProgressEvent) => {
      if (onProgress && e.total) onProgress(50 + Math.round((e.loaded / e.total) * 50));
    },
  });
  return res.data as Blob;
}

export interface CompressOptions {
  quality: 'screen' | 'ebook' | 'printer' | 'prepress';
}
export async function apiCompress(file: File, opts: CompressOptions, onProgress?: (n: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('quality', opts.quality);
  return postFormData('/compress', fd, onProgress);
}

export interface ProtectOptions { userPassword: string; ownerPassword?: string; }
export async function apiProtect(file: File, opts: ProtectOptions, onProgress?: (n: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('user_password', opts.userPassword);
  fd.append('owner_password', opts.ownerPassword || '');
  return postFormData('/protect', fd, onProgress);
}

export interface UnlockOptions { password: string; }
export async function apiUnlock(file: File, opts: UnlockOptions, onProgress?: (n: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('password', opts.password);
  return postFormData('/unlock', fd, onProgress);
}

export interface RasterizeOptions { dpi: number; }
export async function apiRasterize(file: File, opts: RasterizeOptions, onProgress?: (n: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('dpi', String(opts.dpi));
  return postFormData('/rasterize', fd, onProgress);
}

export async function apiHealthCheck(): Promise<boolean> {
  try {
    const res = await axios.get(`${BASE}/api/health`, { timeout: 5000 });
    return res.data?.status === 'ok';
  } catch {
    return false;
  }
}
