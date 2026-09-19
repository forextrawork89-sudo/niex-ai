import { VisionAnalyzer, type VisionAnalysis, type VideoAnalysis } from './vision-analyzer';
import type {
  ContextUnderstanding,
  VisualObjectDescriptor,
  VisualUnderstanding,
  VideoUnderstanding,
  VisualUnderstandingProvider,
  VisualUnderstandingResult,
  VideoUnderstandingResult,
} from './ai-core/types';

let provider: VisualUnderstandingProvider | null = null;

const USE_MODEL_PROVIDER = true; // Default to model-backed visual understanding boundary.
const ENABLE_HEURISTIC_FALLBACK = false; // Do not treat heuristics as general visual understanding.

export function registerVisualUnderstandingProvider(customProvider: VisualUnderstandingProvider): void {
  provider = customProvider;
}

export function getVisualUnderstandingProvider(): VisualUnderstandingProvider {
  if (!provider) {
    if (USE_MODEL_PROVIDER || !ENABLE_HEURISTIC_FALLBACK) {
      provider = new ModelVisualUnderstandingProvider();
    } else {
      provider = new HeuristicVisualUnderstandingProvider();
    }
  }
  return provider;
}

export class HeuristicVisualUnderstandingProvider implements VisualUnderstandingProvider {
  public source: 'heuristic' = 'heuristic';
  private vision: VisionAnalyzer | null = null;

  private getVision(): VisionAnalyzer {
    if (!this.vision) this.vision = new VisionAnalyzer();
    return this.vision;
  }

  async analyzeImage(source: string | HTMLImageElement | File | Blob): Promise<VisualUnderstandingResult> {
    const visionAnalysis = await this.getVision().analyzeImage(source);
    const visualUnderstanding = buildHeuristicVisualUnderstandingFromVision(visionAnalysis);
    const contextUnderstanding = inferContextFromHeuristicVisualUnderstanding(visualUnderstanding);
    return { visionAnalysis, visualUnderstanding, contextUnderstanding, visual_understanding_available: false };
  }

  async analyzeVideo(source: HTMLVideoElement | string | File | Blob, maxFrames = 5): Promise<VideoUnderstandingResult> {
    let videoElement: HTMLVideoElement;
    if (source instanceof HTMLVideoElement) {
      videoElement = source;
    } else {
      videoElement = document.createElement('video');
      videoElement.muted = true;
      videoElement.crossOrigin = 'anonymous';
      if (source instanceof Blob) {
        videoElement.src = URL.createObjectURL(source);
      } else {
        videoElement.src = source;
      }
      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => resolve();
        videoElement.onerror = () => reject(new Error('Video load failed'));
      });
    }

    const videoAnalysis = await this.getVision().analyzeVideo(videoElement, maxFrames);
    const videoUnderstanding = buildHeuristicVideoUnderstandingFromVision(videoAnalysis);
    const contextUnderstanding = inferContextFromHeuristicVideoUnderstanding(videoUnderstanding);
    return { videoAnalysis, videoUnderstanding, contextUnderstanding, visual_understanding_available: false };
  }
}

export class ModelVisualUnderstandingProvider implements VisualUnderstandingProvider {
  public source: 'model' = 'model';

  async analyzeImage(source: string | HTMLImageElement | File | Blob): Promise<VisualUnderstandingResult> {
    const visionAnalysis = buildUnavailableVisionAnalysis(source);
    return await this.unavailableProvider(visionAnalysis);
  }

  async analyzeVideo(source: HTMLVideoElement | string | File | Blob, maxFrames = 5): Promise<VideoUnderstandingResult> {
    const videoAnalysis = buildUnavailableVideoAnalysis(source);
    return await this.unavailableVideoProvider(videoAnalysis);
  }

  private async unavailableProvider(visionAnalysis: VisionAnalysis): Promise<VisualUnderstandingResult> {
    const emptyUnderstanding: VisualUnderstanding = {
      natural_language_summary: 'General visual understanding unavailable',
      summary: 'General visual understanding unavailable',
      scene: 'unavailable',
      environment: 'unavailable',
      objects: [],
      object_purposes: [],
      people_count: 0,
      people_present: false,
      activities: [],
      relationships: [],
      visual_context: 'unavailable',
      safety_relevant_content: [],
      confidence: 0,
      source: 'unavailable',
      source_hint: 'No model-backed visual understanding provider is configured.',
    };
    return {
      visionAnalysis,
      visualUnderstanding: emptyUnderstanding,
      contextUnderstanding: {
        scene_type: 'unavailable',
        content_type: 'unavailable',
        person_present: false,
        person_activity: 'unavailable',
        clothing_context: 'unavailable',
        camera_focus: 'unavailable',
        suggestive_context: false,
        educational_context: false,
        sports_context: false,
        ordinary_content: false,
        uncertainty: 1,
        rationale: 'No model-backed visual understanding provider is configured.',
      },
      visual_understanding_available: false,
    };
  }

