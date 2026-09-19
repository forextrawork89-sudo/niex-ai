// ============================================================
// KB FOLDER LOADER — D:\ai-chat\knowledge_base\ papkasini AI'ga bog'laydi
//
// Foydalanuvchi KB papkasini lokal mashinasida saqlaydi va boshqaradi.
// Bu modul fayllarga TEGINMAYDI — faqat o'qiydi va AI'ga o'rgatadi.
//
// Folder strukturasi:
//   knowledge_base/
//     ├── clothing/         (kiyim tahlili qoidalari)
//     ├── safe_patterns/    (xavfsiz misollar)
//     ├── educational/      (ta'limiy kontekst)
//     ├── medical/          (tibbiy kontekst)
//     ├── age_detection/    (KRITIK: yosh aniqlash)
//     └── ...
//
// Har bir folder o'z ma'nosiga ega:
//   - safe_patterns → SAFE label
//   - educational/medical/cultural_context/sports → SAFE (context modifier)
//   - clothing/skin_visibility/body_shape/pose → harmful indicator rules
//   - age_detection → kritik (bola himoyasi)
//   - context/objects/scene_understanding → context modifiers
// ============================================================

import { getLocalLLM } from './brain';
import { addManualTrainingData, trainModel, flushDataset } from './model-trainer';
import { loadEncryptedKB } from './kb-crypto';
import { addNode, addEdge, initializeDefaultKnowledge } from './knowledge-graph';

// ============================================================
// FOLDER → KATEGORIYA HARITASI
// ============================================================

interface FolderMeta {
  semantic_label: 'safe' | 'harmful' | 'harmful_indicator' | 'context_modifier' | 'critical';
  description: string;
  kg_category: string;
}

const FOLDER_MAP: Record<string, FolderMeta> = {
  // 🔴 Zararli misollar (haqiqiy harmful pattern training data)
  harmful_examples:  { semantic_label: 'harmful',           description: 'Zararli kontent misollari (training data)', kg_category: 'harmful_patterns' },

  // Xavfsiz namunalar
  safe_patterns:     { semantic_label: 'safe',              description: 'Baseline xavfsiz kontent',           kg_category: 'safe_baseline' },
  educational:       { semantic_label: 'safe',              description: 'Ta\'limiy kontekst',                 kg_category: 'context_education' },
  medical:           { semantic_label: 'safe',              description: 'Tibbiy kontekst',                    kg_category: 'context_medical' },
  cultural_context:  { semantic_label: 'safe',              description: 'Madaniy kontekst',                   kg_category: 'context_cultural' },
  sports:            { semantic_label: 'safe',              description: 'Sport kontenti',                     kg_category: 'safe_sports' },

  // Zararli indicator qoidalari
  clothing:          { semantic_label: 'harmful_indicator', description: 'Kiyim tahlili (zararli indicator)',  kg_category: 'rule_clothing' },
  skin_visibility:   { semantic_label: 'harmful_indicator', description: 'Teri ko\'rinishi qoidalari',         kg_category: 'rule_skin' },
  body_shape:        { semantic_label: 'harmful_indicator', description: 'Tana shakli qoidalari',              kg_category: 'rule_body' },
  pose:              { semantic_label: 'harmful_indicator', description: 'Poza tahlili',                       kg_category: 'rule_pose' },

  // Kritik (bola himoyasi)
  age_detection:     { semantic_label: 'critical',          description: 'Yosh aniqlash (bola himoyasi)',      kg_category: 'critical_age' },

  // Kontekst modifierlar
  context:           { semantic_label: 'context_modifier',  description: 'Umumiy kontekst',                    kg_category: 'context_general' },
  intent:            { semantic_label: 'context_modifier',  description: 'Niyat tahlili',                      kg_category: 'context_intent' },
  emotion:           { semantic_label: 'context_modifier',  description: 'Emotsiya tahlili',                   kg_category: 'context_emotion' },
  environment:       { semantic_label: 'context_modifier',  description: 'Atrof-muhit',                        kg_category: 'context_environment' },
  scene_understanding:{ semantic_label: 'context_modifier', description: 'Sahna tushunish',                    kg_category: 'context_scene' },
  objects:           { semantic_label: 'context_modifier',  description: 'Obyektlar',                          kg_category: 'context_objects' },
  camera_focus:      { semantic_label: 'context_modifier',  description: 'Kamera fokusi',                      kg_category: 'context_camera' },
  movement:          { semantic_label: 'context_modifier',  description: 'Harakat',                            kg_category: 'context_movement' },
  audio_patterns:    { semantic_label: 'context_modifier',  description: 'Audio patternlar',                   kg_category: 'context_audio' },
  relationship:      { semantic_label: 'context_modifier',  description: 'Munosabatlar',                       kg_category: 'context_relationship' },
  interaction:       { semantic_label: 'context_modifier',  description: 'O\'zaro ta\'sir (interaction)',       kg_category: 'context_interaction' },
  policy:            { semantic_label: 'context_modifier',  description: 'Siyosat/qoidalar (policy)',          kg_category: 'context_policy' },
};

