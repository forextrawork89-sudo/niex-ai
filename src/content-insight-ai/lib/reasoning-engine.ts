// ============================================================
// REASONING ENGINE v2 — Chuqur fikrlash tizimi
//
// GPT/Claude darajadagi chain-of-thought:
// 1. Savolni tushunish + intent classification
// 2. Hypothesis generation (farazlar)
// 3. Adaptive multi-pass reasoning (har qadamda qaror)
// 4. Evidence collection + weighting
// 5. Contradiction detection
// 6. Backtracking on failure
// 7. Self-verification + confidence calibration
// 8. Working memory across chains
// 9. Bayesian belief update
// ============================================================

export interface ThoughtChain {
  id: string;
  query: string;
  started_at: string;
  completed_at?: string;
  steps: ThoughtStep[];
  hypotheses: Hypothesis[];
  conclusion: Conclusion | null;
  confidence: number;
  tokens_used: number;
  tools_called: string[];
  backtrack_count: number;
  pass_count: number;
}

export interface ThoughtStep {
  id: number;
  type: StepType;
  thought: string;
  action?: string;
  observation?: string;
  tool_used?: string;
  tool_input?: string;
  tool_output?: string;
  confidence: number;
  duration_ms: number;
  evidence_for?: string;
  evidence_against?: string;
  children?: ThoughtStep[];
}

export type StepType =
  | 'decompose'
  | 'classify_intent'
  | 'hypothesize'
  | 'retrieve'
  | 'search'
  | 'analyze'
  | 'compare'
  | 'infer'
  | 'verify'
  | 'synthesize'
  | 'tool_call'
  | 'self_correct'
  | 'backtrack'
  | 'bayesian_update';

export interface Hypothesis {
  id: string;
  statement: string;
  prior_probability: number;
  posterior_probability: number;
  evidence_for: string[];
  evidence_against: string[];
  status: 'active' | 'confirmed' | 'rejected' | 'uncertain';
}

export interface Conclusion {
  answer: string;
  verdict?: 'safe' | 'harmful' | 'uncertain';
  confidence: number;
  evidence: string[];
  alternative_interpretations: string[];
  uncertainty_reasons: string[];
  hypothesis_summary: string;
}

export interface ReasoningContext {
  query: string;
  content_type?: string;
  available_tools: string[];
  max_steps: number;
  max_depth: number;
  language: 'uz' | 'en';
  prior_knowledge: string[];
}

type ToolExecutor = (name: string, input: string) => Promise<string>;

// ---- Working Memory: facts learned across chains ----
interface WorkingMemory {
  facts: Array<{ text: string; confidence: number; source: string; created_at: string }>;
  patterns: Array<{ pattern: string; frequency: number; last_seen: string }>;
}

function loadWorkingMemory(): WorkingMemory {
  try {
    return JSON.parse(localStorage.getItem('cia_working_memory') || '{"facts":[],"patterns":[]}');
  } catch {
    return { facts: [], patterns: [] };
  }
}

function saveWorkingMemory(mem: WorkingMemory): void {
  if (mem.facts.length > 200) mem.facts = mem.facts.slice(0, 200);
  if (mem.patterns.length > 100) mem.patterns = mem.patterns.slice(0, 100);
  localStorage.setItem('cia_working_memory', JSON.stringify(mem));
}

// ---- Intent Classification ----
type QueryIntent =
  | 'content_safety_check'
  | 'information_question'
  | 'comparison'
  | 'explanation'
  | 'action_request'
  | 'content_analysis'
  | 'unknown';

function classifyQueryIntent(query: string): { intent: QueryIntent; confidence: number; signals: string[] } {
  const lower = query.toLowerCase();
  const signals: string[] = [];

  const rules: Array<{ intent: QueryIntent; patterns: RegExp[]; weight: number }> = [
    {
      intent: 'content_safety_check',
      patterns: [
        /block|blokla|safe|xavfsiz|harmful|zararli|nsfw|nopok|behayo|18\+|adult|pornograph/i,
        /tekshir.*xavfsiz|check.*safe|is.*harmful|zararli.*mi/i,
        /filter|censor|moderate|bloklash.*kerak/i,
      ],
      weight: 0.9,
    },
    {
      intent: 'information_question',
      patterns: [
        /\?$|nima\b|qanday|nega|qachon|kim|qayer|what|how|why|when|who|where/i,
        /explain|tushuntir|ayt.*menga|tell.*me/i,
      ],
      weight: 0.8,
    },
    {
      intent: 'comparison',
      patterns: [
        /vs\.?|versus|solishtir|compare|farq|difference|better|yaxshi.*roq|qaysi/i,
        /o'xshash|similar|different/i,
      ],
      weight: 0.85,
    },
    {
      intent: 'content_analysis',
      patterns: [
        /analyze|tahlil|classify|aniqla|categorize|turkumla|sentiment|toxicity/i,
        /predict|bashorat|detect|aniqlash|evaluate|baholash/i,
      ],
      weight: 0.85,
    },
    {
      intent: 'action_request',
      patterns: [
        /qil|do\b|create|yarat|build|make|train|o'rgat|export|import|add|qo'sh/i,
        /remove|o'chir|delete|update|yangi/i,
      ],
      weight: 0.7,
    },
    {
      intent: 'explanation',
      patterns: [
        /explain|tushuntir|how.*work|qanday.*ish|what.*mean|nima.*degani/i,
        /describe|tasvirla|detail|batafsil/i,
      ],
      weight: 0.75,
    },
  ];

  let bestIntent: QueryIntent = 'unknown';
  let bestScore = 0;

  for (const rule of rules) {
    let matchCount = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(lower)) {
        matchCount++;
        signals.push(`${rule.intent}: ${pattern.source.slice(0, 30)}`);
      }
    }
    if (matchCount > 0) {
      const score = rule.weight * (matchCount / rule.patterns.length + 0.5);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = rule.intent;
      }
    }
  }

  return { intent: bestIntent, confidence: Math.min(bestScore, 0.99), signals };
}

// ---- Bayesian Update ----
function bayesianUpdate(prior: number, likelihoodRatio: number): number {
  const priorOdds = prior / (1 - prior + 1e-10);
  const posteriorOdds = priorOdds * likelihoodRatio;
  return posteriorOdds / (1 + posteriorOdds);
}

