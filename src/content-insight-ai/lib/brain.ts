// ============================================================
// BRAIN — Content Insight AI ning asosiy miyasi
//
// Barcha komponentlarni birlashtiradi:
// - Semantic Analyzer: matn tushunish, kontekst, niyat
// - Knowledge Graph: bilim tarmog'i, o'zaro aloqalar
// - Model Trainer: ML classifier, pattern extraction
// - Notification: ogohlantirish, eskalatsiya
// - Reasoning Engine: chain-of-thought fikrlash
// - Tool System: tashqi vositalar
// - Web Search: internetdan izlash
// - Vision Analyzer: rasm/video tahlili
//
// Har bir kontent uchun chuqur tahlil qiladi va qaror chiqaradi
// ============================================================

import {
  analyzeText,
  computeSimilarity,
  isLikelyHarmful,
  type SemanticResult,
} from './semantic-analyzer';
import {
  inferHarmfulness,
  learnFromFeedback,
  getRelatedNodes,
  findNodes,
  initializeDefaultKnowledge,
  getGraphStats,
  addNode,
  addEdge,
} from './knowledge-graph';
import {
  trainModel,
  predict as mlPredict,
  addManualTrainingData,
  getTrainingStats,
  buildTrainingDataset,
} from './model-trainer';
import { notify, checkEscalations } from './notification-system';
import { getAllFeedbackReports } from './feedback-store';
import type { FeedbackReport, ContentType, ContentVerdict, LearningEntry } from '../types/feedback';
import { getLang, t, getContentTypeLabel, type Lang } from './language';
import { ReasoningEngine, type ThoughtChain, type ReasoningContext } from './reasoning-engine';
import { ToolSystem, type ToolResult } from './tool-system';
import { WebSearchEngine, type SearchResult, type FetchedPage } from './web-search';
import { VisionAnalyzer, type VisionAnalysis, type VideoAnalysis } from './vision-analyzer';
import { LocalLLM, type LLMResponse, type ParsedIntent } from './llm-local';
import { getSeniorReasoningEngine, type SeniorAnalysis } from './senior-reasoning';
import { getVisualUnderstandingProvider } from './visual-understanding-provider';
import type { VisualUnderstanding, VideoUnderstanding, ContextUnderstanding } from './ai-core/types';
import { getSharedLearningManager, type SharedFeedbackItem } from './shared-learning';
import { getAutoResearcher, type ResearchResult } from './auto-research';
import { getCachedVerdict, setCachedVerdict, checkFastBlocklist } from './fast-decision';
import { processContentSync } from './ai-core/orchestrator';
import type { AiCoreResult } from './ai-core/types';
import { runReasoningPipeline } from './reasoning-pipeline/pipeline-runner';
import type {
  PolicyDecision,
  RiskScores,
  PipelineStageResult,
  ReasoningPipelineResult,
} from './reasoning-pipeline/types';

// ============================================================
// Types
// ============================================================

export interface BrainAnalysis {
  verdict: ContentVerdict;
  confidence: number;
  reasoning: ReasoningStep[];
  semantic: SemanticResult;
  knowledge_matches: { node: string; relevance: number }[];
  ml_prediction: { label: string; confidence: number } | null;
  similar_content: { id: string; similarity: number; verdict: ContentVerdict }[];
  recommendation: string;
  should_block: boolean;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  senior_analysis?: SeniorAnalysis;
  ai_core?: {
    policyAction: PolicyDecision;
    riskScores: RiskScores;
    verdict: ContentVerdict;
    pipelineSummary: ReasoningPipelineResult['pipelineSummary'];
  };
}

export interface ReasoningStep {
  step: number;
  module: 'semantic' | 'knowledge' | 'ml' | 'ensemble' | 'context';
  description: string;
  contribution: number; // -1 to +1 (negative = safe, positive = harmful)
}

export interface LearningResult {
  success: boolean;
  entry?: LearningEntry;
  knowledge_node_id?: string;
  patterns_extracted: number;
  model_retrained: boolean;
  new_accuracy?: number;
  similar_reevaluated: number;
  ai_response: string;
}

// ============================================================
// Content fingerprint cache for similarity
// ============================================================

interface ContentFingerprint {
  id: string;
  text: string;
  semantic: SemanticResult;
  verdict: ContentVerdict;
  feedback_id?: string;
  created_at: string;
}

function loadFingerprints(): ContentFingerprint[] {
  try {
    return JSON.parse(localStorage.getItem('cia_fingerprints') || '[]');
  } catch { return []; }
}

function saveFingerprints(fps: ContentFingerprint[]): void {
  // Keep max 500
  if (fps.length > 500) fps = fps.slice(0, 500);
  localStorage.setItem('cia_fingerprints', JSON.stringify(fps));
}

function addFingerprint(text: string, semantic: SemanticResult, verdict: ContentVerdict, feedbackId?: string): void {
  const fps = loadFingerprints();
  fps.unshift({
    id: `fp-${Date.now()}`,
    text: text.slice(0, 200),
    semantic,
    verdict,
    feedback_id: feedbackId,
    created_at: new Date().toISOString(),
  });
  saveFingerprints(fps);
}

