// ============================================================
// SENIOR REASONING ENGINE — Senior darajadagi chuqur fikrlash
//
// SELF-PROMPT (o'zim uchun yozgan prompt):
// ---------------------------------------------------------------
// Sen senior software engineer va AI tadqiqotchisisan. Vazifang:
// kontentni shunchaki "harmful/safe" deb baholash emas, balki
// professional psixolog, huquqshunos va xavfsizlik mutaxassisi
// darajasida CHUQUR tahlil qilish.
//
// Har bir kontent uchun quyidagi bosqichlardan o'tish SHART:
//
// 1. PROBLEM DECOMPOSITION — vazifani sub-vazifalarga ajrat:
//    - "Bu kontent kim uchun?" (audience)
//    - "Qaysi kontekstda?" (context)
//    - "Niyat nima?" (intent)
//    - "Oqibati nima?" (impact)
//    - "Qonuniylik holati?" (legality)
//
// 2. MULTIPLE HYPOTHESES — kamida 3 ta gipoteza yarat:
//    - H1: Eng aniq talqin (zararli/xavfsiz)
//    - H2: Muqobil talqin (boshqacha kontekstda)
//    - H3: Eng yomon stsenariy (worst-case)
//    Har biri uchun PRIOR ehtimollik bilan
//
// 3. EVIDENCE COLLECTION — har gipoteza uchun dalil to'pla:
//    - Lingvistik signallar (so'z, ohang, sintaksis)
//    - Semantik signallar (mavzu, niyat, sentiment)
//    - Kontekstual signallar (joy, vaqt, audience)
//    - Tashqi bilim (Knowledge Graph, similar content)
//
// 4. BAYESIAN UPDATE — har dalildan keyin gipotezalarni yangila:
//    P(H|E) = P(E|H) * P(H) / P(E)
//
// 5. CAUSAL REASONING — sabab-oqibat zanjirini qur:
//    - "Agar bola bu kontentni ko'rsa → nima bo'ladi?"
//    - "Agar kattalar ko'rsa → nima bo'ladi?"
//    - "Agar ommaviy tarqalsa → nima bo'ladi?"
//
// 6. COUNTERFACTUAL — alternativ stsenariylarni tekshir:
//    - "Agar bu so'z bo'lmaganida nima o'zgarardi?"
//    - "Agar bu kontekstda emas, balki boshqa joyda bo'lsa?"
//
// 7. ANALOGICAL — o'xshash holatlarni qidirib solishtir:
//    - Knowledge graph'dan o'xshash node'lar
//    - Fingerprint'dan tarixiy qarorlar
//
// 8. SELF-CRITIQUE — o'z xulosangni tanqid qil:
//    - "Men nimadan bexabar bo'lishim mumkin?"
//    - "Qaysi dalillarim zaif?"
//    - "False positive yoki false negative ehtimolligi?"
//
// 9. CONFIDENCE CALIBRATION — ishonch darajasini to'g'rila:
//    - Dalillar miqdori va sifati
//    - Gipotezalar orasidagi farq
//    - Counterfactual zaifligi
//
// 10. FINAL VERDICT — barcha bosqichlarni birlashtirib qaror:
//     - Verdict + confidence + reasoning chain
//     - Eng kuchli 3 ta dalil
//     - Self-critique natijasi
//     - Tavsiya (block/allow/review)
//
// MUHIM QOIDA: Selective blocking — faqat zararli qism bloklanadi,
// xavfsiz qism toza o'tib ketadi. False positive = regression.
// ============================================================

import type { SemanticResult } from './semantic-analyzer';
import { analyzeText } from './semantic-analyzer';
import { inferHarmfulness } from './knowledge-graph';
import { LocalLLM } from './llm-local';
import type { ContentVerdict, ContentType } from '../types/feedback';

// ============================================================
// TYPES
// ============================================================

export interface SeniorHypothesis {
  id: string;
  label: string;
  verdict: ContentVerdict;
  prior: number;
  posterior: number;
  evidence_for: Evidence[];
  evidence_against: Evidence[];
  causal_chain: CausalLink[];
  status: 'active' | 'rejected' | 'confirmed';
}

export interface Evidence {
  source: 'lexical' | 'semantic' | 'contextual' | 'knowledge' | 'embedding' | 'pattern' | 'analogical' | 'counterfactual';
  description: string;
  strength: number; // 0 to 1
  direction: 'supports' | 'contradicts';
  weight: number;
}

export interface CausalLink {
  cause: string;
  effect: string;
  probability: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_group: 'children' | 'adults' | 'general' | 'vulnerable';
}

export interface SubProblem {
  question: string;
  answer: string;
  confidence: number;
  depends_on: string[];
}

export interface ThoughtNode {
  id: string;
  depth: number;
  thought: string;
  score: number;
  children: string[];
  parent: string | null;
  evidence: Evidence[];
}

export interface SelfCritique {
  potential_blind_spots: string[];
  weak_evidence: string[];
  false_positive_risk: number;
  false_negative_risk: number;
  alternative_interpretation: string | null;
  confidence_adjustment: number;
}

export interface SeniorAnalysis {
  // Final result
  verdict: ContentVerdict;
  confidence: number;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  should_block: boolean;
  block_reason: string | null;

  // Decomposition
  sub_problems: SubProblem[];

  // SeniorHypothesis tracking
  hypotheses: SeniorHypothesis[];
  winning_hypothesis: string;

  // Tree-of-thought
  thought_tree: ThoughtNode[];
  reasoning_path: string[];

  // Causal & counterfactual
  causal_chains: CausalLink[];
  counterfactuals: string[];

  // Self-reflection
  self_critique: SelfCritique;

  // Top evidence
  strongest_evidence: Evidence[];

  // Action recommendation
  recommendation: string;
  recommendation_uz: string;

