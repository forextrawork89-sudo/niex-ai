import { extractContentSignals } from './content-extractor';
import { buildContext } from './context-builder';
import { detectIntent } from './intent-detector';
import { runReasoning } from './reasoning-orchestrator';
import { applyPolicy } from './policy-engine';
import type { PipelineInput, PipelineStageResult, ReasoningPipelineResult } from './types';

export function runReasoningPipeline(input: PipelineInput): ReasoningPipelineResult {
  const { reports } = extractContentSignals(input);
  const context = buildContext(input, reports);
  const intents = detectIntent(input, context);
  const { reasoning, riskScores } = runReasoning(input, context, reports);
  const policyAction = applyPolicy(riskScores, reasoning);

  const stageResults: PipelineStageResult[] = [
    { stage: 'content-extraction', completed: true, summary: 'Signals collected from the provided content.' },
    { stage: 'modality-analysis', completed: true, summary: 'Text and metadata reports generated.' },
    { stage: 'context-builder', completed: true, summary: `Context built with intents: ${intents.join(', ')}` },
    { stage: 'intent-detection', completed: true, summary: `Detected intents: ${intents.join(', ')}` },
    { stage: 'reasoning', completed: true, summary: reasoning.explanation },
    { stage: 'risk-assessment', completed: true, summary: 'Structured risk scores computed.' },
    { stage: 'policy-engine', completed: true, summary: policyAction.reason },
  ];

  return {
    pipelineSummary: { stageResults },
    modalityReports: reports,
    context: {
      ...context,
      intentSummary: `${context.intentSummary}; detected=${intents.join(', ')}`,
    },
    riskScores,
    reasoningSummary: reasoning,
    policyAction,
  };
}
