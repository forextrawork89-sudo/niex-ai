import type { CapturedContent, EvidenceCollectionResult, CognitiveResult, CognitiveState, Logger } from './types';
import { createLogEntry, safeLog } from './helpers';
import { analyzeText, extractEntities } from '../semantic-analyzer';
import { inferHarmfulness } from '../knowledge-graph';

const MAX_DURATION_MS = 400;

export function buildCognitiveState(
  captured: CapturedContent,
  evidence: EvidenceCollectionResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): CognitiveResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Perception -> Feature Extraction
    const text = captured.text || '';
    const semantic = analyzeText(text);

    // Entity recognition (real work: reuse extractor)
    const rawEntities = extractEntities(text);
    const entities = rawEntities.map((e, idx) => ({
      id: `ent-${idx}-${e.type}`,
      name: e.text,
      type: e.type,
      modality: 'text',
      span: { start: e.start, end: e.end },
      confidence: 0.85,
      source: 'semantic-analyzer',
    }));

    // Relationship extraction (conservative, deterministic co-occurrence within sentence)
    const relations = [] as any[];
    const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const present = entities.filter((ent) => s.includes(ent.name));
      for (let a = 0; a < present.length; a++) {
        for (let b = a + 1; b < present.length; b++) {
          relations.push({
            id: `rel-${present[a].id}-${present[b].id}`,
            type: 'co_occurs',
            subjectId: present[a].id,
            objectId: present[b].id,
            confidence: 0.75,
            description: 'Entities co-occur in sentence',
          });
        }
      }
    }

    // World knowledge retrieval via knowledge graph inference
    const knowledge = inferHarmfulness([...semantic.topics, ...entities.map((e) => e.name)]);

    // Evidence graph construction using real evidence items
    const egNodes = evidence.evidenceItems.map((it) => ({
      id: it.id,
      label: it.label,
      type: it.modality,
      confidence: it.confidence,
      source: it.source,
    }));
    const kgNodes = knowledge.relevant_nodes.map((n) => ({ id: n.id, label: n.label, type: n.type, confidence: n.confidence, source: n.source }));

    // Simple edges: link evidence to knowledge categories when affectedCategories match node labels
    const egEdges: any[] = [];
    for (const ev of evidence.evidenceItems) {
      for (const kn of kgNodes) {
        const match = ev.affectedCategories?.some((c) => kn.label.toLowerCase().includes(String(c).toLowerCase()));
        if (match) {
          egEdges.push({ id: `edge-${ev.id}-${kn.id}`, sourceId: ev.id, targetId: kn.id, relation: 'supports', confidence: ev.confidence * 0.8 });
        }
      }
    }

    // KB evidence summary and graph relationships
    const counterHypotheses: any[] = [];

    // Contradiction detection: find evidence ids that support vs contradict same categories
    const contradictions: any[] = [];
    const categoryToSupport: Record<string, string[]> = {};
    for (const it of evidence.evidenceItems) {
      for (const cat of it.affectedCategories || []) {
        if (it.direction === 'supports') (categoryToSupport[cat] ??= []).push(it.id);
        if (it.direction === 'contradicts') (categoryToSupport[`_${cat}`] ??= []).push(it.id);
      }
    }
    for (const cat of Object.keys(categoryToSupport)) {
      if (cat.startsWith('_')) continue;
      const supports = categoryToSupport[cat] || [];
      const contradicts = categoryToSupport[`_${cat}`] || [];
      if (supports.length > 0 && contradicts.length > 0) {
        contradictions.push({ id: `contr-${cat}`, description: `Conflict on ${cat}`, evidenceIds: [...supports, ...contradicts], severity: Math.min(0.99, (supports.length + contradicts.length) / 10) });
      }
    }

    // Belief state: map posterior probabilities
    const beliefs: Record<string, number> = {};

    // Risk estimation: use the knowledge graph score if no explicit hypothesis yet
    const riskEstimate = { score: knowledge.score, category: 'knowledge_graph', rationale: `Knowledge graph inference score ${(knowledge.score).toFixed(2)}` };

    const cognitiveState: CognitiveState = {
      perception: { text, contentType: captured.contentType, metadata: captured.metadata, timestamp: undefined },
      features: { tokens: semantic.tokens, stems: semantic.stems, topics: semantic.topics, sentiment: semantic.sentiment, toxicity: semantic.toxicity, intent: semantic.intent, language: semantic.language, complexity: semantic.complexity },
      entities,
      relations,
      contextMemory: {},
      worldKnowledge: { retrieved: knowledge.relevant_nodes.map((n) => n.label), score: knowledge.score },
      evidenceGraph: { nodes: [...egNodes, ...kgNodes], edges: egEdges },
      hypotheses: [],
      counterHypotheses: [],
      contradictions,
      beliefs,
      riskEstimate,
    };

    const durationMs = Date.now() - start;
    logs.push(createLogEntry('cognitive', 'info', 'Cognitive state built.', { nodeCount: cognitiveState.evidenceGraph.nodes.length, edgeCount: cognitiveState.evidenceGraph.edges.length }));
    safeLog(logger, 'info', 'cognitive', 'Cognitive state built.', { durationMs });

    if (durationMs > MAX_DURATION_MS) warnings.push('Cognitive build exceeded expected duration.');

    return { success: true, output: cognitiveState, summary: 'Cognitive state constructed.', warnings, errors, durationMs, logs };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Cognitive build failed.';
    errors.push(message);
    const entry = createLogEntry('cognitive', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'cognitive', message);
    return { success: false, output: null as any, summary: 'Cognitive build failed.', warnings, errors, durationMs, logs };
  }
}