  // Performance
  reasoning_depth: number;
  total_thoughts: number;
  reasoning_ms: number;
}

export interface SeniorReasoningContext {
  text: string;
  content_type: ContentType;
  audience_hint?: 'children' | 'adults' | 'general' | 'unknown';
  source_url?: string;
  prior_verdicts?: ContentVerdict[];
  language?: 'uz' | 'en' | 'mixed';
}

// ============================================================
// SENIOR REASONING ENGINE
// ============================================================

export class SeniorReasoningEngine {
  private llm: LocalLLM | null = null;

  constructor(llm?: LocalLLM) {
    this.llm = llm || null;
  }

  setLLM(llm: LocalLLM): void {
    this.llm = llm;
  }

  // ============================================================
  // MAIN ENTRY POINT — full senior-level analysis (SYNC)
  // No real async I/O happens here, so we expose a sync API.
  // ============================================================

  analyzeSync(ctx: SeniorReasoningContext, preSemantic?: SemanticResult): SeniorAnalysis {
    const start = performance.now();
    const semantic = preSemantic || analyzeText(ctx.text);

    // Auto-detect audience if not provided
    if (!ctx.audience_hint) {
      ctx.audience_hint = this.detectAudience(ctx.text);
    }

    // ============= STEP 1: Problem Decomposition =============
    const subProblems = this.decomposeProblem(ctx, semantic);

    // ============= STEP 2: Generate Hypotheses =============
    const hypotheses = this.generateHypotheses(ctx, semantic, subProblems);

    // ============= STEP 3: Evidence Collection =============
    for (const h of hypotheses) {
      const evidence = this.collectEvidence(h, ctx, semantic);
      h.evidence_for = evidence.filter((e) => e.direction === 'supports');
      h.evidence_against = evidence.filter((e) => e.direction === 'contradicts');
    }

    // ============= STEP 3.5: Analogical Reasoning (MUHIM: bayesian'dan OLDIN!) =============
    // User feedback'dan o'rgangan narsani topadi va prior'ni keskin o'zgartiradi.
    // Bu bayesianUpdate'dan OLDIN bo'lishi SHART, aks holda posterior'ga ta'sir qilmaydi.
    this.analogicalReasoning(hypotheses, ctx);

    // ============= STEP 4: Bayesian Update =============
    this.bayesianUpdate(hypotheses);

    // ============= STEP 5: Causal Reasoning =============
    const causalChains = this.buildCausalChains(ctx, semantic, hypotheses);
    for (const h of hypotheses) {
      h.causal_chain = causalChains.filter((c) =>
        (h.verdict === 'harmful' && c.severity !== 'low') ||
        (h.verdict === 'safe' && c.severity === 'low')
      );
    }

    // ============= STEP 6: Counterfactual Analysis =============
    const counterfactuals = this.counterfactualAnalysis(ctx, semantic);

    // ============= STEP 8: Tree-of-Thought Exploration =============
    const thoughtTree = this.exploreThoughtTree(ctx, semantic, hypotheses, 3);

    // ============= STEP 9: Self-Critique =============
    const selfCritique = this.selfCritique(hypotheses, thoughtTree, ctx);

    // ============= STEP 10: Final Decision =============
    const winning = this.selectWinner(hypotheses, selfCritique);
    const strongest = this.rankEvidence(hypotheses);
    const path = this.tracePath(thoughtTree);

    // Confidence calibration
    const confidence = this.calibrateConfidence(winning, selfCritique, hypotheses);
    const riskLevel = this.computeRiskLevel(winning.verdict, confidence, causalChains);
    const shouldBlock = this.shouldBlock(winning, confidence, causalChains, selfCritique);
    const blockReason = shouldBlock ? this.explainBlock(winning, strongest.slice(0, 3)) : null;

    const recommendation = this.composeRecommendation(winning, confidence, riskLevel, shouldBlock, selfCritique, 'en');
    const recommendationUz = this.composeRecommendation(winning, confidence, riskLevel, shouldBlock, selfCritique, 'uz');

    return {
      verdict: winning.verdict,
      confidence,
      risk_level: riskLevel,
      should_block: shouldBlock,
      block_reason: blockReason,
      sub_problems: subProblems,
      hypotheses,
      winning_hypothesis: winning.id,
      thought_tree: thoughtTree,
      reasoning_path: path,
      causal_chains: causalChains,
      counterfactuals,
      self_critique: selfCritique,
      strongest_evidence: strongest.slice(0, 5),
      recommendation,
      recommendation_uz: recommendationUz,
      reasoning_depth: Math.max(...thoughtTree.map((t) => t.depth), 0),
      total_thoughts: thoughtTree.length,
      reasoning_ms: performance.now() - start,
    };
  }

  // Async wrapper for backward compatibility
  async analyze(ctx: SeniorReasoningContext, preSemantic?: SemanticResult): Promise<SeniorAnalysis> {
    return this.analyzeSync(ctx, preSemantic);
  }

  // Auto-detect audience from text content
  private detectAudience(text: string): 'children' | 'adults' | 'general' | 'unknown' {
    const lower = text.toLowerCase();
    if (/\b(child|kid|baby|toddler|kindergarten|elementary|nursery|bola|chaqaloq|maktab|bolalar bog'cha|boshlang'ich)\b/i.test(lower)) {
      return 'children';
    }
    if (/\b(adult|18\+|nsfw|mature|kattalar|voyaga\s*yetgan)\b/i.test(lower)) {
      return 'adults';
    }
    if (/\b(everyone|all\s+ages|family\s+friendly|barcha|hamma\s+uchun)\b/i.test(lower)) {
      return 'general';
    }
    return 'unknown';
  }

  // ============================================================
  // STEP 1: PROBLEM DECOMPOSITION
  // ============================================================

