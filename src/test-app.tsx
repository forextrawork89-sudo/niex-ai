// ============================================================
// TEST LAB — Standalone AI test interface
//
// Boshqa loyihadan alohida. Faqat AI'ni test qilish uchun.
// Foydalanish: npm install && npm run dev
// ============================================================

import React, { useEffect, useState, useRef, type ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
import {
  analyzeContent,
  analyzeContentSenior,
  analyzeContentSmart,
  getBrainStatus,
  initializeLocalLLM,
  chat,
  getLocalLLMStatus,
  searchWeb,
  fetchWebPage,
  analyzeImage,
  analyzeImageFull,
  analyzeVideoFull,
  analyzeVideoPoster,
  analyzeMultimodal,
  getLocalLLM,
} from './content-insight-ai/lib/brain';
import { initializeDefaultKnowledge } from './content-insight-ai/lib/knowledge-graph';
import { addManualTrainingData, trainModel, getTrainingStats, flushDataset } from './content-insight-ai/lib/model-trainer';
import { getSeniorReasoningEngine } from './content-insight-ai/lib/senior-reasoning';
import { getSharedLearningManager, configureSharedBackend, InMemorySharedBackend } from './content-insight-ai/lib/shared-learning';
import { getWorkerPool } from './content-insight-ai/lib/worker-pool';
import { initializeSharedLearning } from './content-insight-ai/lib/brain';
import { getResourceGuardian } from './content-insight-ai/lib/resource-guardian';
import { loadSeedKnowledge, loadKnowledgeBase, parseBulkText } from './content-insight-ai/lib/kb-loader';
import { loadKBFolder, formatLoadResult } from './content-insight-ai/lib/kb-folder-loader';
import { buildDiagnosticEvaluation } from './content-insight-ai/lib/diagnostic-lab';
import { processContentSync } from './content-insight-ai/lib/ai-core/orchestrator';
import { ParentDashboard } from './ui/parent/ParentDashboard';
import { ChildApp } from './ui/child/ChildApp';
import { PublicTrustView } from './ui/trust/PublicTrustView';
import { OnboardingView } from './ui/onboarding/OnboardingView';

type Tab =
  | 'parent'
  | 'child'
  | 'trust'
  | 'onboarding'
  | 'smart'
  | 'analyze'
  | 'media'
  | 'senior'
  | 'chat'
  | 'kbfolder'
  | 'kb'
  | 'train'
  | 'web'
  | 'status'
  | 'shared';

interface HistoryItem {
  q: string;
  a: string;
  ms: number;
  timestamp: string;
  diagnostic?: string;
}

function App() {
  const [tab, setTab] = useState<Tab>('smart');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  // O'rgatish tab uchun 2 maydon
  const [blockWord, setBlockWord] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockLabel, setBlockLabel] = useState<'harmful' | 'safe'>('harmful');
  // Video (media tab)
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [strictness, setStrictness] = useState<'strict' | 'moderate'>('strict');
  const [cooldown, setCooldown] = useState<number>(0);  // sovutish rejimi (ms)

  const saveHistoryItem = (items: HistoryItem[]) => {
    localStorage.setItem('cia_lab_history', JSON.stringify(items.slice(0, 50)));
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cia_lab_history');
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  // Image file handler
  const handleImageFile = async (file: File | Blob) => {
    setImageBlob(file);
    const reader = new FileReader();
    reader.onload = (e) => setImageDataUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Global paste handler — Ctrl+V rasm yuklaydi
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleImageFile(file);
            return;
          }
        }
      }
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, []);

  // Drag-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  const clearImage = () => {
    setImageDataUrl(null);
    setImageBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    (globalThis as any).__currentImageBlob__ = null;
  };

  // Sync imageBlob to global for handleRun access
  useEffect(() => {
    (globalThis as any).__currentImageBlob__ = imageBlob;
  }, [imageBlob]);

  useEffect(() => {
    initializeDefaultKnowledge();
    initializeLocalLLM().then(() => {
      console.log('✅ AI initialized');
    });

    // Avtomatik: agar KB hali yuklanmagan bo'lsa va kb.enc mavjud bo'lsa,
    // ko'rsatmasdan ortda yuklab qo'yamiz. Bu — production'da to'g'ri xulq-atvor.
    (async () => {
      try {
        const { isEncryptedKBAvailable } = await import('./content-insight-ai/lib/kb-crypto');
        const { loadEncryptedKBFolder } = await import('./content-insight-ai/lib/kb-folder-loader');
        const { getBrainStatus } = await import('./content-insight-ai/lib/brain');
        const status = getBrainStatus();
        // Agar KG bo'sh va kb.enc mavjud bo'lsa
        if (status.knowledge_graph.total_nodes < 50 && await isEncryptedKBAvailable()) {
          console.log('🔒 Avtomatik: shifrlangan KB ortda yuklanmoqda...');
          const result = await loadEncryptedKBFolder({ retrain: true, fallbackToPlaintext: true });
          console.log(`✅ KB yuklandi: ${result.loaded} fayl, ${result.kg_nodes_created} node`);
        }
      } catch (e) {
        console.warn('KB auto-load o\'tkazib yuborildi:', e);
      }
    })();

    // Configure in-memory shared backend by default (Production: Supabase/REST)
    configureSharedBackend(new InMemorySharedBackend());
    initializeSharedLearning(true);

    // Resurs Qo'riqchisi — cooldown (sovutish) ogohlantirishi
    const guardian = getResourceGuardian();
    guardian.onCooldown((remaining) => {
      setCooldown(remaining);
      const tick = setInterval(() => {
        const st = guardian.getStatus();
        setCooldown(st.cooldown_remaining_ms);
        if (st.cooldown_remaining_ms <= 0) clearInterval(tick);
      }, 500);
    });

    // Set up Vite-bundled worker factory
    try {
      const pool = getWorkerPool();
      pool.setWorkerFactory(() => new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' }));
      pool.setFallback((t, ct) => analyzeContent(t, ct));
      // Attach page metadata extractor helper
      (window as any).__extractPageMetadata = () => import('./content-insight-ai/lib/browser-metadata').then(m => m.extractPageMetadata(window as any));

      pool.initialize();
      console.log('✅ Worker pool initialized:', pool.getStats());
    } catch (e) {
      console.warn('Worker pool init failed (fallback ok):', e);
    }
  }, []);

  const run = async (fn: () => Promise<string | { output: string; diagnostic?: unknown }> | string | { output: string; diagnostic?: unknown }) => {
    setLoading(true);
    setResult('');
    const start = performance.now();
    try {
      const raw = await fn();
      const ms = performance.now() - start;
      setElapsedMs(ms);

      const output = typeof raw === 'string' ? raw : raw.output;
      const diagnostic = typeof raw === 'string' ? undefined : raw.diagnostic;
      setResult(output);
      setHistory((h) => {
        const next: HistoryItem[] = [{
          q: input,
          a: output,
          ms,
          timestamp: new Date().toISOString(),
          diagnostic: diagnostic ? JSON.stringify(diagnostic) : undefined,
        }, ...h].slice(0, 50);
        saveHistoryItem(next);
        return next;
      });
    } catch (e) {
      // Show full stack for debugging ReferenceError origin (temporary)
      const msg = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
      setResult('❌ Xato: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const examples = {
    safe: [
      'O\'zbekiston tarixi haqida hujjatli film',
      'How to bake chocolate chip cookies',
      'Bolalar uchun ta\'limiy multfilm',
    ],
    harmful: [
      'Free porn videos download',
      'How to make a bomb at home',
      'Onlayn qimor saytlari bonus bilan',
    ],
    edge: [
      'Documentary about drug addiction recovery',
      'Mental health: how to recognize suicidal thoughts in teens',
      'Tarixiy urush vahshiyligi haqida hujjatli xabar',
    ],
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>
          🧠 Content Insight AI <span style={{ color: '#8a8f9b', fontWeight: 'normal', fontSize: 18 }}>— Test Lab</span>
        </h1>
        <p style={{ color: '#8a8f9b', margin: '4px 0 0' }}>
          Mahalliy AI test muhiti — barcha tahlillar brauzerda, tashqi API'lar yo'q
        </p>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['parent', 'child', 'trust', 'onboarding', 'smart', 'analyze', 'media', 'senior', 'chat', 'kbfolder', 'kb', 'train', 'web', 'status', 'shared'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: tab === t ? '#4f8cff' : '#1a1d27',
              color: '#fff',
              border: '1px solid #2a2f3a',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {tabLabel(t)}
          </button>
        ))}
      </nav>

      {/* 🌡️ Sovutish (cooldown) ogohlantirishi */}
      {cooldown > 0 && (
        <div style={{
          marginBottom: 16, padding: '12px 16px', background: '#3a1f1f',
          border: '1px solid #f59e0b', borderRadius: 8, color: '#fbbf24',
        }}>
          🌡️ <strong>Qurilma qizib ketdi</strong> — AI {Math.ceil(cooldown / 1000)}s dam olmoqda (sovutish uchun).
          Model sifati saqlanadi, faqat vaqtincha sekinroq.
          <div style={{ marginTop: 6, height: 4, background: '#1a1d27', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${Math.min(100, (cooldown / 20000) * 100)}%`, background: '#f59e0b', borderRadius: 2 }} />
          </div>
        </div>
      )}

      {tab === 'parent' && <ParentDashboard />}
      {tab === 'child' && <ChildApp />}
      {tab === 'trust' && <PublicTrustView />}
      {tab === 'onboarding' && <OnboardingView />}

      {tab !== 'parent' && tab !== 'child' && tab !== 'trust' && tab !== 'onboarding' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* INPUT PANEL */}
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>{tabLabel(tab)}</h3>
          <p style={{ color: '#8a8f9b', fontSize: 14, marginTop: 0 }}>{tabHint(tab)}</p>

          {tab === 'train' ? (
            <div>
              {/* Maydon 1: Bloklanadigan so'z */}
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>
                1️⃣ Bloklanadigan so'z / matn (yoki shunga yaqin so'rovlar):
              </label>
              <textarea
                value={blockWord}
                onChange={(e) => setBlockWord(e.target.value)}
                placeholder={'Misol:\n69 pose\nbig ass\nnaughty girl\n(har qatorга bittadan)'}
                style={{
                  width: '100%', minHeight: 90, padding: 12, background: '#0f1117',
                  border: '1px solid #ef444455', borderRadius: 6, color: '#e8e8ee',
                  fontFamily: 'monospace', fontSize: 14, resize: 'vertical', marginBottom: 12,
                }}
              />

              {/* Maydon 2: Sabab */}
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8a8f9b', marginBottom: 6 }}>
                2️⃣ Sabab / tavsif (nega bloklanadi — ixtiyoriy):
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder={'Misol: jinsiy aloqaga tegishli behayo poza, qidiruvда nomaqbul rasmlar chiqaradi'}
                style={{
                  width: '100%', minHeight: 70, padding: 12, background: '#0f1117',
                  border: '1px solid #2a2f3a', borderRadius: 6, color: '#e8e8ee',
                  fontFamily: 'monospace', fontSize: 14, resize: 'vertical', marginBottom: 12,
                }}
              />

              {/* Label tanlash */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <button
                  onClick={() => setBlockLabel('harmful')}
                  style={{ padding: '6px 14px', borderRadius: 6, cursor: 'pointer', border: '1px solid #ef4444',
                    background: blockLabel === 'harmful' ? '#ef4444' : 'transparent', color: '#fff', fontWeight: 600 }}
                >🚫 Zararli (bloklanadi)</button>
                <button
                  onClick={() => setBlockLabel('safe')}
                  style={{ padding: '6px 14px', borderRadius: 6, cursor: 'pointer', border: '1px solid #22c55e',
                    background: blockLabel === 'safe' ? '#22c55e' : 'transparent', color: '#fff', fontWeight: 600 }}
                >✅ Xavfsiz (ruxsat)</button>
              </div>
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tabPlaceholder(tab)}
              style={{
                width: '100%',
                minHeight: 140,
                padding: 12,
                background: '#0f1117',
                border: '1px solid #2a2f3a',
                borderRadius: 6,
                color: '#e8e8ee',
                fontFamily: 'monospace',
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          )}

          {/* Rasm yuklash sohasi — faqat tegishli tab'larda */}
          {supportsImage(tab) && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                marginTop: 12,
                padding: imageDataUrl ? 12 : 24,
                background: dragOver ? '#1f2a3f' : '#0f1117',
                border: `2px dashed ${dragOver ? '#4f8cff' : '#2a2f3a'}`,
                borderRadius: 6,
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              {imageDataUrl ? (
                <div>
                  <img src={imageDataUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={clearImage} style={secondaryBtn}>🗑 Rasmni olib tashlash</button>
                    {tab === 'train' && (
                      <>
                        <button onClick={() => handleImageLabel('harmful', imageBlob, input, run, setImageDataUrl, setImageBlob)} style={{ ...primaryBtn(false), background: '#ef4444' }}>🚫 Zararli deb belgilash</button>
                        <button onClick={() => handleImageLabel('safe', imageBlob, input, run, setImageDataUrl, setImageBlob)} style={{ ...primaryBtn(false), background: '#22c55e' }}>✅ Xavfsiz deb belgilash</button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#8a8f9b', fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼</div>
                  <div><strong>Rasm yuklash:</strong> tortib tashlang, fayl tanlang yoki <kbd>Ctrl+V</kbd> bilan joylang</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageFile(f);
                    }}
                  />
                  <button onClick={() => fileInputRef.current?.click()} style={{ ...secondaryBtn, marginTop: 8 }}>📂 Fayl tanlash</button>
                </div>
              )}
            </div>
          )}

          {/* Video yuklash — faqat media tab'da */}
          {tab === 'media' && (
            <div style={{ marginTop: 12, padding: videoUrl ? 12 : 20, background: '#0f1117', border: '2px dashed #2a2f3a', borderRadius: 6, textAlign: 'center' }}>
              {videoUrl ? (
                <div>
                  <video src={videoUrl} controls style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 4, marginBottom: 8 }} />
                  <div>
                    <button onClick={() => { setVideoUrl(null); setVideoBlob(null); if (videoInputRef.current) videoInputRef.current.value = ''; }} style={secondaryBtn}>🗑 Videoni olib tashlash</button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#8a8f9b', fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
                  <div><strong>Video yuklash:</strong> kadrlar NSFW.js bilan tahlil qilinadi</div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const f = e.target.files?.[0];
                      if (f) { setVideoBlob(f); setVideoUrl(URL.createObjectURL(f)); }
                    }}
                  />
                  <button onClick={() => videoInputRef.current?.click()} style={{ ...secondaryBtn, marginTop: 8 }}>🎬 Video tanlash</button>
                </div>
              )}
            </div>
          )}

          {/* Qat'iylik darajasi — media tab */}
          {tab === 'media' && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12, color: '#8a8f9b', margin: '4px 0' }}>🛡 Bloklash darajasi:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setStrictness('strict')}
                  style={{ flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                    border: '1px solid #ef4444', background: strictness === 'strict' ? '#ef4444' : 'transparent', color: '#fff' }}
                >🔒 Qat'iy (bolalar uchun)<br /><span style={{ fontSize: 10, opacity: 0.8 }}>explicit→blok, shahvoniy→ko'rib chiqilsin</span></button>
                <button
                  onClick={() => setStrictness('moderate')}
                  style={{ flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                    border: '1px solid #fbbf24', background: strictness === 'moderate' ? '#fbbf24' : 'transparent', color: '#fff' }}
                >⚖️ O'rtacha (kattalar)<br /><span style={{ fontSize: 10, opacity: 0.8 }}>faqat explicit (porn) bloklanadi</span></button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (tab === 'train') {
                  handleTrainTwoField(blockWord, blockReason, blockLabel, run);
                } else if (tab === 'media') {
                  handleMedia(imageBlob, videoBlob, strictness, run);
                } else {
                  handleRun(tab, input, run);
                }
              }}
              disabled={loading
                || (tab === 'train' ? !blockWord.trim()
                : tab === 'media' ? (!imageBlob && !videoBlob)
                : (requiresInput(tab) && !input.trim()))}
              style={primaryBtn(loading
                || (tab === 'train' ? !blockWord.trim()
                : tab === 'media' ? (!imageBlob && !videoBlob)
                : (requiresInput(tab) && !input.trim())))}
            >
              {loading ? '⏳ Ishlanyapti...' : tab === 'train' ? '🧠 AI ga o\'rgat' : tab === 'media' ? '🔍 Tahlil qilish' : '▶ Ishga tushir'}
            </button>
            <button onClick={() => { setInput(''); setResult(''); if (tab === 'train') { setBlockWord(''); setBlockReason(''); } }} style={secondaryBtn}>🗑 Tozalash</button>
          </div>

          {tab === 'analyze' || tab === 'senior' ? (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: '#8a8f9b', margin: '8px 0' }}>📝 Tezkor misollar:</p>
              <ExampleButtons label="Xavfsiz" items={examples.safe} onClick={setInput} color="#4ade80" />
              <ExampleButtons label="Zararli" items={examples.harmful} onClick={setInput} color="#ef4444" />
              <ExampleButtons label="Chegaraviy" items={examples.edge} onClick={setInput} color="#fbbf24" />
            </div>
          ) : null}
        </div>

        {/* RESULT PANEL */}
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>📊 Natija</h3>
            {elapsedMs > 0 && <span style={{ color: '#8a8f9b', fontSize: 13 }}>⏱ {elapsedMs.toFixed(0)}ms</span>}
          </div>

          <pre style={{
            background: '#0f1117',
            border: '1px solid #2a2f3a',
            borderRadius: 6,
            padding: 12,
            minHeight: 200,
            maxHeight: 500,
            overflow: 'auto',
            color: '#e8e8ee',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'monospace',
            fontSize: 13,
            marginTop: 12,
          }}>
            {result || (loading ? '⏳ AI o\'ylanyapti...' : '👈 Chap tomondan matn kiriting va "Ishga tushir" ni bosing')}
          </pre>
        </div>
      </div>

      {/* HISTORY */}
      {history.length > 0 && (
        <div style={{ ...panelStyle, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0 }}>📜 Tarix (oxirgi {history.length})</h3>
            <button onClick={() => { setHistory([]); saveHistoryItem([]); }} style={secondaryBtn}>🗑 Tozalash</button>
          </div>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {history.map((h, i) => (
              <div key={i} style={{ padding: 8, borderBottom: '1px solid #2a2f3a', fontSize: 13 }}>
                <div style={{ color: '#4f8cff' }}>{h.q.slice(0, 80)}{h.q.length > 80 ? '…' : ''}</div>
                <div style={{ color: '#8a8f9b', marginTop: 4 }}>
                  {h.a.split('\n')[0].slice(0, 100)} <span style={{ color: '#666' }}>({h.ms.toFixed(0)}ms)</span>
                </div>
                <div style={{ color: '#6ee7b7', marginTop: 4, fontSize: 11 }}>
                  {new Date(h.timestamp).toLocaleString()} {h.diagnostic ? '• diagnostic included' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}

      <footer style={{ marginTop: 32, padding: 16, color: '#8a8f9b', fontSize: 12, textAlign: 'center', borderTop: '1px solid #2a2f3a' }}>
        🧠 Content Insight AI Test Lab • Barcha hisob-kitoblar brauzer ichida bajariladi • Tashqi API yo'q
      </footer>
    </div>
  );
}

// Tab'lar uchun input talab qilinishi
function requiresInput(t: Tab): boolean {
  return !['kbfolder', 'status', 'kb', 'media'].includes(t);
}

// Qaysi tab'larda rasm yuklash ko'rinadi
function supportsImage(t: Tab): boolean {
  return ['smart', 'analyze', 'senior', 'train', 'media'].includes(t);
}

// ============================================================
// SMART SUBJECT EXTRACTION — GPT/Claude uslubida
//
// Tamoyil: "bloklanish so'zi" (harmful/zararli/safe) gapning
// QAYERIDA bo'lsa ham, undan OLDINGI mazmunli so'zlar = asosiy subject.
//
// "69 pose harmfull content kiradi"        → "69 pose"
// "bikini sozi harmfullga kiradi"          → "bikini"
// "...bersada, naughty girl harmful..."    → "naughty girl"
// "harmful: 69 pose"                       → "69 pose" (colon format)
// ============================================================

// Tushuntirish/scaffolding so'zlari — subject EMAS, ularni tashlaymiz
const META_WORDS = new Set([
  // O'zbekcha tushuntirish so'zlari
  "sozi", "so'zi", "soz", "so'z", "sozini", "so'zini", "sozlar",
  "content", "contentga", "contentlar", "kontent", "kontentga",
  "turiga", "turi", "turidagi", "turini",
  "kiradi", "kirad", "kiritiladi", "kirib", "hisoblanadi", "hisoblanidi",
  "bo'ladi", "boladi", "deyiladi", "degan", "deydi", "manoni", "manosini",
  "mano", "ma'no", "ma'noni", "bildiradi", "anglatadi", "anglatuvchi",
  "holatni", "holati", "holatiga", "holatlar", "holatlarni", "holat",
  "sababi", "sababli", "sababdan", "chunki", "bu", "shu", "u",
  "va", "hamda", "yoki", "ham", "deb", "kabi", "uchun", "esa",
  "bloklanishi", "bloklash", "bloklanadi", "blokla", "taqiqlanadi",
  "man", "qilingan", "qilinadi", "kerak", "shart", "lozim",
  "keladi", "chiqaradi", "chiqib", "qidiruvda", "qidiruv", "qidirilganda",
  "tegishli", "oid", "doir", "alohida", "ozi", "o'zi", "yomon", "xulqli",
  "garchi", "ammo", "biroq", "lekin", "bersada", "natijada", "demak",
  "shuning", "men", "sen", "biz", "siz", "agar", "shunday", "bunday", "bunaqa",
  "jinsiy", "aloqaga", "aloqa", "tegishliligini",
  // English scaffolding
  "the", "a", "an", "is", "are", "was", "this", "that", "and", "or", "but",
  "because", "type", "into", "content", "considered", "means", "should",
  "be", "blocked", "it", "its", "of", "to", "in", "for", "as",
]);

// Bloklanish anchorlari (label so'zlari)
function findLabelAnchor(line: string): { label: 'harmful' | 'safe'; pos: number; matched: string } | null {
  const lower = line.toLowerCase();
  // Harmful anchors (suffix bilan ham: harmfullga, zararlilik...)
  const harmfulRe = /(harmfull?[a-z']*|zararli[a-z']*|behayo|nopok|taqiqlan[a-z']*|nomaqbul|haromzoda|iflos)/i;
  const safeRe = /(xavfsiz[a-z']*|safe[a-z']*|foydali|durust|maqbul)/i;

  const hm = harmfulRe.exec(lower);
  const sm = safeRe.exec(lower);

  if (hm && (!sm || hm.index < sm.index)) {
    return { label: 'harmful', pos: hm.index, matched: hm[0] };
  }
  if (sm) {
    return { label: 'safe', pos: sm.index, matched: sm[0] };
  }
  return null;
}

interface ExtractResult {
  subjects: string[];
  label: 'harmful' | 'safe';
  fullContext: string;
  debug: string[];
}

function extractSubjects(line: string): ExtractResult | null {
  const debug: string[] = [];

  // Format 1: "harmful: X" / "safe: X" — colon format (eng aniq)
  const colonMatch = line.match(/^\s*(harmful|safe|zararli|xavfsiz)\s*:\s*(.+)/i);
  if (colonMatch) {
    const label: 'harmful' | 'safe' = /harm|zarar/i.test(colonMatch[1]) ? 'harmful' : 'safe';
    const subject = colonMatch[2].trim();
    debug.push(`✓ Colon format: "${subject}" → ${label}`);
    return { subjects: [subject], label, fullContext: subject, debug };
  }

  // Anchor topish
  const anchor = findLabelAnchor(line);
  if (!anchor) {
    debug.push(`✗ Label so'zi topilmadi (harmful/zararli/safe kerak)`);
    return null;
  }

  const { label, pos, matched } = anchor;
  debug.push(`🎯 Anchor: "${matched}" (pos ${pos}) → ${label}`);

  // Anchor'dan OLDINGI matn — bu yerda subject bor
  let before = line.slice(0, pos);

  // Oxirgi clause chegarasigacha kesamiz (subordinate clause'larni tashlash)
  // "garchi ... bersada, naughty girl harmful" → vergulдан keyingi qismni olamiz
  const lastBoundary = Math.max(
    before.lastIndexOf(','),
    before.lastIndexOf('.'),
    before.lastIndexOf(';'),
    before.lastIndexOf(':'),
  );
  if (lastBoundary >= 0) {
    before = before.slice(lastBoundary + 1);
    debug.push(`✂️ Clause kesildi → "${before.trim()}"`);
  }

  // So'zlarga ajratamiz, meta so'zlarni tashlaymiz
  const beforeWords = before
    .split(/\s+/)
    .map((w) => w.replace(/[^\w'`-]/g, ''))
    .filter(Boolean);
  const contentWords = beforeWords.filter((w) => !META_WORDS.has(w.toLowerCase()));

  const subjects: string[] = [];

  // Anchor'dan oldingi oxirgi 1-3 mazmunli so'z = asosiy subject
  if (contentWords.length > 0) {
    const subjectPhrase = contentWords.slice(-3).join(' ').trim();
    if (subjectPhrase.length >= 2) {
      subjects.push(subjectPhrase);
      debug.push(`✓ PRIMARY subject: "${subjectPhrase}" (anchor'dan oldin)`);
    }
    // Agar 2+ so'z bo'lsa, oxirgi yakka so'zni ham qo'shamiz (kengroq qamrov)
    if (contentWords.length >= 2) {
      const lastWord = contentWords[contentWords.length - 1];
      if (lastWord.length >= 3 && !subjects.includes(lastWord)) {
        subjects.push(lastWord);
        debug.push(`✓ Single word: "${lastWord}"`);
      }
    }
  }

  // Fallback: anchor oldidan topilmasa — anchor'dan KEYIN qaraymiz
  if (subjects.length === 0) {
    const after = line.slice(pos + matched.length);
    const afterWords = after
      .split(/\s+/)
      .map((w) => w.replace(/[^\w'`-]/g, ''))
      .filter(Boolean)
      .filter((w) => !META_WORDS.has(w.toLowerCase()));
    if (afterWords.length > 0) {
      const phrase = afterWords.slice(0, 3).join(' ').trim();
      if (phrase.length >= 2) {
        subjects.push(phrase);
        debug.push(`✓ Subject (anchor'dan keyin): "${phrase}"`);
      }
    }
  }

  if (subjects.length === 0) {
    debug.push(`✗ Subject ajratib bo'lmadi`);
    return null;
  }

  // Full context (label so'zlarisiz)
  const fullContext = line
    .replace(/(harmfull?[a-z']*|zararli[a-z']*|safe[a-z']*|xavfsiz[a-z']*|bloklash[a-z']*|bloklanishi|hisoblanadi|kiradi|kerak|shart)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { subjects, label, fullContext, debug };
}

// Media tab — rasm yoki video tahlili
async function handleMedia(
  imageBlob: Blob | null,
  videoBlob: Blob | null,
  strictness: 'strict' | 'moderate',
  run: (fn: () => Promise<string> | string) => Promise<void>,
) {
  return run(async () => {
    if (videoBlob) {
      // 🚀 1-QADAM: TEZ POSTER CHECK (preview rasm orqali)
      let out = '';
      const poster = await analyzeVideoPoster(videoBlob, { strictness });
      out += `🚀 **TEZ PREVIEW TEKSHIRUVI** (${(poster.analysis_ms / 1000).toFixed(1)}s)\n`;
      out += `${poster.verdict === 'harmful' ? '🚫' : poster.verdict === 'safe' ? '✅' : '❓'} Preview: **${poster.verdict.toUpperCase()}** (${(poster.confidence * 100).toFixed(0)}%)\n`;
      out += `💡 ${poster.recommendation}\n`;

      // Agar preview aniq zararli → DARROV block, to'liq tahlil shart emas
      if (poster.should_block) {
        out += `\n⚡ **Video DARROV bloklandi** — preview aniq zararli topildi, to'liq tahlil shart emas.\n\n`;
        out += `📌 Preview asosida qaror: ${poster.poster_analysis.description}\n`;
        out += `- Sabab: ${poster.poster_analysis.reasons[0] || 'Aniqlangan noaniq vizual signal'}\n`;
        return out;
      }

      out += `\n⏳ Preview noaniq yoki sug‘urtta — to‘liq video tahlili boshlanmoqda...\n\n═══════════════════════════════\n\n`;

      // 🔍 2-QADAM: TO'LIQ VIDEO TAHLILI (zich namuna + scene-change)
      const v = await analyzeVideoFull(videoBlob, { maxFrames: 12 });
      const icon = v.verdict === 'harmful' ? '🚫' : v.verdict === 'safe' ? '✅' : '❓';
      out += `🎬 **TO'LIQ VIDEO TAHLILI**\n\n`;
      out += `${icon} **${v.verdict.toUpperCase()}** (${(v.confidence * 100).toFixed(0)}%)\n`;
      out += `🔥 Xavf darajasi: ${v.risk_level}\n`;
      out += `🚷 Block: ${v.should_block ? 'HA' : 'YO\'Q'}\n\n`;
      out += `📝 **Tavsif:** ${v.description}\n`;
      out += `💡 ${v.recommendation}\n\n`;
      out += `🎞 **Kadrlar tahlili (${v.frames_analyzed})**\n`;
      for (const f of v.frames) {
        const fi = f.verdict === 'harmful' ? '🚫' : f.verdict === 'safe' ? '✅' : '❓';
        out += `  ${fi} ${f.timestamp.toFixed(1)}s — ${f.top_class}${f.verdict === 'harmful' ? ' (zaharli)' : f.verdict === 'safe' ? ' (xavfsiz)' : ' (noaniq)'}\n`;
      }
      if (v.worst_frame) {
        out += `\n⚠️ Eng muhim kadr: ${v.worst_frame.timestamp.toFixed(1)}s — ${v.worst_frame.top_class}\n`;
      }
      const reasonsText = v.reasons.map((r) => '  - ' + r).join('\n');
      out += `\n🎯 **Sabablar:**\n${reasonsText}\n`;
      out += `\n⏱ ${(v.analysis_ms / 1000).toFixed(1)}s`;
      return out;
    }

    if (imageBlob) {
      return formatImageAnalysis(await analyzeImageFull(imageBlob, strictness));
    }

    return '⚠️ Rasm yoki video yuklang';
  });
}

// 2-maydonli o'rgatish — to'g'ridan-to'g'ri, extraction kerak emas
async function handleTrainTwoField(
  blockWord: string,
  blockReason: string,
  label: 'harmful' | 'safe',
  run: (fn: () => Promise<string> | string) => Promise<void>,
) {
  return run(async () => {
    const words = blockWord.split('\n').map((w) => w.trim()).filter(Boolean);
    if (words.length === 0) return '⚠️ Bloklanadigan so\'z kiriting (1-maydon)';

    const llm = getLocalLLM();
    await llm.initialize();

    const learned: string[] = [];
    for (const w of words) {
      // 1. To'g'ridan-to'g'ri o'rgatish — extraction yo'q
      addManualTrainingData(w, label, 'text');
      llm.learnFromText(w, label);
      learned.push(w);

      // 2. Agar sabab bo'lsa, sabab + so'z birikmasini ham o'rgatamiz (kengroq qamrov)
      if (blockReason.trim()) {
        const combined = `${w} ${blockReason.trim()}`.slice(0, 300);
        addManualTrainingData(combined, label, 'text');
        llm.learnFromText(combined, label);
      }
    }

    // 3. Darrov saqlash (debounce'ni flush)
    flushDataset();
    try { (llm as any).flushState?.(); } catch {}

    // 4. ML model qayta o'rgatish
    const r = trainModel();
    const stats = getTrainingStats();

    // 5. Shared backend'ga yuborish
    let sharedSent = 0;
    try {
      const { getSharedLearningManager } = await import('./content-insight-ai/lib/shared-learning');
      const mgr = getSharedLearningManager();
      for (const w of words) {
        await mgr.submitFeedback({
          content: w, verdict: label as any, content_type: 'text',
          patterns: w.split(/\s+/).slice(0, 5), confidence: 0.9,
          reason: blockReason.trim() || 'O\'rgatish tab', language: 'uz',
        });
        sharedSent++;
      }
    } catch {}

    // 6. Darrov tekshirib ko'rish — haqiqatan bloklaydimi?
    const verifyResults: string[] = [];
    for (const w of words.slice(0, 3)) {
      try {
        const a = analyzeContent(w);
        const ok = (label === 'harmful' && a.should_block) || (label === 'safe' && !a.should_block);
        verifyResults.push(`  ${ok ? '✅' : '❌'} "${w}" → ${a.verdict.toUpperCase()} (${(a.confidence * 100).toFixed(0)}%) ${a.should_block ? '[BLOCK]' : '[ALLOW]'}`);
      } catch {}
    }

    const icon = label === 'harmful' ? '🚫' : '✅';
    return `${icon} **${learned.length} ta ${label === 'harmful' ? 'BLOKLANADIGAN' : 'XAVFSIZ'} so'z o'rgatildi:**\n` +
      learned.map((w) => `  - "${w}"`).join('\n') + '\n\n' +
      (blockReason.trim() ? `📝 Sabab: ${blockReason.trim()}\n\n` : '') +
      `🧠 **AI darrov o'rgandi va xotirasiga saqladi**\n` +
      `📊 Dataset: ${stats.total_datapoints} (harmful: ${stats.harmful_count}, safe: ${stats.safe_count})\n` +
      `🌍 Shared backend: ${sharedSent} ta yuborildi (boshqa userlar uchun)\n` +
      (r ? `🎯 ML model: ${r.accuracy.toFixed(0)}% aniqlik, F1 ${(r.model.f1_score * 100).toFixed(0)}%\n` : '⚠️ ML model 5 ta misol kutadi (lekin LLM darrov o\'rgandi)\n') +
      `\n🧪 **Tekshiruv (darrov sinab ko'rildi):**\n${verifyResults.join('\n')}\n\n` +
      `${verifyResults.every((v) => v.includes('✅'))
        ? '✨ Hammasi to\'g\'ri! Endi "Smart AI" tab\'da shu so\'zlarni sinang.'
        : '⚠️ Ba\'zilari hali to\'g\'ri ishlamadi — sababini tekshiramiz.'}`;
  });
}

// Rasm uchun label berish va o'rgatish
async function handleImageLabel(
  label: 'harmful' | 'safe',
  blob: Blob | null,
  text: string,
  run: (fn: () => Promise<string> | string) => Promise<void>,
  setImageDataUrl: (v: string | null) => void,
  setImageBlob: (v: Blob | null) => void,
) {
  if (!blob) return;
  return run(async () => {
    const va = await analyzeImage(blob);

    // Rasm fingerprint'ini matn sifatida saqlaymiz va o'rgatamiz
    const description = `Image fingerprint: skin=${va.skin_percentage.toFixed(0)}% faces=${va.face_regions?.length || 0} nsfw_score=${va.nsfw_score.toFixed(2)} dominant_colors=${(va.dominant_colors || []).slice(0, 3).map((c: any) => c.hex || c).join(',')} ${text ? '— ' + text : ''}`;

    const llm = getLocalLLM();
    await llm.initialize();
    llm.learnFromText(description, label);

    // Cleanup
    setImageDataUrl(null);
    setImageBlob(null);

    return `✅ Rasm "${label.toUpperCase()}" deb belgilandi va AI o'rgandi!\n\n` +
      `📊 **Rasm tahlili:**\n` +
      `- Skin: ${va.skin_percentage.toFixed(1)}%\n` +
      `- Faces: ${va.face_regions?.length || 0}\n` +
      `- NSFW score: ${(va.nsfw_score * 100).toFixed(0)}%\n` +
      `- Classification: ${va.classification.label}\n` +
      `- Dominant colors: ${(va.dominant_colors || []).slice(0, 5).map((c: any) => c.hex || c).join(', ')}\n` +
      `- Brightness: ${va.brightness?.toFixed(1) || 'N/A'}\n` +
      `${va.text_regions && va.text_regions.length > 0 ? `- OCR text: ${va.text_regions.length} regions\n` : ''}` +
      `\n💾 AI shu xususiyatlarni "${label}" deb eslab qoldi.\n` +
      `Keyingi safar shunaqa rasm ko'rsa, avtomatik tan oladi.\n\n` +
      `🧪 **Sinash uchun:** "Tahlil" tab'iga o'tib boshqa rasm yuklang.`;
  });
}

function tabLabel(t: Tab): string {
  return {
    parent: '🛡 Ota-ona Paneli',
    child: '📱 Bola Ilovasi',
    trust: '🤝 Shaffoflik',
    onboarding: '🚀 Onboarding',
    smart: '⚡ Smart AI',
    analyze: '🔍 Tahlil',
    media: '🖼 Rasm/Video',
    senior: '🧠 Senior Reasoning',
    chat: '💬 Suhbat',
    kbfolder: '📂 KB Folder',
    kb: '🌱 Seed KB',
    train: '📚 O\'rgatish',
    web: '🌐 Web qidiruv',
    status: '⚙️ Holat',
    shared: '🌍 Umumiy bilim',
  }[t];
}

function tabHint(t: Tab): string {
  return {
    parent: 'Ota-ona uchun to‘liq 10 bo‘limli boshqaruv markazi (FR-08 - FR-45)',
    child: 'Bola ilovasi (shaffoflik, qoidalar, SOS, havola tekshiruvi)',
    trust: 'Ommaviy ishonch va shaffoflik manifesti (3 tilda: uz, ru, en)',
    onboarding: '5 bosqichli yangi qurilma tayyorgarligi tekshiruvi (FR-39)',
    smart: '🔥 AI noma\'lum so\'zni internetdan o\'zi qidiradi va xulosa chiqaradi — eng aqlli rejim',
    analyze: 'Tezkor tahlil: matn zararlimi yoki xavfsizmi',
    media: '🖼 Rasm yoki video yuklang — NSFW.js model bilan haqiqiy tahlil (matn kerak emas)',
    senior: 'Chuqur ko\'p bosqichli tahlil: gipotezalar, causal chain, self-critique',
    chat: 'LocalLLM bilan suhbat — har qanday savol bering',
    kbfolder: '📂 KB folder yuklash. Input bo\'sh = plaintext, "enc" yozsangiz = SHIFRLANGAN kb.enc',
    kb: 'Tezkor seed yuklash (28 ta default misol)',
    train: 'AI ni o\'rgating: "harmful: [matn]" yoki "safe: [matn]"',
    web: 'Internetdan qidiring yoki URL kiritib sahifani tahlil qiling',
    status: 'AI miya holati va statistika',
    shared: 'Boshqa foydalanuvchilardan o\'rganish — umumiy bilim bazasi',
  }[t];
}

function tabPlaceholder(t: Tab): string {
  return {
    parent: '',
    child: '',
    trust: '',
    onboarding: '',
    smart: 'Har qanday matn, hatto AI bilmaydigan so\'zlar...\n\nMisol:\n- "fohisha"\n- "only fans"\n- "fuck"',
    analyze: 'Tekshirmoqchi bo\'lgan matnni kiriting...',
    media: '(matn kerak emas — rasm yoki video yuklang va "Ishga tushir" bosing)',
    senior: 'Chuqur tahlil uchun matn (uzunroq matn yaxshiroq natija beradi)...',
    chat: 'Savolingizni yozing...',
    kbfolder: 'Variantlar:\n  (bo\'sh)        — plaintext knowledge_base/ dan yuklash (dev)\n  enc            — shifrlangan kb.enc dan yuklash (production)',
    kb: 'Bo\'sh qoldiring — "Seed yukla" tugmasini bosing\nYOKI JSON/JSONL/CSV formatda yozing:\n[{"text":"...","label":"harmful","category":"sexual"}]',
    train: 'harmful: pornografiya saytlari\nyoki\nsafe: o\'qish kitoblari',
    web: 'qidiruv: AI safety\nyoki: https://example.com',
    status: '(input kerak emas — "Ishga tushir" bosing)',
    shared: 'Umumiy bazaga yuborish uchun matn (label: harmful/safe)',
  }[t];
}

async function handleRun(tab: Tab, input: string, run: (fn: () => Promise<string> | string) => Promise<void>) {
  switch (tab) {
    case 'smart':
      return run(async () => {
        // Rasm bo'lsa — to'liq rasm tahlili (NSFW.js + heuristika)
        const imgBlob = (globalThis as any).__currentImageBlob__ as Blob | null;
        if (imgBlob) {
          return formatImageAnalysis(await analyzeImageFull(imgBlob), input);
        }

        const a = await analyzeContentSmart(input);
        const diagnostic = buildDiagnosticEvaluation({
          text: input,
          contentType: 'text',
          aiCoreResult: processContentSync({ requestId: `lab-${Date.now()}`, text: input, contentType: 'text' }),
          metadata: {},
        });
        let out = `${formatAnalysis(a)}\n\n`;
        out += `${formatDiagnosticSummary(diagnostic)}\n\n`;

        if (a.auto_research?.triggered) {
          out += `\n🔬 **AUTO-RESEARCH ISHGA TUSHDI**\n`;
          out += `(Boshlang'ich confidence past edi — AI o'zi internetdan qidirdi)\n\n`;
          out += `**Tadqiqot qadamlari:**\n`;
          for (const step of a.auto_research.reasoning_steps) {
            out += `${step}\n`;
          }

          if (a.auto_research.research_results.length > 0) {
            out += `\n**Topilgan ta'riflar:**\n`;
            for (const r of a.auto_research.research_results) {
              if (r.found && r.definition) {
                out += `\n📖 "${r.query}" (${r.cached ? 'cached' : 'fresh'}):\n`;
                out += `   "${r.definition.slice(0, 200)}..."\n`;
                out += `   → ${r.inferred_verdict?.toUpperCase()} (${(r.confidence * 100).toFixed(0)}%)`;
                if (r.inferred_category) out += ` — ${r.inferred_category}`;
                out += `\n`;
              }
            }
          }

          if (a.auto_research.aggregate_verdict && a.auto_research.aggregate_verdict !== 'uncertain') {
            out += `\n🎯 **Aggregate verdict:** ${a.auto_research.aggregate_verdict.toUpperCase()} (${((a.auto_research.aggregate_confidence || 0) * 100).toFixed(0)}%)\n`;
          }
        } else {
          out += `\n✅ Confidence yuqori bo'ldi — auto-research kerak bo'lmadi`;
        }

        return out;
      });

    case 'analyze':
      return run(async () => {
        // Agar rasm yuklangan bo'lsa — to'liq rasm tahlili (NSFW.js + heuristika)
        const imgBlob = (globalThis as any).__currentImageBlob__ as Blob | null;
        if (imgBlob) {
          return formatImageAnalysis(await analyzeImageFull(imgBlob), input);
        }

        const a = analyzeContent(input);
        const diagnostic = buildDiagnosticEvaluation({
          text: input,
          contentType: 'text',
          aiCoreResult: processContentSync({ requestId: `lab-${Date.now()}`, text: input, contentType: 'text' }),
          metadata: {},
        });
        return `${formatAnalysis(a)}\n\n${formatDiagnosticSummary(diagnostic)}`;
      });

    case 'senior':
      return run(async () => {
        const a = await analyzeContentSenior(input);
        const engine = getSeniorReasoningEngine();
        const diagnostic = buildDiagnosticEvaluation({
          text: input,
          contentType: 'text',
          aiCoreResult: processContentSync({ requestId: `lab-${Date.now()}`, text: input, contentType: 'text' }),
          metadata: {},
        });
        if (a.senior_analysis) {
          return engine.formatAnalysisForDisplay(a.senior_analysis, 'uz') + '\n\n' + formatAnalysis(a) + '\n\n' + formatDiagnosticSummary(diagnostic);
        }
        return `${formatAnalysis(a)}\n\n${formatDiagnosticSummary(diagnostic)}`;
      });

    case 'chat':
      return run(async () => {
        const r = await chat(input);
        return `💬 ${r.text}\n\n` +
          `📊 Intent: ${r.intent.primary} | Topic: ${r.intent.topic} | Lang: ${r.intent.language}\n` +
          `Sentiment: ${r.intent.sentiment.toFixed(2)} | Urgency: ${r.intent.urgency.toFixed(2)}\n` +
          `Confidence: ${(r.confidence * 100).toFixed(0)}% | ${r.generation_ms.toFixed(0)}ms`;
      });

    case 'kbfolder':
      return run(async () => {
        const start = performance.now();
        const useEncrypted = /^(enc|shifr|encrypted)/i.test(input.trim());
        const progress = (cur: number, total: number, file: string) => {
          if (cur % 10 === 0) {
            const pct = ((cur / total) * 100).toFixed(0);
            const elapsed = ((performance.now() - start) / 1000).toFixed(1);
            console.log(`[KB] ${pct}% — ${cur}/${total} — ${elapsed}s — ${file.slice(0, 40)}`);
          }
        };

        if (useEncrypted) {
          const { loadEncryptedKBFolder } = await import('./content-insight-ai/lib/kb-folder-loader');
          const result = await loadEncryptedKBFolder({ onProgress: progress, retrain: true });
          return '🔒 **SHIFRLANGAN KB (kb.enc)**\n\n' + formatLoadResult(result);
        }

        const result = await loadKBFolder({ onProgress: progress, retrain: true });
        return formatLoadResult(result);
      });

    case 'kb':
      return run(async () => {
        const inputTrimmed = input.trim();
        let result;

        if (!inputTrimmed) {
          // No input → load seed
          result = await loadSeedKnowledge();
        } else if (inputTrimmed.startsWith('[') || inputTrimmed.startsWith('{')) {
          // JSON
          try {
            const entries = JSON.parse(inputTrimmed);
            const arr = Array.isArray(entries) ? entries : entries.entries || [entries];
            result = await loadKnowledgeBase({ entries: arr, retrain: true, trainLLM: true });
          } catch (e) {
            return `❌ JSON parse error: ${e instanceof Error ? e.message : 'unknown'}`;
          }
        } else {
          // Bulk text — "harmful: ... \n safe: ..."
          const entries = parseBulkText(inputTrimmed);
          if (entries.length === 0) {
            return '⚠️ Format topilmadi.\n\nQabul qilinadigan formatlar:\n1. Bo\'sh qoldiring → seed yuklanadi (28 ta misol)\n2. JSON: [{"text":"...","label":"harmful"}]\n3. Bulk text: har qatorda "harmful: matn" yoki "safe: matn"';
          }
          result = await loadKnowledgeBase({ entries, retrain: true, trainLLM: true });
        }

        return `🌱 **KB yuklash natijasi:**\n\n` +
          `✅ Yuklandi: ${result.loaded} / ${result.total_entries}\n` +
          `⏭ O'tkazib yuborildi: ${result.skipped}\n` +
          `⏱ ${result.load_time_ms.toFixed(0)}ms\n\n` +
          `**Label bo'yicha:**\n${Object.entries(result.by_label).map(([k, v]) => `  - ${k}: ${v}`).join('\n')}\n\n` +
          (Object.keys(result.by_category).length > 0
            ? `**Kategoriya bo'yicha:**\n${Object.entries(result.by_category).map(([k, v]) => `  - ${k}: ${v}`).join('\n')}\n\n`
            : '') +
          (result.ml_accuracy ? `🎯 ML model qayta o'rgatildi: ${result.ml_accuracy.toFixed(1)}% aniqlik\n\n` : '') +
          (result.errors.length > 0 ? `⚠️ Xatolar (${result.errors.length}):\n${result.errors.slice(0, 5).map((e) => `  - ${e}`).join('\n')}\n\n` : '') +
          `💡 Endi "Tahlil" tab'iga o'tib, "sexy" yoki shunga o'xshash so'zlarni tekshirib ko'ring!`;
      });

    case 'train':
      return run(async () => {
        const lines = input.split('\n').filter((l) => l.trim());
        let added = 0;
        const examples: Array<{ text: string; label: 'harmful' | 'safe' }> = [];
        const debugSteps: string[] = [];

        for (const line of lines) {
          // YANGI: bitta toza anchor-based extraction
          const ext = extractSubjects(line);
          if (ext) {
            debugSteps.push(...ext.debug);
            // Subject'lar — eng muhim (qisqa, aniq)
            for (const subj of ext.subjects) {
              examples.push({ text: subj, label: ext.label });
            }
            // Full context ham qo'shamiz (kengroq qamrov uchun)
            if (ext.fullContext.length >= 5 && !ext.subjects.includes(ext.fullContext)) {
              examples.push({ text: ext.fullContext, label: ext.label });
            }
            continue;
          }

          // Fallback: oddiy bitta so'z — shubhali bo'lsa avtomatik harmful
          if (line.trim().split(/\s+/).length <= 3) {
            if (/\b(fuck|shit|porn|sex|nude|kill|bomb|drug|jalab|kotak|sikish|behayo)\b/i.test(line)) {
              examples.push({ text: line.trim(), label: 'harmful' });
              debugSteps.push(`✓ Short harmful: "${line.trim()}" → harmful (auto)`);
              continue;
            }
          }

          debugSteps.push(`✗ Tushunmadim: "${line.trim().slice(0, 50)}..."`);
        }

        const llm = await import('./content-insight-ai/lib/brain').then((m) => m.getLocalLLM());
        await llm.initialize();
        for (const ex of examples) {
          addManualTrainingData(ex.text, ex.label, 'text');
          // ALSO train LLM embeddings immediately (even on 1 example)
          // Bu — eng muhim qism: AI darhol o'rganadi
          try {
            llm.learnFromText(ex.text, ex.label);
          } catch {}
          added++;
        }

        if (added === 0) {
          return '⚠️ Hech qanday misol topilmadi.\n\n' +
            (debugSteps.length > 0 ? `🔍 **Tahlil natijasi:**\n${debugSteps.join('\n')}\n\n` : '') +
            'Qabul qilinadigan formatlar:\n' +
            '1. "harmful: matn" yoki "safe: matn"\n' +
            '2. "X zararli content" — X subject sifatida olinadi\n' +
            '3. Tabiiy o\'zbekcha: "bikini sozi harmfullga kiradi" → bikini = harmful\n' +
            '4. Qisqa so\'kinish/zararli so\'zlar (avtomatik aniqlanadi)';
        }

        // 🔑 MUHIM: debounce'ni darrov flush qilamiz, aks holda trainModel/stats
        // eski (bo'sh) localStorage'ni o'qiydi va "Jami: 0" ko'rsatadi
        flushDataset();
        try { (llm as any).flushState?.(); } catch {}

        const r = trainModel();
        const stats = getTrainingStats();
        // Shared learning'ga ham yuborish (boshqa userlar uchun)
        let sharedSent = 0;
        try {
          const { getSharedLearningManager } = await import('./content-insight-ai/lib/shared-learning');
          const mgr = getSharedLearningManager();
          for (const ex of examples) {
            await mgr.submitFeedback({
              content: ex.text,
              verdict: ex.label as any,
              content_type: 'text',
              patterns: ex.text.split(/\s+/).slice(0, 5),
              confidence: 0.85,
              reason: 'O\'rgatish tab feedback',
              language: 'uz',
            });
            sharedSent++;
          }
        } catch (e) {
          debugSteps.push(`⚠️ Shared sync xato: ${e instanceof Error ? e.message : 'unknown'}`);
        }

        return `✅ ${added} ta misol qo'shildi:\n` +
          examples.map((e) => `  - [${e.label}] ${e.text.slice(0, 60)}`).join('\n') + '\n\n' +
          (debugSteps.length > 0 ? `🔍 **Tahlil qadamlari:**\n${debugSteps.join('\n')}\n\n` : '') +
          `📊 Jami: ${stats.total_datapoints} (harmful: ${stats.harmful_count}, safe: ${stats.safe_count})\n` +
          `🧠 AI LLM darrov o'rgandi — har bir subject "${examples[0]?.label}_user_feedback" sifatida KB'ga saqlandi\n` +
          `🌍 Shared backend'ga ${sharedSent} ta feedback yuborildi (boshqa userlar uchun)\n` +
          (r ? `🎯 ML model qayta o'rgatildi:\n- Aniqlik: ${r.accuracy.toFixed(1)}%\n- F1: ${(r.model.f1_score * 100).toFixed(1)}%\n- ${r.training_time_ms.toFixed(0)}ms` : '⚠️ ML model o\'rgatib bo\'lmadi (5 ta misol kerak), lekin LLM darrov o\'rgandi') +
          `\n\n⚠️ **MUHIM:** Hozir InMemorySharedBackend ulangan — faqat shu brauzer sessiyasida saqlanadi.\n` +
          `Production'da SupabaseSharedBackend ulansa, sizning feedback **barcha userlarga** yetib boradi.\n\n` +
          `💡 Endi "Smart AI" yoki "Tahlil" tab'iga o'tib **subject so'zini** sinab ko'ring!\n` +
          `Subject so'zlar (yangi o'rgangan): ${examples.filter((e) => e.text.split(' ').length <= 2).map((e) => `"${e.text}"`).join(', ')}`;
      });

    case 'web':
      return run(async () => {
        if (/^https?:\/\//.test(input)) {
          try {
            const page = await fetchWebPage(input);
            const a = analyzeContent(page.text.slice(0, 5000));
            return `🌐 **${page.title}**\n${page.url}\n\n📝 ${page.meta_description || '—'}\n\n--- Sahifa tahlili ---\n${formatAnalysis(a)}\n\n--- Sahifa matni (qisqartirilgan) ---\n${page.text.slice(0, 800)}...`;
          } catch (e) {
            return `❌ Sahifa olishda xato: ${e instanceof Error ? e.message : 'unknown'}\n\nSabab — CORS yoki tarmoq cheklov. Browser xavfsizligi sababli ko'p saytlar to'g'ridan-to'g'ri olinmaydi.\n\nYechim: production'da proxy server kerak.`;
          }
        }

        try {
          const results = await searchWeb(input);
          if (results.length === 0) {
            return '🔍 Natija topilmadi.\n\n' +
              '**Mumkin bo\'lgan sabablar:**\n' +
              '- Wikipedia API CORS bilan to\'sib qo\'yilgan\n' +
              '- Internet ulanish muammosi\n' +
              '- Query juda spetsifik\n\n' +
              '**Sinab ko\'ring:**\n' +
              '- Oddiyroq so\'rov: "Alisher Navoiy" (ism va familiya)\n' +
              '- To\'g\'ridan-to\'g\'ri Wikipedia URL: https://uz.wikipedia.org/wiki/Alisher_Navoiy\n\n' +
              '⚠️ **Eslatma:** Brauzerda mahalliy ishlaydigan AI uchun CORS jiddiy cheklov. Production\'da proxy server (Cloudflare Worker, Vercel API route) kerak.';
          }
          return results.slice(0, 5).map((r, i) => `${i + 1}. **${r.title}** [${r.language || r.source}]\n   ${r.url}\n   ${r.snippet.slice(0, 200)}`).join('\n\n');
        } catch (e) {
          return `❌ Qidiruvda xato: ${e instanceof Error ? e.message : 'unknown'}`;
        }
      });

    case 'status':
      return run(() => {
        // Special command: "clear" → wipe all localStorage state
        if (/^(clear|reset|tozala)$/i.test(input.trim())) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('cia_')) keysToRemove.push(k);
          }
          for (const k of keysToRemove) localStorage.removeItem(k);
          return `🗑 ${keysToRemove.length} ta localStorage kalit tozalandi:\n${keysToRemove.map((k) => `  - ${k}`).join('\n')}\n\n♻️ Sahifani reload qiling (Ctrl+F5)`;
        }

        // Show localStorage size
        let totalSize = 0;
        const sizes: Array<{ key: string; size: number }> = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k) {
            const v = localStorage.getItem(k) || '';
            const size = (k.length + v.length) * 2; // UTF-16 = 2 bytes
            totalSize += size;
            sizes.push({ key: k, size });
          }
        }
        sizes.sort((a, b) => b.size - a.size);

        const s = getBrainStatus();
        const llmStatus = getLocalLLMStatus();

        // Resurs Qo'riqchisi holati
        const guardian = getResourceGuardian();
        const g = guardian.getStatus();
        const guardianStr = `\n🛡️ **Resurs Qo'riqchisi:**\n` +
          `- Qurilma: ${g.device_tier.toUpperCase()} (${g.cores} yadro, ${g.memory_gb}GB)\n` +
          `- Batareya: ${g.battery_level !== null ? (g.battery_level * 100).toFixed(0) + '%' : 'noma\'lum'}${g.battery_charging ? ' ⚡' : ''}\n` +
          `- Qizish: ${g.thermal_pressure === 'high' ? '🔴 yuqori' : g.thermal_pressure === 'elevated' ? '🟡 o\'rta' : '🟢 normal'}\n` +
          `- O'rtacha inference: ${g.avg_inference_ms}ms\n` +
          `- Throttle kechikish: ${g.throttle_delay_ms}ms\n` +
          `- Cooldown: ${g.in_cooldown ? `🌡️ ${Math.ceil(g.cooldown_remaining_ms / 1000)}s` : '✅ yo\'q'}\n` +
          `- So'nggi 1 daqiqada: ${g.recent_inferences} tahlil\n`;

        return `💾 **localStorage holati:**\n` +
          `Jami: ${(totalSize / 1024).toFixed(1)} KB / ~5000 KB limit\n` +
          sizes.slice(0, 8).map((x) => `  - ${x.key}: ${(x.size / 1024).toFixed(1)} KB`).join('\n') +
          `\n\n💡 Tozalash uchun: "clear" yozing va Ishga tushir bosing\n` +
          guardianStr +
          `\n═══════════════════════════════\n\n` +
          `🧠 **AI Miya holati**\n\n` +
          `**Knowledge Graph:**\n` +
          `- Nodelar: ${s.knowledge_graph.total_nodes}\n` +
          `- Aloqalar: ${s.knowledge_graph.total_edges}\n` +
          `- O'rtacha ishonch: ${(s.knowledge_graph.avg_confidence * 100).toFixed(0)}%\n\n` +
          `**ML Model:**\n` +
          `- Dataset: ${s.ml_model.total_datapoints}\n` +
          `- O'rgatilgan: ${s.ml_model.models_trained}\n` +
          `- Oxirgi aniqlik: ${s.ml_model.latest_accuracy.toFixed(0)}%\n\n` +
          `**Fingerprintlar:** ${s.fingerprints_stored}\n\n` +
          `**Qobiliyatlar:**\n` +
          Object.entries(s.capabilities).map(([k, v]) => `- ${k}: ${v ? '✅' : '❌'}`).join('\n') +
          `\n\n---\n${llmStatus}`;
      });

    case 'shared':
      return run(async () => {
        const mgr = getSharedLearningManager();
        if (input.trim()) {
          const m = input.match(/^\s*(harmful|safe|zararli|xavfsiz)\s*:\s*(.+)/i);
          if (m) {
            const label = /harm|zarar/i.test(m[1]) ? 'harmful' : 'safe';
            await mgr.submitFeedback({
              content: m[2].trim(),
              verdict: label as any,
              content_type: 'text',
              patterns: m[2].trim().split(/\s+/).slice(0, 10),
              confidence: 0.8,
              language: 'uz',
            });
          }
        }
        const sync = await mgr.syncFromShared();
        const stats = await mgr.getStats();
        const local = mgr.getLocalState();
        return `🌍 **Umumiy bilim bazasi**\n\n` +
          `**Sinx:**\n- Yangi olingan: ${sync.total_new}\n- Mahalliy applied: ${local.applied}\n- Queue (offline): ${local.queued}\n- Oxirgi sinx: ${local.last_sync ? new Date(local.last_sync).toLocaleString() : '—'}\n\n` +
          `**Umumiy statistika:**\n- Jami yozuvlar: ${stats.total}\n- Harmful: ${stats.harmful}\n- Safe: ${stats.safe}\n\n` +
          `**Holat:** ${mgr['backend'].constructor.name}\n\n` +
          `**Eslatma:** Hozir InMemory backend ulangan — faqat shu sahifa davomida saqlanadi. Production'da Supabase yoki REST backend ulanadi.`;
      });
  }
}

function formatDiagnosticSummary(diagnostic: ReturnType<typeof buildDiagnosticEvaluation>): string {
  return [
    '🧪 **DIAGNOSTIC SUMMARY**',
    '',
    `🎯 Verdict: ${diagnostic.verdict.toUpperCase()} (${(diagnostic.confidence * 100).toFixed(0)}%)`,
    `🛡 Action: ${diagnostic.action.toUpperCase()}`,
    `🧭 Categories: ${diagnostic.detectedCategories.length > 0 ? diagnostic.detectedCategories.join(', ') : 'none'}`,
    '',
    diagnostic.action === 'block' ? '🚫 Why blocked:' : '✅ Why allowed:',
    ...(diagnostic.action === 'block' ? diagnostic.whyBlocked : diagnostic.whyAllowed).slice(0, 4).map((reason) => `  - ${reason}`),
    '',
    '🔗 Evidence trace:',
    ...diagnostic.trace.map((step) => `  - ${step.stage}: ${step.detail}`),
  ].join('\n');
}

function formatImageAnalysis(a: any, contextText?: string): string {
  const icon = a.verdict === 'harmful' ? '🚫' : a.verdict === 'safe' ? '✅' : '❓';
  let out = `🖼 **RASM TAHLILI**\n\n`;

  // Asosiy qaror
  out += `${icon} **${a.verdict.toUpperCase()}** (${(a.confidence * 100).toFixed(0)}%)\n`;
  out += `🔥 Xavf darajasi: ${a.risk_level}\n`;
  out += `🚷 Block: ${a.should_block ? 'HA' : 'YO\'Q'}\n\n`;

  // Tavsif
  out += `📝 **Tavsif:** ${a.description}\n\n`;
  out += `💡 ${a.recommendation}\n\n`;

  if (a.nsfw.available) {
    out += `🤖 **Vizual model natijasi:**\n`;
    out += `- Asosiy ko‘rinish: **${a.nsfw.top_class}**\n`;
    out += `- Model quyidagilarni aniqlashga harakat qildi: porn, hentai, sexy, drawing, neutral.\n`;
    if (a.nsfw.reasons.length > 0) {
      out += `- Natija sabablari:\n`;
      out += a.nsfw.reasons.slice(0, 3).map((r: string) => `   • ${r}`).join('\n') + '\n';
    }
    out += '\n';
  } else {
    out += `⚠️ **NSFW model yuklanmagan** — faqat lokal vision signallar ishlatilmoqda va bu kamroq aniq.\n\n`;
  }

  if (a.visual_understanding) {
    const objectLabels = Array.isArray(a.visual_understanding.objects)
      ? a.visual_understanding.objects.map((obj: any) => obj?.label).filter(Boolean)
      : [];
    out += `🧠 **Strukturaviy vizual tushuncha (heuristic):**\n`;
    out += `- Xulosa: ${a.visual_understanding.summary}\n`;
    out += `- Sahna: ${a.visual_understanding.scene}\n`;
    out += `- Muhit: ${a.visual_understanding.environment}\n`;
    out += `- Asosiy obyektlar: ${objectLabels.length > 0 ? objectLabels.join(', ') : 'noma’lum yoki aniqlanmagan'}\n`;
    out += `- Insonlar: ${a.visual_understanding.people_present ? `${a.visual_understanding.people_count} ta shaxs` : 'yo‘q'}\n`;
    out += `- Kamera: ${a.visual_understanding.visual_context || 'noma’lum'}\n`;
    if (Array.isArray(a.visual_understanding.object_purposes) && a.visual_understanding.object_purposes.length > 0) {
      out += `- Obyekt maqsadlari: ${a.visual_understanding.object_purposes.map((p: any) => `${p.label}: ${p.purpose}`).join('; ')}\n`;
    }
    out += `- Noaniqlik: ${(1 - (a.visual_understanding.confidence ?? 0) * 100).toFixed(0)}%\n`;
    out += `- Manba: ${a.visual_understanding.source_hint}\n`;
    out += `- Izoh: Bu tavsif faqat yuzlar, sahna tasnifi va boshqa heuristic signallarga asoslangan. Umumiy obyekt yoki odam da'volari model yordamida tasdiqlanmaguncha ehtiyotkor bo‘ling.\n`;
    out += `\n`;
  }

  if (a.context_understanding) {
    out += `📌 **Vizual kontekst tavsifi:**\n`;
    out += `- Sahna turi: ${a.context_understanding.scene_type}\n`;
    out += `- Kontent turi: ${a.context_understanding.content_type}\n`;
    out += `- Shaxs mavjudligi: ${a.context_understanding.person_present ? 'ha' : 'yo‘q'}\n`;
    out += `- Suggestive kontekst: ${a.context_understanding.suggestive_context ? 'ha' : 'yo‘q'}\n`;
    out += `- Ta’limiy kontekst: ${a.context_understanding.educational_context ? 'ha' : 'yo‘q'}\n`;
    out += `- Sport kontekst: ${a.context_understanding.sports_context ? 'ha' : 'yo‘q'}\n`;
    out += `- Oddiy kontent: ${a.context_understanding.ordinary_content ? 'ha' : 'yo‘q'}\n`;
    out += `- Qayta ishonganlik: ${(a.context_understanding.uncertainty * 100).toFixed(0)}%\n`;
    out += `- Izoh: ${a.context_understanding.rationale}\n`;
    out += `\n`;
  }

  // Heuristika (qo'shimcha — faqat obyektiv signallar)
  // Faqat ishonchli heuristik signallar (zo'ravonlik, matn) — buzuq yuz/teri olib tashlandi
  if (a.heuristic.violence_score > 0.4 || a.heuristic.has_text) {
    out += `🔬 **Qo'shimcha signallar:**\n`;
    if (a.heuristic.violence_score > 0.4) out += `- Zo'ravonlik ehtimoli: ${(a.heuristic.violence_score * 100).toFixed(0)}%\n`;
    if (a.heuristic.has_text) out += `- Rasmда matn topildi (${a.heuristic.text_regions} bo'lak)\n`;
  }

  // Sabablar
  if (a.reasons.length > 0) {
    const reasonsText = a.reasons.map((r: string) => '  - ' + r).join('\n');
    out += `\n🎯 **Sabablar:**\n${reasonsText}\n`;
  }

  out += `\n⏱ ${a.analysis_ms.toFixed(0)}ms`;

  return out;
}

function formatAnalysis(a: any): string {
  const v = a.verdict;
  const icon = v === 'harmful' ? '🚫' : v === 'safe' ? '✅' : '❓';
  return `${icon} **${v.toUpperCase()}** (${(a.confidence * 100).toFixed(0)}%)\n` +
    `🔥 Xavf darajasi: ${a.risk_level}\n` +
    `🚷 Block: ${a.should_block ? 'HA' : 'YO\'Q'}\n\n` +
    `💡 ${a.recommendation}\n\n` +
    `📊 **Semantik:**\n` +
    `- Toxicity: ${(a.semantic.toxicity * 100).toFixed(0)}%\n` +
    `- Sentiment: ${a.semantic.sentiment.toFixed(2)}\n` +
    `- Intent: ${a.semantic.intent}\n` +
    `- Til: ${a.semantic.language}\n` +
    (a.semantic.topics.length > 0 ? `- Mavzular: ${a.semantic.topics.join(', ')}\n` : '') +
    `\n🧠 **Fikrlash zanjiri (${a.reasoning.length} bosqich):**\n` +
    a.reasoning.slice(0, 8).map((s: any) => (s.contribution > 0 ? '🔴' : '🟢') + ' [' + s.module + '] ' + s.description).join('\n') +
    (a.senior_analysis ? `\n\n🎯 **Senior Reasoning:**\n- Gipotezalar: ${a.senior_analysis.hypotheses.length}\n- Causal chains: ${a.senior_analysis.causal_chains.length}\n- FP risk: ${(a.senior_analysis.self_critique.false_positive_risk * 100).toFixed(0)}%\n- FN risk: ${(a.senior_analysis.self_critique.false_negative_risk * 100).toFixed(0)}%\n- Reasoning depth: ${a.senior_analysis.reasoning_depth}\n- ${a.senior_analysis.reasoning_ms.toFixed(0)}ms` : '');
}

// ============================================================
// STYLES
// ============================================================

const panelStyle: React.CSSProperties = {
  background: '#1a1d27',
  border: '1px solid #2a2f3a',
  borderRadius: 8,
  padding: 16,
};

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  padding: '10px 18px',
  background: disabled ? '#2a2f3a' : '#4f8cff',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 600,
});

const secondaryBtn: React.CSSProperties = {
  padding: '10px 18px',
  background: 'transparent',
  color: '#e8e8ee',
  border: '1px solid #2a2f3a',
  borderRadius: 6,
  cursor: 'pointer',
};

function ExampleButtons({ label, items, onClick, color }: { label: string; items: string[]; onClick: (s: string) => void; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontSize: 11, color, fontWeight: 600, marginRight: 6 }}>{label}:</span>
      {items.map((s, i) => (
        <button
          key={i}
          onClick={() => onClick(s)}
          style={{
            margin: '2px 4px 2px 0',
            padding: '4px 8px',
            background: '#0f1117',
            border: `1px solid ${color}33`,
            borderRadius: 4,
            color: '#e8e8ee',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {s.slice(0, 35)}{s.length > 35 ? '…' : ''}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// MOUNT
// ============================================================

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
