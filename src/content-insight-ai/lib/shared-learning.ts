// ============================================================
// SHARED LEARNING — Foydalanuvchilar o'rtasida bilim almashish
//
// Muammo: har bir user o'z brauzerida alohida o'rganadi.
//   Bir user "bu kontent xato bloklandi" desa, boshqalar bilmaydi.
//
// Yechim: pluggable backend adapter.
//   - Har feedback markaziy serverga yuboriladi
//   - AI ishga tushganda hammaning feedback'larini yuklab oladi
//   - Mahalliy classifier yangilanadi
//   - Offline holatda ham ishlaydi (queue + retry)
//
// Backend adapter — Supabase, Firebase, oddiy REST — barchasi
// SharedBackend interfeysini implement qilsa, ulanadi.
// ============================================================

import type { FeedbackReport, ContentType, ContentVerdict } from '../types/feedback';

// ============================================================
// PUBLIC INTERFACE — har qanday backend shu interfeysni implement qilsa, ulanadi
// ============================================================

export interface SharedBackend {
  // Push: bir foydalanuvchi feedback'ini umumiy bazaga yuboradi
  pushFeedback(item: SharedFeedbackItem): Promise<void>;

  // Pull: ma'lum vaqtdan keyingi yangi feedbacklarni oladi
  pullFeedback(sinceTimestamp: number): Promise<SharedFeedbackItem[]>;

  // Statistika: umumiy bazada nechta yozuv borligini qaytaradi
  getStats(): Promise<{ total: number; harmful: number; safe: number; last_update: number }>;

  // Ulanish holati
  isOnline(): boolean;
}

export interface SharedFeedbackItem {
  id: string;
  content_excerpt: string;       // matn (max 500 belgi, privacy uchun qisqartirilgan)
  verdict: ContentVerdict;       // harmful / safe / uncertain
  content_type: ContentType;
  patterns: string[];            // ajratilgan keywordlar
  confidence: number;
  user_hash: string;             // anonim — kim yuborganini bilmaymiz, lekin spam'ni filter qilamiz
  reason?: string;               // user'ning izohi
  language: string;
  created_at: number;            // ms
  upvotes: number;               // boshqa userlar tasdiqlaydi
  downvotes: number;
}

// ============================================================
// PRIVACY HELPERS
// ============================================================

// User identifikatori — anonim, lekin spam aniqlash uchun ishlatiladi
function getUserHash(): string {
  let hash = localStorage.getItem('cia_user_hash');
  if (!hash) {
    hash = 'u_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    localStorage.setItem('cia_user_hash', hash);
  }
  return hash;
}

// Matnni anonimlashtirish — shaxsiy ma'lumotni o'chiradi
function sanitize(text: string): string {
  return text
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]')
    .replace(/\+?\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{2,4}/g, '[phone]')
    .replace(/\b\d{16,}\b/g, '[card]')
    .slice(0, 500);
}

// ============================================================
// IN-MEMORY BACKEND — sukut bo'yicha, ulangan backend yo'q paytda
// (faqat shu sessiya davomida saqlaydi)
// ============================================================

export class InMemorySharedBackend implements SharedBackend {
  private items: SharedFeedbackItem[] = [];

  async pushFeedback(item: SharedFeedbackItem): Promise<void> {
    this.items.push(item);
  }

  async pullFeedback(sinceTimestamp: number): Promise<SharedFeedbackItem[]> {
    return this.items.filter((i) => i.created_at > sinceTimestamp);
  }

  async getStats(): Promise<{ total: number; harmful: number; safe: number; last_update: number }> {
    return {
      total: this.items.length,
      harmful: this.items.filter((i) => i.verdict === 'harmful').length,
      safe: this.items.filter((i) => i.verdict === 'safe').length,
      last_update: this.items.length > 0 ? Math.max(...this.items.map((i) => i.created_at)) : 0,
    };
  }

  isOnline(): boolean {
    return true;
  }
}

// ============================================================
// SUPABASE BACKEND — agar user Supabase ulagan bo'lsa
// Adapter shu shaklda — supabase client'ni constructor'da uzating
// ============================================================

