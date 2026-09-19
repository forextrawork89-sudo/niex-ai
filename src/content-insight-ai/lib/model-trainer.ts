import type { ContentType, FeedbackReport, ContentVerdict } from '../types/feedback';
import { getAllFeedbackReports, getLearningEntries } from './feedback-store';

// ============================================================
// In-browser ML: TF-IDF vectorizer + Naive Bayes text classifier
// + Pattern matcher for content classification
// ============================================================

export interface TrainingDataPoint {
  id: string;
  text: string;
  content_type: ContentType;
  label: 'safe' | 'harmful';
  confidence: number;
  source: 'feedback' | 'manual' | 'augmented';
  features?: Record<string, number>;
}

export interface TrainedModel {
  id: string;
  version: number;
  content_type: ContentType;
  created_at: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  training_size: number;
  vocabulary: Record<string, number>;
  class_priors: Record<string, number>;
  word_likelihoods: Record<string, Record<string, number>>;
  patterns: PatternRule[];
}

export interface PatternRule {
  id: string;
  keywords: string[];
  weight: number;
  label: 'safe' | 'harmful';
  match_count: number;
  accuracy: number;
}

export interface PredictionResult {
  label: ContentVerdict;
  confidence: number;
  matched_patterns: string[];
  top_features: { word: string; weight: number }[];
}

export interface TrainingResult {
  model: TrainedModel;
  accuracy: number;
  new_patterns: number;
  training_time_ms: number;
  dataset_size: number;
}

export interface ExportedDataset {
  format: 'jsonl' | 'csv';
  data: string;
  count: number;
  content_types: ContentType[];
}

const MODEL_STORAGE_KEY = 'cia_trained_models';
const DATASET_STORAGE_KEY = 'cia_training_dataset';

function loadModels(): Record<string, TrainedModel> {
  try {
    return JSON.parse(localStorage.getItem(MODEL_STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveModels(models: Record<string, TrainedModel>) {
  localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(models));
}

function loadDataset(): TrainingDataPoint[] {
  try {
    return JSON.parse(localStorage.getItem(DATASET_STORAGE_KEY) || '[]');
  } catch { return []; }
}

// Debounced + size-limited save to avoid quota errors during bulk imports
const MAX_DATASET_SIZE = 2000;        // max entries
const MAX_TEXT_LENGTH = 500;          // truncate long entries
let _saveTimer: ReturnType<typeof setTimeout> | null = null;
let _pendingData: TrainingDataPoint[] | null = null;

function saveDataset(data: TrainingDataPoint[]) {
  // Truncate long texts to fit more entries
  let truncated = data.map((d) => ({
    ...d,
    text: d.text.length > MAX_TEXT_LENGTH ? d.text.slice(0, MAX_TEXT_LENGTH) : d.text,
  }));

  // If too many entries, keep most recent ones
  if (truncated.length > MAX_DATASET_SIZE) {
    truncated = truncated.slice(-MAX_DATASET_SIZE);
  }

  _pendingData = truncated;
  if (_saveTimer) return;

  _saveTimer = setTimeout(() => {
    _saveTimer = null;
    if (!_pendingData) return;
    const toSave = _pendingData;
    _pendingData = null;
    try {
      localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // Quota exceeded — try with smaller dataset
      try {
        const smaller = toSave.slice(-500);
        localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(smaller));
        console.warn('[ModelTrainer] Dataset truncated to 500 entries (quota)');
      } catch {
        console.error('[ModelTrainer] Failed to save even truncated dataset');
      }
    }
  }, 500);
}

export function flushDataset(): void {
  if (_saveTimer) {
    clearTimeout(_saveTimer);
    _saveTimer = null;
  }
  if (_pendingData) {
    try {
      localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(_pendingData));
    } catch {}
    _pendingData = null;
  }
}

// ---- Tokenizer ----

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9Ѐ-ӿ\s'`'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function nGrams(tokens: string[], n: number): string[] {
  const result: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    result.push(tokens.slice(i, i + n).join(' '));
  }
  return result;
}

function extractFeatures(text: string): string[] {
  const tokens = tokenize(text);
  return [...tokens, ...nGrams(tokens, 2)];
}

// ---- TF-IDF ----