  private decomposeProblem(ctx: SeniorReasoningContext, sem: SemanticResult): SubProblem[] {
    const subs: SubProblem[] = [];

    // Q1: Who is the audience?
    let audience = ctx.audience_hint || 'unknown';
    let audienceConf = ctx.audience_hint ? 0.9 : 0.4;
    if (/\b(child|bola|kid|baby|chaqaloq|maktab)\b/i.test(ctx.text)) {
      audience = 'children';
      audienceConf = 0.85;
    } else if (/\b(adult|kattalar|18\+|nsfw)\b/i.test(ctx.text)) {
      audience = 'adults';
      audienceConf = 0.85;
    }
    subs.push({
      question: 'Who is the target audience?',
      answer: audience,
      confidence: audienceConf,
      depends_on: [],
    });

    // Q2: What is the context?
    let context = 'general';
    let contextConf = 0.5;
    if (sem.context_signals.length > 0) {
      const protective = sem.context_signals.find((s) =>
        /education|prevention|research|medical|warning|historical|child_safe/i.test(s.signal)
      );
      if (protective) {
        context = protective.signal;
        contextConf = protective.weight;
      }
    }
    if (/\b(education|ta'lim|o'qish|maktab)\b/i.test(ctx.text)) { context = 'educational'; contextConf = Math.max(contextConf, 0.7); }
    else if (/\b(medical|tibbiyot|shifokor)\b/i.test(ctx.text)) { context = 'medical'; contextConf = Math.max(contextConf, 0.7); }
    else if (/\b(news|yangilik|hujjatli)\b/i.test(ctx.text)) { context = 'news'; contextConf = Math.max(contextConf, 0.7); }
    subs.push({
      question: 'What is the context?',
      answer: context,
      confidence: contextConf,
      depends_on: [],
    });

    // Q3: What is the intent?
    subs.push({
      question: 'What is the producer intent?',
      answer: sem.intent,
      confidence: 0.7,
      depends_on: ['What is the context?'],
    });

    // Q4: What is the potential impact?
    let impact = 'low';
    let impactConf = 0.5;
    if (sem.toxicity > 0.7) { impact = 'high'; impactConf = 0.8; }
    else if (sem.toxicity > 0.4) { impact = 'medium'; impactConf = 0.65; }
    subs.push({
      question: 'What is the potential impact?',
      answer: impact,
      confidence: impactConf,
      depends_on: ['Who is the target audience?', 'What is the producer intent?'],
    });

    // Q5: Legality / policy compliance
    let legality = 'compliant';
    let legalityConf = 0.6;
    if (/\b(illegal|csam|cp|terrorism|terrorchilik|noqonuniy)\b/i.test(ctx.text)) {
      legality = 'illegal';
      legalityConf = 0.95;
    }
    subs.push({
      question: 'Is this content legally compliant?',
      answer: legality,
      confidence: legalityConf,
      depends_on: ['What is the context?'],
    });

    return subs;
  }

  // ============================================================
  // STEP 2: HYPOTHESIS GENERATION (multiple competing theories)
  // ============================================================

  private generateHypotheses(ctx: SeniorReasoningContext, sem: SemanticResult, subs: SubProblem[]): SeniorHypothesis[] {
    const hypotheses: SeniorHypothesis[] = [];

    // H1: Direct interpretation (most likely)
    const directHarmful = sem.toxicity > 0.5 || /\b(porn|sex|kill|murder|drug|terrorist|pornografiya|zoravonlik|narkotik)\b/i.test(ctx.text);
    hypotheses.push({
      id: 'h1_direct',
      label: directHarmful
        ? 'Content is directly harmful (explicit harmful content)'
        : 'Content is benign (no harmful indicators)',
      verdict: directHarmful ? 'harmful' : 'safe',
      prior: directHarmful ? 0.55 : 0.6,
      posterior: 0,
      evidence_for: [],
      evidence_against: [],
      causal_chain: [],
      status: 'active',
    });

    // H2: Context-modified interpretation (educational/research/news)
    const contextSignal = subs.find((s) => s.question === 'What is the context?');
    const isProtectiveContext = contextSignal && ['educational', 'prevention', 'news', 'medical'].includes(contextSignal.answer);
    if (isProtectiveContext) {
      hypotheses.push({
        id: 'h2_context',
        label: `Content discusses harmful topic in ${contextSignal!.answer} context — safe to allow`,
        verdict: 'safe',
        prior: 0.3 * contextSignal!.confidence,
        posterior: 0,
        evidence_for: [],
        evidence_against: [],
        causal_chain: [],
        status: 'active',
      });
    }

    // H3: Worst-case interpretation (could be misused)
    if (sem.toxicity > 0.3 || sem.entities.some((e) => e.type === 'person')) {
      hypotheses.push({
        id: 'h3_worst',
        label: 'Content could be misused to harm vulnerable users (worst-case)',
        verdict: 'harmful',
        prior: 0.2,
        posterior: 0,
        evidence_for: [],
        evidence_against: [],
        causal_chain: [],
        status: 'active',
      });
    }

    // H4: Ambiguous / requires human review
    if (sem.toxicity > 0.2 && sem.toxicity < 0.6) {
      hypotheses.push({
        id: 'h4_ambiguous',
        label: 'Content is ambiguous — borderline case, needs review',
        verdict: 'uncertain',
        prior: 0.2,
        posterior: 0,
        evidence_for: [],
        evidence_against: [],
        causal_chain: [],
        status: 'active',
      });
    }

    // Normalize priors
    const totalPrior = hypotheses.reduce((s, h) => s + h.prior, 0);
    if (totalPrior > 0) {
      for (const h of hypotheses) h.prior /= totalPrior;
    }

    return hypotheses;
  }

  // ============================================================
  // STEP 3: EVIDENCE COLLECTION (multi-source)
  // ============================================================

