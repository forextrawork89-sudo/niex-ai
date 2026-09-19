import { collectDataset, verifyDatasetChecksum } from './dataset-collector';
import { extractKnowledge } from './knowledge-extractor';
import { normalizeKnowledge } from './knowledge-normalizer';
import { buildKnowledgeGraph } from './knowledge-graph-builder';
import { validateKnowledge } from './knowledge-validator';
import { compressKnowledge } from './knowledge-compressor';
import { buildEmbeddingIndex } from './embedding-index';
import { appendKnowledge, createVersion } from './incremental-learning';
import { loadOntologyFiles } from './ontology/loader';
import type { KBBuilderResult, DatasetSourceSpec, NormalizedKnowledgeItem } from './types';

export async function buildKnowledgeBase(options: { sources?: DatasetSourceSpec[]; seedItems?: NormalizedKnowledgeItem[]; changelog?: string[] } = {}): Promise<KBBuilderResult> {
  const start = Date.now();
  const collection = await collectDataset(options.sources);
  const checksumResult = await verifyDatasetChecksum(collection);
  const extracted = extractKnowledge(collection.records);
  const normalized = normalizeKnowledge(extracted);
  const ontology = await loadOntologyFiles();
  const finalItems = options.seedItems ? appendKnowledge(normalized, options.seedItems) : normalized;
  const graph = buildKnowledgeGraph(finalItems);
  const validation = validateKnowledge(finalItems, graph);
  const compression = compressKnowledge(finalItems);
  const embeddingIndex = buildEmbeddingIndex(finalItems);
  const searchIndex = Object.fromEntries(finalItems.map((item) => [item.id, [item.category, item.subcategory, item.intent]]));
  const version = createVersion(finalItems, options.changelog || ['initial build']);

  return {
    success: checksumResult.valid && finalItems.length > 0,
    collection,
    extracted,
    normalized: finalItems,
    graph,
    validation,
    compression,
    searchIndex,
    version,
    warnings: [
      ...(checksumResult.valid ? [] : ['checksum check failed']),
      ...(Object.keys(ontology).length > 0 ? [] : ['ontology files missing'])
    ],
    errors: checksumResult.valid ? [] : ['dataset checksum verification failed'],
    durationMs: Date.now() - start,
  } as KBBuilderResult & { embeddingIndex?: typeof embeddingIndex };
}
