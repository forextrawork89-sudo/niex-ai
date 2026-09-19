// ============================================================
// KNOWLEDGE BASE LOADER — sizning KB faylingizdan AI'ni o'rgatadi
//
// Tezkor: 1000 ta yozuv ~2-5 soniyada o'rganadi
// Token sarfi: 0 (mahalliy ishlaydi)
// Internet: kerak emas
//
// Foydalanish:
//   import { loadKnowledgeBase } from './kb-loader';
//
//   // JSON fayldan (URL yoki File)
//   await loadKnowledgeBase({ source: '/data/my-kb.json' });
//
//   // Yoki to'g'ridan-to'g'ri massiv
//   await loadKnowledgeBase({ entries: [{text: '...', label: 'harmful'}] });
// ============================================================

import { addManualTrainingData, trainModel } from './model-trainer';
import { addNode, addEdge, initializeDefaultKnowledge } from './knowledge-graph';
import { getLocalLLM } from './brain';
import type { ContentType } from '../types/feedback';

// ============================================================
// FORMATS
// ============================================================

export interface KBEntry {
  text: string;
  label: 'harmful' | 'safe' | 'uncertain';
  content_type?: ContentType;
  category?: string;          // e.g. "sexual", "violence", "education"
  patterns?: string[];        // keywords
  language?: string;
  confidence?: number;
  source?: string;
  notes?: string;
}

export interface LoadOptions {
  source?: string | File | Blob;       // URL, file path, or File object
  entries?: KBEntry[];                  // direct array
  format?: 'json' | 'jsonl' | 'csv' | 'auto';
  retrain?: boolean;                    // auto-retrain ML model after loading
  trainLLM?: boolean;                   // also train LocalLLM embeddings
  onProgress?: (loaded: number, total: number) => void;
  batchSize?: number;                   // for progress updates
}

export interface LoadResult {
  total_entries: number;
  loaded: number;
  skipped: number;
  errors: string[];
  by_label: Record<string, number>;
  by_category: Record<string, number>;
  ml_accuracy?: number;
  load_time_ms: number;
}

// ============================================================
// MAIN LOADER
// ============================================================

