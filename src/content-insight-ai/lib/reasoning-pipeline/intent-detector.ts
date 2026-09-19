import type { ContextSummary, PipelineInput } from './types';

export function detectIntent(input: PipelineInput, context: ContextSummary): string[] {
  const text = input.text || '';
  const lower = text.toLowerCase();
  const intents: string[] = [];

  if (/education|medical|prevent|protect|research|historical/i.test(lower)) intents.push('education');
  if (/porn|explicit|adult/i.test(lower)) intents.push('pornography');
  if (/gamble|casino|bet|slot/i.test(lower)) intents.push('gambling');
  if (/scam|fraud|fake|phishing/i.test(lower)) intents.push('fraud');
  if (/violence|weapon|attack/i.test(lower)) intents.push('violence');
  if (!intents.length) intents.push('other');

  return intents;
}
