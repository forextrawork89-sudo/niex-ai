import { describe, expect, it } from 'vitest';
import { collectEvidence } from './evidence-collector';

describe('Evidence collector multimodal heuristics', () => {
  it('does not emit harmful pose-camera fusion for neutral fashion/editorial pose context', () => {
    const frames: any[] = [];
    for (let i = 0; i < 3; i++) {
      frames.push({
        image_url: `frame@${i}s`, width: 640, height: 360,
        dominant_colors: [], brightness: 0.5, contrast: 0.5, saturation: 0.4, sharpness: 0.3,
        skin_percentage: 0.22, skin_distribution: { top_half: 0.55, bottom_half: 0.45, center: 0.5, periphery: 0.5, largest_cluster_percentage: 0.18 },
        edge_density: 0.16, text_regions: [], classification: { label: 'fashion', confidence: 0.7, categories: [], scores: {} },
        nsfw_score: 0.14, nsfw_reasons: [], violence_score: 0, violence_reasons: [],
        face_regions: [{ x: 250, y: 40, width: 140, height: 140, confidence: 0.82, has_skin_surround: false }],
        objects: [], histogram: { red: [], green: [], blue: [], luminance: [], entropy: 3 }, perceptual_hash: 'aaaaaaaa',
        aspect_ratio: 640 / 360, analyzed_at: new Date().toISOString(), processing_ms: 10,
        pose: { keypoints: [], pose_label: 'fashion/editorial', pose_confidence: 0.62, pose_category: 'fashion/editorial', orientation: 'front' },
      });
    }

    const captured: any = {
      text: 'fashion editorial shoot', textLength: 20, hasText: true, hasImage: false, hasVideo: true, hasAudio: false,
      metadata: {
        videoAnalysis: {
          frame_analyses: frames,
          temporal_evidence: { peak_nsfw_score: 0.16, repeated_suspicious_frames: 0, rising_risk_frames: 0, scene_change_count: 0, text_density: 0, temporal_risk_score: 0.16, temporal_reasons: [] },
        },
      },
      contentType: 'video', sourceSummary: 'video',
    };

    const result = collectEvidence(captured as any);
    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((e) => e.label === 'combined_pose_camera_focus' && e.direction === 'supports')).toBe(false);
  });

  it('does not emit combined clothing-movement support for safe fashion/editorial-like framing', () => {
    const frames: any[] = [];
    for (let i = 0; i < 4; i++) {
      frames.push({
        image_url: `frame@${i}s`, width: 640, height: 360,
        dominant_colors: [], brightness: 0.5, contrast: 0.5, saturation: 0.4, sharpness: 0.3,
        skin_percentage: i < 2 ? 0.2 : 0.6,
        skin_distribution: { top_half: 0.55, bottom_half: 0.45, center: 0.5, periphery: 0.5, largest_cluster_percentage: i < 2 ? 0.18 : 0.5 },
        edge_density: 0.12, text_regions: [], classification: { label: 'fashion', confidence: 0.78, categories: [], scores: {} },
        nsfw_score: i < 2 ? 0.14 : 0.52, nsfw_reasons: [], violence_score: 0, violence_reasons: [],
        face_regions: [{ x: 250, y: 40, width: 140, height: 140, confidence: 0.85, has_skin_surround: true }],
        objects: [], histogram: { red: [], green: [], blue: [], luminance: [], entropy: 5 }, perceptual_hash: 'aaaaaaaa',
        aspect_ratio: 640 / 360, analyzed_at: new Date().toISOString(), processing_ms: 10,
        pose: { keypoints: [], pose_label: 'fashion/editorial', pose_confidence: 0.7, pose_category: 'fashion_editorial', orientation: 'front' },
      });
    }

    const captured: any = {
      text: 'fashion editorial shoot', textLength: 20, hasText: true, hasImage: false, hasVideo: true, hasAudio: false,
      metadata: {
        videoAnalysis: {
          frame_analyses: frames,
          temporal_evidence: { peak_nsfw_score: 0.52, repeated_suspicious_frames: 2, rising_risk_frames: 1, scene_change_count: 0, text_density: 0, temporal_risk_score: 0.55, temporal_reasons: [] },
        },
      },
      contentType: 'video', sourceSummary: 'video',
    };

    const result = collectEvidence(captured as any);
    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((e) => e.label === 'combined_clothing_movement')).toBe(false);
  });

  it('does not emit pose-camera fusion for safe fashion/editorial framing even with strong skin and camera focus cues', () => {
    const frames: any[] = [];
    for (let i = 0; i < 4; i++) {
      frames.push({
        image_url: `frame@${i}s`, width: 640, height: 360,
        dominant_colors: [], brightness: 0.5, contrast: 0.5, saturation: 0.4, sharpness: 0.3,
        skin_percentage: 0.48, skin_distribution: { top_half: 0.3, bottom_half: 0.7, center: 0.5, periphery: 0.5, largest_cluster_percentage: 0.52 },
        edge_density: 0.12, text_regions: [], classification: { label: 'fashion', confidence: 0.8, categories: [], scores: {} },
        nsfw_score: 0.18, nsfw_reasons: [], violence_score: 0, violence_reasons: [],
        face_regions: [{ x: 250, y: 40, width: 140, height: 140, confidence: 0.86, has_skin_surround: true }],
        objects: [], histogram: { red: [], green: [], blue: [], luminance: [], entropy: 4 }, perceptual_hash: 'aaaaaaaa',
        aspect_ratio: 640 / 360, analyzed_at: new Date().toISOString(), processing_ms: 10,
        pose: { keypoints: [], pose_label: 'fashion/editorial', pose_confidence: 0.78, pose_category: 'fashion_editorial', orientation: 'front' },
      });
    }

    const captured: any = {
      text: 'fashion editorial shoot', textLength: 20, hasText: true, hasImage: false, hasVideo: true, hasAudio: false,
      metadata: {
        videoAnalysis: {
          frame_analyses: frames,
          temporal_evidence: { peak_nsfw_score: 0.18, repeated_suspicious_frames: 0, rising_risk_frames: 0, scene_change_count: 0, text_density: 0, temporal_risk_score: 0.18, temporal_reasons: [] },
        },
      },
      contentType: 'video', sourceSummary: 'video',
    };

    const result = collectEvidence(captured as any);
    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((e) => e.label === 'combined_pose_camera_focus')).toBe(false);
  });

  it('infers camera focus, clothing transition, movement and combined fusion signals from video analysis', () => {
    // Build 6 mock frames to trigger persistence heuristics
    const frames: any[] = [];
    for (let i = 0; i < 6; i++) {
      frames.push({
        image_url: `frame@${i}s`, width: 640, height: 360,
        dominant_colors: [], brightness: 0.5, contrast: 0.5, saturation: 0.4, sharpness: 0.3,
        skin_percentage: i < 3 ? 0.18 : 0.6, // transition between frames
        skin_distribution: { top_half: i < 3 ? 0.6 : 0.2, bottom_half: i < 3 ? 0.4 : 0.8, center: 0.5, periphery: 0.5, largest_cluster_percentage: i < 3 ? 0.2 : 0.55 },
        edge_density: 0.12, text_regions: [],
        classification: { label: i < 3 ? 'photograph' : 'body', confidence: 0.6, categories: [], scores: {} },
        nsfw_score: i < 3 ? 0.12 : 0.6, nsfw_reasons: [], violence_score: 0, violence_reasons: [],
        face_regions: i < 5 ? [{ x: 250, y: 40, width: 140, height: 140, confidence: 0.85, has_skin_surround: true }] : [],
        objects: [], histogram: { red: [], green: [], blue: [], luminance: [], entropy: 5 }, perceptual_hash: 'aaaaaaaa',
        aspect_ratio: 640 / 360, analyzed_at: new Date().toISOString(), processing_ms: 10,
      });
    }

    const videoAnalysis: any = {
      video_url: 'mock://video', duration_estimate: 6, frames_analyzed: frames.length,
      frame_analyses: frames,
      scene_changes: [], overall_nsfw_score: 0.6, overall_violence_score: 0, overall_classification: 'body', text_found: [],
      temporal_evidence: { peak_nsfw_score: 0.6, repeated_suspicious_frames: 3, rising_risk_frames: 2, scene_change_count: 0, text_density: 0, temporal_risk_score: 0.6, temporal_reasons: ['rising risk'] },
      analyzed_at: new Date().toISOString(), processing_ms: 120,
    };

    const captured: any = {
      text: 'This content is a private bedroom scene with intimate framing and repeated movement.', textLength: 60, hasText: true, hasImage: false, hasVideo: true, hasAudio: false, metadata: { videoAnalysis }, contentType: 'video', sourceSummary: 'video',
    };

    const result = collectEvidence(captured as any);
    // Debug: show produced evidence signals
    // eslint-disable-next-line no-console
    console.log('EVIDENCE_SIGNALS', JSON.stringify(result.evidenceItems.map((e: any) => ({ label: e.label, signal: e.signal })), null, 2));
    // Check for camera focus face center persistence signal
    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((e) => e.signal === 'camera_focus_face_center_persistence')).toBe(true);
    // Clothing transition should be detected
    expect(result.evidenceItems.some((e) => e.signal === 'clothing_transition_detected')).toBe(true);
    // Movement repeated suspicious frames
    expect(result.evidenceItems.some((e) => e.signal === 'movement_repeated_suspicious_frames')).toBe(true);
    // The collector should still surface the underlying single-signal heuristics for non-safe content.
    expect(result.evidenceItems.some((e) => e.label === 'vision_clothing_clothing_transition_detected')).toBe(true);
    expect(result.evidenceItems.some((e) => e.signal === 'camera_focus_persistent_view')).toBe(true);
    expect(result.evidenceItems.some((e) => e.signal === 'movement_repeated_suspicious_frames')).toBe(true);
  });
});