  private collectEvidence(h: SeniorHypothesis, ctx: SeniorReasoningContext, sem: SemanticResult): Evidence[] {
    const evidence: Evidence[] = [];

    // ---- Lexical evidence ----
    const harmfulWords = ctx.text.match(/\b(porn|sex|nude|kill|murder|gun|bomb|drug|cocaine|heroin|terrorist|suicide|rape|abuse|pornografiya|zoravonlik|qotillik|narkotik|terrorchilik|xudkushlik)\b/gi) || [];
    if (harmfulWords.length > 0) {
      evidence.push({
        source: 'lexical',
        description: `Found ${harmfulWords.length} harmful keywords: ${harmfulWords.slice(0, 3).join(', ')}`,
        strength: Math.min(harmfulWords.length / 3, 1),
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.7,
      });
    }

    const safeWords = ctx.text.match(/\b(education|learn|study|research|safety|prevention|awareness|ta'lim|o'rganish|tadqiqot|xavfsizlik|oldini olish)\b/gi) || [];
    if (safeWords.length > 0) {
      evidence.push({
        source: 'lexical',
        description: `Found ${safeWords.length} safety/educational keywords`,
        strength: Math.min(safeWords.length / 3, 1),
        direction: h.verdict === 'safe' ? 'supports' : 'contradicts',
        weight: 0.6,
      });
    }

    // ---- Semantic evidence ----
    if (sem.toxicity > 0.5) {
      evidence.push({
        source: 'semantic',
        description: `High toxicity score: ${(sem.toxicity * 100).toFixed(0)}%`,
        strength: sem.toxicity,
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.75,
      });
    }

    if (sem.sentiment < -0.5) {
      evidence.push({
        source: 'semantic',
        description: `Strongly negative sentiment: ${sem.sentiment.toFixed(2)}`,
        strength: Math.abs(sem.sentiment),
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.4,
      });
    }

    // Intent
    if (sem.intent === 'informational' || sem.intent === 'educational') {
      evidence.push({
        source: 'semantic',
        description: `Informational/educational intent detected`,
        strength: 0.7,
        direction: h.verdict === 'safe' ? 'supports' : 'contradicts',
        weight: 0.55,
      });
    } else if (sem.intent === 'harmful_explicit' || sem.intent === 'harmful_subtle') {
      evidence.push({
        source: 'semantic',
        description: `Harmful intent signal: ${sem.intent}`,
        strength: sem.intent === 'harmful_explicit' ? 0.9 : 0.6,
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.7,
      });
    } else if (sem.intent === 'commercial') {
      evidence.push({
        source: 'semantic',
        description: `Commercial intent — possible spam/scam vector`,
        strength: 0.4,
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.3,
      });
    }

    // ---- Contextual evidence (context modifiers) ----
    for (const sig of sem.context_signals) {
      const isProtective = sig.category === 'safe_indicator' ||
        /education|prevention|research|warning|historical|child_safe|medical/i.test(sig.signal);
      const isHarmful = sig.category === 'harmful_indicator';
      evidence.push({
        source: 'contextual',
        description: `Context: ${sig.signal} (${sig.category})`,
        strength: sig.weight,
        direction:
          (isProtective && h.verdict === 'safe') || (isHarmful && h.verdict === 'harmful')
            ? 'supports'
            : 'contradicts',
        weight: 0.65,
      });
    }

    // ---- Knowledge graph evidence ----
    const keywords = [...sem.stems.slice(0, 10), ...sem.bigrams.slice(0, 5)];
    const kg = inferHarmfulness(keywords);
    if (kg.relevant_nodes.length > 0) {
      evidence.push({
        source: 'knowledge',
        description: `Knowledge graph: ${kg.relevant_nodes.length} relevant nodes, score: ${(kg.score * 100).toFixed(0)}%`,
        strength: Math.abs(kg.score - 0.5) * 2,
        direction:
          (kg.score > 0.5 && h.verdict === 'harmful') || (kg.score < 0.5 && h.verdict === 'safe')
            ? 'supports'
            : 'contradicts',
        weight: 0.7,
      });
    }

    // ---- Embedding evidence (semantic similarity to known categories) ----
    if (this.llm) {
      try {
        const harmfulSim = this.llm.textSimilarity(ctx.text, 'pornography violence drugs terrorism abuse harmful');
        const safeSim = this.llm.textSimilarity(ctx.text, 'education research news medical safety prevention');

        if (harmfulSim > 0.3) {
          evidence.push({
            source: 'embedding',
            description: `Semantic similarity to harmful categories: ${(harmfulSim * 100).toFixed(0)}%`,
            strength: harmfulSim,
            direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
            weight: 0.65,
          });
        }
        if (safeSim > 0.3) {
          evidence.push({
            source: 'embedding',
            description: `Semantic similarity to safe categories: ${(safeSim * 100).toFixed(0)}%`,
            strength: safeSim,
            direction: h.verdict === 'safe' ? 'supports' : 'contradicts',
            weight: 0.65,
          });
        }
      } catch {
        // LLM not initialized
      }
    }

    // ---- Pattern evidence ----
    if (/\d{3,}-\d{2,}-\d{4,}/.test(ctx.text)) {
      evidence.push({
        source: 'pattern',
        description: 'Contains pattern resembling sensitive ID/SSN',
        strength: 0.8,
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.5,
      });
    }
    if (/https?:\/\/[^\s]*\.(tk|ml|ga|cf|onion)/i.test(ctx.text)) {
      evidence.push({
        source: 'pattern',
        description: 'Suspicious domain (free TLD or onion)',
        strength: 0.7,
        direction: h.verdict === 'harmful' ? 'supports' : 'contradicts',
        weight: 0.55,
      });
    }

    return evidence;
  }