// ============================================================
// Chain-of-Thought Reasoning Engine v2
// ============================================================

export class ReasoningEngine {
  private toolExecutor: ToolExecutor;
  private chains: ThoughtChain[] = [];
  private maxChainHistory = 50;
  private memory: WorkingMemory;

  constructor(toolExecutor: ToolExecutor) {
    this.toolExecutor = toolExecutor;
    this.loadChains();
    this.memory = loadWorkingMemory();
  }

  private loadChains(): void {
    try {
      this.chains = JSON.parse(localStorage.getItem('cia_thought_chains') || '[]');
    } catch {
      this.chains = [];
    }
  }

  private saveChains(): void {
    if (this.chains.length > this.maxChainHistory) {
      this.chains = this.chains.slice(0, this.maxChainHistory);
    }
    localStorage.setItem('cia_thought_chains', JSON.stringify(this.chains));
  }

  async reason(ctx: ReasoningContext): Promise<ThoughtChain> {
    const chain: ThoughtChain = {
      id: `chain-${Date.now()}`,
      query: ctx.query,
      started_at: new Date().toISOString(),
      steps: [],
      hypotheses: [],
      conclusion: null,
      confidence: 0,
      tokens_used: 0,
      tools_called: [],
      backtrack_count: 0,
      pass_count: 0,
    };

    let stepId = 1;

    // Phase 1: Intent Classification
    const intentResult = classifyQueryIntent(ctx.query);
    chain.steps.push({
      id: stepId++,
      type: 'classify_intent',
      thought: ctx.language === 'uz'
        ? `Savol turi: "${intentResult.intent}" (${(intentResult.confidence * 100).toFixed(0)}% ishonch). Signallar: ${intentResult.signals.slice(0, 3).join(', ')}`
        : `Query intent: "${intentResult.intent}" (${(intentResult.confidence * 100).toFixed(0)}% confidence). Signals: ${intentResult.signals.slice(0, 3).join(', ')}`,
      confidence: intentResult.confidence,
      duration_ms: 0,
    });

    // Phase 2: Decompose based on intent
    const decomposition = this.decompose(ctx.query, ctx.language, intentResult.intent);
    chain.steps.push({
      id: stepId++,
      type: 'decompose',
      thought: decomposition.thought,
      confidence: decomposition.confidence,
      duration_ms: 0,
      children: decomposition.subQuestions.map((sq) => ({
        id: stepId++,
        type: 'decompose' as StepType,
        thought: sq,
        confidence: 0.8,
        duration_ms: 0,
      })),
    });

    // Phase 3: Generate hypotheses
    const hypotheses = this.generateHypotheses(ctx.query, intentResult.intent, ctx.language);
    chain.hypotheses = hypotheses;
    const hypothesesText = hypotheses.map((h) => '"' + h.statement + '" (' + (h.prior_probability * 100).toFixed(0) + '%)').join('; ');
    chain.steps.push({
      id: stepId++,
      type: 'hypothesize',
      thought: ctx.language === 'uz'
        ? `${hypotheses.length} ta faraz shakllantirildi: ${hypothesesText}`
        : `Generated ${hypotheses.length} hypotheses: ${hypothesesText}`,
      confidence: 0.7,
      duration_ms: 0,
    });

    // Phase 4: Working memory check
    const relevantFacts = this.queryWorkingMemory(ctx.query);
    if (relevantFacts.length > 0) {
      chain.steps.push({
        id: stepId++,
        type: 'retrieve',
        thought: ctx.language === 'uz'
          ? `Ishchi xotiradan ${relevantFacts.length} ta tegishli fakt topildi.`
          : `Found ${relevantFacts.length} relevant facts in working memory.`,
        observation: relevantFacts.slice(0, 3).join('; '),
        confidence: 0.65,
        duration_ms: 0,
      });
    }

    // Phase 5: Retrieve prior knowledge
    const knowledgeStep = this.retrieveKnowledge(ctx, stepId++);
    chain.steps.push(knowledgeStep);

    // Phase 6: Multi-pass reasoning with tool use
    const maxPasses = Math.min(ctx.max_depth, 3);
    for (let pass = 0; pass < maxPasses; pass++) {
      chain.pass_count++;

      const subResults: string[] = [];
      for (const subQ of decomposition.subQuestions) {
        // Plan which tool to use
        const toolPlan = this.planToolUse(subQ, ctx.available_tools, ctx.language, intentResult.intent, pass);

        if (toolPlan.tool) {
          const toolStep = await this.executeToolStep(toolPlan.tool, toolPlan.input, subQ, stepId++);
          chain.steps.push(toolStep);
          chain.tools_called.push(toolPlan.tool);

          if (toolStep.tool_output) {
            subResults.push(toolStep.tool_output);

            // Bayesian update of hypotheses based on tool output
            this.updateHypotheses(chain.hypotheses, toolStep.tool_output, ctx.language);
          }

          // Backtrack if tool error and retry with different tool
          if (toolStep.confidence < 0.2 && pass < maxPasses - 1) {
            chain.steps.push({
              id: stepId++,
              type: 'backtrack',
              thought: ctx.language === 'uz'
                ? `"${toolPlan.tool}" xato berdi, boshqa yondashuv sinab ko'raman.`
                : `"${toolPlan.tool}" failed, trying alternative approach.`,
              confidence: 0.3,
              duration_ms: 0,
            });
            chain.backtrack_count++;
            continue;
          }
        }

        // Deep analysis of sub-question
        const analysisStep = this.deepAnalyze(subQ, subResults, ctx, intentResult.intent, stepId++);
        chain.steps.push(analysisStep);
      }

      // Check if we have enough confidence to stop early
      const currentConfidence = this.calculateOverallConfidence(chain.steps);
      if (currentConfidence > 0.85 && pass > 0) {
        chain.steps.push({
          id: stepId++,
          type: 'infer',
          thought: ctx.language === 'uz'
            ? `Yetarli ishonchlilik (${(currentConfidence * 100).toFixed(0)}%) — qo'shimcha tahlil kerak emas.`
            : `Sufficient confidence (${(currentConfidence * 100).toFixed(0)}%) — no further analysis needed.`,
          confidence: currentConfidence,
          duration_ms: 0,
        });
        break;
      }
    }

    // Phase 7: Contradiction detection
    const contradictions = this.detectContradictions(chain.steps, ctx.language);
    if (contradictions.length > 0) {
      chain.steps.push({
        id: stepId++,
        type: 'self_correct',
        thought: ctx.language === 'uz'
          ? `${contradictions.length} ta qarama-qarshilik topildi: ${contradictions.join('; ')}`
          : `Found ${contradictions.length} contradictions: ${contradictions.join('; ')}`,
        observation: contradictions.join('\n'),
        confidence: 0.4,
        duration_ms: 0,
      });
    }

    // Phase 8: Bayesian summary
    const hypothesisSummary = this.summarizeHypotheses(chain.hypotheses, ctx.language);
    chain.steps.push({
      id: stepId++,
      type: 'bayesian_update',
      thought: hypothesisSummary,
      confidence: Math.max(...chain.hypotheses.map((h) => h.posterior_probability), 0.5),
      duration_ms: 0,
    });

    // Phase 9: Synthesis
    const synthesis = this.synthesize(ctx.query, chain, ctx.language, stepId++);
    chain.steps.push(synthesis);

    // Phase 10: Self-verification
    const verification = this.verify(chain, ctx.language, stepId++);
    chain.steps.push(verification);

    // Build conclusion
    chain.conclusion = this.buildConclusion(chain, ctx.language);
    chain.confidence = chain.conclusion.confidence;
    chain.completed_at = new Date().toISOString();
    chain.tokens_used = this.estimateTokens(chain);

    // Learn: store new facts in working memory
    this.learnFromChain(chain);

    this.chains.unshift(chain);
    this.saveChains();

    return chain;
  }

