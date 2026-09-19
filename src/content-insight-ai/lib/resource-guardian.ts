// ============================================================
// RESOURCE GUARDIAN — qurilma resurslarini himoya qiladi
//
// Maqsad: telefon qizib ketmasin, batareya tez tugamasin.
// Model SIFATIGA TEGMAYDI — faqat tezlikni vaqtincha sozlaydi.
//
// Brauzer haroratni o'qiy olmaydi, lekin BILVOSITA aniqlaydi:
//   - Inference vaqti oshishi = thermal throttle (qizish) belgisi
//   - Batareya darajasi (navigator.getBattery)
//   - Qurilma quvvati (hardwareConcurrency, deviceMemory)
//
// Mexanizmlar:
//   1. Adaptiv throttling (qizganda pauza)
//   2. Rate limiting (daqiqada max N)
//   3. Batareya-aware (past batareyada tejash)
//   4. Cooldown rejimi (ko'p ishlatilsa dam)
//   5. Zaif qurilma aniqlash
// ============================================================

export type DeviceTier = 'low' | 'mid' | 'high';

export interface GuardianStatus {
  device_tier: DeviceTier;
  cores: number;
  memory_gb: number;
  battery_level: number | null;      // 0..1, null = noma'lum
  battery_charging: boolean | null;
  in_cooldown: boolean;
  cooldown_remaining_ms: number;
  recent_inferences: number;
  avg_inference_ms: number;
  throttle_delay_ms: number;
  thermal_pressure: 'normal' | 'elevated' | 'high';
}

interface GuardianConfig {
  max_per_minute: number;            // rate limit
  cooldown_after: number;            // shuncha og'ir operatsiyadan keyin cooldown
  cooldown_duration_ms: number;
  baseline_window: number;           // baseline hisoblash uchun namuna
}

const DEFAULT_CONFIG: GuardianConfig = {
  max_per_minute: 40,
  cooldown_after: 25,                // 25 ta og'ir operatsiyadan keyin
  cooldown_duration_ms: 20_000,      // 20s dam
  baseline_window: 5,
};

export class ResourceGuardian {
  private config: GuardianConfig;
  private inferenceTimes: number[] = [];        // oxirgi inference vaqtlari
  private inferenceTimestamps: number[] = [];   // rate limit uchun
  private baselineMs = 0;                        // sog'lom holatdagi o'rtacha
  private cooldownUntil = 0;
  private heavyOpCount = 0;
  private batteryLevel: number | null = null;
  private batteryCharging: boolean | null = null;
  private onCooldownCallbacks: Array<(remaining: number) => void> = [];

  constructor(config: Partial<GuardianConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initBattery();
  }

  // ---- Batareya monitoringini boshlash ----
  private async initBattery(): Promise<void> {
    try {
      const nav = navigator as unknown as { getBattery?: () => Promise<{ level: number; charging: boolean; addEventListener: (e: string, cb: () => void) => void }> };
      if (nav.getBattery) {
        const bat = await nav.getBattery();
        const update = () => { this.batteryLevel = bat.level; this.batteryCharging = bat.charging; };
        update();
        bat.addEventListener('levelchange', update);
        bat.addEventListener('chargingchange', update);
      }
    } catch { /* Battery API yo'q — OK */ }
  }

  // ---- Qurilma darajasi ----
  getDeviceTier(): DeviceTier {
    const cores = navigator.hardwareConcurrency || 2;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    if (cores <= 2 || mem <= 2) return 'low';
    if (cores <= 4 || mem <= 4) return 'mid';
    return 'high';
  }