export interface SupabaseLike {
  from(table: string): {
    insert(row: any): Promise<{ error: any | null }>;
    select(cols?: string): {
      gt(col: string, val: any): Promise<{ data: any[] | null; error: any | null }>;
    };
    select(cols: string, opts: { count: 'exact'; head: true }): Promise<{ count: number | null; error: any | null }>;
  };
}

export class SupabaseSharedBackend implements SharedBackend {
  constructor(private client: SupabaseLike, private tableName = 'shared_feedback') {}

  async pushFeedback(item: SharedFeedbackItem): Promise<void> {
    try {
      const { error } = await this.client.from(this.tableName).insert(item);
      if (error) console.warn('[SharedLearning] push failed:', error);
    } catch (e) {
      console.warn('[SharedLearning] push exception:', e);
    }
  }

  async pullFeedback(sinceTimestamp: number): Promise<SharedFeedbackItem[]> {
    try {
      const { data, error } = await (this.client.from(this.tableName).select('*') as any).gt('created_at', sinceTimestamp);
      if (error || !data) return [];
      return data as SharedFeedbackItem[];
    } catch {
      return [];
    }
  }

  async getStats() {
    try {
      const res = await (this.client.from(this.tableName).select('*', { count: 'exact', head: true }) as any);
      return {
        total: res.count || 0,
        harmful: 0,
        safe: 0,
        last_update: Date.now(),
      };
    } catch {
      return { total: 0, harmful: 0, safe: 0, last_update: 0 };
    }
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}

// ============================================================
// REST API BACKEND — oddiy HTTP endpoint uchun
// Agar oddiy node/express server qursangiz, shuni ishlatasiz
// ============================================================

export class RestSharedBackend implements SharedBackend {
  constructor(private baseUrl: string, private authToken?: string) {}

