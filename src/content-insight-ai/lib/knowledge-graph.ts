// ============================================================
// Knowledge Graph — AI ning bilim tarmog'i
// Kontentlar, qoidalar, patternlar orasidagi aloqalarni saqlaydi
// ============================================================

import { syncGet, syncSet } from './storage-engine';

export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'pattern' | 'rule' | 'example' | 'category' | 'feedback';
  label: string;
  content_type?: string;
  properties: Record<string, string | number | boolean>;
  confidence: number;
  source: 'default' | 'learned' | 'manual' | 'inferred';
  created_at: string;
  updated_at: string;
  access_count: number;
}

export interface KnowledgeEdge {
  id: string;
  from: string;
  to: string;
  relation: EdgeRelation;
  weight: number;
  created_at: string;
}

export type EdgeRelation =
  | 'is_a'           // "nudity" is_a "sexual_content"
  | 'contains'       // "violent_video" contains "gore"
  | 'similar_to'     // "porn" similar_to "nsfw"
  | 'opposite_of'    // "safe" opposite_of "harmful"
  | 'causes'         // "false_negative" causes "missed_harmful"
  | 'prevents'       // "blocking_rule" prevents "exposure"
  | 'learned_from'   // "new_pattern" learned_from "feedback_123"
  | 'part_of'        // "keyword_xxx" part_of "sexual_pattern"
  | 'modifies'       // "educational_context" modifies "medical_nudity"
  | 'co_occurs';     // "gambling" co_occurs "addiction"

const STORAGE_KEY = 'knowledge_graph';

interface GraphData {
  nodes: Record<string, KnowledgeNode>;
  edges: KnowledgeEdge[];
}

// In-memory cache to avoid repeated disk reads, plus debounced writes
let _graphCache: GraphData | null = null;
let _saveTimer: ReturnType<typeof setTimeout> | null = null;
let _dirty = false;
const SAVE_DEBOUNCE_MS = 500;

function loadGraph(): GraphData {
  if (_graphCache) return _graphCache;
  _graphCache = syncGet<GraphData>(STORAGE_KEY, { nodes: {}, edges: [] });
  return _graphCache;
}

function saveGraph(graph: GraphData): void {
  _graphCache = graph;
  _dirty = true;
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    if (_dirty && _graphCache) {
      syncSet(STORAGE_KEY, _graphCache);
      _dirty = false;
    }
  }, SAVE_DEBOUNCE_MS);
}

// Force flush (call before page unload)
export function flushGraph(): void {
  if (_dirty && _graphCache) {
    syncSet(STORAGE_KEY, _graphCache);
    _dirty = false;
  }
}

// Register unload handler in browser
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushGraph);
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ============================================================
// Node Operations
// ============================================================