  private async unavailableVideoProvider(videoAnalysis: VideoAnalysis): Promise<VideoUnderstandingResult> {
    return {
      videoAnalysis,
      videoUnderstanding: {
        summary: 'General visual understanding unavailable',
        scenes: [],
        persistent_objects: [],
        activities: [],
        movement_summary: 'unavailable',
        camera_behavior: 'unavailable',
        visual_context: 'unavailable',
        temporal_signals: [],
        safety_relevant_changes: [],
        people_count: 0,
        people_present: false,
        confidence: 0,
        source: 'unavailable',
      },
      contextUnderstanding: {
        scene_type: 'unavailable',
        content_type: 'unavailable',
        person_present: false,
        person_activity: 'unavailable',
        clothing_context: 'unavailable',
        camera_focus: 'unavailable',
        suggestive_context: false,
        educational_context: false,
        sports_context: false,
        ordinary_content: false,
        uncertainty: 1,
        rationale: 'No model-backed visual understanding provider is configured.',
      },
      visual_understanding_available: false,
    };
  }
}

function uniqueLabels(labels: string[]): string[] {
  return Array.from(new Set(labels.filter(Boolean)));
}

function filterValidObjectLabels(labels: string[]): string[] {
  return uniqueLabels(labels)
    .map((label) => label.trim())
    .filter((label) => label.length > 0)
    .filter((label) => !/region$|^color|unknown|^scene$/i.test(label));
}

function buildObjectDescriptors(
  objects: Array<{ label: string; confidence?: number }>,
  faceCount: number,
): VisualObjectDescriptor[] {
  const validDescriptors = (objects || [])
    .map((obj) => ({ label: obj.label?.trim() || '', confidence: obj.confidence ?? 0.5 }))
    .filter((obj) => obj.label.length > 0)
    .filter((obj) => !/region$|^color|unknown|^scene$/i.test(obj.label));

  const descriptors = uniqueLabels(validDescriptors.map((obj) => obj.label))
    .map((label) => {
      const match = validDescriptors.find((obj) => obj.label === label);
      return {
        label,
        purpose: 'heuristic object candidate',
        confidence: match?.confidence ?? 0.5,
      };
    });

  if (descriptors.length > 0) return descriptors.slice(0, 6);
  if (faceCount > 0) {
    return [{ label: 'person', purpose: 'face detection', confidence: 0.5 }];
  }

  return [];
}

function summarizeObjectPurposes(descriptors: VisualObjectDescriptor[]): Array<{ label: string; purpose: string }> {
  return descriptors.map((descriptor) => ({ label: descriptor.label, purpose: descriptor.purpose }));
}

