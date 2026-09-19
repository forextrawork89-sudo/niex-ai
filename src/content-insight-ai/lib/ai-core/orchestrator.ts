import type {
  AiCoreInput,
  AiCoreResult,
  AiCoreMetrics,
  Logger,
} from './types';
import { nullLogger } from './types';
import type { KBBuilderResult } from '../kb-builder/types';
import { captureContent } from './content-capture';
import { VisionAnalyzer } from '../vision-analyzer';
import { getVisualUnderstandingProvider } from '../visual-understanding-provider';
import { collectEvidence } from './evidence-collector';
import { buildCognitiveState } from './cognitive';
import { generateHypotheses } from './hypothesis-engine';
import { performReasoning } from './reasoning-engine';
import { calibrateConfidence } from './confidence-engine';
import { makeDecision } from './decision-engine';
import { applyPolicy } from './policy-engine';
import { createBrowserAction } from './browser-action-layer';
import { retryAsync, createLogEntry, safeLog, nowMs } from './helpers';

async function safeBuildKnowledgeBase(options: { sources?: any[]; seedItems?: any[]; changelog?: string[] } = {}): Promise<KBBuilderResult | undefined> {
  const isNode = typeof process !== 'undefined' && Boolean(process.versions?.node);
  if (!isNode) {
    return undefined;
  }

  const module = await import('../kb-builder/builder');
  return module.buildKnowledgeBase(options);
}

const DEFAULT_RETRY_ATTEMPTS = 2;
const MAX_TOTAL_MS = 2200;

