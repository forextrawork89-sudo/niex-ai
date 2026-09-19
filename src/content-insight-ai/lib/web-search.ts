// ============================================================
// WEB SEARCH v2 — Internetdan ma'lumot izlash va olish
//
// v1 dan farqi:
// - Wikipedia API (bepul, kalit kerak emas)
// - Readability scoring bilan yaxshilangan content extraction
// - Paragraf ajratib olish (paragraph extraction)
// - Olingan sahifalar uchun content safety pre-check
// - Search result re-ranking (relevance + freshness + authority)
// - getStatus() operator precedence bug tuzatildi
// - Kengaytirilgan blocked domains ro'yxati
// - Multiple search engine fallback chain
// - Retry with backoff for failed fetches
// - Open Graph / structured data extraction
// ============================================================

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  fetched_at: string;
  relevance_score: number;
  is_safe?: boolean;
  language?: string;
}

export interface FetchedPage {
  url: string;
  title: string;
  text: string;
  meta_description: string;
  links: string[];
  images: string[];
  fetched_at: string;
  content_length: number;
  language: string;
  readability_score: number;
  paragraphs: string[];
  og_data: { title?: string; description?: string; image?: string; type?: string };
  safety: { safe: boolean; reasons: string[] };
}

export interface WebSearchConfig {
  proxy_url: string;
  search_api_url: string;
  search_api_key: string;
  max_results: number;
  timeout_ms: number;
  safe_search: boolean;
  cache_ttl_ms: number;
  allowed_domains: string[];
  blocked_domains: string[];
  retry_attempts: number;
  retry_backoff_ms: number;
}

const DEFAULT_CONFIG: WebSearchConfig = {
  proxy_url: '',
  search_api_url: '',
  search_api_key: '',
  max_results: 10,
  timeout_ms: 10000,
  safe_search: true,
  cache_ttl_ms: 10 * 60 * 1000,
  allowed_domains: [],
  blocked_domains: [
    // Adult
    'pornhub.com', 'xvideos.com', 'xhamster.com', 'xnxx.com',
    'livejasmin.com', 'chaturbate.com', 'onlyfans.com', 'redtube.com',
    'youporn.com', 'tube8.com', 'spankbang.com', 'brazzers.com',
    'stripchat.com', 'bongacams.com', 'cam4.com', 'myfreecams.com',
    'porntrex.com', 'eporner.com', 'tnaflix.com', 'drtuber.com',
    // Gambling
    '1xbet.com', 'betway.com', 'bet365.com', 'pokerstars.com',
    'mostbet.com', 'parimatch.com', 'linebet.com', 'melbet.com',
    // Piracy
    'thepiratebay.org', '1337x.to', 'rarbg.to', 'yts.mx',
    // Phishing/scam aggregators
    'grabify.link', 'iplogger.org',
  ],
  retry_attempts: 2,
  retry_backoff_ms: 500,
};

interface CacheEntry {
  data: SearchResult[] | FetchedPage;
  expires_at: number;
}

// ============================================================
// Web Search Engine v2
// ============================================================

export class WebSearchEngine {
  private config: WebSearchConfig;
  private cache: Map<string, CacheEntry> = new Map();

