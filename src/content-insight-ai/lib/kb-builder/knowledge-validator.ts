import type { KnowledgeGraph, KnowledgeValidationReport, NormalizedKnowledgeItem, ValidationIssue } from './types';

function hasMissingMetadata(item: NormalizedKnowledgeItem): boolean {
  return !item.source || !item.category || !item.subcategory || item.concepts.length === 0 || item.entities.length === 0;
}

export function validateKnowledge(items: NormalizedKnowledgeItem[], graph: KnowledgeGraph): KnowledgeValidationReport {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      issues.push({ type: 'duplicate', message: `Duplicate item ${item.id}`, itemId: item.id });
    }
    seen.add(item.id);

    if (hasMissingMetadata(item)) {
      issues.push({ type: 'incomplete', message: `Incomplete entry ${item.id}`, itemId: item.id });
    }

    if (item.metadata == null || Object.keys(item.metadata).length === 0) {
      issues.push({ type: 'missing_metadata', message: `Missing metadata for ${item.id}`, itemId: item.id });
    }
  }

  for (const node of graph.nodes) {
    const connected = graph.edges.some((edge) => edge.from === node.id || edge.to === node.id);
    if (!connected) {
      issues.push({ type: 'orphan_node', message: `Orphan node ${node.id}`, nodeId: node.id });
    }
  }

  for (const edge of graph.edges) {
    const fromExists = graph.nodes.some((node) => node.id === edge.from);
    const toExists = graph.nodes.some((node) => node.id === edge.to);
    if (!fromExists || !toExists) {
      issues.push({ type: 'invalid_reference', message: `Invalid reference ${edge.id}`, nodeId: edge.from });
    }
  }

  return {
    issues,
    duplicateCount: issues.filter((issue) => issue.type === 'duplicate').length,
    contradictionCount: 0,
    incompleteCount: issues.filter((issue) => issue.type === 'incomplete').length,
    metadataCount: issues.filter((issue) => issue.type === 'missing_metadata').length,
    orphanCount: issues.filter((issue) => issue.type === 'orphan_node').length,
    invalidReferenceCount: issues.filter((issue) => issue.type === 'invalid_reference').length,
  };
}