  // ---- Phase 2: Intent-Adaptive Decomposition ----

  private decompose(query: string, lang: 'uz' | 'en', intent: QueryIntent): { thought: string; subQuestions: string[]; confidence: number } {
    const subQuestions: string[] = [];
    const lower = query.toLowerCase();

    // Extract key entities from query
    const entities = this.extractQueryEntities(query);
    const entityContext = entities.length > 0 ? ` [${entities.join(', ')}]` : '';

    switch (intent) {
      case 'content_safety_check':
        subQuestions.push(
          lang === 'uz' ? `Kontentning asosiy mavzusi va konteksti nima?${entityContext}` : `What is the main topic and context?${entityContext}`,
          lang === 'uz' ? 'Zararli so\'zlar, naqshlar yoki signallar bormi?' : 'Are there harmful words, patterns, or signals?',
          lang === 'uz' ? 'Kontekst xavfsiz bo\'lishi mumkinmi? (ta\'limiy, tibbiy, yangilik, ilmiy)' : 'Could the context be safe? (educational, medical, news, scientific)',
          lang === 'uz' ? 'Yashirin zararli niyat bormi? (manipulyatsiya, aldov, doxxing)' : 'Is there hidden harmful intent? (manipulation, deception, doxxing)',
          lang === 'uz' ? 'Oldingi o\'xshash kontentlar qanday baholangan?' : 'How was similar content evaluated previously?',
        );
        break;

      case 'information_question': {
        const questionWords = lower.match(/\b(nima|qanday|nega|what|how|why|when|who|where)\b/g) || [];
        subQuestions.push(
          lang === 'uz' ? `Savol turi: ${questionWords.join(', ')}. Qaysi sohaga tegishli?` : `Question type: ${questionWords.join(', ')}. Which domain?`,
          lang === 'uz' ? 'Ichki bilim bazasida javob bormi?' : 'Is there an answer in internal knowledge?',
          lang === 'uz' ? 'Tashqi izlash kerakmi (internet, API)?' : 'Is external search needed (internet, API)?',
          lang === 'uz' ? 'Javobning ishonchliligi qanchalik?' : 'How reliable would the answer be?',
        );
        break;
      }

      case 'comparison':
        subQuestions.push(
          lang === 'uz' ? 'Qaysi ob\'ektlar solishtirilmoqda?' : 'What objects are being compared?',
          lang === 'uz' ? 'Solishtirish mezonlari nima?' : 'What are the comparison criteria?',
          lang === 'uz' ? 'Har bir ob\'ektning kuchli va zaif tomonlari?' : 'Strengths and weaknesses of each?',
          lang === 'uz' ? 'Qaysi kontekstda qaysi biri yaxshiroq?' : 'Which is better in which context?',
        );
        break;

      case 'content_analysis':
        subQuestions.push(
          lang === 'uz' ? 'Kontentning formati va tuzilishi qanday?' : 'What is the content format and structure?',
          lang === 'uz' ? 'Semantik tahlil: toxicity, sentiment, intent' : 'Semantic analysis: toxicity, sentiment, intent',
          lang === 'uz' ? 'Bilim grafigidagi tegishli naqshlar' : 'Relevant patterns in knowledge graph',
          lang === 'uz' ? 'ML modelining bashorati' : 'ML model prediction',
          lang === 'uz' ? 'Kontekst modifikatorlari (ta\'lim, tibbiyot)' : 'Context modifiers (education, medical)',
        );
        break;

      default:
        subQuestions.push(
          lang === 'uz' ? 'So\'rovning asosiy maqsadi nima?' : 'What is the main purpose of the request?',
          lang === 'uz' ? 'Qanday ma\'lumotlar kerak?' : 'What information is needed?',
          lang === 'uz' ? 'Mavjud resurslardan foydalanish mumkinmi?' : 'Can existing resources be used?',
        );
    }

    const thought = lang === 'uz'
      ? `Intent: "${intent}". Savolni ${subQuestions.length} ta bo'lakka ajratdim. Har birini chuqur tahlil qilaman.`
      : `Intent: "${intent}". Decomposed into ${subQuestions.length} sub-questions for deep analysis.`;

    return { thought, subQuestions, confidence: 0.85 };
  }

