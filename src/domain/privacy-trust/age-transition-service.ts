// FR-41: Age Group C (15-17 yosh) Transition Suggestion, Mutual Agreement & Audit

export interface AgeTransitionProposal {
  proposalId: string;
  childId: string;
  guardianId: string;
  currentAgeGroup: 'Group_A' | 'Group_B' | 'Group_C';
  targetAgeGroup: 'Group_C' | 'Adult_18';
  suggestedChanges: {
    locationMonitoring: string; // e.g. "Tarixni saqlash o'chiriladi, faqat oxirgi nuqta va xavfsiz zona xabarlari qoladi"
    webFiltering: string; // e.g. "Faqat fishing va xavfli zararli manbalar bloklanadi, umumiy kontent ochiq bo'ladi"
    appSupervision: string; // e.g. "Ilovalar ro'yxatini nazorat qilish o'rniga faqat umumiy vaqt ko'rsatiladi"
  };
  isAutomaticallyApplied: boolean; // MUST be false (FR-41 invariant)
  status: 'pending_review' | 'accepted' | 'rejected';
  createdAt: string;
  decidedAt?: string;
}

export class AgeTransitionService {
  private proposals: Map<string, AgeTransitionProposal> = new Map();

  public generateGroupCTransitionProposal(params: {
    childId: string;
    guardianId: string;
    childAge: number;
  }): AgeTransitionProposal {
    if (params.childAge < 15) {
      throw new Error('Yosh toifasi C (15-17 yosh) uchun taklif faqat 15 yoshdan boshlab beriladi.');
    }

    const proposal: AgeTransitionProposal = {
      proposalId: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      childId: params.childId,
      guardianId: params.guardianId,
      currentAgeGroup: 'Group_B',
      targetAgeGroup: 'Group_C',
      suggestedChanges: {
        locationMonitoring:
          '7 kunlik marshrut tarixini saqlash to‘xtatiladi. Faqat oxirgi nuqta va xavfsiz zonadan chiqish xabarlari qoldiriladi.',
        webFiltering:
          'Kategoriya bo‘yicha umumiy cheklovlar yumshatiladi. Faqat fishing, firibgarlik va zararli dasturlar bloklanadi.',
        appSupervision:
          'Har bir ilovaning ishga tushirilishini tekshirish to‘xtatiladi, faqat umumiy ekran vaqti hisoboti qoladi.',
      },
      isAutomaticallyApplied: false, // FR-41: Non-automatic suggestion
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    this.proposals.set(proposal.proposalId, proposal);
    return proposal;
  }

  public decideProposal(proposalId: string, decision: 'accepted' | 'rejected'): AgeTransitionProposal {
    const prop = this.proposals.get(proposalId);
    if (!prop) {
      throw new Error(`Taklif topilmadi: ${proposalId}`);
    }

    prop.status = decision;
    prop.decidedAt = new Date().toISOString();
    return prop;
  }

  public getProposalsForChild(childId: string): AgeTransitionProposal[] {
    return Array.from(this.proposals.values()).filter((p) => p.childId === childId);
  }
}
