import { describe, it, expect } from 'vitest';
import {
  buildHeuristicVisualUnderstandingFromVision,
  inferContextFromHeuristicVisualUnderstanding,
  registerVisualUnderstandingProvider,
  getVisualUnderstandingProvider,
} from './visual-understanding-provider';
import type { VisionAnalysis } from './vision-analyzer';

describe('VisualUnderstandingProvider regression tests', () => {
  it('does not treat generic color region labels as real objects in interior/no-person scenes', () => {
    const vision: VisionAnalysis = {
      image_url: 'blob://test',
      width: 640,
      height: 480,
      dominant_colors: [{ r: 200, g: 50, b: 50, hex: '#c83232', percentage: 0.2, name: 'red' }],
      brightness: 0.5,
      contrast: 0.4,
      saturation: 0.35,
      sharpness: 0.2,
      skin_percentage: 0.02,
      skin_distribution: { top_half: 0.01, bottom_half: 0.01, center: 0.0, periphery: 0.0, largest_cluster_percentage: 0.01 },
      edge_density: 0.25,
      text_regions: [],
      classification: { label: 'indoor scene', confidence: 0.55, categories: ['indoor'], scores: { indoor: 0.55 } },
      nsfw_score: 0.12,
      nsfw_reasons: [],
      violence_score: 0.05,
      violence_reasons: [],
      face_regions: [],
      objects: [
        { label: 'Red region', confidence: 0.6, x: 0, y: 0, width: 128, height: 128 },
        { label: 'Blue region', confidence: 0.4, x: 128, y: 0, width: 64, height: 64 },
      ],
      histogram: { red: [], green: [], blue: [], luminance: [], entropy: 2.5 },
      perceptual_hash: 'abcdef1234567890',
      aspect_ratio: 640 / 480,
      analyzed_at: new Date().toISOString(),
      processing_ms: 123,
    };

    const visualUnderstanding = buildHeuristicVisualUnderstandingFromVision(vision);
    expect(visualUnderstanding.objects).toEqual([]);
    expect(visualUnderstanding.summary).toContain('obyekt identifikatsiyasi cheklangan');
    expect(visualUnderstanding.people_count).toBe(0);
    expect(visualUnderstanding.people_present).toBe(false);
    expect(visualUnderstanding.confidence).toBeGreaterThanOrEqual(0.35);
    expect(visualUnderstanding.source).toBe('heuristic');

    const context = inferContextFromHeuristicVisualUnderstanding(visualUnderstanding);
    expect(context.person_present).toBe(false);
    expect(context.ordinary_content).toBe(true);
    expect(context.content_type).toBe('indoor scene');
    expect(context.rationale).toContain('heuristic');
  });

  it('marks low-confidence scene classification as uncertain and includes the uncertainty note', () => {
    const vision: VisionAnalysis = {
      image_url: 'blob://test2',
      width: 320,
      height: 240,
      dominant_colors: [{ r: 120, g: 120, b: 120, hex: '#787878', percentage: 0.1, name: 'grey' }],
      brightness: 0.4,
      contrast: 0.3,
      saturation: 0.25,
      sharpness: 0.15,
      skin_percentage: 0.0,
      skin_distribution: { top_half: 0, bottom_half: 0, center: 0, periphery: 0, largest_cluster_percentage: 0 },
      edge_density: 0.2,
      text_regions: [],
      classification: { label: 'unknown', confidence: 0.2, categories: [], scores: { unknown: 0.2 } },
      nsfw_score: 0.1,
      nsfw_reasons: [],
      violence_score: 0.0,
      violence_reasons: [],
      face_regions: [],
      objects: [],
      histogram: { red: [], green: [], blue: [], luminance: [], entropy: 1.0 },
      perceptual_hash: '1234567890abcdef',
      aspect_ratio: 320 / 240,
      analyzed_at: new Date().toISOString(),
      processing_ms: 45,
    };

    const visualUnderstanding = buildHeuristicVisualUnderstandingFromVision(vision);
    expect(visualUnderstanding.summary).toContain('tasnif ishonchsiz');
    expect(visualUnderstanding.confidence).toBeLessThan(0.7);
    expect(visualUnderstanding.objects).toEqual([]);

    const context = inferContextFromHeuristicVisualUnderstanding(visualUnderstanding);
    expect(context.ordinary_content).toBe(true);
    expect(context.person_present).toBe(false);
    expect(context.uncertainty).toBeCloseTo(1 - visualUnderstanding.confidence, 6);
  });

  it('returns unavailable general visual understanding when no model provider is configured', async () => {
    const { getVisualUnderstandingProvider } = await import('./visual-understanding-provider');
    const provider = getVisualUnderstandingProvider();
    expect(provider.source).toBe('model');

    const result = await provider.analyzeImage('blob://test');
    expect(result.visual_understanding_available).toBe(false);
    expect(result.visualUnderstanding.source).toBe('unavailable');
    expect(result.visualUnderstanding.summary).toContain('unavailable');
    expect(result.contextUnderstanding.rationale).toContain('No model-backed visual understanding provider');
  });
});