  // ============================================================
  // STEP 4: BAYESIAN UPDATE
  // ============================================================

  private bayesianUpdate(hypotheses: SeniorHypothesis[]): void {
    // For each hypothesis, compute posterior based on evidence
    for (const h of hypotheses) {
      let logLikelihood = Math.log(Math.max(h.prior, 1e-6));

      for (const ev of h.evidence_for) {
        // P(E|H) high when evidence supports
        const p = 0.5 + ev.strength * ev.weight * 0.4;
        logLikelihood += Math.log(p);
      }
      for (const ev of h.evidence_against) {
        // P(E|H) low when evidence contradicts
        const p = 0.5 - ev.strength * ev.weight * 0.4;
        logLikelihood += Math.log(Math.max(p, 0.05));
      }

      h.posterior = Math.exp(logLikelihood);
    }

    // Normalize posteriors
    const total = hypotheses.reduce((s, h) => s + h.posterior, 0);
    if (total > 0) {
      for (const h of hypotheses) h.posterior /= total;
    }

    // Mark rejected hypotheses
    for (const h of hypotheses) {
      if (h.posterior < 0.1) h.status = 'rejected';
      else if (h.posterior > 0.6) h.status = 'confirmed';
    }
  }

  // ============================================================
  // STEP 5: CAUSAL REASONING (cause → effect chains)
  // ============================================================

  private buildCausalChains(ctx: SeniorReasoningContext, sem: SemanticResult, hypotheses: SeniorHypothesis[]): CausalLink[] {
    const chains: CausalLink[] = [];

    // Causal chains for harmful content
    if (sem.toxicity > 0.4 || /\b(porn|violence|drug|suicide|pornografiya|zoravonlik|narkotik)\b/i.test(ctx.text)) {
      chains.push({
        cause: 'Child viewer is exposed to this content',
        effect: 'Psychological harm, developmental impact, normalization of harmful behavior',
        probability: 0.8,
        severity: 'critical',
        affected_group: 'children',
      });

      chains.push({
        cause: 'Vulnerable user (depression, addiction) sees content',
        effect: 'Triggering, relapse, copycat behavior',
        probability: 0.6,
        severity: 'high',
        affected_group: 'vulnerable',
      });

      chains.push({
        cause: 'Content spreads on social media',
        effect: 'Wider exposure, possible viral harm, public concern',
        probability: 0.4,
        severity: 'medium',
        affected_group: 'general',
      });

      chains.push({
        cause: 'Adult viewer with proper context',
        effect: 'Awareness, education, or no significant harm',
        probability: 0.5,
        severity: 'low',
        affected_group: 'adults',
      });
    }

    // Causal chains for educational/safe context
    const hasProtectiveContext = sem.context_signals.some((s) =>
      s.category === 'safe_indicator' ||
      /education|prevention|research|warning|historical|child_safe|medical/i.test(s.signal)
    );
    if (hasProtectiveContext) {
      chains.push({
        cause: 'User reads content in educational/preventive frame',
        effect: 'Awareness raised, harm prevention, informed decision',
        probability: 0.75,
        severity: 'low',
        affected_group: 'general',
      });
    }

    return chains;
  }

  // ============================================================
  // STEP 6: COUNTERFACTUAL ANALYSIS ("what if...")
  // ============================================================

  private counterfactualAnalysis(ctx: SeniorReasoningContext, sem: SemanticResult): string[] {
    const cfs: string[] = [];

    // What if the harmful keywords were removed?
    const harmfulMatches = ctx.text.match(/\b(porn|sex|kill|murder|drug|terrorist|suicide)\b/gi);
    if (harmfulMatches && harmfulMatches.length > 0) {
      cfs.push(`If "${harmfulMatches[0]}" was absent, content would likely shift to safe.`);
    }

    // What if context was different?
    if (sem.context_signals.length > 0) {
      cfs.push(`Without educational/preventive context, raw harmful score would be ${((sem.toxicity + 0.2) * 100).toFixed(0)}%.`);
    }

    // What if audience was different?
    if (ctx.audience_hint === 'adults') {
      cfs.push('For a child audience, this content would warrant blocking even with current context.');
    } else if (ctx.audience_hint === 'children') {
      cfs.push('For an adult audience, this content might be acceptable.');
    }

    // What if it appeared in a different platform?
    cfs.push('On an adult-verified platform, threshold for harm would be higher.');

    return cfs;
  }

  // ============================================================
  // STEP 7: ANALOGICAL REASONING
  // ============================================================

