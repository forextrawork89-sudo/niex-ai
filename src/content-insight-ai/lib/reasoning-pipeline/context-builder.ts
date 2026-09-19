import type { ContextSummary, ModalityReport, PipelineInput } from './types';

export function buildContext(input: PipelineInput, reports: ModalityReport[]): ContextSummary {
  const text = input.text || '';
  const lowered = text.toLowerCase();

  const hasEducationalContext = /education|medical|prevent|protect|warning|research|historical/i.test(lowered);
  const hasHarmfulIntent = /porn|explicit|download|adult|gamble|scam|violence|weapon/i.test(lowered);

  return {
    description: hasEducationalContext ? 'The content appears to be educational or informational.' : 'The content appears to be user-facing media content.',
    actors: ['creator', 'audience'],
    intentSummary: hasHarmfulIntent ? 'harmful intent likely' : 'educational or informational intent likely',
    audience: 'general audience',
    surroundingContext: reports.map((report) => `${report.modality}: ${report.summary}`),
  };
}
