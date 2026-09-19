export type FeedbackType = 'false_positive' | 'false_negative' | 'suggestion' | 'general';
export type ContentType = 'text' | 'image' | 'video' | 'pose' | 'movement' | 'body_shape';
export type FeedbackStatus = 'pending' | 'reviewing' | 'learned' | 'rejected' | 'rolled_back';
export type ContentVerdict = 'safe' | 'harmful' | 'uncertain';

export interface FeedbackReport {
  id: string;
  type: FeedbackType;
  content_type: ContentType;
  verdict_given: ContentVerdict;
  verdict_correct: ContentVerdict;
  confidence_before: number;
  confidence_after?: number;
  description: string;
  screenshot_urls: string[];
  video_url?: string;
  related_knowledge_file?: string;
  tags: string[];
  status: FeedbackStatus;
  created_at: string;
  reviewed_at?: string;
  learned_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  attachments?: Attachment[];
  feedback_report_id?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'screenshot';
  url: string;
  thumbnail_url?: string;
  filename: string;
  size: number;
}

export interface LearningEntry {
  id: string;
  feedback_id: string;
  content_type: ContentType;
  pattern_description: string;
  old_rule?: string;
  new_rule: string;
  confidence_delta: number;
  applied_at: string;
  rollback_available: boolean;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  content_type: ContentType;
  rules: ContentRule[];
  version: number;
  updated_at: string;
}

export interface ContentRule {
  id: string;
  pattern: string;
  action: 'block' | 'allow' | 'flag';
  confidence: number;
  source: 'manual' | 'learned' | 'default';
  learned_from_feedback?: string;
}

export interface BenchmarkTarget {
  content_type: ContentType;
  precision_target: number;
  recall_target: number;
  latency_target_ms: number;
  false_positive_rate_max: number;
}

export const BENCHMARK_TARGETS: Record<string, BenchmarkTarget> = {
  text: { content_type: 'text', precision_target: 0.98, recall_target: 0.98, latency_target_ms: 50, false_positive_rate_max: 0.02 },
  image: { content_type: 'image', precision_target: 0.95, recall_target: 0.95, latency_target_ms: 200, false_positive_rate_max: 0.05 },
  video: { content_type: 'video', precision_target: 0.93, recall_target: 0.93, latency_target_ms: 500, false_positive_rate_max: 0.07 },
  pose: { content_type: 'pose', precision_target: 0.90, recall_target: 0.90, latency_target_ms: 300, false_positive_rate_max: 0.10 },
  movement: { content_type: 'movement', precision_target: 0.90, recall_target: 0.90, latency_target_ms: 400, false_positive_rate_max: 0.10 },
  body_shape: { content_type: 'body_shape', precision_target: 0.92, recall_target: 0.92, latency_target_ms: 250, false_positive_rate_max: 0.08 },
};