  private analogicalReasoning(hypotheses: SeniorHypothesis[], ctx: SeniorReasoningContext): void {
    if (!this.llm) return;

    try {
      const analogies = this.llm.searchKnowledgeBase(ctx.text, 8);

      const harmfulMatches = analogies.filter((a) => a.key.startsWith('harmful_'));
      const safeMatches = analogies.filter((a) => a.key.startsWith('safe_'));

      // 🔑 EXACT USER FEEDBACK MATCH:
      // Agar 0.9+ similarity bo'lgan user_feedback topilsa → bu eng kuchli signal
      // Sababi: foydalanuvchi aniq shu so'zni "harmful" deb belgilagan
      const strongHarmful = harmfulMatches.find((a) => a.similarity >= 0.9 && a.key.includes('user_feedback'));
      const strongSafe = safeMatches.find((a) => a.similarity >= 0.9 && a.key.includes('user_feedback'));

      if (strongHarmful) {
        // Boost harmful hypothesis posterior heavily
        for (const h of hypotheses) {
          if (h.verdict === 'harmful') h.prior = Math.max(h.prior, 0.85);
          if (h.verdict === 'safe') h.prior = Math.min(h.prior, 0.1);
        }
      } else if (strongSafe) {
        for (const h of hypotheses) {
          if (h.verdict === 'safe') h.prior = Math.max(h.prior, 0.85);
          if (h.verdict === 'harmful') h.prior = Math.min(h.prior, 0.1);
        }
      }

      for (const h of hypotheses) {
        const supporting = h.verdict === 'harmful' ? harmfulMatches : h.verdict === 'safe' ? safeMatches : [];
        if (supporting.length > 0) {
          const countStrength = Math.min(0.4 + supporting.length * 0.15, 1.0);
          const simStrength = supporting[0].similarity || 0;
          const strength = Math.max(countStrength, simStrength);

          // User feedback'dan kelgan match'larni alohida belgilash
          const userFeedbackCount = supporting.filter((a) => a.key.includes('user_feedback')).length;
          const isUserTaught = userFeedbackCount > 0;

            const supportingSummary = supporting.slice(0, 3).map((s) => s.key).join(', ');
            const supportingSummaryUser = supporting.slice(0, 3).map((s) => s.key.replace('_user_feedback', '') + ':' + (Math.round((s.similarity || 0) * 100))).join(', ');
            h.evidence_for.push({
            source: 'analogical',
            description: isUserTaught
              ? `🎯 USER TAUGHT: ${userFeedbackCount} user-feedback match + ${supporting.length - userFeedbackCount} KB matches (${supportingSummaryUser})`
              : `Analogous to ${supporting.length} known ${h.verdict} cases: ${supportingSummary}`,
            strength: isUserTaught ? Math.max(strength, 0.95) : strength,
            direction: 'supports',
            weight: isUserTaught ? 0.95 : 0.7,
          });
        }
      }
    } catch {
      // LLM not ready
    }
  }

  // ============================================================
  // STEP 8: TREE-OF-THOUGHT EXPLORATION
  // ============================================================

  private exploreThoughtTree(ctx: SeniorReasoningContext, sem: SemanticResult, hypotheses: SeniorHypothesis[], maxDepth: number): ThoughtNode[] {
    const tree: ThoughtNode[] = [];

    // Root thought
    const root: ThoughtNode = {
      id: 't0',
      depth: 0,
      thought: `Analyze content: "${ctx.text.slice(0, 60)}..." — what is its safety verdict?`,
      score: 1.0,
      children: [],
      parent: null,
      evidence: [],
    };
    tree.push(root);

    let counter = 1;

    // Branch for each hypothesis
    for (const h of hypotheses.filter((x) => x.status !== 'rejected')) {
      const branch: ThoughtNode = {
        id: `t${counter++}`,
        depth: 1,
        thought: `SeniorHypothesis: ${h.label} (posterior: ${(h.posterior * 100).toFixed(0)}%)`,
        score: h.posterior,
        children: [],
        parent: root.id,
        evidence: [...h.evidence_for.slice(0, 2), ...h.evidence_against.slice(0, 1)],
      };
      tree.push(branch);
      root.children.push(branch.id);

      // Sub-thoughts: top evidence elaborations
      if (maxDepth >= 2) {
        for (const ev of h.evidence_for.slice(0, 2)) {
          const sub: ThoughtNode = {
            id: `t${counter++}`,
            depth: 2,
            thought: `Evidence supporting: ${ev.description}`,
            score: ev.strength * ev.weight * h.posterior,
            children: [],
            parent: branch.id,
            evidence: [ev],
          };
          tree.push(sub);
          branch.children.push(sub.id);

          // Deeper: implication
          if (maxDepth >= 3 && ev.strength > 0.5) {
            const implication: ThoughtNode = {
              id: `t${counter++}`,
              depth: 3,
              thought: `Implication: this strongly ${h.verdict === 'harmful' ? 'raises' : 'lowers'} risk for ${ev.source} signal`,
              score: ev.strength * ev.weight,
              children: [],
              parent: sub.id,
              evidence: [],
            };
            tree.push(implication);
            sub.children.push(implication.id);
          }
        }
      }
    }

    return tree;
  }

  // ============================================================
  // STEP 9: SELF-CRITIQUE (reflexion pattern)
  // ============================================================

  private selfCritique(hypotheses: SeniorHypothesis[], tree: ThoughtNode[], ctx: SeniorReasoningContext): SelfCritique {
    const active = hypotheses.filter((h) => h.status !== 'rejected');
    const top = active.sort((a, b) => b.posterior - a.posterior)[0];
    const second = active[1];

    const blindSpots: string[] = [];
    const weakEvidence: string[] = [];

    // Detect blind spots
    if (ctx.text.length < 30) {
      blindSpots.push('Very short text — limited context to reason about');
    }
    if (!top || top.evidence_for.length < 2) {
      blindSpots.push('Few supporting evidence pieces — may have missed signals');
    }
    if (!this.llm) {
      blindSpots.push('LLM embeddings not available — semantic similarity reasoning weakened');
    }
    if (!ctx.audience_hint) {
      blindSpots.push('Audience not specified — verdict assumes general audience');
    }

    // Detect weak evidence
    if (top) {
      for (const ev of top.evidence_for) {
        if (ev.strength < 0.3) {
          weakEvidence.push(`Low strength: ${ev.description}`);
        }
      }
    }

    // Risks
    const closeCallMargin = second ? top.posterior - second.posterior : 1.0;
    const fpRisk = top?.verdict === 'harmful' && closeCallMargin < 0.2 ? 0.6 : top?.verdict === 'harmful' ? 0.2 : 0.05;
    const fnRisk = top?.verdict === 'safe' && closeCallMargin < 0.2 ? 0.6 : top?.verdict === 'safe' ? 0.2 : 0.05;

    // Alternative interpretation
    const altInterpretation = second && closeCallMargin < 0.3 ? second.label : null;

    // Confidence adjustment based on critique
    let adjustment = 0;
    if (blindSpots.length >= 2) adjustment -= 0.1;
    if (weakEvidence.length >= 2) adjustment -= 0.05;
    if (closeCallMargin < 0.15) adjustment -= 0.15;
    if (top && top.evidence_for.length >= 4) adjustment += 0.05;

    return {
      potential_blind_spots: blindSpots,
      weak_evidence: weakEvidence,
      false_positive_risk: fpRisk,
      false_negative_risk: fnRisk,
      alternative_interpretation: altInterpretation,
      confidence_adjustment: adjustment,
    };
  }