  private extractQueryEntities(query: string): string[] {
    const entities: string[] = [];
    // URLs
    const urls = query.match(/https?:\/\/[^\s]+/g);
    if (urls) entities.push(...urls.map((u) => `URL:${u.slice(0, 50)}`));
    // Quoted strings
    const quoted = query.match(/["'«»]([^"'«»]+)["'«»]/g);
    if (quoted) entities.push(...quoted.map((q) => q.replace(/["'«»]/g, '')));
    // Capitalized words (potential names)
    const caps = query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
    if (caps) entities.push(...caps.filter((c) => c.length > 2));
    return entities.slice(0, 5);
  }

  // ---- Phase 3: Hypothesis Generation ----

  private generateHypotheses(query: string, intent: QueryIntent, lang: 'uz' | 'en'): Hypothesis[] {
    const hypotheses: Hypothesis[] = [];
    const lower = query.toLowerCase();

    if (intent === 'content_safety_check' || intent === 'content_analysis') {
      // H1: Content is harmful
      const hasHarmWords = /kill|murder|porn|nude|drug|weapon|terror|hack|exploit|o'ldir|qurol|giyoh|narkotik/i.test(lower);
      hypotheses.push({
        id: 'h-harmful',
        statement: lang === 'uz' ? 'Bu kontent zararli' : 'This content is harmful',
        prior_probability: hasHarmWords ? 0.6 : 0.3,
        posterior_probability: hasHarmWords ? 0.6 : 0.3,
        evidence_for: [],
        evidence_against: [],
        status: 'active',
      });

      // H2: Content is safe
      const hasSafeWords = /education|learn|study|research|medical|health|o'rgan|ta'lim|tibbiy|sog'liq|ilmiy/i.test(lower);
      hypotheses.push({
        id: 'h-safe',
        statement: lang === 'uz' ? 'Bu kontent xavfsiz' : 'This content is safe',
        prior_probability: hasSafeWords ? 0.6 : 0.4,
        posterior_probability: hasSafeWords ? 0.6 : 0.4,
        evidence_for: [],
        evidence_against: [],
        status: 'active',
      });

      // H3: Content is educational about harmful topic
      hypotheses.push({
        id: 'h-educational',
        statement: lang === 'uz' ? 'Bu zararli mavzu haqida ta\'limiy kontent' : 'This is educational content about a harmful topic',
        prior_probability: 0.2,
        posterior_probability: 0.2,
        evidence_for: [],
        evidence_against: [],
        status: 'active',
      });
    } else {
      // For non-safety queries
      hypotheses.push({
        id: 'h-answerable',
        statement: lang === 'uz' ? 'Savolga javob berish mumkin' : 'The question can be answered',
        prior_probability: 0.7,
        posterior_probability: 0.7,
        evidence_for: [],
        evidence_against: [],
        status: 'active',
      });
      hypotheses.push({
        id: 'h-needs-search',
        statement: lang === 'uz' ? 'Tashqi izlash kerak' : 'External search needed',
        prior_probability: 0.4,
        posterior_probability: 0.4,
        evidence_for: [],
        evidence_against: [],
        status: 'active',
      });
    }

    return hypotheses;
  }

  private updateHypotheses(hypotheses: Hypothesis[], evidence: string, lang: 'uz' | 'en'): void {
    const lower = evidence.toLowerCase();

    for (const h of hypotheses) {
      if (h.status !== 'active') continue;

      let likelihoodRatio = 1.0;

      if (h.id === 'h-harmful') {
        if (/harmful|toxic|danger|zararli|xavfli|block|nsfw/i.test(lower)) {
          likelihoodRatio = 2.5;
          h.evidence_for.push(evidence.slice(0, 80));
        }
        if (/safe|xavfsiz|education|ta'lim|benign|normal/i.test(lower)) {
          likelihoodRatio = 0.4;
          h.evidence_against.push(evidence.slice(0, 80));
        }
      } else if (h.id === 'h-safe') {
        if (/safe|xavfsiz|normal|benign|education|learn/i.test(lower)) {
          likelihoodRatio = 2.5;
          h.evidence_for.push(evidence.slice(0, 80));
        }
        if (/harmful|toxic|danger|zararli|nsfw/i.test(lower)) {
          likelihoodRatio = 0.4;
          h.evidence_against.push(evidence.slice(0, 80));
        }
      } else if (h.id === 'h-educational') {
        if (/education|learn|prevent|research|study|o'rgan|ta'lim|oldini.*ol/i.test(lower) && /harm|danger|risk|xavf/i.test(lower)) {
          likelihoodRatio = 3.0;
          h.evidence_for.push(evidence.slice(0, 80));
        }
      }

      if (likelihoodRatio !== 1.0) {
        h.posterior_probability = bayesianUpdate(h.posterior_probability, likelihoodRatio);
      }

      // Auto-confirm/reject
      if (h.posterior_probability > 0.85) h.status = 'confirmed';
      if (h.posterior_probability < 0.1) h.status = 'rejected';
    }
  }

  private summarizeHypotheses(hypotheses: Hypothesis[], lang: 'uz' | 'en'): string {
    const parts = hypotheses.map((h) => {
      const statusIcon = { active: '⏳', confirmed: '✅', rejected: '❌', uncertain: '❓' }[h.status];
      return `${statusIcon} "${h.statement}": ${(h.posterior_probability * 100).toFixed(0)}% (${h.evidence_for.length} dalil, ${h.evidence_against.length} qarshi)`;
    });

    return lang === 'uz'
      ? `Bayesian yangilanish: ${parts.join('; ')}`
      : `Bayesian update: ${parts.join('; ')}`;
  }

  // ---- Phase 4: Working Memory ----

  private queryWorkingMemory(query: string): string[] {
    const queryWords = new Set(query.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const scored = this.memory.facts.map((f) => {
      const factWords = new Set(f.text.toLowerCase().split(/\s+/));
      const overlap = [...queryWords].filter((w) => factWords.has(w)).length;
      return { text: f.text, score: overlap / (queryWords.size || 1) };
    });

    return scored
      .filter((s) => s.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.text);
  }

  private learnFromChain(chain: ThoughtChain): void {
    if (!chain.conclusion) return;

    // Store high-confidence conclusions as facts
    if (chain.conclusion.confidence > 0.7) {
      this.memory.facts.push({
        text: `${chain.query.slice(0, 80)} → ${chain.conclusion.verdict || 'analyzed'} (${(chain.conclusion.confidence * 100).toFixed(0)}%)`,
        confidence: chain.conclusion.confidence,
        source: chain.id,
        created_at: new Date().toISOString(),
      });
    }

    // Track reasoning patterns
    const toolPattern = chain.tools_called.sort().join('+') || 'no-tools';
    const existing = this.memory.patterns.find((p) => p.pattern === toolPattern);
    if (existing) {
      existing.frequency++;
      existing.last_seen = new Date().toISOString();
    } else {
      this.memory.patterns.push({ pattern: toolPattern, frequency: 1, last_seen: new Date().toISOString() });
    }

    saveWorkingMemory(this.memory);
  }

  // ---- Knowledge Retrieval ----

  private retrieveKnowledge(ctx: ReasoningContext, stepId: number): ThoughtStep {
    const summary = ctx.prior_knowledge.length > 0
      ? ctx.prior_knowledge.slice(0, 5).join('; ')
      : (ctx.language === 'uz' ? 'Oldingi bilim topilmadi' : 'No prior knowledge found');

    return {
      id: stepId,
      type: 'retrieve',
      thought: ctx.language === 'uz'
        ? `Bilim bazasidan ${ctx.prior_knowledge.length} ta tegishli ma'lumot topdim.`
        : `Retrieved ${ctx.prior_knowledge.length} relevant entries from knowledge base.`,
      observation: summary,
      confidence: ctx.prior_knowledge.length > 3 ? 0.8 : ctx.prior_knowledge.length > 0 ? 0.6 : 0.2,
      duration_ms: 0,
    };
  }

  // ---- Tool Planning (intent-aware, pass-aware) ----

  private planToolUse(question: string, tools: string[], lang: 'uz' | 'en', intent: QueryIntent, pass: number): { tool: string | null; input: string } {
    const lower = question.toLowerCase();

    // First pass: try the most relevant tool
    // Later passes: try alternative tools
    const candidates: Array<{ tool: string; score: number; input: string }> = [];

    if (tools.includes('web_search')) {
      let score = 0;
      if (/izla|search|qidir|find|internet|ma'lumot|sayt/i.test(lower)) score += 3;
      if (intent === 'information_question') score += 2;
      if (/who|kim|when|qachon|where|qayer/i.test(lower)) score += 1;
      if (score > 0) candidates.push({ tool: 'web_search', score, input: question });
    }

    if (tools.includes('web_fetch')) {
      const urlMatch = question.match(/https?:\/\/[^\s]+/);
      if (urlMatch) candidates.push({ tool: 'web_fetch', score: 5, input: urlMatch[0] });
      if (/url|sayt|website|link/i.test(lower)) candidates.push({ tool: 'web_fetch', score: 2, input: question });
    }

    if (tools.includes('vision_analyze')) {
      let score = 0;
      if (/rasm|image|screenshot|photo|surat|ko'rish|visual|picture/i.test(lower)) score += 3;
      if (intent === 'content_safety_check' && /image|rasm|foto|video/i.test(lower)) score += 2;
      if (score > 0) candidates.push({ tool: 'vision_analyze', score, input: question });
    }

    if (tools.includes('content_analyze')) {
      let score = 0;
      if (/tahlil|analyze|tekshir|check|classify|aniqla/i.test(lower)) score += 2;
      if (intent === 'content_safety_check' || intent === 'content_analysis') score += 2;
      if (score > 0) candidates.push({ tool: 'content_analyze', score, input: question });
    }

    if (tools.includes('keyword_extract') && /keyword|kalit|so'z|extract|ajrat/i.test(lower)) {
      candidates.push({ tool: 'keyword_extract', score: 2, input: question });
    }

    if (tools.includes('text_summarize') && /summary|xulosa|qisqa|summarize/i.test(lower)) {
      candidates.push({ tool: 'text_summarize', score: 2, input: question });
    }

    candidates.sort((a, b) => b.score - a.score);

    // On later passes, skip tools we already tried
    const pick = candidates[Math.min(pass, candidates.length - 1)];
    return pick ? { tool: pick.tool, input: pick.input } : { tool: null, input: question };
  }

  private async executeToolStep(tool: string, input: string, question: string, stepId: number): Promise<ThoughtStep> {
    const start = performance.now();

    let output: string;
    try {
      output = await this.toolExecutor(tool, input);
    } catch (err) {
      output = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }

    const isError = output.startsWith('Error');
    const duration = performance.now() - start;

    return {
      id: stepId,
      type: 'tool_call',
      thought: `${tool}("${input.slice(0, 60)}") → ${question.slice(0, 80)}`,
      action: `${tool}(${input.slice(0, 100)})`,
      tool_used: tool,
      tool_input: input,
      tool_output: output.slice(0, 3000),
      observation: output.slice(0, 500),
      confidence: isError ? 0.05 : 0.75 + (output.length > 100 ? 0.1 : 0),
      duration_ms: duration,
    };
  }

  // ---- Deep Analysis (not just text generation) ----

  private deepAnalyze(question: string, context: string[], ctx: ReasoningContext, intent: QueryIntent, stepId: number): ThoughtStep {
    const start = performance.now();
    const lower = question.toLowerCase();
    const hasContext = context.length > 0 && context.some((c) => c.length > 10);

    // Actually analyze the content
    let evidenceFor = '';
    let evidenceAgainst = '';
    let analysisThought = '';
    let confidence = 0.5;

    if (intent === 'content_safety_check' || intent === 'content_analysis') {
      // Count harmful vs safe signals in context
      const allText = context.join(' ').toLowerCase();
      const harmSignals = (allText.match(/harmful|toxic|danger|block|nsfw|zararli|xavfli|violence|zo'ravonlik|pornograph/gi) || []).length;
      const safeSignals = (allText.match(/safe|education|learn|normal|benign|medical|xavfsiz|ta'lim|tibbiy|ilmiy/gi) || []).length;
      const contextModifiers = (allText.match(/prevent|how to avoid|research|study|oldini|o'rganish|tadqiqot/gi) || []).length;

      if (harmSignals > safeSignals + contextModifiers) {
        evidenceFor = `${harmSignals} harmful signals found`;
        confidence = Math.min(0.9, 0.5 + harmSignals * 0.08);
        analysisThought = ctx.language === 'uz'
          ? `${harmSignals} ta zararli signal, ${safeSignals} ta xavfsiz signal, ${contextModifiers} ta kontekst modifikator topildi. Zararli degan xulosaga moyillik.`
          : `${harmSignals} harmful signals, ${safeSignals} safe signals, ${contextModifiers} context modifiers. Leaning towards harmful.`;
      } else if (safeSignals > harmSignals) {
        evidenceAgainst = `${safeSignals} safe signals outweigh ${harmSignals} harmful signals`;
        confidence = Math.min(0.9, 0.5 + safeSignals * 0.08);
        analysisThought = ctx.language === 'uz'
          ? `Xavfsiz signallar (${safeSignals}) zararli signallardan (${harmSignals}) ko'p. Xavfsiz degan xulosaga moyillik.`
          : `Safe signals (${safeSignals}) outweigh harmful signals (${harmSignals}). Leaning towards safe.`;
      } else if (contextModifiers > 0) {
        evidenceAgainst = `Context modifiers suggest educational/preventive intent`;
        confidence = 0.6;
        analysisThought = ctx.language === 'uz'
          ? `Kontekst modifikatorlari ta'limiy/profilaktik niyatni ko'rsatmoqda.`
          : `Context modifiers indicate educational/preventive intent.`;
      } else {
        analysisThought = ctx.language === 'uz'
          ? `"${question.slice(0, 50)}" — aniq signal topilmadi.`
          : `"${question.slice(0, 50)}" — no clear signals found.`;
      }
    } else {
      // Non-safety analysis
      if (hasContext) {
        confidence = Math.min(0.85, 0.5 + context.filter((c) => c.length > 50).length * 0.1);
        analysisThought = ctx.language === 'uz'
          ? `${context.length} ta ma'lumot manbai asosida "${question.slice(0, 50)}" ga javob shakllantiryapman.`
          : `Forming answer to "${question.slice(0, 50)}" based on ${context.length} sources.`;
      } else {
        analysisThought = ctx.language === 'uz'
          ? `"${question.slice(0, 50)}" uchun yetarli tashqi ma'lumot yo'q, ichki bilim asosida tahlil.`
          : `Insufficient external data for "${question.slice(0, 50)}", analyzing with internal knowledge.`;
      }
    }

    return {
      id: stepId,
      type: 'analyze',
      thought: analysisThought,
      observation: hasContext ? context[context.length - 1]?.slice(0, 300) : undefined,
      evidence_for: evidenceFor || undefined,
      evidence_against: evidenceAgainst || undefined,
      confidence,
      duration_ms: performance.now() - start,
    };
  }

  // ---- Contradiction Detection ----

  private detectContradictions(steps: ThoughtStep[], lang: 'uz' | 'en'): string[] {
    const contradictions: string[] = [];
    const safeSteps = steps.filter((s) => s.evidence_against && /safe|xavfsiz/i.test(s.evidence_against));
    const harmSteps = steps.filter((s) => s.evidence_for && /harmful|zararli/i.test(s.evidence_for));

    if (safeSteps.length > 0 && harmSteps.length > 0) {
      contradictions.push(
        lang === 'uz'
          ? `${harmSteps.length} qadam "zararli" deydi, ${safeSteps.length} qadam "xavfsiz" deydi`
          : `${harmSteps.length} steps say "harmful", ${safeSteps.length} steps say "safe"`,
      );
    }

    // Check tool outputs that contradict each other
    const toolOutputs = steps.filter((s) => s.type === 'tool_call' && s.tool_output);
    for (let i = 0; i < toolOutputs.length; i++) {
      for (let j = i + 1; j < toolOutputs.length; j++) {
        const out1 = (toolOutputs[i].tool_output || '').toLowerCase();
        const out2 = (toolOutputs[j].tool_output || '').toLowerCase();
        if (
          (/safe|xavfsiz/i.test(out1) && /harmful|zararli/i.test(out2)) ||
          (/harmful|zararli/i.test(out1) && /safe|xavfsiz/i.test(out2))
        ) {
          contradictions.push(
            lang === 'uz'
              ? `${toolOutputs[i].tool_used} va ${toolOutputs[j].tool_used} qarama-qarshi natija berdi`
              : `${toolOutputs[i].tool_used} and ${toolOutputs[j].tool_used} gave contradictory results`,
          );
        }
      }
    }

    return contradictions;
  }

  // ---- Overall Confidence ----

  private calculateOverallConfidence(steps: ThoughtStep[]): number {
    if (steps.length === 0) return 0;
    const weights: Record<string, number> = {
      tool_call: 1.5, analyze: 1.2, verify: 1.3, synthesize: 1.0,
      retrieve: 0.8, decompose: 0.5, hypothesize: 0.6, classify_intent: 0.7,
      bayesian_update: 1.1, self_correct: 0.9, backtrack: 0.3, infer: 1.0,
      compare: 1.0, search: 1.2,
    };

    let weightedSum = 0;
    let totalWeight = 0;
    for (const step of steps) {
      const w = weights[step.type] || 0.5;
      weightedSum += step.confidence * w;
      totalWeight += w;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  }

  // ---- Synthesis ----

  private synthesize(query: string, chain: ThoughtChain, lang: 'uz' | 'en', stepId: number): ThoughtStep {
    const start = performance.now();
    const steps = chain.steps;

    const toolSteps = steps.filter((s) => s.type === 'tool_call' && s.tool_output && !s.tool_output.startsWith('Error'));
    const analyzeSteps = steps.filter((s) => s.type === 'analyze');
    const evidenceCount = toolSteps.length + analyzeSteps.filter((s) => s.observation).length;
    const avgConfidence = this.calculateOverallConfidence(steps);

    // Determine verdict from hypothesis probabilities
    const harmfulH = chain.hypotheses.find((h) => h.id === 'h-harmful');
    const safeH = chain.hypotheses.find((h) => h.id === 'h-safe');
    const educH = chain.hypotheses.find((h) => h.id === 'h-educational');

    let verdictText: string;

    if (harmfulH && safeH) {
      if (educH && educH.posterior_probability > 0.5) {
        verdictText = lang === 'uz'
          ? `Ta'limiy kontent (${(educH.posterior_probability * 100).toFixed(0)}%) — zararli mavzu haqida, lekin ta'limiy maqsadda. Bloklash KERAK EMAS.`
          : `Educational content (${(educH.posterior_probability * 100).toFixed(0)}%) — about harmful topic but for educational purpose. Should NOT block.`;
      } else if (harmfulH.posterior_probability > safeH.posterior_probability + 0.15) {
        verdictText = lang === 'uz'
          ? `Zararli (${(harmfulH.posterior_probability * 100).toFixed(0)}% vs ${(safeH.posterior_probability * 100).toFixed(0)}%). ${evidenceCount} dalil asosida. ${chain.backtrack_count > 0 ? `${chain.backtrack_count} ta qayta urinish.` : ''}`
          : `Harmful (${(harmfulH.posterior_probability * 100).toFixed(0)}% vs ${(safeH.posterior_probability * 100).toFixed(0)}%). Based on ${evidenceCount} evidence pieces. ${chain.backtrack_count > 0 ? `${chain.backtrack_count} retries.` : ''}`;
      } else if (safeH.posterior_probability > harmfulH.posterior_probability + 0.15) {
        verdictText = lang === 'uz'
          ? `Xavfsiz (${(safeH.posterior_probability * 100).toFixed(0)}% vs ${(harmfulH.posterior_probability * 100).toFixed(0)}%). Bloklash kerak emas.`
          : `Safe (${(safeH.posterior_probability * 100).toFixed(0)}% vs ${(harmfulH.posterior_probability * 100).toFixed(0)}%). No blocking needed.`;
      } else {
        verdictText = lang === 'uz'
          ? `Noaniq — zararli ${(harmfulH.posterior_probability * 100).toFixed(0)}%, xavfsiz ${(safeH.posterior_probability * 100).toFixed(0)}%. Inson ko'rib chiqishi kerak.`
          : `Uncertain — harmful ${(harmfulH.posterior_probability * 100).toFixed(0)}%, safe ${(safeH.posterior_probability * 100).toFixed(0)}%. Human review recommended.`;
      }
    } else {
      verdictText = lang === 'uz'
        ? `${steps.length} qadam, ${evidenceCount} dalil, ${chain.pass_count} o'tish. O'rtacha ishonch: ${(avgConfidence * 100).toFixed(0)}%.`
        : `${steps.length} steps, ${evidenceCount} evidence, ${chain.pass_count} passes. Average confidence: ${(avgConfidence * 100).toFixed(0)}%.`;
    }

    return {
      id: stepId,
      type: 'synthesize',
      thought: verdictText,
      confidence: avgConfidence,
      duration_ms: performance.now() - start,
    };
  }

  // ---- Verification ----

  private verify(chain: ThoughtChain, lang: 'uz' | 'en', stepId: number): ThoughtStep {
    const start = performance.now();
    const issues: string[] = [];
    const steps = chain.steps;

    // 1. Tool errors
    const toolErrors = steps.filter((s) => s.type === 'tool_call' && s.tool_output?.startsWith('Error'));
    if (toolErrors.length > 0) {
      issues.push(lang === 'uz'
        ? `${toolErrors.length} ta tool xatosi (${toolErrors.map((t) => t.tool_used).join(', ')})`
        : `${toolErrors.length} tool errors (${toolErrors.map((t) => t.tool_used).join(', ')})`);
    }

    // 2. Low confidence steps
    const lowConf = steps.filter((s) => s.confidence < 0.3 && s.type !== 'backtrack');
    if (lowConf.length > steps.length * 0.4) {
      issues.push(lang === 'uz'
        ? `${lowConf.length}/${steps.length} qadam past ishonchli`
        : `${lowConf.length}/${steps.length} steps have low confidence`);
    }

    // 3. Insufficient evidence
    const evidenceSteps = steps.filter((s) => s.observation && s.observation.length > 20);
    if (evidenceSteps.length < 2) {
      issues.push(lang === 'uz' ? 'Kam dalil to\'plangan' : 'Insufficient evidence');
    }

    // 4. Hypothesis conflicts
    const activeH = chain.hypotheses.filter((h) => h.status === 'active');
    if (activeH.length > 1) {
      const maxProb = Math.max(...activeH.map((h) => h.posterior_probability));
      const minProb = Math.min(...activeH.map((h) => h.posterior_probability));
      if (maxProb - minProb < 0.2) {
        issues.push(lang === 'uz' ? 'Farazlar orasida yetarli farq yo\'q' : 'Hypotheses are not sufficiently differentiated');
      }
    }

    // 5. Too many backtracks
    if (chain.backtrack_count > 2) {
      issues.push(lang === 'uz'
        ? `${chain.backtrack_count} marta qayta urinish — barqaror emas`
        : `${chain.backtrack_count} backtracks — unstable reasoning`);
    }

    const isValid = issues.length === 0;
    const synthStep = chain.steps.find((s) => s.type === 'synthesize');
    const baseConf = synthStep?.confidence ?? 0.5;

    return {
      id: stepId,
      type: 'verify',
      thought: isValid
        ? (lang === 'uz' ? 'Tekshiruv muvaffaqiyatli — natija ishonchli.' : 'Verification passed — result is reliable.')
        : (lang === 'uz'
            ? `${issues.length} ta muammo topildi: ${issues.join('; ')}`
            : `${issues.length} issues found: ${issues.join('; ')}`),
      observation: issues.length > 0 ? issues.join('\n') : undefined,
      confidence: isValid ? Math.min(baseConf * 1.1, 0.95) : baseConf * (1 - issues.length * 0.1),
      duration_ms: performance.now() - start,
    };
  }

  // ---- Build Conclusion ----

  private buildConclusion(chain: ThoughtChain, lang: 'uz' | 'en'): Conclusion {
    const synthStep = chain.steps.find((s) => s.type === 'synthesize');
    const verifyStep = chain.steps.find((s) => s.type === 'verify');

    const evidence = chain.steps
      .filter((s) => s.observation && s.observation.length > 10)
      .map((s) => s.observation!);

    const uncertaintyReasons = chain.steps
      .filter((s) => s.confidence < 0.4 && s.type !== 'backtrack')
      .map((s) => s.thought);

    // Determine verdict from hypotheses
    let verdict: 'safe' | 'harmful' | 'uncertain' | undefined;
    const harmfulH = chain.hypotheses.find((h) => h.id === 'h-harmful');
    const safeH = chain.hypotheses.find((h) => h.id === 'h-safe');
    const educH = chain.hypotheses.find((h) => h.id === 'h-educational');

    if (harmfulH && safeH) {
      if (educH && educH.status === 'confirmed') {
        verdict = 'safe'; // Educational content should not be blocked
      } else if (harmfulH.status === 'confirmed' || harmfulH.posterior_probability > safeH.posterior_probability + 0.15) {
        verdict = 'harmful';
      } else if (safeH.status === 'confirmed' || safeH.posterior_probability > harmfulH.posterior_probability + 0.15) {
        verdict = 'safe';
      } else {
        verdict = 'uncertain';
      }
    } else {
      // From synthesis text
      const synthText = (synthStep?.thought || '').toLowerCase();
      if (/harmful|zararli/i.test(synthText)) verdict = 'harmful';
      else if (/safe|xavfsiz/i.test(synthText)) verdict = 'safe';
      else verdict = 'uncertain';
    }

    const confidence = verifyStep?.confidence ?? synthStep?.confidence ?? 0.5;
    const answer = synthStep?.thought || (lang === 'uz' ? 'Tahlil tugadi.' : 'Analysis complete.');

    // Alternative interpretations from hypotheses
    const alternativeInterpretations = chain.hypotheses
      .filter((h) => h.status === 'active' && h.posterior_probability > 0.2)
      .map((h) => `${h.statement} (${(h.posterior_probability * 100).toFixed(0)}%)`);

    const hypothesisSummary = chain.hypotheses
      .map((h) => `${h.statement}: ${h.status} (${(h.posterior_probability * 100).toFixed(0)}%)`)
      .join('; ');

    return {
      answer,
      verdict,
      confidence: Math.min(Math.max(confidence, 0.05), 0.99),
      evidence,
      alternative_interpretations: alternativeInterpretations,
      uncertainty_reasons: uncertaintyReasons,
      hypothesis_summary: hypothesisSummary,
    };
  }

  private estimateTokens(chain: ThoughtChain): number {
    let total = chain.query.length;
    for (const step of chain.steps) {
      total += (step.thought?.length || 0) + (step.observation?.length || 0) + (step.tool_output?.length || 0);
    }
    return Math.ceil(total / 4);
  }

  // ---- Public Getters ----

  getChainHistory(): ThoughtChain[] {
    return this.chains;
  }

  getLastChain(): ThoughtChain | null {
    return this.chains[0] || null;
  }

  getWorkingMemoryStats(): { facts: number; patterns: number } {
    return { facts: this.memory.facts.length, patterns: this.memory.patterns.length };
  }

  formatChainForDisplay(chain: ThoughtChain, lang: 'uz' | 'en'): string {
    const lines: string[] = [];

    lines.push(lang === 'uz' ? '🧠 **Fikrlash jarayoni:**' : '🧠 **Reasoning process:**');
    lines.push(`${lang === 'uz' ? 'O\'tishlar' : 'Passes'}: ${chain.pass_count} | ${lang === 'uz' ? 'Qayta urinishlar' : 'Backtracks'}: ${chain.backtrack_count}`);
    lines.push('');

    for (const step of chain.steps) {
      const icon: Record<string, string> = {
        decompose: '🔀', classify_intent: '🎯', hypothesize: '💭', retrieve: '📚',
        search: '🔍', analyze: '🔬', compare: '⚖️', infer: '💡',
        verify: '✅', synthesize: '🧩', tool_call: '🔧', self_correct: '🔄',
        backtrack: '⬅️', bayesian_update: '📊',
      };

      const confBar = '█'.repeat(Math.round(step.confidence * 5)) + '░'.repeat(5 - Math.round(step.confidence * 5));

      lines.push(`${icon[step.type] || '•'} **${step.type}** [${confBar}] ${(step.confidence * 100).toFixed(0)}%`);
      lines.push(`   ${step.thought}`);

      if (step.tool_used) {
        lines.push(`   🔧 ${step.tool_used}(${(step.tool_input || '').slice(0, 50)})`);
      }
      if (step.evidence_for) lines.push(`   🟢 ${step.evidence_for}`);
      if (step.evidence_against) lines.push(`   🔴 ${step.evidence_against}`);
      if (step.observation) lines.push(`   👁 ${step.observation.slice(0, 150)}`);
      lines.push('');
    }

    // Hypotheses summary
    if (chain.hypotheses.length > 0) {
      lines.push('---');
      lines.push(lang === 'uz' ? '💭 **Farazlar:**' : '💭 **Hypotheses:**');
      for (const h of chain.hypotheses) {
        const statusIcon = { active: '⏳', confirmed: '✅', rejected: '❌', uncertain: '❓' }[h.status];
        const bar = '█'.repeat(Math.round(h.posterior_probability * 10)) + '░'.repeat(10 - Math.round(h.posterior_probability * 10));
        lines.push(`${statusIcon} ${h.statement} [${bar}] ${(h.posterior_probability * 100).toFixed(0)}%`);
        if (h.evidence_for.length > 0) lines.push(`   🟢 ${h.evidence_for.length} supporting evidence`);
        if (h.evidence_against.length > 0) lines.push(`   🔴 ${h.evidence_against.length} counter-evidence`);
      }
      lines.push('');
    }

    if (chain.conclusion) {
      lines.push('---');
      lines.push(lang === 'uz' ? '📋 **Yakuniy xulosa:**' : '📋 **Final conclusion:**');
      lines.push(chain.conclusion.answer);

      if (chain.conclusion.verdict) {
        const vmap = { safe: '✅ Safe', harmful: '🚫 Harmful', uncertain: '❓ Uncertain' };
        lines.push(`**Verdict:** ${vmap[chain.conclusion.verdict]} (${(chain.conclusion.confidence * 100).toFixed(0)}%)`);
      }

      if (chain.conclusion.alternative_interpretations.length > 0) {
        lines.push('', lang === 'uz' ? '**Muqobil talqinlar:**' : '**Alternative interpretations:**');
        chain.conclusion.alternative_interpretations.forEach((a) => lines.push(`- ${a}`));
      }

      if (chain.conclusion.evidence.length > 0) {
        lines.push('', lang === 'uz' ? '**Dalillar:**' : '**Evidence:**');
        chain.conclusion.evidence.slice(0, 3).forEach((e) => lines.push(`- ${e.slice(0, 120)}`));
      }

      if (chain.conclusion.uncertainty_reasons.length > 0) {
        lines.push('', lang === 'uz' ? '**Noaniqlik sabablari:**' : '**Uncertainty reasons:**');
        chain.conclusion.uncertainty_reasons.slice(0, 2).forEach((r) => lines.push(`- ${r.slice(0, 120)}`));
      }
    }

    const totalMs = chain.steps.reduce((s, st) => s + st.duration_ms, 0);
    lines.push('', `⏱ ${totalMs.toFixed(0)}ms | ${chain.steps.length} steps | ${chain.tools_called.length} tools`);

    return lines.join('\n');
  }
}
