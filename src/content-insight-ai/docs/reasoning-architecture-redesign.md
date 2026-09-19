# Reasoning Architecture Redesign

## 1. Current AI architecture

The current flow is centered in [src/content-insight-ai/lib/brain.ts](src/content-insight-ai/lib/brain.ts) and is effectively a classifier-driven pipeline:

1. A request arrives through the worker entry point in [src/ai.worker.ts](src/ai.worker.ts).
2. The orchestrator calls a fast path and then a text analysis path in [src/content-insight-ai/lib/semantic-analyzer.ts](src/content-insight-ai/lib/semantic-analyzer.ts).
3. Knowledge and model heuristics are applied in [src/content-insight-ai/lib/knowledge-graph.ts](src/content-insight-ai/lib/knowledge-graph.ts) and [src/content-insight-ai/lib/model-trainer.ts](src/content-insight-ai/lib/model-trainer.ts).
4. Image and video analysis happen in [src/content-insight-ai/lib/vision-analyzer.ts](src/content-insight-ai/lib/vision-analyzer.ts) and in the image/video full-analysis helpers in [src/content-insight-ai/lib/brain.ts](src/content-insight-ai/lib/brain.ts).
5. The system then collapses all signals into a single verdict such as safe, harmful, or uncertain.
6. The final decision is made very early through weighted heuristics and a recommendation threshold.

This means the current system tends to answer “is this harmful?” before it has built a meaningful evidence-based context.

## 2. Weaknesses

- It is decision-first, not evidence-first.
- It does not have a true content extraction stage.
- It does not separate modality analysis from final judgment.
- It does not explicitly model intent, context, contradiction, or missing evidence.
- Image and video analysis are largely treated as isolated classifiers.
- Text, vision, metadata, and surrounding context are fused too late and too simplistically.
- The system can over-block or under-block because it lacks a structured reasoning loop.

## 3. Proposed reasoning architecture

The redesign replaces the current single-pass verdict flow with an explicit reasoning pipeline.

### Stage 1 — Content Extraction

Collect signals without making a decision.

Inputs to collect:
- text
- OCR text
- image captions
- video frame captions
- audio transcript
- comments
- hashtags
- metadata
- URL and website context
- creator information
- previous AI results
- platform context

Output:
- a structured content bundle containing all raw signals and provenance

### Stage 2 — Individual Analysis

Each modality produces its own report.

Examples:
- text analysis report
- vision analysis report
- audio analysis report
- OCR analysis report
- metadata analysis report

Each report should return evidence, uncertainty, and confidence, not a final verdict.

### Stage 3 — Context Builder

Combine all reports into a single context object.

The context object should answer:
- what is happening
- who is involved
- why it was created
- what is the surrounding setting
- what is the likely audience
- what is the likely platform behavior

### Stage 4 — Intent Detection

The system should infer creator intent rather than only asking whether content is harmful.

Candidate intents:
- education
- medical
- news
- comedy
- entertainment
- fashion
- art
- pornography
- dating
- gambling
- fraud
- violence
- advertising
- satire
- other

Multiple intents may be active at once.

### Stage 5 — Reasoning

This is the core change.

The system should internally ask:
- why do I think this is harmful
- what evidence supports it
- what evidence contradicts it
- am I missing context
- could this be educational, medical, or satirical
- should I gather more evidence instead of deciding now

This stage should produce:
- hypotheses
- supporting evidence
- contradicting evidence
- missing evidence
- uncertainty notes
- a request-for-more-evidence flag when confidence is weak

### Stage 6 — Risk Assessment

Create a structured risk object.

Suggested fields:
- explicitness
- sexual intent
- gambling probability
- violence
- user risk
- confidence
- evidence summary
- rationale per score

### Stage 7 — Policy Engine

Only now should the system decide on action.

Possible actions:
- allow
- warn
- blur
- block
- request more analysis

Every action must include a reason and a traceable evidence summary.

### Stage 8 — Learning Hooks

Do not implement training logic yet. Add stable extension points where future learning systems can attach.

Examples:
- feedback ingestion hook
- pattern extraction hook
- policy adjustment hook
- evidence quality hook

## 4. New folder structure

```text
src/content-insight-ai/
  lib/
    reasoning-pipeline/
      types.ts
      content-extractor.ts
      modality-analyzers/
        text-analyzer.ts
        vision-analyzer.ts
        audio-analyzer.ts
        ocr-analyzer.ts
        metadata-analyzer.ts
      context-builder.ts
      intent-detector.ts
      reasoning-orchestrator.ts
      risk-assessor.ts
      policy-engine.ts
      learning-hooks.ts
      pipeline-runner.ts
```

## 5. Files that must change

- [src/content-insight-ai/lib/brain.ts](src/content-insight-ai/lib/brain.ts) — replace the current classifier-like orchestration with the new staged pipeline.
- [src/content-insight-ai/lib/semantic-analyzer.ts](src/content-insight-ai/lib/semantic-analyzer.ts) — adapt it to produce modality analysis artifacts instead of acting as the only decision engine.
- [src/content-insight-ai/lib/vision-analyzer.ts](src/content-insight-ai/lib/vision-analyzer.ts) — return evidence-rich visual analysis rather than a direct verdict.
- [src/content-insight-ai/lib/reasoning-engine.ts](src/content-insight-ai/lib/reasoning-engine.ts) — repurpose it as the reasoning stage inside the new pipeline.
- [src/content-insight-ai/lib/senior-reasoning.ts](src/content-insight-ai/lib/senior-reasoning.ts) — evolve it into a deeper evidence comparison engine rather than a simple override layer.
- [src/ai.worker.ts](src/ai.worker.ts) — update the worker contract to support staged pipeline requests and policy outputs.

## 6. Files that should remain untouched

- UI components such as [src/content-insight-ai/components/ContentInsightApp.tsx](src/content-insight-ai/components/ContentInsightApp.tsx)
- feedback form and chat UI components
- the current test UI shell in [src/test-app.tsx](src/test-app.tsx) unless it is needed only to expose the new pipeline result shape
- unrelated learning and feedback persistence files unless their interfaces are required by the new pipeline

## 7. Migration plan

Phase 1
- Introduce the new pipeline types and staged runner.
- Keep the existing public analyze API shape stable.

Phase 2
- Move text and image analysis into modality reports.
- Add context builder and intent detection.

Phase 3
- Replace the current verdict fusion with the reasoning, risk, and policy stages.
- Ensure every decision carries evidence and a reason.

Phase 4
- Add learning hooks and future extension points without turning them into active training logic.

## Design guardrails

- No final decision before evidence collection is complete.
- No single-signal blocking.
- No hardcoded policy shortcuts that bypass reasoning.
- No placeholder or fake reasoning output.
- Every final action must be explainable.