function computeTfIdf(documents: string[][]): { vocabulary: Record<string, number>; tfidf: number[][] } {
  const df: Record<string, number> = {};
  const allTerms = new Set<string>();

  for (const doc of documents) {
    const unique = new Set(doc);
    for (const term of unique) {
      df[term] = (df[term] || 0) + 1;
      allTerms.add(term);
    }
  }

  const vocabulary: Record<string, number> = {};
  let idx = 0;
  for (const term of allTerms) {
    if (df[term] >= 2 && df[term] <= documents.length * 0.9) {
      vocabulary[term] = idx++;
    }
  }

  const N = documents.length;
  const tfidf: number[][] = documents.map((doc) => {
    const tf: Record<string, number> = {};
    for (const term of doc) tf[term] = (tf[term] || 0) + 1;

    const vec = new Array(Object.keys(vocabulary).length).fill(0);
    for (const [term, i] of Object.entries(vocabulary)) {
      if (tf[term]) {
        vec[i] = (tf[term] / doc.length) * Math.log(N / (df[term] || 1));
      }
    }
    return vec;
  });

  return { vocabulary, tfidf };
}

// ---- Naive Bayes Classifier ----

function trainNaiveBayes(
  features: string[][],
  labels: string[],
  vocabulary: Record<string, number>
): { priors: Record<string, number>; likelihoods: Record<string, Record<string, number>> } {
  const classes = [...new Set(labels)];
  const priors: Record<string, number> = {};
  const likelihoods: Record<string, Record<string, number>> = {};
  const smoothing = 1;
  const vocabSize = Object.keys(vocabulary).length;

  for (const cls of classes) {
    const classIndices = labels.map((l, i) => (l === cls ? i : -1)).filter((i) => i !== -1);
    priors[cls] = classIndices.length / labels.length;

    const wordCounts: Record<string, number> = {};
    let totalWords = 0;

    for (const i of classIndices) {
      for (const word of features[i]) {
        if (word in vocabulary) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
          totalWords++;
        }
      }
    }

    likelihoods[cls] = {};
    for (const word of Object.keys(vocabulary)) {
      likelihoods[cls][word] = ((wordCounts[word] || 0) + smoothing) / (totalWords + vocabSize * smoothing);
    }
  }

  return { priors, likelihoods };
}

function predictNaiveBayes(
  text: string,
  priors: Record<string, number>,
  likelihoods: Record<string, Record<string, number>>,
  vocabulary: Record<string, number>
): { label: string; confidence: number; scores: Record<string, number> } {
  const features = extractFeatures(text);
  const scores: Record<string, number> = {};

  for (const cls of Object.keys(priors)) {
    let logProb = Math.log(priors[cls]);
    for (const word of features) {
      if (word in vocabulary && likelihoods[cls][word]) {
        logProb += Math.log(likelihoods[cls][word]);
      }
    }
    scores[cls] = logProb;
  }

  const maxClass = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const allScores = Object.values(scores);
  const maxScore = Math.max(...allScores);
  const expSum = allScores.reduce((s, v) => s + Math.exp(v - maxScore), 0);
  const confidence = Math.exp(maxScore - maxScore) / expSum;

  return { label: maxClass[0], confidence: Math.min(confidence, 0.99), scores };
}

// ---- Pattern Extraction ----

function extractPatterns(dataPoints: TrainingDataPoint[]): PatternRule[] {
  const harmfulWords: Record<string, number> = {};
  const safeWords: Record<string, number> = {};

  for (const dp of dataPoints) {
    const tokens = extractFeatures(dp.text);
    const target = dp.label === 'harmful' ? harmfulWords : safeWords;
    for (const t of tokens) target[t] = (target[t] || 0) + 1;
  }

  const patterns: PatternRule[] = [];
  const allWords = new Set([...Object.keys(harmfulWords), ...Object.keys(safeWords)]);

  for (const word of allWords) {
    const hCount = harmfulWords[word] || 0;
    const sCount = safeWords[word] || 0;
    const total = hCount + sCount;
    if (total < 2) continue;

    const ratio = hCount / total;

    if (ratio > 0.75) {
      patterns.push({
        id: `pat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        keywords: [word],
        weight: ratio,
        label: 'harmful',
        match_count: hCount,
        accuracy: ratio,
      });
    } else if (ratio < 0.25) {
      patterns.push({
        id: `pat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        keywords: [word],
        weight: 1 - ratio,
        label: 'safe',
        match_count: sCount,
        accuracy: 1 - ratio,
      });
    }
  }

  return patterns.sort((a, b) => b.weight - a.weight).slice(0, 100);
}

// ---- Cross-Validation ----

