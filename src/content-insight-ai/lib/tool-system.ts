// ============================================================
// TOOL SYSTEM v2 — Plugin/Tool arxitekturasi
//
// v1 dan farqi:
// - Input validation against schema
// - Retry logic with exponential backoff
// - Middleware/hook system (before/after execution)
// - Tool dependency declarations
// - Yangi built-in toollar: regex_match, url_analyze,
//   hash_compute, sentiment_score, text_translate_detect,
//   json_extract, word_frequency
// - content_analyze placeholder o'rniga haqiqiy implementation
// - Extractive summarization yaxshilangan (TextRank-like)
// ============================================================

export interface ToolDefinition {
  name: string;
  description: string;
  description_uz: string;
  category: ToolCategory;
  input_schema: ToolParam[];
  output_type: 'text' | 'json' | 'binary' | 'html';
  requires_network: boolean;
  rate_limit: { max_calls: number; window_ms: number };
  timeout_ms: number;
  enabled: boolean;
  retry?: { max_attempts: number; backoff_ms: number };
  depends_on?: string[];
}

export interface ToolParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: unknown;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  enum_values?: string[];
}

export type ToolCategory =
  | 'search'
  | 'fetch'
  | 'analyze'
  | 'transform'
  | 'vision'
  | 'utility';

export interface ToolResult {
  tool: string;
  success: boolean;
  data: string;
  error?: string;
  duration_ms: number;
  cached: boolean;
  timestamp: string;
  retries?: number;
}

export interface ToolCall {
  tool: string;
  input: string;
  result?: ToolResult;
  timestamp: string;
}

type ToolHandler = (input: string) => Promise<string>;

export type ToolMiddleware = (
  name: string,
  input: string,
  next: () => Promise<string>
) => Promise<string>;

interface RateLimitEntry {
  calls: number[];
}

interface CacheEntry {
  data: string;
  expires_at: number;
}

// ============================================================
// Tool Registry & Executor
// ============================================================

export class ToolSystem {
  private tools: Map<string, ToolDefinition> = new Map();
  private handlers: Map<string, ToolHandler> = new Map();
  private rateLimits: Map<string, RateLimitEntry> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private auditLog: ToolCall[] = [];
  private middlewares: ToolMiddleware[] = [];
  private maxAuditLog = 200;
  private cacheMaxAge = 5 * 60 * 1000;

  constructor() {
    this.registerBuiltinTools();
    this.loadAuditLog();
  }

  // ---- Middleware ----

  use(middleware: ToolMiddleware): void {
    this.middlewares.push(middleware);
  }

  removeMiddleware(middleware: ToolMiddleware): void {
    this.middlewares = this.middlewares.filter((m) => m !== middleware);
  }

  // ---- Registration ----

  registerTool(def: ToolDefinition, handler: ToolHandler): void {
    this.tools.set(def.name, def);
    this.handlers.set(def.name, handler);
  }

  unregisterTool(name: string): void {
    this.tools.delete(name);
    this.handlers.delete(name);
  }

  getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  listTools(category?: ToolCategory): ToolDefinition[] {
    const all = Array.from(this.tools.values());
    return category ? all.filter((t) => t.category === category) : all;
  }

  listEnabledTools(): string[] {
    return Array.from(this.tools.values())
      .filter((t) => t.enabled)
      .map((t) => t.name);
  }

  // ---- Input Validation ----

  validateInput(def: ToolDefinition, input: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input && def.input_schema.some((p) => p.required)) {
      errors.push('Input is required but empty');
      return { valid: false, errors };
    }