export function addNode(params: Omit<KnowledgeNode, 'id' | 'created_at' | 'updated_at' | 'access_count'>): KnowledgeNode {
  const graph = loadGraph();
  const node: KnowledgeNode = {
    ...params,
    id: `node-${genId()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    access_count: 0,
  };
  graph.nodes[node.id] = node;
  saveGraph(graph);
  return node;
}

export function getNode(id: string): KnowledgeNode | null {
  const graph = loadGraph();
  const node = graph.nodes[id];
  if (node) {
    node.access_count++;
    graph.nodes[id] = node;
    saveGraph(graph);
  }
  return node || null;
}

export function findNodes(filter: Partial<Pick<KnowledgeNode, 'type' | 'content_type' | 'source'>>): KnowledgeNode[] {
  const graph = loadGraph();
  return Object.values(graph.nodes).filter((node) => {
    if (filter.type && node.type !== filter.type) return false;
    if (filter.content_type && node.content_type !== filter.content_type) return false;
    if (filter.source && node.source !== filter.source) return false;
    return true;
  });
}

export function findNodesByLabel(label: string): KnowledgeNode[] {
  const graph = loadGraph();
  const lower = label.toLowerCase();
  return Object.values(graph.nodes).filter(
    (n) => n.label.toLowerCase().includes(lower) || Object.values(n.properties).some((v) => String(v).toLowerCase().includes(lower))
  );
}

export function updateNodeConfidence(id: string, delta: number): void {
  const graph = loadGraph();
  if (graph.nodes[id]) {
    graph.nodes[id].confidence = Math.max(0.01, Math.min(0.99, graph.nodes[id].confidence + delta));
    graph.nodes[id].updated_at = new Date().toISOString();
    saveGraph(graph);
  }
}

export function removeNode(id: string): void {
  const graph = loadGraph();
  delete graph.nodes[id];
  graph.edges = graph.edges.filter((e) => e.from !== id && e.to !== id);
  saveGraph(graph);
}

// ============================================================
// Edge Operations
// ============================================================

export function addEdge(from: string, to: string, relation: EdgeRelation, weight = 1): KnowledgeEdge {
  const graph = loadGraph();
  const existing = graph.edges.find((e) => e.from === from && e.to === to && e.relation === relation);
  if (existing) {
    existing.weight = Math.min(existing.weight + 0.1, 2);
    saveGraph(graph);
    return existing;
  }

  const edge: KnowledgeEdge = {
    id: `edge-${genId()}`,
    from,
    to,
    relation,
    weight,
    created_at: new Date().toISOString(),
  };
  graph.edges.push(edge);
  saveGraph(graph);
  return edge;
}

export function getEdgesFrom(nodeId: string): KnowledgeEdge[] {
  return loadGraph().edges.filter((e) => e.from === nodeId);
}

export function getEdgesTo(nodeId: string): KnowledgeEdge[] {
  return loadGraph().edges.filter((e) => e.to === nodeId);
}

export function getRelatedNodes(nodeId: string, maxDepth = 2): KnowledgeNode[] {
  const graph = loadGraph();
  const visited = new Set<string>();
  const result: KnowledgeNode[] = [];
  const queue: { id: string; depth: number }[] = [{ id: nodeId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id) || current.depth > maxDepth) continue;
    visited.add(current.id);

    if (current.id !== nodeId && graph.nodes[current.id]) {
      result.push(graph.nodes[current.id]);
    }

    if (current.depth < maxDepth) {
      for (const edge of graph.edges) {
        if (edge.from === current.id && !visited.has(edge.to)) {
          queue.push({ id: edge.to, depth: current.depth + 1 });
        }
        if (edge.to === current.id && !visited.has(edge.from)) {
          queue.push({ id: edge.from, depth: current.depth + 1 });
        }
      }
    }
  }

  return result;
}

// ============================================================
// Graph Intelligence — query the knowledge
// ============================================================

export function inferHarmfulness(keywords: string[]): { score: number; relevant_nodes: KnowledgeNode[]; reasoning: string[] } {
  const graph = loadGraph();
  const allNodes = Object.values(graph.nodes);
  const reasoning: string[] = [];
  let totalScore = 0;
  let matchCount = 0;
  const relevant: KnowledgeNode[] = [];

  // Helper: aniqlaymiz node harmful'mi xavfsizmi
  const isNodeHarmful = (n: KnowledgeNode): boolean => {
    if (n.properties.action === 'block') return true;
    if (n.properties.harmful === true) return true;
    if (n.properties.semantic_label === 'harmful') return true;
    if (n.properties.semantic_label === 'critical') return true;
    const labelLower = n.label.toLowerCase();
    if (labelLower.includes('harmful_') || labelLower.includes('kb_harmful')) return true;
    const pathProp = String(n.properties.path || '').toLowerCase();
    if (pathProp.includes('harmful_examples')) return true;
    const folderProp = String(n.properties.folder || '').toLowerCase();
    if (folderProp === 'harmful_examples') return true;
    return false;
  };

  // 🔑 Helper: harmful_indicator va context_modifier QOIDALAR — neytral, score'ga ta'sir qilmaydi
  // Bu folderlar (clothing, body_shape, pose, skin_visibility) HUMAN-WRITTEN RULES,
  // ular o'zlari harmful YOKI safe emas, balki TAHLIL qoidalari
  const isNeutralRule = (n: KnowledgeNode): boolean => {
    const sem = String(n.properties.semantic_label || '').toLowerCase();
    if (sem === 'harmful_indicator' || sem === 'context_modifier') return true;
    const folderProp = String(n.properties.folder || '').toLowerCase();
    const neutralFolders = ['clothing', 'body_shape', 'pose', 'skin_visibility', 'context', 'intent',
      'emotion', 'environment', 'scene_understanding', 'objects', 'camera_focus', 'movement',
      'audio_patterns', 'relationship'];
    if (neutralFolders.includes(folderProp)) return true;
    return false;
  };

  for (const keyword of keywords) {
    const lower = keyword.toLowerCase();
    for (const node of allNodes) {
      const labelMatch = node.label.toLowerCase().includes(lower);
      const propMatch = Object.values(node.properties).some((v) => String(v).toLowerCase().includes(lower));

      if (labelMatch || propMatch) {
        relevant.push(node);

        if (node.type === 'pattern' || node.type === 'rule' || node.type === 'category') {
          const isHarmful = isNodeHarmful(node);
          const neutral = isNeutralRule(node);

          if (neutral) {
            // Neytral qoida — score'ga qo'shmaymiz, lekin reasoning'ga yozamiz
            reasoning.push(`${node.label}: neutral_rule (analysis rule, no verdict)`);
          } else {
            const delta = isHarmful ? node.confidence : -node.confidence;
            totalScore += delta;
            matchCount++;
            reasoning.push(`${node.label}: ${isHarmful ? 'harmful' : 'safe'} (confidence: ${(node.confidence * 100).toFixed(0)}%)`);
          }
        }

        // Check related nodes
        const related = getRelatedNodes(node.id, 1);
        for (const rel of related) {
          if (rel.type === 'category') {
            if (isNeutralRule(rel)) {
              reasoning.push(`Related category "${rel.label}": neutral rule`);
            } else {
              const catHarmful = isNodeHarmful(rel);
              totalScore += catHarmful ? 0.15 : -0.1;
              reasoning.push(`Related category "${rel.label}": ${catHarmful ? 'harmful' : 'safe'}`);
            }
          }
        }
      }
    }
  }

  const normalizedScore = matchCount > 0 ? totalScore / matchCount : 0;
  const score = 1 / (1 + Math.exp(-normalizedScore * 3));

  return { score, relevant_nodes: relevant, reasoning };
}

export function learnFromFeedback(feedbackId: string, keywords: string[], isHarmful: boolean, contentType: string): KnowledgeNode {
  const patternNode = addNode({
    type: 'pattern',
    label: keywords.slice(0, 5).join(', '),
    content_type: contentType,
    properties: {
      keywords: keywords.join(','),
      harmful: isHarmful,
      action: isHarmful ? 'block' : 'allow',
      feedback_id: feedbackId,
    },
    confidence: 0.7,
    source: 'learned',
  });

  // Link to category
  const categoryLabel = isHarmful ? `harmful_${contentType}` : `safe_${contentType}`;
  let categoryNode = findNodes({ type: 'category' }).find((n) => n.label === categoryLabel);

  if (!categoryNode) {
    categoryNode = addNode({
      type: 'category',
      label: categoryLabel,
      content_type: contentType,
      properties: { harmful: isHarmful },
      confidence: 0.8,
      source: 'inferred',
    });
  }

  addEdge(patternNode.id, categoryNode.id, 'is_a');

  // Link similar existing patterns
  const existingPatterns = findNodes({ type: 'pattern', content_type: contentType });
  for (const existing of existingPatterns) {
    if (existing.id === patternNode.id) continue;
    const existingKw = String(existing.properties.keywords || '').split(',');
    const overlap = keywords.filter((k) => existingKw.includes(k)).length;
    if (overlap >= 2) {
      addEdge(patternNode.id, existing.id, 'similar_to', overlap / keywords.length);
    }
  }

  return patternNode;
}

export function getGraphStats() {
  const graph = loadGraph();
  const nodes = Object.values(graph.nodes);
  return {
    total_nodes: nodes.length,
    total_edges: graph.edges.length,
    by_type: {
      concept: nodes.filter((n) => n.type === 'concept').length,
      pattern: nodes.filter((n) => n.type === 'pattern').length,
      rule: nodes.filter((n) => n.type === 'rule').length,
      example: nodes.filter((n) => n.type === 'example').length,
      category: nodes.filter((n) => n.type === 'category').length,
      feedback: nodes.filter((n) => n.type === 'feedback').length,
    },
    by_source: {
      default: nodes.filter((n) => n.source === 'default').length,
      learned: nodes.filter((n) => n.source === 'learned').length,
      manual: nodes.filter((n) => n.source === 'manual').length,
      inferred: nodes.filter((n) => n.source === 'inferred').length,
    },
    avg_confidence: nodes.length > 0 ? nodes.reduce((s, n) => s + n.confidence, 0) / nodes.length : 0,
    most_accessed: [...nodes].sort((a, b) => b.access_count - a.access_count).slice(0, 5).map((n) => n.label),
  };
}

// ============================================================
// Initialize with default knowledge
// ============================================================

export function initializeDefaultKnowledge(): void {
  const graph = loadGraph();
  if (Object.keys(graph.nodes).length > 0) return;

  const categories = [
    { label: 'sexual_content', harmful: true },
    { label: 'violence', harmful: true },
    { label: 'drugs', harmful: true },
    { label: 'gambling', harmful: true },
    { label: 'self_harm', harmful: true },
    { label: 'cyber_threats', harmful: true },
    { label: 'fraud', harmful: true },
    { label: 'education', harmful: false },
    { label: 'medical', harmful: false },
    { label: 'news', harmful: false },
    { label: 'entertainment', harmful: false },
    { label: 'sports', harmful: false },
    { label: 'art', harmful: false },
  ];

  const nodeIds: Record<string, string> = {};

  for (const cat of categories) {
    const node = addNode({
      type: 'category',
      label: cat.label,
      properties: { harmful: cat.harmful },
      confidence: 0.9,
      source: 'default',
    });
    nodeIds[cat.label] = node.id;
  }

  // Add relationships
  const relations: [string, string, EdgeRelation][] = [
    ['sexual_content', 'violence', 'co_occurs'],
    ['drugs', 'self_harm', 'co_occurs'],
    ['gambling', 'fraud', 'co_occurs'],
    ['education', 'medical', 'similar_to'],
    ['education', 'news', 'similar_to'],
    ['entertainment', 'sports', 'similar_to'],
    ['entertainment', 'art', 'similar_to'],
  ];

  for (const [from, to, rel] of relations) {
    if (nodeIds[from] && nodeIds[to]) {
      addEdge(nodeIds[from], nodeIds[to], rel);
    }
  }
}