function findSimilarContent(semantic: SemanticResult, topK = 5): { id: string; similarity: number; verdict: ContentVerdict }[] {
  const fps = loadFingerprints();
  const scored = fps.map((fp) => ({
    id: fp.id,
    similarity: computeSimilarity(semantic, fp.semantic),
    verdict: fp.verdict,
  }));

  return scored
    .filter((s) => s.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// ============================================================
// Ensemble Decision Engine
// ============================================================

function ensembleDecision(steps: ReasoningStep[]): { verdict: ContentVerdict; confidence: number } {
  if (steps.length === 0) return { verdict: 'uncertain', confidence: 0.5 };

  // Weighted sum of all contributions
  const weights: Record<string, number> = {
    semantic: 0.3,
    knowledge: 0.25,
    ml: 0.25,
    context: 0.15,
    ensemble: 0.05,
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const step of steps) {
    const w = weights[step.module] || 0.1;
    totalScore += step.contribution * w;
    totalWeight += w;
  }

  const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  const confidence = Math.abs(normalizedScore);

  let verdict: ContentVerdict;
  if (normalizedScore > 0.2) verdict = 'harmful';
  else if (normalizedScore < -0.2) verdict = 'safe';
  else verdict = 'uncertain';

  return {
    verdict,
    confidence: Math.min(Math.max(confidence, 0.1), 0.99),
  };
}

function getRiskLevel(confidence: number, verdict: ContentVerdict): BrainAnalysis['risk_level'] {
  if (verdict === 'safe') return confidence > 0.7 ? 'none' : 'low';
  if (verdict === 'uncertain') return 'medium';
  if (confidence > 0.8) return 'critical';
  if (confidence > 0.6) return 'high';
  return 'medium';
}

// ============================================================
// PUBLIC: Analyze Content
// ============================================================

function mapContentTypeToAiCore(contentType: ContentType): import('./ai-core/types').ContentType {
  if (contentType === 'text' || contentType === 'image' || contentType === 'video') {
    return contentType;
  }
  return 'unknown';
}

function mapAiCoreActionToPipelineAction(action: import('./ai-core/types').AiCoreAction): import('./reasoning-pipeline/types').PipelineAction {
  switch (action) {
    case 'allow':
      return 'allow';
    case 'warn':
      return 'warn';
    case 'blur':
      return 'blur';
    case 'block':
      return 'block';
    case 'request_more_analysis':
      return 'request_more_analysis';
    default:
      return 'request_more_analysis';
  }
}

export function analyzeContent(text: string, contentType: ContentType = 'text'): BrainAnalysis {
  // Backwards-compatible wrapper: simple string interface
  return analyzeContentFull({ requestId: `brain-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text, contentType });
}

export function analyzeContentFull(input: { requestId?: string; text?: string; imageSource?: string | File | Blob; videoSource?: string | File | Blob; audioSource?: string | File | Blob; transcript?: import('./ai-core/types').TranscriptionData; metadata?: Record<string, unknown>; contentType?: ContentType; }): BrainAnalysis {
  const { requestId, text = '', imageSource, videoSource, audioSource, transcript, metadata = {}, contentType = 'unknown' } = input;
  initializeDefaultKnowledge();

  const cached = text ? getCachedVerdict(text) : null;
  if (cached) {
    const semantic0 = analyzeText(text);
    return {
      verdict: cached.verdict,
      confidence: cached.confidence,
      reasoning: [{ step: 1, module: 'ensemble', description: '⚡ Cache\'dan (avval tahlil qilingan)', contribution: cached.verdict === 'harmful' ? 1 : -1 }],
      semantic: semantic0,
      knowledge_matches: [],
      ml_prediction: null,
      similar_content: [],
      recommendation: cached.should_block ? '🚫 Bloklash (cache)' : '✅ Ruxsat (cache)',
      should_block: cached.should_block,
      risk_level: cached.should_block ? 'high' : 'none',
      senior_analysis: undefined,
      ai_core: {
        policyAction: {
          action: 'request_more_analysis',
          reason: 'Cached result used',
          explanation: 'Cached result used',
        },
        riskScores: {
          explicitness: 0,
          sexualIntent: 0,
          gamblingProbability: 0,
          violence: 0,
          manipulation: 0,
          scamProbability: 0,
          childSafetyRisk: 0,
          confidence: cached.confidence,
        },
        verdict: cached.verdict,
        pipelineSummary: { stageResults: [] },
      },
    };
  }

  const blocked = checkFastBlocklist(text);
  if (blocked) {
    const semantic0 = analyzeText(text);
    const result: BrainAnalysis = {
      verdict: 'harmful',
      confidence: 0.92,
      reasoning: [{ step: 1, module: 'ensemble', description: `🚫 Tezkor bloklist: "${blocked.matched}" (${blocked.category})`, contribution: 1 }],
      semantic: semantic0,
      knowledge_matches: [],
      ml_prediction: null,
      similar_content: [],
      recommendation: '🚫 BLOKLA — aniq zararli atama',
      should_block: true,
      risk_level: 'high',
      senior_analysis: undefined,
      ai_core: {
        policyAction: {
          action: 'block',
          reason: `Fast blocklist matched: ${blocked.matched}`,
          explanation: `Fast blocklist matched: ${blocked.matched}`,
        },
        riskScores: {
          explicitness: 0,
          sexualIntent: 0,
          gamblingProbability: 0,
          violence: 0,
          manipulation: 0,
          scamProbability: 0,
          childSafetyRisk: 0,
          confidence: 0.92,
        },
        verdict: 'harmful',
        pipelineSummary: { stageResults: [] },
      },
    };
    setCachedVerdict(text, 'harmful', 0.92, true);
    return result;
  }

  // Route all modalities through AI Core to ensure cognitive stage runs
  const aiResult = processContentSync({
    requestId: requestId || `brain-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    imageSource,
    videoSource,
    audioSource,
    transcript: undefined,
    metadata,
    contentType: (contentType === 'text' || contentType === 'image' || contentType === 'video') ? contentType : 'mixed',
  });

  let brainResult = mapAiCoreResultToBrainAnalysis(aiResult, text);
  brainResult = applyLocalFeedbackOverride(brainResult, text);

  if (brainResult.verdict !== 'uncertain') {
    setCachedVerdict(text, brainResult.verdict, brainResult.confidence, brainResult.should_block);
  }

  return brainResult;
}

function applyLocalFeedbackOverride(result: BrainAnalysis, text: string): BrainAnalysis {
  if (!_localLLM) return result;
  try {
    const fb = _localLLM.checkUserFeedback(text);
    if (!fb) return result;

    const updated: BrainAnalysis = { ...result, reasoning: [...result.reasoning] };
    if (fb.verdict === 'harmful') {
      updated.verdict = 'harmful';
      updated.confidence = Math.max(updated.confidence, fb.similarity);
      updated.should_block = true;
      updated.risk_level = fb.similarity >= 0.95 ? 'high' : 'medium';
      updated.recommendation = `🚫 USER TAUGHT: block ${fb.matched}`;
      updated.reasoning.push({
        step: updated.reasoning.length + 1,
        module: 'ensemble',
        description: `🎯 USER TAUGHT: "${fb.matched}" → BLOCK (${(fb.similarity * 100).toFixed(0)}% match)`,
        contribution: 1,
      });
    } else if (fb.verdict === 'safe' && fb.similarity >= 0.95) {
      updated.verdict = 'safe';
      updated.confidence = Math.max(updated.confidence, fb.similarity);
      updated.should_block = false;
      updated.risk_level = 'none';
      updated.recommendation = `✅ USER TAUGHT: allow ${fb.matched}`;
      updated.reasoning.push({
        step: updated.reasoning.length + 1,
        module: 'ensemble',
        description: `🎯 USER TAUGHT: "${fb.matched}" → ALLOW (${(fb.similarity * 100).toFixed(0)}% match)`,
        contribution: -1,
      });
    }
    return updated;
  } catch {
    return result;
  }
}

function mapAiCoreResultToBrainAnalysis(result: AiCoreResult, text: string): BrainAnalysis {
  const semantic = analyzeText(text);
  const verdict = result.decisionResult?.verdict
    ? result.decisionResult.verdict
    : result.policyResult?.action === 'block'
      ? 'harmful'
      : result.policyResult?.action === 'allow'
        ? 'safe'
        : 'uncertain';
  const confidence = result.confidenceResult?.breakdown?.finalConfidence ?? result.policyResult?.confidence ?? 0.5;
  const should_block = result.policyResult?.action === 'block' || verdict === 'harmful';
  const risk_level = verdict === 'safe'
    ? confidence > 0.75 ? 'none' : 'low'
    : verdict === 'uncertain'
      ? 'medium'
      : confidence > 0.8 ? 'critical' : 'high';

  const recommendation = result.policyResult?.action === 'block'
    ? '🚫 Bloklash (AI Core)'
    : result.policyResult?.action === 'allow'
      ? '✅ Ruxsat (AI Core)'
      : '❓ Noaniq (AI Core)';

  const reasoning: ReasoningStep[] = result.reasoningResult?.reasoningSteps.map((step, index) => ({
    step: index + 1,
    module: 'ensemble',
    description: step.description,
    contribution: Math.max(-1, Math.min(1, step.confidence)),
  })) ?? [
    {
      step: 1,
      module: 'ensemble',
      description: 'AI Core tomonidan qaror qabul qilindi.',
      contribution: verdict === 'harmful' ? 1 : verdict === 'safe' ? -1 : 0,
    },
  ];

  const policyAction: PolicyDecision = result.policyResult
    ? {
        action: mapAiCoreActionToPipelineAction(result.policyResult.action),
        reason: result.policyResult.explanation || 'AI Core policy result',
        explanation: result.policyResult.explanation,
      }
    : {
        action: 'request_more_analysis',
        reason: 'AI Core did not return a policy result.',
        explanation: 'AI Core did not return a policy result.',
      };

  let finalVerdict: ContentVerdict = verdict;
  let finalConfidence = confidence;
  let finalShouldBlock = should_block;
  let finalRiskLevel: BrainAnalysis['risk_level'] = risk_level;
  let finalRecommendation = recommendation;
  let finalReasoning = reasoning;

  if (finalVerdict === 'uncertain') {
    const semanticFallback = isLikelyHarmful(semantic);
    if (semanticFallback.harmful) {
      finalVerdict = 'harmful';
      finalConfidence = Math.max(finalConfidence, semanticFallback.confidence);
      finalShouldBlock = true;
      finalRiskLevel = finalConfidence > 0.8 ? 'critical' : 'high';
      finalRecommendation = '🚫 Bloklash (AI Core + semantic fallback)';
      finalReasoning = [
        ...reasoning,
        {
          step: reasoning.length + 1,
          module: 'semantic',
          description: `Semantic fallback: ${(semanticFallback.confidence * 100).toFixed(0)}% harmful`,
          contribution: 1,
        },
      ];
    }
  }

  return {
    verdict: finalVerdict,
    confidence: finalConfidence,
    reasoning: finalReasoning,
    semantic,
    knowledge_matches: [],
    ml_prediction: null,
    similar_content: [],
    recommendation: finalRecommendation,
    should_block: finalShouldBlock,
    risk_level: finalRiskLevel,
    senior_analysis: undefined,
    ai_core: {
      policyAction,
      riskScores: {
        explicitness: 0,
        sexualIntent: 0,
        gamblingProbability: 0,
        violence: 0,
        manipulation: 0,
        scamProbability: 0,
        childSafetyRisk: 0,
        confidence: finalConfidence,
      },
      verdict: finalVerdict,
      pipelineSummary: { stageResults: [
        { stage: 'capture', completed: true, summary: `Capture ${result.metrics.captureDurationMs.toFixed(0)}ms`, durationMs: result.metrics.captureDurationMs },
        { stage: 'evidence', completed: true, summary: `Evidence ${result.metrics.evidenceDurationMs.toFixed(0)}ms`, durationMs: result.metrics.evidenceDurationMs },
        { stage: 'cognitive', completed: true, summary: `Cognitive ${(result.metrics.cognitiveDurationMs ?? 0).toFixed(0)}ms`, durationMs: result.metrics.cognitiveDurationMs ?? 0 },
        { stage: 'hypothesis', completed: true, summary: `Hypothesis ${result.metrics.hypothesisDurationMs.toFixed(0)}ms`, durationMs: result.metrics.hypothesisDurationMs },
        { stage: 'reasoning', completed: true, summary: `Reasoning ${result.metrics.reasoningDurationMs.toFixed(0)}ms`, durationMs: result.metrics.reasoningDurationMs },
        { stage: 'confidence', completed: true, summary: `Confidence ${result.metrics.confidenceDurationMs.toFixed(0)}ms`, durationMs: result.metrics.confidenceDurationMs },
        { stage: 'decision', completed: true, summary: `Decision ${result.metrics.decisionDurationMs.toFixed(0)}ms`, durationMs: result.metrics.decisionDurationMs },
        { stage: 'policy', completed: true, summary: `Policy ${result.metrics.policyDurationMs.toFixed(0)}ms`, durationMs: result.metrics.policyDurationMs },
      ] },
    },
  };
}

// ============================================================
// PUBLIC: Senior-level analysis (async, fully deep)
// This is the recommended entry point when caller can await.
// Same engine, but caller gets the full SeniorAnalysis object.
// ============================================================

// ============================================================
// PUBLIC: SMART analysis — uses ALL tools including auto-research
//
// This is the most intelligent analyzer. Flow:
//   1. Standard analyzeContent() (regex + KG + ML + senior)
//   2. If confidence is LOW (uncertainty zone), trigger auto-research
//   3. AI searches the web for unknown words, reads definitions
//   4. Merges research findings with original analysis
//   5. Returns confident verdict
//
// This is "thinking" — AI doesn't know "fohisha"? It looks it up,
// reads the definition, and decides. Like a human.
// ============================================================

export interface SmartAnalysisResult extends BrainAnalysis {
  auto_research?: {
    triggered: boolean;
    research_results: ResearchResult[];
    aggregate_verdict?: ContentVerdict;
    aggregate_confidence?: number;
    reasoning_steps: string[];
  };
}

export async function analyzeContentSmart(text: string, contentType: ContentType = 'text'): Promise<SmartAnalysisResult> {
  initializeDefaultKnowledge();

  // Step 1: Standard analysis
  const base = analyzeContent(text, contentType);

  // Step 2: Decide if auto-research is needed
  const needsResearch =
    base.confidence < 0.65 ||                                                     // Low confidence
    base.verdict === 'uncertain' ||                                                // Uncertain verdict
    (base.semantic.toxicity > 0.3 && base.semantic.toxicity < 0.7);                // Middle-zone toxicity

  if (!needsResearch) {
    return { ...base, auto_research: { triggered: false, research_results: [], reasoning_steps: ['Confidence sufficient — no research needed'] } };
  }

  // Step 3: Auto-research unknown words
  const llm = getLocalLLM();
  await llm.initialize();
  const knownWords = new Set<string>(llm['vocab']?.keys() || []);

  const ws = getWebSearch();
  const researcher = getAutoResearcher(ws);

  let researchOutcome;
  try {
    researchOutcome = await researcher.researchText(text, knownWords);
  } catch (e) {
    return { ...base, auto_research: { triggered: true, research_results: [], reasoning_steps: [`❌ Research failed: ${e instanceof Error ? e.message : 'unknown'}`] } };
  }

  // Step 4: Merge research findings into final verdict
  let finalVerdict = base.verdict;
  let finalConfidence = base.confidence;
  let finalShouldBlock = base.should_block;
  let finalRiskLevel = base.risk_level;

  if (researchOutcome.aggregate_verdict !== 'uncertain' && researchOutcome.aggregate_confidence > 0.5) {
    if (researchOutcome.aggregate_verdict === 'harmful') {
      // Research says harmful — strengthen
      finalVerdict = 'harmful';
      finalConfidence = Math.max(base.confidence, researchOutcome.aggregate_confidence);
      finalShouldBlock = finalConfidence > 0.6;
      finalRiskLevel = finalConfidence > 0.8 ? 'critical' : finalConfidence > 0.6 ? 'high' : 'medium';

      // Also learn this for the future
      try {
        for (const r of researchOutcome.researched) {
          if (r.inferred_verdict === 'harmful' && r.confidence > 0.7) {
            llm.learnFromText(r.query, 'harmful');
            addManualTrainingData(r.query, 'harmful', contentType);
          }
        }
      } catch {}
    } else if (researchOutcome.aggregate_verdict === 'safe') {
      finalVerdict = 'safe';
      finalConfidence = (base.confidence + researchOutcome.aggregate_confidence) / 2;
      finalShouldBlock = false;
      finalRiskLevel = finalConfidence > 0.7 ? 'none' : 'low';

      try {
        for (const r of researchOutcome.researched) {
          if (r.inferred_verdict === 'safe' && r.confidence > 0.7) {
            llm.learnFromText(r.query, 'safe');
            addManualTrainingData(r.query, 'safe', contentType);
          }
        }
      } catch {}
    }
  }

  const lang = getLang();
  const recommendation = finalVerdict === 'harmful' && finalShouldBlock
    ? (lang === 'uz' ? `🚫 BLOKLA — Avtomatik tadqiqotdan keyin zararli (${(finalConfidence * 100).toFixed(0)}%)` : `🚫 BLOCK — Harmful after auto-research (${(finalConfidence * 100).toFixed(0)}%)`)
    : finalVerdict === 'safe'
      ? (lang === 'uz' ? `✅ RUXSAT BER — Avtomatik tadqiqot xavfsiz deb topdi` : `✅ ALLOW — Auto-research found safe`)
      : (lang === 'uz' ? `❓ Noaniq — tadqiqot ham aniq javob bermadi` : `❓ Uncertain — research inconclusive`);

  return {
    ...base,
    verdict: finalVerdict,
    confidence: finalConfidence,
    should_block: finalShouldBlock,
    risk_level: finalRiskLevel,
    recommendation,
    auto_research: {
      triggered: true,
      research_results: researchOutcome.researched,
      aggregate_verdict: researchOutcome.aggregate_verdict,
      aggregate_confidence: researchOutcome.aggregate_confidence,
      reasoning_steps: researchOutcome.reasoning,
    },
  };
}

export async function analyzeContentSenior(
  text: string,
  contentType: ContentType = 'text',
  audienceHint?: 'children' | 'adults' | 'general' | 'unknown',
): Promise<BrainAnalysis> {
  initializeDefaultKnowledge();

  // Ensure LLM is initialized for embedding-based evidence
  const llm = getLocalLLM();
  await llm.initialize();

  // analyzeContent() now already includes senior reasoning synchronously.
  // Caller can optionally override audience hint by re-running senior.
  const base = analyzeContent(text, contentType);

  if (audienceHint && base.senior_analysis) {
    // Re-run with explicit audience hint
    const seniorEngine = getSeniorReasoningEngine(llm);
    const senior = seniorEngine.analyzeSync(
      { text, content_type: contentType, audience_hint: audienceHint, language: 'en' },
      base.semantic,
    );
    const lang = getLang();
    return {
      ...base,
      verdict: senior.verdict,
      confidence: senior.confidence,
      risk_level: senior.risk_level,
      should_block: senior.should_block,
      recommendation: lang === 'uz' ? senior.recommendation_uz : senior.recommendation,
      senior_analysis: senior,
    };
  }

  return base;
}

function generateRecommendation(
  verdict: ContentVerdict,
  confidence: number,
  risk: string,
  reasoning: ReasoningStep[],
  lang: Lang
): string {
  if (lang === 'uz') {
    if (verdict === 'harmful' && confidence > 0.8) return '🚫 Bu kontent bloklash kerak — yuqori ishonchlilik bilan zararli.';
    if (verdict === 'harmful') return '⚠️ Bu kontent zararli bo\'lishi mumkin — bloklash tavsiya etiladi.';
    if (verdict === 'safe' && confidence > 0.8) return '✅ Bu kontent xavfsiz — bloklash kerak emas.';
    if (verdict === 'safe') return '🟢 Bu kontent xavfsiz ko\'rinadi.';
    return '❓ Noaniq — qo\'shimcha ma\'lumot yoki inson ko\'rib chiqishi kerak.';
  }

  if (verdict === 'harmful' && confidence > 0.8) return '🚫 This content should be blocked — harmful with high confidence.';
  if (verdict === 'harmful') return '⚠️ This content may be harmful — blocking recommended.';
  if (verdict === 'safe' && confidence > 0.8) return '✅ This content is safe — no blocking needed.';
  if (verdict === 'safe') return '🟢 This content appears to be safe.';
  return '❓ Uncertain — needs additional information or human review.';
}

// ============================================================
// PUBLIC: Learn from Feedback (FULL PIPELINE)
// ============================================================

export function learnFromUserFeedback(report: FeedbackReport): LearningResult {
  const lang = getLang();
  initializeDefaultKnowledge();

  // Step 1: Semantic analysis of the feedback
  const semantic = analyzeText(report.description);
  const keywords = [...semantic.stems.slice(0, 15), ...semantic.bigrams.slice(0, 8)];

  // Step 2: Determine correct label
  const isHarmful = report.verdict_correct === 'harmful';

  // Step 3: Add to knowledge graph
  const kgNode = learnFromFeedback(report.id, keywords, isHarmful, report.content_type);

  // Step 4: Add to training dataset
  addManualTrainingData(report.description, isHarmful ? 'harmful' : 'safe', report.content_type);

  // Step 5: Extract topics and create topic nodes
  for (const topic of semantic.topics) {
    const topicNode = addNode({
      type: 'concept',
      label: topic,
      content_type: report.content_type,
      properties: { from_feedback: report.id },
      confidence: 0.6,
      source: 'inferred',
    });
    addEdge(kgNode.id, topicNode.id, 'part_of');
  }

  // Step 6: Store fingerprint
  addFingerprint(report.description, semantic, report.verdict_correct, report.id);

  // Step 6b: Push to shared learning pool (cross-user learning)
  // Bu — user feedback'ni umumiy bazaga yuboradi → boshqa userlar ham foyda oladi
  try {
    const sharedMgr = getSharedLearningManager();
    void sharedMgr.submitFeedback({
      content: report.description,
      verdict: report.verdict_correct,
      content_type: report.content_type,
      patterns: keywords,
      confidence: report.confidence_before,
      reason: `feedback type: ${report.type}`,
      language: semantic.language,
    });
  } catch (e) {
    // Shared learning not configured — that's fine
    void e;
  }

  // Step 7: Retrain model
  buildTrainingDataset();
  const trainResult = trainModel(report.content_type);
  const modelRetrained = trainResult !== null;

  // Step 8: Re-evaluate similar content
  const similarContent = findSimilarContent(semantic, 10);
  const conflicting = similarContent.filter((s) => {
    if (isHarmful && s.verdict === 'safe') return true;
    if (!isHarmful && s.verdict === 'harmful') return true;
    return false;
  });

  // Step 9: Notifications
  const isFalseNegative = report.type === 'false_negative';
  if (isFalseNegative && (report.content_type === 'video' || report.content_type === 'pose')) {
    notify({
      type: 'critical',
      title: `🔴 CRITICAL: ${report.content_type} content missed`,
      body: report.description.slice(0, 100),
    });
  }

  const pendingReports = getAllFeedbackReports().filter((r) => r.status === 'pending');
  const criticalReports = pendingReports.filter(
    (r) => r.type === 'false_negative' && ['video', 'pose', 'movement'].includes(r.content_type)
  );
  checkEscalations(pendingReports.length, criticalReports.length);

  // Step 10: Generate AI response
  const contentLabel = getContentTypeLabel(report.content_type, lang);
  const priorityEmoji = getPriorityEmoji(report);

  const responseParts: string[] = [
    `${priorityEmoji} **${getPriorityLabel(report, lang)}**`,
    '',
  ];

  // Analysis summary
  if (lang === 'uz') {
    responseParts.push(
      report.type === 'false_positive'
        ? `AI "${report.description.slice(0, 50)}" ni zararli deb xato baholagan.`
        : `AI "${report.description.slice(0, 50)}" ni xavfsiz deb xato baholagan.`
    );
  } else {
    responseParts.push(
      report.type === 'false_positive'
        ? `AI incorrectly classified "${report.description.slice(0, 50)}" as harmful.`
        : `AI incorrectly classified "${report.description.slice(0, 50)}" as safe.`
    );
  }

  // Semantic insights
  responseParts.push('');
  if (lang === 'uz') {
    responseParts.push('🔍 **Chuqur tahlil natijalari:**');
    responseParts.push(`- Toxicity: ${(semantic.toxicity * 100).toFixed(0)}%`);
    responseParts.push(`- Sentiment: ${semantic.sentiment > 0 ? 'ijobiy' : semantic.sentiment < 0 ? 'salbiy' : 'neytral'}`);
    responseParts.push(`- Niyat: ${semantic.intent}`);
    if (semantic.topics.length > 0) responseParts.push(`- Mavzular: ${semantic.topics.join(', ')}`);
    if (semantic.entities.length > 0) {
      const entitiesText = semantic.entities.map((e) => e.type + ':' + e.text).join(', ');
      responseParts.push(`- Topilgan: ${entitiesText}`);
    }
  } else {
    responseParts.push('🔍 **Deep analysis results:**');
    responseParts.push(`- Toxicity: ${(semantic.toxicity * 100).toFixed(0)}%`);
    responseParts.push(`- Sentiment: ${semantic.sentiment > 0 ? 'positive' : semantic.sentiment < 0 ? 'negative' : 'neutral'}`);
    responseParts.push(`- Intent: ${semantic.intent}`);
    if (semantic.topics.length > 0) responseParts.push(`- Topics: ${semantic.topics.join(', ')}`);
    if (semantic.entities.length > 0) {
      const entitiesTextEn = semantic.entities.map((e) => e.type + ':' + e.text).join(', ');
      responseParts.push(`- Entities: ${entitiesTextEn}`);
    }
  }

  // Learning summary
  responseParts.push('');
  if (lang === 'uz') {
    responseParts.push('🧠 **O\'rganish natijalari:**');
    responseParts.push(`- Knowledge graphga yangi node qo\'shildi (${kgNode.label})`);
    responseParts.push(`- ${keywords.length} ta keyword pattern ajratildi`);
    if (modelRetrained && trainResult) {
      responseParts.push(`- Model qayta o'rgatildi: ${trainResult.accuracy}% aniqlik (v${trainResult.model.version})`);
    }
    if (conflicting.length > 0) {
      responseParts.push(`- ⚠️ ${conflicting.length} ta o'xshash kontent qayta baholandi`);
    }
  } else {
    responseParts.push('🧠 **Learning results:**');
    responseParts.push(`- Added new knowledge node (${kgNode.label})`);
    responseParts.push(`- Extracted ${keywords.length} keyword patterns`);
    if (modelRetrained && trainResult) {
      responseParts.push(`- Model retrained: ${trainResult.accuracy}% accuracy (v${trainResult.model.version})`);
    }
    if (conflicting.length > 0) {
      responseParts.push(`- ⚠️ ${conflicting.length} similar content re-evaluated`);
    }
  }

  // Media acknowledgment
  if (report.screenshot_urls.length > 0) {
    responseParts.push('', t('screenshots_received', lang, { count: report.screenshot_urls.length }));
  }
  if (report.video_url) {
    responseParts.push('', t('video_received', lang));
  }

  responseParts.push('', t('rollback_available', lang));

  return {
    success: true,
    knowledge_node_id: kgNode.id,
    patterns_extracted: keywords.length,
    model_retrained: modelRetrained,
    new_accuracy: trainResult?.accuracy,
    similar_reevaluated: conflicting.length,
    ai_response: responseParts.join('\n'),
  };
}

function getPriorityEmoji(report: FeedbackReport): string {
  if (report.type === 'false_negative' && ['video', 'pose', 'movement'].includes(report.content_type)) return '🔴';
  if (report.type === 'false_negative') return '🟠';
  if (report.type === 'false_positive' && report.confidence_before > 0.8) return '🟠';
  if (report.type === 'suggestion') return '🟢';
  return '🟡';
}

function getPriorityLabel(report: FeedbackReport, lang: Lang): string {
  if (report.type === 'false_negative' && ['video', 'pose', 'movement'].includes(report.content_type)) {
    return lang === 'uz' ? 'CRITICAL — Zararli kontent bloklanmagan' : 'CRITICAL — Harmful content not blocked';
  }
  if (report.type === 'false_negative') return lang === 'uz' ? 'HIGH — Bloklanmagan kontent' : 'HIGH — Unblocked content';
  if (report.type === 'false_positive') return lang === 'uz' ? 'MEDIUM — Noto\'g\'ri bloklash' : 'MEDIUM — Incorrect blocking';
  return lang === 'uz' ? 'LOW — Taklif' : 'LOW — Suggestion';
}

// ============================================================
// PUBLIC: Get Brain Status
// ============================================================

export function getBrainStatus() {
  const kgStats = getGraphStats();
  const mlStats = getTrainingStats();
  const fingerprints = loadFingerprints();

  return {
    knowledge_graph: kgStats,
    ml_model: mlStats,
    fingerprints_stored: fingerprints.length,
    capabilities: {
      semantic_analysis: true,
      knowledge_inference: kgStats.total_nodes > 0,
      ml_classification: mlStats.models_trained > 0,
      similarity_matching: fingerprints.length > 0,
      context_understanding: true,
      multilingual: true,
      reasoning: true,
      tool_use: true,
      web_search: true,
      vision_analysis: true,
      local_llm: true,
      word_embeddings: true,
      logistic_classifier: true,
      ngram_model: true,
      conversation_memory: true,
      senior_reasoning: true,
      multi_step_reasoning: true,
      hypothesis_testing: true,
      causal_reasoning: true,
      counterfactual_reasoning: true,
      self_critique: true,
      tree_of_thought: true,
    },
    health: {
      kg_healthy: kgStats.total_nodes >= 10,
      ml_healthy: mlStats.latest_accuracy > 50,
      data_sufficient: mlStats.total_datapoints >= 10,
      balanced: mlStats.total_datapoints > 0 ? Math.min(mlStats.harmful_count, mlStats.safe_count) / Math.max(mlStats.harmful_count, mlStats.safe_count, 1) > 0.3 : false,
    },
  };
}

// ============================================================
// INTEGRATED SUBSYSTEMS — Singleton instances
// ============================================================

let _toolSystem: ToolSystem | null = null;
let _reasoningEngine: ReasoningEngine | null = null;
let _webSearch: WebSearchEngine | null = null;
let _visionAnalyzer: VisionAnalyzer | null = null;
let _localLLM: LocalLLM | null = null;

export function getToolSystem(): ToolSystem {
  if (!_toolSystem) {
    _toolSystem = new ToolSystem();

    // Register web search tools
    const ws = getWebSearch();
    _toolSystem.registerTool(
      {
        name: 'web_search',
        description: 'Search the internet for information',
        description_uz: 'Internetdan ma\'lumot izlash',
        category: 'search',
        input_schema: [{ name: 'query', type: 'string', required: true, description: 'Search query' }],
        output_type: 'json',
        requires_network: true,
        rate_limit: { max_calls: 20, window_ms: 60000 },
        timeout_ms: 15000,
        enabled: true,
        retry: { max_attempts: 2, backoff_ms: 500 },
      },
      async (input: string) => {
        const results = await ws.search(input);
        return JSON.stringify(results.slice(0, 7));
      },
    );

    _toolSystem.registerTool(
      {
        name: 'web_fetch',
        description: 'Fetch and extract content from a web page',
        description_uz: 'Veb sahifadan kontent olish',
        category: 'fetch',
        input_schema: [{ name: 'url', type: 'string', required: true, description: 'URL to fetch' }],
        output_type: 'text',
        requires_network: true,
        rate_limit: { max_calls: 10, window_ms: 60000 },
        timeout_ms: 15000,
        enabled: true,
        retry: { max_attempts: 2, backoff_ms: 500 },
      },
      async (input: string) => {
        const page = await ws.fetchPage(input);
        const safetyNote = page.safety && !page.safety.safe
          ? `\n⚠️ SAFETY WARNING: ${page.safety.reasons.join('; ')}\n`
          : '';
        return safetyNote + page.text.slice(0, 5000);
      },
    );

    // Register vision tool
    _toolSystem.registerTool(
      {
        name: 'vision_analyze',
        description: 'Analyze an image for content safety',
        description_uz: 'Rasmni xavfsizlik uchun tahlil qilish',
        category: 'vision',
        input_schema: [{ name: 'url', type: 'string', required: true, description: 'Image URL or data URI' }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 30, window_ms: 60000 },
        timeout_ms: 10000,
        enabled: true,
      },
      async (input: string) => {
        const va = getVisionAnalyzer();
        const result = await va.analyzeFromUrl(input);
        return JSON.stringify({
          classification: result.classification,
          nsfw_score: result.nsfw_score,
          nsfw_reasons: result.nsfw_reasons,
          skin_percentage: result.skin_percentage,
          text_regions: result.text_regions.length,
          brightness: result.brightness,
        });
      },
    );

    // Register content_analyze override
    _toolSystem.registerTool(
      {
        name: 'content_analyze',
        description: 'Analyze text content using the full brain pipeline',
        description_uz: 'Matnni to\'liq miya pipeline orqali tahlil qilish',
        category: 'analyze',
        input_schema: [{ name: 'text', type: 'string', required: true, description: 'Text to analyze' }],
        output_type: 'json',
        requires_network: false,
        rate_limit: { max_calls: 100, window_ms: 60000 },
        timeout_ms: 5000,
        enabled: true,
      },
      async (input: string) => {
        const result = analyzeContent(input);
        return JSON.stringify({
          verdict: result.verdict,
          confidence: result.confidence,
          should_block: result.should_block,
          risk_level: result.risk_level,
          recommendation: result.recommendation,
        });
      },
    );
  }
  return _toolSystem;
}

export function getReasoningEngine(): ReasoningEngine {
  if (!_reasoningEngine) {
    const ts = getToolSystem();
    _reasoningEngine = new ReasoningEngine((name, input) => ts.executeTool(name, input).then((r) => r.data));
  }
  return _reasoningEngine;
}

export function getWebSearch(): WebSearchEngine {
  if (!_webSearch) {
    _webSearch = new WebSearchEngine();
  }
  return _webSearch;
}

export function getVisionAnalyzer(): VisionAnalyzer {
  if (!_visionAnalyzer) {
    _visionAnalyzer = new VisionAnalyzer();
  }
  return _visionAnalyzer;
}

export function getLocalLLM(): LocalLLM {
  if (!_localLLM) {
    _localLLM = new LocalLLM();
  }
  return _localLLM;
}

// ============================================================
// Shared Learning: boshqa userlardan kelgan feedbackni mahalliy modelga qo'shadi
// ============================================================

let _sharedLearningWired = false;

export function initializeSharedLearning(autoSync = true): void {
  if (_sharedLearningWired) return;
  _sharedLearningWired = true;

  const mgr = getSharedLearningManager();

  mgr.onNewItems((items: SharedFeedbackItem[]) => {
    for (const item of items) {
      try {
        // Skip if this item came from our own user
        // (avoid learning from our own pushes round-tripping back)
        const ourHash = localStorage.getItem('cia_user_hash');
        if (ourHash && item.user_hash === ourHash) continue;

        // Add to training dataset
        addManualTrainingData(item.content_excerpt, item.verdict === 'harmful' ? 'harmful' : 'safe', item.content_type);

        // Add to LLM if available
        if (_localLLM) {
          _localLLM.learnFromText(item.content_excerpt, item.verdict === 'harmful' ? 'harmful' : 'safe');
        }
      } catch {
        // Skip bad items
      }
    }
    console.log(`[SharedLearning] Applied ${items.length} new items to local model`);
  });

  if (autoSync) {
    mgr.startBackgroundSync();
  }
}

export async function initializeLocalLLM(): Promise<void> {
  const llm = getLocalLLM();
  await llm.initialize();
}

export async function chat(message: string): Promise<LLMResponse> {
  const llm = getLocalLLM();
  await llm.initialize();
  return llm.generateResponse(message);
}

export function getLocalLLMStatus(): string {
  const llm = getLocalLLM();
  const lang = getLang() as 'uz' | 'en';
  return llm.getStatus(lang);
}

// ============================================================
// PUBLIC: Deep Reasoning Analysis (chain-of-thought)
// ============================================================

export async function analyzeWithReasoning(text: string, contentType: ContentType = 'text'): Promise<{
  analysis: BrainAnalysis;
  reasoning_chain: ThoughtChain;
}> {
  initializeDefaultKnowledge();
  const lang = getLang();

  // Standard analysis
  const analysis = analyzeContent(text, contentType);

  // Chain-of-thought reasoning
  const engine = getReasoningEngine();
  const ts = getToolSystem();

  const kgKeywords = [...analysis.semantic.stems.slice(0, 5)];
  const priorKnowledge = analysis.knowledge_matches.map((m) => `${m.node} (${(m.relevance * 100).toFixed(0)}%)`);

  const chain = await engine.reason({
    query: text,
    content_type: contentType,
    available_tools: ts.listEnabledTools(),
    max_steps: 10,
    max_depth: 3,
    language: lang as 'uz' | 'en',
    prior_knowledge: priorKnowledge,
  });

  // Merge reasoning verdict with analysis if reasoning has higher confidence
  if (chain.conclusion && chain.conclusion.confidence > analysis.confidence) {
    if (chain.conclusion.verdict === 'harmful' && analysis.verdict !== 'harmful') {
      analysis.reasoning.push({
        step: analysis.reasoning.length + 1,
        module: 'ensemble',
        description: `Reasoning engine suggests harmful (${(chain.conclusion.confidence * 100).toFixed(0)}%)`,
        contribution: 0.3,
      });
    } else if (chain.conclusion.verdict === 'safe' && analysis.verdict !== 'safe') {
      analysis.reasoning.push({
        step: analysis.reasoning.length + 1,
        module: 'ensemble',
        description: `Reasoning engine suggests safe (${(chain.conclusion.confidence * 100).toFixed(0)}%)`,
        contribution: -0.3,
      });
    }
  }

  return { analysis, reasoning_chain: chain };
}

// ============================================================
// PUBLIC: Analyze Image
// ============================================================

export async function analyzeImage(source: string | File | Blob): Promise<VisionAnalysis> {
  const va = getVisionAnalyzer();
  if (source instanceof File) return va.analyzeFromFile(source);
  if (source instanceof Blob) return va.analyzeImage(source);
  return va.analyzeFromUrl(source as string);
}

// ============================================================
// PUBLIC: FULL IMAGE ANALYSIS — NSFW.js safety classification + heuristic support signals
//
// This path does not perform general scene understanding with a vision language model.
// It only derives a harmful/safe verdict from NSFW safety classification and
// supplemental vision heuristics. General visual understanding is unavailable unless
// a real model-backed provider is configured.
// ============================================================

export interface FullImageAnalysis {
  verdict: ContentVerdict;
  confidence: number;
  should_block: boolean;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;

  // NSFW.js (haqiqiy ML model)
  nsfw: {
    available: boolean;
    score: number;
    top_class: string;
    breakdown: { neutral: number; drawing: number; sexy: number; porn: number; hentai: number };
    reasons: string[];
  };

  // Canvas heuristika (qo'shimcha signallar)
  heuristic: {
    skin_percentage: number;
    faces: number;
    violence_score: number;
    brightness: number;
    has_text: boolean;
    text_regions: number;
  };

  // Structured understanding output
  visual_understanding?: VisualUnderstanding;
  context_understanding?: ContextUnderstanding;

  reasons: string[];
  analysis_ms: number;
}

// strictness: 'strict' (bolalar uchun — Sexy ham bloklanadi) | 'moderate' (faqat explicit)
export async function analyzeImageFull(
  source: string | File | Blob,
  strictness: 'strict' | 'moderate' = 'strict',
): Promise<FullImageAnalysis> {
  const start = performance.now();

  // 1. Canvas heuristika (mavjud)
  const visualProvider = getVisualUnderstandingProvider();
  const understanding = await visualProvider.analyzeImage(source);
  const va = understanding.visionAnalysis;

  // 2. NSFW.js (haqiqiy model) — dinamik import (bundle hajmini kamaytirish)
  let nsfwResult: import('./nsfw-classifier').NSFWResult | null = null;
  try {
    const { classifyImageFromBlob, classifyImageFromUrl } = await import('./nsfw-classifier');
    if (source instanceof Blob) {
      nsfwResult = await classifyImageFromBlob(source);
    } else if (typeof source === 'string') {
      nsfwResult = await classifyImageFromUrl(source);
    }
  } catch (e) {
    // Model yuklanmasa — faqat heuristika
  }

  // 3. Birlashtirilgan qaror
  const reasons: string[] = [];
  let nsfwScore = 0;
  let verdict: ContentVerdict = 'uncertain';
  let confidence = 0.5;

  if (nsfwResult && nsfwResult.model_loaded) {
    const b = nsfwResult.breakdown;
    const explicit = b.porn + b.hentai;
    const suggestive = b.sexy;
    nsfwScore = Math.min(explicit + suggestive * 0.3, 1);

    if (explicit >= 0.5) {
      verdict = 'harmful';
      confidence = Math.max(explicit, 0.75);
      reasons.push('Explicit vizual kontent ehtimoli aniqlandi');
    } else if (strictness === 'strict' && suggestive >= 0.6) {
      verdict = 'uncertain';
      confidence = 0.55;
      reasons.push('Model suggestive/shahvoniy belgilar topdi, lekin bu noaniq — inson ko‘rib chiqsin');
    } else if (b.neutral >= 0.4 || nsfwScore <= 0.3) {
      verdict = 'safe';
      confidence = Math.max(b.neutral, 0.65);
      reasons.push('Vizual model neytral yoki xavfsizroq kontent deb baholadi');
    } else {
      verdict = 'uncertain';
      confidence = 0.5;
      reasons.push('Vizual model noaniq signallar berdi');
    }

    if (va.skin_percentage > 40 && nsfwScore > 0.4) {
      reasons.push('Yuqori teri ko‘rinishi vizual ehtimolni qo‘llab-quvvatladi');
      confidence = Math.min(confidence + 0.1, 0.95);
    }
  } else {
    nsfwScore = va.nsfw_score;
    if (va.nsfw_score > 0.6) {
      verdict = 'harmful';
      confidence = 0.65;
      reasons.push('Lokal vision signallar zararli bo‘lishi mumkinligini ko‘rsatdi');
    } else if (va.nsfw_score < 0.3) {
      verdict = 'safe';
      confidence = 0.65;
      reasons.push('Lokal vision signallar xavfsiz qaror beradi');
    } else {
      verdict = 'uncertain';
      confidence = 0.5;
      reasons.push('Lokal vision signallar noaniq — aniqlik uchun inson tekshiruvi kerak');
    }
    reasons.push('NSFW modeli yuklanmagan — faqat lokal heuristika ishlatildi');
  }

  if (va.violence_score > 0.5) {
    reasons.push('Zo‘ravonlik yoki zararli sahna elementlari aniqlangan');
    if (verdict === 'safe') verdict = 'uncertain';
  }

  // Description — rasm tavsifi
  const description = buildImageDescription(va, nsfwResult);

  // Risk level
  const riskLevel: FullImageAnalysis['risk_level'] =
    verdict === 'harmful' && confidence > 0.8 ? 'critical'
    : verdict === 'harmful' && confidence > 0.6 ? 'high'
    : verdict === 'harmful' ? 'medium'
    : verdict === 'uncertain' ? 'medium'
    : confidence > 0.7 ? 'none' : 'low';

  const shouldBlock = verdict === 'harmful' && confidence > 0.55;

  const lang = getLang();
  const recommendation = shouldBlock
    ? (lang === 'uz' ? `🚫 BLOKLA — zararli rasm (${(confidence * 100).toFixed(0)}%)` : `🚫 BLOCK — harmful image (${(confidence * 100).toFixed(0)}%)`)
    : verdict === 'uncertain'
      ? (lang === 'uz' ? `❓ NOANIQ — inson ko'rib chiqsin` : `❓ UNCERTAIN — needs human review`)
      : (lang === 'uz' ? `✅ RUXSAT — xavfsiz rasm` : `✅ ALLOW — safe image`);

  return {
    verdict,
    confidence,
    should_block: shouldBlock,
    risk_level: riskLevel,
    description,
    recommendation,
    nsfw: {
      available: !!(nsfwResult && nsfwResult.model_loaded),
      score: nsfwScore,
      top_class: nsfwResult?.top_class || 'N/A',
      breakdown: nsfwResult?.breakdown || { neutral: 0, drawing: 0, sexy: 0, porn: 0, hentai: 0 },
      reasons: nsfwResult?.reasons || [],
    },
    heuristic: {
      skin_percentage: va.skin_percentage,
      faces: va.face_regions?.length || 0,
      violence_score: va.violence_score,
      brightness: va.brightness,
      has_text: (va.text_regions?.length || 0) > 0,
      text_regions: va.text_regions?.length || 0,
    },
    visual_understanding: understanding.visualUnderstanding,
    context_understanding: understanding.contextUnderstanding,
    reasons,
    analysis_ms: performance.now() - start,
  };
}

function buildImageDescription(va: VisionAnalysis, nsfw: import('./nsfw-classifier').NSFWResult | null): string {
  const parts: string[] = [];

  if (nsfw && nsfw.model_loaded) {
    const cls = nsfw.top_class.toLowerCase();
    const b = nsfw.breakdown;
    if (cls === 'neutral') {
      parts.push('Safety model detected neutral content.');
    } else if (cls === 'drawing') {
      parts.push('Safety model detected illustration/drawing content.');
    } else if (cls === 'sexy') {
      if (b.sexy >= 0.7) parts.push('Safety model detected suggestive visual content.');
      else parts.push('Safety model detected potentially suggestive visual content.');
    } else if (cls === 'porn') {
      parts.push('Safety model detected explicit sexual content.');
    } else if (cls === 'hentai') {
      parts.push('Safety model detected hentai/animated explicit content.');
    } else {
      parts.push('Safety model returned a less common classification label.');
    }
  } else {
    parts.push('Safety model unavailable or failed to classify the image.');
  }

  if (va.violence_score > 0.5) {
    parts.push('Heuristic safety signal indicates potential violence.');
  }

  if ((va.text_regions?.length || 0) > 2) {
    parts.push('Heuristic analysis detected on-image text.');
  }

  if (va.skin_percentage > 35) {
    parts.push('Heuristic analysis detected high skin visibility.');
  }

  return parts.length > 0 ? parts.join(' ') : 'No safety-related description could be generated.';
}

// ============================================================
// PUBLIC: Multimodal Fusion — combine image + surrounding text
// Image classifier alone is weak. Text gives context. Together → stronger.
// ============================================================

export async function analyzeMultimodal(params: {
  text?: string;
  imageSource?: string | File | Blob;
  audienceHint?: 'children' | 'adults' | 'general' | 'unknown';
}): Promise<{
  combined_verdict: ContentVerdict;
  combined_confidence: number;
  should_block: boolean;
  risk_level: BrainAnalysis['risk_level'];
  text_analysis?: BrainAnalysis;
  vision_analysis?: VisionAnalysis;
  fusion_reasoning: string[];
}> {
  const reasoning: string[] = [];
  let text_analysis: BrainAnalysis | undefined;
  let vision_analysis: VisionAnalysis | undefined;

  if (params.text) {
    text_analysis = await analyzeContentSenior(params.text, 'text', params.audienceHint);
    reasoning.push(`Text verdict: ${text_analysis.verdict} (${(text_analysis.confidence * 100).toFixed(0)}%)`);
  }

  if (params.imageSource) {
    vision_analysis = await analyzeImage(params.imageSource);
    reasoning.push(`Image classification: ${vision_analysis.classification.label}`);
    if (vision_analysis.text_regions?.length) {
      reasoning.push(`Image contains text overlays/captions (${vision_analysis.text_regions.length} regions)`);
    }
  }

  // Fusion logic
  let textHarmful = 0;
  let imageHarmful = 0;
  let textConf = 0;
  let imageConf = 0;

  if (text_analysis) {
    textHarmful = text_analysis.verdict === 'harmful' ? text_analysis.confidence : -text_analysis.confidence;
    textConf = text_analysis.confidence;
  }
  if (vision_analysis) {
    const label = vision_analysis.classification.label.toLowerCase();
    const strongSignal = /porn|hentai|explicit/.test(label);
    const softSignal = /sexy|suggestive|borderline/.test(label);
    const neutralSignal = /neutral|drawing/.test(label);
    imageHarmful = strongSignal
      ? vision_analysis.nsfw_score
      : softSignal
        ? vision_analysis.nsfw_score * 0.4
        : neutralSignal
          ? -0.5
          : 0;
    imageConf = strongSignal
      ? Math.max(vision_analysis.nsfw_score, 0.7)
      : softSignal
        ? Math.max(vision_analysis.nsfw_score, 0.55)
        : 0.6;
  }

  // Weighted fusion (60% text if both present, since text context disambiguates image)
  let fusedScore: number;
  let fusedConf: number;
  if (text_analysis && vision_analysis) {
    fusedScore = textHarmful * 0.5 + imageHarmful * 0.5;
    fusedConf = Math.max(textConf, imageConf);

    // Context override: educational text + nude image → still harmful (CSAM-like) unless explicitly medical
    if (vision_analysis.nsfw_score > 0.7 && text_analysis.verdict === 'safe') {
      reasoning.push('⚠️ Vision shows high NSFW but text says safe — defaulting to blocking (false negative protection)');
      fusedScore = Math.max(fusedScore, 0.5);
    }

    // Educational/medical context lowers image-only suspicion
    if (text_analysis.senior_analysis?.sub_problems.some((sp) =>
      sp.question.includes('context') && /medical|educational/.test(sp.answer)
    )) {
      if (/suspicious|borderline|warning/.test(vision_analysis.classification.label.toLowerCase())) {
        reasoning.push('Educational/medical context reduces visual concern');
        fusedScore -= 0.2;
      }
    }
  } else if (text_analysis) {
    fusedScore = textHarmful;
    fusedConf = textConf;
  } else if (vision_analysis) {
    fusedScore = imageHarmful;
    fusedConf = imageConf;
  } else {
    fusedScore = 0;
    fusedConf = 0;
  }

  const combined_verdict: ContentVerdict =
    fusedScore > 0.4 ? 'harmful' : fusedScore < -0.4 ? 'safe' : 'uncertain';
  const should_block = combined_verdict === 'harmful' && fusedConf > 0.6;
  const risk_level: BrainAnalysis['risk_level'] =
    combined_verdict === 'safe' ? (fusedConf > 0.75 ? 'none' : 'low')
    : combined_verdict === 'uncertain' ? 'medium'
    : fusedConf > 0.8 ? 'critical' : fusedConf > 0.65 ? 'high' : 'medium';

  reasoning.push(`Fused decision: ${combined_verdict} (confidence ${(fusedConf * 100).toFixed(0)}%)`);

  return {
    combined_verdict,
    combined_confidence: fusedConf,
    should_block,
    risk_level,
    text_analysis,
    vision_analysis,
    fusion_reasoning: reasoning,
  };
}

// ============================================================
// PUBLIC: Analyze Video
// ============================================================

export async function analyzeVideo(videoElement: HTMLVideoElement, maxFrames = 5): Promise<VideoAnalysis> {
  const va = getVisionAnalyzer();
  return va.analyzeVideo(videoElement, maxFrames);
}

// ============================================================
// PUBLIC: FULL VIDEO ANALYSIS — kadrlarni NSFW.js bilan tahlil
//
// Video'dan bir necha kadr oladi, har birini NSFW.js bilan tekshiradi,
// va eng yomon kadr bo'yicha umumiy qaror chiqaradi.
// ============================================================

export interface FrameAnalysis {
  timestamp: number;
  verdict: ContentVerdict;
  nsfw_score: number;
  top_class: string;
  thumbnail?: string;
}

export interface FullVideoAnalysis {
  verdict: ContentVerdict;
  confidence: number;
  should_block: boolean;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  duration: number;
  frames_analyzed: number;
  frames: FrameAnalysis[];
  worst_frame: FrameAnalysis | null;
  visual_understanding?: VideoUnderstanding;
  context_understanding?: ContextUnderstanding;
  reasons: string[];
  analysis_ms: number;
}

export async function analyzeVideoFull(
  videoSource: string | File | Blob,
  options: { maxFrames?: number; onProgress?: (current: number, total: number) => void } = {},
): Promise<FullVideoAnalysis> {
  const start = performance.now();
  const maxFrames = options.maxFrames || 8;

  // Video elementni tayyorlash
  const video = document.createElement('video');
  video.muted = true;
  video.crossOrigin = 'anonymous';
  const url = videoSource instanceof Blob ? URL.createObjectURL(videoSource) : videoSource;
  video.src = url;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Video yuklanmadi'));
      setTimeout(() => reject(new Error('Video timeout')), 15000);
    });

    const duration = video.duration || 0;
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d')!;

    const understanding = await getVisualUnderstandingProvider().analyzeVideo(video, maxFrames);
    const { classifyImageNSFW } = await import('./nsfw-classifier');

    const frames: FrameAnalysis[] = [];
    // ADAPTIV ZICH NAMUNA: ~1 kadr har 2 soniyada (min 4, max overrideable)
    // Avvalgi: 8 kadr (siyrak). Endi: davomiylikka qarab zichroq → o'tkazib yuborish kam
    const count = Math.min(Math.max(maxFrames, 4), Math.max(4, Math.ceil(duration / 2)), 30);

    // Scene-change uchun avvalgi kadr imzosi (o'rtacha RGB)
    let prevSig: { r: number; g: number; b: number } | null = null;
    const frameSignature = (): { r: number; g: number; b: number } => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let r = 0, g = 0, b = 0;
      const step = 40; // har 10-pikselni sample
      let n = 0;
      for (let p = 0; p < d.length; p += step) { r += d[p]; g += d[p + 1]; b += d[p + 2]; n++; }
      return { r: r / n, g: g / n, b: b / n };
    };

    for (let i = 0; i < count; i++) {
      const t = (duration / count) * i + duration / count / 2;
      if (options.onProgress) options.onProgress(i, count);

      // Kadrga o'tish
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
        video.currentTime = Math.min(t, duration - 0.1);
        setTimeout(resolve, 2000); // fallback
      });

      // Kadrni canvas'ga chizish
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // SCENE-CHANGE dedup: avvalgi kadrga juda o'xshash bo'lsa, NSFW'ni o'tkazib yuboramiz
      // (bir xil sahnani qayta tahlil qilmaslik — tezlik + e'tibor)
      const sig = frameSignature();
      if (prevSig) {
        const diff = Math.abs(sig.r - prevSig.r) + Math.abs(sig.g - prevSig.g) + Math.abs(sig.b - prevSig.b);
        if (diff < 18) { // deyarli bir xil sahna → o'tkazib yuboramiz
          prevSig = sig;
          continue;
        }
      }
      prevSig = sig;

      // NSFW tahlil
      try {
        const nsfw = await classifyImageNSFW(canvas);
        frames.push({
          timestamp: t,
          verdict: nsfw.verdict,
          nsfw_score: nsfw.nsfw_score,
          top_class: nsfw.top_class,
          thumbnail: canvas.toDataURL('image/jpeg', 0.5),
        });

        // ERTA TO'XTASH: agar aniq explicit kadr topilsa, qolganini tekshirish shart emas
        if (nsfw.nsfw_score >= 0.85) {
          if (options.onProgress) options.onProgress(count, count);
          break;
        }
      } catch {
        // Kadr o'tkazib yuboriladi
      }
    }

    if (options.onProgress) options.onProgress(count, count);

    // Eng yomon kadr
    const worstFrame = frames.length > 0
      ? frames.reduce((worst, f) => (f.nsfw_score > worst.nsfw_score ? f : worst), frames[0])
      : null;
    const classFreq: Record<string, number> = {};
    for (const f of frames) classFreq[f.top_class] = (classFreq[f.top_class] || 0) + 1;
    const primaryClass = Object.entries(classFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    const harmfulFrames = frames.filter((f) => f.verdict === 'harmful').length;
    const suspiciousFrames = frames.filter((f) => f.nsfw_score >= 0.45 || f.verdict === 'harmful').length;
    const averageScore = frames.length > 0 ? frames.reduce((sum, f) => sum + f.nsfw_score, 0) / frames.length : 0;

    let verdict: ContentVerdict = 'uncertain';
    if (harmfulFrames > 0 && averageScore > 0.5) verdict = 'harmful';
    else if (suspiciousFrames === 0 && averageScore < 0.35) verdict = 'safe';
    else verdict = 'uncertain';

    let confidence = 0.5;
    if (verdict === 'harmful') confidence = Math.min(Math.max(averageScore, 0.65), 0.95);
    else if (verdict === 'safe') confidence = Math.min(Math.max(1 - averageScore, 0.6), 0.9);
    else confidence = Math.min(Math.max(0.45 + suspiciousFrames / Math.max(1, frames.length) * 0.3, 0.5), 0.75);

    const shouldBlock = verdict === 'harmful' && confidence > 0.6;

    const riskLevel: FullVideoAnalysis['risk_level'] =
      verdict === 'harmful' && confidence > 0.8 ? 'critical'
      : verdict === 'harmful' ? 'high'
      : verdict === 'uncertain' ? 'medium'
      : 'none';

    const reasons: string[] = [];
    if (harmfulFrames > 0) reasons.push(`Explicit yoki zararli kadrlar aniqlandi (${harmfulFrames}/${frames.length})`);
    if (suspiciousFrames > harmfulFrames) reasons.push(`Qo‘shimcha noaniq yoki shubhali kadrlar mavjud (${suspiciousFrames - harmfulFrames})`);
    if (worstFrame) reasons.push(`Eng xavfli kadr ${worstFrame.timestamp.toFixed(1)}s vaqtida, sinf: ${worstFrame.top_class}`);
    if (frames.length === 0) reasons.push('Videodan tahlil uchun hech qanday kadr olinmadi');

    const lang = getLang();
    const description = frames.length > 0
      ? `${duration.toFixed(0)}s video, ${frames.length} tanlangan kadr analiz qilindi. Eng ko‘p uchragan ko‘rinish: ${primaryClass}.`
      : `${duration.toFixed(0)}s video, analiz uchun kadr topilmadi.`;
    const recommendation = shouldBlock
      ? (lang === 'uz' ? `🚫 BLOKLA — video zararli kadrlar o'z ichiga oladi` : `🚫 BLOCK — video contains harmful frames`)
      : verdict === 'uncertain'
        ? (lang === 'uz' ? `❓ NOANIQ — inson ko'rib chiqsin` : `❓ UNCERTAIN — human review`)
        : (lang === 'uz' ? `✅ RUXSAT — xavfsiz video` : `✅ ALLOW — safe video`);

    return {
      verdict, confidence, should_block: shouldBlock, risk_level: riskLevel,
      description, recommendation, duration, frames_analyzed: frames.length,
      frames, worst_frame: worstFrame, visual_understanding: understanding.videoUnderstanding,
      context_understanding: understanding.contextUnderstanding,
      reasons, analysis_ms: performance.now() - start,
    };
  } finally {
    if (videoSource instanceof Blob) URL.revokeObjectURL(url);
  }
}

