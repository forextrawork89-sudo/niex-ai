export type PipelineAction = 'allow' | 'warn' | 'blur' | 'block' | 'request_more_analysis';

export type ContentType = 'text' | 'image' | 'video' | 'audio' | 'mixed' | 'pose' | 'movement' | 'body_shape';

export interface PipelineInput {
  text?: string;
  imageSource?: string | File | Blob;
  videoSource?: string | File | Blob;
  audioSource?: string | File | Blob;
  contentType?: ContentType;
  metadata?: Record<string, unknown>;
  userSettings?: Record<string, unknown>;
}

export interface EvidenceItem {
  source: string;
  label: string;
  strength: number;
  supporting: boolean;
  explanation: string;
}

export interface ModalityReport {
  modality: 'text' | 'vision' | 'audio' | 'ocr' | 'metadata';
  findings: string[];
  confidence: number;
  evidence: EvidenceItem[];
  summary: string;
}

export interface ContextSummary {
  description: string;
  actors: string[];
  intentSummary: string;
  audience: string;
  surroundingContext: string[];
}

export interface RiskScores {
  explicitness: number;
  sexualIntent: number;
  gamblingProbability: number;
  violence: number;
  manipulation: number;
  scamProbability: number;
  childSafetyRisk: number;
  confidence: number;
}

export interface ReasoningSummary {
  supportingEvidence: EvidenceItem[];
  contradictingEvidence: EvidenceItem[];
  missingEvidence: string[];
  explanation: string;
}

export interface PolicyDecision {
  action: PipelineAction;
  reason: string;
  explanation: string;
}

export interface PipelineStageResult {
  stage: string;
  completed: boolean;
  summary: string;
  durationMs?: number;
}

export interface ReasoningPipelineResult {
  pipelineSummary: {
    stageResults: PipelineStageResult[];
  };
  modalityReports: ModalityReport[];
  context: ContextSummary;
  riskScores: RiskScores;
  reasoningSummary: ReasoningSummary;
  policyAction: PolicyDecision;
}