  private headers(): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) h['Authorization'] = `Bearer ${this.authToken}`;
    return h;
  }

  async pushFeedback(item: SharedFeedbackItem): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/feedback`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(item),
      });
    } catch (e) {
      console.warn('[SharedLearning] push failed:', e);
    }
  }

  async pullFeedback(sinceTimestamp: number): Promise<SharedFeedbackItem[]> {
    try {
      const r = await fetch(`${this.baseUrl}/feedback?since=${sinceTimestamp}`, { headers: this.headers() });
      if (!r.ok) return [];
      return await r.json();
    } catch {
      return [];
    }
  }

  async getStats() {
    try {
      const r = await fetch(`${this.baseUrl}/feedback/stats`, { headers: this.headers() });
      if (!r.ok) return { total: 0, harmful: 0, safe: 0, last_update: 0 };
      return await r.json();
    } catch {
      return { total: 0, harmful: 0, safe: 0, last_update: 0 };
    }
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}

// ============================================================
// SHARED LEARNING MANAGER — asosiy sinx logikasi
// ============================================================

interface SharedLearningState {
  last_pull_timestamp: number;
  queued_items: SharedFeedbackItem[];   // offline paytda yig'iladi
  applied_items: string[];              // qaytmaslik uchun — qaysi item'larni allaqachon mahalliy o'rganganmiz
}

const STATE_KEY = 'cia_shared_learning_state';
const SYNC_INTERVAL_MS = 60_000;        // har 1 daqiqada sinx
const MAX_QUEUE_SIZE = 100;

export class SharedLearningManager {
  private backend: SharedBackend;
  private state: SharedLearningState;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private onNewItemsCallback: ((items: SharedFeedbackItem[]) => void) | null = null;

  constructor(backend: SharedBackend) {
    this.backend = backend;
    this.state = this.loadState();
  }

  // ---- Pluggable backend ----
  setBackend(backend: SharedBackend): void {
    this.backend = backend;
  }

  // ---- Submit user feedback to shared pool ----
  async submitFeedback(params: {
    content: string;
    verdict: ContentVerdict;
    content_type: ContentType;
    patterns: string[];
    confidence: number;
    reason?: string;
    language?: string;
  }): Promise<void> {
    const item: SharedFeedbackItem = {
      id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content_excerpt: sanitize(params.content),
      verdict: params.verdict,
      content_type: params.content_type,
      patterns: params.patterns.slice(0, 20),
      confidence: params.confidence,
      user_hash: getUserHash(),
      reason: params.reason?.slice(0, 200),
      language: params.language || 'unknown',
      created_at: Date.now(),
      upvotes: 0,
      downvotes: 0,
    };

    if (this.backend.isOnline()) {
      try {
        await this.backend.pushFeedback(item);
        return;
      } catch {
        // ulanish uzilgan — queue'ga qo'sh
      }
    }

    // Offline: queue
    this.state.queued_items.push(item);
    if (this.state.queued_items.length > MAX_QUEUE_SIZE) {
      this.state.queued_items = this.state.queued_items.slice(-MAX_QUEUE_SIZE);
    }
    this.saveState();
  }

  // ---- Pull new feedback from shared pool and apply locally ----
  async syncFromShared(): Promise<{ applied: SharedFeedbackItem[]; total_new: number }> {
    if (!this.backend.isOnline()) {
      return { applied: [], total_new: 0 };
    }

    try {
      const newItems = await this.backend.pullFeedback(this.state.last_pull_timestamp);

      // Filter — already applied
      const fresh = newItems.filter((it) => !this.state.applied_items.includes(it.id));

      // Apply locally
      if (fresh.length > 0 && this.onNewItemsCallback) {
        this.onNewItemsCallback(fresh);
      }

      // Update state
      for (const it of fresh) {
        this.state.applied_items.push(it.id);
      }
      // Keep only last 1000 applied IDs
      if (this.state.applied_items.length > 1000) {
        this.state.applied_items = this.state.applied_items.slice(-1000);
      }
      this.state.last_pull_timestamp = Date.now();

      // Flush queued offline items
      await this.flushQueue();

      this.saveState();

      return { applied: fresh, total_new: fresh.length };
    } catch (e) {
      console.warn('[SharedLearning] sync failed:', e);
      return { applied: [], total_new: 0 };
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.state.queued_items.length === 0) return;
    const queue = [...this.state.queued_items];
    this.state.queued_items = [];

    for (const item of queue) {
      try {
        await this.backend.pushFeedback(item);
      } catch {
        // Re-queue
        this.state.queued_items.push(item);
      }
    }
  }

  // ---- Background sync ----
  startBackgroundSync(intervalMs = SYNC_INTERVAL_MS): void {
    if (this.syncTimer) return;
    this.syncTimer = setInterval(() => {
      this.syncFromShared().catch(() => {});
    }, intervalMs);

    // Initial sync
    this.syncFromShared().catch(() => {});
  }

  stopBackgroundSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // ---- Callback for new items (host can apply them to local model) ----
  onNewItems(callback: (items: SharedFeedbackItem[]) => void): void {
    this.onNewItemsCallback = callback;
  }

  // ---- Stats ----
  async getStats() {
    return this.backend.getStats();
  }

  getLocalState(): { last_sync: number; queued: number; applied: number } {
    return {
      last_sync: this.state.last_pull_timestamp,
      queued: this.state.queued_items.length,
      applied: this.state.applied_items.length,
    };
  }

  // ---- Persistence ----
  private loadState(): SharedLearningState {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { last_pull_timestamp: 0, queued_items: [], applied_items: [] };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
    } catch {}
  }
}

// ============================================================
// SINGLETON
// ============================================================

let _manager: SharedLearningManager | null = null;

export function getSharedLearningManager(): SharedLearningManager {
  if (!_manager) {
    _manager = new SharedLearningManager(new InMemorySharedBackend());
  }
  return _manager;
}

export function configureSharedBackend(backend: SharedBackend): void {
  getSharedLearningManager().setBackend(backend);
}

export function applyFeedbackToBrain(items: SharedFeedbackItem[]): void {
  // Bu funksiya brain.ts tomonidan o'rnatiladi (circular dependency'ni oldini olish)
  // Default: hech narsa qilmaydi
  void items;
}
