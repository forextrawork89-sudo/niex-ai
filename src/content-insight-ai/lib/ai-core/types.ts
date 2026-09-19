import type { KBBuilderResult } from '../kb-builder/types';
import type { VisionAnalysis, VideoAnalysis } from '../vision-analyzer';

export type ContentType = 'text' | 'image' | 'video' | 'audio' | 'mixed' | 'unknown';
export type AiCoreAction = 'allow' | 'warn' | 'blur' | 'block' | 'request_more_analysis' | 'inspect';
export type EvidenceModality = 'text' | 'vision' | 'audio' | 'metadata' | 'unknown';
export type EvidenceDirection = 'supports' | 'contradicts' | 'neutral';
export type Verdict = 'harmful' | 'safe' | 'uncertain';

export interface TranscriptionData {
  transcript?: string;
  language?: string;
  confidence?: number;
  segments?: TranscriptSegment[];
  speakers?: string[];
  metadata?: Record<string, unknown>;
}

export interface TranscriptSegment {
  text: string;
  startTime?: number;
  endTime?: number;
  speaker?: string;
  confidence?: number;
}

export interface VisualObjectDescriptor {
  label: string;
  purpose: string;
  confidence: number;
}

export interface VisualUnderstanding {
  natural_language_summary: string;
  summary: string;
  scene: string;
  environment: string;
  objects: VisualObjectDescriptor[];
  object_purposes: Array<{ label: string; purpose: string }>;
  people_count: number;
  people_present: boolean;
  activities: string[];
  relationships: string[];
  visual_context: string;
  safety_relevant_content: string[];
  confidence: number;
  source: 'heuristic' | 'model' | 'unavailable';
  source_hint: string;
}

export interface VideoUnderstanding {
  summary: string;
  scenes: string[];
  persistent_objects: string[];
  activities: string[];
  movement_summary: string;
  camera_behavior: string;
  visual_context: string;
  temporal_signals: string[];
  safety_relevant_changes: string[];
  people_count: number;
  people_present: boolean;
  confidence: number;
  source: 'heuristic' | 'model' | 'unavailable';
}

export interface ContextUnderstanding {
  scene_type: string;
  content_type: string;
  person_present: boolean;
  person_activity: string;
  clothing_context: string;
  camera_focus: string;
  suggestive_context: boolean;
  educational_context: boolean;
  sports_context: boolean;
  ordinary_content: boolean;
  uncertainty: number;
  rationale: string;
}

export interface VisualUnderstandingResult {
  visionAnalysis: VisionAnalysis;
  visualUnderstanding: VisualUnderstanding;
  contextUnderstanding: ContextUnderstanding;
  visual_understanding_available: boolean;
}

export interface VideoUnderstandingResult {
  videoAnalysis: VideoAnalysis;
  videoUnderstanding: VideoUnderstanding;
  contextUnderstanding: ContextUnderstanding;
  visual_understanding_available: boolean;
}

export interface VisualUnderstandingProvider {
  source: 'heuristic' | 'model';
  analyzeImage(source: string | HTMLImageElement | File | Blob): Promise<VisualUnderstandingResult>;
  analyzeVideo(source: HTMLVideoElement | string | File | Blob, maxFrames?: number): Promise<VideoUnderstandingResult>;
}

export interface AiCoreInput {
  requestId?: string;
  text?: string;
  imageSource?: string | unknown;
  videoSource?: string | unknown;
  audioSource?: string | unknown;
  transcript?: TranscriptionData;
  metadata?: Record<string, unknown>;
  contentType?: ContentType;
  timestamp?: string;
  knowledgeBaseItems?: import('../kb-builder/types').NormalizedKnowledgeItem[];
}

export interface CapturedContent {
  text: string;
  textLength: number;
  hasText: boolean;
  hasImage: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  metadata: Record<string, unknown>;
  contentType: ContentType;
  sourceSummary: string;
}

export interface CaptureResult {
  success: boolean;
  captured?: CapturedContent;
  warnings: string[];
  errors: string[];
  entities: CognitiveEntity[];
  relations: CognitiveRelation[];
  contextMemory: Record<string, any>;
  worldKnowledge: {
    retrieved: string[];
    score: number;
  };
  evidenceGraph: {
    nodes: EvidenceGraphNode[];
    edges: EvidenceGraphEdge[];
  };
  hypotheses: {
    id: string;
    category: string;
    priorProbability: number;
    posteriorProbability: number;
    supportingEvidenceIds: string[];
    opposingEvidenceIds: string[];
    source?: string;
  }[];
  counterHypotheses: {
    id: string;
    category: string;
    priorProbability: number;
    posteriorProbability: number;
    source?: string;
  }[];
  contradictions: {
    id: string;
    description: string;
    evidenceIds: string[];
    severity: number;
  }[];
  beliefs: Record<string, number>;
  riskEstimate: RiskEstimate;
  type: string;
  subjectId: string;
  objectId: string;
  confidence: number;
  description: string;
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface EvidenceGraphNode {
  id: string;
  label: string;
  type: string;
  confidence: number;
  source: string;
}

export interface EvidenceGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  confidence: number;
}