export async function processContent(
  input: AiCoreInput,
  logger: Logger = nullLogger,
): Promise<AiCoreResult> {
  const totalStart = nowMs();
  const logs = [] as ReturnType<typeof createLogEntry>[];
  const attempts: Record<string, number> = {};
  const warnings: string[] = [];
  const errors: string[] = [];

  const metrics: AiCoreMetrics = {
    requestId: input.requestId,
    totalDurationMs: 0,
    captureDurationMs: 0,
    evidenceDurationMs: 0,
    hypothesisDurationMs: 0,
    reasoningDurationMs: 0,
    confidenceDurationMs: 0,
    decisionDurationMs: 0,
    policyDurationMs: 0,
    browserActionDurationMs: 0,
    attempts: {},
    errors: 0,
    warnings: 0,
  };

  const captureResult = captureContent(input, logger);
  metrics.captureDurationMs = captureResult.durationMs;
  captureResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...captureResult.warnings);
  errors.push(...captureResult.errors);
  metrics.warnings += captureResult.warnings.length;
  metrics.errors += captureResult.errors.length;

  if (!captureResult.success || !captureResult.captured) {
    safeLog(logger, 'warn', 'ai-core-orchestrator', 'Capture failed or returned no content.', {
      requestId: input.requestId,
      errors: captureResult.errors,
      warnings: captureResult.warnings,
    });

    const durationMs = nowMs() - totalStart;
    return {
      requestId: input.requestId,
      success: false,
      metrics: { ...metrics, totalDurationMs: durationMs },
      logs,
    };
  }

  // local singleton VisionAnalyzer to avoid importing brain (circular)
  let _localVision: VisionAnalyzer | null = null;
  function getLocalVisionAnalyzer() {
    if (!_localVision) _localVision = new VisionAnalyzer();
    return _localVision;
  }

  // Preprocessing: Vision / OCR / scene understanding for media
  try {
    if (captureResult.captured.hasImage || captureResult.captured.hasVideo) {
      const va = getLocalVisionAnalyzer();

      // Image preprocessing
      if (captureResult.captured.hasImage && input.imageSource) {
        try {
          let vision: any;
          if (va) {
            try {
              vision = await va.analyzeImage(input.imageSource as any);
            } catch {}
          }
          const visualProvider = getVisualUnderstandingProvider();
          const understanding = await visualProvider.analyzeImage(input.imageSource as any);
          if (!vision) vision = understanding.visionAnalysis;
          const ocrText = (vision?.text_regions || []).map((r: any) => r.text).filter(Boolean).join(' ');
          if (ocrText) {
            captureResult.captured.text = (captureResult.captured.text + ' ' + ocrText).trim();
            captureResult.captured.textLength = captureResult.captured.text.length;
            captureResult.captured.hasText = captureResult.captured.text.length > 0;
          }
          captureResult.captured.metadata = {
            ...(captureResult.captured.metadata || {}),
            visionAnalysis: vision,
            visualUnderstanding: understanding.visualUnderstanding,
            contextUnderstanding: understanding.contextUnderstanding,
            vision_analysis_preview: {
              nsfw_score: vision?.nsfw_score,
              text_regions: vision?.text_regions?.length || 0,
              scene: understanding.visualUnderstanding?.scene,
              summary: understanding.visualUnderstanding?.summary,
            },
          };
        } catch (e) {
          // ignore provider failures, continue pipeline
        }
      }

      // Video preprocessing
      if (captureResult.captured.hasVideo && input.videoSource) {
        try {
          let videoAnalysis: any;
          if (va) {
            try {
              videoAnalysis = await va.analyzeVideo(input.videoSource as any);
            } catch {}
          }
          const visualProvider = getVisualUnderstandingProvider();
          let understanding: any;
          try {
            understanding = await visualProvider.analyzeVideo(input.videoSource as any);
          } catch {}
          if (!videoAnalysis && understanding) videoAnalysis = understanding.videoAnalysis;
          const frameTexts = (videoAnalysis?.frame_analyses || []).flatMap((f: any) => (f.text_regions || []).map((tr: any) => tr.text));
          const ocrText = frameTexts.filter(Boolean).join(' ');
          if (ocrText) {
            captureResult.captured.text = (captureResult.captured.text + ' ' + ocrText).trim();
            captureResult.captured.textLength = captureResult.captured.text.length;
            captureResult.captured.hasText = captureResult.captured.text.length > 0;
          }
          if (videoAnalysis) {
            captureResult.captured.metadata = {
              ...(captureResult.captured.metadata || {}),
              videoAnalysis,
              videoUnderstanding: understanding?.videoUnderstanding,
              contextUnderstanding: understanding?.contextUnderstanding,
              video_analysis_preview: {
                frames: videoAnalysis.frames_analyzed || videoAnalysis.frame_analyses?.length || 0,
                temporal_risk_score: videoAnalysis.temporal_evidence?.temporal_risk_score,
                summary: understanding?.videoUnderstanding?.summary || 'video preview',
              },
            };
          }
        } catch (e) {
          // continue on failure
        }
      }
    }

    // Audio preprocessing is handled entirely by the ASR adapter layer before AI Core.
    if (captureResult.captured.hasAudio && input.transcript) {
      const transcriptData = input.transcript;
      if (typeof transcriptData.transcript === 'string' && transcriptData.transcript.trim().length > 0) {
        captureResult.captured.text = (captureResult.captured.text + ' ' + transcriptData.transcript).trim();
        captureResult.captured.textLength = captureResult.captured.text.length;
        captureResult.captured.hasText = captureResult.captured.text.length > 0;
      }
      captureResult.captured.metadata = {
        ...(captureResult.captured.metadata || {}),
        transcript: {
          language: transcriptData.language,
          confidence: transcriptData.confidence,
          segments: transcriptData.segments,
          speakers: transcriptData.speakers,
          metadata: transcriptData.metadata,
        },
      };
    }
  } catch (e) {
    // Vision subsystem failure shouldn't stop pipeline
  }

  const runtimeKbItems = Array.isArray(input.knowledgeBaseItems) ? input.knowledgeBaseItems : [];
  if (captureResult.captured) {
    captureResult.captured.metadata = {
      ...(captureResult.captured.metadata || {}),
      knowledgeBaseItems: runtimeKbItems,
    };
  }

  let kbBuilderResult: Awaited<ReturnType<typeof safeBuildKnowledgeBase>> | undefined;
  try {
    const kbStart = nowMs();
    kbBuilderResult = await safeBuildKnowledgeBase({
      changelog: [`ai-core:${input.requestId || 'unknown'}`],
      seedItems: runtimeKbItems.length > 0 ? runtimeKbItems : undefined,
    });
    metrics.knowledgeBaseDurationMs = nowMs() - kbStart;
    if (kbBuilderResult && kbBuilderResult.success) {
      captureResult.captured.metadata = {
        ...(captureResult.captured.metadata || {}),
        knowledgeBase: {
          version: kbBuilderResult.version.version,
          itemCount: kbBuilderResult.normalized.length,
          graphNodeCount: kbBuilderResult.graph.nodes.length,
          graphEdgeCount: kbBuilderResult.graph.edges.length,
          checksum: kbBuilderResult.version.checksum,
        },
        knowledgeBaseItems: runtimeKbItems.length > 0 ? runtimeKbItems : kbBuilderResult.normalized,
      };
      logs.push(createLogEntry('kb-builder', 'info', 'Knowledge base built.', { itemCount: kbBuilderResult.normalized.length, graphNodeCount: kbBuilderResult.graph.nodes.length }));
    } else {
      warnings.push('Knowledge base builder reported errors.');
      metrics.warnings += 1;
    }
  } catch (error) {
    warnings.push('Knowledge base builder failed; continuing without it.');
    metrics.warnings += 1;
    errors.push(error instanceof Error ? error.message : 'Knowledge base builder failed.');
    metrics.errors += 1;
  }

  let evidenceResult = await retryAsync(
    async () => collectEvidence(captureResult.captured!, logger),
    DEFAULT_RETRY_ATTEMPTS,
    logger,
    'evidence-collector',
  ).catch((error) => {
    errors.push(error instanceof Error ? error.message : 'Evidence collection failed after retries.');
    metrics.errors += 1;
    return { success: false, evidenceItems: [], summary: 'Evidence collection failed.', warnings: [], errors: [], durationMs: 0, logs: [] };
  });

  if (!evidenceResult.success) {
    warnings.push('Continuing pipeline with minimal evidence after evidence collector failure.');
    metrics.warnings += 1;
  }

  // Cognitive stage: build cognitive state from capture + evidence
  const cognitiveResult = buildCognitiveState(captureResult.captured!, evidenceResult, logger);
  metrics.cognitiveDurationMs = cognitiveResult.durationMs;
  cognitiveResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...cognitiveResult.warnings);
  errors.push(...cognitiveResult.errors);
  if (!cognitiveResult.success) {
    warnings.push('Cognitive stage reported failure, continuing cautiously.');
    metrics.warnings += 1;
  }

  metrics.evidenceDurationMs = evidenceResult.durationMs;
  evidenceResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...evidenceResult.warnings);
  errors.push(...evidenceResult.errors);
  metrics.warnings += evidenceResult.warnings.length;
  metrics.errors += evidenceResult.errors.length;

  const hypothesisResult = generateHypotheses(captureResult.captured, evidenceResult, logger, cognitiveResult.output);
  metrics.hypothesisDurationMs = hypothesisResult.durationMs;
  hypothesisResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...hypothesisResult.warnings);
  errors.push(...hypothesisResult.errors);
  metrics.warnings += hypothesisResult.warnings.length;
  metrics.errors += hypothesisResult.errors.length;

  const reasoningResult = performReasoning(captureResult.captured, evidenceResult, hypothesisResult, logger);
  metrics.reasoningDurationMs = reasoningResult.durationMs;
  reasoningResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...reasoningResult.warnings);
  errors.push(...reasoningResult.errors);
  metrics.warnings += reasoningResult.warnings.length;
  metrics.errors += reasoningResult.errors.length;

  const confidenceResult = calibrateConfidence(evidenceResult, hypothesisResult, reasoningResult, logger);
  metrics.confidenceDurationMs = confidenceResult.durationMs;
  confidenceResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...confidenceResult.warnings);
  errors.push(...confidenceResult.errors);
  metrics.warnings += confidenceResult.warnings.length;
  metrics.errors += confidenceResult.errors.length;

  const decisionResult = makeDecision(reasoningResult, confidenceResult, hypothesisResult, evidenceResult, logger);
  metrics.decisionDurationMs = decisionResult.durationMs;
  decisionResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...decisionResult.warnings);
  errors.push(...decisionResult.errors);
  metrics.warnings += decisionResult.warnings.length;
  metrics.errors += decisionResult.errors.length;

  const policyResult = applyPolicy(decisionResult, logger);
  metrics.policyDurationMs = policyResult.durationMs;
  policyResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...policyResult.warnings);
  errors.push(...policyResult.errors);
  metrics.warnings += policyResult.warnings.length;
  metrics.errors += policyResult.errors.length;

  const browserActionResult = createBrowserAction(decisionResult, policyResult, logger);
  metrics.browserActionDurationMs = browserActionResult.durationMs;
  browserActionResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...browserActionResult.warnings);
  errors.push(...browserActionResult.errors);
  metrics.warnings += browserActionResult.warnings.length;
  metrics.errors += browserActionResult.errors.length;

  const totalDurationMs = nowMs() - totalStart;
  metrics.totalDurationMs = totalDurationMs;
  metrics.attempts = attempts;

  if (totalDurationMs > MAX_TOTAL_MS) {
    warnings.push('AI Core processing exceeded total expected duration.');
    metrics.warnings += 1;
    logs.push(createLogEntry('ai-core-orchestrator', 'warn', 'Total processing duration exceeded threshold.', { totalDurationMs }));
    safeLog(logger, 'warn', 'ai-core-orchestrator', 'Total processing duration exceeded threshold.', { totalDurationMs });
  }

  const result: AiCoreResult = {
    requestId: input.requestId,
    success: true,
    capturedContent: captureResult.captured,
    evidenceResult,
    hypothesisResult,
    kbBuilderResult,
    reasoningResult,
    confidenceResult,
    decisionResult,
    policyResult,
    browserActionResult,
    metrics,
    logs,
  };

  return result;
}

