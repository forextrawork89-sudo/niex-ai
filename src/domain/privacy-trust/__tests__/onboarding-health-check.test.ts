import { describe, it, expect } from 'vitest';
import { OnboardingHealthCheckService } from '../onboarding-health-check';

describe('OnboardingHealthCheckService (FR-39)', () => {
  it('reports 100% health score and passed status when all 4 steps succeed', () => {
    const service = new OnboardingHealthCheckService();
    const report = service.run5StepHealthCheck({
      childId: 'child-1',
      deviceId: 'dev-1',
      permissions: {
        accessibility: true,
        usageStats: true,
        location: true,
        notifications: true,
      },
      testBlockExecuted: true,
      testLocationAccuracyMeters: 25,
      testNotificationAcknowledged: true,
    });

    expect(report.isAllPassed).toBe(true);
    expect(report.healthScorePercent).toBe(100);
    expect(report.steps.length).toBe(5);
    expect(report.steps[4].status).toBe('passed');
  });

  it('provides actionable guidance on failure without accusatory blame', () => {
    const service = new OnboardingHealthCheckService();
    const report = service.run5StepHealthCheck({
      childId: 'child-1',
      deviceId: 'dev-1',
      permissions: {
        accessibility: false,
        usageStats: true,
        location: true,
        notifications: true,
      },
      testBlockExecuted: false,
      testLocationAccuracyMeters: 150, // > 100m
      testNotificationAcknowledged: false,
    });

    expect(report.isAllPassed).toBe(false);
    expect(report.healthScorePercent).toBe(0);

    const step1 = report.steps.find((s) => s.stepId === 'step_1_permissions');
    expect(step1?.status).toBe('failed');
    expect(step1?.actionableGuidance).toContain('Sozlamalar');

    const step3 = report.steps.find((s) => s.stepId === 'step_3_test_location');
    expect(step3?.status).toBe('failed');
    expect(step3?.actionableGuidance).toContain('Yuqori aniqlikdagi geolokatsiya');
  });
});
