// ============================================================
// LOCAL LLM — Tashqi API'siz ishlaydigan mahalliy AI miya
//
// Haqiqiy transformer emas, lekin regex/heuristic'dan 10x kuchli:
//
// 1. Word Embeddings — co-occurrence matrix, cosine similarity
//    So'zlar ma'nosini tushunadi (king-man+woman≈queen darajada emas,
//    lekin "porn" va "nsfw" o'xshash ekanini biladi)
//
// 2. Logistic Regression — SGD bilan o'rganadigan classifier
//    Naive Bayes'dan ancha kuchli, feature weights o'rganadi
//
// 3. N-gram Language Model — matn generatsiya va fluency scoring
//    Gapning tabiiyligini baholaydi, oddiy matn generatsiya qiladi
//
// 4. Semantic Search — TF-IDF + cosine similarity
//    Knowledge base'dan eng relevanti topadi
//
// 5. Smart Response Composer — kontekstga qarab javob tuzadi
//    Template + slot filling + conditional logic
//
// 6. Conversation Context Manager — suhbat kontekstini kuzatadi
//
// 7. Multi-layer Intent Parser — nima so'rayotganini tushunadi
//
// 8. Content Safety Scorer — ko'p signaldan birlashtirilgan baho
//
// Barcha data localStorage'da saqlanadi, vaqt o'tishi bilan o'rganadi
// ============================================================

// ============================================================
// TYPES
// ============================================================

export interface LocalLLMConfig {
  embedding_dim: number;
  context_window: number;
  ngram_order: number;
  learning_rate: number;
  min_word_freq: number;
  max_vocab_size: number;
}

export interface LLMResponse {
  text: string;
  intent: ParsedIntent;
  confidence: number;
  context_used: string[];
  generation_ms: number;
}

export interface ParsedIntent {
  primary: IntentType;
  sub_intents: string[];
  entities: ExtractedEntity[];
  question_type: QuestionType | null;
  sentiment: number;
  urgency: number;
  topic: string;
  language: 'uz' | 'en' | 'ru' | 'mixed';
}

export type IntentType =
  | 'content_check'
  | 'question'
  | 'command'
  | 'feedback'
  | 'greeting'
  | 'help'
  | 'analysis_request'
  | 'search_request'
  | 'teach_request'
  | 'complaint'
  | 'comparison'
  | 'explanation_request'
  | 'conversation'
  | 'unknown';

export type QuestionType =
  | 'what' | 'how' | 'why' | 'when' | 'where' | 'who'
  | 'yes_no' | 'choice' | 'quantity' | 'definition';

export interface ExtractedEntity {
  text: string;
  type: 'topic' | 'action' | 'object' | 'person' | 'url' | 'number' | 'content_type' | 'command';
  confidence: number;
  start: number;
  end: number;
}

interface WordVector {
  word: string;
  vec: Float32Array;
}

interface ConversationTurn {
  role: 'user' | 'ai';
  text: string;
  intent?: ParsedIntent;
  timestamp: number;
}

interface NGramModel {
  unigrams: Map<string, number>;
  bigrams: Map<string, number>;
  trigrams: Map<string, number>;
  total_unigrams: number;
  total_bigrams: number;
  total_trigrams: number;
}

interface LogisticModel {
  weights: Float32Array;
  bias: number;
  feature_names: string[];
  trained: boolean;
  accuracy: number;
  version: number;
}

// ============================================================
// CORPUS VERSION — bump when BUILTIN_CORPUS changes so existing
// users re-train embeddings instead of loading stale state.
// ============================================================

const CORPUS_VERSION = 3;
const STATE_KEY = 'cia_llm_state_v3';

// ============================================================
// DEFAULT CONFIG
// ============================================================

const DEFAULT_CONFIG: LocalLLMConfig = {
  embedding_dim: 64,
  context_window: 10,
  ngram_order: 3,
  learning_rate: 0.01,
  min_word_freq: 2,
  max_vocab_size: 10000,
};

// ============================================================
// BUILT-IN CORPUS — ko'p tillik, content safety domeniga oid
// ============================================================

const BUILTIN_CORPUS: string[] = [
  // Harmful content descriptions (for learning patterns)
  'pornography sexual explicit content adult nude naked nsfw xxx erotic',
  'violence murder kill attack weapon gun bomb explosive terrorism',
  'drugs cocaine heroin methamphetamine marijuana narcotic substance abuse',
  'gambling casino betting slot poker lottery addiction risk',
  'suicide self harm depression mental health crisis danger',
  'hacking phishing malware virus exploit cybercrime data breach',
  'scam fraud fake pyramid scheme ponzi money laundering',
  'hate speech racism discrimination bigotry slur offensive',
  'child exploitation abuse minor protection safety',
  'harassment bullying threat intimidation stalking',

  // Safe content descriptions
  'education learning school university student teacher lesson course study',
  'medical health doctor hospital treatment diagnosis clinical care',
  'news journalism article report press media coverage',
  'entertainment movie film music game video comedy drama',
  'sports football basketball tennis swimming championship athlete',
  'technology computer software programming developer code digital',
  'science research experiment discovery biology chemistry physics',
  'art museum painting sculpture creative design gallery exhibition',
  'cooking recipe food kitchen restaurant ingredient meal healthy',
  'family parent child baby kid toddler home care love',
  'travel tourism destination hotel flight adventure explore',
  'nature animal plant forest ocean mountain environment wildlife',
  'business company startup economy finance market investment',
  'history culture tradition heritage ancient civilization museum',

  // O'zbek tildagi corpuslar
  'pornografiya shahvoniy yalangoch behayo uyatsiz erotik kattalar uchun',
  'zoravonlik qotillik otish hujum qurol bomba portlash terrorchilik',
  'giyohvand nasha geroin kokain narkotik modda suiistimol',
  'qimor kazino tikish lotto stavka yutuq xavf',
  'o\'z joniga qasd xudkushi ruhiy tanazzul kayfiyat',
  'xakerlik fishing zararli dastur virus kiber jinoyat',
  'firibgarlik aldash soxta piramida pul yuvish',

  'ta\'lim o\'qish maktab universitet talaba o\'qituvchi dars kurs',
  'tibbiyot sog\'liqni saqlash shifokor kasalxona davolash tashxis',
  'yangilik jurnalistika maqola xabar matbuot ommaviy axborot',
  'ko\'ngilochar film kino musiqa o\'yin video komediya drama',
  'sport futbol basketbol tennis suzish chempionat sportchi',
  'texnologiya kompyuter dasturiy ta\'minot dasturlash raqamli',
  'fan tadqiqot tajriba kashfiyot biologiya kimyo fizika',
  'san\'at muzey rasm haykaltaroshlik ijodiy dizayn ko\'rgazma',
  'ovqat retsept oshxona restoran ingrediyent taom sog\'lom',
  'oila ota-ona bola chaqaloq uy g\'amxo\'rlik sevgi tarbiya',

  // Context patterns
  'how to prevent violence education awareness safety program',
  'documentary about drugs history research scientific study',
  'medical nudity clinical examination treatment health',
  'violence prevention anti bullying school program child safety',
  'news report about terrorism security measures government response',
  'zoravonlikning oldini olish ta\'lim xavfsizlik dasturi',
  'giyohvandlik haqida hujjatli film tadqiqot ilmiy ish',

  // Extended harmful content variations
  'sexual content adult website xxx pornographic explicit image video',
  'graphic violence blood gore torture brutal killing massacre',
  'illegal drug dealer trafficking distribution sale market dark web',
  'online gambling betting site casino slot machine real money',
  'self harm cutting starving suicide method overdose how',
  'malware ransomware trojan worm rootkit exploit zero day vulnerability',
  'phishing fake login credentials steal password identity theft',
  'fake news misinformation conspiracy theory propaganda manipulation',
  'cyberbullying online harassment threat doxing swatting stalking',
  'child predator grooming inappropriate contact minor underage',
  'hate group white supremacist extremist radicalization recruitment',
  'weapon manufacture instructions firearm explosive build guide',

  // Extended safe content variations
  'online course tutorial lecture programming web development learn',
  'university research paper publication peer review academic journal',
  'hospital clinic patient care diagnosis treatment therapy doctor',
  'breaking news current events politics economy weather forecast',
  'movie review film critic actor director cinema box office',
  'video game review gameplay walkthrough multiplayer streaming',
  'football match score goal player league championship trophy',
  'recipe ingredient cook bake meal breakfast lunch dinner restaurant',
  'family vacation trip travel destination beach mountain resort',
  'pet dog cat animal care veterinarian adoption shelter rescue',
  'startup company funding investor venture capital ipo growth',
  'climate change environment renewable energy solar wind sustainability',
  'mental health therapy counseling support depression anxiety help',
  'parenting child development pediatric vaccine schedule milestone',

  // Context-sensitive patterns (same words, different intent)
  'discussion about drugs to help addiction recovery treatment center',
  'documentary investigating human trafficking awareness prevention',
  'historical analysis of war atrocities genocide remembrance',
  'safety training workshop self defense self protection awareness',
  'medical professional describes anatomy biology reproductive system',
  'parent guide warning signs detect protect child online safety',
  'news investigation terror attack victims memorial response',
  'support group survivor abuse trauma recovery counseling help',

  // O'zbek tilidagi qo'shimchalar
  'jinsiy kontent kattalar uchun veb-sayt yalang\'och pornografik',
  'grafik zoravonlik qon dahshat qiynoq vahshiy qotillik',
  'noqonuniy narkotik sotuvchi tashish savdo qora bozor',
  'onlayn qimor tikish kazino slot real pul',
  'o\'z-o\'ziga zarar kesish och qolish suiisid usuli',
  'zararli dastur ransomware troyan eksploit',
  'fishing soxta login parol o\'g\'irlash shaxsiy ma\'lumot',
  'soxta yangilik aldash fitna nazariyasi propaganda',
  'kiber bullying onlayn ta\'qib do\'q ta\'qiblash',
  'bola tajovuzkor grooming nomaqbul aloqa voyaga yetmagan',

  'onlayn kurs dars dasturlash veb sayt yaratish o\'rganish',
  'universitet tadqiqot maqola nashr akademik jurnal',
  'shifoxona klinika bemor parvarish tashxis davolash',
  'so\'nggi yangilik joriy voqea siyosat iqtisod ob-havo',
  'film sharhi kinochi aktyor rejissor kino',
  'video o\'yin sharh gameplay multiplayer streaming',
  'futbol o\'yin gol o\'yinchi liga chempionat kubok',
  'retsept ingrediyent pishirish nonushta tushlik kechki ovqat',
  'oila ta\'til sayohat manzil sohil tog\' kurort',
  'uy hayvoni it mushuk veterinar boshpana qabul qilish',
  'startup kompaniya investor venture capital o\'sish',
  'iqlim o\'zgarishi atrof-muhit qayta tiklanadigan energiya',
  'ruhiy salomatlik terapiya maslahat depressiya tashvish yordam',
  'ota-onalik bola rivojlanishi pediatr emlash bosqich',

  // Edge cases — protective discussions of harmful topics in Uzbek
  'narkotik haqida muhokama yordam beruvchi reabilitatsiya markazi',
  'odam savdosi haqida hujjatli xabardorlik oldini olish',
  'urush vahshiyligi tarixiy tahlil genosid xotirlash',
  'xavfsizlik trening seminar o\'z-o\'zini himoya qilish',
  'shifokor anatomiya biologiya reproduktiv tizim tushuntiradi',
  'ota-ona qo\'llanma ogohlantirish belgilari bolani himoya qilish',
  'terror hujum qurbonlari yodgorlik javob choralari',
  'omon qolgan suiiste\'mol travma tiklanish maslahat yordam',
];