export function processContentSync(
  input: AiCoreInput,
  logger: Logger = nullLogger,
): AiCoreResult {
  const totalStart = nowMs();
  const logs = [] as ReturnType<typeof createLogEntry>[];
  const warnings: string[] = [];
  const errors: string[] = [];

  const metrics: AiCoreMetrics = {
    requestId: input.requestId,
    totalDurationMs: 0,
    captureDurationMs: 0,
    evidenceDurationMs: 0,
    hypothesisDurationMs: 0,
    reasoningDurationMs: 0,
    confidenceDurationMs: 0,
    decisionDurationMs: 0,
    policyDurationMs: 0,
    browserActionDurationMs: 0,
    attempts: {},
    errors: 0,
    warnings: 0,
  };

  const captureResult = captureContent(input, logger);
  metrics.captureDurationMs = captureResult.durationMs;
  captureResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...captureResult.warnings);
  errors.push(...captureResult.errors);
  metrics.warnings += captureResult.warnings.length;
  metrics.errors += captureResult.errors.length;

  if (!captureResult.success || !captureResult.captured) {
    safeLog(logger, 'warn', 'ai-core-orchestrator', 'Capture failed or returned no content.', {
      requestId: input.requestId,
      errors: captureResult.errors,
      warnings: captureResult.warnings,
    });

    const durationMs = nowMs() - totalStart;
    return {
      requestId: input.requestId,
      success: false,
      metrics: { ...metrics, totalDurationMs: durationMs },
      logs,
    };
  }

  const evidenceResult = collectEvidence(captureResult.captured!, logger);
  metrics.evidenceDurationMs = evidenceResult.durationMs;
  evidenceResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...evidenceResult.warnings);
  errors.push(...evidenceResult.errors);
  metrics.warnings += evidenceResult.warnings.length;
  metrics.errors += evidenceResult.errors.length;

  // Cognitive stage (sync)
  const cognitiveResultSync = buildCognitiveState(captureResult.captured!, evidenceResult, logger);
  metrics.cognitiveDurationMs = cognitiveResultSync.durationMs;
  cognitiveResultSync.logs.forEach((entry) => logs.push(entry));
  warnings.push(...cognitiveResultSync.warnings);
  errors.push(...cognitiveResultSync.errors);
  if (!cognitiveResultSync.success) {
    warnings.push('Cognitive stage reported failure (sync), continuing.');
    metrics.warnings += 1;
  }

  const hypothesisResult = generateHypotheses(captureResult.captured, evidenceResult, logger, cognitiveResultSync.output);
  metrics.hypothesisDurationMs = hypothesisResult.durationMs;
  hypothesisResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...hypothesisResult.warnings);
  errors.push(...hypothesisResult.errors);
  metrics.warnings += hypothesisResult.warnings.length;
  metrics.errors += hypothesisResult.errors.length;

  const reasoningResult = performReasoning(captureResult.captured, evidenceResult, hypothesisResult, logger);
  metrics.reasoningDurationMs = reasoningResult.durationMs;
  reasoningResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...reasoningResult.warnings);
  errors.push(...reasoningResult.errors);
  metrics.warnings += reasoningResult.warnings.length;
  metrics.errors += reasoningResult.errors.length;

  const confidenceResult = calibrateConfidence(evidenceResult, hypothesisResult, reasoningResult, logger);
  metrics.confidenceDurationMs = confidenceResult.durationMs;
  confidenceResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...confidenceResult.warnings);
  errors.push(...confidenceResult.errors);
  metrics.warnings += confidenceResult.warnings.length;
  metrics.errors += confidenceResult.errors.length;

  const decisionResult = makeDecision(reasoningResult, confidenceResult, hypothesisResult, evidenceResult, logger);
  metrics.decisionDurationMs = decisionResult.durationMs;
  decisionResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...decisionResult.warnings);
  errors.push(...decisionResult.errors);
  metrics.warnings += decisionResult.warnings.length;
  metrics.errors += decisionResult.errors.length;

  const policyResult = applyPolicy(decisionResult, logger);
  metrics.policyDurationMs = policyResult.durationMs;
  policyResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...policyResult.warnings);
  errors.push(...policyResult.errors);
  metrics.warnings += policyResult.warnings.length;
  metrics.errors += policyResult.errors.length;

  const browserActionResult = createBrowserAction(decisionResult, policyResult, logger);
  metrics.browserActionDurationMs = browserActionResult.durationMs;
  browserActionResult.logs.forEach((entry) => logs.push(entry));
  warnings.push(...browserActionResult.warnings);
  errors.push(...browserActionResult.errors);
  metrics.warnings += browserActionResult.warnings.length;
  metrics.errors += browserActionResult.errors.length;

  const totalDurationMs = nowMs() - totalStart;
  metrics.totalDurationMs = totalDurationMs;

  if (totalDurationMs > MAX_TOTAL_MS) {
    warnings.push('AI Core processing exceeded total expected duration.');
    metrics.warnings += 1;
    logs.push(createLogEntry('ai-core-orchestrator', 'warn', 'Total processing duration exceeded threshold.', { totalDurationMs }));
    safeLog(logger, 'warn', 'ai-core-orchestrator', 'Total processing duration exceeded threshold.', { totalDurationMs });
  }

  return {
    requestId: input.requestId,
    success: true,
    capturedContent: captureResult.captured,
    evidenceResult,
    hypothesisResult,
    kbBuilderResult: undefined,
    reasoningResult,
    confidenceResult,
    decisionResult,
    policyResult,
    browserActionResult,
    metrics,
    logs,
  };
}

