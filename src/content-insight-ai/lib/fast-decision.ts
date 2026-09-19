// ============================================================
// FAST DECISION — tezkor qaror qatlami (qizish/batareya tejash)
//
// 2 ta mexanizm og'ir tahlilni (senior reasoning + embeddings) chetlab o'tadi:
//
// 1. VERDICT CACHE — bir marta tahlil qilingan kontent → keyingi safar
//    instant qaytadi (0 hisoblash). Takroriy kontent uchun ulkan tejash.
//
// 2. FAST BLOCKLIST — aniq zararli atamalar (porn aktrisalar, "hot girl"...)
//    → og'ir pipeline'siz darrov BLOCK.
//
// Natija: CPU/GPU yuki kamayadi → telefon kamroq qiziydi, batareya tejaladi.
// ============================================================

import type { ContentVerdict } from '../types/feedback';

// ============================================================
// 1. VERDICT CACHE (LRU, localStorage)
// ============================================================

interface CachedVerdict {
  verdict: ContentVerdict;
  confidence: number;
  should_block: boolean;
  ts: number;
}

const CACHE_KEY = 'cia_verdict_cache_v1';
const CACHE_MAX = 2000;          // max yozuv (LRU)
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 kun

let _cache: Map<string, CachedVerdict> | null = null;

function loadCache(): Map<string, CachedVerdict> {
  if (_cache) return _cache;
  _cache = new Map();
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, CachedVerdict>;
      for (const [k, v] of Object.entries(obj)) _cache.set(k, v);
    }
  } catch { /* ignore */ }
  return _cache;
}

// Debounced save (tez-tez yozmaslik)
let _saveTimer: ReturnType<typeof setTimeout> | null = null;
function saveCache(): void {
  if (_saveTimer) return;
  _saveTimer = setTimeout(() => {
    _saveTimer = null;
    try {
      const c = loadCache();
      // LRU: agar limitdan oshsa, eng eski yozuvlarni o'chiramiz
      if (c.size > CACHE_MAX) {
        const sorted = [...c.entries()].sort((a, b) => a[1].ts - b[1].ts);
        for (let i = 0; i < sorted.length - CACHE_MAX; i++) c.delete(sorted[i][0]);
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(c)));
    } catch { /* quota — jim */ }
  }, 1500);
}

// Tez hash (FNV-1a) — kontent kalitini yasash
function hashText(text: string): string {
  const norm = text.toLowerCase().trim().replace(/\s+/g, ' ').slice(0, 500);
  let h = 0x811c9dc5;
  for (let i = 0; i < norm.length; i++) {
    h ^= norm.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + ':' + norm.length;
}

export function getCachedVerdict(text: string): CachedVerdict | null {
  const c = loadCache();
  const v = c.get(hashText(text));
  if (v && Date.now() - v.ts < CACHE_TTL) return v;
  return null;
}

export function setCachedVerdict(text: string, verdict: ContentVerdict, confidence: number, shouldBlock: boolean): void {
  const c = loadCache();
  c.set(hashText(text), { verdict, confidence, should_block: shouldBlock, ts: Date.now() });
  saveCache();
}

export function clearVerdictCache(): void {
  _cache = new Map();
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

export function getVerdictCacheStats(): { size: number } {
  return { size: loadCache().size };
}

// ============================================================
// 2. FAST BLOCKLIST — aniq zararli atamalar (instant block)
// ============================================================

// Adult kontentchilar (porn aktrisalar) — qidirilsa = zararli
const ADULT_PERFORMERS = [
  'eva elfie', 'mia khalifa', 'lana rhoades', 'riley reid', 'abella danger',
  'adriana chechik', 'angela white', 'sasha grey', 'jenna jameson', 'stormy daniels',
  'belle delphine', 'amouranth', 'johnny sins', 'mia malkova', 'gabbie carter',
  'elsa jean', 'piper perri', 'brandi love', 'lisa ann', 'asa akira',
  'yua mikami', 'eva lovia', 'kendra lust', 'nicole aniston', 'august ames',
];

// Aniq behayo/explicit iboralar — instant block (kontekst kerak emas)
const EXPLICIT_PHRASES = [
  'hot girl', 'hot girls', 'sexy girl', 'sexy girls', 'erotic video', 'erotic videos',
  'porn video', 'porn videos', 'sex video', 'sex videos', 'nude photos', 'naked photos',
  'xxx video', 'adult video', 'porno video', 'onlyfans leaked', 'leaked nudes',
  'cam girl', 'webcam girl', 'live sex', 'free porn', 'hd porn', 'milf porn',
  'teen porn', 'amateur porn', 'lesbian porn', 'gay porn', 'anal sex',
  'oral sex', 'blowjob video', 'sex tape', 'nude leak', 'hot photos',
];

// Tezkor qidirish uchun normallashtirilgan Set
const blocklistSet = new Set<string>([...ADULT_PERFORMERS, ...EXPLICIT_PHRASES]);

// Foydalanuvchi qo'shgan custom blocklist (localStorage)
const CUSTOM_KEY = 'cia_custom_blocklist_v1';
function loadCustomBlocklist(): Set<string> {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}
let _customBlocklist: Set<string> | null = null;

export function addToBlocklist(term: string): void {
  if (!_customBlocklist) _customBlocklist = loadCustomBlocklist();
  _customBlocklist.add(term.toLowerCase().trim());
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify([..._customBlocklist])); } catch { /* ignore */ }
}

/**
 * Tezkor bloklist tekshiruvi — og'ir tahlilsiz.
 * Zararli atama topilsa → instant block, aks holda null.
 */
export function checkFastBlocklist(text: string): { matched: string; category: string } | null {
  const lower = text.toLowerCase();
  if (!_customBlocklist) _customBlocklist = loadCustomBlocklist();

  // Custom blocklist (foydalanuvchi o'rgatgan)
  for (const term of _customBlocklist) {
    if (lower.includes(term)) return { matched: term, category: 'custom' };
  }

  // Adult performers
  for (const name of ADULT_PERFORMERS) {
    if (lower.includes(name)) return { matched: name, category: 'adult_performer' };
  }

  // Explicit iboralar
  for (const phrase of EXPLICIT_PHRASES) {
    if (lower.includes(phrase)) return { matched: phrase, category: 'explicit_phrase' };
  }

  return null;
}

export function getBlocklistSize(): number {
  if (!_customBlocklist) _customBlocklist = loadCustomBlocklist();
  return blocklistSet.size + _customBlocklist.size;
}