export function buildHeuristicVisualUnderstandingFromVision(vision: VisionAnalysis): VisualUnderstanding {
  const peopleCount = vision.face_regions?.length || 0;
  const objectDescriptors = buildObjectDescriptors(vision.objects || [], peopleCount);
  const objectPurposes = summarizeObjectPurposes(objectDescriptors);
  const mainObjectLabels = objectDescriptors.map((obj) => obj.label);

  const scene = vision.classification?.label || 'nomalum';
  const sceneConfidence = vision.classification?.confidence ?? 0;

  const environment = (() => {
    if (scene.toLowerCase().includes('indoor')) return 'Ichki makon';
    if (scene.toLowerCase().includes('outdoor')) return 'Tashqi makon';
    if (mainObjectLabels.some((label) => /sky|mountain|water|river|forest|beach/i.test(label))) return 'Tabiat';
    return 'Umumiy muhit';
  })();

  const textDetected = (vision.text_regions || []).map((region) => region.text).filter(Boolean);
  const hasFaces = peopleCount > 0;

  const activity = (() => {
    if (vision.pose?.pose_category === 'athletic' || vision.pose?.movement_context === 'sports') return 'sport yoki faollik';
    if (vision.pose?.pose_category === 'dancing') return 'raqs yoki sahna harakati';
    if (vision.pose?.pose_category === 'fashion_editorial') return 'fashional ko‘rgazma';
    if (vision.pose?.pose_category === 'neutral_social') return 'kundalik faoliyat';
    if (vision.pose?.pose_category === 'ambiguous') return 'noaniq faoliyat';
    return 'oddiy sahna';
  })();

  const cameraFraming = (() => {
    const face = vision.face_regions?.[0];
    if (face && face.width / vision.width > 0.4) return 'yuzga yaqin kadr';
    if (face && face.width / vision.width > 0.2) return 'yuzga o‘rtacha kadr';
    if (vision.aspect_ratio > 1.6) return 'landshaft format';
    if (vision.aspect_ratio < 0.7) return 'portret format';
    return 'odatiy keng kadr';
  })();

  const visualContext = (() => {
    const terms: string[] = [];
    if (mainObjectLabels.some((label) => /tv|phone|computer|laptop/i.test(label))) terms.push('texnologiya yoki sozlamalar');
    if (mainObjectLabels.some((label) => /bed|chair|sofa|table|lamp|kitchen/i.test(label))) terms.push('uy yoki interyer');
    if (mainObjectLabels.some((label) => /car|bus|train|road|street/i.test(label))) terms.push('transport yoki ko‘cha');
    if (textDetected.length > 0) terms.push('matnli sahna');
    if (terms.length === 0) return 'Odatiy vizual taqdimot';
    return uniqueLabels(terms).join(', ');
  })();

  const summaryParts: string[] = [];
  if (hasFaces) summaryParts.push(`${peopleCount} ta shaxs ko‘rinmoqda`);
  if (mainObjectLabels.length > 0) summaryParts.push(`asosiy obyektlar: ${mainObjectLabels.join(', ')}`);
  if (mainObjectLabels.length === 0 && !hasFaces) summaryParts.push('obyekt identifikatsiyasi cheklangan');
  if (textDetected.length > 0) summaryParts.push(`matn aniqlandi (${textDetected.length})`);
  summaryParts.push(`muhit: ${environment}`);
  summaryParts.push(`kamera: ${cameraFraming}`);

  if (!vision.classification || sceneConfidence < 0.35) {
    summaryParts.push('tasnif ishonchsiz');
  }

  const summary = summaryParts.join('. ');

  return {
    natural_language_summary: summary,
    summary,
    scene,
    environment,
    objects: objectDescriptors,
    object_purposes: objectPurposes,
    people_count: peopleCount,
    people_present: hasFaces,
    activities: [activity].filter(Boolean),
    relationships: [],
    visual_context: visualContext,
    safety_relevant_content: [],
    confidence: Math.max(0.35, sceneConfidence),
    source: 'heuristic',
    source_hint: 'Heuristic visual summary only; no general object labels are claimed without model-backed detection',
  };
}

function buildHeuristicVideoUnderstandingFromVision(video: VideoAnalysis): VideoUnderstanding {
  const frameLabels = video.frame_analyses?.map((frame) => frame.classification?.label || 'noma’lum').filter(Boolean) || [];
  const uniqueScenes = uniqueLabels(frameLabels);
  const faceCount = video.frame_analyses?.reduce((sum, frame) => sum + (frame.face_regions?.length || 0), 0) || 0;
  const persistentObjects = uniqueLabels(video.frame_analyses?.flatMap((frame) => frame.objects?.map((o) => o.label) || []) || [])
    .filter((label) => !/region$|^color|unknown|^scene$/i.test(label));
  const activities = uniqueLabels(video.frame_analyses?.map((frame) => frame.pose?.pose_label || '').filter(Boolean) || []);
  const movementSummary = (() => {
    const hasRepetitive = video.temporal_evidence?.repeated_suspicious_frames && video.temporal_evidence.repeated_suspicious_frames > 1;
    const hasSceneChange = (video.scene_changes?.length || 0) > 1;
    if (hasRepetitive && hasSceneChange) return 'Tegishli ramkalar davomida takroriy harakatlar va sahna o‘zgarishlari';
    if (hasRepetitive) return 'Takroriy yoki davomiy harakatlar';
    if (hasSceneChange) return 'Sahna o‘zgarishlari';
    return 'Barqaror harakat';
  })();

  const cameraBehavior = video.frame_analyses && video.frame_analyses.length > 0
    ? `Kameraning ko‘p formatlardagi harakati ${video.frame_analyses.length} ta kadr orqali baholandi` 
    : 'Kamera haqida ma’lumot yo‘q';

  const textDetected = uniqueLabels(video.frame_analyses?.flatMap((frame) => (frame.text_regions || []).map((r) => r.text)) || []);

  const summaryParts = [
    `${video.frames_analyzed || 0} ta kadr tahlil qilindi`,
    `asosiy sahnalar: ${uniqueScenes.slice(0, 5).join(', ') || 'noma’lum'}`,
    `muhit: ${video.overall_classification || 'noma’lum'}`,
    `harakat: ${activities.slice(0, 4).join(', ') || 'noma’lum'}`,
    `kamera: ${cameraBehavior}`,
  ];

  return {
    summary: summaryParts.join('. '),
    scenes: uniqueScenes,
    persistent_objects: persistentObjects,
    activities,
    movement_summary: movementSummary,
    camera_behavior: cameraBehavior,
    visual_context: textDetected.length > 0 ? `matnli sahna: ${textDetected.join(', ')}` : 'Umumiy video konteksti',
    temporal_signals: video.temporal_evidence?.temporal_reasons || [],
    safety_relevant_changes: video.scene_changes?.map((idx) => `scene_${idx}`) || [],
    people_count: faceCount,
    people_present: faceCount > 0,
    confidence: 0.5,
    source: 'heuristic',
  };
}

