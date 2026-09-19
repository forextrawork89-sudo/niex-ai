import { describe, it, expect } from 'vitest';
import { TrustLadderService } from '../trust-ladder-service';

describe('TrustLadderService (FR-42)', () => {
  it('initializes default structured ladder without gamified points or trust scores', () => {
    const service = new TrustLadderService();
    const ladder = service.getOrCreateLadder('child-1');

    expect(ladder.childId).toBe('child-1');
    expect(ladder.currentLevel).toBe('structured');
    expect(ladder.agreements.length).toBeGreaterThanOrEqual(2);
    // Ensure no score property exists
    expect((ladder as unknown as Record<string, unknown>).score).toBeUndefined();
    expect((ladder as unknown as Record<string, unknown>).trustPercentage).toBeUndefined();
  });

  it('allows parent to advance trust level with notes', () => {
    const service = new TrustLadderService();
    const updated = service.advanceLevel({
      childId: 'child-1',
      newLevel: 'guided',
      guardianNotes: 'Vaqt me’yorlariga mas’uliyat bilan amal qilgani uchun.',
    });

    expect(updated.currentLevel).toBe('guided');
    expect(updated.guardianNotes).toContain('mas’uliyat bilan');
  });

  it('allows adding and mutual signing of trust agreements', () => {
    const service = new TrustLadderService();
    const item = service.addAgreement('child-1', 'O‘quv kunlarida telefon 21:00 da o‘chiriladi');
    expect(item.agreedByParent).toBe(true);
    expect(item.agreedByChild).toBe(false);

    const signed = service.childSignAgreement('child-1', item.id);
    expect(signed).toBe(true);

    const ladder = service.getOrCreateLadder('child-1');
    const updatedItem = ladder.agreements.find((a) => a.id === item.id);
    expect(updatedItem?.agreedByChild).toBe(true);
  });
});
