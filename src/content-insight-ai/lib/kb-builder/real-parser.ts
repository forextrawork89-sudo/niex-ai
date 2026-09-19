import { readFile } from 'node:fs/promises';

export interface ParsedDataset {
  format: string;
  records: Array<Record<string, unknown>>;
  text: string;
}

export async function parseDatasetFile(filePath: string): Promise<ParsedDataset> {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const content = await readFile(filePath, 'utf8');

  if (ext === 'json') {
    const data = JSON.parse(content);
    return { format: 'json', records: Array.isArray(data) ? data : [data], text: JSON.stringify(data) };
  }

  if (ext === 'jsonl') {
    const records = content.split(/\n+/).filter(Boolean).map((line) => JSON.parse(line));
    return { format: 'jsonl', records, text: content };
  }

  if (ext === 'csv') {
    const lines = content.split(/\r?\n/).filter(Boolean);
    const header = lines[0]?.split(',') ?? [];
    const records = lines.slice(1).map((line) => {
      const cells = line.split(',');
      return Object.fromEntries(header.map((key, index) => [key, cells[index] ?? '']));
    });
    return { format: 'csv', records, text: content };
  }

  if (ext === 'parquet') {
    return { format: 'parquet', records: [{ text: content }], text: content };
  }

  if (ext === 'txt' || ext === 'md' || ext === 'html' || ext === 'xml' || ext === 'pdf') {
    return { format: ext, records: [{ text: content }], text: content };
  }

  return { format: ext || 'unknown', records: [{ text: content }], text: content };
}
