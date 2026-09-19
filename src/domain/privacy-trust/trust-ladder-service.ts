// FR-42: Trust Ladder (Mutual Agreements, Non-Gamified, No Arbitrary Trust Scores, Guardian-Decided)

export type TrustLadderLevel = 'structured' | 'guided' | 'independent';

export interface TrustAgreementItem {
  id: string;
  description: string;
  agreedByParent: boolean;
  agreedByChild: boolean;
}

export interface TrustLadderState {
  childId: string;
  currentLevel: TrustLadderLevel;
  agreements: TrustAgreementItem[];
  lastUpdated: string;
  guardianNotes?: string;
  // Strictly NO trust scores or gamification points (FR-42 invariant)
}

export class TrustLadderService {
  private ladders: Map<string, TrustLadderState> = new Map();

  public getOrCreateLadder(childId: string): TrustLadderState {
    let ladder = this.ladders.get(childId);
    if (!ladder) {
      ladder = {
        childId,
        currentLevel: 'structured',
        agreements: [
          {
            id: 'agr-1',
            description: 'Kechki soat 22:00 dan keyin telefon quvvatlagichda qoladi va dam olinadi.',
            agreedByParent: true,
            agreedByChild: true,
          },
          {
            id: 'agr-2',
            description: 'Yangi yoki notanish sayt/havola shubhali tuyulsa, havolalar tekshiruvchisi orqali tekshiriladi.',
            agreedByParent: true,
            agreedByChild: true,
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
      this.ladders.set(childId, ladder);
    }
    return ladder;
  }

  // FR-42 Invariant: Parent decides level advancement, no automatic algorithm
  public advanceLevel(params: {
    childId: string;
    newLevel: TrustLadderLevel;
    guardianNotes?: string;
  }): TrustLadderState {
    const ladder = this.getOrCreateLadder(params.childId);
    ladder.currentLevel = params.newLevel;
    ladder.guardianNotes = params.guardianNotes;
    ladder.lastUpdated = new Date().toISOString();
    return ladder;
  }

  public addAgreement(childId: string, description: string): TrustAgreementItem {
    const ladder = this.getOrCreateLadder(childId);
    const item: TrustAgreementItem = {
      id: `agr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      description,
      agreedByParent: true,
      agreedByChild: false,
    };
    ladder.agreements.push(item);
    ladder.lastUpdated = new Date().toISOString();
    return item;
  }

  public childSignAgreement(childId: string, agreementId: string): boolean {
    const ladder = this.getOrCreateLadder(childId);
    const item = ladder.agreements.find((a) => a.id === agreementId);
    if (!item) return false;
    item.agreedByChild = true;
    ladder.lastUpdated = new Date().toISOString();
    return true;
  }
}
