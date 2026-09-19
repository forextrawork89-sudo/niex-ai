// ============================================================
// AUTO-RESEARCH — AI o'zi internetdan noma'lum so'zlarni o'rganadi
//
// Muammo: AI "fohisha" so'zini bilmaydi, chunki corpus'da yo'q.
//   Biz qo'lda har so'zni qo'shib o'tirmoqchi emasmiz.
//
// Yechim: AI o'zi qidiradi.
//   1. Matnda noma'lum so'z borligini aniqlaydi
//   2. Wikipedia/DuckDuckGo'da qidiradi
//   3. Topgan ta'rifni o'qiydi va tahlil qiladi
//   4. Xulosa chiqaradi: harmful/safe?
//   5. Natijani eslab qoladi (kelajakda qayta qidirmaydi)
//
// Bu — haqiqiy "fikrlash". AI bilmaydigan narsani bilib oladi.
// ============================================================

import { WebSearchEngine } from './web-search';
import { analyzeText } from './semantic-analyzer';
import type { ContentVerdict } from '../types/feedback';

export interface ResearchResult {
  query: string;
  found: boolean;
  definition?: string;
  source?: string;
  inferred_verdict?: ContentVerdict;
  inferred_category?: string;
  confidence: number;
  reasoning: string[];
  research_time_ms: number;
  cached: boolean;
}

interface ResearchCache {
  [word: string]: {
    verdict: ContentVerdict;
    category?: string;
    definition?: string;
    timestamp: number;
  };
}

const CACHE_KEY = 'cia_research_cache_v4'; // v4: faqat ishonchli natijalar cache qilinadi
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ============================================================
// MAIN: research a text or single word
// ============================================================

export class AutoResearcher {
  private webSearch: WebSearchEngine;
  private cache: ResearchCache = {};
  private inflight: Map<string, Promise<ResearchResult>> = new Map();

  constructor(webSearch: WebSearchEngine) {
    this.webSearch = webSearch;
    this.loadCache();
  }

  // Research a single unknown word/phrase
  async research(query: string): Promise<ResearchResult> {
    const start = performance.now();
    const normalized = query.toLowerCase().trim();
    const reasoning: string[] = [];

    // Check cache
    const cached = this.cache[normalized];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      reasoning.push(`✅ Cached: previously researched`);
      return {
        query,
        found: true,
        definition: cached.definition,
        inferred_verdict: cached.verdict,
        inferred_category: cached.category,
        confidence: 0.85,
        reasoning,
        research_time_ms: performance.now() - start,
        cached: true,
      };
    }

    // Deduplicate concurrent requests
    const existing = this.inflight.get(normalized);
    if (existing) return existing;