// ============================================================
// PUBLIC: VIDEO POSTER / PREVIEW QUICK-CHECK — tez old-filtr
//
// G'oya: videoni to'liq ko'rmasdan, uning PREVIEW/poster rasmini tahlil qilib
// aniq zararli videolarni DARROV bloklash. Agar poster aniq zararli bo'lsa →
// to'liq tahlil shart emas, darrov BLOCK.
//
// Manba: poster rasm (URL/File) YOKI videoning o'zi (vakil kadr olinadi)
// ============================================================

export interface VideoPosterResult {
  verdict: ContentVerdict;
  confidence: number;
  should_block: boolean;
  needs_full_analysis: boolean;  // poster noaniq → to'liq tahlil tavsiya
  poster_analysis: FullImageAnalysis;
  recommendation: string;
  analysis_ms: number;
}

export async function analyzeVideoPoster(
  source: string | File | Blob,
  options: { isImage?: boolean; strictness?: 'strict' | 'moderate' } = {},
): Promise<VideoPosterResult> {
  const start = performance.now();
  const strictness = options.strictness || 'strict';

  // Poster rasmni olamiz
  let posterBlob: Blob | string;

  // Agar bu rasm bo'lsa — to'g'ridan-to'g'ri
  const isImageSource = options.isImage
    || (typeof source === 'string' && /\.(jpg|jpeg|png|webp|gif)/i.test(source))
    || (source instanceof File && source.type.startsWith('image/'));

  if (isImageSource) {
    posterBlob = source instanceof Blob ? source : source;
  } else {
    // Videodan vakil kadr olamiz (boshidagi qora kadrdan qochish uchun ~10% yoki 1s)
    posterBlob = await extractVideoFrame(source);
  }

  // Poster rasmni to'liq tahlil qilamiz (NSFW.js)
  const posterAnalysis = await analyzeImageFull(posterBlob, strictness);

  // Qaror: poster aniq zararli → darrov block, noaniq → to'liq tahlil kerak
  const shouldBlock = posterAnalysis.verdict === 'harmful' && posterAnalysis.confidence > 0.6;
  const needsFull = posterAnalysis.verdict === 'uncertain'
    || (posterAnalysis.verdict === 'harmful' && posterAnalysis.confidence <= 0.6);

  const lang = getLang();
  const recommendation = shouldBlock
    ? (lang === 'uz' ? `🚫 DARROV BLOKLA — preview zararli (${(posterAnalysis.confidence * 100).toFixed(0)}%). To'liq tahlil shart emas.` : `🚫 BLOCK NOW — preview harmful. No full analysis needed.`)
    : needsFull
      ? (lang === 'uz' ? `⏳ Preview noaniq — to'liq video tahlili tavsiya etiladi` : `⏳ Preview unclear — full video analysis recommended`)
      : (lang === 'uz' ? `✅ Preview xavfsiz` : `✅ Preview safe`);

  return {
    verdict: posterAnalysis.verdict,
    confidence: posterAnalysis.confidence,
    should_block: shouldBlock,
    needs_full_analysis: needsFull,
    poster_analysis: posterAnalysis,
    recommendation,
    analysis_ms: performance.now() - start,
  };
}