// ============================================================
// LOCAL LLM CLASS
// ============================================================

export class LocalLLM {
  private config: LocalLLMConfig;
  private vocab: Map<string, number> = new Map();
  private reverseVocab: Map<number, string> = new Map();
  private embeddings: Float32Array[] = [];
  private cooccurrence: Map<string, Map<string, number>> = new Map();
  private ngramModel: NGramModel;
  private logisticModel: LogisticModel;
  private conversationHistory: ConversationTurn[] = [];
  private knowledgeBase: Map<string, string[]> = new Map();
  private initialized = false;

  constructor(config: Partial<LocalLLMConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ngramModel = { unigrams: new Map(), bigrams: new Map(), trigrams: new Map(), total_unigrams: 0, total_bigrams: 0, total_trigrams: 0 };
    this.logisticModel = { weights: new Float32Array(0), bias: 0, feature_names: [], trained: false, accuracy: 0, version: 0 };
  }

  // ============================================================
  // 1. INITIALIZATION — corpus'dan o'rganish
  // ============================================================

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const saved = this.loadState();
    if (saved) {
      this.initialized = true;
      return;
    }

    // Build from corpus
    this.buildVocabulary(BUILTIN_CORPUS);
    this.buildCooccurrenceMatrix(BUILTIN_CORPUS);
    this.trainEmbeddings();
    this.buildNGramModel(BUILTIN_CORPUS);
    this.buildKnowledgeBase();

