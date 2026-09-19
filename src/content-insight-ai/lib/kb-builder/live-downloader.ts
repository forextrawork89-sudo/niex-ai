import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import type { DatasetSourceSpec } from './types';

export interface DownloadResult {
  success: boolean;
  url: string;
  localPath: string;
  bytes: number;
  contentType?: string;
  error?: string;
}

function isLocalFilePath(value: string): boolean {
  return existsSync(value) || value.startsWith('file://') || value.startsWith('/') || /^[A-Za-z]:\\/.test(value);
}

export async function downloadSource(spec: DatasetSourceSpec): Promise<DownloadResult> {
  const target = `./.kb-cache/${spec.id}-${Date.now()}`;
  const url = spec.url;

  try {
    if (isLocalFilePath(url)) {
      const resolvedPath = url.startsWith('file://') ? new URL(url).pathname : url;
      const absolutePath = resolve(resolvedPath);
      const content = readFileSync(absolutePath, 'utf8');
      const bytes = Buffer.byteLength(content, 'utf8');
      const extension = extname(absolutePath) || '.txt';
      const localPath = `${target}${extension}`;
      mkdirSync(dirname(localPath), { recursive: true });
      writeFileSync(localPath, content, 'utf8');
      return { success: true, url, localPath, bytes, contentType: extension.replace('.', '') || 'text/plain' };
    }

    if (typeof fetch === 'undefined') {
      throw new Error('fetch is unavailable');
    }

    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();
    const bytes = buffer.byteLength;
    const text = new TextDecoder().decode(buffer);
    const path = `${target}.${contentType.includes('json') ? 'json' : contentType.includes('csv') ? 'csv' : contentType.includes('xml') ? 'xml' : 'bin'}`;
    await import('node:fs/promises').then(async (fs) => {
      await fs.mkdir('.kb-cache', { recursive: true });
      await fs.writeFile(path, typeof text === 'string' ? text : Buffer.from(buffer));
    });
    return { success: true, url, localPath: path, bytes, contentType };
  } catch (error) {
    return { success: false, url, localPath: target, bytes: 0, error: error instanceof Error ? error.message : 'download failed' };
  }
}

export async function downloadWithResume(spec: DatasetSourceSpec): Promise<DownloadResult> {
  return downloadSource(spec);
}
