export type KBSourceKind = 'huggingface' | 'kaggle' | 'github' | 'openimages' | 'commoncrawl' | 'official' | 'custom' | 'text' | 'json' | 'csv' | 'txt' | 'markdown' | 'html' | 'xml' | 'pdf' | 'image' | 'video' | 'audio';

export interface DatasetSourceSpec {
  id: string;
  name: string;
  kind: KBSourceKind;
  url: string;
  format?: string;
  checksum?: string;
  metadata?: Record<string, unknown>;
}

export interface DatasetRecord {
  id: string;
  source: string;
  sourceType: KBSourceKind;
  contentType: string;
  text: string;
  checksum: string;
  dedupKey: string;
  metadata: Record<string, unknown>;
}

export interface DatasetCollection {
  id: string;
  sources: DatasetSourceSpec[];
  records: DatasetRecord[];
  createdAt: string;
  checksum: string;
  metadata: Record<string, unknown>;
}

export interface ExtractedKnowledgeItem {
  id: string;
  source: string;
  sourceKind: KBSourceKind;
  contentType: string;
  rawText: string;
  structured?: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface NormalizedKnowledgeItem {
  id: string;
  source: string;
  category: string;
  subcategory: string;
  concepts: string[];
  entities: string[];
  relationships: Array<{ type: string; target: string; confidence: number }>;
  context: string[];
  intent: string;
  evidence: Array<{ source: string; snippet: string; confidence: number }>;
  confidence: number;
  language: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  timestamps: {
    createdAt: string;
    updatedAt: string;
    sourceFetchedAt?: string;
  };
  metadata: Record<string, unknown>;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'concept' | 'entity' | 'action' | 'intention' | 'context' | 'relationship' | 'policy';
  properties: Record<string, unknown>;
  confidence: number;
}

export interface KnowledgeEdge {
  id: string;
  from: string;
  to: string;
  type: 'supports' | 'contradicts' | 'causes' | 'belongs_to' | 'related_to' | 'child_of' | 'parent_of' | 'temporal_before' | 'temporal_after' | 'similar_to';
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface ValidationIssue {
  type: 'duplicate' | 'contradiction' | 'incomplete' | 'missing_metadata' | 'orphan_node' | 'invalid_reference';
  message: string;
  itemId?: string;
  nodeId?: string;
}

export interface KnowledgeValidationReport {
  issues: ValidationIssue[];
  duplicateCount: number;
  contradictionCount: number;
  incompleteCount: number;
  metadataCount: number;
  orphanCount: number;
  invalidReferenceCount: number;
}

export interface CompressionChunk {
  index: number;
  items: NormalizedKnowledgeItem[];
}

export interface KnowledgeCompressionResult {
  chunks: CompressionChunk[];
  index: Record<string, { chunkIndex: number; offset: number }>;
  serialized: Uint8Array;
  serializedSize: number;
  chunkCount: number;
}

export interface SearchResult {
  item: NormalizedKnowledgeItem;
  score: number;
  reasons: string[];
  relevance: 'high' | 'medium' | 'low' | 'contradicting' | 'ambiguous';
  evidenceType: 'harmful' | 'safe' | 'ambiguous' | 'neutral';
}

export interface KnowledgeBaseVersion {
  version: string;
  checksum: string;
  changelog: string[];
  migrationInfo: string[];
  createdAt: string;
}

export interface KBBuilderResult {
  success: boolean;
  collection: DatasetCollection;
  extracted: ExtractedKnowledgeItem[];
  normalized: NormalizedKnowledgeItem[];
  graph: KnowledgeGraph;
  validation: KnowledgeValidationReport;
  compression: KnowledgeCompressionResult;
  searchIndex: Record<string, string[]>;
  version: KnowledgeBaseVersion;
  warnings: string[];
  errors: string[];
  durationMs: number;
}