export function inferContextFromHeuristicVisualUnderstanding(understanding: VisualUnderstanding): ContextUnderstanding {
  const contentType = understanding.objects[0]?.label || understanding.scene || 'oddiy';
  return {
    scene_type: understanding.scene,
    content_type: contentType,
    person_present: understanding.people_present,
    person_activity: understanding.activities[0] || 'noma’lum',
    clothing_context: understanding.object_purposes.map((purpose) => purpose.purpose).filter(Boolean).join(', ') || 'noma’lum',
    camera_focus: understanding.visual_context,
    suggestive_context: understanding.visual_context.toLowerCase().includes('ochiq') || understanding.visual_context.toLowerCase().includes('lingerie') || understanding.visual_context.toLowerCase().includes('bikini'),
    educational_context: understanding.visual_context.toLowerCase().includes('texnologiya') || understanding.environment.toLowerCase().includes('uy'),
    sports_context: understanding.activities.some((activity) => /sport|athletic|dance/i.test(activity)),
    ordinary_content: understanding.visual_context.toLowerCase() === 'odatiy vizual taqdimot' && !understanding.people_present && understanding.objects.length === 0,
    uncertainty: 1 - understanding.confidence,
    rationale: 'Kontekst faqat rasmning ko‘rinadigan elementlari va pozaga asoslangan heuristic tahlil orqali aniqlangan.',
  };
}

function inferContextFromHeuristicVideoUnderstanding(understanding: VideoUnderstanding): ContextUnderstanding {
  return {
    scene_type: understanding.scenes[0] || 'noma’lum',
    content_type: understanding.persistent_objects[0] || 'oddiy',
    person_present: understanding.people_count > 0,
    person_activity: understanding.activities[0] || 'noma’lum',
    clothing_context: 'noma’lum',
    camera_focus: understanding.camera_behavior,
    suggestive_context: understanding.temporal_signals.some((signal) => /suspicious|suggestive|explicit/i.test(signal)),
    educational_context: understanding.visual_context?.toLowerCase().includes('documentary') || false,
    sports_context: understanding.activities.some((activity) => /sport|athletic|dance/i.test(activity)),
    ordinary_content: understanding.visual_context.toLowerCase() === 'umumiy video konteksti' && understanding.people_count === 0,
    uncertainty: 0.6,
    rationale: 'Video konteksti faqat aniqlangan kadrlar va temporal signallar asosida heuristic ravishda aniqlangan.',
  };
}

function buildUnavailableVisionAnalysis(source: string | HTMLImageElement | File | Blob): VisionAnalysis {
  return {
    image_url: typeof source === 'string' ? source : 'blob://unavailable',
    width: 0,
    height: 0,
    dominant_colors: [],
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    skin_percentage: 0,
    skin_distribution: { top_half: 0, bottom_half: 0, center: 0, periphery: 0, largest_cluster_percentage: 0 },
    edge_density: 0,
    text_regions: [],
    classification: { label: 'unavailable', confidence: 0, categories: [], scores: {} },
    nsfw_score: 0,
    nsfw_reasons: [],
    violence_score: 0,
    violence_reasons: [],
    face_regions: [],
    objects: [],
    histogram: { red: new Array(256).fill(0), green: new Array(256).fill(0), blue: new Array(256).fill(0), luminance: new Array(256).fill(0), entropy: 0 },
    perceptual_hash: '',
    aspect_ratio: 0,
    analyzed_at: new Date().toISOString(),
    processing_ms: 0,
  };
}

function buildUnavailableVideoAnalysis(source: HTMLVideoElement | string | File | Blob): VideoAnalysis {
  return {
    video_url: typeof source === 'string' ? source : 'blob://unavailable',
    duration_estimate: 0,
    frames_analyzed: 0,
    frame_analyses: [],
    scene_changes: [],
    overall_nsfw_score: 0,
    overall_violence_score: 0,
    overall_classification: 'unavailable',
    text_found: [],
    temporal_evidence: {
      peak_nsfw_score: 0,
      repeated_suspicious_frames: 0,
      rising_risk_frames: 0,
      scene_change_count: 0,
      text_density: 0,
      temporal_risk_score: 0,
      temporal_reasons: [],
    },
    analyzed_at: new Date().toISOString(),
    processing_ms: 0,
  };
}
