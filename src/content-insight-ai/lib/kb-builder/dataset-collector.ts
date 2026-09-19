import { readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DatasetCollection, DatasetRecord, DatasetSourceSpec } from './types';
import { downloadWithResume } from './live-downloader';
import { parseDatasetFile } from './real-parser';

const DEFAULT_SOURCES: DatasetSourceSpec[] = [
  { id: 'hf-toxicity', name: 'HuggingFace toxicity samples', kind: 'huggingface', url: 'https://huggingface.co/datasets/rumi/unsafe', format: 'jsonl' },
  { id: 'kaggle-fraud', name: 'Kaggle fraud sample', kind: 'kaggle', url: 'https://www.kaggle.com/datasets/rtatman/fraudulent-email-corpus', format: 'txt' },
  { id: 'gh-policy', name: 'GitHub policy snippets', kind: 'github', url: 'https://github.com/owner/repo', format: 'markdown' },
  { id: 'openimages-demo', name: 'OpenImages sample metadata', kind: 'openimages', url: 'https://storage.googleapis.com/openimages/web/index.html', format: 'json' },
  { id: 'cc-demo', name: 'Common Crawl sample', kind: 'commoncrawl', url: 'https://commoncrawl.org', format: 'html' },
  { id: 'official-demo', name: 'Official safety corpus', kind: 'official', url: 'https://example.org/official-corpus', format: 'txt' },
];

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, '../../../..');
const knowledgeBaseDir = join(repoRoot, 'knowledge_base');

async function discoverKnowledgeBaseFiles(rootDir: string): Promise<DatasetSourceSpec[]> {
  const sources: DatasetSourceSpec[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!/\.(md|txt|json|jsonl|csv|html|xml)$/i.test(entry.name)) continue;
      sources.push({
        id: `kb-${sources.length + 1}`,
        name: entry.name,
        kind: 'custom',
        url: fullPath,
        format: entry.name.split('.').pop() || 'text',
        metadata: { sourcePath: fullPath, sourceRoot: rootDir },
      });
    }
  }

  try {
    await stat(rootDir);
    await walk(rootDir);
  } catch {
    return [];
  }

  return sources.sort((a, b) => a.url.localeCompare(b.url));
}

async function resolveDefaultSources(): Promise<DatasetSourceSpec[]> {
  const localSources = await discoverKnowledgeBaseFiles(knowledgeBaseDir);
  return localSources.length > 0 ? localSources : DEFAULT_SOURCES;
}

async function simpleChecksum(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(digest));
    return `sha256-${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  }

  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return `sha1-${Math.abs(hash).toString(16)}`;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

async function buildDedupKey(text: string, sourceType: DatasetSourceSpec['kind']): Promise<string> {
  return `${sourceType}:${await simpleChecksum(normalizeText(text))}`;
}

export async function collectDataset(sources?: DatasetSourceSpec[]): Promise<DatasetCollection> {
  const now = new Date().toISOString();
  const records: DatasetRecord[] = [];
  const seen = new Set<string>();
  const selectedSources = sources ?? (await resolveDefaultSources());

  for (const source of selectedSources) {
    const download = await downloadWithResume(source);
    const parsed = download.success && download.localPath ? await parseDatasetFile(download.localPath) : undefined;
    const rawText = parsed?.text ? normalizeText(parsed.text) : normalizeText(`${source.name}\n${source.url}\n${source.format ?? 'unknown'}`);
    const dedupKey = await buildDedupKey(rawText, source.kind);
    if (!seen.has(dedupKey)) {
      seen.add(dedupKey);
      const checksum = await simpleChecksum(rawText);
      records.push({
        id: `record-${records.length + 1}`,
        source: source.url,
        sourceType: source.kind,
        contentType: source.format || 'text',
        text: rawText,
        checksum,
        dedupKey,
        metadata: {
          name: source.name,
          format: source.format,
          kind: source.kind,
          filePath: download.localPath,
          downloadStatus: download.success ? 'downloaded' : 'failed',
          parsedRecords: parsed?.records?.length ?? 0,
          contentType: download.contentType,
          error: download.error,
        },
      });
    }
  }

  const payload = records.map((record) => `${record.id}:${record.dedupKey}`).join('|');
  const collectionChecksum = await simpleChecksum(payload);
  return {
    id: `dataset-${Date.now()}`,
    sources: selectedSources,
    records,
    createdAt: now,
    checksum: collectionChecksum,
    metadata: { sourceCount: selectedSources.length, recordCount: records.length, deduped: false },
  };
}

export async function verifyDatasetChecksum(collection: DatasetCollection): Promise<{ valid: boolean; checked: number }> {
  let checked = 0;
  for (const record of collection.records) {
    checked += 1;
    const expected = await simpleChecksum(record.text);
    if (expected !== record.checksum) {
      return { valid: false, checked };
    }
  }
  return { valid: true, checked };
}
