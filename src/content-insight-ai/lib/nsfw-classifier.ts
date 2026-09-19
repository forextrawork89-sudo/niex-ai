// ============================================================
// NSFW CLASSIFIER — Haqiqiy ML model bilan rasm tahlili
//
// NSFW.js (Google MobileNetV2'ga o'rgatilgan) — browser ichida ishlaydi.
// - Bepul, oflayn, GPU shart emas (WebGL/CPU)
// - Model ~25MB, birinchi marta yuklanadi, keyin cache'da
// - 5 sinf: Drawing, Hentai, Neutral, Porn, Sexy
//
// Bu — canvas heuristikadan (skin %, yuz) ANCHA aniqroq.
// Plan: image modulining "haqiqiy AI" qismi shu yerda.
// ============================================================

import * as tf from '@tensorflow/tfjs';
import * as nsfwjs from 'nsfwjs';
import { getResourceGuardian, ResourceGuardian } from './resource-guardian';

export interface NSFWResult {
  // Asosiy qaror
  verdict: 'harmful' | 'safe' | 'uncertain';
  nsfw_score: number;          // 0..1 (Porn + Hentai + 0.5*Sexy)
  confidence: number;

  // Batafsil breakdown (har sinf ehtimolligi)
  breakdown: {
    neutral: number;
    drawing: number;
    sexy: number;
    porn: number;
    hentai: number;
  };

  // Eng yuqori sinf
  top_class: string;
  top_probability: number;

  // Sabablar (text analiziga o'xshash)
  reasons: string[];

  model_loaded: boolean;
  inference_ms: number;
}

// ============================================================
// LAZY MODEL LOADING (singleton)
// ============================================================

let _model: nsfwjs.NSFWJS | null = null;
let _loadingPromise: Promise<nsfwjs.NSFWJS> | null = null;
let _loadError: string | null = null;

// Model IndexedDB'da shu kalit bilan saqlanadi (qayta yuklamaslik uchun)
const IDB_MODEL_URL = 'indexeddb://cia-nsfw-model';

export async function loadNSFWModel(): Promise<nsfwjs.NSFWJS> {
  if (_model) return _model;
  if (_loadingPromise) return _loadingPromise;

  _loadingPromise = (async () => {
    try {
      await tf.ready();

      // 1-URINISH: IndexedDB cache'dan yuklash (internet shart emas, tez)
      try {
        const cached = await nsfwjs.load(IDB_MODEL_URL, { type: 'graph' } as any);
        _model = cached;
        _loadError = null;
        console.log('[NSFW] Model IndexedDB cache\'dan yuklandi (internet shart emas)');
        return cached;
      } catch {
        // Cache yo'q — birinchi marta
      }

      // 2-URINISH: CDN'dan yuklash (birinchi marta, ~internet kerak)
      const model = await nsfwjs.load();
      _model = model;
      _loadError = null;

      // IndexedDB'ga saqlash — keyingi safar qayta yuklamaslik uchun
      try {
        await (model.model as any).save(IDB_MODEL_URL);
        console.log('[NSFW] Model IndexedDB\'ga saqlandi — keyingi safar qayta yuklanmaydi');
      } catch (saveErr) {
        console.warn('[NSFW] Model cache saqlanmadi:', saveErr);
      }

      return model;
    } catch (e) {
      _loadError = e instanceof Error ? e.message : 'Model yuklanmadi';
      _loadingPromise = null;
      throw e;
    }
  })();

  return _loadingPromise;
}

// Cache'langan modelni o'chirish (yangilash uchun)
export async function clearNSFWModelCache(): Promise<void> {
  try { await tf.io.removeModel(IDB_MODEL_URL); } catch { /* yo'q edi */ }
  _model = null;
  _loadingPromise = null;
}

export function isNSFWModelLoaded(): boolean {
  return _model !== null;
}

export function getNSFWLoadError(): string | null {
  return _loadError;
}

// ============================================================
// CLASSIFY — rasmni tahlil qiladi
// ============================================================