export interface CognitiveEntity {
  id: string;
  type: string;
  text?: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface CognitiveRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface CognitiveHypothesis extends Hypothesis {
  source: 'initial' | 'counter';
}

export interface ContradictionSignal {
  id: string;
  description: string;
  evidenceIds: string[];
  severity: number;
}

export interface RiskEstimate {
  score: number;
  category: string;
  rationale: string;
}

export interface CognitiveState {
  perception: {
    text: string;
    contentType: ContentType;
    metadata: Record<string, unknown>;
    timestamp?: string;
  };
  features: {
    tokens: string[];
    stems: string[];
    topics: string[];
    sentiment: number;
    toxicity: number;
    intent: string;
    language: string;
    complexity: number;
  };
  entities: CognitiveEntity[];
  relations: CognitiveRelation[];
  contextMemory: Record<string, unknown>;
  worldKnowledge: {
    retrieved: string[];
    score: number;
  };
  evidenceGraph: {
    nodes: EvidenceGraphNode[];
    edges: EvidenceGraphEdge[];
  };
  hypotheses: CognitiveHypothesis[];
  counterHypotheses: CognitiveHypothesis[];
  contradictions: ContradictionSignal[];
  beliefs: Record<string, number>;
  riskEstimate: RiskEstimate;
}

export interface CognitiveResult {
  success: boolean;
  output: CognitiveState;
  summary: string;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface EvidenceItem {
  id: string;
  modality: EvidenceModality;
  label: string;
  description: string;
  confidence: number;
  reliability: number;
  importance: number;
  direction: EvidenceDirection;
  source: string;
  affectedCategories?: string[];
  supportingEvidenceIds?: string[];
  contradictingEvidenceIds?: string[];
  signal?: string;
  language?: string;
  context?: string[];
  provenance?: string;
  createdAt?: string;
}

export interface EvidenceCollectionResult {
  success: boolean;
  evidenceItems: EvidenceItem[];
  summary: string;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface Hypothesis {
  id: string;
  category: string;
  statement: string;
  priorProbability: number;
  posteriorProbability: number;
  evidenceFor: string[];
  evidenceAgainst: string[];
  status: 'active' | 'confirmed' | 'rejected' | 'uncertain';
}

export interface HypothesisResult {
  success: boolean;
  hypotheses: Hypothesis[];
  summary: string;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface ReasoningStep {
  id: number;
  type: 'assess' | 'compare' | 'infer' | 'verify' | 'summarize';
  description: string;
  confidence: number;
  durationMs: number;
  evidenceIds: string[];
}

export interface ReasoningResult {
  success: boolean;
  conclusion: {
    verdict: Verdict;
    answer: string;
    confidence: number;
    alternativeInterpretations: string[];
    uncertaintyReasons: string[];
    hypothesisSummary: string;
  };
  hypotheses: Hypothesis[];
  supportingEvidence: EvidenceItem[];
  contradictingEvidence: EvidenceItem[];
  neutralEvidence: EvidenceItem[];
  reasoningSteps: ReasoningStep[];
  graphAnalysis?: {
    nodesCount: number;
    edgesCount: number;
    contradictions: string[];
    alternativeExplanations: string[];
    beliefRevisionSummary: string;
  };
  summary: string;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface ConfidenceBreakdown {
  evidenceConfidence: number;
  hypothesisConfidence: number;
  consistencyScore: number;
  uncertaintyPenalty: number;
  finalConfidence: number;
}

export interface ConfidenceResult {
  success: boolean;
  breakdown: ConfidenceBreakdown;
  summary: string;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface DecisionResult {
  success: boolean;
  verdict: Verdict;
  recommendedAction: AiCoreAction;
  rationale: string;
  primaryHypothesis?: Hypothesis;
  confidence: number;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface PolicyResult {
  success: boolean;
  action: AiCoreAction;
  policyTier: 'strict' | 'balanced' | 'lenient';
  explanation: string;
  requiresHumanReview: boolean;
  confidence: number;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface BrowserActionPayload {
  action: AiCoreAction;
  title: string;
  message: string;
  confidence: number;
  trace: string;
  details: Record<string, unknown>;
}

export interface BrowserActionResult {
  success: boolean;
  payload: BrowserActionPayload;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface ModuleLogEntry {
  module: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface AiCoreMetrics {
  requestId?: string;
  totalDurationMs: number;
  captureDurationMs: number;
  evidenceDurationMs: number;
  cognitiveDurationMs?: number;
  hypothesisDurationMs: number;
  knowledgeBaseDurationMs?: number;
  reasoningDurationMs: number;
  confidenceDurationMs: number;
  decisionDurationMs: number;
  policyDurationMs: number;
  browserActionDurationMs: number;
  attempts: Record<string, number>;
  errors: number;
  warnings: number;
}

export interface AiCoreResult {
  requestId?: string;
  success: boolean;
  capturedContent?: CapturedContent;
  evidenceResult?: EvidenceCollectionResult;
  cognitiveResult?: CognitiveResult;
  hypothesisResult?: HypothesisResult;
  kbBuilderResult?: KBBuilderResult;
  reasoningResult?: ReasoningResult;
  confidenceResult?: ConfidenceResult;
  decisionResult?: DecisionResult;
  policyResult?: PolicyResult;
  browserActionResult?: BrowserActionResult;
  metrics: AiCoreMetrics;
  logs: ModuleLogEntry[];
}

export interface ModuleResult<T> {
  success: boolean;
  output?: T;
  warnings: string[];
  errors: string[];
  durationMs: number;
  logs: ModuleLogEntry[];
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export const nullLogger: Logger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};