function crossValidate(features: string[][], labels: string[], vocabulary: Record<string, number>, k = 5): number {
  if (features.length < k) return 0;
  const foldSize = Math.ceil(features.length / k);
  let totalCorrect = 0;
  let totalCount = 0;

  for (let fold = 0; fold < k; fold++) {
    const testStart = fold * foldSize;
    const testEnd = Math.min(testStart + foldSize, features.length);

    const trainFeatures = [...features.slice(0, testStart), ...features.slice(testEnd)];
    const trainLabels = [...labels.slice(0, testStart), ...labels.slice(testEnd)];
    const testFeatures = features.slice(testStart, testEnd);
    const testLabels = labels.slice(testStart, testEnd);

    const { priors, likelihoods } = trainNaiveBayes(trainFeatures, trainLabels, vocabulary);

    for (let i = 0; i < testFeatures.length; i++) {
      const text = testFeatures[i].join(' ');
      const pred = predictNaiveBayes(text, priors, likelihoods, vocabulary);
      if (pred.label === testLabels[i]) totalCorrect++;
      totalCount++;
    }
  }

  return totalCount > 0 ? totalCorrect / totalCount : 0;
}

// ============================================================
// PUBLIC API
// ============================================================

export function buildTrainingDataset(): TrainingDataPoint[] {
  const reports = getAllFeedbackReports().filter((r) => r.status === 'learned' || r.status === 'rolled_back');
  const existing = loadDataset();
  const existingIds = new Set(existing.map((d) => d.id));

  const newPoints: TrainingDataPoint[] = [];

  for (const report of reports) {
    if (existingIds.has(report.id)) continue;

    const label: 'safe' | 'harmful' = report.verdict_correct === 'harmful' ? 'harmful' : 'safe';

    newPoints.push({
      id: report.id,
      text: report.description,
      content_type: report.content_type,
      label,
      confidence: report.confidence_before,
      source: 'feedback',
    });

    // Data augmentation: rephrase for more training data
    if (report.description.length > 20) {
      const words = report.description.split(' ');
      if (words.length > 4) {
        // Synonym-swap augmentation: drop random words to create variation
        const dropped = words.filter(() => Math.random() > 0.2);
        if (dropped.length > 2) {
          newPoints.push({
            id: `${report.id}-aug1`,
            text: dropped.join(' '),
            content_type: report.content_type,
            label,
            confidence: report.confidence_before * 0.9,
            source: 'augmented',
          });
        }

        // Subset augmentation: first 70% of words
        const subset = words.slice(0, Math.ceil(words.length * 0.7));
        newPoints.push({
          id: `${report.id}-aug2`,
          text: subset.join(' '),
          content_type: report.content_type,
          label,
          confidence: report.confidence_before * 0.8,
          source: 'augmented',
        });

        // Tail augmentation: last 70% of words
        const tail = words.slice(Math.floor(words.length * 0.3));
        newPoints.push({
          id: `${report.id}-aug3`,
          text: tail.join(' '),
          content_type: report.content_type,
          label,
          confidence: report.confidence_before * 0.8,
          source: 'augmented',
        });
      }
    }
  }

  const combined = [...existing, ...newPoints];
  saveDataset(combined);
  return combined;
}

export function trainModel(contentType?: ContentType): TrainingResult | null {
  const startTime = performance.now();
  const dataset = buildTrainingDataset();
  const filtered = contentType ? dataset.filter((d) => d.content_type === contentType) : dataset;

  if (filtered.length < 5) return null;

  const features = filtered.map((d) => extractFeatures(d.text));
  const labels = filtered.map((d) => d.label);

  const { vocabulary } = computeTfIdf(features);
  const accuracy = crossValidate(features, labels, vocabulary);
  const { priors, likelihoods } = trainNaiveBayes(features, labels, vocabulary);
  const patterns = extractPatterns(filtered);

  let tp = 0, fp = 0, fn = 0;
  for (let i = 0; i < filtered.length; i++) {
    const pred = predictNaiveBayes(filtered[i].text, priors, likelihoods, vocabulary);
    if (pred.label === 'harmful' && labels[i] === 'harmful') tp++;
    if (pred.label === 'harmful' && labels[i] === 'safe') fp++;
    if (pred.label === 'safe' && labels[i] === 'harmful') fn++;
  }
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  const models = loadModels();
  const modelKey = contentType || 'all';
  const prevVersion = models[modelKey]?.version || 0;

  const model: TrainedModel = {
    id: `model-${modelKey}-v${prevVersion + 1}`,
    version: prevVersion + 1,
    content_type: contentType || ('all' as ContentType),
    created_at: new Date().toISOString(),
    accuracy,
    precision,
    recall,
    f1_score: f1,
    training_size: filtered.length,
    vocabulary,
    class_priors: priors,
    word_likelihoods: likelihoods,
    patterns,
  };

  models[modelKey] = model;
  saveModels(models);

  return {
    model,
    accuracy: Math.round(accuracy * 100),
    new_patterns: patterns.length,
    training_time_ms: performance.now() - startTime,
    dataset_size: filtered.length,
  };
}

