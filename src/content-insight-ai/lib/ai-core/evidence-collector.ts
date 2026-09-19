import type { CapturedContent, EvidenceCollectionResult, EvidenceItem, Logger, EvidenceModality } from './types';
import { createLogEntry, normalizeText, safeLog } from './helpers';
import { analyzeText, type SemanticResult, type ContextSignal } from '../semantic-analyzer';
import { inferHarmfulness } from '../knowledge-graph';
import { searchKnowledge, hybridSearch } from '../kb-builder/knowledge-search';
import { VisionAnalyzer, type VisionAnalysis, type PoseSummary } from '../vision-analyzer';

const MAX_DURATION_MS = 400;

const MODALITY_RELIABILITY: Record<EvidenceModality, number> = {
  text: 0.9,
  metadata: 0.7,
  vision: 0.75,
  audio: 0.75,
  unknown: 0.5,
};

const TOPIC_TO_CATEGORY: Record<string, string[]> = {
  gambling: ['gambling'],
  education: ['education'],
  health: ['education'],
  politics: ['other'],
  technology: ['other'],
  entertainment: ['other'],
  religion: ['other'],
  finance: ['other'],
  nature: ['other'],
  food: ['other'],
  sports: ['other'],
};

const INTENT_CATEGORY: Record<string, string[]> = {
  harmful_explicit: ['pornography', 'violence', 'fraud', 'gambling'],
  harmful_subtle: ['pornography', 'violence', 'fraud', 'gambling'],
  educational: ['education'],
  informational: ['education'],
  commercial: ['fraud'],
  entertainment: ['other'],
  social: ['other'],
  unknown: [],
};

const SIGNAL_TO_CATEGORY: Record<string, string[]> = {
  sexual_explicit: ['pornography'],
  vulgar_slang: ['pornography'],
  sexual_borderline: ['pornography'],
  sexual_suggestive: ['pornography'],
  sexual_anatomy: ['pornography'],
  drugs: ['fraud'],
  gambling: ['gambling'],
  fraud: ['fraud'],
  violence_extreme: ['violence'],
  drugs_extended: ['fraud'],
  drugs_slang: ['fraud'],
  drugs_ru: ['fraud'],
  gambling_ru: ['gambling'],
  violence_ru: ['violence'],
  drugs_uz: ['fraud'],
  harmful_uz: ['pornography'],
  sexual_ru: ['pornography'],
  sexual_ko: ['pornography'],
  harmful_ha: ['pornography'],
  porn: ['pornography'],
  explicit: ['pornography'],
  scam: ['fraud'],
};

const SUSPICIOUS_CONTEXT_SIGNALS = new Set([
  'camera_focus',
  'pose_context',
  'movement_context',
  'privacy_context',
  'temporal_context',
]);