  constructor(config: Partial<WebSearchConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      const saved = JSON.parse(localStorage.getItem('cia_web_config') || '{}');
      this.config = { ...this.config, ...saved };
    } catch { /* use defaults */ }
  }

  updateConfig(update: Partial<WebSearchConfig>): void {
    this.config = { ...this.config, ...update };
    localStorage.setItem('cia_web_config', JSON.stringify(this.config));
  }

  getConfig(): WebSearchConfig {
    return { ...this.config };
  }

  // ============================================================
  // Search — fallback chain: API → DuckDuckGo → Wikipedia
  // ============================================================

  async search(query: string): Promise<SearchResult[]> {
    const cacheKey = `search:${query}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached as SearchResult[];

    const sanitized = this.sanitizeQuery(query);
    let results: SearchResult[] = [];

    // 1. Custom search API
    if (this.config.search_api_url && this.config.search_api_key) {
      results = await this.apiSearch(sanitized);
    }

    // 2. DuckDuckGo instant answers
    if (results.length < 3) {
      const ddg = await this.duckduckgoSearch(sanitized);
      results = this.mergeResults(results, ddg);
    }

    // 3. Wikipedia
    if (results.length < 3) {
      const wiki = await this.wikipediaSearch(sanitized);
      results = this.mergeResults(results, wiki);
    }

    // Re-rank
    results = this.rerankResults(results, sanitized);

    // Filter blocked
    results = this.filterBlockedDomains(results);

    this.setCache(cacheKey, results);
    return results;
  }

  // ---- Custom API ----

  private async apiSearch(query: string): Promise<SearchResult[]> {
    try {
      const url = new URL(this.config.search_api_url);
      url.searchParams.set('q', query);
      url.searchParams.set('num', String(this.config.max_results));
      if (this.config.safe_search) url.searchParams.set('safe', 'active');

      const response = await this.fetchWithRetry(url.toString(), {
        headers: { 'Authorization': `Bearer ${this.config.search_api_key}` },
      });

      if (!response.ok) return [];

      const data = await response.json();
      return this.parseSearchApiResponse(data);
    } catch {
      return [];
    }
  }

  // ---- DuckDuckGo ----

  private async duckduckgoSearch(query: string): Promise<SearchResult[]> {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const proxyUrl = this.config.proxy_url ? `${this.config.proxy_url}?url=${encodeURIComponent(url)}` : url;

      const response = await this.fetchWithRetry(proxyUrl);
      if (!response.ok) return [];

      const data = await response.json();
      const results: SearchResult[] = [];

      if (data.Answer) {
        results.push({
          title: 'Direct Answer',
          url: '',
          snippet: data.Answer,
          source: 'DuckDuckGo',
          fetched_at: new Date().toISOString(),
          relevance_score: 1.0,
        });
      }

      if (data.Abstract) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || '',
          snippet: data.Abstract,
          source: data.AbstractSource || 'DuckDuckGo',
          fetched_at: new Date().toISOString(),
          relevance_score: 0.9,
        });
      }

      if (data.RelatedTopics) {
        for (const topic of data.RelatedTopics.slice(0, this.config.max_results - results.length)) {
          if (topic.Text) {
            results.push({
              title: topic.Text.slice(0, 100),
              url: topic.FirstURL || '',
              snippet: topic.Text,
              source: 'DuckDuckGo',
              fetched_at: new Date().toISOString(),
              relevance_score: 0.7,
            });
          }
          // Nested topics (subcategories)
          if (topic.Topics) {
            for (const sub of topic.Topics.slice(0, 3)) {
              if (sub.Text) {
                results.push({
                  title: sub.Text.slice(0, 100),
                  url: sub.FirstURL || '',
                  snippet: sub.Text,
                  source: 'DuckDuckGo',
                  fetched_at: new Date().toISOString(),
                  relevance_score: 0.6,
                });
              }
            }
          }
        }
      }

      return results;
    } catch {
      return [];
    }
  }

  // ---- Wikipedia API ----

  private async wikipediaSearch(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // ALWAYS try Uzbek first if Uzbek-looking, otherwise English first
    const isUz = this.looksUzbek(query);
    const langOrder = isUz ? ['uz', 'en', 'ru'] : ['en', 'uz', 'ru'];

    for (const lang of langOrder) {
      try {
        const langResults = await this.wikipediaSearchLang(query, lang);
        results.push(...langResults);
        if (results.length >= 5) break;
      } catch {
        // Try next language
      }
    }

    return results;

    // Old code kept for reference:
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
      const proxyUrl = this.config.proxy_url ? `${this.config.proxy_url}?url=${encodeURIComponent(searchUrl)}` : searchUrl;

      const response = await this.fetchWithRetry(proxyUrl);
      if (!response.ok) return [];

      const data = await response.json();
      const items = data?.query?.search || [];
      for (const item of items) {
        const snippet = (item.snippet || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&[a-z]+;/gi, ' ');

        results.push({
          title: item.title || '',
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent((item.title || '').replace(/\s/g, '_'))}`,
          snippet,
          source: 'Wikipedia',
          fetched_at: new Date().toISOString(),
          relevance_score: 0.8,
          language: 'en',
        });
      }

      return results;
    } catch {
      return [];
    }
  }

  private async wikipediaSearchLang(query: string, lang: string): Promise<SearchResult[]> {
    try {
      const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
      const proxyUrl = this.config.proxy_url ? `${this.config.proxy_url}?url=${encodeURIComponent(searchUrl)}` : searchUrl;

      const response = await this.fetchWithRetry(proxyUrl);
      if (!response.ok) return [];

      const data = await response.json();
      const items = data?.query?.search || [];

      return items.map((item: { title?: string; snippet?: string }) => ({
        title: item.title || '',
        url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent((item.title || '').replace(/\s/g, '_'))}`,
        snippet: (item.snippet || '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' '),
        source: `Wikipedia (${lang})`,
        fetched_at: new Date().toISOString(),
        relevance_score: 0.75,
        language: lang,
      }));
    } catch {
      return [];
    }
  }

  private looksUzbek(text: string): boolean {
    // Apostrophes typical for Uzbek transliteration
    if (/[ʻʼ']|ning\b|dagi\b|lari\b|\bva\b|\bbu\b|\bbo'l|\byo'q|haqida|malumot|ma'lumot/i.test(text)) return true;
    // Common Uzbek names/words
    if (/\b(alisher|navoiy|samarqand|toshkent|buxoro|amir|temur|sherali|umarov|karimov)\b/i.test(text)) return true;
    // Common Uzbek endings
    if (/\b\w+(lar|lik|chi|dagi|ning|gan|moqchi|moqda)\b/i.test(text)) return true;
    return false;
  }

  // ---- Result merging & re-ranking ----

  private mergeResults(existing: SearchResult[], incoming: SearchResult[]): SearchResult[] {
    const seenUrls = new Set(existing.map((r) => r.url));
    const merged = [...existing];
    for (const r of incoming) {
      if (!r.url || !seenUrls.has(r.url)) {
        merged.push(r);
        seenUrls.add(r.url);
      }
    }
    return merged;
  }

  private rerankResults(results: SearchResult[], query: string): SearchResult[] {
    const queryTerms = new Set(query.toLowerCase().split(/\s+/).filter((w) => w.length > 2));

    const authorityDomains: Record<string, number> = {
      'wikipedia.org': 0.15, 'gov.': 0.12, '.edu': 0.12, 'bbc.com': 0.1,
      'reuters.com': 0.1, 'nature.com': 0.12, 'sciencedirect.com': 0.1,
      'github.com': 0.08, 'stackoverflow.com': 0.08, 'mozilla.org': 0.08,
    };

    return results.map((r) => {
      let score = r.relevance_score;

      // Term overlap boost
      const titleLower = r.title.toLowerCase();
      const snippetLower = r.snippet.toLowerCase();
      let termHits = 0;
      for (const term of queryTerms) {
        if (titleLower.includes(term)) termHits += 2;
        if (snippetLower.includes(term)) termHits += 1;
      }
      score += Math.min(termHits * 0.05, 0.3);

      // Authority boost
      for (const [domain, bonus] of Object.entries(authorityDomains)) {
        if (r.url.includes(domain)) { score += bonus; break; }
      }

      // Snippet quality: longer snippets with more info
      if (r.snippet.length > 200) score += 0.05;
      if (r.snippet.length > 500) score += 0.05;

      // Penalize empty URLs
      if (!r.url) score -= 0.1;

      return { ...r, relevance_score: Math.round(Math.min(score, 1.0) * 1000) / 1000 };
    }).sort((a, b) => b.relevance_score - a.relevance_score).slice(0, this.config.max_results);
  }

  // ============================================================
  // Fetch Page — with safety pre-check & readability
  // ============================================================

  async fetchPage(url: string): Promise<FetchedPage> {
    const cacheKey = `page:${url}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached as FetchedPage;

    if (this.isDomainBlocked(url)) {
      return this.errorPage(url, 'Domain is blocked');
    }

    const fetchUrl = this.config.proxy_url
      ? `${this.config.proxy_url}?url=${encodeURIComponent(url)}`
      : url;

    try {
      const response = await this.fetchWithRetry(fetchUrl);

      if (!response.ok) {
        return this.errorPage(url, `HTTP ${response.status}`);
      }

      const html = await response.text();
      const page = this.extractContent(url, html);

      // Safety pre-check
      page.safety = this.checkContentSafety(page.text, url);

      this.setCache(cacheKey, page);
      return page;

    } catch (err) {
      return this.errorPage(url, err instanceof Error ? err.message : 'Fetch failed');
    }
  }

  // ============================================================
  // Content Extraction — v2
  // ============================================================

  private extractContent(url: string, html: string): FetchedPage {
    // Title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/si);
    const title = titleMatch ? this.decodeHtmlEntities(titleMatch[1].trim()) : '';

    // Meta description
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/si)
      || html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/si);
    const metaDescription = metaMatch ? this.decodeHtmlEntities(metaMatch[1]) : '';

    // Open Graph
    const og_data = this.extractOpenGraph(html);

    // Language
    const langMatch = html.match(/<html[^>]+lang=["'](\w+)["']/i);
    const language = langMatch ? langMatch[1] : 'unknown';

    // Extract main content
    let mainHtml = html;

    // Priority: article > main > role=main > body content
    const contentSelectors = [
      /<article[^>]*>([\s\S]*?)<\/article>/si,
      /<main[^>]*>([\s\S]*?)<\/main>/si,
      /<div[^>]*role=["']main["'][^>]*>([\s\S]*?)<\/div>/si,
      /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/si,
      /<div[^>]*id=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/si,
    ];

    for (const selector of contentSelectors) {
      const match = html.match(selector);
      if (match && match[1].length > 200) {
        mainHtml = match[1];
        break;
      }
    }

    // Clean HTML
    const cleaned = this.cleanHtml(mainHtml);

    // Extract paragraphs
    const paragraphs = this.extractParagraphs(mainHtml);

    // Readability score
    const readabilityScore = this.computeReadability(cleaned);

    // Extract links
    const links: string[] = [];
    const linkRegex = /<a[^>]+href=["']([^"'#][^"']*)["']/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null && links.length < 30) {
      let href = linkMatch[1];
      if (href.startsWith('/')) {
        try { href = new URL(href, url).href; } catch { continue; }
      }
      if (href.startsWith('http')) links.push(href);
    }

    // Extract images
    const images: string[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null && images.length < 15) {
      let src = imgMatch[1];
      if (src.startsWith('/')) {
        try { src = new URL(src, url).href; } catch { continue; }
      }
      if (src.startsWith('http') || src.startsWith('data:')) images.push(src);
    }

    return {
      url,
      title,
      text: cleaned.slice(0, 30000),
      meta_description: metaDescription,
      links,
      images,
      fetched_at: new Date().toISOString(),
      content_length: cleaned.length,
      language,
      readability_score: readabilityScore,
      paragraphs,
      og_data,
      safety: { safe: true, reasons: [] },
    };
  }

  private cleanHtml(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(nav|header|footer|aside|iframe|form|noscript)[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private extractParagraphs(html: string): string[] {
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;

    while ((match = pRegex.exec(html)) !== null && paragraphs.length < 50) {
      const text = match[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (text.length > 30) {
        paragraphs.push(text);
      }
    }

    return paragraphs;
  }

  private extractOpenGraph(html: string): { title?: string; description?: string; image?: string; type?: string } {
    const get = (prop: string): string | undefined => {
      const match = html.match(new RegExp(`<meta[^>]*property=["']og:${prop}["'][^>]*content=["'](.*?)["']`, 'si'))
        || html.match(new RegExp(`<meta[^>]*content=["'](.*?)["'][^>]*property=["']og:${prop}["']`, 'si'));
      return match ? this.decodeHtmlEntities(match[1]) : undefined;
    };
    return { title: get('title'), description: get('description'), image: get('image'), type: get('type') };
  }

  private computeReadability(text: string): number {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 5);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const avgSentenceLen = sentences.length > 0 ? words.length / sentences.length : 0;

    // Syllable approximation
    const syllables = words.reduce((sum, w) => {
      const s = w.toLowerCase().replace(/[^a-z]/g, '');
      if (s.length <= 3) return sum + 1;
      const vowelGroups = s.match(/[aeiouy]+/g);
      return sum + Math.max(vowelGroups?.length || 1, 1);
    }, 0);
    const avgSyllablesPerWord = words.length > 0 ? syllables / words.length : 0;

    // Flesch Reading Ease (adapted for mixed-language)
    const flesch = 206.835 - (1.015 * avgSentenceLen) - (84.6 * avgSyllablesPerWord);

    // Paragraph structure bonus
    const paraCount = text.split(/\n\n/).filter((p) => p.trim().length > 30).length;
    const structureBonus = Math.min(paraCount * 2, 15);

    return Math.round(Math.max(0, Math.min(100, flesch + structureBonus)));
  }

  // ---- Content Safety Pre-check ----

  private checkContentSafety(text: string, url: string): { safe: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const lower = text.toLowerCase();

    const adultPatterns = /\b(porn|xxx|nsfw|nude|naked|sex\s?video|hentai|erotic)\b/gi;
    const adultMatches = lower.match(adultPatterns);
    if (adultMatches && adultMatches.length >= 3) {
      reasons.push(`Adult content keywords: ${adultMatches.length} matches`);
    }

    const violencePatterns = /\b(gore|beheading|execution|graphic\s*violence|torture\s*video)\b/gi;
    const violenceMatches = lower.match(violencePatterns);
    if (violenceMatches && violenceMatches.length >= 2) {
      reasons.push(`Graphic violence keywords: ${violenceMatches.length} matches`);
    }

    const drugPatterns = /\b(buy\s+cocaine|order\s+drugs|dark\s*web\s+market)\b/gi;
    const drugMatches = lower.match(drugPatterns);
    if (drugMatches) {
      reasons.push(`Drug marketplace keywords: ${drugMatches.length} matches`);
    }

    const phishingPatterns = /\b(verify your account|confirm your password|urgent.*action.*required|suspended.*login)\b/gi;
    const phishingMatches = lower.match(phishingPatterns);
    if (phishingMatches) {
      reasons.push(`Phishing indicators: ${phishingMatches.length} matches`);
    }

    // Check if URL itself has suspicious patterns
    const urlLower = url.toLowerCase();
    if (/\.(zip|exe|bat|cmd|msi|scr|ps1)$/i.test(urlLower)) {
      reasons.push('URL points to executable file');
    }

    return { safe: reasons.length === 0, reasons };
  }

  // ---- HTML Entity Decoding ----

  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
      '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…',
      '&laquo;': '«', '&raquo;': '»', '&copy;': '©', '&reg;': '®',
      '&trade;': '™', '&bull;': '•', '&middot;': '·', '&prime;': '′',
      '&#8220;': '“', '&#8221;': '”', '&#8216;': '‘', '&#8217;': '’',
    };
    return text.replace(/&[a-z#0-9]+;/gi, (match) => entities[match] || match);
  }

  // ---- Safety ----

  private sanitizeQuery(query: string): string {
    return query
      .replace(/[<>"'`;{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200);
  }

  private isDomainBlocked(url: string): boolean {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return this.config.blocked_domains.some((d) => hostname.includes(d));
    } catch {
      return false;
    }
  }

  private filterBlockedDomains(results: SearchResult[]): SearchResult[] {
    return results.filter((r) => !r.url || !this.isDomainBlocked(r.url));
  }

  // ---- Network ----

  private async fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeout_ms);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  private async fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retry_attempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options);
        return response;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        if (attempt < this.config.retry_attempts) {
          await new Promise((r) => setTimeout(r, this.config.retry_backoff_ms * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError;
  }

  // ---- Cache ----

  private getFromCache(key: string): SearchResult[] | FetchedPage | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires_at) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache(key: string, data: SearchResult[] | FetchedPage): void {
    // Evict oldest when over limit
    if (this.cache.size > 200) {
      const oldest = this.cache.keys().next().value;
      if (oldest) this.cache.delete(oldest);
    }
    this.cache.set(key, { data, expires_at: Date.now() + this.config.cache_ttl_ms });
  }

  // ---- Error helpers ----

  private errorPage(url: string, error: string): FetchedPage {
    return {
      url,
      title: 'Error',
      text: `Failed to fetch: ${error}`,
      meta_description: '',
      links: [],
      images: [],
      fetched_at: new Date().toISOString(),
      content_length: 0,
      language: 'unknown',
      readability_score: 0,
      paragraphs: [],
      og_data: {},
      safety: { safe: false, reasons: [error] },
    };
  }

  private parseSearchApiResponse(data: Record<string, unknown>): SearchResult[] {
    const results: SearchResult[] = [];

    const webObj = data.web as Record<string, unknown> | undefined;
    const items = (data.results || data.items || data.organic_results || webObj?.results || []) as Array<Record<string, unknown>>;

    for (const item of items.slice(0, this.config.max_results)) {
      results.push({
        title: String(item.title || item.name || ''),
        url: String(item.url || item.link || item.href || ''),
        snippet: String(item.snippet || item.description || item.content || ''),
        source: String(item.source || item.displayUrl || 'web'),
        fetched_at: new Date().toISOString(),
        relevance_score: Number(item.score || item.relevance || 0.5),
      });
    }

    return results;
  }

  // ---- Status (operator precedence bug FIXED) ----

  getStatus(lang: 'uz' | 'en'): string {
    const lines: string[] = [];
    lines.push(lang === 'uz' ? '🌐 **Web qidiruv holati (v2):**' : '🌐 **Web search status (v2):**');

    const apiLabel = this.config.search_api_url
      ? ('✅ ' + (lang === 'uz' ? 'Sozlangan' : 'Configured'))
      : ('❌ ' + (lang === 'uz' ? 'Sozlanmagan' : 'Not configured'));
    lines.push(`API: ${apiLabel}`);

    lines.push(`Proxy: ${this.config.proxy_url ? '✅' : '❌'}`);
    lines.push(`Safe search: ${this.config.safe_search ? '✅' : '❌'}`);
    lines.push(`Wikipedia: ✅ (${lang === 'uz' ? 'har doim mavjud' : 'always available'})`);
    lines.push(`${lang === 'uz' ? 'Bloklangan domenlar' : 'Blocked domains'}: ${this.config.blocked_domains.length}`);
    lines.push(`${lang === 'uz' ? 'Retry urinishlar' : 'Retry attempts'}: ${this.config.retry_attempts}`);
    lines.push(`${lang === 'uz' ? 'Kesh' : 'Cache'}: ${this.cache.size} entries`);

    return lines.join('\n');
  }
}
