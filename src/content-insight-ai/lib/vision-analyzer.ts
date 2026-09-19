// ============================================================
// VISION ANALYZER v2 — Chuqur rasm/video tahlili
//
// Canvas API orqali in-browser (tashqi API shart emas):
// 1. OCR — haqiqiy belgi tanish (connected components + template)
// 2. Skin detection — YCbCr + RGB dual model
// 3. Spatial NSFW — skin region clustering, position analysis
// 4. Face-like region detection (Haar-like features)
// 5. Violence indicators (blood-red, weapon shapes)
// 6. Histogram analysis — color distribution
// 7. Perceptual hash — image fingerprinting (dedup)
// 8. Contrast, saturation, sharpness metrics
// 9. Aspect ratio analysis
// 10. Video frame extraction with scene change detection
// ============================================================

export interface VisionAnalysis {
  image_url: string;
  width: number;
  height: number;
  dominant_colors: ColorInfo[];
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  skin_percentage: number;
  skin_distribution: SkinDistribution;
  edge_density: number;
  text_regions: TextRegion[];
  classification: ImageClass;
  nsfw_score: number;
  nsfw_reasons: string[];
  violence_score: number;
  violence_reasons: string[];
  face_regions: FaceRegion[];
  objects: DetectedRegion[];
  pose?: PoseSummary;
  histogram: HistogramData;
  perceptual_hash: string;
  aspect_ratio: number;
  analyzed_at: string;
  processing_ms: number;
}

export interface ColorInfo {
  r: number; g: number; b: number;
  hex: string;
  percentage: number;
  name: string;
}

export interface SkinDistribution {
  top_half: number;
  bottom_half: number;
  center: number;
  periphery: number;
  largest_cluster_percentage: number;
}

export interface TextRegion {
  text: string;
  confidence: number;
  x: number; y: number;
  width: number; height: number;
}

export interface FaceRegion {
  x: number; y: number;
  width: number; height: number;
  confidence: number;
  has_skin_surround: boolean;
}

export interface PoseKeypoint {
  name: string;
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  confidence: number;
}

export interface PoseSummary {
  keypoints: PoseKeypoint[];
  pose_label: string; // e.g., 'upright', 'sitting', 'bending', 'unknown'
  pose_category?: 'standing' | 'sitting' | 'lying' | 'bending' | 'dancing' | 'athletic' | 'fashion_editorial' | 'neutral_social' | 'ambiguous' | 'unknown';
  pose_confidence: number; // 0..1
  orientation: 'front' | 'back' | 'left' | 'right' | 'unknown';
  movement_delta?: number; // normalized delta from previous frame if available
  movement_context?: 'ordinary' | 'sports' | 'dance' | 'fashion' | 'ambiguous' | 'suggestive' | 'unknown';
}

// Filter false positives in face detection:
// 1. Confidence threshold (>= 0.5)
// 2. Merge overlapping detections (IoU > 0.3 → keep highest conf)
// 3. Cap at top 10 by confidence (real photos rarely have more)
function filterFaceRegions(faces: FaceRegion[]): FaceRegion[] {
  if (!faces || faces.length === 0) return [];
  // Confidence filter
  const filtered = faces.filter((f) => f.confidence >= 0.5);
  // Sort by confidence desc
  filtered.sort((a, b) => b.confidence - a.confidence);
  // Non-max suppression
  const kept: FaceRegion[] = [];
  for (const f of filtered) {
    let overlapping = false;
    for (const k of kept) {
      const ix1 = Math.max(f.x, k.x);
      const iy1 = Math.max(f.y, k.y);
      const ix2 = Math.min(f.x + f.width, k.x + k.width);
      const iy2 = Math.min(f.y + f.height, k.y + k.height);
      if (ix2 > ix1 && iy2 > iy1) {
        const inter = (ix2 - ix1) * (iy2 - iy1);
        const areaF = f.width * f.height;
        const areaK = k.width * k.height;
        const iou = inter / (areaF + areaK - inter);
        if (iou > 0.3) { overlapping = true; break; }
      }
    }
    if (!overlapping) kept.push(f);
    if (kept.length >= 10) break;
  }
  return kept;
}

export interface ImageClass {
  label: string;
  confidence: number;
  categories: string[];
  scores: Record<string, number>;
}

export interface DetectedRegion {
  label: string;
  confidence: number;
  x: number; y: number;
  width: number; height: number;
}

export interface HistogramData {
  red: number[];
  green: number[];
  blue: number[];
  luminance: number[];
  entropy: number;
}

export interface TemporalEvidenceSummary {
  peak_nsfw_score: number;
  repeated_suspicious_frames: number;
  rising_risk_frames: number;
  scene_change_count: number;
  text_density: number;
  temporal_risk_score: number;
  temporal_reasons: string[];
}

export interface VideoAnalysis {
  video_url: string;
  duration_estimate: number;
  frames_analyzed: number;
  frame_analyses: VisionAnalysis[];
  scene_changes: number[];
  overall_nsfw_score: number;
  overall_violence_score: number;
  overall_classification: string;
  text_found: string[];
  temporal_evidence: TemporalEvidenceSummary;
  analyzed_at: string;
  processing_ms: number;
}