  // ============================================================
  // STEP 10: DECISION HELPERS
  // ============================================================

  private selectWinner(hypotheses: SeniorHypothesis[], critique: SelfCritique): SeniorHypothesis {
    const active = hypotheses.filter((h) => h.status !== 'rejected');
    if (active.length === 0) {
      return {
        id: 'fallback',
        label: 'Uncertain — no active hypotheses',
        verdict: 'uncertain',
        prior: 0.5,
        posterior: 0.5,
        evidence_for: [],
        evidence_against: [],
        causal_chain: [],
        status: 'active',
      };
    }

    const sorted = active.sort((a, b) => b.posterior - a.posterior);

    // If close call and uncertain hypothesis exists, prefer caution
    if (sorted.length >= 2 && sorted[0].posterior - sorted[1].posterior < 0.1) {
      const uncertain = active.find((h) => h.verdict === 'uncertain');
      if (uncertain && critique.false_positive_risk > 0.4) {
        return uncertain;
      }
    }

    return sorted[0];
  }

  private rankEvidence(hypotheses: SeniorHypothesis[]): Evidence[] {
    const all: Evidence[] = [];
    for (const h of hypotheses) {
      if (h.status === 'rejected') continue;
      for (const ev of h.evidence_for) {
        all.push({ ...ev, weight: ev.weight * h.posterior });
      }
    }
    return all.sort((a, b) => b.strength * b.weight - a.strength * a.weight);
  }

  private tracePath(tree: ThoughtNode[]): string[] {
    if (tree.length === 0) return [];
    const root = tree.find((t) => t.parent === null);
    if (!root) return [];

    const path: string[] = [root.thought];
    let current = root;
    while (current.children.length > 0) {
      const childNodes = current.children
        .map((id) => tree.find((t) => t.id === id))
        .filter((t): t is ThoughtNode => t !== undefined);
      if (childNodes.length === 0) break;
      const best = childNodes.sort((a, b) => b.score - a.score)[0];
      path.push(best.thought);
      current = best;
    }
    return path;
  }

  private calibrateConfidence(winner: SeniorHypothesis, critique: SelfCritique, all: SeniorHypothesis[]): number {
    let conf = winner.posterior;
    conf += critique.confidence_adjustment;

    // Adjust based on evidence quality
    const totalEvidence = winner.evidence_for.length + winner.evidence_against.length;
    if (totalEvidence >= 5) conf += 0.05;
    if (totalEvidence < 2) conf -= 0.1;

    // Margin with second-best
    const sorted = all.filter((h) => h.status !== 'rejected').sort((a, b) => b.posterior - a.posterior);
    if (sorted.length >= 2) {
      const margin = sorted[0].posterior - sorted[1].posterior;
      conf = conf * 0.7 + (0.5 + margin / 2) * 0.3;
    }

    return Math.max(0.1, Math.min(0.99, conf));
  }

  private computeRiskLevel(verdict: ContentVerdict, confidence: number, chains: CausalLink[]): SeniorAnalysis['risk_level'] {
    const criticalChains = chains.filter((c) => c.severity === 'critical' && c.probability > 0.5);
    if (criticalChains.length > 0 && verdict === 'harmful') return 'critical';

    if (verdict === 'safe') return confidence > 0.7 ? 'none' : 'low';
    if (verdict === 'uncertain') return 'medium';
    if (confidence > 0.8) return 'critical';
    if (confidence > 0.6) return 'high';
    return 'medium';
  }

  private shouldBlock(winner: SeniorHypothesis, confidence: number, chains: CausalLink[], critique: SelfCritique): boolean {
    if (winner.verdict !== 'harmful') return false;
    if (confidence < 0.5) return false;

    // Don't block if false positive risk is very high and no critical causal chain
    const hasCritical = chains.some((c) => c.severity === 'critical' && c.probability > 0.4);
    if (critique.false_positive_risk > 0.5 && !hasCritical) return false;

    return true;
  }

  private explainBlock(winner: SeniorHypothesis, topEvidence: Evidence[]): string {
    const reasons = topEvidence.map((e) => e.description).join('; ');
    return `${winner.label}. Top evidence: ${reasons}`;
  }

  private composeRecommendation(
    winner: SeniorHypothesis,
    confidence: number,
    risk: SeniorAnalysis['risk_level'],
    block: boolean,
    critique: SelfCritique,
    lang: 'uz' | 'en'
  ): string {
    if (lang === 'uz') {
      if (block && risk === 'critical') return `🔴 BLOKLA — Kritik darajadagi zararli kontent (${(confidence * 100).toFixed(0)}%). ${critique.alternative_interpretation ? 'Lekin muqobil talqin: ' + critique.alternative_interpretation : ''}`;
      if (block) return `🚫 BLOKLA — Zararli kontent (${(confidence * 100).toFixed(0)}%).`;
      if (winner.verdict === 'uncertain') return `❓ INSON KO'RIB CHIQSIN — Chegaraviy holat, false positive xavfi ${(critique.false_positive_risk * 100).toFixed(0)}%, false negative ${(critique.false_negative_risk * 100).toFixed(0)}%.`;
      if (winner.verdict === 'safe' && confidence > 0.7) return `✅ RUXSAT BER — Xavfsiz kontent (${(confidence * 100).toFixed(0)}%).`;
      return `🟢 RUXSAT BER — Tekshiruv kerak emas.`;
    }

    if (block && risk === 'critical') return `🔴 BLOCK — Critical harmful content (${(confidence * 100).toFixed(0)}%). ${critique.alternative_interpretation ? 'Alt interpretation: ' + critique.alternative_interpretation : ''}`;
    if (block) return `🚫 BLOCK — Harmful content (${(confidence * 100).toFixed(0)}%).`;
    if (winner.verdict === 'uncertain') return `❓ HUMAN REVIEW — Borderline case. FP risk: ${(critique.false_positive_risk * 100).toFixed(0)}%, FN risk: ${(critique.false_negative_risk * 100).toFixed(0)}%.`;
    if (winner.verdict === 'safe' && confidence > 0.7) return `✅ ALLOW — Safe content (${(confidence * 100).toFixed(0)}%).`;
    return `🟢 ALLOW — No review needed.`;
  }

  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

