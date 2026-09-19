import { describe, it, expect } from 'vitest';
import { AgeTransitionService } from '../age-transition-service';

describe('AgeTransitionService (FR-41)', () => {
  it('generates non-automatic Group C transition proposal for teens 15+', () => {
    const service = new AgeTransitionService();

    expect(() =>
      service.generateGroupCTransitionProposal({
        childId: 'child-12',
        guardianId: 'guard-1',
        childAge: 12,
      })
    ).toThrow('faqat 15 yoshdan');

    const proposal = service.generateGroupCTransitionProposal({
      childId: 'child-15',
      guardianId: 'guard-1',
      childAge: 15,
    });

    expect(proposal.proposalId).toMatch(/^prop-/);
    expect(proposal.targetAgeGroup).toBe('Group_C');
    expect(proposal.isAutomaticallyApplied).toBe(false); // Invariant: Not automatic
    expect(proposal.status).toBe('pending_review');
    expect(proposal.suggestedChanges.locationMonitoring).toContain('7 kunlik');
  });

  it('updates proposal status upon explicit guardian decision', () => {
    const service = new AgeTransitionService();
    const proposal = service.generateGroupCTransitionProposal({
      childId: 'child-16',
      guardianId: 'guard-1',
      childAge: 16,
    });

    const accepted = service.decideProposal(proposal.proposalId, 'accepted');
    expect(accepted.status).toBe('accepted');
    expect(accepted.decidedAt).toBeDefined();

    const list = service.getProposalsForChild('child-16');
    expect(list.length).toBe(1);
    expect(list[0].status).toBe('accepted');
  });
});
