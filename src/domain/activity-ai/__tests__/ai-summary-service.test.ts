import { describe, it, expect } from 'vitest';
import { AiSummaryService } from '../ai-summary-service';

describe('AiSummaryService (FR-26)', () => {
  it('handles empty events by reporting data insufficient and neutrality notice', () => {
    const service = new AiSummaryService();
    const summary = service.generateDailySummary({
      date: '2026-09-18',
      childId: 'child-1',
      events: [],
    });

    expect(summary.isDataInsufficient).toBe(true);
    expect(summary.facts.length).toBe(0);
    expect(summary.neutralityNotice).toContain('FR-26');
    expect(summary.summaryText).toContain('ma’lumotlar yetarli emas');
  });

  it('generates summary with facts strictly linked to source event IDs', () => {
    const service = new AiSummaryService();
    const events = [
      { id: 'ev-1', type: 'web_visit', description: 'Visited wikipedia.org', timestamp: '2026-09-18T10:00:00Z' },
      { id: 'ev-2', type: 'app_usage', description: 'Used Duolingo for 30m', timestamp: '2026-09-18T11:00:00Z' },
    ];

    const summary = service.generateDailySummary({
      date: '2026-09-18',
      childId: 'child-1',
      events,
    });

    expect(summary.isDataInsufficient).toBe(false);
    expect(summary.facts.length).toBe(2);
    expect(summary.facts[0].sourceEventId).toBe('ev-1');
    expect(summary.facts[0].factText).toBe('Visited wikipedia.org');
    expect(summary.facts[1].sourceEventId).toBe('ev-2');
  });

  it('generates non-diagnostic weekly conversation card with exactly 3 questions', () => {
    const service = new AiSummaryService();
    const card = service.generateWeeklyConversationCard('child-1', '2026-09-15');

    expect(card.isDiagnosticFree).toBe(true);
    expect(card.threeQuestions.length).toBe(3);
    card.threeQuestions.forEach((q) => {
      expect(typeof q).toBe('string');
      expect(q.length).toBeGreaterThan(10);
    });
  });
});