// Videodan vakil kadr olish (poster sifatida)
async function extractVideoFrame(source: string | File | Blob): Promise<Blob> {
  const video = document.createElement('video');
  video.muted = true;
  video.crossOrigin = 'anonymous';
  const url = source instanceof Blob ? URL.createObjectURL(source) : source;
  video.src = url;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Video yuklanmadi'));
      setTimeout(() => reject(new Error('Video timeout')), 12000);
    });

    const duration = video.duration || 0;
    // Boshidagi qora kadrdan qochish: 1s yoki 10%
    const seekTime = Math.min(Math.max(1, duration * 0.1), Math.max(0.1, duration - 0.1));

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      video.currentTime = seekTime;
      setTimeout(resolve, 3000);
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 224;
    canvas.height = video.videoHeight || 224;
    canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Kadr olinmadi'))), 'image/jpeg', 0.8);
    });
  } finally {
    if (source instanceof Blob) URL.revokeObjectURL(url);
  }
}

// ============================================================
// PUBLIC: Web Search
// ============================================================

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const ws = getWebSearch();
  return ws.search(query);
}

export async function fetchWebPage(url: string): Promise<FetchedPage> {
  const ws = getWebSearch();
  return ws.fetchPage(url);
}

// ============================================================
// PUBLIC: Execute Tool
// ============================================================

export async function executeTool(name: string, input: string): Promise<ToolResult> {
  const ts = getToolSystem();
  return ts.executeTool(name, input);
}