// ============================================================
// TYPES
// ============================================================

export interface KBFolderLoadResult {
  total_files: number;
  loaded: number;
  skipped: number;
  errors: string[];
  by_folder: Record<string, { count: number; semantic_label: string; chars: number }>;
  kg_nodes_created: number;
  ml_examples_added: number;
  llm_chars_learned: number;
  ml_accuracy?: number;
  load_time_ms: number;
  warnings: string[];
}

export interface KBFolderLoadOptions {
  baseUrl?: string;                 // sukut: /kb
  onProgress?: (current: number, total: number, file: string) => void;
  retrain?: boolean;                // ML modelni qayta o'rgatish
  maxFileSize?: number;             // max bytes per file
  // Shifrlangan KB: agar berilsa, fetch o'rniga shu xaritadan o'qiladi
  // (kb-crypto.loadEncryptedKB natijasi: {"folder/file.md": content})
  encryptedFiles?: Record<string, string>;
}

// ============================================================
// MAIN LOADER
// ============================================================

export async function loadKBFolder(options: KBFolderLoadOptions = {}): Promise<KBFolderLoadResult> {
  const start = performance.now();
  initializeDefaultKnowledge();

  const baseUrl = options.baseUrl || '/kb';
  const maxFileSize = options.maxFileSize || 200_000;
  const errors: string[] = [];
  const warnings: string[] = [];
  const byFolder: KBFolderLoadResult['by_folder'] = {};

  // 1. Fayl ro'yxati: shifrlangan xaritadan YOKI Vite middleware'dan
  let files: string[] = [];
  const encMap = options.encryptedFiles;
  if (encMap) {
    // Shifrlangan KB — fayllar allaqachon deshifrlangan
    files = Object.keys(encMap);
  } else {
    try {
      const res = await fetch(`${baseUrl}/list`);
      if (!res.ok) {
        return {
          total_files: 0, loaded: 0, skipped: 0,
          errors: [`KB list endpoint qaytarmadi: HTTP ${res.status}. Vite server'da kb-serve plugin ishlamayotgan bo'lishi mumkin.`],
          by_folder: {}, kg_nodes_created: 0, ml_examples_added: 0,
          llm_chars_learned: 0, load_time_ms: performance.now() - start,
          warnings: ['Vite dev server qayta ishga tushiring (npm run dev)'],
        };
      }
      const json = await res.json();
      files = json.files || [];
    } catch (e) {
      return {
        total_files: 0, loaded: 0, skipped: 0,
        errors: [`KB ulanish xatosi: ${e instanceof Error ? e.message : 'unknown'}`],
        by_folder: {}, kg_nodes_created: 0, ml_examples_added: 0,
        llm_chars_learned: 0, load_time_ms: performance.now() - start,
        warnings: [],
      };
    }
  }

  if (files.length === 0) {
    warnings.push('Hech qanday .md fayl topilmadi. KB papkasi bo\'sh bo\'lishi mumkin.');
  }

  // 2. Initialize LLM
  const llm = getLocalLLM();
  await llm.initialize();

  let loaded = 0;
  let skipped = 0;
  let kgNodesCreated = 0;
  let mlExamplesAdded = 0;
  let llmCharsLearned = 0;

  // Create one parent node per folder
  const folderNodes: Record<string, string> = {};

  // 3. Process each file
  for (let i = 0; i < files.length; i++) {
    const path = files[i];
    if (options.onProgress) options.onProgress(i, files.length, path);

    const folder = path.split('/')[0];
    const meta = FOLDER_MAP[folder];

    if (!meta) {
      warnings.push(`Noma'lum folder: "${folder}" — o'tkazib yuborildi`);
      skipped++;
      continue;
    }

    // Kontent: shifrlangan xaritadan YOKI fetch orqali
    let content: string;
    if (encMap) {
      content = encMap[path] ?? '';
    } else {
      try {
        const r = await fetch(`${baseUrl}/file?path=${encodeURIComponent(path)}`);
        if (!r.ok) {
          errors.push(`${path}: HTTP ${r.status}`);
          skipped++;
          continue;
        }
        content = await r.text();
      } catch (e) {
        errors.push(`${path}: ${e instanceof Error ? e.message : 'unknown'}`);
        skipped++;
        continue;
      }
    }

    if (content.length === 0) {
      warnings.push(`Bo'sh fayl: ${path}`);
      skipped++;
      continue;
    }

    if (content.length > maxFileSize) {
      warnings.push(`Juda katta fayl (${content.length} bytes, max ${maxFileSize}): ${path} — qisqartirildi`);
      content = content.slice(0, maxFileSize);
    }

    // Strip markdown to clean text
    const cleanText = stripMarkdown(content);

    // Update folder stats
    if (!byFolder[folder]) {
      byFolder[folder] = { count: 0, semantic_label: meta.semantic_label, chars: 0 };
    }
    byFolder[folder].count++;
    byFolder[folder].chars += cleanText.length;

    // Create folder parent node once
    if (!folderNodes[folder]) {
      try {
        const node = addNode({
          type: 'category',
          label: `kb_${folder}`,
          content_type: 'text',
          properties: {
            source: 'kb_folder',
            semantic_label: meta.semantic_label,
            description: meta.description,
            category: meta.kg_category,
            folder,
            harmful: meta.semantic_label === 'harmful' || meta.semantic_label === 'critical',
          },
          confidence: 0.9,
          source: 'manual',
        });
        folderNodes[folder] = node.id;
        kgNodesCreated++;
      } catch (e) {
        errors.push(`KG node yaratish xatosi (${folder}): ${e instanceof Error ? e.message : 'unknown'}`);
      }
    }

    // Create file-level node + edge to folder
    try {
      const fileNode = addNode({
        type: 'rule',
        label: path.replace(/\.md$/, '').replace(/\//g, '_'),
        content_type: 'text',
        properties: {
          source: 'kb_folder',
          path,
          excerpt: cleanText.slice(0, 300),
          folder,
          semantic_label: meta.semantic_label,
          harmful: meta.semantic_label === 'harmful' || meta.semantic_label === 'critical',
        },
        confidence: 0.85,
        source: 'manual',
      });
      kgNodesCreated++;
      addEdge(folderNodes[folder], fileNode.id, 'contains');
    } catch (e) {
      errors.push(`File node xatosi (${path}): ${e instanceof Error ? e.message : 'unknown'}`);
    }

    // Determine training label based on folder semantic label
    // - 'safe' folders → train as safe
    // - 'harmful' folders (e.g. harmful_examples/) → train as harmful
    // - others (harmful_indicator, context_modifier, critical) → train as safe (rules, not examples)
    const trainingLabel: 'harmful' | 'safe' = meta.semantic_label === 'harmful' ? 'harmful' : 'safe';

    // Train LocalLLM embeddings
    try {
      const summary = cleanText.slice(0, 800);
      llm.learnFromText(summary, trainingLabel);
      llmCharsLearned += summary.length;
    } catch (e) {
      errors.push(`LLM o'rgatish xatosi (${path}): ${e instanceof Error ? e.message : 'unknown'}`);
    }

    // ML training data — add for both safe and harmful folders
    if (meta.semantic_label === 'safe' || meta.semantic_label === 'harmful') {
      // For harmful_examples, parse out individual example lines (more granular training)
      const examples: string[] = [];

      if (meta.semantic_label === 'harmful') {
        // Extract individual bullet-point examples from markdown
        const lines = content.split('\n');
        for (const line of lines) {
          const m = line.match(/^\s*[-*]\s+(.{5,200})$/);
          if (m && !m[1].startsWith('*') && !m[1].match(/^[A-Z]/)) {
            const example = m[1].trim();
            if (example.length >= 5 && example.length <= 200 && !example.includes('|')) {
              examples.push(example);
            }
          }
        }
      }

      if (examples.length === 0) {
        // Fallback: use chunks
        examples.push(...chunkText(cleanText, 300).slice(0, 10));
      }

      // Add up to 20 examples per file (more for harmful since we need balanced training)
      const limit = meta.semantic_label === 'harmful' ? 30 : 5;
      for (const ex of examples.slice(0, limit)) {
        try {
          addManualTrainingData(ex, trainingLabel, 'text');
          mlExamplesAdded++;
        } catch (e) {
          errors.push(`ML training xatosi (${path}): ${e instanceof Error ? e.message : 'unknown'}`);
        }
      }
    }
    // Note: harmful_indicator folders contain RULES not harmful examples
    // They're trained as 'safe' so AI learns the surrounding context vocabulary

    loaded++;

    // Async yield every 10 files to keep UI responsive
    if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }

  if (options.onProgress) options.onProgress(files.length, files.length, '');

  // 3.5 Flush LLM + dataset state once (avoid 82x localStorage writes)
  try {
    (llm as any).flushState?.();
    flushDataset();
  } catch {}

  // 4. Retrain ML model
  let mlAccuracy: number | undefined;
  if (options.retrain !== false && mlExamplesAdded >= 5) {
    try {
      const result = trainModel();
      if (result) mlAccuracy = result.accuracy;
    } catch (e) {
      errors.push(`ML retrain xatosi: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }

  // 5. KB integrity check — common issues to flag
  for (const folder of Object.keys(FOLDER_MAP)) {
    if (!byFolder[folder]) {
      warnings.push(`Folder kutilgan, lekin topilmadi: knowledge_base/${folder}/`);
    } else if (byFolder[folder].count === 0) {
      warnings.push(`Folder bo'sh: ${folder}/`);
    } else if (byFolder[folder].chars < 100) {
      warnings.push(`Folder juda kichik (${byFolder[folder].chars} chars): ${folder}/`);
    }
  }

  return {
    total_files: files.length,
    loaded,
    skipped,
    errors,
    by_folder: byFolder,
    kg_nodes_created: kgNodesCreated,
    ml_examples_added: mlExamplesAdded,
    llm_chars_learned: llmCharsLearned,
    ml_accuracy: mlAccuracy,
    load_time_ms: performance.now() - start,
    warnings,
  };
}

// ============================================================
// HELPERS
// ============================================================

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')         // code blocks
    .replace(/`[^`]+`/g, ' ')                // inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')   // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/^#+\s+/gm, '')                 // headers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/^[-*+]\s+/gm, '')              // list markers
    .replace(/^\d+\.\s+/gm, '')              // numbered lists
    .replace(/\|[^\n]+\|/g, ' ')             // tables (simplified)
    .replace(/^---+$/gm, ' ')                // horizontal rules
    .replace(/\$\$[^$]+\$\$/g, ' ')          // math blocks
    .replace(/\$[^$]+\$/g, ' ')              // inline math
    .replace(/<[^>]+>/g, ' ')                // HTML tags
    .replace(/\s+/g, ' ')                    // collapse whitespace
    .trim();
}

function chunkText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  // Try to break at sentence boundaries
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';
  for (const sent of sentences) {
    if ((current + ' ' + sent).length > maxLen) {
      if (current) chunks.push(current);
      current = sent;
    } else {
      current = current ? current + ' ' + sent : sent;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ============================================================
// FORMATTED REPORT
// ============================================================

// ============================================================
// SHIFRLANGAN KB'NI YUKLASH — deshifrla + AI'ga o'rgat
//
// public/kb.enc ni ochadi va loadKBFolder orqali AI'ga yuklaydi.
// Folderlar/fayllar foydalanuvchiga ko'rinmaydi (bitta opaque blob).
// ============================================================
export async function loadEncryptedKBFolder(
  options: Omit<KBFolderLoadOptions, 'encryptedFiles' | 'baseUrl'> & {
    url?: string;
    fallbackToPlaintext?: boolean; // dev rejimi qulayligi (default: true)
  } = {},
): Promise<KBFolderLoadResult> {
  const fallback = options.fallbackToPlaintext !== false;
  try {
    const decrypted = await loadEncryptedKB(options.url || '/kb.enc');
    return loadKBFolder({
      onProgress: options.onProgress,
      retrain: options.retrain,
      maxFileSize: options.maxFileSize,
      encryptedFiles: decrypted.files,
    });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : 'unknown';
    // Dev fallback — kb.enc yo'q bo'lsa, plaintext /kb endpoint'idan o'qib ko'ramiz
    if (fallback) {
      try {
        const probe = await fetch('/kb/list', { method: 'HEAD' });
        if (probe.ok) {
          // Dev plugin ishlaydi — plaintext loader bilan davom etamiz
          const result = await loadKBFolder({
            onProgress: options.onProgress,
            retrain: options.retrain,
            maxFileSize: options.maxFileSize,
          });
          result.warnings.unshift(`⚠️ Shifrlangan kb.enc ochilmadi (${errMsg}). Dev plaintext fallback ishlatildi.`);
          return result;
        }
      } catch { /* fallback ham yo'q */ }
    }
    return {
      total_files: 0, loaded: 0, skipped: 0,
      errors: [`Shifrlangan KB ochilmadi: ${errMsg}`],
      by_folder: {}, kg_nodes_created: 0, ml_examples_added: 0,
      llm_chars_learned: 0, load_time_ms: 0,
      warnings: ['kb.enc topilmadi yoki kalit mos kelmadi. "npm run encrypt-kb" ishlatganmisiz?'],
    };
  }
}

export function formatLoadResult(r: KBFolderLoadResult): string {
  const lines: string[] = [];
  lines.push(`🌱 **KB FOLDER YUKLASH NATIJASI**\n`);
  lines.push(`✅ Yuklandi: ${r.loaded} / ${r.total_files} fayl`);
  if (r.skipped > 0) lines.push(`⏭ O'tkazib yuborildi: ${r.skipped}`);
  lines.push(`📊 KG node yaratildi: ${r.kg_nodes_created}`);
  lines.push(`📚 ML misol qo'shildi: ${r.ml_examples_added}`);
  lines.push(`🧠 LLM embeddings: ${r.llm_chars_learned.toLocaleString()} chars`);
  if (r.ml_accuracy !== undefined) lines.push(`🎯 ML aniqlik: ${r.ml_accuracy.toFixed(1)}%`);
  lines.push(`⏱ Vaqt: ${(r.load_time_ms / 1000).toFixed(1)}s`);
  lines.push('');

  if (Object.keys(r.by_folder).length > 0) {
    lines.push(`📁 **Folderlar bo'yicha:**`);
    const sorted = Object.entries(r.by_folder).sort((a, b) => b[1].count - a[1].count);
    for (const [folder, info] of sorted) {
      const labelIcon = info.semantic_label === 'safe' ? '✅'
        : info.semantic_label === 'harmful' ? '🚫'
        : info.semantic_label === 'harmful_indicator' ? '⚠️'
        : info.semantic_label === 'critical' ? '🔴'
        : 'ℹ️';
      lines.push(`  ${labelIcon} ${folder}/: ${info.count} fayl, ${info.chars.toLocaleString()} chars [${info.semantic_label}]`);
    }
    lines.push('');
  }

  if (r.warnings.length > 0) {
    lines.push(`⚠️ **OGOHLANTIRISHLAR (${r.warnings.length}):**`);
    for (const w of r.warnings.slice(0, 10)) {
      lines.push(`  - ${w}`);
    }
    if (r.warnings.length > 10) lines.push(`  ... va yana ${r.warnings.length - 10}`);
    lines.push('');
  }

  if (r.errors.length > 0) {
    lines.push(`❌ **XATOLAR (${r.errors.length}):**`);
    for (const e of r.errors.slice(0, 10)) {
      lines.push(`  - ${e}`);
    }
    if (r.errors.length > 10) lines.push(`  ... va yana ${r.errors.length - 10}`);
    lines.push('');
  }

  if (r.loaded > 0 && r.errors.length === 0 && r.warnings.length < 3) {
    lines.push('✨ Hammasi yaxshi! Endi Tahlil yoki Smart AI tab\'larida sinab ko\'ring.');
  }

  return lines.join('\n');
}