    const promise = this.doResearch(query, normalized, reasoning, start);
    this.inflight.set(normalized, promise);
    try {
      return await promise;
    } finally {
      this.inflight.delete(normalized);
    }
  }

  // ============================================================
  // YOZUV/TIL ANIQLASH — query qaysi yozuvда
  // ============================================================
  private detectScript(text: string): { script: string; wiktLangs: string[] } {
    if (/[Ѐ-ӿ]/.test(text)) return { script: 'cyrillic', wiktLangs: ['ru', 'en'] };       // Rus
    if (/[가-힯]/.test(text)) return { script: 'hangul', wiktLangs: ['ko', 'en'] };          // Koreys
    if (/[一-鿿]/.test(text)) return { script: 'han', wiktLangs: ['zh', 'en'] };             // Xitoy
    if (/[؀-ۿ]/.test(text)) return { script: 'arabic', wiktLangs: ['ar', 'en'] };          // Arab
    if (/[぀-ヿ]/.test(text)) return { script: 'kana', wiktLangs: ['ja', 'en'] };            // Yapon
    return { script: 'latin', wiktLangs: ['en'] };
  }

  // ============================================================
  // WIKTIONARY LUG'AT QIDIRUVI — "vulgar/slang" teglarini topadi
  // CORS-friendly, bepul, ko'p tilli
  // ============================================================
  private async lookupWiktionary(word: string, _langs: string[]): Promise<{ found: boolean; text: string; labels: string[] }> {
    // English Wiktionary chet so'zlarni inglizchaga tarjima qiladi — eng keng qamrov
    const fetchDef = async (w: string): Promise<{ text: string[]; labels: string[]; inflectionOf: string | null }> => {
      const text: string[] = [];
      const labels: string[] = [];
      let inflectionOf: string | null = null;
      try {
        const url = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`;
        const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!r.ok) return { text, labels, inflectionOf };
        const data = await r.json();
        for (const langKey of Object.keys(data)) {
          for (const pos of data[langKey] || []) {
            for (const def of pos.definitions || []) {
              const raw = def.definition || '';
              const clean = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              if (clean) text.push(clean);
              // Teglar (HTML'da usage-label sifatida)
              const tagMatch = (raw + ' ' + clean).match(/\b(vulgar|slang|offensive|derogatory|obscene|pejorative|taboo|profanity|ethnic\s+slur|colloquial)\b/gi);
              if (tagMatch) labels.push(...tagMatch.map((t) => t.toLowerCase()));
              // Inflection zanjiri: "inflection of X" → X ga ergashamiz
              const infl = raw.match(/title="([^"]+)"[^>]*>([^<]+)<\/a>/);
              if (/inflection of|plural of|genitive|singular of/i.test(clean) && infl) {
                inflectionOf = infl[1] || infl[2];
              }
            }
          }
        }
      } catch { /* tarmoq xatosi */ }
      return { text, labels, inflectionOf };
    };

    // 1-bosqich: so'zning o'zi
    const first = await fetchDef(word);
    let allText = [...first.text];
    let allLabels = [...first.labels];
    let inflTarget = first.inflectionOf;

    // 2-bosqich: ma'noli ta'rif yo'q bo'lsa, ko'plik→birlik shakllarini sinab ko'ramiz
    // "nénés" → "néné", "boobs" → "boob"
    const hasRealMeaning = allText.some((t) => !/inflection|plural|genitive|singular of|nominative/i.test(t) && t.length > 4);
    if (!hasRealMeaning) {
      const candidates: string[] = [];
      if (inflTarget) candidates.push(inflTarget);
      if (word.endsWith('s')) candidates.push(word.slice(0, -1));      // nénés → néné
      if (word.endsWith('es')) candidates.push(word.slice(0, -2));     // boxes → box
      if (word.endsWith('i')) candidates.push(word.slice(0, -1) + 'o'); // (it/ru ko'plik)

      for (const cand of [...new Set(candidates)].slice(0, 2)) {
        if (cand === word || cand.length < 2) continue;
        const base = await fetchDef(cand);
        allText.push(...base.text);
        allLabels.push(...base.labels);
        if (base.text.some((t) => t.length > 4)) break;
      }
    }

    return { found: allText.length > 0, text: allText.join(' '), labels: [...new Set(allLabels)] };
  }

  // ============================================================
  // WIKIPEDIA CONCEPT LOOKUP — har tilda atamaning MA'NOSINI oladi
  // Ko'p til Wikipedia summary (CORS-ok), eng keng qamrov
  // ============================================================
  private async lookupWikipedia(word: string, langs: string[]): Promise<{ found: boolean; text: string; langs: string[] }> {
    const texts: string[] = [];
    const foundLangs: string[] = [];

    const fetchSummary = async (lang: string): Promise<string> => {
      try {
        // Action API — CORS uchun rasmiy (origin=*), redirect'ni kuzatadi, User-Agent shart emas
        const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(word)}&format=json&origin=*`;
        const r = await fetch(url);
        if (!r.ok) return '';
        const data = await r.json();
        const pages = data?.query?.pages;
        if (!pages) return '';
        for (const pageId of Object.keys(pages)) {
          if (pageId === '-1') continue; // sahifa topilmadi
          const extract = pages[pageId]?.extract;
          if (extract && extract.length > 20) return extract;
        }
        return '';
      } catch { return ''; }
    };

    // Parallel — bir nechta til Wikipedia'sini sinab ko'ramiz
    const results = await Promise.all(langs.map(async (l) => ({ lang: l, text: await fetchSummary(word) })));
    for (const r of results) {
      if (r.text && r.text.length > 20) {
        texts.push(r.text);
        foundLangs.push(r.lang);
      }
    }

    return { found: texts.length > 0, text: texts.join(' '), langs: foundLangs };
  }

  // Ko'p tilli zararli KONSEPT detektori (root-larga asoslanadi)
  private detectConcept(text: string): { category: string; matches: string[] } | null {
    const t = text.toLowerCase();
    // Jinsiy konsept — ko'p til ildizlari
    const sexual = t.match(/sexuell|sexuel|sexual|sexo|sesso|секс|성적|性行|性爱|coitus|koitus|coito|copulation|kopulation|fellatio|cunnilingus|masturbat|intercourse|porno|pornograf|эрот|erotik|érotique|geschlechtsverkehr|beischlaf|coït|prostitu|пол(ов|.)\s?акт/gi);
    if (sexual && sexual.length >= 1) return { category: 'sexual', matches: [...new Set(sexual)].slice(0, 5) };
    // Narkotik
    const drug = t.match(/droge|drogue|narcótico|наркот|마약|毒品|kokain|heroin|cannabis|amphetamin|metamfetamin/gi);
    if (drug && drug.length >= 1) return { category: 'drugs', matches: [...new Set(drug)].slice(0, 5) };
    // Zo'ravonlik
    const violence = t.match(/gewalt|violence|violencia|насил|폭력|暴力|mord|asesinato|убийств|살인/gi);
    if (violence && violence.length >= 1) return { category: 'violence', matches: [...new Set(violence)].slice(0, 5) };
    // Qimor
    const gambling = t.match(/glücksspiel|gambling|apuesta|азартн|도박|赌博|casino|wett/gi);
    if (gambling && gambling.length >= 1) return { category: 'gambling', matches: [...new Set(gambling)].slice(0, 5) };
    return null;
  }

  private async doResearch(query: string, normalized: string, reasoning: string[], start: number): Promise<ResearchResult> {
    const { script, wiktLangs } = this.detectScript(query);
    // Wikipedia uchun nomzod tillar (Latin uchun ko'proq sinab ko'ramiz)
    const wikiLangs = script === 'latin'
      ? ['en', 'de', 'fr', 'es', 'it', 'tr', 'pt']
      : wiktLangs;
    reasoning.push(`🔤 Yozuv: ${script} → Wikipedia tillar: ${wikiLangs.join(', ')}`);

    // ====== 1-QADAM: WIKIPEDIA CONCEPT LOOKUP (eng keng qamrov) ======
    try {
      reasoning.push(`📖 Wikipedia'da "${query}" qidirilmoqda (ko'p til)...`);
      const wiki = await this.lookupWikipedia(query, wikiLangs);
      if (wiki.found) {
        reasoning.push(`✅ Wikipedia topdi (${wiki.langs.join(', ')}): ${wiki.text.slice(0, 80)}...`);
        const concept = this.detectConcept(wiki.text);
        if (concept) {
          reasoning.push(`🚫 Konsept aniqlandi: ${concept.category} (${concept.matches.join(', ')})`);
          this.cache[normalized] = { verdict: 'harmful', category: concept.category, definition: wiki.text.slice(0, 200), timestamp: Date.now() };
          this.saveCache();
          return {
            query, found: true, definition: wiki.text.slice(0, 200), source: `Wikipedia (${wiki.langs.join(',')})`,
            inferred_verdict: 'harmful', inferred_category: concept.category, confidence: 0.88,
            reasoning, research_time_ms: performance.now() - start, cached: false,
          };
        } else {
          reasoning.push(`ℹ️ Wikipedia topdi, lekin zararli konsept yo'q → ehtimol xavfsiz`);
        }
      } else {
        reasoning.push(`⚠️ Wikipedia'da topilmadi`);
      }
    } catch {
      reasoning.push(`⚠️ Wikipedia so'rovi muvaffaqiyatsiz`);
    }

    // 1-QADAM: Wiktionary lug'at qidiruvi (eng ishonchli "vulgar" signali)
    let wiktText = '';
    let wiktLabels: string[] = [];
    try {
      reasoning.push(`📚 Wiktionary'da "${query}" qidirilmoqda...`);
      const wikt = await this.lookupWiktionary(query, wiktLangs);
      if (wikt.found) {
        wiktText = wikt.text;
        wiktLabels = wikt.labels;
        reasoning.push(`✅ Wiktionary topdi. Teglar: ${wiktLabels.length > 0 ? wiktLabels.join(', ') : 'yo\'q'}`);
      } else {
        reasoning.push(`⚠️ Wiktionary'da topilmadi`);
      }
    } catch {
      reasoning.push(`⚠️ Wiktionary so'rovi muvaffaqiyatsiz`);
    }

    // Agar Wiktionary "vulgar/slang/offensive" desa → darrov zararli
    if (wiktLabels.some((l) => /vulgar|offensive|derogatory|obscene|pejorative|taboo|slur/.test(l))) {
      const category = wiktLabels.some((l) => /sexual/.test(l)) ? 'sexual'
        : wiktLabels.some((l) => /slur|ethnic|derogatory/.test(l)) ? 'hate'
        : 'profanity';
      this.cache[normalized] = { verdict: 'harmful', category, definition: wiktText.slice(0, 200), timestamp: Date.now() };
      this.saveCache();
      reasoning.push(`🚫 Wiktionary "${wiktLabels.join(', ')}" deb belgiladi → ZARARLI`);
      return {
        query, found: true, definition: wiktText.slice(0, 200), source: 'Wiktionary',
        inferred_verdict: 'harmful', inferred_category: category, confidence: 0.9,
        reasoning, research_time_ms: performance.now() - start, cached: false,
      };
    }

    reasoning.push(`🔍 "${query}" web'da qidirilmoqda...`);

    let searchResults;
    try {
      searchResults = await this.webSearch.search(query);
    } catch (e) {
      reasoning.push(`❌ Search failed: ${e instanceof Error ? e.message : 'unknown'}`);
      return {
        query,
        found: false,
        confidence: 0,
        reasoning,
        research_time_ms: performance.now() - start,
        cached: false,
      };
    }

    if (searchResults.length === 0 && !wiktText) {
      reasoning.push('❌ Hech qanday natija topilmadi (web + Wiktionary)');
      return {
        query,
        found: false,
        confidence: 0,
        reasoning,
        research_time_ms: performance.now() - start,
        cached: false,
      };
    }

    reasoning.push(`✅ ${searchResults.length} web natija + Wiktionary (${wiktText.length} belgi)`);

    // Combine snippets + Wiktionary matni
    const combinedText = (wiktText + ' ' + searchResults
      .slice(0, 3)
      .map((r) => `${r.title}. ${r.snippet}`)
      .join(' ')).trim();

    reasoning.push(`📖 Analyzing combined definitions (${combinedText.length} chars)`);

    // Analyze the combined text using our own semantic analyzer
    const semantic = analyzeText(combinedText);

    // Inference rules
    let verdict: ContentVerdict = 'uncertain';
    let category: string | undefined;
    let confidence = 0.5;

    // ========================================================
    // SIGNAL 1: META-INDIKATORLAR (eng kuchli, tildan qat'i nazar)
    // Lug'at/qidiruv natijasi so'zni "vulgar/slang/obscene/adult" deb ta'riflasa
    // ========================================================
    const metaVulgar = combinedText.match(/\b(vulgar|slang|obscene|offensive|profanity|profane|derogatory|crude|taboo|explicit|pornographic|swear\s?word|expletive|sexually|sexual\s+slang)\b/gi);
    const metaVulgarRu = combinedText.match(/(вульгарн|сленг|обсценн|нецензурн|\bмат\b|груб|оскорбит|пошл|неприлич|жаргон)/gi);
    const metaCount = (metaVulgar?.length || 0) + (metaVulgarRu?.length || 0);

    // ========================================================
    // SIGNAL 2: TO'LIQ KO'P TILLI TOXICITY (semantic.toxicity)
    // Bizning 9 tilli patternlar qidiruv natijasiga qo'llaniladi
    // ========================================================
    const toxic = semantic.toxicity;

    // ========================================================
    // SIGNAL 3: ADULT DOMENLAR qidiruv natijasida
    // ========================================================
    const adultDomain = /pornhub|xvideos|xnxx|xhamster|onlyfans|redtube|youporn|\.xxx|porn|adult/i.test(combinedText);

    // ========================================================
    // SIGNAL 4: harmful keyword'lar (ko'p tilli)
    // ========================================================
    const harmfulKeywords = combinedText.match(/\b(sexual|sexuality|pornograph|prostitut|erotic|nude|naked|adult\s+content|violence|murder|kill|terror|drug|narcotic|gambling|suicide|self.?harm|jinsiy|behayo|narkotik|qimor)\b/gi);
    const harmfulCount = harmfulKeywords?.length || 0;

    reasoning.push(`📊 Signallar: meta-vulgar=${metaCount}, toxicity=${(toxic * 100).toFixed(0)}%, adult-domain=${adultDomain}, harmful-kw=${harmfulCount}`);

    // ========================================================
    // QAROR — signallarni birlashtirish
    // ========================================================
    if (metaCount >= 1 && (harmfulCount >= 1 || toxic > 0.4 || adultDomain)) {
      // Lug'at "vulgar" deydi + boshqa harmful signal → ishonchli zararli
      verdict = 'harmful';
      confidence = Math.min(0.8 + metaCount * 0.05, 0.95);
      category = this.categorizeFromKeywords([...(harmfulKeywords || []), ...(metaVulgar || [])]);
      reasoning.push(`🚫 META + harmful: lug'at so'zni vulgar/slang deb ta'riflaydi + harmful signal`);
    } else if (adultDomain || harmfulCount >= 2) {
      verdict = 'harmful';
      confidence = Math.min(0.75 + harmfulCount * 0.05, 0.95);
      category = this.categorizeFromKeywords(harmfulKeywords || ['adult']);
      reasoning.push(`🚫 Adult domen yoki ko'p harmful keyword topildi`);
    } else if (toxic > 0.6) {
      verdict = 'harmful';
      confidence = toxic;
      reasoning.push(`🚫 Qidiruv natijasi yuqori toksiklik: ${(toxic * 100).toFixed(0)}%`);
    } else if (metaCount >= 2) {
      // Faqat meta (kuchli) — ehtimol so'kinish/sleng
      verdict = 'harmful';
      confidence = 0.7;
      category = 'profanity_or_slang';
      reasoning.push(`🚫 Lug'at so'zni qattiq vulgar/sleng deb belgilaydi (${metaCount} marta)`);
    } else if (toxic < 0.3 && metaCount === 0 && harmfulCount === 0) {
      verdict = 'safe';
      confidence = Math.max(1 - toxic, 0.6);
      reasoning.push(`✅ Zararli signal topilmadi — xavfsiz`);
    } else {
      verdict = 'uncertain';
      confidence = 0.5;
      reasoning.push(`❓ Aralash signallar — noaniq`);
    }

    // Extract definition (first sentence usually)
    const definition = combinedText
      .split(/[.!?]/)
      .find((s) => s.trim().length > 20)?.trim() || combinedText.slice(0, 200);

    // FAQAT ishonchli natijalarni cache qilamiz:
    // - harmful (har doim)
    // - safe faqat YUQORI ishonch bilan (>0.7)
    // Zaif/uncertain natijalar cache qilinmaydi → keyingi safar qayta qidiriladi
    if (verdict === 'harmful' || (verdict === 'safe' && confidence > 0.7)) {
      this.cache[normalized] = { verdict, category, definition, timestamp: Date.now() };
      this.saveCache();
      reasoning.push(`💾 Cache'ga saqlandi`);
    } else {
      reasoning.push(`⏭ Cache qilinmadi (zaif/noaniq — keyingi safar qayta qidiriladi)`);
    }

    return {
      query,
      found: true,
      definition,
      source: searchResults[0]?.source,
      inferred_verdict: verdict,
      inferred_category: category,
      confidence,
      reasoning,
      research_time_ms: performance.now() - start,
      cached: false,
    };
  }

  // ============================================================
  // Auto-research full text: find unknown words, research them
  // ============================================================

  async researchText(text: string, knownWords: Set<string>): Promise<{
    researched: ResearchResult[];
    aggregate_verdict: ContentVerdict;
    aggregate_confidence: number;
    reasoning: string[];
  }> {
    const reasoning: string[] = [];
    const trimmed = text.trim();

    // Non-Latin yozuv (koreys/xitoy/kirill/arab) yoki aksentli harflar bormi?
    const hasNonLatin = /[^ -ɏ\s]/.test(trimmed) || /[À-ÿ]/.test(trimmed);
    // Qisqa input (≤ 4 so'z yoki ≤ 25 belgi)
    const wordCount = trimmed.split(/\s+/).length;
    const isShort = wordCount <= 4 || trimmed.length <= 25;

    let words: string[];

    if (hasNonLatin || isShort) {
      // 🔑 Qisqa yoki non-Latin → BUTUN matnni bitta query sifatida qidiramiz
      // (CJK so'zlarni bo'lib bo'lmaydi, aksentli so'zlarni buzmaymiz)
      words = [trimmed];
      reasoning.push(`🔬 Non-Latin/qisqa input — butun matn qidiriladi: "${trimmed}"`);
    } else {
      // Latin, uzun matn — Unicode-aware tokenization, noma'lum so'zlar
      words = trimmed.toLowerCase()
        .split(/\s+/)
        .map((w) => w.replace(/[.,!?;:"'()]/g, ''))
        .filter((w) => w.length >= 3 && !knownWords.has(w))
        .slice(0, 5);

      if (words.length === 0) {
        reasoning.push('✓ Barcha so\'zlar ma\'lum — research kerak emas');
        return { researched: [], aggregate_verdict: 'uncertain', aggregate_confidence: 0, reasoning };
      }
      reasoning.push(`🔬 ${words.length} noma'lum so'z: ${words.join(', ')}`);
    }

    reasoning.push(`🌐 Internetda tadqiq qilinmoqda...`);

    // Research in parallel (but with a small limit)
    const results = await Promise.all(words.map((w) => this.research(w)));

    // Aggregate
    let harmfulVotes = 0;
    let safeVotes = 0;
    let totalConf = 0;
    let counted = 0;

    for (const r of results) {
      if (r.inferred_verdict === 'harmful') {
        harmfulVotes += r.confidence;
        totalConf += r.confidence;
        counted++;
        reasoning.push(`  🚫 "${r.query}" → HARMFUL (${(r.confidence * 100).toFixed(0)}%) — ${r.inferred_category || 'unknown cat'}`);
      } else if (r.inferred_verdict === 'safe') {
        safeVotes += r.confidence;
        totalConf += r.confidence;
        counted++;
        reasoning.push(`  ✅ "${r.query}" → SAFE (${(r.confidence * 100).toFixed(0)}%)`);
      } else {
        reasoning.push(`  ❓ "${r.query}" → UNCERTAIN`);
      }
    }

    let aggregateVerdict: ContentVerdict = 'uncertain';
    let aggregateConfidence = 0;

    if (harmfulVotes > safeVotes * 1.3) {
      aggregateVerdict = 'harmful';
      aggregateConfidence = Math.min(harmfulVotes / Math.max(counted, 1), 0.95);
    } else if (safeVotes > harmfulVotes * 1.3) {
      aggregateVerdict = 'safe';
      aggregateConfidence = Math.min(safeVotes / Math.max(counted, 1), 0.95);
    } else {
      aggregateVerdict = 'uncertain';
      aggregateConfidence = totalConf / Math.max(counted, 1) * 0.5;
    }

    reasoning.push(`🎯 Aggregate: ${aggregateVerdict.toUpperCase()} (${(aggregateConfidence * 100).toFixed(0)}%)`);

    return { researched: results, aggregate_verdict: aggregateVerdict, aggregate_confidence: aggregateConfidence, reasoning };
  }

  // ============================================================
  // Helpers
  // ============================================================

  private categorizeFromKeywords(keywords: string[]): string {
    const lower = keywords.join(' ').toLowerCase();
    if (/sex|porn|erotic|nude|naked|prostitut|adult|jinsiy|behayo|fohisha/.test(lower)) return 'sexual';
    if (/violence|murder|kill|terror|qotillik|zoravonlik/.test(lower)) return 'violence';
    if (/drug|narcotic|cocaine|heroin|narkotik|giyohvand/.test(lower)) return 'drugs';
    if (/gambling|casino|qimor|kazino/.test(lower)) return 'gambling';
    if (/suicide|self.?harm|suiisid|xudkushi/.test(lower)) return 'self_harm';
    return 'harmful_other';
  }

  private loadCache(): void {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) this.cache = JSON.parse(raw);
    } catch {}
  }

  private saveCache(): void {
    try {
      // Limit cache size: keep newest 500
      const entries = Object.entries(this.cache).sort((a, b) => b[1].timestamp - a[1].timestamp).slice(0, 500);
      this.cache = Object.fromEntries(entries);
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch {}
  }

  getCacheStats(): { total: number; harmful: number; safe: number; uncertain: number } {
    const all = Object.values(this.cache);
    return {
      total: all.length,
      harmful: all.filter((e) => e.verdict === 'harmful').length,
      safe: all.filter((e) => e.verdict === 'safe').length,
      uncertain: all.filter((e) => e.verdict === 'uncertain').length,
    };
  }

  clearCache(): void {
    this.cache = {};
    try { localStorage.removeItem(CACHE_KEY); } catch {}
  }
}

// ============================================================
// SINGLETON
// ============================================================

let _researcher: AutoResearcher | null = null;

export function getAutoResearcher(webSearch: WebSearchEngine): AutoResearcher {
  if (!_researcher) {
    _researcher = new AutoResearcher(webSearch);
  }
  return _researcher;
}