  formatAnalysisForDisplay(analysis: SeniorAnalysis, lang: 'uz' | 'en' = 'en'): string {
    const uz = lang === 'uz';
    const lines: string[] = [];

    lines.push(uz ? '🧠 **SENIOR REASONING TAHLILI**' : '🧠 **SENIOR REASONING ANALYSIS**');
    lines.push('');
    lines.push(`**${uz ? 'Qaror' : 'Verdict'}:** ${analysis.verdict.toUpperCase()} (${(analysis.confidence * 100).toFixed(0)}%)`);
    lines.push(`**${uz ? 'Xavf darajasi' : 'Risk level'}:** ${analysis.risk_level.toUpperCase()}`);
    lines.push(`**${uz ? 'Tavsiya' : 'Recommendation'}:** ${uz ? analysis.recommendation_uz : analysis.recommendation}`);
    lines.push('');

    // Sub-problems
    lines.push(uz ? '📋 **Vazifa parchalash:**' : '📋 **Problem decomposition:**');
    for (const sp of analysis.sub_problems) {
      lines.push(`- Q: ${sp.question}`);
      lines.push(`  A: ${sp.answer} (${(sp.confidence * 100).toFixed(0)}%)`);
    }
    lines.push('');

    // Hypotheses
    lines.push(uz ? '🔬 **Gipotezalar:**' : '🔬 **Hypotheses:**');
    for (const h of analysis.hypotheses) {
      const marker = h.id === analysis.winning_hypothesis ? '🏆' : h.status === 'rejected' ? '❌' : '•';
      lines.push(`${marker} [${h.verdict}] ${h.label}`);
      lines.push(`   Prior: ${(h.prior * 100).toFixed(0)}% → Posterior: ${(h.posterior * 100).toFixed(0)}%`);
    }
    lines.push('');

    // Reasoning path
    lines.push(uz ? '🌳 **Fikrlash yo\'li:**' : '🌳 **Reasoning path:**');
    analysis.reasoning_path.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });
    lines.push('');

    // Causal chains
    if (analysis.causal_chains.length > 0) {
      lines.push(uz ? '⚡ **Sabab-oqibat zanjiri:**' : '⚡ **Causal chains:**');
      for (const c of analysis.causal_chains.slice(0, 3)) {
        lines.push(`- ${c.cause}`);
        lines.push(`  → ${c.effect}`);
        lines.push(`  (${(c.probability * 100).toFixed(0)}% prob, ${c.severity}, ${c.affected_group})`);
      }
      lines.push('');
    }

    // Counterfactuals
    if (analysis.counterfactuals.length > 0) {
      lines.push(uz ? '🔄 **Counterfactual (agar...):**' : '🔄 **Counterfactual (what if...):**');
      for (const cf of analysis.counterfactuals.slice(0, 3)) {
        lines.push(`- ${cf}`);
      }
      lines.push('');
    }

    // Top evidence
    lines.push(uz ? '🎯 **Eng kuchli dalillar:**' : '🎯 **Strongest evidence:**');
    for (const ev of analysis.strongest_evidence) {
      const arrow = ev.direction === 'supports' ? '✓' : '✗';
      lines.push(`${arrow} [${ev.source}] ${ev.description} (${(ev.strength * 100).toFixed(0)}%)`);
    }
    lines.push('');

    // Self-critique
    lines.push(uz ? '🪞 **O\'z-o\'zini tanqid:**' : '🪞 **Self-critique:**');
    if (analysis.self_critique.potential_blind_spots.length > 0) {
      lines.push(uz ? '  Ko\'rmagan tomonlar:' : '  Blind spots:');
      for (const bs of analysis.self_critique.potential_blind_spots) lines.push(`  - ${bs}`);
    }
    lines.push(`  False positive risk: ${(analysis.self_critique.false_positive_risk * 100).toFixed(0)}%`);
    lines.push(`  False negative risk: ${(analysis.self_critique.false_negative_risk * 100).toFixed(0)}%`);
    if (analysis.self_critique.alternative_interpretation) {
      lines.push(`  ${uz ? 'Muqobil talqin' : 'Alternative'}: ${analysis.self_critique.alternative_interpretation}`);
    }
    lines.push('');

    lines.push(`⏱ ${analysis.reasoning_ms.toFixed(0)}ms | ${analysis.total_thoughts} thoughts | depth ${analysis.reasoning_depth}`);

    return lines.join('\n');
  }
}

// ============================================================
// SINGLETON
// ============================================================

let _engine: SeniorReasoningEngine | null = null;

export function getSeniorReasoningEngine(llm?: LocalLLM): SeniorReasoningEngine {
  if (!_engine) {
    _engine = new SeniorReasoningEngine(llm);
  } else if (llm && !_engine['llm']) {
    _engine.setLLM(llm);
  }
  return _engine;
}