export async function loadKnowledgeBase(options: LoadOptions): Promise<LoadResult> {
  const start = performance.now();
  initializeDefaultKnowledge();

  // Step 1: Get raw entries
  let entries: KBEntry[] = [];
  if (options.entries) {
    entries = options.entries;
  } else if (options.source) {
    entries = await fetchAndParse(options.source, options.format || 'auto');
  } else {
    throw new Error('Either `source` or `entries` must be provided');
  }

  // Step 2: Validate & filter
  const valid: KBEntry[] = [];
  const errors: string[] = [];
  for (const e of entries) {
    if (!e.text || typeof e.text !== 'string') {
      errors.push(`Skipped: missing text`);
      continue;
    }
    if (!['harmful', 'safe', 'uncertain'].includes(e.label)) {
      errors.push(`Skipped: invalid label "${e.label}"`);
      continue;
    }
    if (e.text.length < 3) {
      errors.push(`Skipped: text too short`);
      continue;
    }
    valid.push(e);
  }

  // Step 3: Load into AI subsystems
  const byLabel: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const batchSize = options.batchSize || 50;
  const llm = options.trainLLM !== false ? getLocalLLM() : null;
  if (llm) await llm.initialize();

  for (let i = 0; i < valid.length; i++) {
    const e = valid[i];
    const label = e.label === 'uncertain' ? 'safe' : e.label; // map uncertain → safe for training

    try {
      // 1. ML training data
      addManualTrainingData(e.text, label, e.content_type || 'text');

      // 2. LocalLLM embedding training (only harmful/safe)
      if (llm && e.label !== 'uncertain') {
        llm.learnFromText(e.text, label);
      }

      // 3. Knowledge graph node
      if (e.category) {
        const node = addNode({
          type: 'pattern',
          label: `${e.category}_${e.label}`,
          content_type: e.content_type || 'text',
          properties: {
            text: e.text.slice(0, 200),
            source: e.source || 'kb_loader',
            language: e.language || 'unknown',
          },
          confidence: e.confidence || 0.8,
          source: 'manual',
        });

        // Add pattern edges
        if (e.patterns) {
          for (const pat of e.patterns.slice(0, 5)) {
            const patNode = addNode({
              type: 'concept',
              label: pat,
              content_type: e.content_type || 'text',
              properties: { from_kb: 'true' },
              confidence: 0.7,
              source: 'manual',
            });
            addEdge(node.id, patNode.id, 'contains');
          }
        }
      }

      byLabel[e.label] = (byLabel[e.label] || 0) + 1;
      if (e.category) byCategory[e.category] = (byCategory[e.category] || 0) + 1;
    } catch (err) {
      errors.push(`Entry ${i}: ${err instanceof Error ? err.message : 'unknown'}`);
    }

    // Progress callback
    if (options.onProgress && i % batchSize === 0) {
      options.onProgress(i, valid.length);
      // Let UI breathe (especially when called from main thread)
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  if (options.onProgress) options.onProgress(valid.length, valid.length);

  // Step 4: Retrain ML model
  let mlAccuracy: number | undefined;
  if (options.retrain !== false && valid.length >= 5) {
    try {
      const result = trainModel();
      if (result) mlAccuracy = result.accuracy;
    } catch (err) {
      errors.push(`Training failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  return {
    total_entries: entries.length,
    loaded: valid.length,
    skipped: entries.length - valid.length,
    errors: errors.slice(0, 20),
    by_label: byLabel,
    by_category: byCategory,
    ml_accuracy: mlAccuracy,
    load_time_ms: performance.now() - start,
  };
}

// ============================================================
// FETCH & PARSE — handles URL, File, Blob
// ============================================================

async function fetchAndParse(source: string | File | Blob, format: 'json' | 'jsonl' | 'csv' | 'auto'): Promise<KBEntry[]> {
  let text: string;
  let detectedFormat = format;

  if (typeof source === 'string') {
    const r = await fetch(source);
    if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
    text = await r.text();
    if (format === 'auto') {
      if (source.endsWith('.jsonl') || source.endsWith('.ndjson')) detectedFormat = 'jsonl';
      else if (source.endsWith('.csv')) detectedFormat = 'csv';
      else detectedFormat = 'json';
    }
  } else {
    text = await (source as File).text();
    const name = (source as File).name || '';
    if (format === 'auto') {
      if (name.endsWith('.jsonl') || name.endsWith('.ndjson')) detectedFormat = 'jsonl';
      else if (name.endsWith('.csv')) detectedFormat = 'csv';
      else detectedFormat = 'json';
    }
  }

  if (detectedFormat === 'json') return parseJSON(text);
  if (detectedFormat === 'jsonl') return parseJSONL(text);
  if (detectedFormat === 'csv') return parseCSV(text);
  throw new Error(`Unknown format: ${detectedFormat}`);
}

function parseJSON(text: string): KBEntry[] {
  const data = JSON.parse(text);
  if (Array.isArray(data)) return data;
  if (data.entries && Array.isArray(data.entries)) return data.entries;
  if (data.data && Array.isArray(data.data)) return data.data;
  throw new Error('JSON must be array, or {entries: [...]}, or {data: [...]}');
}

function parseJSONL(text: string): KBEntry[] {
  const lines = text.split('\n').filter((l) => l.trim());
  return lines.map((line, i) => {
    try {
      return JSON.parse(line);
    } catch {
      console.warn(`[KB] Bad JSONL line ${i + 1}, skipping`);
      return null;
    }
  }).filter(Boolean) as KBEntry[];
}

function parseCSV(text: string): KBEntry[] {
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const textIdx = headers.findIndex((h) => h === 'text' || h === 'content' || h === 'matn');
  const labelIdx = headers.findIndex((h) => h === 'label' || h === 'verdict' || h === 'class');
  const categoryIdx = headers.findIndex((h) => h === 'category' || h === 'cat');
  const langIdx = headers.findIndex((h) => h === 'language' || h === 'lang');

  if (textIdx === -1 || labelIdx === -1) {
    throw new Error('CSV must have "text" and "label" columns');
  }

  return lines.slice(1).map((line) => {
    // Simple CSV parser (no quote escaping inside fields)
    const cells = parseCSVLine(line);
    return {
      text: cells[textIdx] || '',
      label: (cells[labelIdx] || 'safe') as KBEntry['label'],
      category: categoryIdx >= 0 ? cells[categoryIdx] : undefined,
      language: langIdx >= 0 ? cells[langIdx] : undefined,
    };
  });
}

function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuote = !inQuote;
    } else if (c === ',' && !inQuote) {
      cells.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  cells.push(current.trim());
  return cells;
}

// ============================================================
// BULK TEXT LOADER — paste raw text with prefixes
// Format: "harmful: ..." or "safe: ..." per line
// ============================================================

export function parseBulkText(text: string): KBEntry[] {
  return text.split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(harmful|safe|uncertain|zararli|xavfsiz)\s*:\s*(.+)/i);
      if (!m) return null;
      const labelRaw = m[1].toLowerCase();
      const label = /harm|zarar/.test(labelRaw) ? 'harmful' : /xavf/.test(labelRaw) ? 'safe' : labelRaw as any;
      return { text: m[2].trim(), label };
    })
    .filter(Boolean) as KBEntry[];
}

// ============================================================
// SEED DATA — minimum harmful patterns to seed the AI
// Bu sizning katta KB ngiz tayyor bo'lgunga qadar boshlang'ich seed
// ============================================================

export const SEED_HARMFUL: KBEntry[] = [
  { text: 'sexy girls naked photos download', label: 'harmful', category: 'sexual' },
  { text: 'free porn videos adult content', label: 'harmful', category: 'sexual' },
  { text: 'onlyfans leaked premium accounts', label: 'harmful', category: 'sexual' },
  { text: 'erotic stories adults only nsfw', label: 'harmful', category: 'sexual' },
  { text: 'how to make explosives homemade bomb', label: 'harmful', category: 'violence' },
  { text: 'buy drugs online cocaine heroin', label: 'harmful', category: 'drugs' },
  { text: 'casino online bet win real money', label: 'harmful', category: 'gambling' },
  { text: 'suicide methods how to end life', label: 'harmful', category: 'self_harm' },
  { text: 'hack instagram account password steal', label: 'harmful', category: 'cyber' },
  { text: 'pyramid scheme get rich quick scam', label: 'harmful', category: 'fraud' },
  // Uzbek
  { text: "behayo rasm yalang'och qiz video", label: 'harmful', category: 'sexual', language: 'uz' },
  { text: 'pornografiya saytlari yuklab olish', label: 'harmful', category: 'sexual', language: 'uz' },
  { text: 'qimor kazino tikish onlayn pul yutish', label: 'harmful', category: 'gambling', language: 'uz' },
  { text: 'giyohvand narkotik sotuvchi nasha', label: 'harmful', category: 'drugs', language: 'uz' },
];

export const SEED_SAFE: KBEntry[] = [
  { text: 'online course programming web development', label: 'safe', category: 'education' },
  { text: 'health tips healthy lifestyle exercise', label: 'safe', category: 'health' },
  { text: 'cooking recipe ingredient baking', label: 'safe', category: 'food' },
  { text: 'sports football basketball championship', label: 'safe', category: 'sports' },
  { text: 'family vacation travel destination', label: 'safe', category: 'lifestyle' },
  { text: 'business startup investor venture', label: 'safe', category: 'business' },
  { text: 'news article breaking event report', label: 'safe', category: 'news' },
  { text: 'movie review film director cinema', label: 'safe', category: 'entertainment' },
  { text: 'mental health therapy support group', label: 'safe', category: 'health' },
  { text: 'historical analysis war remembrance', label: 'safe', category: 'history' },
  // Uzbek
  { text: 'ta\'lim onlayn kurs dars dasturlash', label: 'safe', category: 'education', language: 'uz' },
  { text: 'sog\'liq saqlash sport mashqlari salomatlik', label: 'safe', category: 'health', language: 'uz' },
  { text: 'pishirish retsept oshxona ingrediyent', label: 'safe', category: 'food', language: 'uz' },
  { text: 'futbol o\'yin chempionat liga', label: 'safe', category: 'sports', language: 'uz' },
];

// Tezkor seed — Test Lab'da bir tugma orqali yuklash uchun
export async function loadSeedKnowledge(): Promise<LoadResult> {
  return loadKnowledgeBase({
    entries: [...SEED_HARMFUL, ...SEED_SAFE],
    retrain: true,
    trainLLM: true,
  });
}