    this.initialized = true;
    this.saveState();
  }

  // ============================================================
  // 2. WORD EMBEDDINGS — Co-occurrence matrix + SVD-like
  // ============================================================

  private buildVocabulary(corpus: string[]): void {
    const freq: Map<string, number> = new Map();

    for (const doc of corpus) {
      for (const word of this.tokenize(doc)) {
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    }

    // Filter by frequency and sort
    const sorted = [...freq.entries()]
      .filter(([, f]) => f >= this.config.min_word_freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.max_vocab_size);

    this.vocab.clear();
    this.reverseVocab.clear();
    sorted.forEach(([word], idx) => {
      this.vocab.set(word, idx);
      this.reverseVocab.set(idx, word);
    });
  }

  private buildCooccurrenceMatrix(corpus: string[]): void {
    this.cooccurrence.clear();
    const window = this.config.context_window;

    for (const doc of corpus) {
      const tokens = this.tokenize(doc).filter((t) => this.vocab.has(t));

      for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i];
        if (!this.cooccurrence.has(word)) {
          this.cooccurrence.set(word, new Map());
        }
        const row = this.cooccurrence.get(word)!;

        for (let j = Math.max(0, i - window); j < Math.min(tokens.length, i + window + 1); j++) {
          if (j === i) continue;
          const context = tokens[j];
          const distance = Math.abs(i - j);
          const weight = 1 / distance; // closer words get higher weight
          row.set(context, (row.get(context) || 0) + weight);
        }
      }
    }
  }

  private trainEmbeddings(): void {
    const dim = this.config.embedding_dim;
    const vocabSize = this.vocab.size;

    // Initialize random embeddings
    this.embeddings = [];
    for (let i = 0; i < vocabSize; i++) {
      const vec = new Float32Array(dim);
      for (let d = 0; d < dim; d++) {
        vec[d] = (Math.random() - 0.5) * 0.1;
      }
      this.embeddings.push(vec);
    }

    // GloVe-like training: minimize (w_i · w_j - log(X_ij))^2
    const lr = 0.05;
    const epochs = 30;

    for (let epoch = 0; epoch < epochs; epoch++) {
      for (const [word, contexts] of this.cooccurrence) {
        const i = this.vocab.get(word);
        if (i === undefined) continue;

        for (const [ctx, count] of contexts) {
          const j = this.vocab.get(ctx);
          if (j === undefined) continue;

          const logCount = Math.log(1 + count);

          // Dot product
          let dot = 0;
          for (let d = 0; d < dim; d++) {
            dot += this.embeddings[i][d] * this.embeddings[j][d];
          }

          const diff = dot - logCount;
          const weight = Math.min(1, Math.pow(count / 10, 0.75)); // weighting function

          // Gradient update
          for (let d = 0; d < dim; d++) {
            const grad_i = weight * diff * this.embeddings[j][d];
            const grad_j = weight * diff * this.embeddings[i][d];
            this.embeddings[i][d] -= lr * grad_i;
            this.embeddings[j][d] -= lr * grad_j;
          }
        }
      }
    }

    // L2 normalize all vectors
    for (let i = 0; i < vocabSize; i++) {
      const vec = this.embeddings[i];
      let norm = 0;
      for (let d = 0; d < dim; d++) norm += vec[d] * vec[d];
      norm = Math.sqrt(norm) || 1;
      for (let d = 0; d < dim; d++) vec[d] /= norm;
    }
  }

  getWordVector(word: string): Float32Array | null {
    const idx = this.vocab.get(word.toLowerCase());
    if (idx === undefined) return null;
    return this.embeddings[idx];
  }

  // Cosine similarity between two words
  wordSimilarity(word1: string, word2: string): number {
    const v1 = this.getWordVector(word1);
    const v2 = this.getWordVector(word2);
    if (!v1 || !v2) return 0;
    return this.cosineSim(v1, v2);
  }

  // Find most similar words
  findSimilarWords(word: string, topK = 10): Array<{ word: string; similarity: number }> {
    const vec = this.getWordVector(word);
    if (!vec) return [];

    const results: Array<{ word: string; similarity: number }> = [];

    for (const [w, idx] of this.vocab) {
      if (w === word) continue;
      const sim = this.cosineSim(vec, this.embeddings[idx]);
      results.push({ word: w, similarity: sim });
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }

  // Sentence embedding — average of word vectors
  getSentenceVector(text: string): Float32Array {
    const dim = this.config.embedding_dim;
    const result = new Float32Array(dim);
    const tokens = this.tokenize(text);
    let count = 0;

    for (const token of tokens) {
      const vec = this.getWordVector(token);
      if (vec) {
        for (let d = 0; d < dim; d++) result[d] += vec[d];
        count++;
      }
    }

    if (count > 0) {
      for (let d = 0; d < dim; d++) result[d] /= count;
    }

    // Normalize
    let norm = 0;
    for (let d = 0; d < dim; d++) norm += result[d] * result[d];
    norm = Math.sqrt(norm) || 1;
    for (let d = 0; d < dim; d++) result[d] /= norm;

    return result;
  }

  // Semantic similarity between two texts
  textSimilarity(text1: string, text2: string): number {
    const v1 = this.getSentenceVector(text1);
    const v2 = this.getSentenceVector(text2);
    return this.cosineSim(v1, v2);
  }

  private cosineSim(a: Float32Array, b: Float32Array): number {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    const denom = Math.sqrt(na) * Math.sqrt(nb);
    return denom > 0 ? dot / denom : 0;
  }

  // ============================================================
  // 3. N-GRAM LANGUAGE MODEL
  // ============================================================

  private buildNGramModel(corpus: string[]): void {
    this.ngramModel = {
      unigrams: new Map(), bigrams: new Map(), trigrams: new Map(),
      total_unigrams: 0, total_bigrams: 0, total_trigrams: 0,
    };

    for (const doc of corpus) {
      const tokens = ['<s>', ...this.tokenize(doc), '</s>'];

      for (let i = 0; i < tokens.length; i++) {
        // Unigram
        this.ngramModel.unigrams.set(tokens[i], (this.ngramModel.unigrams.get(tokens[i]) || 0) + 1);
        this.ngramModel.total_unigrams++;

        // Bigram
        if (i < tokens.length - 1) {
          const bg = `${tokens[i]}|${tokens[i + 1]}`;
          this.ngramModel.bigrams.set(bg, (this.ngramModel.bigrams.get(bg) || 0) + 1);
          this.ngramModel.total_bigrams++;
        }

        // Trigram
        if (i < tokens.length - 2) {
          const tg = `${tokens[i]}|${tokens[i + 1]}|${tokens[i + 2]}`;
          this.ngramModel.trigrams.set(tg, (this.ngramModel.trigrams.get(tg) || 0) + 1);
          this.ngramModel.total_trigrams++;
        }
      }
    }
  }

  // Text probability (perplexity-like)
  scoreText(text: string): number {
    const tokens = ['<s>', ...this.tokenize(text), '</s>'];
    let logProb = 0;
    let count = 0;
    const vocabSize = this.ngramModel.unigrams.size || 1;

    for (let i = 1; i < tokens.length; i++) {
      let prob: number;

      if (i >= 2) {
        // Trigram with backoff
        const tg = `${tokens[i - 2]}|${tokens[i - 1]}|${tokens[i]}`;
        const bgContext = `${tokens[i - 2]}|${tokens[i - 1]}`;
        const tgCount = this.ngramModel.trigrams.get(tg) || 0;
        const bgContextCount = this.ngramModel.bigrams.get(bgContext) || 0;

        if (tgCount > 0 && bgContextCount > 0) {
          prob = tgCount / bgContextCount;
        } else {
          // Backoff to bigram
          const bg = `${tokens[i - 1]}|${tokens[i]}`;
          const ugContext = this.ngramModel.unigrams.get(tokens[i - 1]) || 0;
          const bgCount = this.ngramModel.bigrams.get(bg) || 0;

          if (bgCount > 0 && ugContext > 0) {
            prob = 0.4 * (bgCount / ugContext);
          } else {
            // Backoff to unigram
            prob = 0.1 * ((this.ngramModel.unigrams.get(tokens[i]) || 0) + 1) / (this.ngramModel.total_unigrams + vocabSize);
          }
        }
      } else {
        const bg = `${tokens[i - 1]}|${tokens[i]}`;
        const ugContext = this.ngramModel.unigrams.get(tokens[i - 1]) || 0;
        const bgCount = this.ngramModel.bigrams.get(bg) || 0;
        prob = ugContext > 0 ? (bgCount + 1) / (ugContext + vocabSize) : 1 / vocabSize;
      }

      logProb += Math.log(Math.max(prob, 1e-10));
      count++;
    }

    return count > 0 ? Math.exp(logProb / count) : 0;
  }

  // Generate next word predictions
  predictNextWords(context: string, topK = 5): Array<{ word: string; probability: number }> {
    const tokens = this.tokenize(context);
    const results: Array<{ word: string; probability: number }> = [];

    if (tokens.length >= 2) {
      const prefix = `${tokens[tokens.length - 2]}|${tokens[tokens.length - 1]}|`;
      for (const [tg, count] of this.ngramModel.trigrams) {
        if (tg.startsWith(prefix)) {
          const word = tg.split('|')[2];
          const bgKey = `${tokens[tokens.length - 2]}|${tokens[tokens.length - 1]}`;
          const bgCount = this.ngramModel.bigrams.get(bgKey) || 1;
          results.push({ word, probability: count / bgCount });
        }
      }
    }

    if (results.length < topK && tokens.length >= 1) {
      const prefix = `${tokens[tokens.length - 1]}|`;
      for (const [bg, count] of this.ngramModel.bigrams) {
        if (bg.startsWith(prefix)) {
          const word = bg.split('|')[1];
          if (!results.some((r) => r.word === word)) {
            const ugCount = this.ngramModel.unigrams.get(tokens[tokens.length - 1]) || 1;
            results.push({ word, probability: count / ugCount * 0.5 });
          }
        }
      }
    }

    return results.sort((a, b) => b.probability - a.probability).slice(0, topK);
  }

  // ============================================================
  // 4. LOGISTIC REGRESSION CLASSIFIER (SGD)
  // ============================================================

  trainClassifier(data: Array<{ text: string; label: 'harmful' | 'safe' }>): { accuracy: number; version: number } {
    if (data.length < 5) return { accuracy: 0, version: this.logisticModel.version };

    // Extract features: word embeddings + manual features
    const featureNames: string[] = [];
    const featureVectors: Float32Array[] = [];
    const labels: number[] = [];

    // Build feature vocabulary from data
    const wordSet = new Set<string>();
    for (const d of data) {
      for (const t of this.tokenize(d.text)) wordSet.add(t);
    }
    const topWords = [...wordSet].slice(0, 500);

    // Feature names: embedding dims + top words + manual features
    for (let d = 0; d < this.config.embedding_dim; d++) featureNames.push(`emb_${d}`);
    for (const w of topWords) featureNames.push(`word_${w}`);
    featureNames.push('text_length', 'avg_word_length', 'has_url', 'exclamation_count', 'caps_ratio');

    const totalFeatures = featureNames.length;

    for (const d of data) {
      const vec = new Float32Array(totalFeatures);
      const sentVec = this.getSentenceVector(d.text);
      const tokens = this.tokenize(d.text);

      // Embedding features
      for (let i = 0; i < this.config.embedding_dim; i++) {
        vec[i] = sentVec[i];
      }

      // Word presence features (binary TF)
      const tokenSet = new Set(tokens);
      for (let i = 0; i < topWords.length; i++) {
        vec[this.config.embedding_dim + i] = tokenSet.has(topWords[i]) ? 1 : 0;
      }

      // Manual features
      const manualStart = this.config.embedding_dim + topWords.length;
      vec[manualStart] = Math.min(d.text.length / 500, 1);
      vec[manualStart + 1] = tokens.reduce((s, t) => s + t.length, 0) / (tokens.length || 1) / 10;
      vec[manualStart + 2] = /https?:\/\//.test(d.text) ? 1 : 0;
      vec[manualStart + 3] = Math.min((d.text.match(/!/g) || []).length / 5, 1);
      vec[manualStart + 4] = (d.text.match(/[A-Z]/g) || []).length / (d.text.length || 1);

      featureVectors.push(vec);
      labels.push(d.label === 'harmful' ? 1 : 0);
    }

    // SGD training
    const weights = new Float32Array(totalFeatures);
    let bias = 0;
    const lr = this.config.learning_rate;
    const epochs = 50;

    for (let epoch = 0; epoch < epochs; epoch++) {
      // Shuffle indices
      const indices = Array.from({ length: data.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      for (const idx of indices) {
        const x = featureVectors[idx];
        const y = labels[idx];

        // Forward: sigmoid(w·x + b)
        let z = bias;
        for (let f = 0; f < totalFeatures; f++) z += weights[f] * x[f];
        const pred = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));

        // Gradient
        const error = pred - y;
        bias -= lr * error;
        for (let f = 0; f < totalFeatures; f++) {
          weights[f] -= lr * (error * x[f] + 0.001 * weights[f]); // L2 regularization
        }
      }
    }

    // Compute accuracy
    let correct = 0;
    for (let i = 0; i < data.length; i++) {
      let z = bias;
      for (let f = 0; f < totalFeatures; f++) z += weights[f] * featureVectors[i][f];
      const pred = 1 / (1 + Math.exp(-z));
      const predLabel = pred > 0.5 ? 1 : 0;
      if (predLabel === labels[i]) correct++;
    }
    const accuracy = correct / data.length;

    this.logisticModel = {
      weights,
      bias,
      feature_names: featureNames,
      trained: true,
      accuracy,
      version: this.logisticModel.version + 1,
    };

    this.saveState();
    return { accuracy, version: this.logisticModel.version };
  }

  classifyText(text: string): { label: 'harmful' | 'safe'; confidence: number; top_signals: string[] } {
    if (!this.logisticModel.trained) {
      return { label: 'safe', confidence: 0.5, top_signals: ['Model not trained'] };
    }

    const tokens = this.tokenize(text);
    const sentVec = this.getSentenceVector(text);
    const totalFeatures = this.logisticModel.feature_names.length;
    const x = new Float32Array(totalFeatures);

    // Embedding features
    for (let i = 0; i < this.config.embedding_dim && i < totalFeatures; i++) {
      x[i] = sentVec[i];
    }

    // Word features
    const tokenSet = new Set(tokens);
    for (let i = this.config.embedding_dim; i < totalFeatures - 5; i++) {
      const fname = this.logisticModel.feature_names[i];
      if (fname.startsWith('word_')) {
        x[i] = tokenSet.has(fname.slice(5)) ? 1 : 0;
      }
    }

    // Manual features
    const m = totalFeatures - 5;
    x[m] = Math.min(text.length / 500, 1);
    x[m + 1] = tokens.reduce((s, t) => s + t.length, 0) / (tokens.length || 1) / 10;
    x[m + 2] = /https?:\/\//.test(text) ? 1 : 0;
    x[m + 3] = Math.min((text.match(/!/g) || []).length / 5, 1);
    x[m + 4] = (text.match(/[A-Z]/g) || []).length / (text.length || 1);

    // Predict
    let z = this.logisticModel.bias;
    for (let f = 0; f < totalFeatures; f++) z += this.logisticModel.weights[f] * x[f];
    const prob = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));

    // Top contributing signals
    const contributions: Array<{ name: string; value: number }> = [];
    for (let f = 0; f < totalFeatures; f++) {
      if (x[f] !== 0) {
        contributions.push({ name: this.logisticModel.feature_names[f], value: this.logisticModel.weights[f] * x[f] });
      }
    }
    contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const topSignals = contributions.slice(0, 5).map((c) =>
      `${c.name.replace('word_', '')}: ${c.value > 0 ? '+' : ''}${c.value.toFixed(3)}`
    );

    return {
      label: prob > 0.5 ? 'harmful' : 'safe',
      confidence: Math.round(Math.max(prob, 1 - prob) * 100) / 100,
      top_signals: topSignals,
    };
  }

  // ============================================================
  // 5. MULTI-LAYER INTENT PARSER
  // ============================================================

  parseIntent(text: string): ParsedIntent {
    const lower = text.toLowerCase().trim();
    const tokens = this.tokenize(text);
    const lang = this.detectLanguage(text);

    // Extract entities
    const entities = this.extractEntities(text);

    // Detect question type
    const questionType = this.detectQuestionType(lower, lang);

    // Detect sentiment
    const sentiment = this.analyzeSentimentAdvanced(tokens);

    // Detect urgency
    const urgency = this.detectUrgency(lower, lang);

    // Detect topic using embeddings
    const topic = this.detectTopic(text);

    // Classify primary intent — multi-signal approach
    const primary = this.classifyIntent(lower, tokens, entities, questionType, lang);

    // Sub-intents
    const subIntents = this.detectSubIntents(lower, lang);

    return { primary, sub_intents: subIntents, entities, question_type: questionType, sentiment, urgency, topic, language: lang };
  }

  private classifyIntent(lower: string, tokens: string[], entities: ExtractedEntity[], questionType: QuestionType | null, lang: 'uz' | 'en' | 'ru' | 'mixed'): IntentType {
    // Greeting
    if (/^(salom|hello|hi|hey|assalomu|xayrli|good\s+(morning|evening|day))(\s|!|$)/i.test(lower)) return 'greeting';

    // Help
    if (/\b(help|yordam|qanday|nima\s+qil|how\s+(to|do|can)|qo'llab)/i.test(lower)) return 'help';

    // Command
    if (/^(analyze|train|export|search|reason|tools|brain|predict|test|tekshir|izla|o'rgat)/i.test(lower)) return 'command';

    // Complaint
    if (/\b(noto'g'ri|xato|wrong|incorrect|bug|ishlamay|broken|fail|muammo|problem)/i.test(lower)) return 'complaint';

    // Search
    if (/\b(search|izla|qidir|top|internet|web)/i.test(lower) || entities.some((e) => e.type === 'url')) return 'search_request';

    // Analysis request
    if (/\b(analyze|tahlil|tekshir|check|scan|ko'r|classify|predict)/i.test(lower)) return 'analysis_request';

    // Explanation
    if (/\b(explain|tushuntir|nima\s+degani|what\s+(is|does|means)|nega|why)/i.test(lower)) return 'explanation_request';

    // Comparison
    if (/\b(vs|versus|farqi|difference|compare|qaysi|which\s+is\s+better|solishtir)/i.test(lower)) return 'comparison';

    // Teaching request
    if (/\b(o'rgat|teach|learn|dars|lesson|tutorial|ko'rsat|show\s+me\s+how)/i.test(lower)) return 'teach_request';

    // Feedback
    if (/\b(feedback|fikr|taklif|suggest|report|xabar|bloklandi|bloklan)/i.test(lower)) return 'feedback';

    // Content check (message that might itself be content to check)
    if (tokens.length > 10 && !questionType) return 'content_check';

    // Question
    if (questionType) return 'question';

    return 'conversation';
  }

  private detectQuestionType(lower: string, lang: 'uz' | 'en' | 'ru' | 'mixed'): QuestionType | null {
    if (/^(nima|what|ne)\b/i.test(lower)) return 'what';
    if (/^(qanday|how|qanaqa)\b/i.test(lower)) return 'how';
    if (/^(nega|why|nimaga)\b/i.test(lower)) return 'why';
    if (/^(qachon|when)\b/i.test(lower)) return 'when';
    if (/^(qayerda|where|qaerda)\b/i.test(lower)) return 'where';
    if (/^(kim|who)\b/i.test(lower)) return 'who';
    if (/^(nechta|how\s+many|how\s+much|qancha)\b/i.test(lower)) return 'quantity';
    if (/\?$/.test(lower)) {
      if (/\b(yoki|or|mi\b|mu\b|is\s+it|do\s+you|can\s+i)\b/i.test(lower)) return 'yes_no';
      return 'what';
    }
    return null;
  }

  private detectSubIntents(lower: string, lang: 'uz' | 'en' | 'ru' | 'mixed'): string[] {
    const subs: string[] = [];
    if (/\b(misol|example|ko'rsat|show|namuna)\b/i.test(lower)) subs.push('wants_example');
    if (/\b(batafsil|detail|ko'proq|more|chuqurroq|deeper)\b/i.test(lower)) subs.push('wants_detail');
    if (/\b(qisqa|short|brief|summary|xulosa)\b/i.test(lower)) subs.push('wants_brief');
    if (/\b(solishtir|compare|vs|farqi)\b/i.test(lower)) subs.push('wants_comparison');
    if (/\b(ro'yxat|list|hamma|all)\b/i.test(lower)) subs.push('wants_list');
    if (/\b(tuzat|fix|yaxshila|improve)\b/i.test(lower)) subs.push('wants_fix');
    return subs;
  }

  private extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // URLs
    const urlRegex = /https?:\/\/[^\s]+/gi;
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      entities.push({ text: match[0], type: 'url', confidence: 1, start: match.index, end: match.index + match[0].length });
    }

    // Numbers
    const numRegex = /\b\d+([.,]\d+)?\b/g;
    while ((match = numRegex.exec(text)) !== null) {
      entities.push({ text: match[0], type: 'number', confidence: 0.9, start: match.index, end: match.index + match[0].length });
    }

    // Content types
    const ctRegex = /\b(text|image|video|rasm|matn|audio|screenshot)\b/gi;
    while ((match = ctRegex.exec(text)) !== null) {
      entities.push({ text: match[0], type: 'content_type', confidence: 0.85, start: match.index, end: match.index + match[0].length });
    }

    // Commands
    const cmdRegex = /\b(analyze|search|train|export|predict|reason|tools|brain|tahlil|izla|o'rgat)\b/gi;
    while ((match = cmdRegex.exec(text)) !== null) {
      entities.push({ text: match[0], type: 'command', confidence: 0.9, start: match.index, end: match.index + match[0].length });
    }

    // Actions
    const actRegex = /\b(block|unblock|add|remove|delete|create|update|blokla|qo'sh|o'chir|yarata)\b/gi;
    while ((match = actRegex.exec(text)) !== null) {
      entities.push({ text: match[0], type: 'action', confidence: 0.8, start: match.index, end: match.index + match[0].length });
    }

    return entities;
  }

  private analyzeSentimentAdvanced(tokens: string[]): number {
    const positive = new Set([
      'good', 'great', 'excellent', 'amazing', 'love', 'like', 'best', 'perfect', 'thank', 'thanks',
      'awesome', 'wonderful', 'beautiful', 'nice', 'happy', 'glad', 'helpful', 'super', 'cool',
      'yaxshi', 'ajoyib', 'zo\'r', 'chiroyli', 'rahmat', 'mukammal', 'barakalla', 'mamnun', 'sevaman',
    ]);
    const negative = new Set([
      'bad', 'terrible', 'awful', 'hate', 'worst', 'ugly', 'stupid', 'boring', 'annoying', 'useless',
      'wrong', 'broken', 'fail', 'poor', 'weak', 'disappointed', 'frustrating', 'pathetic',
      'yomon', 'dahshatli', 'xunuk', 'ahmoq', 'zerikarli', 'xato', 'buzilgan', 'ishlamay',
    ]);
    const negators = new Set(['not', 'no', 'never', "don't", "doesn't", "isn't", "can't", 'emas', 'yo\'q', 'hech']);

    let score = 0;
    for (let i = 0; i < tokens.length; i++) {
      const negated = i > 0 && negators.has(tokens[i - 1]);
      if (positive.has(tokens[i])) score += negated ? -0.3 : 0.3;
      else if (negative.has(tokens[i])) score += negated ? 0.2 : -0.3;
    }
    return Math.max(-1, Math.min(1, score));
  }

  private detectUrgency(lower: string, lang: 'uz' | 'en' | 'ru' | 'mixed'): number {
    let score = 0;
    if (/\b(urgent|emergency|asap|critical|tezkor|shoshilinch|darhol|immediately)\b/i.test(lower)) score += 0.5;
    if (/!!!|HELP|SOS/i.test(lower)) score += 0.3;
    if (/\b(please|iltimos|marhamat)\b/i.test(lower)) score += 0.1;
    if ((lower.match(/!/g) || []).length >= 3) score += 0.2;
    return Math.min(score, 1);
  }

  private detectTopic(text: string): string {
    const topicVectors: Record<string, string> = {
      'safety': 'content safety block harmful safe filter moderation',
      'technical': 'code programming software bug error fix system',
      'feedback': 'feedback report wrong incorrect false positive negative',
      'search': 'search find web internet information query',
      'learning': 'train model learn data accuracy improve',
      'vision': 'image video photo picture screenshot analyze',
      'general': 'hello help question how what why',
    };

    let bestTopic = 'general';
    let bestSim = -1;

    for (const [topic, desc] of Object.entries(topicVectors)) {
      const sim = this.textSimilarity(text, desc);
      if (sim > bestSim) {
        bestSim = sim;
        bestTopic = topic;
      }
    }

    return bestTopic;
  }

  // ============================================================
  // 6. SMART RESPONSE COMPOSER
  // ============================================================

  async generateResponse(userText: string): Promise<LLMResponse> {
    const start = performance.now();
    await this.initialize();

    const intent = this.parseIntent(userText);

    // Add to conversation history
    this.conversationHistory.push({ role: 'user', text: userText, intent, timestamp: Date.now() });
    if (this.conversationHistory.length > 50) this.conversationHistory = this.conversationHistory.slice(-50);

    // Generate based on intent
    let responseText: string;
    const contextUsed: string[] = [];

    switch (intent.primary) {
      case 'greeting':
        responseText = this.composeGreeting(intent);
        break;
      case 'help':
        responseText = this.composeHelp(intent);
        break;
      case 'content_check':
        responseText = this.composeContentCheck(userText, intent);
        contextUsed.push('content_analysis', 'classification');
        break;
      case 'question':
      case 'explanation_request':
        responseText = this.composeAnswer(userText, intent);
        contextUsed.push('knowledge_base', 'embeddings');
        break;
      case 'complaint':
        responseText = this.composeComplaintResponse(userText, intent);
        break;
      case 'comparison':
        responseText = this.composeComparison(userText, intent);
        break;
      case 'feedback':
        responseText = this.composeFeedbackResponse(intent);
        break;
      default:
        responseText = this.composeGenericResponse(userText, intent);
        contextUsed.push('conversation_context');
    }

    // Add conversation memory
    this.conversationHistory.push({ role: 'ai', text: responseText, timestamp: Date.now() });

    return {
      text: responseText,
      intent,
      confidence: intent.sentiment >= 0 ? 0.8 : 0.6,
      context_used: contextUsed,
      generation_ms: performance.now() - start,
    };
  }

  private composeGreeting(intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';
    const hasHistory = this.conversationHistory.length > 2;

    if (uz) {
      return hasHistory
        ? 'Salom! Yana ko\'rishganimizdan xursandman. Sizga qanday yordam bera olaman?'
        : 'Assalomu alaykum! Men Content Insight AI — kontentni tahlil qilish va xavfsizlikni ta\'minlashda yordam beraman. Savol bering yoki tekshirish uchun matn yuboring.';
    }
    return hasHistory
      ? 'Hello again! How can I help you?'
      : 'Hello! I\'m Content Insight AI — I help analyze content for safety. Send me text to check, or ask a question.';
  }

  private composeHelp(intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';
    if (uz) {
      return [
        '📚 **Yordam — Men nima qila olaman:**',
        '',
        '**Kontentni tekshirish:**',
        '- Matn yuboring — avtomatik tahlil qilaman',
        '- `analyze [matn]` — chuqur tahlil',
        '- `reason [matn]` — fikrlash zanjiri bilan tahlil',
        '',
        '**Izlash va ma\'lumot:**',
        '- `search [so\'rov]` — internetdan izlash',
        '- URL yuboring — sahifani tahlil qilaman',
        '',
        '**O\'rganish:**',
        '- `add harmful [matn]` — zararli namuna qo\'shish',
        '- `add safe [matn]` — xavfsiz namuna qo\'shish',
        '- `train` — modelni qayta o\'rgatish',
        '',
        '**Holat:**',
        '- `brain` — AI miya holati',
        '- `tools` — mavjud vositalar',
        '- `vision` — rasm tahlili holati',
      ].join('\n');
    }
    return [
      '📚 **Help — What I can do:**',
      '',
      '**Content checking:**',
      '- Send text — I\'ll analyze it automatically',
      '- `analyze [text]` — deep analysis',
      '- `reason [text]` — chain-of-thought analysis',
      '',
      '**Search & info:**',
      '- `search [query]` — web search',
      '- Send a URL — I\'ll analyze the page',
      '',
      '**Learning:**',
      '- `add harmful [text]` — add harmful example',
      '- `add safe [text]` — add safe example',
      '- `train` — retrain the model',
      '',
      '**Status:**',
      '- `brain` — AI brain status',
      '- `tools` — available tools',
      '- `vision` — image analysis status',
    ].join('\n');
  }

  private composeContentCheck(text: string, intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';
    const classification = this.classifyText(text);
    const similarHarmful = this.findSimilarInKB(text, 'harmful');
    const similarSafe = this.findSimilarInKB(text, 'safe');

    const lines: string[] = [];

    if (classification.label === 'harmful') {
      lines.push(uz ? '🚫 **Zararli kontent aniqlandi**' : '🚫 **Harmful content detected**');
    } else {
      lines.push(uz ? '✅ **Xavfsiz kontent**' : '✅ **Safe content**');
    }

    lines.push(`${uz ? 'Ishonch' : 'Confidence'}: ${(classification.confidence * 100).toFixed(0)}%`);

    if (classification.top_signals.length > 0) {
      lines.push('', uz ? '📊 **Asosiy signallar:**' : '📊 **Key signals:**');
      for (const sig of classification.top_signals) {
        lines.push(`- ${sig}`);
      }
    }

    if (similarHarmful.length > 0) {
      lines.push('', uz ? '⚠️ **O\'xshash zararli kontentlar topildi**' : '⚠️ **Similar harmful content found**');
    }

    return lines.join('\n');
  }

  private composeAnswer(text: string, intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';

    // Search knowledge base
    const relevant = this.searchKnowledgeBase(text, 3);

    if (relevant.length > 0) {
      const lines = [uz ? '📖 **Topilgan ma\'lumot:**' : '📖 **Found information:**', ''];
      for (const r of relevant) {
        lines.push(`• ${r.text} (${(r.similarity * 100).toFixed(0)}% mos)`);
      }
      return lines.join('\n');
    }

    if (intent.question_type === 'how') {
      return uz
        ? 'Bu savolga javob berish uchun ko\'proq kontekst kerak. Iltimos, aniqroq savol bering yoki `help` buyrug\'ini ishlating.'
        : 'I need more context to answer this. Please ask a more specific question or use the `help` command.';
    }

    return uz
      ? 'Bu haqida men bilim bazamda ma\'lumot topa olmadim. `search [savol]` buyrug\'i bilan internetdan izlashingiz mumkin.'
      : 'I couldn\'t find information about this in my knowledge base. You can try `search [question]` to search the web.';
  }

  private composeComplaintResponse(text: string, intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';
    return uz
      ? '😔 Uzr so\'rayman! Xatolikni tuzatish uchun feedback yuboring — "Yangi feedback" tugmasini bosing va batafsil yozing. Bu menga o\'rganishga yordam beradi.'
      : '😔 I\'m sorry about that! Please submit feedback using the "New feedback" button with details. This helps me learn and improve.';
  }

  private composeComparison(text: string, intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';

    // Try to find two things being compared
    const tokens = this.tokenize(text);
    const vsIdx = tokens.findIndex((t) => t === 'vs' || t === 'versus' || t === 'yoki' || t === 'farqi');

    if (vsIdx > 0 && vsIdx < tokens.length - 1) {
      const thing1 = tokens.slice(0, vsIdx).join(' ');
      const thing2 = tokens.slice(vsIdx + 1).join(' ');
      const sim = this.textSimilarity(thing1, thing2);

      return uz
        ? `**"${thing1}" vs "${thing2}":**\nSemantik o'xshashlik: ${(sim * 100).toFixed(0)}%\n${sim > 0.7 ? 'Bu ikki tushuncha juda o\'xshash.' : sim > 0.3 ? 'Bu ikki tushuncha qisman bog\'liq.' : 'Bu ikki tushuncha farqli.'}`
        : `**"${thing1}" vs "${thing2}":**\nSemantic similarity: ${(sim * 100).toFixed(0)}%\n${sim > 0.7 ? 'These concepts are very similar.' : sim > 0.3 ? 'These concepts are partially related.' : 'These concepts are different.'}`;
    }

    return uz ? 'Nima bilan nimani solishtirishni aniqlashtirsangiz.' : 'Please clarify what you\'d like me to compare.';
  }

  private composeFeedbackResponse(intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';
    return uz
      ? '📋 Feedback uchun rahmat! "Yangi feedback" tugmasini bosib, batafsil ma\'lumot bering — bu menga o\'rganishga yordam beradi.'
      : '📋 Thanks for the feedback! Please use the "New feedback" button to provide details — this helps me learn.';
  }

  private composeGenericResponse(text: string, intent: ParsedIntent): string {
    const uz = intent.language === 'uz' || intent.language === 'mixed';
    const lower = text.toLowerCase();

    // Direct conversational patterns FIRST (don't fall through to content_check)
    if (/\b(can you|do you|are you|will you|qila olasizmi|bilasizmi|tushunasizmi|gapira)\b/i.test(lower)) {
      // Self-referential question — answer directly
      if (/\b(uzbek|o'zbek|uzbekcha|o'zbekcha)\b/i.test(lower)) {
        return uz
          ? 'Ha, o\'zbek tilini tushunaman va o\'zbekcha javob bera olaman. Savolingizni bering!'
          : 'Yes, I understand and can reply in Uzbek. Я также понимаю русский. Ask away!';
      }
      if (/\b(speak|understand|tushun|gapira)\b/i.test(lower)) {
        return uz
          ? 'Ha, men o\'zbek va ingliz tillarini tushunaman. Savol bering yoki matn tekshiring.'
          : 'Yes, I understand Uzbek and English. Ask a question or send text to check.';
      }
      if (/\b(help|yordam)\b/i.test(lower)) {
        return this.composeHelp(intent);
      }
    }

    // Statements about user themselves
    if (/^(i\s+|men\s+|i'm|i am)/i.test(text.trim())) {
      return uz
        ? `Tushundim. Sizga qanday yordam berishim mumkin? "help" yozsangiz, imkoniyatlarimni ko'rsataman.`
        : `Got it. How can I help? Type "help" to see what I can do.`;
    }

    // Conversation continuation
    const recentTopics = this.getRecentTopics();
    if (recentTopics.length > 0 && text.length < 100) {
      return uz
        ? `"${recentTopics[0]}" mavzusida davom etamizmi? Yana savol bering yoki "help" yozing.`
        : `Continuing about "${recentTopics[0]}"? Ask another question or type "help".`;
    }

    // Very short — could be greeting or unclear
    if (text.length < 20) {
      return uz
        ? `Tushunmadim. Iltimos batafsilroq yozing yoki "help" yozing.`
        : `I didn't catch that. Please elaborate or type "help".`;
    }

    // Long text with no clear intent — likely user wants content checked
    // BUT we should be honest that we're switching modes
    if (text.length > 100) {
      const check = this.composeContentCheck(text, intent);
      return (uz
        ? '💡 Bu uzun matn — kontent tekshiruv sifatida tahlil qildim:\n\n'
        : '💡 This is a long message — I treated it as content to check:\n\n'
      ) + check;
    }

    return uz
      ? 'Sizga qanday yordam bera olaman? "help" yozsangiz, mavjud buyruqlarni ko\'rsataman.'
      : 'How can I help? Type "help" to see available commands.';
  }

  // ============================================================
  // 7. SEMANTIC SEARCH (Knowledge Base)
  // ============================================================

  private buildKnowledgeBase(): void {
    this.knowledgeBase.clear();

    const entries: Record<string, string[]> = {
      'harmful_sexual': [
        'Sexual explicit content including pornography, nudity, erotic material',
        'Shahvoniy kontent: pornografiya, yalang\'ochlik, erotik materiallar',
      ],
      'harmful_violence': [
        'Violent content: murder, torture, gore, graphic violence, weapons',
        'Zoravonlik kontenti: qotillik, qiynoq, qurol, grafik zoravonlik',
      ],
      'harmful_drugs': [
        'Drug-related content: illegal substances, drug use, trafficking',
        'Narkotik kontenti: noqonuniy moddalar, giyohvandlik, narko-savdo',
      ],
      'safe_education': [
        'Educational content: learning materials, courses, academic research',
        'Ta\'limiy kontent: o\'quv materiallari, kurslar, ilmiy tadqiqotlar',
      ],
      'safe_medical': [
        'Medical content: health information, clinical data, treatment',
        'Tibbiy kontent: sog\'liq ma\'lumotlari, klinik data, davolash',
      ],
      'safe_news': [
        'News and journalism: factual reporting, press, media coverage',
        'Yangiliklar va jurnalistika: faktik hisobotlar, matbuot',
      ],
      'context_prevention': [
        'Prevention and awareness context makes harmful topics safe to discuss',
        'Oldini olish va xabardorlik konteksti zararli mavzularni muhokama qilishni xavfsiz qiladi',
      ],
      'context_research': [
        'Research and documentary context allows discussing sensitive topics',
        'Tadqiqot va hujjatli film konteksti nozik mavzularni muhokama qilishga ruxsat beradi',
      ],
    };

    for (const [key, texts] of Object.entries(entries)) {
      this.knowledgeBase.set(key, texts);
    }
  }

  // ============================================================
  // DIRECT USER FEEDBACK CHECK — deterministik bloklash
  // Foydalanuvchi "X ni blokla" desa, X kelganda darrov bloklaymiz.
  // Ehtimollik o'yini yo'q — aniq yoki yaqin match → qaror.
  // ============================================================
  checkUserFeedback(query: string): { verdict: 'harmful' | 'safe'; matched: string; similarity: number } | null {
    const queryLower = query.toLowerCase().trim();
    const queryTokens = this.tokenize(queryLower);
    const queryTokenSet = new Set(queryTokens);

    let best: { verdict: 'harmful' | 'safe'; matched: string; similarity: number } | null = null;

    for (const [key, texts] of this.knowledgeBase) {
      if (!key.includes('user_feedback')) continue;
      const verdict: 'harmful' | 'safe' = key.startsWith('harmful_') ? 'harmful' : 'safe';

      for (const text of texts) {
        const textLower = text.toLowerCase().trim();
        const taughtTokens = this.tokenize(textLower);
        if (taughtTokens.length === 0) continue;

        let sim = 0;

        // TOKEN-BASED MATCH (substring EMAS — "picture poses" ⊅ "pose" bug'i tuzatildi)
        if (textLower === queryLower) {
          // Aniq mos kelish
          sim = 1.0;
        } else if (taughtTokens.length >= 2) {
          // Ko'p so'zli ibora: BARCHA tokenlari query'da BUTUN SO'Z sifatida bo'lsa
          // "69 pose" → query'da ham "69" ham "pose" butun token bo'lishi kerak
          // "69 pose video" → [69, pose, video] → ikkalasi bor → BLOCK ✅
          // "picture poses" → [picture, poses] → "pose" yo'q (poses≠pose), "69" yo'q → ALLOW ✅
          const allPresent = taughtTokens.every((t) => queryTokenSet.has(t));
          if (allPresent) {
            sim = 0.92;
          }
        } else {
          // Yakka so'z: faqat ANIQ TOKEN mos kelsa (substring emas)
          // taught "pose" → query'da "pose" butun token bo'lishi shart
          // "picture poses" → "poses" token, "pose" emas → mos kelmaydi ✅
          // "yoga pose" → "pose" token bor → mos keladi (yakka so'z o'rgatishning xavfi)
          if (queryTokenSet.has(taughtTokens[0])) {
            sim = 0.88;
          }
        }

        if (sim >= 0.85 && (!best || sim > best.similarity)) {
          best = { verdict, matched: text, similarity: sim };
        }
      }
    }

    return best;
  }

  searchKnowledgeBase(query: string, topK = 3): Array<{ key: string; text: string; similarity: number }> {
    const queryVec = this.getSentenceVector(query);
    const queryLower = query.toLowerCase().trim();
    const queryTokens = new Set(this.tokenize(queryLower));
    const results: Array<{ key: string; text: string; similarity: number }> = [];

    for (const [key, texts] of this.knowledgeBase) {
      for (const text of texts) {
        const textLower = text.toLowerCase();
        const textVec = this.getSentenceVector(text);
        let sim = this.cosineSim(queryVec, textVec);

        // 🔑 TOKEN-BASED MATCH BOOST (substring EMAS — false positive oldini olish)
        const taughtTokens = this.tokenize(textLower);
        if (textLower === queryLower) {
          sim = 1.0; // aniq mos kelish
        } else if (taughtTokens.length >= 2 && taughtTokens.every((t) => queryTokens.has(t))) {
          // Ko'p so'zli ibora to'liq mavjud (butun tokenlar) → kuchli
          sim = Math.max(sim, 0.92);
        } else {
          // Token overlap (Jaccard-like) — qisman moslik
          const textTokens = new Set(taughtTokens);
          const intersection = [...queryTokens].filter((t) => textTokens.has(t)).length;
          const union = new Set([...queryTokens, ...textTokens]).size;
          if (union > 0) {
            const jaccard = intersection / union;
            if (jaccard > 0.3) sim = Math.max(sim, jaccard * 0.85);
          }
        }

        results.push({ key, text, similarity: sim });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }

  private findSimilarInKB(text: string, category: 'harmful' | 'safe'): Array<{ text: string; similarity: number }> {
    const queryVec = this.getSentenceVector(text);
    const results: Array<{ text: string; similarity: number }> = [];

    for (const [key, texts] of this.knowledgeBase) {
      if ((category === 'harmful' && key.startsWith('harmful_')) || (category === 'safe' && key.startsWith('safe_'))) {
        for (const t of texts) {
          const sim = this.cosineSim(queryVec, this.getSentenceVector(t));
          if (sim > 0.3) results.push({ text: t, similarity: sim });
        }
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
  }

  // ============================================================
  // 8. CONVERSATION CONTEXT MANAGER
  // ============================================================

  private getRecentTopics(): string[] {
    const recent = this.conversationHistory.slice(-6);
    const topics = recent
      .filter((t) => t.intent?.topic && t.intent.topic !== 'general')
      .map((t) => t.intent!.topic);
    return [...new Set(topics)];
  }

  getConversationSummary(): { turns: number; topics: string[]; sentiment_trend: number; last_intent: IntentType | null } {
    const topics = this.getRecentTopics();
    const sentiments = this.conversationHistory
      .filter((t) => t.intent)
      .map((t) => t.intent!.sentiment);
    const trend = sentiments.length > 0 ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length : 0;
    const lastIntent = this.conversationHistory.length > 0
      ? this.conversationHistory[this.conversationHistory.length - 1].intent?.primary || null
      : null;

    return { turns: this.conversationHistory.length, topics, sentiment_trend: trend, last_intent: lastIntent };
  }

  clearConversation(): void {
    this.conversationHistory = [];
  }

  // ============================================================
  // 9. LEARN FROM NEW DATA — embedding + model update
  // ============================================================

  learnFromText(text: string, label: 'harmful' | 'safe'): void {
    // Add to corpus and update embeddings incrementally
    const tokens = this.tokenize(text);

    // Update cooccurrence
    for (let i = 0; i < tokens.length; i++) {
      if (!this.vocab.has(tokens[i])) {
        const newIdx = this.vocab.size;
        this.vocab.set(tokens[i], newIdx);
        this.reverseVocab.set(newIdx, tokens[i]);
        const vec = new Float32Array(this.config.embedding_dim);
        for (let d = 0; d < this.config.embedding_dim; d++) vec[d] = (Math.random() - 0.5) * 0.1;
        this.embeddings.push(vec);
      }

      const word = tokens[i];
      if (!this.cooccurrence.has(word)) this.cooccurrence.set(word, new Map());
      const row = this.cooccurrence.get(word)!;

      for (let j = Math.max(0, i - this.config.context_window); j < Math.min(tokens.length, i + this.config.context_window + 1); j++) {
        if (j === i) continue;
        if (this.vocab.has(tokens[j])) {
          const weight = 1 / Math.abs(i - j);
          row.set(tokens[j], (row.get(tokens[j]) || 0) + weight);
        }
      }
    }

    // Quick embedding update — faqat YANGI so'zlar uchun, 2 epoch (5 emas)
    // Bu KB loader uchun 5x tezroq. Sekin lekin to'liq update keyin retrainEmbeddings() chaqirsa bo'ladi
    const uniqueTokens = [...new Set(tokens)];
    if (uniqueTokens.length < 100) {
      for (let epoch = 0; epoch < 2; epoch++) {
        for (const tok of uniqueTokens) {
          const wi = this.vocab.get(tok);
          if (wi === undefined) continue;
          const row = this.cooccurrence.get(tok);
          if (!row) continue;

          for (const [ctx, count] of row) {
            const wj = this.vocab.get(ctx);
            if (wj === undefined) continue;

            const logCount = Math.log(1 + count);
            let dot = 0;
            for (let d = 0; d < this.config.embedding_dim; d++) {
              dot += this.embeddings[wi][d] * this.embeddings[wj][d];
            }
            const diff = dot - logCount;
            for (let d = 0; d < this.config.embedding_dim; d++) {
              this.embeddings[wi][d] -= 0.02 * diff * this.embeddings[wj][d];
              this.embeddings[wj][d] -= 0.02 * diff * this.embeddings[wi][d];
            }
          }
        }
      }
    }

    // 🔑 CRITICAL: Dynamically add to knowledge base so future analogical
    // reasoning can find this text. Without this, learnFromText was silent.
    // Bu juda muhim: AI endi o'rgangan narsani eslab qoladi.
    try {
      const kbKey = label === 'harmful' ? 'harmful_user_feedback' : 'safe_user_feedback';
      const existing = this.knowledgeBase.get(kbKey) || [];
      const truncated = text.slice(0, 300);
      if (!existing.some((e) => e === truncated)) {
        existing.push(truncated);
        // Keep last 200 entries per category (avoid bloat)
        if (existing.length > 200) existing.shift();
        this.knowledgeBase.set(kbKey, existing);
      }
    } catch {}

    // Update n-gram model
    const withBounds = ['<s>', ...tokens, '</s>'];
    for (let i = 0; i < withBounds.length; i++) {
      this.ngramModel.unigrams.set(withBounds[i], (this.ngramModel.unigrams.get(withBounds[i]) || 0) + 1);
      this.ngramModel.total_unigrams++;
      if (i < withBounds.length - 1) {
        const bg = `${withBounds[i]}|${withBounds[i + 1]}`;
        this.ngramModel.bigrams.set(bg, (this.ngramModel.bigrams.get(bg) || 0) + 1);
        this.ngramModel.total_bigrams++;
      }
      if (i < withBounds.length - 2) {
        const tg = `${withBounds[i]}|${withBounds[i + 1]}|${withBounds[i + 2]}`;
        this.ngramModel.trigrams.set(tg, (this.ngramModel.trigrams.get(tg) || 0) + 1);
        this.ngramModel.total_trigrams++;
      }
    }

    this.saveState();
  }

  // ============================================================
  // UTILITIES
  // ============================================================

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[^\w\s'`ʻʼ-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1);
  }

  detectLanguage(text: string): 'uz' | 'en' | 'ru' | 'mixed' {
    const uzScore = (text.match(/[ʻʼ]|ning\b|lari\b|\bva\b|\bbu\b|\bbo'l|\byo'q/gi) || []).length;
    const enScore = (text.match(/\b(the|is|are|was|have|this|that|with|from|for)\b/gi) || []).length;
    const ruScore = (text.match(/[а-яА-ЯёЁ]/g) || []).length;

    if (ruScore > 5) return 'ru';
    if (uzScore > 2 && enScore > 2) return 'mixed';
    if (uzScore > enScore) return 'uz';
    return 'en';
  }

  // ---- Persistence ----

  // Debounced save — har chaqiruvda emas, 1 sekund'da bir marta yoziladi
  private _saveTimer: ReturnType<typeof setTimeout> | null = null;
  private _saveDirty = false;

  private saveState(): void {
    this._saveDirty = true;
    if (this._saveTimer) return;
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null;
      if (this._saveDirty) {
        this._saveDirty = false;
        this._saveStateNow();
      }
    }, 1000);
  }

  flushState(): void {
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    if (this._saveDirty) {
      this._saveDirty = false;
      this._saveStateNow();
    }
  }

  private _saveStateNow(): void {
    try {
      // Only save user-feedback KB entries (not built-in seed)
      const userKB: [string, string[]][] = [];
      for (const [k, v] of this.knowledgeBase) {
        if (k.includes('user_feedback')) userKB.push([k, v]);
      }
      const state = {
        corpus_version: CORPUS_VERSION,
        user_kb: userKB,
        vocab: Array.from(this.vocab.entries()),
        embeddings: this.embeddings.map((e) => Array.from(e)),
        ngramModel: {
          unigrams: Array.from(this.ngramModel.unigrams.entries()).slice(0, 5000),
          bigrams: Array.from(this.ngramModel.bigrams.entries()).slice(0, 10000),
          trigrams: Array.from(this.ngramModel.trigrams.entries()).slice(0, 10000),
          total_unigrams: this.ngramModel.total_unigrams,
          total_bigrams: this.ngramModel.total_bigrams,
          total_trigrams: this.ngramModel.total_trigrams,
        },
        logisticModel: {
          weights: this.logisticModel.weights.length > 0 ? Array.from(this.logisticModel.weights) : [],
          bias: this.logisticModel.bias,
          feature_names: this.logisticModel.feature_names,
          trained: this.logisticModel.trained,
          accuracy: this.logisticModel.accuracy,
          version: this.logisticModel.version,
        },
      };
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      try { localStorage.removeItem('cia_llm_state'); } catch {}
    } catch {
      // localStorage might be full — silently fail
    }
  }

  private loadState(): boolean {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return false;

      const state = JSON.parse(raw);

      // Version check — if corpus changed, force retrain
      if (state.corpus_version !== CORPUS_VERSION) {
        try { localStorage.removeItem(STATE_KEY); } catch {}
        return false;
      }

      this.vocab = new Map(state.vocab);
      this.reverseVocab = new Map();
      for (const [word, idx] of this.vocab) this.reverseVocab.set(idx, word);

      this.embeddings = state.embeddings.map((e: number[]) => new Float32Array(e));

      this.ngramModel = {
        unigrams: new Map(state.ngramModel.unigrams),
        bigrams: new Map(state.ngramModel.bigrams),
        trigrams: new Map(state.ngramModel.trigrams),
        total_unigrams: state.ngramModel.total_unigrams,
        total_bigrams: state.ngramModel.total_bigrams,
        total_trigrams: state.ngramModel.total_trigrams,
      };

      if (state.logisticModel && state.logisticModel.weights.length > 0) {
        this.logisticModel = {
          weights: new Float32Array(state.logisticModel.weights),
          bias: state.logisticModel.bias,
          feature_names: state.logisticModel.feature_names,
          trained: state.logisticModel.trained,
          accuracy: state.logisticModel.accuracy,
          version: state.logisticModel.version,
        };
      }

      this.buildKnowledgeBase();

      // Restore user-feedback KB entries (so AI remembers what user taught it)
      if (state.user_kb && Array.isArray(state.user_kb)) {
        for (const [k, v] of state.user_kb) {
          if (Array.isArray(v)) this.knowledgeBase.set(k, v);
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  // ---- Status ----

  getStatus(lang: 'uz' | 'en'): string {
    const lines: string[] = [];
    lines.push(lang === 'uz' ? '🧠 **Mahalliy LLM holati:**' : '🧠 **Local LLM status:**');
    lines.push(`${lang === 'uz' ? 'Lug\'at hajmi' : 'Vocabulary size'}: ${this.vocab.size}`);
    lines.push(`${lang === 'uz' ? 'Embedding o\'lchami' : 'Embedding dimension'}: ${this.config.embedding_dim}`);
    lines.push(`Unigrams: ${this.ngramModel.unigrams.size} | Bigrams: ${this.ngramModel.bigrams.size} | Trigrams: ${this.ngramModel.trigrams.size}`);
    lines.push(`${lang === 'uz' ? 'Classifier' : 'Classifier'}: ${this.logisticModel.trained ? `✅ v${this.logisticModel.version} (${(this.logisticModel.accuracy * 100).toFixed(0)}%)` : '❌'}`);
    lines.push(`${lang === 'uz' ? 'Suhbat xotirasi' : 'Conversation memory'}: ${this.conversationHistory.length} turns`);
    lines.push(`${lang === 'uz' ? 'Bilim bazasi' : 'Knowledge base'}: ${this.knowledgeBase.size} entries`);
    return lines.join('\n');
  }
}