function isSuspiciousContextSignal(signal: string): boolean {
  return SUSPICIOUS_CONTEXT_SIGNALS.has(signal.toLowerCase());
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function createEvidenceItem(params: Omit<EvidenceItem, 'id' | 'createdAt' | 'source'> & { source?: string }): EvidenceItem {
  const createdAt = new Date().toISOString();
  return {
    ...params,
    id: `evidence-${params.modality}-${params.label}-${createdAt}`,
    createdAt,
    source: params.source ?? params.modality,
  };
}

function inferCategoriesFromTopic(topic: string): string[] {
  return TOPIC_TO_CATEGORY[topic] || [];
}

function inferCategoriesFromSignal(signal: string): string[] {
  const lower = signal.toLowerCase();
  if (lower.includes('privacy_context')) return ['pornography', 'fraud'];
  if (lower.includes('camera_focus') || lower.includes('pose_context') || lower.includes('movement_context') || lower.includes('temporal_context')) return ['pornography', 'social'];
  if (lower.includes('suggestive_bait') || lower.includes('sexual_suggestive') || lower.includes('sexual_suggestive_uz') || lower.includes('bait')) return ['pornography', 'fraud'];
  if (lower.includes('sexual') || lower.includes('porn') || lower.includes('explicit') || lower.includes('escort') || lower.includes('hentai')) return ['pornography'];
  if (lower.includes('violence') || lower.includes('kill') || lower.includes('weapon') || lower.includes('gore') || lower.includes('attack') || lower.includes('zo\'ravonlik')) return ['violence'];
  if (lower.includes('scam') || lower.includes('fraud') || lower.includes('phishing') || lower.includes('social_engineering')) return ['fraud'];
  if (lower.includes('gambling') || lower.includes('casino') || lower.includes('bet') || lower.includes('lotto') || lower.includes('qimor') || lower.includes('stavka')) return ['gambling'];
  if (lower.includes('education') || lower.includes('research') || lower.includes('medical') || lower.includes('prevent') || lower.includes('protect') || lower.includes('warning') || lower.includes('informational') || lower.includes('context') || lower.includes('safe_indicator') || lower.includes('prevention')) return ['education', 'child_safety'];
  if (lower.includes('medical') || lower.includes('doctor') || lower.includes('health') || lower.includes('disease') || lower.includes('tibbiyot')) return ['education', 'health'];
  if (lower.includes('sport') || lower.includes('fitness') || lower.includes('yoga') || lower.includes('athlete')) return ['sports'];
  if (lower.includes('fashion') || lower.includes('runway') || lower.includes('model') || lower.includes('outfit') || lower.includes('editorial')) return ['fashion'];
  if (lower.includes('art') || lower.includes('museum') || lower.includes('creative') || lower.includes('dance') || lower.includes('cultural') || lower.includes('tradition')) return ['art', 'cultural'];
  if (lower.includes('social_media') || lower.includes('viral') || lower.includes('hashtag') || lower.includes('reels') || lower.includes('shorts')) return ['social'];
  if (lower.includes('child') || lower.includes('children') || lower.includes('minor') || lower.includes('underage')) return ['child_safety', 'education'];
  return [];
}

function inferCategoriesFromContentClass(contentClass: string): string[] {
  const lower = contentClass.toLowerCase();
  if (lower === 'safe' || lower === 'educational' || lower === 'medical' || lower === 'sports' || lower === 'fashion' || lower === 'art' || lower === 'cultural') {
    return [lower === 'safe' ? 'education' : lower];
  }
  if (lower === 'sexualized' || lower === 'harmful_explicit' || lower === 'harmful_subtle' || lower === 'suggestive') return ['pornography'];
  if (lower === 'social' || lower === 'commercial') return [lower];
  return [];
}

function buildModalityEvidence(summary: string, direction: EvidenceItem['direction'], modality: EvidenceModality, confidence: number, importance: number, affectedCategories: string[], description: string, signal?: string, language?: string, context?: string[], provenance?: string): EvidenceItem {
  return createEvidenceItem({
    modality,
    label: summary,
    description,
    direction,
    confidence: clamp(confidence, 0.01, 0.99),
    reliability: MODALITY_RELIABILITY[modality],
    importance: clamp(importance, 0.01, 0.99),
    affectedCategories,
    signal,
    language,
    context,
    provenance,
  });
}

function createConflictEvidence(harmfulIds: string[], safeIds: string[]): EvidenceItem {
  const confidence = clamp(0.4 + harmfulIds.length * 0.1 + safeIds.length * 0.05, 0.1, 0.9);
  return createEvidenceItem({
    modality: 'unknown',
    label: 'semantic_conflict',
    description: 'The text contains conflicting signals about intent and risk.',
    direction: 'neutral',
    confidence,
    reliability: 0.6,
    importance: 0.8,
    affectedCategories: ['pornography', 'violence', 'fraud', 'gambling', 'education'],
    supportingEvidenceIds: harmfulIds,
    contradictingEvidenceIds: safeIds,
  });
}

function isSuggestiveEvidence(item: EvidenceItem): boolean {
  const lowerSignal = String(item.signal || '').toLowerCase();
  return (
    lowerSignal.includes('suggestive')
    || lowerSignal.includes('sexual_borderline')
    || lowerSignal.includes('sexual_suggestive')
    || lowerSignal.includes('suggestive_bait')
    || lowerSignal.includes('sexual_uz')
    || lowerSignal.includes('uz_scam_persuasion')
    || lowerSignal.includes('camera_focus')
    || lowerSignal.includes('pose_context')
    || lowerSignal.includes('movement_context')
    || lowerSignal.includes('privacy_context')
    || lowerSignal.includes('temporal_context')
    || item.label.toLowerCase().includes('suggestive')
    || item.label.toLowerCase().includes('camera_focus')
    || item.label.toLowerCase().includes('pose_context')
    || item.label.toLowerCase().includes('movement_context')
    || item.label.toLowerCase().includes('privacy_context')
    || item.label.toLowerCase().includes('temporal_context')
    || (item.context || []).some((c) => String(c).toLowerCase().includes('suggestive') || isSuspiciousContextSignal(String(c)) || String(c).toLowerCase().includes('trend'))
  );
}

// ---- Heuristic multimodal inferencers (conservative, use only available vision outputs) ----
function inferCameraFocusSignals(visionAnalysis: VisionAnalysis) {
  const signals: string[] = [];
  try {
    const frames = (visionAnalysis as any).frame_analyses as VisionAnalysis[] | undefined;
    if (!frames || frames.length === 0) return signals;

    // Face centering persistence
    const faceCenterCounts = frames.map((f) => {
      const face = (f.face_regions || [])[0];
      if (!face) return 0;
      const cx = (face.x + face.width / 2) / (f.width || 1);
      return cx >= 0.35 && cx <= 0.65 ? 1 : 0;
    }).reduce((s, v) => s + v, 0);
    if (faceCenterCounts / frames.length >= 0.6) signals.push('camera_focus_face_center_persistence');

    // Repeated lower-body / torso focus heuristic: high bottom_half skin ratio with few faces
    const lowerFocusCount = frames.map((f) => {
      const sd = f.skin_distribution || ({} as any);
      const faces = (f.face_regions || []).length;
      return (sd.bottom_half ?? 0) > (sd.top_half ?? 0) && faces <= 1 ? 1 : 0;
    }).reduce((s, v) => s + v, 0);
    if (lowerFocusCount / frames.length >= 0.5) signals.push('camera_focus_lower_body_persistence');

    // Rapid zoom/crop heuristics via perceptual hash changes: many small hamming distances -> stable framing
    const hashes = frames.map((f) => f.perceptual_hash || '');
    let smallDiffs = 0; let pairs = 0;
    for (let i = 1; i < hashes.length; i++) {
      pairs++;
      let d = 0;
      const a = hashes[i - 1] || ''; const b = hashes[i] || '';
      for (let k = 0; k < Math.min(a.length, b.length); k++) if (a[k] !== b[k]) d++;
      if (d <= 6) smallDiffs++;
    }
    if (pairs > 0 && smallDiffs / pairs >= 0.7) signals.push('camera_focus_persistent_view');
  } catch (e) {
    // conservative: don't add signals on error
  }
  return signals;
}

function inferMovementSignals(videoAnalysis: { frame_analyses?: VisionAnalysis[]; temporal_evidence?: { temporal_risk_score?: number; temporal_reasons?: string[]; rising_risk_frames?: number; repeated_suspicious_frames?: number; scene_change_count?: number; } }) {
  const signals: string[] = [];
  try {
    const frames = videoAnalysis.frame_analyses || [];
    const temporal = videoAnalysis.temporal_evidence || {} as any;

    // Rising risk trend may indicate choreography or progressive framing
    if ((temporal.rising_risk_frames ?? 0) >= 2) signals.push('movement_rising_risk_sequence');

    // Many scene changes + low temporal risk => fast-cut montage (likely trend-ish)
    if ((temporal.scene_change_count ?? 0) >= 2 && (temporal.temporal_risk_score ?? 0) < 0.4) signals.push('movement_fast_cut_trend');

    // Repeated suspicious frames indicate persistent movement/pose focus
    if ((temporal.repeated_suspicious_frames ?? 0) >= Math.max(1, Math.floor((frames.length || 1) * 0.25))) signals.push('movement_repeated_suspicious_frames');

    // Low scene changes + steady high nsfw across frames → sustained presentation
    const highFrames = frames.filter((f) => f.nsfw_score >= 0.45).length;
    if (frames.length > 0 && highFrames / frames.length >= 0.5 && (temporal.scene_change_count ?? 0) <= 1) signals.push('movement_sustained_presentation');
  } catch {}
  return signals;
}

function inferClothingSignals(videoOrImage: VisionAnalysis | { frame_analyses?: VisionAnalysis[] }) {
  const signals: string[] = [];
  try {
    if ((videoOrImage as any).frame_analyses) {
      const frames = (videoOrImage as any).frame_analyses as VisionAnalysis[];
      // Clothing transition heuristic: significant change in skin percentage or classification between frames
      let transitions = 0; let pairs = 0;
      for (let i = 1; i < frames.length; i++) {
        pairs++;
        const a = frames[i - 1]; const b = frames[i];
        if (Math.abs((a.skin_percentage || 0) - (b.skin_percentage || 0)) > 0.22) transitions++;
        if ((a.classification?.label || '') !== (b.classification?.label || '')) transitions++;
      }
      if (pairs > 0 && transitions / (pairs * 1) >= 0.4) signals.push('clothing_transition_detected');
    } else {
      const img = videoOrImage as VisionAnalysis;
      // single-image heuristics: high skin + low edge density suggests revealing presentation but not conclusive
      if ((img.skin_percentage ?? 0) > 0.45 && (img.edge_density ?? 0) < 0.15) signals.push('clothing_revealing_heuristic');
    }
  } catch {}
  return signals;
}

function isTrendEvidence(item: EvidenceItem): boolean {
  const lowerSignal = String(item.signal || '').toLowerCase();
  const lowerLabel = item.label.toLowerCase();
  return (
    lowerSignal.includes('social')
    || lowerSignal.includes('viral')
    || lowerSignal.includes('hashtag')
    || lowerSignal.includes('reels')
    || lowerSignal.includes('shorts')
    || lowerLabel.includes('topic_viral')
    || lowerLabel.includes('social_media')
    || (item.context || []).some((c) => {
      const lower = String(c).toLowerCase();
      return lower.includes('social') || lower.includes('trend') || lower.includes('hashtag') || lower.includes('reels') || lower.includes('shorts');
    })
    || (item.affectedCategories || []).some((c) => String(c).toLowerCase() === 'social')
  );
}

function inferSafeMultimodalContext(captured: CapturedContent, semantic: SemanticResult, visionAnalysis?: VisionAnalysis, frames?: VisionAnalysis[], videoAnalysis?: any) {
  const text = normalizeText(captured.text || '').toLowerCase();
  const combinedText = [text, ...(semantic.topics || []), ...(semantic.entities || []).map((entity) => entity.text)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const frameLabels = (frames || []).map((frame) => String((frame as any)?.classification?.label || '')).filter(Boolean);
  const poseCategories = (frames || []).map((frame) => String((frame as any)?.pose?.pose_category || '')).filter(Boolean);

  const hasFashionEditorialContext = /\b(fashion|editorial|runway|model|outfit|wardrobe|lookbook|photoshoot|catalog|photography|fashion shoot|editorial shoot)\b/.test(combinedText)
    || frameLabels.some((label) => ['fashion', 'editorial', 'photograph', 'runway', 'catalog', 'photo'].includes(label.toLowerCase()))
    || poseCategories.some((category) => ['fashion_editorial', 'fashion', 'editorial'].includes(category.toLowerCase()));

  const hasSportsContext = /\b(sports|sport|athletic|training|gym|fitness|yoga|dance|performance)\b/.test(combinedText)
    || frameLabels.some((label) => ['sports', 'athletic', 'fitness', 'yoga', 'dance'].includes(label.toLowerCase()));

  const hasEducationalContext = /\b(educational|medical|tutorial|instruction|school|lesson|study|research|prevention|awareness|safety)\b/.test(combinedText)
    || ['educational', 'medical', 'sports', 'fashion', 'art', 'cultural'].includes(String(semantic.content_class).toLowerCase());

  return {
    hasFashionEditorialContext,
    hasSportsContext,
    hasEducationalContext,
    isSafeContext: hasFashionEditorialContext || hasSportsContext || hasEducationalContext,
  };
}

function buildKnowledgeBaseEvidence(captured: CapturedContent, semantic: SemanticResult): EvidenceItem[] {
  const kbItems = captured.metadata?.knowledgeBaseItems;
  if (!Array.isArray(kbItems) || kbItems.length === 0) return [];

  const query = [captured.text, ...(semantic.topics || []), ...(semantic.entities || []).map((entity) => entity.text)].filter(Boolean).join(' ');
  const matches = hybridSearch(kbItems as any[], query).filter((match) => {
    const item = match.item;
    const category = String(item.category || '').toLowerCase();
    const subcategory = String(item.subcategory || '').toLowerCase();
    const intent = String(item.intent || '').toLowerCase();
    const risk = String(item.risk || '').toLowerCase();
    const genericNoiseCategories = ['generic', 'json', 'jsonl', 'txt', 'markdown', 'html', 'xml'];
    const isGenericTechnicalNoise = genericNoiseCategories.includes(category) || genericNoiseCategories.includes(subcategory);
    const isSafeLowRiskNoise = (intent === 'safe' || risk === 'low') && isGenericTechnicalNoise;
    const isMeaningful = !isSafeLowRiskNoise && (
      match.score >= 0.75
      || (intent === 'harmful' && match.score >= 0.45)
      || (risk === 'high' || risk === 'critical')
      || (!isGenericTechnicalNoise)
    );
    return isMeaningful;
  }).slice(0, 4);

  return matches.map((match) => {
    const item = match.item;
    const intent = String(item.intent || '').toLowerCase();
    const risk = String(item.risk || '').toLowerCase();
    const direction = intent === 'harmful' || risk === 'high' || risk === 'critical'
      ? 'supports'
      : intent === 'safe' || risk === 'low'
        ? 'contradicts'
        : 'neutral';
    const categories = Array.from(new Set([item.category, item.subcategory, item.intent, ...(item.context || [])].filter(Boolean).map(String)));
    const normalizedLabel = String(item.category || item.intent || item.subcategory || 'generic').replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    const confidence = clamp(
      match.score * 0.68
      + (intent === 'harmful' ? 0.12 : intent === 'safe' ? 0.05 : 0)
      + (risk === 'critical' ? 0.1 : risk === 'high' ? 0.06 : 0),
      0.05,
      0.95,
    );

    return createEvidenceItem({
      modality: 'metadata',
      label: `kb_match_${normalizedLabel}`,
      description: `Knowledge base match for category "${item.category}" and intent "${item.intent}" via ${match.reasons.join(', ')}.`,
      direction,
      confidence,
      reliability: 0.75,
      importance: 0.8,
      affectedCategories: categories.length ? categories : ['other'],
      signal: `kb_${normalizedLabel}`,
      language: semantic.language,
      context: item.context || [],
      provenance: 'knowledge_base',
      supportingEvidenceIds: [],
      contradictingEvidenceIds: [],
    });
  });
}

export function collectEvidence(
  captured: CapturedContent,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): EvidenceCollectionResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const evidenceItems: EvidenceItem[] = [];

  try {
    const text = normalizeText(captured.text);
    const semantic: SemanticResult = analyzeText(text);
    const topicCategories = semantic.topics.flatMap(inferCategoriesFromTopic);
    const intentCategories = INTENT_CATEGORY[semantic.intent] || [];

    const semanticClassCategories = inferCategoriesFromContentClass(semantic.content_class);
    const semanticClassDirection: EvidenceItem['direction'] = ['harmful_explicit', 'harmful_subtle', 'sexualized', 'suggestive'].includes(semantic.content_class)
      ? 'supports'
      : ['safe', 'educational', 'medical', 'sports', 'fashion', 'art', 'cultural'].includes(semantic.content_class)
        ? 'contradicts'
        : 'neutral';

    evidenceItems.push(buildModalityEvidence(
      `semantic_content_class_${semantic.content_class}`,
      semanticClassDirection,
      'text',
      clamp(0.4 + (semantic.content_class === 'safe' ? 0.2 : semantic.toxicity * 0.6), 0.1, 0.95),
      semanticClassDirection === 'supports' ? 0.85 : 0.7,
      semanticClassCategories.length ? semanticClassCategories : ['other'],
      `Detected semantic content class: ${semantic.content_class}.`,
      semantic.content_class,
      semantic.language,
      [semantic.content_class],
      'semantic_analyzer',
    ));

    evidenceItems.push(buildModalityEvidence(
      `semantic_intent_${semantic.intent}`,
      semantic.intent.startsWith('harmful') ? 'supports' : semantic.intent === 'educational' || semantic.intent === 'informational' ? 'contradicts' : 'neutral',
      'text',
      clamp(0.45 + (semantic.intent.startsWith('harmful') ? 0.25 : 0.0) + semantic.toxicity * 0.35, 0.1, 0.96),
      semantic.intent.startsWith('harmful') ? 0.92 : 0.68,
      intentCategories,
      `Semantic intent analysis suggests ${semantic.intent} intent.`,
      semantic.intent,
      semantic.language,
      [semantic.intent],
      'semantic_analyzer',
    ));

    evidenceItems.push(buildModalityEvidence(
      'toxicity_signal',
      semantic.toxicity > 0.55 ? 'supports' : semantic.toxicity < 0.4 ? 'contradicts' : 'neutral',
      'text',
      clamp(semantic.toxicity, 0.05, 0.99),
      0.78,
      semantic.toxicity > 0.55 ? ['pornography', 'violence', 'fraud', 'gambling'] : ['education', 'other'],
      `Toxicity score is ${(semantic.toxicity * 100).toFixed(0)}%.`,
      'toxicity',
      semantic.language,
      ['toxicity'],
      'semantic_analyzer',
    ));

    evidenceItems.push(buildModalityEvidence(
      'sentiment_signal',
      semantic.sentiment < -0.4 ? 'supports' : semantic.sentiment > 0.3 ? 'contradicts' : 'neutral',
      'text',
      clamp(0.25 + Math.abs(semantic.sentiment) * 0.65, 0.05, 0.9),
      0.55,
      semantic.sentiment < -0.4 ? ['violence', 'fraud', 'pornography'] : ['education', 'other'],
      `Sentiment analysis returned ${semantic.sentiment.toFixed(2)}.`,
      'sentiment',
      semantic.language,
      ['sentiment'],
      'semantic_analyzer',
    ));

    if (semantic.context_signals.length > 0) {
      for (const signal of semantic.context_signals) {
        const categories = inferCategoriesFromSignal(signal.signal);
        const isSuspicious = signal.category === 'context_modifier' && isSuspiciousContextSignal(signal.signal);
        const direction = signal.category === 'harmful_indicator'
          ? 'supports'
          : signal.category === 'safe_indicator'
            ? 'contradicts'
            : isSuspicious
              ? 'supports'
              : 'neutral';
        evidenceItems.push(createEvidenceItem({
          modality: 'text',
          label: `semantic_signal_${signal.signal}`,
          description: `Semantic context signal: ${signal.signal}.`,
          direction,
          confidence: clamp(0.35 + signal.weight * 0.55 + (isSuspicious ? 0.1 : 0), 0.05, 0.98),
          reliability: isSuspicious ? 0.78 : 0.75,
          importance: signal.category === 'context_modifier' ? (isSuspicious ? 0.85 : 0.55) : 0.9,
          affectedCategories: categories.length ? categories : (isSuspicious ? ['pornography', 'social'] : ['other']),
          signal: signal.signal,
          language: semantic.language,
          context: [signal.category, ...(isSuspicious ? ['suspicious_context'] : [])],
          provenance: 'semantic_analyzer',
          supportingEvidenceIds: [],
          contradictingEvidenceIds: [],
          source: 'semantic',
        }));
      }
    }

    if (semantic.topics.length > 0) {
      for (const topic of semantic.topics) {
        const categories = inferCategoriesFromTopic(topic);
        evidenceItems.push(buildModalityEvidence(
          `topic_${topic}`,
          categories.length ? 'supports' : 'neutral',
          'text',
          categories.length ? 0.65 : 0.4,
          categories.length ? 0.72 : 0.45,
          categories.length ? categories : ['other'],
          `Detected topic signal: ${topic}.`,
          topic,
          semantic.language,
          ['topic'],
          'semantic_analyzer',
        ));
      }
    }

    if (semantic.entities.length > 0) {
      const entityTypes = Array.from(new Set(semantic.entities.map((entity) => entity.type)));
      const entityCategories = semantic.entities.flatMap((entity) => inferCategoriesFromSignal(entity.type));
      evidenceItems.push(createEvidenceItem({
        modality: 'text',
        label: 'entities_detected',
        description: `Extracted ${semantic.entities.length} named entities (${entityTypes.join(', ')}).`,
        direction: entityCategories.length ? 'supports' : 'neutral',
        confidence: 0.55,
        reliability: 0.7,
        importance: 0.55,
        affectedCategories: entityCategories,
        supportingEvidenceIds: [],
        contradictingEvidenceIds: [],
      }));
    }

    if (captured.metadata && Object.keys(captured.metadata).length) {
      const metadataCategories = Object.entries(captured.metadata).flatMap(([key, value]) => {
        const lowerKey = String(key).toLowerCase();
        const lowerValue = String(value).toLowerCase();
        const suspiciousValue = /\b(free|download|click\s*here|spam|scam|fraud|phishing|adult|porn|explicit|casino|bet|gambling|bonus|claim|activate|parol|akkount)\b/.test(lowerValue);

        if ((lowerKey.includes('source') || lowerKey.includes('domain') || lowerKey.includes('url')) && suspiciousValue) return ['fraud'];
        if (lowerKey.includes('author') || lowerKey.includes('publisher')) return ['education', 'other'];
        if (lowerKey.includes('transcript') || lowerKey.includes('videoanalysis') || lowerKey.includes('vision')) return ['other'];
        return ['other'];
      });

      const hasFraudMetadata = metadataCategories.includes('fraud');
      const hasEducationMetadata = metadataCategories.includes('education');
      evidenceItems.push(createEvidenceItem({
        modality: 'metadata',
        label: 'metadata_context',
        description: 'Metadata provides external context for this request.',
        direction: hasFraudMetadata ? 'supports' : hasEducationMetadata ? 'contradicts' : 'neutral',
        confidence: hasFraudMetadata ? 0.7 : hasEducationMetadata ? 0.62 : 0.38,
        reliability: 0.7,
        importance: hasFraudMetadata ? 0.72 : hasEducationMetadata ? 0.55 : 0.4,
        affectedCategories: metadataCategories.length ? metadataCategories : ['other'],
        signal: hasFraudMetadata ? 'metadata_scam_indicator' : hasEducationMetadata ? 'metadata_educational_context' : 'metadata_context',
        context: Object.keys(captured.metadata).map((key) => String(key).toLowerCase()),
        provenance: 'metadata',
        supportingEvidenceIds: [],
        contradictingEvidenceIds: [],
        source: 'metadata',
      }));
    }

    evidenceItems.push(...buildKnowledgeBaseEvidence(captured, semantic));

    if (captured.hasImage) {
      evidenceItems.push(buildModalityEvidence(
        'visual_media_present',
        'neutral',
        'vision',
        0.5,
        0.5,
        ['other'],
        'Visual content is available for downstream vision reasoning.',
        'visual_presence',
        semantic.language,
        ['vision', 'image'],
        'vision_analyzer',
      ));
    }

    const metadata = captured.metadata || {};
    const visionAnalysis = metadata.visionAnalysis as VisionAnalysis | undefined;
    if (visionAnalysis) {
      const imageCategory = visionAnalysis.classification?.label || 'unknown';
      const nsfwDirection = visionAnalysis.nsfw_score >= 0.55 ? 'supports' : visionAnalysis.nsfw_score <= 0.25 ? 'contradicts' : 'neutral';
      const violenceDirection = visionAnalysis.violence_score >= 0.35 ? 'supports' : 'neutral';

      evidenceItems.push(createEvidenceItem({
        modality: 'vision',
        label: 'vision_nsfw_signal',
        description: `Vision NSFW model score is ${(visionAnalysis.nsfw_score * 100).toFixed(0)}%.`,
        direction: nsfwDirection,
        confidence: clamp(visionAnalysis.nsfw_score, 0.05, 0.96),
        reliability: 0.72,
        importance: 0.82,
        affectedCategories: nsfwDirection === 'supports' ? ['pornography'] : ['other'],
        signal: 'vision_nsfw',
        language: semantic.language,
        context: ['vision', 'nsfw', imageCategory],
        provenance: 'vision_analyzer',
        source: 'vision',
      }));

      if (visionAnalysis.violence_score > 0.15) {
        evidenceItems.push(createEvidenceItem({
          modality: 'vision',
          label: 'vision_violence_signal',
          description: `Vision violence score is ${(visionAnalysis.violence_score * 100).toFixed(0)}%.`,
          direction: violenceDirection,
          confidence: clamp(visionAnalysis.violence_score, 0.05, 0.95),
          reliability: 0.72,
          importance: 0.8,
          affectedCategories: violenceDirection === 'supports' ? ['violence'] : ['other'],
          signal: 'vision_violence',
          language: semantic.language,
          context: ['vision', 'violence'],
          provenance: 'vision_analyzer',
          source: 'vision',
        }));
      }

      const faceNearbyBody = visionAnalysis.face_regions?.some((face) => face.has_skin_surround);
      if (visionAnalysis.skin_percentage > 0.25 && faceNearbyBody) {
        evidenceItems.push(createEvidenceItem({
          modality: 'vision',
          label: 'vision_body_context',
          description: 'Vision analysis detected skin regions near face areas and body context.',
          direction: 'neutral',
          confidence: clamp(0.4 + visionAnalysis.skin_percentage * 0.4, 0.05, 0.85),
          reliability: 0.65,
          importance: 0.55,
          affectedCategories: ['pornography'],
          signal: 'vision_body_context',
          language: semantic.language,
          context: ['vision', 'skin_distribution', imageCategory],
          provenance: 'vision_analyzer',
          source: 'vision',
        }));
      }

      // ---- Conservative multimodal inference from vision outputs ----
      try {
        // For videos, metadata.videoAnalysis may contain frame_analyses/temporal_evidence
        const videoAnalysis = (metadata.videoAnalysis || null) as any;

        const safeContext = inferSafeMultimodalContext(captured, semantic, visionAnalysis, (videoAnalysis && videoAnalysis.frame_analyses) ? videoAnalysis.frame_analyses : undefined, videoAnalysis);

        // Camera focus signals (face centering, lower-body persistence, persistent view)
        const cameraSignals = inferCameraFocusSignals((videoAnalysis && videoAnalysis.frame_analyses) ? { frame_analyses: videoAnalysis.frame_analyses } as any : visionAnalysis as any);
        for (const s of cameraSignals) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision', label: `vision_camera_focus_${s}`, description: `Heuristic camera focus signal: ${s}.`,
            direction: 'neutral', confidence: 0.52, reliability: 0.66, importance: 0.6,
            affectedCategories: inferCategoriesFromSignal(s).length ? inferCategoriesFromSignal(s) : ['social'],
            signal: s, language: semantic.language, context: ['vision', 'camera_focus'], provenance: 'vision_heuristic', source: 'vision',
          }));
        }

        // Movement signals
        const movementSignals = inferMovementSignals(videoAnalysis || { frame_analyses: undefined });
        for (const s of movementSignals) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision', label: `vision_movement_${s}`, description: `Heuristic movement signal: ${s}.`,
            direction: s.includes('sustained') || s.includes('suspicious') ? 'supports' : 'neutral', confidence: 0.56, reliability: 0.66, importance: 0.64,
            affectedCategories: inferCategoriesFromSignal(s).length ? inferCategoriesFromSignal(s) : ['social'],
            signal: s, language: semantic.language, context: ['vision', 'movement'], provenance: 'vision_heuristic', source: 'vision',
          }));
        }

        // Clothing signals (transitions / revealing heuristics)
        const clothingSignals = inferClothingSignals((videoAnalysis && videoAnalysis.frame_analyses) ? { frame_analyses: videoAnalysis.frame_analyses } as any : visionAnalysis as any);
        for (const s of clothingSignals) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision', label: `vision_clothing_${s}`, description: `Heuristic clothing signal: ${s}.`,
            direction: s.includes('revealing') ? 'supports' : 'neutral', confidence: 0.55, reliability: 0.65, importance: 0.66,
            affectedCategories: inferCategoriesFromSignal(s).length ? inferCategoriesFromSignal(s) : ['fashion'],
            signal: s, language: semantic.language, context: ['vision', 'clothing'], provenance: 'vision_heuristic', source: 'vision',
          }));
        }

        // Pose evidence: prefer structured PoseSummary from vision analyzer when available
        try {
          const frames = (videoAnalysis && (videoAnalysis as any).frame_analyses) ? (videoAnalysis as any).frame_analyses as VisionAnalysis[] : [visionAnalysis as VisionAnalysis];
          if (frames && frames.length > 0) {
            const poseFrames = frames.map((f) => (f as any).pose).filter(Boolean) as PoseSummary[];
            if (poseFrames.length > 0) {
              // Emit per-source conservative evidence when pose estimator reports useful signal
              const highConfidenceFrames = poseFrames.filter((p) => (p.pose_confidence ?? 0) >= 0.45);
              const persistence = highConfidenceFrames.length / (poseFrames.length || 1);
              const categoryCounts = highConfidenceFrames.reduce((acc, p) => {
                const category = p.pose_category || 'unknown';
                acc[category] = (acc[category] || 0) + 1; return acc;
              }, {} as Record<string, number>);
              const mostLikelyCategory = Object.keys(categoryCounts).reduce((a, b) => (categoryCounts[b] > (categoryCounts[a] || 0) ? b : a), 'unknown');
              const isNeutralCategory = ['standing', 'sitting', 'lying', 'neutral_social', 'fashion_editorial', 'athletic'].includes(mostLikelyCategory);
              const isAmbiguousCategory = mostLikelyCategory === 'ambiguous';
              const poseDirection = isNeutralCategory ? 'neutral' : isAmbiguousCategory ? 'neutral' : 'supports';
              const poseConfidence = clamp(0.28 + persistence * 0.38 + (isAmbiguousCategory ? 0.05 : 0), 0.05, 0.82);

              evidenceItems.push(createEvidenceItem({
                modality: 'vision', label: `vision_pose_estimator_${mostLikelyCategory}`, description: `Pose estimator reports '${mostLikelyCategory}' with ${Math.round(persistence * 100)}% persistence across frames.`,
                direction: poseDirection, confidence: poseConfidence, reliability: 0.7, importance: 0.6,
                affectedCategories: ['other'], signal: `pose_${mostLikelyCategory}`, language: semantic.language, context: ['vision', 'pose_estimator'], provenance: 'pose_estimator', source: 'vision',
              }));

              // Only emit a fused pose-camera signal for repeated ambiguous or lower-body patterns, not neutral pose categories.
              if (!safeContext.isSafeContext && persistence >= 0.45 && cameraSignals.includes('camera_focus_lower_body_persistence') && (mostLikelyCategory === 'ambiguous' || mostLikelyCategory === 'unknown')) {
                evidenceItems.push(createEvidenceItem({
                  modality: 'vision', label: 'combined_pose_camera_focus', description: 'Pose estimator and persistent lower-body camera focus detected (conservative fusion).',
                  direction: 'supports', confidence: 0.7, reliability: 0.72, importance: 0.86,
                  affectedCategories: ['pornography'], signal: 'combined_pose_camera_focus', language: semantic.language, context: ['vision', 'pose', 'camera_focus'], provenance: 'vision_fusion', source: 'vision',
                }));
              }
            } else {
              // Fallback: keep existing lightweight heuristic if no pose summaries available
              if (visionAnalysis.face_regions && visionAnalysis.face_regions.length > 0 && visionAnalysis.skin_percentage > 0.35) {
                const poseSignal = 'vision_pose_body_and_face_alignment';
                evidenceItems.push(createEvidenceItem({
                  modality: 'vision', label: `vision_pose_${poseSignal}`, description: 'Heuristic pose approximation: face with contiguous body skin alignment.',
                  direction: 'neutral', confidence: 0.48, reliability: 0.6, importance: 0.5,
                  affectedCategories: ['other'], signal: poseSignal, language: semantic.language, context: ['vision', 'pose_heuristic'], provenance: 'vision_heuristic', source: 'vision',
                }));
              }
            }
          }
        } catch (e) {
          // swallow — conservative
        }

        // Combination fusion — clothing + movement
        const hasClothingTransition = clothingSignals.includes('clothing_transition_detected');
        const hasMovementRepeated = movementSignals.some((m) => m.includes('repeated'));
        if (!safeContext.isSafeContext && hasClothingTransition && hasMovementRepeated) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision', label: 'combined_clothing_movement', description: 'Clothing transitions coincide with repeated movement patterns across frames.',
            direction: 'supports', confidence: 0.78, reliability: 0.7, importance: 0.9,
            affectedCategories: ['pornography'], signal: 'combined_clothing_movement', language: semantic.language, context: ['vision', 'clothing', 'movement'], provenance: 'vision_fusion', source: 'vision',
          }));
        }

        // Pose + camera focus
        const hasCameraLower = cameraSignals.includes('camera_focus_lower_body_persistence');
        const hasPoseApprox = visionAnalysis.face_regions && visionAnalysis.face_regions.length > 0 && visionAnalysis.skin_percentage > 0.35;
        if (!safeContext.isSafeContext && hasCameraLower && hasPoseApprox) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision', label: 'combined_pose_camera_focus', description: 'Pose alignment and persistent lower-body camera focus detected (heuristic).',
            direction: 'supports', confidence: 0.72, reliability: 0.68, importance: 0.88,
            affectedCategories: ['pornography'], signal: 'combined_pose_camera_focus', language: semantic.language, context: ['vision', 'pose', 'camera_focus'], provenance: 'vision_fusion', source: 'vision',
          }));
        }

        // Movement + camera focus
        const hasMovementSuggestive = movementSignals.some((m) => m.includes('sustained') || m.includes('rising'));
        const hasCameraPersistent = cameraSignals.includes('camera_focus_persistent_view');
        if (!safeContext.isSafeContext && hasMovementSuggestive && hasCameraPersistent) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision', label: 'combined_movement_camera_focus', description: 'Sustained movement/context occurs with persistent camera framing (heuristic).',
            direction: 'supports', confidence: 0.7, reliability: 0.68, importance: 0.86,
            affectedCategories: ['pornography'], signal: 'combined_movement_camera_focus', language: semantic.language, context: ['vision', 'movement', 'camera_focus'], provenance: 'vision_fusion', source: 'vision',
          }));
        }
      } catch (e) {
        // swallow — conservative
      }
    }

    if (captured.hasVideo) {
      evidenceItems.push(buildModalityEvidence(
        'video_media_present',
        'neutral',
        'vision',
        0.5,
        0.55,
        ['other'],
        'Video content is available and may provide temporal evidence.',
        'video_presence',
        semantic.language,
        ['vision', 'video'],
        'vision_analyzer',
      ));

      const videoAnalysis = metadata.videoAnalysis as { temporal_evidence?: { temporal_risk_score?: number; temporal_reasons?: string[] } } | undefined;
      if (videoAnalysis?.temporal_evidence) {
        const temporal = videoAnalysis.temporal_evidence;
        const riskScore = clamp(temporal.temporal_risk_score ?? 0, 0.05, 0.98);
        const direction = riskScore >= 0.55 ? 'supports' : riskScore <= 0.3 ? 'contradicts' : 'neutral';
        evidenceItems.push(createEvidenceItem({
          modality: 'vision',
          label: 'temporal_video_risk',
          description: `Temporal video aggregation found elevated sequence risk (${(riskScore * 100).toFixed(0)}%).`,
          direction,
          confidence: riskScore,
          reliability: 0.72,
          importance: 0.82,
          affectedCategories: ['pornography', 'violence', 'fraud', 'gambling'],
          signal: 'temporal_video_risk',
          language: semantic.language,
          context: ['temporal', 'video'],
          provenance: 'vision_analyzer',
          source: 'vision',
          supportingEvidenceIds: [],
          contradictingEvidenceIds: [],
        }));
        if ((temporal.temporal_reasons || []).length > 0) {
          evidenceItems.push(createEvidenceItem({
            modality: 'vision',
            label: 'temporal_video_context',
            description: temporal.temporal_reasons.join('; '),
            direction: direction === 'supports' ? 'supports' : 'neutral',
            confidence: clamp(riskScore * 0.7, 0.05, 0.9),
            reliability: 0.68,
            importance: 0.65,
            affectedCategories: ['other'],
            signal: 'temporal_video_context',
            language: semantic.language,
            context: ['temporal', 'video'],
            provenance: 'vision_analyzer',
            source: 'vision',
            supportingEvidenceIds: [],
            contradictingEvidenceIds: [],
          }));
        }
      }

      // Run conservative multimodal inference when either videoAnalysis or visionAnalysis is available
      try {
        const vaSource = (metadata.videoAnalysis as any) || visionAnalysis;
        if (vaSource) {
          const safeContext = inferSafeMultimodalContext(captured, semantic, visionAnalysis, vaSource.frame_analyses ? vaSource.frame_analyses : undefined, vaSource);
          const cameraSignals = inferCameraFocusSignals(vaSource.frame_analyses ? { frame_analyses: vaSource.frame_analyses } as any : visionAnalysis as any);
          for (const s of cameraSignals) {
            if (evidenceItems.some((e) => e.signal === s)) continue;
            evidenceItems.push(createEvidenceItem({
              modality: 'vision', label: `vision_camera_focus_${s}`, description: `Heuristic camera focus signal: ${s}.`,
              direction: 'neutral', confidence: 0.52, reliability: 0.66, importance: 0.6,
              affectedCategories: inferCategoriesFromSignal(s).length ? inferCategoriesFromSignal(s) : ['social'],
              signal: s, language: semantic.language, context: ['vision', 'camera_focus'], provenance: 'vision_heuristic', source: 'vision',
            }));
          }

          const movementSignals = inferMovementSignals(vaSource);
          for (const s of movementSignals) {
            if (evidenceItems.some((e) => e.signal === s)) continue;
            evidenceItems.push(createEvidenceItem({
              modality: 'vision', label: `vision_movement_${s}`, description: `Heuristic movement signal: ${s}.`,
              direction: s.includes('sustained') || s.includes('suspicious') ? 'supports' : 'neutral', confidence: 0.56, reliability: 0.66, importance: 0.64,
              affectedCategories: inferCategoriesFromSignal(s).length ? inferCategoriesFromSignal(s) : ['social'],
              signal: s, language: semantic.language, context: ['vision', 'movement'], provenance: 'vision_heuristic', source: 'vision',
            }));
          }

          const clothingSignals = inferClothingSignals(vaSource.frame_analyses ? { frame_analyses: vaSource.frame_analyses } as any : visionAnalysis as any);
          for (const s of clothingSignals) {
            if (evidenceItems.some((e) => e.signal === s)) continue;
            evidenceItems.push(createEvidenceItem({
              modality: 'vision', label: `vision_clothing_${s}`, description: `Heuristic clothing signal: ${s}.`,
              direction: s.includes('revealing') ? 'supports' : 'neutral', confidence: 0.55, reliability: 0.65, importance: 0.66,
              affectedCategories: inferCategoriesFromSignal(s).length ? inferCategoriesFromSignal(s) : ['fashion'],
              signal: s, language: semantic.language, context: ['vision', 'clothing'], provenance: 'vision_heuristic', source: 'vision',
            }));
          }

          // Combined fusion heuristics (avoid duplicates)
          const hasClothingTransition = clothingSignals.includes('clothing_transition_detected');
          const hasMovementRepeated = movementSignals.some((m) => m.includes('repeated'));
          if (!safeContext.isSafeContext && hasClothingTransition && hasMovementRepeated && !evidenceItems.some((e) => e.label === 'combined_clothing_movement')) {
            evidenceItems.push(createEvidenceItem({
              modality: 'vision', label: 'combined_clothing_movement', description: 'Clothing transitions coincide with repeated movement patterns across frames.',
              direction: 'supports', confidence: 0.78, reliability: 0.7, importance: 0.9,
              affectedCategories: ['pornography'], signal: 'combined_clothing_movement', language: semantic.language, context: ['vision', 'clothing', 'movement'], provenance: 'vision_fusion', source: 'vision',
            }));
          }

          const hasCameraLower = cameraSignals.includes('camera_focus_lower_body_persistence');
          let hasPoseApprox = false;
          if (vaSource.frame_analyses && vaSource.frame_analyses.length) {
            hasPoseApprox = vaSource.frame_analyses.some((f: any) => (f.face_regions || []).some((fr: any) => fr.has_skin_surround) && (f.skin_percentage || 0) > 0.35);
          } else {
            hasPoseApprox = (visionAnalysis && visionAnalysis.face_regions && visionAnalysis.face_regions.length > 0 && visionAnalysis.skin_percentage > 0.35) || false;
          }
          if (!safeContext.isSafeContext && hasCameraLower && hasPoseApprox && !evidenceItems.some((e) => e.label === 'combined_pose_camera_focus')) {
            evidenceItems.push(createEvidenceItem({
              modality: 'vision', label: 'combined_pose_camera_focus', description: 'Pose alignment and persistent lower-body camera focus detected (heuristic).',
              direction: 'supports', confidence: 0.72, reliability: 0.68, importance: 0.88,
              affectedCategories: ['pornography'], signal: 'combined_pose_camera_focus', language: semantic.language, context: ['vision', 'pose', 'camera_focus'], provenance: 'vision_fusion', source: 'vision',
            }));
          }

          const hasMovementSuggestive = movementSignals.some((m) => m.includes('sustained') || m.includes('rising'));
          const hasCameraPersistent = cameraSignals.includes('camera_focus_persistent_view');
          if (!safeContext.isSafeContext && hasMovementSuggestive && hasCameraPersistent && !evidenceItems.some((e) => e.label === 'combined_movement_camera_focus')) {
            evidenceItems.push(createEvidenceItem({
              modality: 'vision', label: 'combined_movement_camera_focus', description: 'Sustained movement/context occurs with persistent camera framing (heuristic).',
              direction: 'supports', confidence: 0.7, reliability: 0.68, importance: 0.86,
              affectedCategories: ['pornography'], signal: 'combined_movement_camera_focus', language: semantic.language, context: ['vision', 'movement', 'camera_focus'], provenance: 'vision_fusion', source: 'vision',
            }));
          }
        }
      } catch (e) {}
    }

    if (captured.hasAudio) {
      evidenceItems.push(buildModalityEvidence(
        'audio_media_present',
        'neutral',
        'audio',
        0.5,
        0.55,
        ['other'],
        'Audio content is available and may provide speech or sound evidence.',
        'audio_presence',
        semantic.language,
        ['audio'],
        'audio_system',
      ));
    }

    const graphEvidence = inferHarmfulness([...semantic.topics, ...semantic.entities.map((entity) => entity.text)]);
    if (graphEvidence.relevant_nodes.length !== 0 || graphEvidence.score > 0.6) {
      const categorySignals = graphEvidence.relevant_nodes.flatMap((node) => [
        ...(typeof node.properties.semantic_label === 'string' ? [node.properties.semantic_label] : []),
        node.label,
      ]);
      const categories = Array.from(new Set(categorySignals.flatMap((signal) => inferCategoriesFromSignal(String(signal)))));
      evidenceItems.push(createEvidenceItem({
        modality: 'metadata',
        label: 'knowledge_graph_inference',
        description: 'Knowledge graph inference estimates risk based on related concepts.',
        direction: graphEvidence.score > 0.65 ? 'supports' : graphEvidence.score < 0.35 ? 'contradicts' : 'neutral',
        confidence: clamp(graphEvidence.score, 0.05, 0.95),
        reliability: 0.65,
        importance: 0.65,
        affectedCategories: categories.length ? categories : ['other'],
        signal: 'knowledge_graph',
        language: semantic.language,
        context: ['knowledge_graph'],
        provenance: 'knowledge_graph',
        supportingEvidenceIds: [],
        contradictingEvidenceIds: [],
        source: 'knowledge_graph',
      }));
    }

    const harmfulIds = evidenceItems.filter((item) => item.direction === 'supports').map((item) => item.id);
    const safeIds = evidenceItems.filter((item) => item.direction === 'contradicts').map((item) => item.id);
    if (harmfulIds.length > 0 && safeIds.length > 0) {
      evidenceItems.push(createConflictEvidence(harmfulIds, safeIds));
    }

    // Contextual fusion: boost combined signals when safe/educational or suggestive/harmful signals converge.
    const hasSexualSignals = evidenceItems.some((item) => (item.affectedCategories || []).includes('pornography') && item.direction === 'supports');
    const hasSuggestiveSignal = evidenceItems.some((item) => isSuggestiveEvidence(item));
    const hasTrendContext = evidenceItems.some((item) => isTrendEvidence(item));
    const hasMedicalEducational = evidenceItems.some((item) => item.direction === 'contradicts' && (item.affectedCategories || []).includes('education'));
    const hasSafeVisual = evidenceItems.some((item) => item.modality === 'vision' && item.direction === 'contradicts');
    const hasScamMetadata = evidenceItems.some((item) => item.signal?.includes('metadata_scam') || item.affectedCategories?.includes('fraud'));
    const hasGamblingEvidence = evidenceItems.some((item) => item.affectedCategories?.includes('gambling'));

    const hasSuspiciousMultimodalSignal = evidenceItems.some((item) => isSuspiciousContextSignal(String(item.signal || '').toLowerCase()));
    if (hasSexualSignals && hasSuspiciousMultimodalSignal) {
      evidenceItems.push(createEvidenceItem({
        modality: 'text',
        label: 'combined_suspicious_multimodal',
        description: 'Suggestive or harmful sexual signals are supported by suspicious camera, pose, movement, privacy, or temporal context.',
        direction: 'supports',
        confidence: 0.81,
        reliability: 0.75,
        importance: 0.88,
        affectedCategories: ['pornography'],
        signal: 'combined_suspicious_multimodal',
        language: semantic.language,
        context: ['camera_focus', 'pose_context', 'movement_context', 'privacy_context', 'temporal_context'],
        provenance: 'semantic_fusion',
        source: 'semantic_fusion',
      }));
    }

    if (hasSexualSignals && hasSuggestiveSignal && hasTrendContext) {
      evidenceItems.push(createEvidenceItem({
        modality: 'text',
        label: 'combined_suggestive_trend',
        description: 'Suggestive sexual signals occur within social media trend context.',
        direction: 'supports',
        confidence: 0.78,
        reliability: 0.72,
        importance: 0.86,
        affectedCategories: ['pornography'],
        signal: 'combined_suggestive_trend',
        language: semantic.language,
        context: ['social', 'suggestive', 'trend'],
        provenance: 'semantic_fusion',
        source: 'semantic_fusion',
      }));
    }

    if (hasMedicalEducational && hasSafeVisual) {
      evidenceItems.push(createEvidenceItem({
        modality: 'text',
        label: 'combined_medical_educational',
        description: 'Medical and educational signals are supported by safe visual context.',
        direction: 'contradicts',
        confidence: 0.74,
        reliability: 0.7,
        importance: 0.78,
        affectedCategories: ['education', 'health'],
        signal: 'combined_medical_educational',
        language: semantic.language,
        context: ['medical', 'educational', 'vision'],
        provenance: 'semantic_fusion',
        source: 'semantic_fusion',
      }));
    }

    if (hasScamMetadata && hasGamblingEvidence) {
      evidenceItems.push(createEvidenceItem({
        modality: 'metadata',
        label: 'combined_scam_gambling',
        description: 'Scam or phishing persuasion is supported by gambling-related evidence and metadata signals.',
        direction: 'supports',
        confidence: 0.8,
        reliability: 0.75,
        importance: 0.88,
        affectedCategories: ['fraud', 'gambling'],
        signal: 'combined_scam_gambling',
        language: semantic.language,
        context: ['scam', 'gambling', 'metadata'],
        provenance: 'semantic_fusion',
        source: 'semantic_fusion',
      }));
    }

    const hasFashionEvidence = evidenceItems.some((item) => (item.affectedCategories || []).includes('fashion'));
    const hasNoHarmfulSignals = evidenceItems.every((item) => item.direction !== 'supports' || (item.affectedCategories || []).every((c) => !['pornography', 'fraud', 'gambling', 'violence'].includes(c)));
    if (hasFashionEvidence && hasNoHarmfulSignals) {
      evidenceItems.push(createEvidenceItem({
        modality: 'text',
        label: 'combined_fashion_safe',
        description: 'Fashion or editorial context is present without harmful signals.',
        direction: 'contradicts',
        confidence: 0.62,
        reliability: 0.65,
        importance: 0.72,
        affectedCategories: ['fashion'],
        signal: 'combined_fashion_safe',
        language: semantic.language,
        context: ['fashion', 'editorial'],
        provenance: 'semantic_fusion',
        source: 'semantic_fusion',
      }));
    }

    if (evidenceItems.length === 0) {
      warnings.push('No evidence could be fused from the captured content.');
      logs.push(createLogEntry('evidence-collector', 'warn', 'No evidence items were extracted from content.'));
      safeLog(logger, 'warn', 'evidence-collector', 'No evidence items were extracted from content.');
    } else {
      logs.push(createLogEntry('evidence-collector', 'info', `Fused ${evidenceItems.length} evidence items.`, {
        itemCount: evidenceItems.length,
        textLength: semantic.tokens.length,
      }));
      safeLog(logger, 'info', 'evidence-collector', 'Evidence fused.', { itemCount: evidenceItems.length });
    }

    const durationMs = Date.now() - start;
    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Evidence fusion duration exceeded expected threshold.');
      logs.push(createLogEntry('evidence-collector', 'warn', 'Evidence collection exceeded expected duration.', { durationMs }));
      safeLog(logger, 'warn', 'evidence-collector', 'Evidence collection exceeded expected duration.', { durationMs });
    }

    return {
      success: true,
      evidenceItems,
      summary: `Fused ${evidenceItems.length} evidence items from captured content.`,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Unknown evidence collection failure.';
    errors.push(message);
    logs.push(createLogEntry('evidence-collector', 'error', message, { error }));
    safeLog(logger, 'error', 'evidence-collector', message);
    return {
      success: false,
      evidenceItems,
      summary: 'Evidence collection failed.',
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
