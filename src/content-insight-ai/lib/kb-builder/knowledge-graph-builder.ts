import type { KnowledgeEdge, KnowledgeGraph, KnowledgeNode, NormalizedKnowledgeItem } from './types';

function buildNode(item: NormalizedKnowledgeItem): KnowledgeNode {
  return {
    id: `node-${item.id}`,
    label: item.category,
    type: item.category === 'policy' ? 'policy' : 'concept',
    properties: { source: item.source, category: item.category, subcategory: item.subcategory },
    confidence: item.confidence,
  };
}

function buildEdge(from: string, to: string, type: KnowledgeEdge['type'], weight: number): KnowledgeEdge {
  return { id: `edge-${from}-${to}-${type}`, from, to, type, weight };
}

export function buildKnowledgeGraph(items: NormalizedKnowledgeItem[]): KnowledgeGraph {
  const nodes: KnowledgeNode[] = [];
  const edges: KnowledgeEdge[] = [];
  const seenNodes = new Set<string>();
  const seenEdges = new Set<string>();

  for (const item of items) {
    const node = buildNode(item);
    if (!seenNodes.has(node.id)) {
      nodes.push(node);
      seenNodes.add(node.id);
    }

    for (const relationship of item.relationships) {
      const relNodeId = `node-${item.id}-${relationship.target}`;
      if (!seenNodes.has(relNodeId)) {
        nodes.push({ id: relNodeId, label: relationship.target, type: 'relationship', properties: { relation: relationship.type }, confidence: relationship.confidence });
        seenNodes.add(relNodeId);
      }
      const edgeKey = `${node.id}-${relNodeId}-${relationship.type}`;
      if (!seenEdges.has(edgeKey)) {
        edges.push(buildEdge(node.id, relNodeId, relationship.type as KnowledgeEdge['type'], relationship.confidence));
        seenEdges.add(edgeKey);
      }
    }
  }

  return { nodes, edges };
}
