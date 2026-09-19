import type { CapturedContent, EvidenceItem, Hypothesis } from './types';
import type { NormalizedKnowledgeItem } from '../kb-builder/types';

export type GraphNodeType = 'entity' | 'action' | 'relationship' | 'intention' | 'context' | 'temporal' | 'modality' | 'source' | 'evidence' | 'hypothesis';
export type GraphEdgeType = 'supports' | 'contradicts' | 'causes' | 'explains' | 'belongs_to' | 'depends_on' | 'temporally_before' | 'temporally_after' | 'same_entity' | 'possible_intent' | 'alternative_interpretation' | 'related_to';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  value?: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  type: GraphEdgeType;
  from: string;
  to: string;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface CognitiveReasoningGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphAnalysisResult {
  nodesCount: number;
  edgesCount: number;
  contradictions: string[];
  alternativeExplanations: string[];
  revisedHypotheses: Hypothesis[];
  beliefRevisionSummary: string;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function buildNode(id: string, type: GraphNodeType, label: string, value?: string, weight = 1, metadata?: Record<string, unknown>): GraphNode {
  return { id, type, label, value, weight, metadata };
}

export function buildCognitiveReasoningGraph(input: {
  captured: CapturedContent;
  evidenceItems: EvidenceItem[];
  hypotheses: Hypothesis[];
  kbItems?: NormalizedKnowledgeItem[];
  contextHints?: string[];
}): CognitiveReasoningGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  const addNode = (node: GraphNode) => {
    if (!seen.has(node.id)) {
      nodes.push(node);
      seen.add(node.id);
    }
  };

  const addEdge = (edge: GraphEdge) => edges.push(edge);

  addNode(buildNode('root', 'context', 'root', input.captured.text, 1, { source: 'captured' }));

  const metadata = (input.captured.metadata || {}) as Record<string, unknown>;
  const entities = Array.isArray(metadata.entities) ? metadata.entities as string[] : [];
  const actions = Array.isArray(metadata.actions) ? metadata.actions as string[] : [];
  const intentions = Array.isArray(metadata.intentions) ? metadata.intentions as string[] : [];
  const contexts = Array.isArray(metadata.context) ? metadata.context as string[] : [];
  const temporal = Array.isArray(metadata.temporal) ? metadata.temporal as string[] : [];
  const source = String((metadata.source as string) || 'unknown');

  for (const entity of entities) {
    addNode(buildNode(`entity:${normalize(entity)}`, 'entity', entity, entity, 0.9));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: `entity:${normalize(entity)}`, to: 'root', weight: 0.8 });
  }

  for (const action of actions) {
    addNode(buildNode(`action:${normalize(action)}`, 'action', action, action, 0.8));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: `action:${normalize(action)}`, to: 'root', weight: 0.7 });
  }

  for (const intention of intentions) {
    addNode(buildNode(`intention:${normalize(intention)}`, 'intention', intention, intention, 0.85));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'possible_intent', from: `intention:${normalize(intention)}`, to: 'root', weight: 0.75 });
  }

  for (const context of [...contexts, ...(input.contextHints || [])]) {
    addNode(buildNode(`context:${normalize(context)}`, 'context', context, context, 0.7));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: `context:${normalize(context)}`, to: 'root', weight: 0.6 });
  }

  for (const time of temporal) {
    addNode(buildNode(`temporal:${normalize(time)}`, 'temporal', time, time, 0.7));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'temporally_before', from: `temporal:${normalize(time)}`, to: 'root', weight: 0.6 });
  }

  addNode(buildNode('modality:text', 'modality', input.captured.contentType || 'text', input.captured.contentType || 'text', 0.8));
  addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: 'modality:text', to: 'root', weight: 0.5 });

  addNode(buildNode(`source:${normalize(source)}`, 'source', source, source, 0.7));
  addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: `source:${normalize(source)}`, to: 'root', weight: 0.5 });

  for (const evidence of input.evidenceItems) {
    const evidenceNodeId = `evidence:${evidence.id}`;
    addNode(buildNode(evidenceNodeId, 'evidence', evidence.label, evidence.description, evidence.confidence));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: evidenceNodeId, to: 'root', weight: evidence.importance });

    if (evidence.direction === 'supports') {
      addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'supports', from: evidenceNodeId, to: `hypothesis:${input.hypotheses[0]?.id || 'unknown'}`, weight: evidence.confidence });
    }
    if (evidence.direction === 'contradicts') {
      addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'contradicts', from: evidenceNodeId, to: `hypothesis:${input.hypotheses[0]?.id || 'unknown'}`, weight: evidence.confidence });
    }
  }

  if (input.kbItems && input.kbItems.length > 0) {
    for (const kbItem of input.kbItems.slice(0, 8)) {
      const kbNodeId = `kb:${normalize(kbItem.id)}`;
      addNode(buildNode(kbNodeId, 'context', kbItem.category || 'kb', kbItem.subcategory || kbItem.category || 'kb', kbItem.confidence, {
        intent: kbItem.intent,
        risk: kbItem.risk,
        tags: kbItem.tags,
      }));
      addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'explains', from: kbNodeId, to: 'root', weight: kbItem.confidence });

      for (const relationship of kbItem.relationships || []) {
        const targetId = normalize(String(relationship.target));
        addNode(buildNode(`relation:${targetId}`, 'relationship', String(relationship.target), String(relationship.target), relationship.confidence, { relation: relationship.type }));
        addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'related_to', from: kbNodeId, to: `relation:${targetId}`, weight: relationship.confidence });
      }
    }
  }

  for (const hypothesis of input.hypotheses) {
    const hypothesisNodeId = `hypothesis:${hypothesis.id}`;
    addNode(buildNode(hypothesisNodeId, 'hypothesis', hypothesis.category, hypothesis.statement, hypothesis.posteriorProbability));
    addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'belongs_to', from: hypothesisNodeId, to: 'root', weight: hypothesis.posteriorProbability });
  }

  for (const hypothesis of input.hypotheses) {
    const from = `hypothesis:${hypothesis.id}`;
    const alternatives = input.hypotheses.filter((other) => other.id !== hypothesis.id);
    for (const alt of alternatives) {
      addEdge({ id: `edge:${Math.random().toString(36).slice(2, 8)}`, type: 'alternative_interpretation', from, to: `hypothesis:${alt.id}`, weight: 0.5 });
    }
  }

  return { nodes, edges };
}