export async function classifyImageNSFW(
  source: HTMLImageElement | HTMLCanvasElement,
): Promise<NSFWResult> {
  const start = performance.now();

  let model: nsfwjs.NSFWJS;
  try {
    model = await loadNSFWModel();
  } catch (e) {
    // Model yuklanmasa — bo'sh natija
    return {
      verdict: 'uncertain',
      nsfw_score: 0,
      confidence: 0,
      breakdown: { neutral: 0, drawing: 0, sexy: 0, porn: 0, hentai: 0 },
      top_class: 'Unknown',
      top_probability: 0,
      reasons: [`Model yuklanmadi: ${e instanceof Error ? e.message : 'xato'}`],
      model_loaded: false,
      inference_ms: performance.now() - start,
    };
  }

  // RESOURCE GUARDIAN — og'ir operatsiyadan oldin qizish/batareyani tekshirish
  const guardian = getResourceGuardian();
  const gate = await guardian.beforeHeavyTask();
  if (!gate.allowed) {
    // Cooldown yoki past batareya — bu kadrни o'tkazib yuboramiz
    return {
      verdict: 'uncertain', nsfw_score: 0, confidence: 0,
      breakdown: { neutral: 0, drawing: 0, sexy: 0, porn: 0, hentai: 0 },
      top_class: 'Throttled', top_probability: 0,
      reasons: [gate.reason], model_loaded: true,
      inference_ms: performance.now() - start,
    };
  }
  if (gate.delayMs > 0) {
    // Qizish aniqlandi — biroz pauza (model sifati o'sha, faqat sekinroq)
    await ResourceGuardian.delay(gate.delayMs);
  }

  // Classify
  const inferStart = performance.now();
  const predictions = await model.classify(source);
  guardian.afterHeavyTask(performance.now() - inferStart);

  // predictions: [{className, probability}, ...]
  const breakdown = { neutral: 0, drawing: 0, sexy: 0, porn: 0, hentai: 0 };
  for (const p of predictions) {
    const cls = p.className.toLowerCase();
    if (cls === 'neutral') breakdown.neutral = p.probability;
    else if (cls === 'drawing') breakdown.drawing = p.probability;
    else if (cls === 'sexy') breakdown.sexy = p.probability;
    else if (cls === 'porn') breakdown.porn = p.probability;
    else if (cls === 'hentai') breakdown.hentai = p.probability;
  }

  // NSFW score: Porn va Hentai to'liq, Sexy yarmi
  const nsfwScore = breakdown.porn + breakdown.hentai + breakdown.sexy * 0.5;

  // Top class
  const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
  const topClass = sorted[0].className;
  const topProb = sorted[0].probability;

  // Verdict
  let verdict: 'harmful' | 'safe' | 'uncertain';
  if (nsfwScore >= 0.6) verdict = 'harmful';
  else if (nsfwScore <= 0.25) verdict = 'safe';
  else verdict = 'uncertain';

  // Confidence — eng aniq sinf ehtimolligi
  const confidence = Math.max(nsfwScore, breakdown.neutral, breakdown.drawing);

  // Sabablar (text analiziga o'xshash)
  const reasons: string[] = [];
  if (breakdown.porn >= 0.4) reasons.push(`🔞 Pornografik kontent: ${(breakdown.porn * 100).toFixed(0)}%`);
  if (breakdown.hentai >= 0.4) reasons.push(`🔞 Hentai/animatsion explicit: ${(breakdown.hentai * 100).toFixed(0)}%`);
  if (breakdown.sexy >= 0.5) reasons.push(`⚠️ Shahvoniy (sexy) kontent: ${(breakdown.sexy * 100).toFixed(0)}%`);
  if (breakdown.neutral >= 0.7) reasons.push(`✅ Neytral/xavfsiz kontent: ${(breakdown.neutral * 100).toFixed(0)}%`);
  if (breakdown.drawing >= 0.5) reasons.push(`🎨 Rasm/chizma (drawing): ${(breakdown.drawing * 100).toFixed(0)}%`);
  if (reasons.length === 0) reasons.push(`Aralash signallar — eng yuqori: ${topClass} (${(topProb * 100).toFixed(0)}%)`);

  return {
    verdict,
    nsfw_score: Math.min(nsfwScore, 1),
    confidence,
    breakdown,
    top_class: topClass,
    top_probability: topProb,
    reasons,
    model_loaded: true,
    inference_ms: performance.now() - start,
  };
}

// ============================================================
// BLOB/URL'dan classify
// ============================================================

export async function classifyImageFromBlob(blob: Blob): Promise<NSFWResult> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImageElement(url);
    return await classifyImageNSFW(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function classifyImageFromUrl(url: string): Promise<NSFWResult> {
  const img = await loadImageElement(url);
  return classifyImageNSFW(img);
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Rasm yuklanmadi'));
    img.src = url;
  });
}
