// FR-26: Daily AI Summary, Weekly Family Conversation Card & Strictly Non-Diagnostic Safety Guard

export interface SummaryFact {
  factText: string;
  sourceEventId: string; // Every summary fact MUST link directly to a source event (FR-26)
  eventType: string;
}

export interface DailyAiSummary {
  date: string;
  childId: string;
  summaryText: string;
  facts: SummaryFact[];
  isDataInsufficient: boolean;
  neutralityNotice: string;
}

export interface FamilyConversationCard {
  weekStarting: string;
  childId: string;
  title: string;
  threeQuestions: [string, string, string]; // Exactly 3 conversation starter questions
  purpose: string;
  isDiagnosticFree: boolean;
}

export class AiSummaryService {
  // Generate daily AI factual summary
  public generateDailySummary(params: {
    date: string;
    childId: string;
    events: Array<{ id: string; type: string; description: string; timestamp: string }>;
  }): DailyAiSummary {
    const neutralityNotice =
      'Muhim: Ushbu xulosa faqat qayd etilgan faktik hodisalarga asoslangan. Tizim bolaning ruhiy salomatligi, shaxsiyati yoki niyati haqida xulosa chiqarmaydi (FR-26).';

    if (!params.events || params.events.length === 0) {
      return {
        date: params.date,
        childId: params.childId,
        summaryText: 'Ushbu kun uchun ma’lumotlar yetarli emas.',
        facts: [],
        isDataInsufficient: true,
        neutralityNotice,
      };
    }

    const facts: SummaryFact[] = params.events.slice(0, 5).map((e) => ({
      factText: e.description,
      sourceEventId: e.id,
      eventType: e.type,
    }));

    const summaryText = `Kunda ${params.events.length} ta faollik hodisasi qayd etildi. Asosiy hodisalar o‘quv faoliyati va me’yoriy foydalanish doirasida bo‘ldi.`;

    return {
      date: params.date,
      childId: params.childId,
      summaryText,
      facts,
      isDataInsufficient: false,
      neutralityNotice,
    };
  }

  // Generate weekly 3-topic family conversation card
  public generateWeeklyConversationCard(childId: string, weekStarting: string): FamilyConversationCard {
    return {
      weekStarting,
      childId,
      title: 'Haftalik Oila Suhbat Kartochkasi',
      purpose: 'Oila davrasida bolaga bosim o‘tkazmasdan, erkin va do‘stona mavzularni muhokama qilish uchun.',
      isDiagnosticFree: true,
      threeQuestions: [
        '1. Bu hafta internetda yoki maktabda o‘zing uchun qiziqarli qaysi yangilikni o‘rganding?',
        '2. Sevimli o‘yining yoki darsingda qanday yangi yutuqqa erishding va bu senga qanday hissiyot berdi?',
        '3. Keyingi hafta qaysi qiziqarli loyiha yoki mashg‘ulot bilan birga shug‘ullanishimizni xohlaysan?',
      ],
    };
  }
}
