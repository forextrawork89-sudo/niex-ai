import type { FeedbackReport, ChatMessage, LearningEntry, FeedbackType, ContentType, ContentVerdict, FeedbackStatus } from '../types/feedback';

const STORAGE_KEYS = {
  FEEDBACK: 'cia_feedback_reports',
  CHAT: 'cia_chat_messages',
  LEARNING: 'cia_learning_entries',
  KNOWLEDGE: 'cia_knowledge_rules',
} as const;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function createFeedbackReport(params: {
  type: FeedbackType;
  content_type: ContentType;
  verdict_given: ContentVerdict;
  verdict_correct: ContentVerdict;
  description: string;
  screenshot_urls?: string[];
  video_url?: string;
  related_knowledge_file?: string;
  tags?: string[];
  confidence_before?: number;
}): FeedbackReport {
  const report: FeedbackReport = {
    id: generateId(),
    type: params.type,
    content_type: params.content_type,
    verdict_given: params.verdict_given,
    verdict_correct: params.verdict_correct,
    confidence_before: params.confidence_before ?? 0.5,
    description: params.description,
    screenshot_urls: params.screenshot_urls ?? [],
    video_url: params.video_url,
    related_knowledge_file: params.related_knowledge_file,
    tags: params.tags ?? [],
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const reports = load<FeedbackReport>(STORAGE_KEYS.FEEDBACK);
  reports.unshift(report);
  save(STORAGE_KEYS.FEEDBACK, reports);
  return report;
}

export function getAllFeedbackReports(): FeedbackReport[] {
  return load<FeedbackReport>(STORAGE_KEYS.FEEDBACK);
}

export function updateFeedbackStatus(id: string, status: FeedbackStatus): void {
  const reports = load<FeedbackReport>(STORAGE_KEYS.FEEDBACK);
  const idx = reports.findIndex((r) => r.id === id);
  if (idx !== -1) {
    reports[idx].status = status;
    if (status === 'reviewing') reports[idx].reviewed_at = new Date().toISOString();
    if (status === 'learned') reports[idx].learned_at = new Date().toISOString();
    save(STORAGE_KEYS.FEEDBACK, reports);
  }
}

export function addChatMessage(params: {
  role: 'user' | 'ai' | 'system';
  content: string;
  attachments?: { type: 'image' | 'video' | 'screenshot'; url: string; filename: string; size: number }[];
  feedback_report_id?: string;
  metadata?: Record<string, unknown>;
}): ChatMessage {
  const msg: ChatMessage = {
    id: generateId(),
    role: params.role,
    content: params.content,
    attachments: params.attachments?.map((a) => ({ id: generateId(), thumbnail_url: a.url, ...a })),
    feedback_report_id: params.feedback_report_id,
    timestamp: new Date().toISOString(),
    metadata: params.metadata,
  };

  const messages = load<ChatMessage>(STORAGE_KEYS.CHAT);
  messages.push(msg);
  save(STORAGE_KEYS.CHAT, messages);
  return msg;
}

export function getChatMessages(): ChatMessage[] {
  return load<ChatMessage>(STORAGE_KEYS.CHAT);
}

export function clearChat(): void {
  save(STORAGE_KEYS.CHAT, []);
}

export function addLearningEntry(params: {
  feedback_id: string;
  content_type: ContentType;
  pattern_description: string;
  old_rule?: string;
  new_rule: string;
  confidence_delta: number;
}): LearningEntry {
  const entry: LearningEntry = {
    id: generateId(),
    feedback_id: params.feedback_id,
    content_type: params.content_type,
    pattern_description: params.pattern_description,
    old_rule: params.old_rule,
    new_rule: params.new_rule,
    confidence_delta: params.confidence_delta,
    applied_at: new Date().toISOString(),
    rollback_available: true,
  };

  const entries = load<LearningEntry>(STORAGE_KEYS.LEARNING);
  entries.unshift(entry);
  save(STORAGE_KEYS.LEARNING, entries);
  return entry;
}

export function getLearningEntries(): LearningEntry[] {
  return load<LearningEntry>(STORAGE_KEYS.LEARNING);
}

export function rollbackLearning(entryId: string): boolean {
  const entries = load<LearningEntry>(STORAGE_KEYS.LEARNING);
  const idx = entries.findIndex((e) => e.id === entryId);
  if (idx === -1 || !entries[idx].rollback_available) return false;

  entries[idx].rollback_available = false;
  save(STORAGE_KEYS.LEARNING, entries);

  const reports = load<FeedbackReport>(STORAGE_KEYS.FEEDBACK);
  const rIdx = reports.findIndex((r) => r.id === entries[idx].feedback_id);
  if (rIdx !== -1) {
    reports[rIdx].status = 'rolled_back';
    save(STORAGE_KEYS.FEEDBACK, reports);
  }

  return true;
}

export function getFeedbackStats() {
  const reports = load<FeedbackReport>(STORAGE_KEYS.FEEDBACK);
  const learning = load<LearningEntry>(STORAGE_KEYS.LEARNING);

  return {
    total_reports: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    learned: reports.filter((r) => r.status === 'learned').length,
    rejected: reports.filter((r) => r.status === 'rejected').length,
    false_positives: reports.filter((r) => r.type === 'false_positive').length,
    false_negatives: reports.filter((r) => r.type === 'false_negative').length,
    total_learning_entries: learning.length,
    avg_confidence_improvement: learning.length > 0 ? learning.reduce((sum, e) => sum + e.confidence_delta, 0) / learning.length : 0,
    by_content_type: Object.fromEntries(
      (['text', 'image', 'video', 'pose', 'movement', 'body_shape'] as ContentType[]).map((ct) => [ct, reports.filter((r) => r.content_type === ct).length])
    ),
  };
}
