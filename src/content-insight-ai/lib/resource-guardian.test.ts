// ============================================================
// RESOURCE GUARDIAN TESTLARI
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { ResourceGuardian } from './resource-guardian';

describe('ResourceGuardian — qurilma darajasi', () => {
  it('to\'g\'ri tier hisoblanadi', () => {
    const g = new ResourceGuardian();
    const tier = g.getDeviceTier();
    expect(['low', 'mid', 'high']).toContain(tier);
  });
});

describe('ResourceGuardian — rate limit', () => {
  it('limit oshganda kutish so\'raydi', async () => {
    const g = new ResourceGuardian({ max_per_minute: 3, cooldown_after: 100, cooldown_duration_ms: 1000, baseline_window: 5 });
    // 3 ta tezkor inference
    for (let i = 0; i < 3; i++) {
      const gate = await g.beforeHeavyTask();
      expect(gate.allowed).toBe(true);
      g.afterHeavyTask(10);
    }
    // 4-chi — rate limit
    const gate4 = await g.beforeHeavyTask();
    expect(gate4.allowed).toBe(true);
    expect(gate4.delayMs).toBeGreaterThan(0);
  });
});

describe('ResourceGuardian — cooldown', () => {
  it('cooldown_after dan keyin dam beriladi', async () => {
    const g = new ResourceGuardian({ max_per_minute: 100, cooldown_after: 3, cooldown_duration_ms: 500, baseline_window: 5 });

    let cooldownFired = false;
    let remainingMs = 0;
    g.onCooldown((r) => { cooldownFired = true; remainingMs = r; });

    // 3 ta og'ir operatsiya
    for (let i = 0; i < 3; i++) {
      await g.beforeHeavyTask();
      g.afterHeavyTask(50);
    }

    expect(cooldownFired).toBe(true);
    expect(remainingMs).toBeGreaterThan(0);

    // Endi cooldown'da → ruxsat berilmaydi
    const gate = await g.beforeHeavyTask();
    expect(gate.allowed).toBe(false);
    expect(gate.reason).toContain('Sovutish');
  });
});

describe('ResourceGuardian — adaptiv throttle', () => {
  it('inference sekinlashsa pauza qo\'shiladi', async () => {
    const g = new ResourceGuardian({ max_per_minute: 100, cooldown_after: 100, cooldown_duration_ms: 1000, baseline_window: 5 });

    // Baseline: 5 ta tez (10ms)
    for (let i = 0; i < 5; i++) {
      await g.beforeHeavyTask();
      g.afterHeavyTask(10);
    }

    // Endi sekinlashish (30ms = 3x baseline → throttle qo'shilishi kerak)
    for (let i = 0; i < 3; i++) {
      g.afterHeavyTask(30);
    }
    const gate = await g.beforeHeavyTask();
    expect(gate.delayMs).toBeGreaterThan(0); // pauza kutiladi
  });
});

describe('ResourceGuardian — status', () => {
  it('barcha kerakli maydonlar mavjud', () => {
    const g = new ResourceGuardian();
    const s = g.getStatus();
    expect(s).toHaveProperty('device_tier');
    expect(s).toHaveProperty('cores');
    expect(s).toHaveProperty('memory_gb');
    expect(s).toHaveProperty('in_cooldown');
    expect(s).toHaveProperty('avg_inference_ms');
    expect(s).toHaveProperty('thermal_pressure');
    expect(['normal', 'elevated', 'high']).toContain(s.thermal_pressure);
  });
});

describe('ResourceGuardian — delay helper', () => {
  it('static delay ishlaydi', async () => {
    const start = Date.now();
    await ResourceGuardian.delay(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45);
  });
});
