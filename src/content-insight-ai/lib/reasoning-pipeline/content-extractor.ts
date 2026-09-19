import type { PipelineInput, ModalityReport, EvidenceItem } from './types';

export function extractContentSignals(input: PipelineInput): { reports: ModalityReport[]; rawSignals: string[] } {
  const reports: ModalityReport[] = [];
  const rawSignals: string[] = [];

  if (input.text) {
    rawSignals.push(input.text);
    reports.push({
      modality: 'text',
      findings: ['Text content was extracted for semantic reasoning.'],
      confidence: 0.7,
      evidence: [{
        source: 'text',
        label: 'text_signal',
        strength: 0.7,
        supporting: true,
        explanation: 'The request contains textual content that can inform intent and context.',
      }],
      summary: 'Text content extracted for later reasoning.',
    });
  }

  if (input.metadata) {
    const metadataText = JSON.stringify(input.metadata);
    rawSignals.push(metadataText);
    reports.push({
      modality: 'metadata',
      findings: ['Metadata was extracted for contextual assessment.'],
      confidence: 0.6,
      evidence: [{
        source: 'metadata',
        label: 'metadata_signal',
        strength: 0.6,
        supporting: true,
        explanation: 'Metadata may reveal source, audience intent, or distribution context.',
      }],
      summary: 'Metadata extracted for contextual reasoning.',
    });
  }

  if (!reports.length) {
    reports.push({
      modality: 'metadata',
      findings: ['No explicit signals were supplied.'],
      confidence: 0.3,
      evidence: [],
      summary: 'The pipeline did not receive any direct content evidence.',
    });
  }

  return { reports, rawSignals };
}