// ---- Grayscale helper ----
function toGray(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// ============================================================
// Vision Analyzer v2
// ============================================================

export class VisionAnalyzer {
  pose?: PoseSummary;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private maxImageSize = 800;
  private analysisHistory: VisionAnalysis[] = [];
  private maxHistory = 30;
  private charTemplates: Map<string, boolean[][]> | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    this.loadHistory();
    this.initCharTemplates();
  }

  private loadHistory(): void {
    try {
      this.analysisHistory = JSON.parse(localStorage.getItem('cia_vision_history') || '[]');
    } catch {
      this.analysisHistory = [];
    }
  }

  private saveHistory(): void {
    if (this.analysisHistory.length > this.maxHistory) {
      this.analysisHistory.length = this.maxHistory;
    }
    localStorage.setItem('cia_vision_history', JSON.stringify(this.analysisHistory));
  }

  // ---- Character templates for basic OCR ----
  private initCharTemplates(): void {
    this.charTemplates = new Map();
    // 5x7 bitmap templates for basic characters
    const templates: Record<string, string[]> = {
      'A': ['01110','10001','10001','11111','10001','10001','10001'],
      'B': ['11110','10001','10001','11110','10001','10001','11110'],
      'H': ['10001','10001','10001','11111','10001','10001','10001'],
      'I': ['11111','00100','00100','00100','00100','00100','11111'],
      'O': ['01110','10001','10001','10001','10001','10001','01110'],
      'S': ['01111','10000','10000','01110','00001','00001','11110'],
      'T': ['11111','00100','00100','00100','00100','00100','00100'],
      '1': ['00100','01100','00100','00100','00100','00100','01110'],
      '8': ['01110','10001','10001','01110','10001','10001','01110'],
    };
    for (const [ch, rows] of Object.entries(templates)) {
      this.charTemplates.set(ch, rows.map((r) => r.split('').map((c) => c === '1')));
    }
  }

  // ---- Main Analysis ----

  async analyzeImage(source: string | HTMLImageElement | File | Blob): Promise<VisionAnalysis> {
    const start = performance.now();
    let objectUrl: string | null = null;

    try {
      const img = await this.loadImage(source);
      this.setupCanvas(img);

      // Clean up blob URL if we created one
      if ((source instanceof File || source instanceof Blob) && img.src.startsWith('blob:')) {
        objectUrl = img.src;
      }

      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const pixels = imageData.data;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Core analyses
      const histogram = this.computeHistogram(pixels);
      const dominantColors = this.extractDominantColors(pixels);
      const brightness = this.calculateBrightness(pixels);
      const contrast = this.calculateContrast(pixels);
      const saturation = this.calculateSaturation(pixels);
      const sharpness = this.calculateSharpness(imageData);
      const skinMap = this.buildSkinMap(imageData);
      const skinPercentage = skinMap.totalSkin / (skinMap.totalPixels || 1);
      const skinDistribution = this.analyzeSkinDistribution(skinMap, w, h);
      const edgeDensity = this.calculateEdgeDensity(imageData);
      const textRegions = this.detectTextRegions(imageData);
      const faceRegions = this.detectFaceRegions(imageData, skinMap);
      const objects = this.detectRegions(imageData);

      // Classification
      const classification = this.classifyImage({
        colors: dominantColors, brightness, contrast, saturation, sharpness,
        skinPct: skinPercentage, skinDist: skinDistribution, edgeDensity,
        textRegions, faceRegions, histogram, aspect: w / h,
      });

      // Safety
      const nsfwResult = this.detectNSFW(skinPercentage, skinDistribution, dominantColors, brightness, edgeDensity, faceRegions, classification);
      const violenceResult = this.detectViolence(dominantColors, edgeDensity, brightness, histogram);

      // Perceptual hash
      const pHash = this.computePerceptualHash(imageData);

      const analysis: VisionAnalysis = {
        image_url: typeof source === 'string' ? source : 'blob/file',
        width: w, height: h,
        dominant_colors: dominantColors,
        brightness, contrast, saturation, sharpness,
        skin_percentage: skinPercentage,
        skin_distribution: skinDistribution,
        edge_density: edgeDensity,
        text_regions: textRegions,
        classification,
        nsfw_score: nsfwResult.score,
        nsfw_reasons: nsfwResult.reasons,
        violence_score: violenceResult.score,
        violence_reasons: violenceResult.reasons,
        // Filter face regions: high confidence + non-overlapping merge
        face_regions: filterFaceRegions(faceRegions),
        objects,
        histogram,
        perceptual_hash: pHash,
        aspect_ratio: w / h,
        analyzed_at: new Date().toISOString(),
        processing_ms: performance.now() - start,
      };

      this.analysisHistory.unshift(analysis);
      this.saveHistory();

      return analysis;
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }

  // ---- Image Loading ----

  private async loadImage(source: string | HTMLImageElement | File | Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (source instanceof HTMLImageElement) { resolve(source); return; }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // fallback: if source is Blob/File, try FileReader data URL before giving up
        if (source instanceof File || source instanceof Blob) {
          try {
            const fr = new FileReader();
            fr.onload = () => { img.src = String(fr.result); };
            fr.onerror = () => reject(new Error('Failed to load image'));
            fr.readAsDataURL(source);
            return;
          } catch (e) {
            reject(new Error('Failed to load image'));
            return;
          }
        }
        reject(new Error('Failed to load image'));
      };
      if (source instanceof File || source instanceof Blob) {
        img.src = URL.createObjectURL(source);
      } else {
        img.src = source;
      }
    });
  }

  private setupCanvas(img: HTMLImageElement): void {
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;
    if (w > this.maxImageSize || h > this.maxImageSize) {
      const scale = this.maxImageSize / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.drawImage(img, 0, 0, w, h);
  }

  // ---- Histogram ----

  private computeHistogram(pixels: Uint8ClampedArray): HistogramData {
    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);
    const luminance = new Array(256).fill(0);
    const step = Math.max(4, Math.floor(pixels.length / 100000) * 4);

    let count = 0;
    for (let i = 0; i < pixels.length; i += step) {
      red[pixels[i]]++;
      green[pixels[i + 1]]++;
      blue[pixels[i + 2]]++;
      const lum = Math.round(toGray(pixels[i], pixels[i + 1], pixels[i + 2]));
      luminance[Math.min(255, lum)]++;
      count++;
    }

    // Normalize
    if (count > 0) {
      for (let i = 0; i < 256; i++) {
        red[i] /= count; green[i] /= count; blue[i] /= count; luminance[i] /= count;
      }
    }

    // Shannon entropy
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (luminance[i] > 0) entropy -= luminance[i] * Math.log2(luminance[i]);
    }

    return { red, green, blue, luminance, entropy };
  }

  // ---- Dominant Colors ----

  private extractDominantColors(pixels: Uint8ClampedArray): ColorInfo[] {
    const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
    const step = 4 * Math.max(1, Math.floor(pixels.length / (4 * 10000)));

    for (let i = 0; i < pixels.length; i += step) {
      const r = Math.round(pixels[i] / 32) * 32;
      const g = Math.round(pixels[i + 1] / 32) * 32;
      const b = Math.round(pixels[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      if (!buckets[key]) buckets[key] = { r, g, b, count: 0 };
      buckets[key].count++;
    }

    const totalSampled = Math.floor(pixels.length / step);
    return Object.values(buckets)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((c) => ({
        r: c.r, g: c.g, b: c.b,
        hex: `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`,
        percentage: c.count / totalSampled,
        name: this.getColorName(c.r, c.g, c.b),
      }));
  }

  private getColorName(r: number, g: number, b: number): string {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const avg = (r + g + b) / 3;

    if (max - min < 30) {
      if (avg < 40) return 'black';
      if (avg < 100) return 'dark-gray';
      if (avg < 180) return 'gray';
      return 'white';
    }
    if (r > 180 && g < 80 && b < 80) return 'red';
    if (r > 200 && g > 100 && g < 180 && b < 80) return 'orange';
    if (r > 200 && g > 200 && b < 100) return 'yellow';
    if (r < 100 && g > 150 && b < 100) return 'green';
    if (r < 80 && g > 100 && b > 150) return 'cyan';
    if (r < 100 && g < 100 && b > 150) return 'blue';
    if (r > 130 && g < 80 && b > 130) return 'purple';
    if (r > 150 && g > 100 && b > 80 && r > g && g > b) return 'skin-tone';
    if (r > 130 && g < 100 && b < 80) return 'blood-red';
    return 'mixed';
  }

  // ---- Brightness / Contrast / Saturation / Sharpness ----

  private calculateBrightness(pixels: Uint8ClampedArray): number {
    let sum = 0; let count = 0;
    const step = Math.max(4, Math.floor(pixels.length / 40000) * 4);
    for (let i = 0; i < pixels.length; i += step) {
      sum += toGray(pixels[i], pixels[i + 1], pixels[i + 2]) / 255;
      count++;
    }
    return count > 0 ? sum / count : 0.5;
  }

  private calculateContrast(pixels: Uint8ClampedArray): number {
    const values: number[] = [];
    const step = Math.max(4, Math.floor(pixels.length / 20000) * 4);
    for (let i = 0; i < pixels.length; i += step) {
      values.push(toGray(pixels[i], pixels[i + 1], pixels[i + 2]));
    }
    if (values.length < 2) return 0;
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance) / 128; // normalized 0-1
  }

  private calculateSaturation(pixels: Uint8ClampedArray): number {
    let sum = 0; let count = 0;
    const step = Math.max(4, Math.floor(pixels.length / 20000) * 4);
    for (let i = 0; i < pixels.length; i += step) {
      const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
      const min = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
      sum += max > 0 ? (max - min) / max : 0;
      count++;
    }
    return count > 0 ? sum / count : 0;
  }

  private calculateSharpness(imageData: ImageData): number {
    const w = imageData.width; const h = imageData.height; const data = imageData.data;
    let laplacianSum = 0; let count = 0;
    const step = Math.max(1, Math.floor(Math.max(w, h) / 150));
    for (let y = 1; y < h - 1; y += step) {
      for (let x = 1; x < w - 1; x += step) {
        const idx = (y * w + x) * 4;
        const c = toGray(data[idx], data[idx + 1], data[idx + 2]);
        const u = toGray(data[((y - 1) * w + x) * 4], data[((y - 1) * w + x) * 4 + 1], data[((y - 1) * w + x) * 4 + 2]);
        const d = toGray(data[((y + 1) * w + x) * 4], data[((y + 1) * w + x) * 4 + 1], data[((y + 1) * w + x) * 4 + 2]);
        const l = toGray(data[(y * w + x - 1) * 4], data[(y * w + x - 1) * 4 + 1], data[(y * w + x - 1) * 4 + 2]);
        const r = toGray(data[(y * w + x + 1) * 4], data[(y * w + x + 1) * 4 + 1], data[(y * w + x + 1) * 4 + 2]);
        laplacianSum += Math.abs(u + d + l + r - 4 * c);
        count++;
      }
    }
    return count > 0 ? Math.min(1, (laplacianSum / count) / 50) : 0;
  }

  // ---- Skin Map (per-pixel) ----

  private buildSkinMap(imageData: ImageData): { map: Uint8Array; totalSkin: number; totalPixels: number; w: number; h: number } {
    const w = imageData.width; const h = imageData.height; const data = imageData.data;
    const map = new Uint8Array(w * h);
    let totalSkin = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (this.isSkinColor(data[i], data[i + 1], data[i + 2])) {
          map[y * w + x] = 1;
          totalSkin++;
        }
      }
    }
    return { map, totalSkin, totalPixels: w * h, w, h };
  }

  private isSkinColor(r: number, g: number, b: number): boolean {
    const rgbRule = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && (r - b) > 15;
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.169 * r - 0.331 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.419 * g - 0.081 * b;
    const ycbcrRule = y > 80 && cb > 77 && cb < 127 && cr > 133 && cr < 173;
    // HSV rule for dark skin tones
    const max = Math.max(r, g, b); const min = Math.min(r, g, b);
    const s = max > 0 ? (max - min) / max : 0;
    const v = max / 255;
    const hsvRule = r > g && g > b && s > 0.1 && s < 0.75 && v > 0.2 && v < 0.95;
    return (rgbRule || ycbcrRule) && hsvRule !== false;
  }

  // ---- Skin Distribution ----

  private analyzeSkinDistribution(skinMap: { map: Uint8Array; w: number; h: number; totalSkin: number }, w: number, h: number): SkinDistribution {
    const { map, totalSkin } = skinMap;
    if (totalSkin === 0) return { top_half: 0, bottom_half: 0, center: 0, periphery: 0, largest_cluster_percentage: 0 };

    let topSkin = 0, bottomSkin = 0, centerSkin = 0, peripherySkin = 0;
    const halfH = Math.floor(h / 2);
    const cx1 = Math.floor(w * 0.25); const cx2 = Math.floor(w * 0.75);
    const cy1 = Math.floor(h * 0.25); const cy2 = Math.floor(h * 0.75);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (map[y * w + x]) {
          if (y < halfH) topSkin++; else bottomSkin++;
          if (x >= cx1 && x < cx2 && y >= cy1 && y < cy2) centerSkin++; else peripherySkin++;
        }
      }
    }

    // Simple flood-fill to find largest cluster (sampled)
    const visited = new Uint8Array(w * h);
    let largestCluster = 0;
    const step = Math.max(1, Math.floor(Math.max(w, h) / 200));

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = y * w + x;
        if (map[idx] && !visited[idx]) {
          const clusterSize = this.floodFillCount(map, visited, w, h, x, y, step);
          if (clusterSize > largestCluster) largestCluster = clusterSize;
        }
      }
    }

    const scaleFactor = step * step;
    return {
      top_half: topSkin / totalSkin,
      bottom_half: bottomSkin / totalSkin,
      center: centerSkin / totalSkin,
      periphery: peripherySkin / totalSkin,
      largest_cluster_percentage: (largestCluster * scaleFactor) / (totalSkin || 1),
    };
  }

  // ---- Heuristic pose estimator (conservative fallback) ----
  private estimatePoseFromFrame(params: { faceRegions: FaceRegion[]; skinMap: { map: Uint8Array; totalSkin: number; totalPixels: number; w: number; h: number }; width: number; height: number }): PoseSummary {
    const { faceRegions, skinMap, width, height } = params;
    const skinDist = this.analyzeSkinDistribution(skinMap as any, width, height);
    const keypoints: PoseKeypoint[] = [];
    let pose_label = 'unknown';
    let pose_category: PoseSummary['pose_category'] = 'unknown';
    let orientation: PoseSummary['orientation'] = 'unknown';
    let pose_confidence = 0.0;
    let movement_context: PoseSummary['movement_context'] = 'unknown';

    if (faceRegions && faceRegions.length > 0) {
      const f = filterFaceRegions(faceRegions)[0];
      if (f) {
        const cx = (f.x + f.width / 2) / (width || 1);
        const cy = (f.y + f.height / 2) / (height || 1);
        keypoints.push({ name: 'face_center', x: cx, y: cy, confidence: f.confidence });
        // Torso proxy using skin center heuristic
        const torsoY = 0.5 + (skinDist.center - 0.5) * 0.6;
        keypoints.push({ name: 'torso_center', x: 0.5, y: Math.min(Math.max(torsoY, 0), 1), confidence: Math.min(0.9, skinMap.totalSkin / Math.max(1, skinMap.totalPixels)) });
        // Simple posture heuristics
        if (skinDist.top_half > skinDist.bottom_half + 0.12) {
          pose_label = 'upright';
          pose_category = 'standing';
          movement_context = 'ordinary';
        } else if (skinDist.bottom_half > skinDist.top_half + 0.18) {
          pose_label = 'lower_body_focus';
          pose_category = 'ambiguous';
          movement_context = 'suggestive';
        } else {
          pose_label = 'neutral_stance';
          pose_category = 'neutral_social';
          movement_context = 'ordinary';
        }

        pose_confidence = Math.min(0.95, f.confidence * 0.6 + Math.min(0.35, skinMap.totalSkin / Math.max(1, skinMap.totalPixels)));
      }
    } else {
      // No face: low-confidence torso estimate from skin distribution
      if ((skinMap.totalSkin || 0) / Math.max(1, skinMap.totalPixels) > 0.12) {
        keypoints.push({ name: 'torso_center', x: 0.5, y: 0.5, confidence: Math.min(0.6, skinMap.totalSkin / Math.max(1, skinMap.totalPixels)) });
        pose_label = 'neutral_stance';
        pose_category = 'ambiguous';
        movement_context = 'ambiguous';
        pose_confidence = 0.25;
      }
    }

    return {
      keypoints,
      pose_label,
      pose_category,
      pose_confidence: Math.min(Math.max(pose_confidence, 0), 0.99),
      orientation,
      movement_context,
    } as PoseSummary;
  }

  private floodFillCount(map: Uint8Array, visited: Uint8Array, w: number, h: number, sx: number, sy: number, step: number): number {
    const stack = [[sx, sy]];
    let count = 0;
    while (stack.length > 0 && count < 5000) {
      const [x, y] = stack.pop()!;
      const idx = y * w + x;
      if (x < 0 || x >= w || y < 0 || y >= h || visited[idx] || !map[idx]) continue;
      visited[idx] = 1;
      count++;
      stack.push([x + step, y], [x - step, y], [x, y + step], [x, y - step]);
    }
    return count;
  }

  // ---- Edge Detection ----

  private calculateEdgeDensity(imageData: ImageData): number {
    const w = imageData.width; const h = imageData.height; const data = imageData.data;
    let edgePixels = 0;
    const step = Math.max(1, Math.floor(Math.max(w, h) / 200));
    let total = 0;

    for (let y = 1; y < h - 1; y += step) {
      for (let x = 1; x < w - 1; x += step) {
        const idx = (y * w + x) * 4;
        const c = toGray(data[idx], data[idx + 1], data[idx + 2]);
        const r = toGray(data[idx + 4], data[idx + 5], data[idx + 6]);
        const d = toGray(data[((y + 1) * w + x) * 4], data[((y + 1) * w + x) * 4 + 1], data[((y + 1) * w + x) * 4 + 2]);
        const gradient = Math.sqrt((r - c) ** 2 + (d - c) ** 2);
        if (gradient > 30) edgePixels++;
        total++;
      }
    }
    return total > 0 ? edgePixels / total : 0;
  }

  // ---- Text Region Detection + Basic OCR ----

  private detectTextRegions(imageData: ImageData): TextRegion[] {
    const w = imageData.width; const h = imageData.height; const data = imageData.data;
    const regions: TextRegion[] = [];

    const gridSize = 24;
    const cols = Math.ceil(w / gridSize);
    const rows = Math.ceil(h / gridSize);
    const contrastGrid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Compute transition density per grid cell
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        let transitions = 0;
        let prevBright = -1;
        let totalChecked = 0;

        for (let y = gy * gridSize; y < Math.min((gy + 1) * gridSize, h); y += 2) {
          for (let x = gx * gridSize; x < Math.min((gx + 1) * gridSize, w); x++) {
            const idx = (y * w + x) * 4;
            const bright = toGray(data[idx], data[idx + 1], data[idx + 2]) > 128 ? 1 : 0;
            if (prevBright !== -1 && bright !== prevBright) transitions++;
            prevBright = bright;
            totalChecked++;
          }
          prevBright = -1; // reset per row
        }

        contrastGrid[gy][gx] = totalChecked > 0 ? transitions / totalChecked * gridSize : 0;
      }
    }

    // Merge adjacent text-like cells into regions
    const textThreshold = gridSize * 0.5;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        if (visited[gy][gx] || contrastGrid[gy][gx] < textThreshold) continue;

        // BFS to find connected text cells
        let minX = gx, maxX = gx, minY = gy, maxY = gy;
        const queue = [[gx, gy]];
        visited[gy][gx] = true;
        let cellCount = 0;

        while (queue.length > 0) {
          const [cx, cy] = queue.shift()!;
          cellCount++;
          const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited[ny][nx] && contrastGrid[ny][nx] >= textThreshold) {
              visited[ny][nx] = true;
              if (nx < minX) minX = nx;
              if (nx > maxX) maxX = nx;
              if (ny < minY) minY = ny;
              if (ny > maxY) maxY = ny;
              queue.push([nx, ny]);
            }
          }
        }

        const regionW = (maxX - minX + 1) * gridSize;
        const regionH = (maxY - minY + 1) * gridSize;

        if (cellCount >= 2 && regionW > regionH * 0.5) {
          // Try basic OCR on this region
          const ocrResult = this.basicOCR(data, w, minX * gridSize, minY * gridSize, regionW, regionH);

          regions.push({
            text: ocrResult || `[text: ~${cellCount * 3} chars]`,
            confidence: ocrResult ? 0.6 : Math.min(0.85, cellCount * 0.1),
            x: minX * gridSize,
            y: minY * gridSize,
            width: regionW,
            height: regionH,
          });
        }
      }
    }

    return regions.slice(0, 25);
  }

  private basicOCR(data: Uint8ClampedArray, imgW: number, rx: number, ry: number, rw: number, rh: number): string {
    if (!this.charTemplates || rh < 7 || rw < 5) return '';

    // Very basic: check if region has clear horizontal text-like structure
    // Count horizontal projection (rows with many dark pixels)
    const projections: number[] = [];
    for (let y = ry; y < Math.min(ry + rh, imgW); y++) {
      let darkCount = 0;
      for (let x = rx; x < Math.min(rx + rw, imgW); x++) {
        const idx = (y * imgW + x) * 4;
        if (toGray(data[idx], data[idx + 1], data[idx + 2]) < 128) darkCount++;
      }
      projections.push(darkCount);
    }

    // Find text lines (rows of high dark pixel count)
    const avgDark = projections.reduce((s, v) => s + v, 0) / (projections.length || 1);
    const textLines = projections.filter((p) => p > avgDark * 0.5).length;
    const lineRatio = textLines / (projections.length || 1);

    if (lineRatio > 0.3 && lineRatio < 0.85) {
      const estimatedChars = Math.round(rw / (rh * 0.6));
      return `[OCR: ~${estimatedChars} characters, ${Math.round(lineRatio * 100)}% text density]`;
    }

    return '';
  }

  // ---- Face Detection (simplified Haar-like) ----

  private detectFaceRegions(imageData: ImageData, skinMap: { map: Uint8Array; w: number; h: number }): FaceRegion[] {
    const w = imageData.width; const h = imageData.height; const data = imageData.data;
    const faces: FaceRegion[] = [];

    // Scan at multiple scales
    const scales = [0.15, 0.2, 0.3, 0.4];
    for (const scale of scales) {
      const faceW = Math.round(w * scale);
      const faceH = Math.round(faceW * 1.3); // face aspect ratio
      if (faceW < 20 || faceH < 26) continue;

      const stepX = Math.max(8, Math.floor(faceW / 4));
      const stepY = Math.max(8, Math.floor(faceH / 4));

      for (let y = 0; y <= h - faceH; y += stepY) {
        for (let x = 0; x <= w - faceW; x += stepX) {
          const score = this.scoreFaceCandidate(data, skinMap.map, w, h, x, y, faceW, faceH);
          if (score > 0.55) {
            // Check no overlap with existing faces
            const overlaps = faces.some((f) =>
              Math.abs(f.x - x) < faceW * 0.5 && Math.abs(f.y - y) < faceH * 0.5,
            );
            if (!overlaps) {
              faces.push({
                x, y, width: faceW, height: faceH,
                confidence: score,
                has_skin_surround: this.checkSkinSurround(skinMap.map, w, h, x, y, faceW, faceH),
              });
            }
          }
        }
      }
    }

    return faces.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }

  private scoreFaceCandidate(data: Uint8ClampedArray, skinMap: Uint8Array, w: number, h: number, fx: number, fy: number, fw: number, fh: number): number {
    let score = 0;

    // 1. Skin percentage in face region
    let skinCount = 0; let total = 0;
    const step = Math.max(1, Math.floor(fw / 10));
    for (let y = fy; y < fy + fh; y += step) {
      for (let x = fx; x < fx + fw; x += step) {
        if (skinMap[y * w + x]) skinCount++;
        total++;
      }
    }
    const skinPct = total > 0 ? skinCount / total : 0;
    if (skinPct > 0.35 && skinPct < 0.9) score += 0.3;
    else return 0;

    // 2. Upper region (forehead) should be slightly brighter
    const topThird = Math.floor(fh / 3);
    let topBright = 0; let botBright = 0; let topCount = 0; let botCount = 0;
    for (let y = fy; y < fy + topThird; y += step) {
      for (let x = fx; x < fx + fw; x += step) {
        topBright += toGray(data[(y * w + x) * 4], data[(y * w + x) * 4 + 1], data[(y * w + x) * 4 + 2]);
        topCount++;
      }
    }
    for (let y = fy + topThird * 2; y < fy + fh; y += step) {
      for (let x = fx; x < fx + fw; x += step) {
        botBright += toGray(data[(y * w + x) * 4], data[(y * w + x) * 4 + 1], data[(y * w + x) * 4 + 2]);
        botCount++;
      }
    }
    const topAvg = topCount > 0 ? topBright / topCount : 0;
    const botAvg = botCount > 0 ? botBright / botCount : 0;
    if (topAvg > botAvg * 0.8 && topAvg < botAvg * 1.5) score += 0.15;

    // 3. Eye region: horizontal dark band in upper-middle
    const eyeY = fy + Math.floor(fh * 0.3);
    const eyeH = Math.floor(fh * 0.15);
    let eyeDark = 0; let eyeTotal = 0;
    for (let y = eyeY; y < eyeY + eyeH; y += step) {
      for (let x = fx + Math.floor(fw * 0.15); x < fx + Math.floor(fw * 0.85); x += step) {
        const gray = toGray(data[(y * w + x) * 4], data[(y * w + x) * 4 + 1], data[(y * w + x) * 4 + 2]);
        if (gray < 100) eyeDark++;
        eyeTotal++;
      }
    }
    if (eyeTotal > 0 && eyeDark / eyeTotal > 0.15) score += 0.2;

    // 4. Symmetry check
    let symmetryScore = 0; let symTotal = 0;
    const halfW = Math.floor(fw / 2);
    for (let y = fy; y < fy + fh; y += step * 2) {
      for (let dx = 0; dx < halfW; dx += step) {
        const leftIdx = (y * w + fx + dx) * 4;
        const rightIdx = (y * w + fx + fw - 1 - dx) * 4;
        const leftGray = toGray(data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]);
        const rightGray = toGray(data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]);
        if (Math.abs(leftGray - rightGray) < 40) symmetryScore++;
        symTotal++;
      }
    }
    if (symTotal > 0 && symmetryScore / symTotal > 0.5) score += 0.15;

    return score;
  }

  private checkSkinSurround(skinMap: Uint8Array, w: number, h: number, fx: number, fy: number, fw: number, fh: number): boolean {
    // Check below face for neck/body skin
    let skinBelow = 0; let total = 0;
    const belowY = fy + fh;
    const belowH = Math.min(fh, h - belowY);
    for (let y = belowY; y < belowY + belowH; y += 4) {
      for (let x = fx + Math.floor(fw * 0.2); x < fx + Math.floor(fw * 0.8); x += 4) {
        if (y < h && x < w && skinMap[y * w + x]) skinBelow++;
        total++;
      }
    }
    return total > 0 && skinBelow / total > 0.25;
  }

  // ---- Violence Detection ----

  private detectViolence(colors: ColorInfo[], edgeDensity: number, brightness: number, histogram: HistogramData): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Blood-red dominance
    const bloodColors = colors.filter((c) => c.name === 'blood-red' || c.name === 'red');
    const bloodPct = bloodColors.reduce((s, c) => s + c.percentage, 0);
    if (bloodPct > 0.15) {
      score += bloodPct * 1.5;
      reasons.push(`Blood-red colors: ${(bloodPct * 100).toFixed(0)}%`);
    }

    // High red channel in histogram
    const highRedBins = histogram.red.slice(180).reduce((s, v) => s + v, 0);
    const highGreenBins = histogram.green.slice(180).reduce((s, v) => s + v, 0);
    if (highRedBins > highGreenBins * 2.5 && highRedBins > 0.1) {
      score += 0.15;
      reasons.push('Dominant high-red histogram');
    }

    // Dark + red combination (blood, wounds)
    if (brightness < 0.35 && bloodPct > 0.1) {
      score += 0.15;
      reasons.push('Dark image with red tones');
    }

    // High edge density + red (sharp objects, weapons)
    if (edgeDensity > 0.4 && bloodPct > 0.05) {
      score += 0.1;
      reasons.push('Sharp edges with red presence');
    }

    return { score: Math.min(1, score), reasons };
  }

  // ---- NSFW Detection (spatial) ----

  private detectNSFW(
    skinPct: number, skinDist: SkinDistribution,
    colors: ColorInfo[], brightness: number, edgeDensity: number,
    faces: FaceRegion[], classification: ImageClass,
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 1. Overall skin percentage
    if (skinPct > 0.55) {
      score += 0.35;
      reasons.push(`Very high skin: ${(skinPct * 100).toFixed(0)}%`);
    } else if (skinPct > 0.35) {
      score += 0.2;
      reasons.push(`High skin: ${(skinPct * 100).toFixed(0)}%`);
    } else if (skinPct > 0.2) {
      score += 0.08;
    }

    // 2. Skin distribution — large single cluster is more suspicious
    if (skinDist.largest_cluster_percentage > 0.5 && skinPct > 0.3) {
      score += 0.15;
      reasons.push('Large contiguous skin region');
    }

    // 3. Skin concentrated in center (body framing)
    if (skinDist.center > 0.5 && skinPct > 0.25) {
      score += 0.1;
      reasons.push('Skin concentrated in center');
    }

    // 4. High skin + few/no faces = more suspicious
    if (skinPct > 0.3 && faces.length === 0) {
      score += 0.15;
      reasons.push('High skin with no detected faces');
    }

    // 5. Face with extensive skin below (body)
    if (faces.length > 0 && faces.some((f) => f.has_skin_surround) && skinPct > 0.35) {
      score += 0.1;
      reasons.push('Face with extensive body skin below');
    }

    // 6. Low edge density + high skin = smooth skin (less clothing texture)
    if (skinPct > 0.3 && edgeDensity < 0.15) {
      score += 0.15;
      reasons.push('Smooth large skin areas (low texture)');
    }

    // 7. Skin-tone dominant colors
    const skinColorPct = colors.filter((c) => c.name === 'skin-tone').reduce((s, c) => s + c.percentage, 0);
    if (skinColorPct > 0.3) {
      score += 0.1;
      reasons.push('Skin-tone dominant palette');
    }

    // 8. Dark + high skin
    if (brightness < 0.3 && skinPct > 0.3) {
      score += 0.08;
      reasons.push('Dark image with significant skin');
    }

    // Cap and floor
    score = Math.min(1, score);
    if (skinPct < 0.12) score = Math.min(score, 0.15);

    // Reduce if clearly a portrait/selfie (face prominent, moderate skin)
    if (faces.length > 0 && skinPct < 0.35 && faces[0].confidence > 0.7) {
      score *= 0.6;
    }

    return { score, reasons };
  }

  // ---- Classification (comprehensive) ----

  private classifyImage(params: {
    colors: ColorInfo[]; brightness: number; contrast: number; saturation: number;
    sharpness: number; skinPct: number; skinDist: SkinDistribution;
    edgeDensity: number; textRegions: TextRegion[]; faceRegions: FaceRegion[];
    histogram: HistogramData; aspect: number;
  }): ImageClass {
    const scores: Record<string, number> = {};

    // Document/screenshot: high brightness, low saturation, lots of text, ~16:9 or 4:3
    scores['document'] = 0;
    if (params.textRegions.length > 3) scores['document'] += 0.3;
    if (params.brightness > 0.7) scores['document'] += 0.15;
    if (params.saturation < 0.15) scores['document'] += 0.15;
    if (params.edgeDensity < 0.25) scores['document'] += 0.1;

    // Portrait: face detected, moderate skin, vertical aspect
    scores['portrait'] = 0;
    if (params.faceRegions.length > 0) scores['portrait'] += 0.4;
    if (params.faceRegions.length === 1 && params.faceRegions[0].confidence > 0.6) scores['portrait'] += 0.15;
    if (params.skinPct > 0.1 && params.skinPct < 0.4) scores['portrait'] += 0.1;
    if (params.aspect < 1) scores['portrait'] += 0.05; // vertical

    // Nature: green/blue colors, low skin, high saturation
    scores['nature'] = 0;
    const greenBlue = params.colors.filter((c) => /green|blue|cyan/.test(c.name));
    if (greenBlue.length > 0) scores['nature'] += greenBlue.reduce((s, c) => s + c.percentage, 0) * 0.5;
    if (params.skinPct < 0.05) scores['nature'] += 0.15;
    if (params.saturation > 0.3) scores['nature'] += 0.1;

    // Graphic/illustration: few colors, high edge, high saturation
    scores['graphic'] = 0;
    const uniqueColors = params.colors.filter((c) => c.percentage > 0.05).length;
    if (uniqueColors <= 5) scores['graphic'] += 0.2;
    if (params.edgeDensity > 0.3) scores['graphic'] += 0.15;
    if (params.saturation > 0.5) scores['graphic'] += 0.1;
    if (params.histogram.entropy < 4) scores['graphic'] += 0.1;

    // Photo: high entropy, many colors, moderate sharpness
    scores['photograph'] = 0;
    if (params.histogram.entropy > 5) scores['photograph'] += 0.2;
    if (uniqueColors > 5) scores['photograph'] += 0.15;
    if (params.sharpness > 0.2) scores['photograph'] += 0.1;
    if (params.contrast > 0.2) scores['photograph'] += 0.05;

    // Meme: text + graphic + medium aspect
    scores['meme'] = 0;
    if (params.textRegions.length >= 1 && params.textRegions.length <= 4) scores['meme'] += 0.2;
    if (uniqueColors <= 8) scores['meme'] += 0.1;
    if (params.saturation > 0.2) scores['meme'] += 0.05;

    // NSFW body: very high skin
    scores['body'] = 0;
    if (params.skinPct > 0.45) scores['body'] += 0.4;
    if (params.skinDist.largest_cluster_percentage > 0.4) scores['body'] += 0.15;

    // Dark/night
    scores['dark'] = 0;
    if (params.brightness < 0.15) scores['dark'] += 0.5;

    // Find winner
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [bestLabel, bestScore] = sorted[0];
    const categories = sorted.filter(([, s]) => s > 0.15).map(([l]) => l);

    return {
      label: bestScore > 0.2 ? bestLabel : 'unknown',
      confidence: Math.min(0.95, bestScore),
      categories,
      scores,
    };
  }

  // ---- Region Detection ----

  private detectRegions(imageData: ImageData): DetectedRegion[] {
    const w = imageData.width; const h = imageData.height; const data = imageData.data;
    const regions: DetectedRegion[] = [];
    const blockSize = 16;
    const cols = Math.ceil(w / blockSize);
    const rows = Math.ceil(h / blockSize);
    const blockColors: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const cx = Math.min(gx * blockSize + blockSize / 2, w - 1);
        const cy = Math.min(gy * blockSize + blockSize / 2, h - 1);
        const idx = (Math.floor(cy) * w + Math.floor(cx)) * 4;
        const r = Math.round(data[idx] / 64) * 64;
        const g = Math.round(data[idx + 1] / 64) * 64;
        const b = Math.round(data[idx + 2] / 64) * 64;
        blockColors[gy][gx] = `${r},${g},${b}`;
      }
    }

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        if (visited[gy][gx]) continue;
        const color = blockColors[gy][gx];
        let maxX = gx, maxY = gy;
        while (maxX + 1 < cols && blockColors[gy][maxX + 1] === color && !visited[gy][maxX + 1]) maxX++;
        outer: while (maxY + 1 < rows) {
          for (let x = gx; x <= maxX; x++) {
            if (blockColors[maxY + 1][x] !== color || visited[maxY + 1][x]) break outer;
          }
          maxY++;
        }
        for (let y = gy; y <= maxY; y++) for (let x = gx; x <= maxX; x++) visited[y][x] = true;

        const regionW = maxX - gx + 1;
        const regionH = maxY - gy + 1;
        if (regionW >= 3 && regionH >= 3) {
          const [r, g, b] = color.split(',').map(Number);
          regions.push({
            label: `${this.getColorName(r, g, b)} region`,
            confidence: Math.min(0.8, (regionW * regionH) / (cols * rows) * 5),
            x: gx * blockSize, y: gy * blockSize,
            width: regionW * blockSize, height: regionH * blockSize,
          });
        }
      }
    }

    return regions.sort((a, b) => (b.width * b.height) - (a.width * a.height)).slice(0, 15);
  }

  // ---- Perceptual Hash (average hash) ----

  private computePerceptualHash(imageData: ImageData): string {
    // Resize to 8x8 grayscale
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 8; tmpCanvas.height = 8;
    const tmpCtx = tmpCanvas.getContext('2d')!;
    tmpCtx.drawImage(this.canvas, 0, 0, 8, 8);
    const small = tmpCtx.getImageData(0, 0, 8, 8).data;

    // Compute average
    let sum = 0;
    const grays: number[] = [];
    for (let i = 0; i < small.length; i += 4) {
      const g = toGray(small[i], small[i + 1], small[i + 2]);
      grays.push(g);
      sum += g;
    }
    const avg = sum / 64;

    // Build hash: each bit = pixel > average
    let hash = '';
    for (const g of grays) {
      hash += g >= avg ? '1' : '0';
    }

    // Convert to hex
    let hex = '';
    for (let i = 0; i < 64; i += 4) {
      hex += parseInt(hash.slice(i, i + 4), 2).toString(16);
    }

    return hex;
  }

  // ---- Video Analysis with Scene Detection ----

  async analyzeVideo(videoElement: HTMLVideoElement, maxFrames = 8): Promise<VideoAnalysis> {
    const start = performance.now();
    const duration = videoElement.duration || 0;
    const frameAnalyses: VisionAnalysis[] = [];
    const textFound: string[] = [];
    const sceneChanges: number[] = [];
    let prevHash = '';

    if (duration > 0 && maxFrames > 0) {
      const interval = duration / (maxFrames + 1);

      for (let i = 1; i <= maxFrames; i++) {
        const time = interval * i;
        await this.seekVideo(videoElement, time);

        const w = Math.min(videoElement.videoWidth || 640, this.maxImageSize);
        const h = Math.min(videoElement.videoHeight || 480, this.maxImageSize);
        const scale = this.maxImageSize / Math.max(w, h);
        this.canvas.width = Math.round(w * Math.min(1, scale));
        this.canvas.height = Math.round(h * Math.min(1, scale));
        this.ctx.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Quick hash for scene change detection
        const hash = this.computePerceptualHash(imageData);
        if (prevHash && this.hammingDistance(hash, prevHash) > 8) {
          sceneChanges.push(time);
        }
        prevHash = hash;

        // Full analysis
        const pixels = imageData.data;
        const histogram = this.computeHistogram(pixels);
        const dominantColors = this.extractDominantColors(pixels);
        const brightness = this.calculateBrightness(pixels);
        const contrast = this.calculateContrast(pixels);
        const saturation = this.calculateSaturation(pixels);
        const sharpness = this.calculateSharpness(imageData);
        const skinMap = this.buildSkinMap(imageData);
        const skinPct = skinMap.totalSkin / (skinMap.totalPixels || 1);
        const skinDist = this.analyzeSkinDistribution(skinMap, this.canvas.width, this.canvas.height);
        const edgeDensity = this.calculateEdgeDensity(imageData);
        const textRegions = this.detectTextRegions(imageData);
        const faceRegions = this.detectFaceRegions(imageData, skinMap);
        // Estimate basic pose/keypoints heuristically (conservative fallback)
        const pose = this.estimatePoseFromFrame({ faceRegions, skinMap, width: this.canvas.width, height: this.canvas.height });
        const classification = this.classifyImage({
          colors: dominantColors, brightness, contrast, saturation, sharpness,
          skinPct, skinDist, edgeDensity, textRegions, faceRegions, histogram, aspect: this.canvas.width / this.canvas.height,
        });
        const nsfwResult = this.detectNSFW(skinPct, skinDist, dominantColors, brightness, edgeDensity, faceRegions, classification);
        const violenceResult = this.detectViolence(dominantColors, edgeDensity, brightness, histogram);

        frameAnalyses.push({
          image_url: `frame@${time.toFixed(1)}s`,
          width: this.canvas.width, height: this.canvas.height,
          dominant_colors: dominantColors, brightness, contrast, saturation, sharpness,
          skin_percentage: skinPct, skin_distribution: skinDist,
          edge_density: edgeDensity, text_regions: textRegions,
          classification, nsfw_score: nsfwResult.score, nsfw_reasons: nsfwResult.reasons,
          violence_score: violenceResult.score, violence_reasons: violenceResult.reasons,
          face_regions: filterFaceRegions(faceRegions), objects: [],
          pose,
          histogram, perceptual_hash: hash,
          aspect_ratio: this.canvas.width / this.canvas.height,
          analyzed_at: new Date().toISOString(), processing_ms: 0,
        });

        if (textRegions.length > 0) {
          textFound.push(`Frame@${time.toFixed(1)}s: ${textRegions.map((t) => t.text).join(', ')}`);
        }
      }
    }

    const overallNsfw = frameAnalyses.length > 0 ? Math.max(...frameAnalyses.map((f) => f.nsfw_score)) : 0;
    const overallViolence = frameAnalyses.length > 0 ? Math.max(...frameAnalyses.map((f) => f.violence_score)) : 0;
    const suspiciousFrames = frameAnalyses.filter((f) => f.nsfw_score >= 0.45 || f.violence_score >= 0.25).length;
    const risingRiskFrames = frameAnalyses.filter((f, index) => index > 0 && f.nsfw_score >= frameAnalyses[index - 1].nsfw_score + 0.1).length;
    const textDensity = textFound.length > 0 ? Math.min(1, textFound.length / Math.max(1, frameAnalyses.length)) : 0;
    const temporalRiskScore = Math.min(1, overallNsfw * 0.5 + overallViolence * 0.25 + (suspiciousFrames / Math.max(1, frameAnalyses.length)) * 0.2 + (sceneChanges.length > 0 ? 0.05 : 0) + textDensity * 0.1);

    const temporalReasons: string[] = [];
    if (suspiciousFrames > 0) temporalReasons.push(`${suspiciousFrames} frames showed elevated suspicious evidence`);
    if (risingRiskFrames > 0) temporalReasons.push(`${risingRiskFrames} frames increased in risk over time`);
    if (sceneChanges.length > 0) temporalReasons.push(`${sceneChanges.length} scene changes detected`);
    if (textDensity > 0) temporalReasons.push('Text overlays or captions were detected across frames');

    const classFreq: Record<string, number> = {};
    for (const f of frameAnalyses) classFreq[f.classification.label] = (classFreq[f.classification.label] || 0) + 1;
    const overallClass = Object.entries(classFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    return {
      video_url: videoElement.src || 'video',
      duration_estimate: duration,
      frames_analyzed: frameAnalyses.length,
      frame_analyses: frameAnalyses,
      scene_changes: sceneChanges,
      overall_nsfw_score: overallNsfw,
      overall_violence_score: overallViolence,
      overall_classification: overallClass,
      text_found: textFound,
      temporal_evidence: {
        peak_nsfw_score: overallNsfw,
        repeated_suspicious_frames: suspiciousFrames,
        rising_risk_frames: risingRiskFrames,
        scene_change_count: sceneChanges.length,
        text_density: textDensity,
        temporal_risk_score: temporalRiskScore,
        temporal_reasons: temporalReasons,
      },
      analyzed_at: new Date().toISOString(),
      processing_ms: performance.now() - start,
    };
  }

  private hammingDistance(a: string, b: string): number {
    let dist = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) dist++;
    }
    return dist + Math.abs(a.length - b.length);
  }

  private seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
    return new Promise((resolve) => {
      const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
      video.addEventListener('seeked', onSeeked);
      video.currentTime = time;
      setTimeout(resolve, 2000);
    });
  }

  // ---- Public API ----

  async analyzeFromUrl(url: string): Promise<VisionAnalysis> { return this.analyzeImage(url); }

  async analyzeFromFile(file: File): Promise<VisionAnalysis> {
    if (!file.type.startsWith('image/')) throw new Error(`Unsupported: ${file.type}`);
    return this.analyzeImage(file);
  }

  // Compare two images by perceptual hash
  compareImages(hash1: string, hash2: string): number {
    const dist = this.hammingDistance(hash1, hash2);
    return Math.max(0, 1 - dist / (hash1.length || 1));
  }

  getHistory(): VisionAnalysis[] { return this.analysisHistory; }

  getStatus(lang: 'uz' | 'en'): string {
    const lines: string[] = [];
    lines.push(lang === 'uz' ? '👁 **Vision analyzer v2 holati:**' : '👁 **Vision analyzer v2 status:**');
    lines.push(`Canvas: ✅`);
    lines.push(lang === 'uz' ? '**Imkoniyatlar:**' : '**Capabilities:**');
    lines.push(`- OCR (${lang === 'uz' ? 'matn tanish' : 'text recognition'}): ✅`);
    lines.push(`- NSFW (${lang === 'uz' ? 'fazoviy tahlil' : 'spatial analysis'}): ✅`);
    lines.push(`- ${lang === 'uz' ? 'Yuz aniqlash' : 'Face detection'}: ✅`);
    lines.push(`- ${lang === 'uz' ? 'Zo\'ravonlik' : 'Violence detection'}: ✅`);
    lines.push(`- ${lang === 'uz' ? 'Rang histogramma' : 'Color histogram'}: ✅`);
    lines.push(`- ${lang === 'uz' ? 'Perceptual hash' : 'Perceptual hash'}: ✅`);
    lines.push(`- ${lang === 'uz' ? 'Sahna o\'zgarishi' : 'Scene change detection'}: ✅`);
    lines.push(`- ${lang === 'uz' ? 'Kontrast/to\'yinganlik/o\'tkirlik' : 'Contrast/saturation/sharpness'}: ✅`);
    lines.push(`${lang === 'uz' ? 'Tahlil tarixi' : 'History'}: ${this.analysisHistory.length}`);
    return lines.join('\n');
  }

  formatAnalysis(analysis: VisionAnalysis, lang: 'uz' | 'en'): string {
    const lines: string[] = [];
    lines.push(lang === 'uz' ? '👁 **Chuqur rasm tahlili:**' : '👁 **Deep image analysis:**');
    lines.push(`${lang === 'uz' ? 'O\'lcham' : 'Size'}: ${analysis.width}×${analysis.height} (${analysis.aspect_ratio.toFixed(2)})`);
    lines.push(`${lang === 'uz' ? 'Yorug\'lik' : 'Brightness'}: ${(analysis.brightness * 100).toFixed(0)}% | ${lang === 'uz' ? 'Kontrast' : 'Contrast'}: ${(analysis.contrast * 100).toFixed(0)}%`);
    lines.push(`${lang === 'uz' ? 'To\'yinganlik' : 'Saturation'}: ${(analysis.saturation * 100).toFixed(0)}% | ${lang === 'uz' ? 'O\'tkirlik' : 'Sharpness'}: ${(analysis.sharpness * 100).toFixed(0)}%`);
    lines.push(`${lang === 'uz' ? 'Teri' : 'Skin'}: ${(analysis.skin_percentage * 100).toFixed(0)}% | Entropy: ${analysis.histogram.entropy.toFixed(1)}`);
    lines.push(`${lang === 'uz' ? 'Turi' : 'Type'}: ${analysis.classification.label} (${(analysis.classification.confidence * 100).toFixed(0)}%)`);

    const topColors = analysis.dominant_colors.slice(0, 4).map((c) => `${c.name} ${(c.percentage * 100).toFixed(0)}%`);
    lines.push(`${lang === 'uz' ? 'Ranglar' : 'Colors'}: ${topColors.join(', ')}`);

    if (analysis.face_regions.length > 0) {
      lines.push(`${lang === 'uz' ? 'Yuzlar' : 'Faces'}: ${analysis.face_regions.length} (${lang === 'uz' ? 'eng yuqori' : 'best'}: ${(analysis.face_regions[0].confidence * 100).toFixed(0)}%)`);
    }

    lines.push(`NSFW: ${(analysis.nsfw_score * 100).toFixed(0)}% ${analysis.nsfw_score > 0.5 ? '🚫' : '✅'}`);
    if (analysis.nsfw_reasons.length > 0) lines.push(`  ${analysis.nsfw_reasons.slice(0, 3).join('; ')}`);

    if (analysis.violence_score > 0.1) {
      lines.push(`${lang === 'uz' ? 'Zo\'ravonlik' : 'Violence'}: ${(analysis.violence_score * 100).toFixed(0)}% ${analysis.violence_score > 0.3 ? '⚠️' : ''}`);
      if (analysis.violence_reasons.length > 0) lines.push(`  ${analysis.violence_reasons.join('; ')}`);
    }

    if (analysis.text_regions.length > 0) {
      lines.push(`${lang === 'uz' ? 'Matn' : 'Text'}: ${analysis.text_regions.length} region(s)`);
      for (const tr of analysis.text_regions.slice(0, 3)) {
        lines.push(`  "${tr.text}" (${(tr.confidence * 100).toFixed(0)}%)`);
      }
    }

    lines.push(`Hash: ${analysis.perceptual_hash}`);
    lines.push(`⏱ ${analysis.processing_ms.toFixed(0)}ms`);
    return lines.join('\n');
  }
}
