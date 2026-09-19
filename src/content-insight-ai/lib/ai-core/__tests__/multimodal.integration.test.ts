import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { processContent } from '../orchestrator';

// Mock VisionAnalyzer to avoid canvas DOM usage in Node
vi.mock('../../vision-analyzer', () => {
  return {
    VisionAnalyzer: class {
      async analyzeImage(_src: any) {
        return {
          text_regions: [{ text: 'EXTRACTED_IMAGE_TEXT', confidence: 0.9, x: 0, y: 0, width: 10, height: 10 }],
          classification: { label: 'other', confidence: 0.1 },
          nsfw_score: 0.1,
          face_regions: [],
          dominant_colors: [],
          brightness: 0,
          contrast: 0,
          saturation: 0,
          sharpness: 0,
          skin_percentage: 0,
          edge_density: 0,
          histogram: { red: [], green: [], blue: [], luminance: [], entropy: 0 },
          perceptual_hash: '',
          aspect_ratio: 1,
          analyzed_at: new Date().toISOString(),
          processing_ms: 5,
        };
      }
      async analyzeVideo(_src: any) {
        return {
          frame_analyses: [
            { text_regions: [{ text: 'FRAME_TEXT', confidence: 0.8 }], nsfw_score: 0.2 },
          ],
          frames_analyzed: 1,
        } as any;
      }
    },
  };
});

describe('Multimodal pipeline integration', () => {
  it('merges image OCR into captured text', async () => {
    const res = await processContent({ requestId: 't1', imageSource: 'file.jpg', text: '' } as any);
    expect(res.capturedContent).toBeDefined();
    expect(res.capturedContent?.text).toContain('EXTRACTED_IMAGE_TEXT');
  });

  it('merges video OCR into captured text', async () => {
    const res = await processContent({ requestId: 't2', videoSource: 'video.mp4', text: '' } as any);
    expect(res.capturedContent).toBeDefined();
    expect(res.capturedContent?.text).toContain('FRAME_TEXT');
  });

  it('includes metadata.dom_text into captured text when provided', async () => {
    const res = await processContent({ requestId: 't3', metadata: { dom_text: 'DOM TEXT HERE' } as any } as any);
    expect(res.capturedContent).toBeDefined();
    expect(res.capturedContent?.text).toContain('DOM TEXT HERE');
  });
});