    for (const param of def.input_schema) {
      if (param.required && param.type === 'string') {
        if (param.min_length && input.length < param.min_length) {
          errors.push(`Input too short: min ${param.min_length} chars`);
        }
        if (param.max_length && input.length > param.max_length) {
          errors.push(`Input too long: max ${param.max_length} chars`);
        }
        if (param.pattern) {
          try {
            if (!new RegExp(param.pattern).test(input)) {
              errors.push(`Input doesn't match pattern: ${param.pattern}`);
            }
          } catch { /* skip invalid pattern */ }
        }
        if (param.enum_values && !param.enum_values.includes(input)) {
          errors.push(`Input must be one of: ${param.enum_values.join(', ')}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // ---- Dependency Check ----

  private checkDependencies(name: string): { ok: boolean; missing: string[] } {
    const def = this.tools.get(name);
    if (!def?.depends_on?.length) return { ok: true, missing: [] };

    const missing = def.depends_on.filter((dep) => {
      const depTool = this.tools.get(dep);
      return !depTool || !depTool.enabled;
    });

    return { ok: missing.length === 0, missing };
  }

  // ---- Execution with Retry ----

  async executeTool(name: string, input: string): Promise<ToolResult> {
    const start = performance.now();
    const timestamp = new Date().toISOString();

    const def = this.tools.get(name);
    if (!def) {
      return this.errorResult(name, `Tool "${name}" not found`, start, timestamp);
    }

    if (!def.enabled) {
      return this.errorResult(name, `Tool "${name}" is disabled`, start, timestamp);
    }

    // Validate input
    const validation = this.validateInput(def, input);
    if (!validation.valid) {
      return this.errorResult(name, `Validation failed: ${validation.errors.join('; ')}`, start, timestamp);
    }

    // Check dependencies
    const deps = this.checkDependencies(name);
    if (!deps.ok) {
      return this.errorResult(name, `Missing dependencies: ${deps.missing.join(', ')}`, start, timestamp);
    }

    // Rate limiting
    if (!this.checkRateLimit(name, def.rate_limit)) {
      return this.errorResult(name, `Rate limit exceeded for "${name}"`, start, timestamp);
    }

    // Cache check
    const cacheKey = `${name}:${input}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      const result: ToolResult = {
        tool: name,
        success: true,
        data: cached,
        duration_ms: performance.now() - start,
        cached: true,
        timestamp,
      };
      this.logCall({ tool: name, input, result, timestamp });
      return result;
    }

    // Execute with retry + middleware
    const maxAttempts = def.retry?.max_attempts || 1;
    const backoffMs = def.retry?.backoff_ms || 500;
    const handler = this.handlers.get(name)!;
    let lastError = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const exec = () => this.withTimeout(handler(input), def.timeout_ms);
        const data = await this.runMiddlewares(name, input, exec);

        const result: ToolResult = {
          tool: name,
          success: true,
          data: data.slice(0, 10000),
          duration_ms: performance.now() - start,
          cached: false,
          timestamp,
          retries: attempt - 1,
        };

        this.setCache(cacheKey, result.data);
        this.logCall({ tool: name, input, result, timestamp });
        return result;

      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unknown error';
        if (attempt < maxAttempts) {
          await this.sleep(backoffMs * Math.pow(2, attempt - 1));
        }
      }
    }

    const result = this.errorResult(name, `${lastError} (after ${maxAttempts} attempts)`, start, timestamp);
    result.retries = maxAttempts - 1;
    return result;
  }

  private async runMiddlewares(name: string, input: string, handler: () => Promise<string>): Promise<string> {
    if (this.middlewares.length === 0) return handler();

    let index = 0;
    const next = (): Promise<string> => {
      if (index >= this.middlewares.length) return handler();
      const mw = this.middlewares[index++];
      return mw(name, input, next);
    };
    return next();
  }

  // ---- Composition: execute multiple tools in sequence ----

  async executeChain(steps: Array<{ tool: string; input: string | ((prev: string) => string) }>): Promise<ToolResult[]> {
    const results: ToolResult[] = [];
    let prevOutput = '';

    for (const step of steps) {
      const input = typeof step.input === 'function' ? step.input(prevOutput) : step.input;
      const result = await this.executeTool(step.tool, input);
      results.push(result);

      if (!result.success) break;
      prevOutput = result.data;
    }

    return results;
  }

  // ---- Parallel execution ----

  async executeParallel(calls: Array<{ tool: string; input: string }>): Promise<ToolResult[]> {
    return Promise.all(calls.map((c) => this.executeTool(c.tool, c.input)));
  }