  // ---- Og'ir operatsiyadan OLDIN chaqiriladi: qancha kutish kerak? ----
  async beforeHeavyTask(): Promise<{ allowed: boolean; delayMs: number; reason: string }> {
    const now = Date.now();

    // 1. Cooldown rejimida?
    if (now < this.cooldownUntil) {
      const remaining = this.cooldownUntil - now;
      return { allowed: false, delayMs: remaining, reason: `🌡️ Sovutish rejimi (${Math.ceil(remaining / 1000)}s)` };
    }

    // 2. Past batareya + zaryadlanmayotgan → og'ir tahlilни cheklash
    if (this.batteryLevel !== null && this.batteryLevel < 0.15 && this.batteryCharging === false) {
      return { allowed: false, delayMs: 0, reason: '🔋 Batareya juda past (<15%) — og\'ir tahlil o\'chirilgan' };
    }

    // 3. Rate limit (daqiqada max N)
    this.inferenceTimestamps = this.inferenceTimestamps.filter((t) => now - t < 60_000);
    if (this.inferenceTimestamps.length >= this.config.max_per_minute) {
      const oldest = this.inferenceTimestamps[0];
      const wait = 60_000 - (now - oldest);
      return { allowed: true, delayMs: Math.max(wait, 500), reason: '⏱ Rate limit — biroz kutish' };
    }

    // 4. Adaptiv throttling — qizish (inference sekinlashishi) bo'lsa pauza
    const delay = this.computeThrottleDelay();
    return { allowed: true, delayMs: delay, reason: delay > 0 ? '🌡️ Qizish aniqlandi — sekinlashtirildi' : '' };
  }

  // ---- Og'ir operatsiyadan KEYIN chaqiriladi: vaqtni qayd qilish ----
  afterHeavyTask(durationMs: number): void {
    const now = Date.now();
    this.inferenceTimestamps.push(now);
    this.inferenceTimes.push(durationMs);
    if (this.inferenceTimes.length > 20) this.inferenceTimes.shift();

    // Baseline o'rnatish (ilk sog'lom namunalar)
    if (this.baselineMs === 0 && this.inferenceTimes.length >= this.config.baseline_window) {
      const sorted = [...this.inferenceTimes].sort((a, b) => a - b);
      this.baselineMs = sorted[Math.floor(sorted.length / 2)]; // median
    }

    // Cooldown hisoblagichi
    this.heavyOpCount++;
    if (this.heavyOpCount >= this.config.cooldown_after) {
      this.heavyOpCount = 0;
      this.cooldownUntil = now + this.config.cooldown_duration_ms;
      for (const cb of this.onCooldownCallbacks) cb(this.config.cooldown_duration_ms);
    }
  }

  // ---- Adaptiv throttle kechikishini hisoblash ----
  private computeThrottleDelay(): number {
    if (this.baselineMs === 0 || this.inferenceTimes.length < 3) return 0;
    const recent = this.inferenceTimes.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const ratio = avgRecent / this.baselineMs;

    // Inference 2x sekinlashsa → qizish → pauza qo'shamiz
    if (ratio > 2.5) return 1500;   // jiddiy qizish
    if (ratio > 1.8) return 700;    // o'rtacha
    if (ratio > 1.4) return 300;    // yengil

    // Zaif qurilmada doimiy kichik pauza
    if (this.getDeviceTier() === 'low') return 200;
    return 0;
  }

  private thermalPressure(): 'normal' | 'elevated' | 'high' {
    if (this.baselineMs === 0 || this.inferenceTimes.length < 3) return 'normal';
    const recent = this.inferenceTimes.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const ratio = avgRecent / this.baselineMs;
    if (ratio > 2.5) return 'high';
    if (ratio > 1.6) return 'elevated';
    return 'normal';
  }

  // ---- UI uchun cooldown hodisasi ----
  onCooldown(cb: (remainingMs: number) => void): void {
    this.onCooldownCallbacks.push(cb);
  }

  // ---- To'liq holat (UI uchun) ----
  getStatus(): GuardianStatus {
    const now = Date.now();
    const avg = this.inferenceTimes.length > 0
      ? this.inferenceTimes.reduce((a, b) => a + b, 0) / this.inferenceTimes.length
      : 0;
    return {
      device_tier: this.getDeviceTier(),
      cores: navigator.hardwareConcurrency || 2,
      memory_gb: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4,
      battery_level: this.batteryLevel,
      battery_charging: this.batteryCharging,
      in_cooldown: now < this.cooldownUntil,
      cooldown_remaining_ms: Math.max(0, this.cooldownUntil - now),
      recent_inferences: this.inferenceTimestamps.filter((t) => now - t < 60_000).length,
      avg_inference_ms: Math.round(avg),
      throttle_delay_ms: this.computeThrottleDelay(),
      thermal_pressure: this.thermalPressure(),
    };
  }

  // ---- Helper: kutish ----
  static delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}

// ============================================================
// SINGLETON
// ============================================================

let _guardian: ResourceGuardian | null = null;

export function getResourceGuardian(): ResourceGuardian {
  if (!_guardian) _guardian = new ResourceGuardian();
  return _guardian;
}