export function analyzeCognitiveReasoningGraph(
  graph: CognitiveReasoningGraph,
  evidenceItems: EvidenceItem[],
  hypotheses: Hypothesis[],
  kbItems?: NormalizedKnowledgeItem[],
): GraphAnalysisResult {
  const contradictions = evidenceItems.filter((item) => item.direction === 'contradicts').map((item) => item.description);
  const alternativeExplanations = hypotheses.slice(1).map((item) => `${item.category}: ${item.statement}`);

  const revisedHypotheses = hypotheses.map((hypothesis) => {
    const supportWeight = evidenceItems.filter((item) => hypothesis.evidenceFor.includes(item.id)).reduce((sum, item) => sum + item.confidence * (item.importance ?? 0.7), 0);
    const contradictionWeight = evidenceItems.filter((item) => hypothesis.evidenceAgainst.includes(item.id)).reduce((sum, item) => sum + item.confidence * (item.importance ?? 0.7), 0);
    const contextWeight = graph.nodes.some((node) => node.label.toLowerCase().includes('medical')) ? 0.12 : 0.0;
    const revised = Math.max(0.01, Math.min(0.99, hypothesis.posteriorProbability - contradictionWeight * 0.15 + supportWeight * 0.1 - contextWeight));
    const status: Hypothesis['status'] = revised >= 0.7 ? 'confirmed' : revised <= 0.3 ? 'rejected' : 'uncertain';
    return { ...hypothesis, posteriorProbability: revised, status };
  });

  const beliefRevisionSummary = contradictions.length > 0
    ? `Contradictory evidence detected; revised ${revisedHypotheses.length} hypotheses.`
    : `No direct contradictions; kept ${revisedHypotheses.length} hypotheses.`;

  return {
    nodesCount: graph.nodes.length,
    edgesCount: graph.edges.length,
    contradictions,
    alternativeExplanations,
    revisedHypotheses,
    beliefRevisionSummary,
  };
}