  // ---- Helpers ----

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
      promise.then(
        (val) => { clearTimeout(timer); resolve(val); },
        (err) => { clearTimeout(timer); reject(err); },
      );
    });
  }

  private checkRateLimit(name: string, limit: { max_calls: number; window_ms: number }): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(name) || { calls: [] };
    entry.calls = entry.calls.filter((t) => now - t < limit.window_ms);

    if (entry.calls.length >= limit.max_calls) return false;

    entry.calls.push(now);
    this.rateLimits.set(name, entry);
    return true;
  }

  private getFromCache(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires_at) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache(key: string, data: string): void {
    if (this.cache.size > 500) {
      const oldest = this.cache.keys().next().value;
      if (oldest) this.cache.delete(oldest);
    }
    this.cache.set(key, { data, expires_at: Date.now() + this.cacheMaxAge });
  }

  private errorResult(tool: string, error: string, startTime: number, timestamp: string): ToolResult {
    const result: ToolResult = {
      tool,
      success: false,
      data: '',
      error,
      duration_ms: performance.now() - startTime,
      cached: false,
      timestamp,
    };
    this.logCall({ tool, input: '', result, timestamp });
    return result;
  }

  private logCall(call: ToolCall): void {
    this.auditLog.unshift(call);
    if (this.auditLog.length > this.maxAuditLog) {
      this.auditLog.length = this.maxAuditLog;
    }
    this.saveAuditLog();
  }

  private loadAuditLog(): void {
    try {
      this.auditLog = JSON.parse(localStorage.getItem('cia_tool_audit') || '[]');
    } catch {
      this.auditLog = [];
    }
  }

  private saveAuditLog(): void {
    localStorage.setItem('cia_tool_audit', JSON.stringify(this.auditLog.slice(0, 50)));
  }

  getAuditLog(): ToolCall[] {
    return this.auditLog;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // ============================================================
  // Built-in Tools — v2
  // ============================================================

  private registerBuiltinTools(): void {

    // 1. Content Analyze — haqiqiy implementation
    this.registerTool(
      {
        name: 'content_analyze',
        description: 'Analyze text content for harmful patterns using keyword/regex scanning',
        description_uz: 'Matnni zararli naqshlar uchun keyword/regex bilan tahlil qilish',
        category: 'analyze',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to analyze', min_length: 1, max_length: 50000 }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 5000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(analyzeContentLocal(input));
      },
    );

    // 2. Text Summarize — yaxshilangan TextRank-like
    this.registerTool(
      {
        name: 'text_summarize',
        description: 'Summarize long text into key points using TextRank-like scoring',
        description_uz: 'Uzun matnni TextRank usulida qisqa xulosalarga aylantirish',
        category: 'transform',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to summarize', min_length: 20 }],
        output_type: 'text',
        requires_network: false,
        rate_limit: { max_calls: 50, window_ms: 60000 },
        timeout_ms: 3000,
        enabled: true,
      },
      async (input: string) => {
        return extractiveSummarize(input);
      },
    );

    // 3. Language Detect — kengaytirilgan
    this.registerTool(
      {
        name: 'language_detect',
        description: 'Detect the language of text (uz, en, ru, tr, ar, unknown)',
        description_uz: 'Matn tilini aniqlash (uz, en, ru, tr, ar)',
        category: 'utility',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to detect language of', min_length: 3 }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 200, window_ms: 60000 },
        timeout_ms: 1000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(detectLanguageAdvanced(input));
      },
    );

    // 4. Text Clean
    this.registerTool(
      {
        name: 'text_clean',
        description: 'Clean and normalize text (remove extra spaces, HTML tags, zero-width chars)',
        description_uz: 'Matnni tozalash va normalizatsiya qilish',
        category: 'transform',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to clean' }],
        output_type: 'text',
        requires_network: false,
        rate_limit: { max_calls: 200, window_ms: 60000 },
        timeout_ms: 1000,
        enabled: true,
      },
      async (input: string) => {
        return input
          .replace(/<[^>]+>/g, ' ')
          .replace(/&[a-z]+;/gi, ' ')
          .replace(/[​-‍﻿­]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      },
    );

    // 5. Keyword Extract — TF-IDF scoring
    this.registerTool(
      {
        name: 'keyword_extract',
        description: 'Extract keywords using TF-IDF-like scoring',
        description_uz: 'Matndan kalit so\'zlarni TF-IDF usulida ajratib olish',
        category: 'analyze',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to extract keywords from', min_length: 10 }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 2000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(extractKeywordsTfIdf(input));
      },
    );

    // 6. Similarity Check — cosine similarity on word vectors
    this.registerTool(
      {
        name: 'similarity_check',
        description: 'Check similarity between two texts using Jaccard + bigram overlap',
        description_uz: 'Ikki matnning o\'xshashligini Jaccard + bigram bilan tekshirish',
        category: 'analyze',
        input_schema: [
          { name: 'text1', type: 'string', required: true, description: 'First text' },
          { name: 'text2', type: 'string', required: true, description: 'Second text (separated by |||)' },
        ],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 2000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(advancedSimilarity(input));
      },
    );

    // 7. Regex Match — matnda regex pattern izlash
    this.registerTool(
      {
        name: 'regex_match',
        description: 'Find regex pattern matches in text. Format: pattern|||text',
        description_uz: 'Matnda regex naqshlarni topish. Format: pattern|||text',
        category: 'utility',
        input_schema: [
          { name: 'input', type: 'string', required: true, description: 'pattern|||text format' },
        ],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 2000,
        enabled: true,
      },
      async (input: string) => {
        const sep = input.indexOf('|||');
        if (sep === -1) return JSON.stringify({ error: 'Format: pattern|||text', matches: [] });
        const pattern = input.slice(0, sep);
        const text = input.slice(sep + 3);
        try {
          const regex = new RegExp(pattern, 'gi');
          const matches: { match: string; index: number }[] = [];
          let m;
          while ((m = regex.exec(text)) !== null && matches.length < 100) {
            matches.push({ match: m[0], index: m.index });
            if (!regex.global) break;
          }
          return JSON.stringify({ pattern, match_count: matches.length, matches: matches.slice(0, 50) });
        } catch (e) {
          return JSON.stringify({ error: `Invalid regex: ${e instanceof Error ? e.message : 'unknown'}`, matches: [] });
        }
      },
    );

    // 8. URL Analyze — URL xavfsizlik tahlili
    this.registerTool(
      {
        name: 'url_analyze',
        description: 'Analyze a URL for safety signals (suspicious TLD, IP address, long subdomain, etc)',
        description_uz: 'URL xavfsizligini tahlil qilish (shubhali TLD, IP manzil va h.k.)',
        category: 'analyze',
        input_schema: [{ name: 'url', type: 'string', required: true, description: 'URL to analyze', min_length: 5 }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 1000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(analyzeUrl(input));
      },
    );

    // 9. Hash Compute — matn hashini hisoblash
    this.registerTool(
      {
        name: 'hash_compute',
        description: 'Compute a fast hash (FNV-1a) of text for fingerprinting/dedup',
        description_uz: 'Matnning FNV-1a hashini hisoblash (fingerprint/dedup uchun)',
        category: 'utility',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to hash' }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 500, window_ms: 60000 },
        timeout_ms: 500,
        enabled: true,
      },
      async (input: string) => {
        const h32 = fnv1a32(input);
        const normalized = fnv1a32(input.toLowerCase().replace(/\s+/g, ' ').trim());
        return JSON.stringify({ hash: h32, normalized_hash: normalized, length: input.length });
      },
    );

    // 10. Sentiment Score — oddiy sentiment tahlil
    this.registerTool(
      {
        name: 'sentiment_score',
        description: 'Score text sentiment from -1 (very negative) to +1 (very positive)',
        description_uz: 'Matn sentimentini -1 (salbiy) dan +1 (ijobiy) gacha baholash',
        category: 'analyze',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to score', min_length: 2 }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 200, window_ms: 60000 },
        timeout_ms: 1000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(scoreSentiment(input));
      },
    );

    // 11. JSON Extract — JSON dan ma'lumot ajratib olish
    this.registerTool(
      {
        name: 'json_extract',
        description: 'Extract a value from JSON by dot-path. Format: path|||json',
        description_uz: 'JSON dan dot-path bo\'yicha qiymat ajratish. Format: path|||json',
        category: 'utility',
        input_schema: [{ name: 'input', type: 'string', required: true, description: 'path|||json format' }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 200, window_ms: 60000 },
        timeout_ms: 1000,
        enabled: true,
      },
      async (input: string) => {
        const sep = input.indexOf('|||');
        if (sep === -1) return JSON.stringify({ error: 'Format: path|||json' });
        const path = input.slice(0, sep).trim();
        const jsonStr = input.slice(sep + 3);
        try {
          const obj = JSON.parse(jsonStr);
          const parts = path.split('.');
          let val: unknown = obj;
          for (const part of parts) {
            if (val == null || typeof val !== 'object') { val = undefined; break; }
            val = (val as Record<string, unknown>)[part];
          }
          return JSON.stringify({ path, value: val ?? null, found: val !== undefined });
        } catch (e) {
          return JSON.stringify({ error: `Invalid JSON: ${e instanceof Error ? e.message : 'unknown'}` });
        }
      },
    );

    // 12. Word Frequency — so'z chastotasi
    this.registerTool(
      {
        name: 'word_frequency',
        description: 'Count word frequencies with stopword removal',
        description_uz: 'So\'z chastotasini hisoblash (stopword olib tashlash bilan)',
        category: 'analyze',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to analyze', min_length: 5 }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 1000,
        enabled: true,
      },
      async (input: string) => {
        return JSON.stringify(wordFrequency(input));
      },
    );
  }

  // ---- Status ----

  getStatus(lang: 'uz' | 'en'): string {
    const tools = this.listTools();
    const enabled = tools.filter((t) => t.enabled).length;
    const categories = new Set(tools.map((t) => t.category));

    const lines: string[] = [];
    lines.push(lang === 'uz' ? '🔧 **Tool tizimi holati (v2):**' : '🔧 **Tool system status (v2):**');
    lines.push(`${lang === 'uz' ? 'Jami toollar' : 'Total tools'}: ${tools.length} (${enabled} ${lang === 'uz' ? 'faol' : 'active'})`);
    lines.push(`${lang === 'uz' ? 'Kategoriyalar' : 'Categories'}: ${[...categories].join(', ')}`);
    lines.push(`${lang === 'uz' ? 'Middleware' : 'Middlewares'}: ${this.middlewares.length}`);
    lines.push('');

    for (const cat of categories) {
      const catTools = tools.filter((t) => t.category === cat);
      const catText = catTools.map((t) => (t.enabled ? '✅' : '❌') + ' ' + t.name).join(', ');
      lines.push(`**${cat}:** ${catText}`);
    }

    lines.push('');
    lines.push(`${lang === 'uz' ? 'So\'nggi chaqiruvlar' : 'Recent calls'}: ${this.auditLog.length}`);
    lines.push(`${lang === 'uz' ? 'Kesh hajmi' : 'Cache size'}: ${this.cache.size}`);

    return lines.join('\n');
  }
}

// ============================================================
// Utility functions for built-in tools
// ============================================================

function analyzeContentLocal(text: string): {
  harmful_score: number;
  safe_score: number;
  verdict: string;
  signals: string[];
  categories: string[];
} {
  const lower = text.toLowerCase();
  const signals: string[] = [];
  const categories: string[] = [];
  let harmfulScore = 0;
  let safeScore = 0;

  const harmfulPatterns: [RegExp, number, string, string][] = [
    [/\b(kill|murder|shoot|stab|bomb|attack|terroris[tm])\b/gi, 0.3, 'violence', 'Violence keywords'],
    [/\b(porn|xxx|nsfw|nude|naked|sex\s?video)\b/gi, 0.4, 'adult', 'Adult content keywords'],
    [/\b(drug|cocaine|heroin|meth|fentanyl|weed|marijuana)\b/gi, 0.2, 'drugs', 'Drug references'],
    [/\b(hack|exploit|malware|phishing|ransomware|ddos)\b/gi, 0.2, 'cyber_threat', 'Cyber threat keywords'],
    [/\b(suicide|self[- ]?harm|cut myself|end my life)\b/gi, 0.35, 'self_harm', 'Self-harm keywords'],
    [/\b(scam|fraud|steal|stolen|counterfeit)\b/gi, 0.2, 'fraud', 'Fraud keywords'],
    [/\b(nigger|faggot|kike|spic|chink)\b/gi, 0.4, 'hate_speech', 'Hate speech slurs'],
    [/\b(child\s*porn|cp\b|pedo|minor.*sex)/gi, 0.5, 'csam', 'CSAM indicators'],
    // O'zbek zararli so'zlar
    [/\b(o'ldir|pich[ao]q|bomba|teror|hujum)\b/gi, 0.3, 'violence', 'Zoravonlik (uz)'],
    [/\b(pornografiya|yalang'och|18\+|seks video)\b/gi, 0.4, 'adult', 'Kattalar kontenti (uz)'],
    [/\b(narkotik|giyoh|geroin|kokain)\b/gi, 0.2, 'drugs', 'Narkotik (uz)'],
  ];

  const safePatterns: [RegExp, number, string][] = [
    [/\b(education|learn|study|research|science|academi[ca])\b/gi, 0.15, 'Educational context'],
    [/\b(news|report|article|journal|press)\b/gi, 0.1, 'News/journalism context'],
    [/\b(medical|health|doctor|treatment|therapy|clinical)\b/gi, 0.12, 'Medical context'],
    [/\b(history|historical|museum|archive)\b/gi, 0.1, 'Historical context'],
    [/\b(ta\'lim|o'rganish|fan|tadqiqot|ilmiy)\b/gi, 0.15, 'Ta\'lim konteksti (uz)'],
    [/\b(tibbiy|sog'liq|davolash|shifoxona)\b/gi, 0.12, 'Tibbiy kontekst (uz)'],
  ];

  for (const [pattern, weight, category, label] of harmfulPatterns) {
    const matches = lower.match(pattern);
    if (matches && matches.length > 0) {
      harmfulScore += weight * Math.min(matches.length, 5);
      if (!categories.includes(category)) categories.push(category);
      signals.push(`${label}: ${matches.length} match(es)`);
    }
  }

  for (const [pattern, weight, label] of safePatterns) {
    const matches = lower.match(pattern);
    if (matches && matches.length > 0) {
      safeScore += weight * Math.min(matches.length, 5);
      signals.push(`${label}: ${matches.length} match(es)`);
    }
  }

  // Normalize
  harmfulScore = Math.min(harmfulScore, 1.0);
  safeScore = Math.min(safeScore, 1.0);

  let verdict = 'uncertain';
  if (harmfulScore > 0.3 && harmfulScore > safeScore * 1.5) verdict = 'harmful';
  else if (safeScore > 0.2 && safeScore > harmfulScore * 1.5) verdict = 'safe';
  else if (harmfulScore < 0.05 && safeScore < 0.05) verdict = 'neutral';

  return {
    harmful_score: Math.round(harmfulScore * 100) / 100,
    safe_score: Math.round(safeScore * 100) / 100,
    verdict,
    signals,
    categories,
  };
}

function extractiveSummarize(text: string, maxSentences = 5): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length <= maxSentences) return text;

  // Word frequency (TF)
  const wordFreq: Record<string, number> = {};
  const allWords = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  for (const w of allWords) {
    if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(wordFreq), 1);
  for (const w of Object.keys(wordFreq)) {
    wordFreq[w] /= maxFreq;
  }

  // Sentence similarity matrix (shared word count)
  const sentenceWords = sentences.map((s) =>
    new Set(s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => w.length > 3))
  );

  const scored = sentences.map((s, i) => {
    const words = s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    // TF score
    const tfScore = words.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) / (words.length || 1);
    // Position bonus
    const posBonus = i === 0 ? 0.4 : i === 1 ? 0.15 : i === sentences.length - 1 ? 0.1 : 0;
    // Sentence centrality (TextRank-like): how connected to other sentences
    let centrality = 0;
    for (let j = 0; j < sentenceWords.length; j++) {
      if (j === i) continue;
      const shared = [...sentenceWords[i]].filter((w) => sentenceWords[j].has(w)).length;
      const denom = Math.log(sentenceWords[i].size + 1) + Math.log(sentenceWords[j].size + 1);
      if (denom > 0) centrality += shared / denom;
    }
    centrality /= (sentences.length || 1);

    // Length penalty: too short or too long
    const lenPenalty = words.length < 5 ? -0.2 : words.length > 40 ? -0.1 : 0;

    return { sentence: s.trim(), score: tfScore * 0.4 + posBonus + centrality * 0.4 + lenPenalty, index: i };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxSentences).sort((a, b) => a.index - b.index);
  return top.map((s) => s.sentence).join(' ');
}

function detectLanguageAdvanced(text: string): { language: string; confidence: number; scores: Record<string, number> } {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = { uz: 0, en: 0, ru: 0, tr: 0, ar: 0 };

  // Uzbek markers
  const uzMatches = lower.match(/[ʻʼ''`]|ning\b|dagi\b|lari\b|larni\b|dan\b|\bva\b|\bbu\b|\byo'q\b|\bbo'l/g);
  scores.uz = (uzMatches?.length || 0) * 2;
  if (/[oʻ]/.test(text)) scores.uz += 3;
  if (/sh|ch|ng/.test(lower)) scores.uz += 1;

  // English markers
  const enMatches = lower.match(/\b(the|is|are|was|were|have|has|been|will|would|could|should|this|that|with|from|they|about|which|their)\b/g);
  scores.en = (enMatches?.length || 0) * 2;

  // Russian markers
  const ruMatches = text.match(/[а-яА-ЯёЁ]/g);
  scores.ru = (ruMatches?.length || 0) * 0.5;
  const ruWords = lower.match(/\b(это|что|как|для|его|она|они|был|все|мне|вот|так)\b/g);
  scores.ru += (ruWords?.length || 0) * 3;

  // Turkish markers
  const trMatches = lower.match(/\b(bir|ve|bu|ile|için|olan|değil|ama|çok|var)\b/g);
  scores.tr = (trMatches?.length || 0) * 2;
  if (/[ğışçöü]/.test(text)) scores.tr += 3;

  // Arabic markers
  const arMatches = text.match(/[؀-ۿ]/g);
  scores.ar = (arMatches?.length || 0) * 0.5;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const confidence = total > 0 ? Math.min(best[1] / total, 0.99) : 0.1;

  return {
    language: best[1] > 0 ? best[0] : 'unknown',
    confidence: Math.round(confidence * 100) / 100,
    scores,
  };
}

function extractKeywordsTfIdf(text: string): { keywords: { word: string; score: number }[]; bigrams: { phrase: string; count: number }[] } {
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'been', 'will', 'would', 'could', 'should',
    'they', 'them', 'their', 'what', 'when', 'where', 'which', 'while', 'about', 'into',
    'also', 'just', 'than', 'more', 'very', 'some', 'only', 'then', 'each', 'does',
    'bilan', 'uchun', 'kerak', 'boshqa', 'shuning', 'hamda', 'lekin', 'chunki', 'shunday',
  ]);

  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));
  const totalWords = words.length || 1;

  // TF
  const tf: Record<string, number> = {};
  for (const w of words) tf[w] = (tf[w] || 0) + 1;
  for (const w of Object.keys(tf)) tf[w] /= totalWords;

  // Pseudo-IDF: penalize very common words (>10% of text)
  const scored = Object.entries(tf).map(([word, freq]) => {
    const rawCount = freq * totalWords;
    const idf = rawCount > totalWords * 0.1 ? 0.5 : rawCount > totalWords * 0.05 ? 0.8 : 1.0;
    return { word, score: Math.round(freq * idf * 1000) / 1000 };
  });

  scored.sort((a, b) => b.score - a.score);

  // Bigrams
  const bigramCount: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
      const bg = `${words[i]} ${words[i + 1]}`;
      bigramCount[bg] = (bigramCount[bg] || 0) + 1;
    }
  }
  const bigrams = Object.entries(bigramCount)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase, count]) => ({ phrase, count }));

  return { keywords: scored.slice(0, 20), bigrams };
}

function advancedSimilarity(input: string): {
  jaccard: number;
  bigram_overlap: number;
  combined: number;
  common_words: number;
  common_bigrams: number;
} {
  const parts = input.split('|||');
  const text1 = (parts[0] || '').toLowerCase().replace(/[^\w\s]/g, '');
  const text2 = (parts[1] || '').toLowerCase().replace(/[^\w\s]/g, '');

  // Word-level Jaccard
  const words1 = new Set(text1.split(/\s+/).filter((w) => w.length > 2));
  const words2 = new Set(text2.split(/\s+/).filter((w) => w.length > 2));
  const wordIntersection = new Set([...words1].filter((x) => words2.has(x)));
  const wordUnion = new Set([...words1, ...words2]);
  const jaccard = wordUnion.size > 0 ? wordIntersection.size / wordUnion.size : 0;

  // Character bigram overlap
  const getBigrams = (s: string): Set<string> => {
    const bg = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) bg.add(s.slice(i, i + 2));
    return bg;
  };
  const bg1 = getBigrams(text1.replace(/\s/g, ''));
  const bg2 = getBigrams(text2.replace(/\s/g, ''));
  const bgIntersection = new Set([...bg1].filter((x) => bg2.has(x)));
  const bgUnion = new Set([...bg1, ...bg2]);
  const bigramOverlap = bgUnion.size > 0 ? bgIntersection.size / bgUnion.size : 0;

  const combined = jaccard * 0.6 + bigramOverlap * 0.4;

  return {
    jaccard: Math.round(jaccard * 1000) / 1000,
    bigram_overlap: Math.round(bigramOverlap * 1000) / 1000,
    combined: Math.round(combined * 1000) / 1000,
    common_words: wordIntersection.size,
    common_bigrams: bgIntersection.size,
  };
}

function analyzeUrl(input: string): {
  valid: boolean;
  hostname: string;
  protocol: string;
  risk_score: number;
  risk_signals: string[];
  is_ip: boolean;
  tld: string;
} {
  const signals: string[] = [];
  let riskScore = 0;

  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    const hostname = url.hostname.toLowerCase();

    // IP address
    const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
    if (isIp) { riskScore += 0.3; signals.push('IP address instead of domain'); }

    // Suspicious TLDs
    const tld = hostname.split('.').pop() || '';
    const suspiciousTlds = new Set(['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'work', 'click', 'loan', 'racing']);
    if (suspiciousTlds.has(tld)) { riskScore += 0.2; signals.push(`Suspicious TLD: .${tld}`); }

    // Very long subdomain
    const parts = hostname.split('.');
    if (parts.length > 4) { riskScore += 0.15; signals.push('Too many subdomains'); }
    if (hostname.length > 50) { riskScore += 0.1; signals.push('Very long hostname'); }

    // Homograph-like
    if (/[0oO][1lI]|rn/.test(hostname)) { riskScore += 0.1; signals.push('Possible homograph characters'); }

    // Non-HTTPS
    if (url.protocol !== 'https:') { riskScore += 0.15; signals.push('Not HTTPS'); }

    // @ in URL (credential stuffing)
    if (input.includes('@')) { riskScore += 0.3; signals.push('Contains @ (credential stuffing)'); }

    // Known safe
    const safeDomains = ['google.com', 'youtube.com', 'wikipedia.org', 'github.com', 'microsoft.com', 'apple.com'];
    if (safeDomains.some((d) => hostname.endsWith(d))) { riskScore -= 0.3; signals.push('Known safe domain'); }

    return {
      valid: true,
      hostname,
      protocol: url.protocol,
      risk_score: Math.round(Math.max(0, Math.min(1, riskScore)) * 100) / 100,
      risk_signals: signals,
      is_ip: isIp,
      tld,
    };
  } catch {
    return { valid: false, hostname: '', protocol: '', risk_score: 1, risk_signals: ['Invalid URL'], is_ip: false, tld: '' };
  }
}

function fnv1a32(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

function scoreSentiment(text: string): { score: number; label: string; positive_words: string[]; negative_words: string[] } {
  const lower = text.toLowerCase();
  const words = lower.replace(/[^\w\s]/g, '').split(/\s+/);

  const positiveDict = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best',
    'happy', 'joy', 'beautiful', 'perfect', 'awesome', 'brilliant', 'nice', 'kind', 'helpful',
    'thank', 'thanks', 'appreciate', 'glad', 'pleased', 'enjoy', 'exciting', 'success',
    'yaxshi', 'ajoyib', 'zo\'r', 'chiroyli', 'baxtli', 'rahmat', 'sevaman', 'mukammal', 'mamnun',
  ]);
  const negativeDict = new Set([
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'ugly', 'stupid', 'boring',
    'angry', 'sad', 'fear', 'pain', 'fail', 'wrong', 'poor', 'weak', 'sick', 'disgusting',
    'annoying', 'useless', 'pathetic', 'trash', 'garbage', 'disappointed', 'frustrating',
    'yomon', 'dahshatli', 'nafrat', 'xunuk', 'ahmoq', 'zerikarli', 'g\'azab', 'og\'riq', 'xato',
  ]);

  const negators = new Set(['not', 'no', 'never', 'neither', "don't", "doesn't", "isn't", "won't", "can't", "emas", "yo'q"]);

  const posWords: string[] = [];
  const negWords: string[] = [];
  let score = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const negated = i > 0 && negators.has(words[i - 1]);

    if (positiveDict.has(w)) {
      if (negated) { negWords.push(`not ${w}`); score -= 0.5; }
      else { posWords.push(w); score += 1; }
    } else if (negativeDict.has(w)) {
      if (negated) { posWords.push(`not ${w}`); score += 0.5; }
      else { negWords.push(w); score -= 1; }
    }
  }

  const total = posWords.length + negWords.length || 1;
  const normalized = Math.max(-1, Math.min(1, score / total));

  return {
    score: Math.round(normalized * 100) / 100,
    label: normalized > 0.2 ? 'positive' : normalized < -0.2 ? 'negative' : 'neutral',
    positive_words: posWords.slice(0, 10),
    negative_words: negWords.slice(0, 10),
  };
}

function wordFrequency(text: string): { total_words: number; unique_words: number; top: { word: string; count: number; percent: number }[] } {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'shall', 'would', 'could', 'should', 'may', 'might', 'can',
    'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'as', 'into', 'through',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither',
    'it', 'its', 'he', 'she', 'they', 'we', 'you', 'i', 'me', 'him', 'her', 'us', 'them',
    'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose',
    'va', 'bu', 'u', 'bilan', 'uchun', 'dan', 'ga', 'da', 'ni', 'ham',
  ]);

  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => w.length > 1 && !stopWords.has(w));
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const total = words.length || 1;

  return {
    total_words: words.length,
    unique_words: sorted.length,
    top: sorted.slice(0, 30).map(([word, count]) => ({
      word,
      count,
      percent: Math.round((count / total) * 10000) / 100,
    })),
  };
}