export function predict(text: string, contentType?: ContentType): PredictionResult {
  const models = loadModels();
  const modelKey = contentType || 'all';
  const model = models[modelKey] || models['all'];

  if (!model) {
    return { label: 'uncertain', confidence: 0.5, matched_patterns: [], top_features: [] };
  }

  const result = predictNaiveBayes(text, model.class_priors, model.word_likelihoods, model.vocabulary);

  const features = extractFeatures(text);
  const matchedPatterns: string[] = [];
  for (const pattern of model.patterns) {
    if (pattern.keywords.some((kw) => features.includes(kw))) {
      matchedPatterns.push(`${pattern.label}: ${pattern.keywords.join(', ')} (${(pattern.accuracy * 100).toFixed(0)}%)`);
    }
  }

  const topFeatures = features
    .filter((f) => f in model.vocabulary)
    .map((f) => {
      const harmfulProb = model.word_likelihoods['harmful']?.[f] || 0;
      const safeProb = model.word_likelihoods['safe']?.[f] || 0;
      return { word: f, weight: harmfulProb - safeProb };
    })
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 10);

  let label: ContentVerdict;
  if (result.confidence > 0.7) {
    label = result.label === 'harmful' ? 'harmful' : 'safe';
  } else {
    label = 'uncertain';
  }

  return { label, confidence: result.confidence, matched_patterns: matchedPatterns, top_features: topFeatures };
}

export function getModel(contentType?: ContentType): TrainedModel | null {
  const models = loadModels();
  return models[contentType || 'all'] || null;
}

export function getAllModels(): Record<string, TrainedModel> {
  return loadModels();
}

export function exportDataset(format: 'jsonl' | 'csv' = 'jsonl', contentTypes?: ContentType[]): ExportedDataset {
  let dataset = loadDataset();
  if (contentTypes && contentTypes.length > 0) {
    dataset = dataset.filter((d) => contentTypes.includes(d.content_type));
  }

  let data: string;

  if (format === 'jsonl') {
    data = dataset
      .map((d) =>
        JSON.stringify({
          text: d.text,
          label: d.label,
          content_type: d.content_type,
          confidence: d.confidence,
          source: d.source,
        })
      )
      .join('\n');
  } else {
    const header = 'text,label,content_type,confidence,source';
    const rows = dataset.map(
      (d) => `"${d.text.replace(/"/g, '""')}",${d.label},${d.content_type},${d.confidence},${d.source}`
    );
    data = [header, ...rows].join('\n');
  }

  return {
    format,
    data,
    count: dataset.length,
    content_types: [...new Set(dataset.map((d) => d.content_type))],
  };
}

export function addManualTrainingData(text: string, label: 'safe' | 'harmful', contentType: ContentType): TrainingDataPoint {
  const point: TrainingDataPoint = {
    id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    content_type: contentType,
    label,
    confidence: 1,
    source: 'manual',
  };

  const dataset = loadDataset();
  dataset.push(point);
  saveDataset(dataset);
  return point;
}

export function getTrainingStats() {
  const dataset = loadDataset();
  const models = loadModels();

  const harmfulCount = dataset.filter((d) => d.label === 'harmful').length;
  const safeCount = dataset.filter((d) => d.label === 'safe').length;

  return {
    total_datapoints: dataset.length,
    harmful_count: harmfulCount,
    safe_count: safeCount,
    balance_ratio: dataset.length > 0 ? Math.min(harmfulCount, safeCount) / Math.max(harmfulCount, safeCount, 1) : 0,
    by_source: {
      feedback: dataset.filter((d) => d.source === 'feedback').length,
      manual: dataset.filter((d) => d.source === 'manual').length,
      augmented: dataset.filter((d) => d.source === 'augmented').length,
    },
    by_content_type: Object.fromEntries(
      (['text', 'image', 'video', 'pose', 'movement', 'body_shape'] as ContentType[]).map((ct) => [
        ct,
        dataset.filter((d) => d.content_type === ct).length,
      ])
    ),
    models_trained: Object.keys(models).length,
    latest_accuracy: Object.values(models).length > 0
      ? Math.max(...Object.values(models).map((m) => m.accuracy)) * 100
      : 0,
  };
}
