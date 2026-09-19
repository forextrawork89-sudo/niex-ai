// ============================================================
// Semantic Analyzer — Deep text understanding engine
// Kontekstni tushunish: so'z ma'nosi, gap tuzilishi, niyat aniqlash
// ============================================================

export interface SemanticResult {
  tokens: string[];
  stems: string[];
  bigrams: string[];
  trigrams: string[];
  sentiment: number;         // -1 (negative) to +1 (positive)
  toxicity: number;          // 0 to 1
  intent: Intent;
  topics: string[];
  entities: Entity[];
  context_signals: ContextSignal[];
  language: 'uz' | 'en' | 'mixed';
  content_class: ContentClass;
  complexity: number;        // 0 to 1
  fingerprint: string;       // content hash for dedup
}

export interface Entity {
  text: string;
  type: 'person' | 'place' | 'url' | 'number' | 'hashtag' | 'mention' | 'email' | 'phone';
  start: number;
  end: number;
}

export interface ContextSignal {
  signal: string;
  weight: number;
  category: 'harmful_indicator' | 'safe_indicator' | 'ambiguous' | 'context_modifier';
}

export type Intent =
  | 'informational'
  | 'educational'
  | 'entertainment'
  | 'commercial'
  | 'social'
  | 'harmful_explicit'
  | 'harmful_subtle'
  | 'unknown';

export type ContentClass =
  | 'safe'
  | 'educational'
  | 'medical'
  | 'sports'
  | 'fashion'
  | 'cultural'
  | 'art'
  | 'ambiguous'
  | 'suggestive'
  | 'sexualized'
  | 'harmful_explicit'
  | 'harmful_subtle'
  | 'social'
  | 'commercial'
  | 'unknown';

// ---- Harmful / Safe lexicons ----

const HARMFUL_PATTERNS: { pattern: RegExp; weight: number; category: string }[] = [
  { pattern: /\b(pornographic|pornography|porn|xxx|nsfw|nude|naked|sex\s?video|erotic|sexy|sexual|hentai|onlyfans|camgirl|escort|hookup|fetish|hot\s+girl|hot\s+boy)\b/i, weight: 0.95, category: 'sexual_explicit' },
  { pattern: /\b(fuck|fucking|shit|bitch|bastard|asshole|dick|pussy|cunt|whore|slut|motherfucker|jerk\s?off|wank)\b/i, weight: 0.85, category: 'profanity' },
  // Vulgar/sexual slang — Wiktionary tarjimalari shularni qaytaradi
  { pattern: /\b(boob|boobs|tit|tits|titty|titties|cock|prick|dildo|horny|slutty|cum|jizz|blowjob|handjob|hooker|milf|gangbang|boner|wanker|twat)\b/i, weight: 0.8, category: 'vulgar_slang' },
  // Jinsiy anatomiya/terminlar — o'rtacha weight (tibbiy yoki ta'limiy bo'lishi mumkin → chegaraviy)
  { pattern: /\b(vagina|penis|genital|condom|masturbat|ejaculat|erection|orgasm|intercourse|fornicat|copulat|anus|scrotum|testicle)\b/i, weight: 0.55, category: 'sexual_anatomy' },
  { pattern: /\b(jalab|qanjiq|kotak|am|sikish|sikaman|skay|skv|skvm|chust|otingni|seningmoching|onangni)\b/i, weight: 0.9, category: 'profanity_uz' },
  // Borderline sexual terms — chegaraviy (medium weight, contextga qarab)
  { pattern: /\b(bikini|swimsuit|lingerie|underwear|thong|bra|panties|see.?through|wet.?shirt|cleavage|cameltoe|braless|topless|nipple)\b/i, weight: 0.65, category: 'sexual_borderline' },
  { pattern: /\b(twerk|grinding|seductive|tease|striptease|burlesque)\b/i, weight: 0.7, category: 'sexual_suggestive' },
  { pattern: /\b(erotik|erotik\s*video|erotika|sexi|sexy|shahvoniy|jalb\s+qiluvchi|qizg'in\s*content|maxsus\s*(taklif|video|content)|faqat\s*a'zo\s*bo'lsangiz|yashirin\s*video|sirli\s*video)\b/i, weight: 0.82, category: 'sexual_suggestive_uz' },
  { pattern: /\b(kill|murder|torture|gore|beheading|execution)\b/i, weight: 0.9, category: 'violence_extreme' },
  { pattern: /\b(drug|cocaine|heroin|meth|weed|marijuana|narcotic)\b/i, weight: 0.7, category: 'drugs' },
  { pattern: /\b(gambling|casino|bet|slot|poker)\b/i, weight: 0.65, category: 'gambling' },
  { pattern: /\b(suicide|self.?harm|cut\s?myself)\b/i, weight: 0.85, category: 'self_harm' },
  { pattern: /\b(hack|phishing|malware|exploit|crack)\b/i, weight: 0.6, category: 'cyber_threat' },
  { pattern: /\b(scam|fraud|fake|ponzi|pyramid)\b/i, weight: 0.7, category: 'fraud' },
  { pattern: /\b(phish|phishing|social engineering|social-engineering|credential theft|password theft|account verification|urgent verification|verify your account|click here now|reset your password|claim your prize|limited time offer)\b/i, weight: 0.8, category: 'phishing' },
  { pattern: /\b(akount|akkount|accaunt|accunt|pasword|parolni|parol|paspord|loginn|loging|verify|verifikatsiya|tezda|hozir|bosing|boshing|press|klik|klikk|bonusni|yutuqni|prizni|claim)\b/i, weight: 0.72, category: 'phishing_variant' },
  { pattern: /\b(maxsus|taklif|faqat|a'zo|ochiladi|qizg'in|jalb|qiziqarli|ko'rish|ko'rsatiladi|yutuq|kafolat|tez pul|ro'yxatdan)\b/i, weight: 0.6, category: 'suggestive_bait' },
  { pattern: /\b(free|download|click|bosing|boshing|claim|yutuq|bonus|grant|aktivatsiya|aktivat|parol|login|akkount)\b/i, weight: 0.55, category: 'suggestive_bait_uz' },
  { pattern: /\b(weapon|gun|bomb|explosive|ammo)\b/i, weight: 0.6, category: 'weapons' },
  // Uzbek harmful patterns
  { pattern: /\b(behayo|uyatsiz|yalang'och|pornografiya|zo'rlash)\b/i, weight: 0.95, category: 'sexual_uz' },
  { pattern: /\b(o'ldirish|qotillik|qiynoq|xunrezlik)\b/i, weight: 0.9, category: 'violence_uz' },
  { pattern: /\b(akkount|parol|login|tekshiring|bosing|hozir|tezda|tez|bonus|pul|yutuq|grant|prize|claim|aktivat|aktivatsiya)\b/i, weight: 0.78, category: 'uz_scam_persuasion' },
  { pattern: /\b(akkauntingiz|parolingiz|paroling|parolni|kiriting|tekshiring|bosing|hozir|tezda|bonus|yutuq|pul)\b/i, weight: 0.82, category: 'uz_scam_persuasion' },
  { pattern: /\b(giyohvand|nasha|geroin|kokain)\b/i, weight: 0.8, category: 'drugs_uz' },
  { pattern: /\b(qimor|kazino|tikish|lotto)\b/i, weight: 0.65, category: 'gambling_uz' },
  { pattern: /\b(o'z.?joniga\s?qasd|xudkushi)\b/i, weight: 0.85, category: 'self_harm_uz' },

  // ============================================================
  // KENGAYTIRILGAN QIMOR (gambling) — saytlar, brendlar, ko'p til
  // ============================================================
  { pattern: /\b(1xbet|melbet|betway|parimatch|mostbet|1win|linebet|22bet|betwinner|pinup|pin-up|olimp|fonbet|bet365|pokerstars|bovada|888casino|888poker|ggbet|leon|leonbets|winline|marathonbet|betcity|liga\s?stavok|vulkan|vulcan|joycasino|azino|riobet|playfortuna|champion\s?casino|pari\s?match)\b/i, weight: 0.85, category: 'gambling_brands' },
  { pattern: /\b(bookmaker|wager|jackpot|roulette|blackjack|baccarat|sportsbook|betting\s?odds|parlay|accumulator|tikish\s?saytlari|slot\s?machine|spin\s?to\s?win|free\s?spins|deposit\s?bonus|cashout|aviator\s?game|crash\s?game|live\s?bet|live\s?casino|online\s?casino|sports\s?betting|esports\s?betting)\b/i, weight: 0.75, category: 'gambling_terms' },
  // Qimor — qo'shimcha ko'p til (UZ/RU/TR slang)
  { pattern: /\b(tikish\s?qil|pul\s?tik|stavka\s?qil|yutuq\s?kafolat|bonus\s?ol|aylanma\s?bonus|bukmeker|totalizator|stavka|ставк|букмекер|казик|казино|рулетка|игровой\s?автомат|джекпот|kumar\s?oyna|bahis\s?oyna|iddaa)\b/i, weight: 0.75, category: 'gambling_multilang' },

  // ============================================================
  // KENGAYTIRILGAN NARKOTIK (drugs) — ko'p til + slang
  // ============================================================
  { pattern: /\b(lsd|ecstasy|mdma|molly|fentanyl|opioid|ketamine|amphetamine|crystal\s?meth|crack|spice|hashish|opium|psilocybin|shrooms|dmt|pcp|ghb|mephedrone|methadone|oxycodone|adderall|xanax\s?high|codeine\s?syrup|lean\s?drink)\b/i, weight: 0.8, category: 'drugs_extended' },
  // Narkotik slang/sotuv — ko'p til
  { pattern: /\b(weed|pot|ganja|dope|smack|blow|coke|snow|crank|tina|acid\s?tab|magic\s?mushroom|drug\s?dealer|buy\s?drugs|sell\s?drugs|narko|nasha\s?sotuv|giyohvand\s?modda|закладк|спайс|соль\s?наркотик|мефедрон|амфетамин|травка|план\s?наркотик|uyushtiruvchi\s?modda)\b/i, weight: 0.82, category: 'drugs_slang' },
  // Narkotik ko'p til (KO/ZH/AR)
  { pattern: /(마약\s?판매|마약\s?구매|대마초|필로폰|毒品|吸毒|贩毒|大麻|冰毒|海洛因|مخدرات|كوكايين|حشيش)/i, weight: 0.85, category: 'drugs_cjk_ar' },
  // Qimor/narkotik domenlari (URL'da)
  { pattern: /\b\w*(casino|bet|poker|slot|stavk|kazino|qimor|gambl)\w*\.(com|net|org|ru|uz|info|bet|win|club|vip|live|io|xyz)\b/i, weight: 0.8, category: 'gambling_domain' },

  // ============================================================
  // BOLA RIVOJIGA ZARARLI — xavfli viral challenge'lar
  // ============================================================
  { pattern: /\b(blue\s?whale|momo\s?challenge|choking\s?game|tide\s?pod|skull\s?breaker|blackout\s?challenge|fire\s?challenge|benadryl\s?challenge)\b/i, weight: 0.9, category: 'dangerous_challenge' },
  { pattern: /\b(ko'k\s?kit|kotak\s?oyini|xavfli\s?challenge)\b/i, weight: 0.85, category: 'dangerous_challenge_uz' },

  // ============================================================
  // RUS TILI (Russian) — Cyrillic, \b ishlatmaymiz
  // ============================================================
  { pattern: /(порно|порнуха|секс|голый|голая|голые|эротика|проститутк|шлюха|интим|сиськи|сиси|сися|титьки|жопа|попка|член|залупа|ебля|трах|минет|анал|оргазм|мастурбац)/i, weight: 0.9, category: 'sexual_ru' },
  { pattern: /(казино|ставки\s?на\s?спорт|букмекер|рулетка|тотализатор|игровые\s?автоматы|онлайн\s?казино)/i, weight: 0.75, category: 'gambling_ru' },
  { pattern: /(наркотик|кокаин|героин|марихуана|гашиш|амфетамин|закладк|спайс|мефедрон)/i, weight: 0.85, category: 'drugs_ru' },
  { pattern: /(убить|убийство|насилие|пытки|оружие|взрыв|теракт)/i, weight: 0.85, category: 'violence_ru' },
  { pattern: /(суицид|самоубийств|порезать\s?себя|селфхарм)/i, weight: 0.85, category: 'self_harm_ru' },
  { pattern: /(блять|сука|хуй|пизда|ебать|мудак|залупа)/i, weight: 0.8, category: 'profanity_ru' },

  // ============================================================
  // KOREYS TILI (Korean) — Hangul
  // ============================================================
  { pattern: /(포르노|섹스|야동|누드|성인\s?영상|음란)/i, weight: 0.9, category: 'sexual_ko' },
  { pattern: /(도박|카지노|베팅|토토|슬롯머신|온라인\s?도박)/i, weight: 0.75, category: 'gambling_ko' },
  { pattern: /(마약|대마|필로폰|코카인|헤로인|메스암페타민)/i, weight: 0.85, category: 'drugs_ko' },
  { pattern: /(살인|폭력|무기|폭탄|테러)/i, weight: 0.85, category: 'violence_ko' },
  { pattern: /(자살|자해|극단적\s?선택)/i, weight: 0.85, category: 'self_harm_ko' },

  // ============================================================
  // XITOY TILI (Chinese) — Han
  // ============================================================
  { pattern: /(色情|性爱|裸体|成人内容|情色|黄片)/i, weight: 0.9, category: 'sexual_zh' },
  { pattern: /(赌博|赌场|博彩|老虎机|网上赌博|投注)/i, weight: 0.75, category: 'gambling_zh' },
  { pattern: /(毒品|海洛因|可卡因|大麻|冰毒|摇头丸)/i, weight: 0.85, category: 'drugs_zh' },
  { pattern: /(杀人|暴力|武器|炸弹|恐怖袭击)/i, weight: 0.85, category: 'violence_zh' },
  { pattern: /(自杀|自残|轻生)/i, weight: 0.85, category: 'self_harm_zh' },

  // ============================================================
  // ARAB TILI (Arabic)
  // ============================================================
  { pattern: /(إباحية|جنس|عاري|محتوى\s?للبالغين|دعارة)/i, weight: 0.9, category: 'sexual_ar' },
  { pattern: /(قمار|كازينو|مراهنات|روليت)/i, weight: 0.75, category: 'gambling_ar' },
  { pattern: /(مخدرات|كوكايين|هيروين|حشيش)/i, weight: 0.85, category: 'drugs_ar' },
  { pattern: /(قتل|عنف|سلاح|قنبلة|إرهاب)/i, weight: 0.85, category: 'violence_ar' },
  { pattern: /(انتحار|إيذاء\s?النفس)/i, weight: 0.85, category: 'self_harm_ar' },

  // ============================================================
  // TURK TILI (Turkish) — qo'shni til
  // ============================================================
  { pattern: /\b(porno|seks|çıplak|fuhuş|müstehcen)\b/i, weight: 0.9, category: 'sexual_tr' },
  { pattern: /\b(kumar|bahis|casino|rulet|iddaa)\b/i, weight: 0.75, category: 'gambling_tr' },
  { pattern: /\b(uyuşturucu|kokain|eroin|esrar)\b/i, weight: 0.85, category: 'drugs_tr' },
  { pattern: /\b(öldürmek|cinayet|şiddet|silah|bomba)\b/i, weight: 0.85, category: 'violence_tr' },
  { pattern: /\b(intihar|kendine\s?zarar)\b/i, weight: 0.85, category: 'self_harm_tr' },

  // ============================================================
  // AFRIKA TILLARI — Swahili, Hausa, Yoruba
  // ============================================================
  { pattern: /\b(ngono|uchi|punyeto|ashiki|umalaya)\b/i, weight: 0.85, category: 'sexual_sw' },     // Swahili
  { pattern: /\b(kamari|betri|kasino)\b/i, weight: 0.7, category: 'gambling_sw' },
  { pattern: /\b(dawa\s?za\s?kulevya|bangi|unga|cocaine)\b/i, weight: 0.8, category: 'drugs_sw' },
  { pattern: /\b(kuua|mauaji|ukatili|silaha)\b/i, weight: 0.8, category: 'violence_sw' },
  { pattern: /\b(batsa|caca|karuwanci)\b/i, weight: 0.8, category: 'harmful_ha' },                  // Hausa
  { pattern: /\b(ìbálòpọ̀|aṣẹwó|tata)\b/i, weight: 0.8, category: 'harmful_yo' },                    // Yoruba

  // ============================================================
  // QO'SHIMCHA: gambling/drugs URL va promo patternlari (ko'p til)
  // ============================================================
  { pattern: /\b(bonus\s?puli|free\s?spins|deposit\s?bonus|welcome\s?bonus|promo\s?kod|bepul\s?aylanish)\b/i, weight: 0.6, category: 'gambling_promo' },
  { pattern: /\b(buy\s?weed|buy\s?cocaine|drug\s?dealer|narkotik\s?sotuvchi|закладка\s?купить)\b/i, weight: 0.85, category: 'drugs_sale' },
];

const SAFE_PATTERNS: { pattern: RegExp; weight: number; category: string }[] = [
  { pattern: /\b(education|learn|study|school|university|course|lesson|textbook|guide|workshop)\b/i, weight: 0.8, category: 'education' },
  { pattern: /\b(medical|doctor|health|treatment|diagnosis|clinical|hospital|therapy|vaccine)\b/i, weight: 0.8, category: 'medical' },
  { pattern: /\b(anti|prevent|awareness|warning|safety|report|educational|informational|documentary|research|study|guide)\b/i, weight: 0.75, category: 'prevention_context' },
  { pattern: /\b(prevent|protect|safety|awareness|warning|context|educational|instructive|guide|helpful|report|article|analysis|review|case study)\b/i, weight: 0.7, category: 'prevention_context' },
  { pattern: /\b(news|journal|report|article|research|science|documentary|study)\b/i, weight: 0.7, category: 'informational' },
  { pattern: /\b(family|child|kid|parent|baby|toddler|guardian)\b/i, weight: 0.65, category: 'family' },
  { pattern: /\b(art|museum|gallery|painting|sculpture|creative|poetry|theater|drama|cinema)\b/i, weight: 0.75, category: 'art' },
  { pattern: /\b(sport|sports|game|play|team|match|champion|athlete|training|fitness|yoga|workout)\b/i, weight: 0.75, category: 'sports' },
  { pattern: /\b(fashion|runway|model|lookbook|style|couture|editorial|garment|outfit|wardrobe)\b/i, weight: 0.7, category: 'fashion' },
  { pattern: /\b(cultural|tradition|festival|dance|folk|heritage|ceremony|ritual)\b/i, weight: 0.7, category: 'cultural' },
  { pattern: /\b(cook|recipe|food|kitchen|bake|ingredient)\b/i, weight: 0.7, category: 'cooking' },
  { pattern: /\b(viral|trend|challenge|duet|stitch|hashtag|follow|like|share|comment|reels|shorts|story|vlog|stream)\b/i, weight: 0.4, category: 'social_media' },
  // Uzbek safe patterns
  { pattern: /\b(ta'lim|o'qish|maktab|universitet|darslik|fan|qo'llanma|ma'lumotnoma|kurs)\b/i, weight: 0.8, category: 'education_uz' },
  { pattern: /\b(tibbiyot|shifokor|davolash|salomatlik|kasalxona|terapiya|dori|diagnostika)\b/i, weight: 0.8, category: 'medical_uz' },
  { pattern: /\b(ta'limiy|ma'lumot|oldini|himoya|xavfsizlik|xabardorlik|ogohlantirish|maqola|hisobot|maqsad|qo'llanma|o'quv)\b/i, weight: 0.75, category: 'prevention_context_uz' },
  { pattern: /\b(oila|bola|ota-ona|tarbiya|voyaga yetgan|bolalar)\b/i, weight: 0.65, category: 'family_uz' },
  { pattern: /\b(san'at|muzey|rasm|ijod|festival|balet|milliy|madaniyat)\b/i, weight: 0.75, category: 'art_uz' },
  { pattern: /\b(sport|o'yin|musobaqa|futbol|basketbol|fitnes|yoga|trenajyor|jismoniy)\b/i, weight: 0.75, category: 'sports_uz' },
];

const MULTIMODAL_CONTEXT_PATTERNS: { pattern: RegExp; category: string; weight: number }[] = [
  { pattern: /\b(close[- ]?up|zoom|cropped|tight\s*frame|tight\s*shot|headshot|body\s*shot|camera\s*focus|focus\s*on\s*body)\b/i, category: 'camera_focus', weight: 0.1 },
  { pattern: /\b(pose|posture|twerk|grind|grinding|striptease|burlesque|seductive\s*move|seductive\s*movement|yoga\s*pose|dance\s*pose)\b/i, category: 'pose_context', weight: 0.12 },
  { pattern: /\b(dance|dance\s*practice|dance\s*class|motion|movement|sway|spin|twirl|challenge|reels|shorts|hashtag|viral|tiktok|instagram|story)\b/i, category: 'movement_context', weight: 0.08 },
  { pattern: /\b(hidden|secret|yashirin|maxfiy|private|privately|concealed)\b/i, category: 'privacy_context', weight: 0.15 },
  { pattern: /\b(repeat(ed)?\s*frames|multiple\s*frames|scene\s*change|temporal|sequence|persistent\s*focus)\b/i, category: 'temporal_context', weight: 0.05 },
];

// Context modifiers — change interpretation
const CONTEXT_MODIFIERS: { pattern: RegExp; modifier: number; note: string }[] = [
  { pattern: /\b(how\s+to\s+prevent|qanday\s+oldini\s+olish|oldini\s+olish|himoya\s+qilish|xavfsizlik|ta'limiy\s+ma'lumot|ma'lumot\s+beradi|anti\s+scam|anti\s+gambling|prevention|awareness|warning)\b/i, modifier: -0.4, note: 'prevention_context' },
  { pattern: /\b(documentary|hujjatli\s+film|research\s+on|tadqiqot)\b/i, modifier: -0.3, note: 'research_context' },
  { pattern: /\b(warning|ogohlantirish|danger|xavfli)\b/i, modifier: -0.2, note: 'warning_context' },
  { pattern: /\b(history\s+of|tarixi|historical)\b/i, modifier: -0.25, note: 'historical_context' },
  { pattern: /\b(for\s+kids|bolalar\s+uchun|child.?safe|age\s+appropriate)\b/i, modifier: -0.5, note: 'child_safe_context' },
  { pattern: /\b(tutorial|guide|yo'riqnoma|step.?by.?step)\b/i, modifier: 0.08, note: 'tutorial_could_be_harmful' },
  { pattern: /\b(free|download|click\s+here|bosing)\b/i, modifier: 0.15, note: 'spam_indicator' },
  { pattern: /\b(anonymous|hidden|secret|yashirin|maxfiy)\b/i, modifier: 0.2, note: 'concealment_indicator' },
];

// ---- Tokenization & Stemming ----

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' __URL__ ')
    .replace(/[^\w\s''`-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'it', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her',
  'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'and',
  'but', 'or', 'not', 'no', 'if', 'so', 'as', 'up', 'out', 'just',
  // Uzbek stop words
  'va', 'bu', 'u', 'bilan', 'uchun', 'da', 'ga', 'dan', 'ni', 'ning',
  'ham', 'esa', 'bo\'lsa', 'edi', 'ekan', 'deb', 'shu', 'men', 'sen',
  'siz', 'ular', 'biz', 'har', 'bir', 'hamma',
]);

export function removeStopWords(tokens: string[]): string[] {
  return tokens.filter((t) => !STOP_WORDS.has(t) && t !== '__url__');
}

export function stem(word: string): string {
  // Simple suffix stripping for English
  let w = word.toLowerCase();
  if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith('tion') && w.length > 6) w = w.slice(0, -4);
  else if (w.endsWith('ness') && w.length > 6) w = w.slice(0, -4);
  else if (w.endsWith('ment') && w.length > 6) w = w.slice(0, -4);
  else if (w.endsWith('able') && w.length > 6) w = w.slice(0, -4);
  else if (w.endsWith('ible') && w.length > 6) w = w.slice(0, -4);
  else if (w.endsWith('ly') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('er') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('es') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('s') && w.length > 3 && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.startsWith('o') && w.endsWith('ng') && w.length > 4) w = w.replace(/^o/, '');
  return w;

  // Uzbek suffix stripping
  if (w.endsWith('lar') || w.endsWith('ler')) w = w.slice(0, -3);
  else if (w.endsWith('lari') || w.endsWith('leri')) w = w.slice(0, -4);
  else if (w.endsWith('ning')) w = w.slice(0, -4);
  else if (w.endsWith('dagi') || w.endsWith('degi')) w = w.slice(0, -4);

  return w;
}

function nGrams(tokens: string[], n: number): string[] {
  const result: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    result.push(tokens.slice(i, i + n).join(' '));
  }
  return result;
}

// ---- Entity Extraction ----

export function extractEntities(text: string): Entity[] {
  const entities: Entity[] = [];

  const urlRegex = /https?:\/\/[^\s]+/gi;
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  const phoneRegex = /\+?\d[\d\s-]{8,}\d/g;
  const hashtagRegex = /#\w+/g;
  const mentionRegex = /@\w+/g;

  for (const [regex, type] of [
    [urlRegex, 'url'],
    [emailRegex, 'email'],
    [phoneRegex, 'phone'],
    [hashtagRegex, 'hashtag'],
    [mentionRegex, 'mention'],
  ] as const) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      entities.push({ text: match[0], type, start: match.index, end: match.index + match[0].length });
    }
  }

  return entities;
}

// ---- Sentiment Analysis ----

const POSITIVE_WORDS = new Set([
  // English (expanded)
  'good', 'great', 'excellent', 'amazing', 'beautiful', 'love', 'happy', 'joy',
  'wonderful', 'fantastic', 'perfect', 'awesome', 'best', 'nice', 'enjoy',
  'brilliant', 'delightful', 'pleasant', 'cheerful', 'glorious', 'magnificent',
  'splendid', 'superb', 'terrific', 'marvelous', 'outstanding', 'remarkable',
  'admirable', 'charming', 'gorgeous', 'lovely', 'precious', 'wonderful',
  'positive', 'optimistic', 'hopeful', 'grateful', 'thankful', 'blessed',
  'inspiring', 'uplifting', 'encouraging', 'motivating', 'empowering',
  'kind', 'gentle', 'caring', 'compassionate', 'supportive', 'helpful',
  'success', 'achievement', 'victory', 'triumph', 'win', 'accomplish',
  'safe', 'secure', 'protected', 'healthy', 'wellness', 'thrive',
  'fun', 'entertaining', 'exciting', 'thrilling', 'engaging',
  'beautiful', 'pretty', 'cute', 'adorable', 'sweet', 'tender',
  'smart', 'wise', 'intelligent', 'clever', 'genius', 'talented',
  'friend', 'family', 'together', 'unity', 'harmony', 'peace',
  // O'zbekcha (kengaytirilgan)
  'yaxshi', 'ajoyib', "zo'r", 'chiroyli', 'baxtli', 'sevgi', 'mukammal',
  'go\'zal', 'qiziq', 'foydali', 'samimiy', 'mehribon', 'shirin',
  'tabriklayman', 'rahmat', 'minnatdor', 'baraka', 'salomatlik',
  'g\'alaba', 'muvaffaqiyat', 'omad', 'shoshilinch', 'shod', 'xursand',
  'jonajon', 'sevimli', 'qadrli', 'aziz', 'hurmatli', 'pokiza',
  'tinchlik', 'birdamlik', 'do\'stlik', 'mehr', 'g\'amxo\'rlik',
]);

const NEGATIVE_WORDS = new Set([
  // English (expanded)
  'bad', 'terrible', 'horrible', 'awful', 'ugly', 'hate', 'angry', 'sad',
  'worst', 'disgusting', 'scary', 'dangerous', 'toxic', 'evil', 'nasty',
  'pathetic', 'miserable', 'wretched', 'gloomy', 'depressing', 'tragic',
  'painful', 'agonizing', 'devastating', 'catastrophic', 'disastrous',
  'cruel', 'brutal', 'savage', 'vicious', 'ruthless', 'merciless',
  'rage', 'fury', 'wrath', 'hostile', 'aggressive', 'violent',
  'fear', 'terror', 'panic', 'dread', 'horror', 'nightmare',
  'pain', 'suffer', 'agony', 'torment', 'torture', 'anguish',
  'hate', 'despise', 'loathe', 'detest', 'abhor', 'resent',
  'fail', 'failure', 'loss', 'defeat', 'ruin', 'destroy',
  'sick', 'ill', 'disease', 'infect', 'plague', 'epidemic',
  'death', 'die', 'dead', 'kill', 'murder', 'assassinate',
  'fake', 'false', 'liar', 'cheat', 'fraud', 'scam',
  'stupid', 'dumb', 'idiot', 'fool', 'moron', 'imbecile',
  'broken', 'damaged', 'corrupt', 'rotten', 'spoiled',
  // O'zbekcha (kengaytirilgan)
  'yomon', 'dahshatli', 'xunuk', 'nafrat', "g'azab", 'xavfli', 'zaharli',
  'achchiq', 'mash\'um', 'fojiali', 'og\'riqli', 'qayg\'uli', 'xafa',
  'g\'amgin', 'zo\'ravon', 'shafqatsiz', 'vahshiy', 'jirkanch',
  'qo\'rqinchli', 'qo\'rqitadigan', 'tahdid', 'xatar', 'bezovta',
  'o\'lim', 'o\'ldirish', 'qotil', 'qotillik', 'jinoyat',
  'soxta', 'aldash', 'firibgar', 'yolg\'on', 'tovlamachilik',
  'ahmoq', 'tentak', 'isrofgar', 'pastkash', 'razil',
  'kasal', 'kasallik', 'azob', 'qiynoq', 'azob-uqubat',
  'mag\'lubiyat', 'zarar', 'falokat', 'halokat', 'tanazzul',
]);

const NEGATION_WORDS = new Set(['not', 'no', "don't", "doesn't", "isn't", "wasn't", "can't", 'never', 'emas', 'yo\'q']);

function analyzeSentiment(tokens: string[]): number {
  let score = 0;
  let negated = false;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (NEGATION_WORDS.has(t)) {
      negated = true;
      continue;
    }

    let delta = 0;
    if (POSITIVE_WORDS.has(t)) delta = 0.2;
    else if (NEGATIVE_WORDS.has(t)) delta = -0.2;

    if (negated && delta !== 0) {
      delta = -delta;
      negated = false;
    }

    score += delta;
  }

  return Math.max(-1, Math.min(1, score));
}

// ---- Toxicity Scoring ----

function scoreToxicity(text: string): { score: number; signals: ContextSignal[] } {
  const signals: ContextSignal[] = [];
  let harmfulScore = 0;
  let safeScore = 0;

  for (const { pattern, weight, category } of HARMFUL_PATTERNS) {
    if (pattern.test(text)) {
      harmfulScore += weight;
      signals.push({ signal: category, weight, category: 'harmful_indicator' });
    }
  }

  for (const { pattern, weight, category } of SAFE_PATTERNS) {
    if (pattern.test(text)) {
      safeScore += weight;
      signals.push({ signal: category, weight, category: 'safe_indicator' });
    }
  }

  // Apply context modifiers
  let contextModifier = 0;
  for (const { pattern, modifier, note } of CONTEXT_MODIFIERS) {
    if (pattern.test(text)) {
      contextModifier += modifier;
      signals.push({
        signal: note,
        weight: Math.abs(modifier),
        category: modifier < 0 ? 'safe_indicator' : 'harmful_indicator',
      });
    }
  }

  for (const { pattern, category, weight } of MULTIMODAL_CONTEXT_PATTERNS) {
    if (pattern.test(text)) {
      signals.push({
        signal: category,
        weight,
        category: 'context_modifier',
      });
    }
  }

  const rawScore = harmfulScore - safeScore * 0.5 + contextModifier;
  const normalizedScore = 1 / (1 + Math.exp(-rawScore * 2)); // sigmoid

  return { score: normalizedScore, signals };
}

// ---- Intent Detection ----

function detectIntent(text: string, toxicity: number, tokens: string[]): Intent {
  const lower = text.toLowerCase();
  const hasSuggestive = /\b(suggestive|bait|sexual_borderline|sexual_suggestive|sexual_suggestive_uz|seductive|tease|erotik|sexi|qizg'in|maxsus\s+taklif|a'zo\s*bo'lsangiz|faqat\s*a'zo)\b/i.test(lower);

  if (toxicity > 0.8) return 'harmful_explicit';
  if (toxicity > 0.6 || (toxicity > 0.5 && hasSuggestive)) return 'harmful_subtle';

  if (/\b(how|what|why|when|where|who|qanday|nima|nega|qachon|qaerda|kim)\b/i.test(lower)) return 'informational';
  if (/\b(learn|study|course|lesson|dars|o'qish|ta'lim|tutorial)\b/i.test(lower)) return 'educational';
  if (/\b(buy|price|shop|sale|order|sotib|narx|do'kon)\b/i.test(lower)) return 'commercial';
  if (/\b(funny|lol|haha|meme|movie|music|game|film|qo'shiq|o'yin)\b/i.test(lower)) return 'entertainment';
  if (/\b(friend|chat|share|post|follow|like|do'st|ulash)\b/i.test(lower)) return 'social';

  return 'unknown';
}

function inferContentClass(text: string, toxicity: number, signals: ContextSignal[]): ContentClass {
  const lower = text.toLowerCase();
  const hasSafeSignal = signals.some((s) => s.category === 'safe_indicator');
  const hasHarmSignal = signals.some((s) => s.category === 'harmful_indicator');
  const hasPrevention = signals.some((s) => /prevention|awareness|warning|education|informational|documentary|research|study|guide|tutorial|prevention_context/.test(s.signal));
  const hasMedical = signals.some((s) => /medical|doctor|health|treatment|clinical|tibbiyot|shifokor|davolash|diagnostika/.test(s.signal));
  const hasSports = signals.some((s) => /sports?|game|play|team|match|champion|athlete|training|fitness|yoga|workout|treen|trenajyor|sport(s)?_uz/.test(s.signal));
  const hasFashion = signals.some((s) => /fashion|runway|model|lookbook|style|couture|editorial|garment|outfit|wardrobe/.test(s.signal));
  const hasArt = signals.some((s) => /art|museum|gallery|painting|sculpture|creative|poetry|theater|drama|cinema|san'at|muzey|rasm|ijod/.test(s.signal));
  const hasCultural = signals.some((s) => /cultural|tradition|festival|dance|folk|heritage|ceremony|ritual|madaniyat|milliy/.test(s.signal));
  const hasPoseContext = signals.some((s) => /pose_context|pose|posture|twerk|grind|striptease|burlesque|dance\s*pose|yoga\s*pose/.test(s.signal));
  const hasMovementContext = signals.some((s) => /movement_context|movement|dance|motion|sway|spin|twirl|challenge|reels|shorts|hashtag|viral|tiktok|instagram|story/.test(s.signal));
  const hasCameraFocus = signals.some((s) => /camera_focus|close[- ]?up|zoom|cropped|tight\s*frame|body\s*shot|headshot/.test(s.signal));
  const hasPrivacyContext = signals.some((s) => /privacy_context|hidden|secret|maxfiy|yashirin|private|privately|concealed/.test(s.signal));
  const hasTemporalContext = signals.some((s) => /temporal_context|repeated\s*frames|multiple\s*frames|scene\s*change|sequence|persistent\s*focus/.test(s.signal));
  const hasClothingContext = signals.some((s) => /clothing|lingerie|bikini|swimsuit|underwear|braless|topless|see.?through|wet.?shirt|cleavage|cameltoe/.test(s.signal));
  const hasSuggestive = signals.some((s) => /suggestive|bait|sexual_borderline|sexual_suggestive|sexual_suggestive_uz|seductive|tease|erotik|sexi|qizg'in|maxsus\s+taklif|a'zo\s*bo'lsangiz/.test(s.signal));
  const hasExplicitSexual = signals.some((s) => /sexual_explicit|porn|erotic|sex|nude|pornography|sexual_uz|sexual_ru|sexual_ko|sexual_ar/.test(s.signal));
  const hasScam = signals.some((s) => /scam|phishing|fraud|social_engineering|phishing_variant|uz_scam_persuasion/.test(s.signal));
  const hasGambling = signals.some((s) => /gambling|betting|casino|qimor|gambling_uz|gambling_ru|gambling_tr|gambling_promo/.test(s.signal));
  const hasViolence = signals.some((s) => /violence|kill|murder|zo'ravonlik|qotillik|violence_uz|violent|terror|attack/.test(s.signal));
  const hasTrend = signals.some((s) => /viral|trend|challenge|duet|stitch|hashtag|follow|like|share|reels|shorts|story|vlog|stream/.test(s.signal));
  const hasSexualTrend = hasSuggestive && hasTrend;

  if (hasSafeSignal && hasExplicitSexual && hasPrevention) return 'educational';
  if (hasSafeSignal && hasExplicitSexual && hasMedical) return 'medical';
  if (hasSafeSignal && hasExplicitSexual && hasSports) return 'sports';
  if (hasSafeSignal && hasExplicitSexual && hasFashion) return 'fashion';
  if (hasSafeSignal && hasExplicitSexual && hasArt) return 'art';
  if (hasSafeSignal && hasExplicitSexual && hasCultural) return 'cultural';
  if (hasSexualTrend && !hasSafeSignal) return 'harmful_subtle';
  if (hasSuggestive && hasCameraFocus && hasPoseContext && !hasPrevention) return 'harmful_subtle';
  if (hasSuggestive && hasClothingContext && hasTrend && !hasSafeSignal) return 'harmful_subtle';
  if (hasExplicitSexual && !hasPrevention && !hasMedical) return 'harmful_explicit';
  if ((hasScam || hasGambling || hasViolence) && !hasSafeSignal) return 'harmful_explicit';

  if (hasSuggestive && !hasPrevention && !hasMedical && !hasSports && !hasFashion && !hasArt && !hasCultural) return 'suggestive';
  if (hasMedical && (hasSafeSignal || toxicity < 0.6)) return 'medical';
  if (hasSports && (hasSafeSignal || toxicity < 0.6)) return 'sports';
  if (hasFashion && (hasSafeSignal || toxicity < 0.6)) return 'fashion';
  if (hasArt) return 'art';
  if (hasCultural) return 'cultural';
  if (hasPrevention) return 'educational';
  if (hasSafeSignal) return 'safe';
  if (hasTrend) return 'ambiguous';
  if (hasHarmSignal) return toxicity > 0.4 ? 'harmful_subtle' : 'ambiguous';

  return 'unknown';
}

// ---- Language Detection ----

function detectTextLanguage(text: string): 'uz' | 'en' | 'mixed' {
  const uzChars = (text.match(/[''`]/g) || []).length;
  const uzSuffixes = (text.match(/\b\w+(lar|ler|ning|dagi|lari|cha|dan|ga|ni|da)\b/gi) || []).length;
  const enWords = (text.match(/\b(the|is|are|was|were|have|has|this|that|with|from|for|and|but|not)\b/gi) || []).length;

  const uzScore = uzChars * 2 + uzSuffixes * 3;
  const enScore = enWords * 2;

  if (uzScore > 3 && enScore > 3) return 'mixed';
  if (uzScore > enScore) return 'uz';
  return 'en';
}

// ---- Content Fingerprint ----

function computeFingerprint(text: string): string {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }

  // SimHash-like: also hash bigrams for fuzzy matching
  const tokens = tokenize(normalized);
  const bigrams = nGrams(tokens, 2);
  for (const bg of bigrams) {
    for (let i = 0; i < bg.length; i++) {
      hash = ((hash << 5) - hash + bg.charCodeAt(i)) | 0;
    }
  }

  return Math.abs(hash).toString(36);
}

// ---- Topic Extraction ----

const TOPIC_KEYWORDS: Record<string, string[]> = {
  technology: ['computer', 'software', 'app', 'phone', 'internet', 'digital', 'ai', 'kompyuter', 'dastur', 'telefon'],
  health: ['health', 'medical', 'doctor', 'disease', 'treatment', 'salomatlik', 'tibbiyot', 'shifokor', 'kasallik', 'davolash'],
  education: ['school', 'university', 'learn', 'study', 'teacher', 'maktab', 'universitet', "o'qituvchi", "o'qish", "ta'lim"],
  finance: ['money', 'bank', 'invest', 'price', 'economy', "pul", 'bank', 'narx', 'iqtisod', 'moliya'],
  entertainment: ['movie', 'music', 'game', 'play', 'fun', 'film', "qo'shiq", "o'yin", "kulgili", 'hazil'],
  sports: ['football', 'basketball', 'sport', 'team', 'match', 'futbol', 'basketbol', 'sport', 'jamoa', 'musobaqa'],
  politics: ['government', 'president', 'election', 'law', 'policy', 'hukumat', 'prezident', 'saylov', 'qonun', 'siyosat'],
  religion: ['god', 'prayer', 'mosque', 'church', 'faith', 'xudo', 'namoz', 'masjid', 'cherkov', 'imon'],
  nature: ['animal', 'plant', 'nature', 'forest', 'ocean', 'hayvon', "o'simlik", 'tabiat', "o'rmon", 'okean'],
  food: ['food', 'cook', 'recipe', 'restaurant', 'eat', 'ovqat', 'pishirish', 'retsept', 'restoran', 'yemoq'],
};

function extractTopics(tokens: string[]): string[] {
  const topicScores: Record<string, number> = {};

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const token of tokens) {
      if (keywords.some((kw) => token.includes(kw) || kw.includes(token))) {
        score++;
      }
    }
    if (score > 0) topicScores[topic] = score;
  }

  return Object.entries(topicScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);
}

// ---- Complexity Score ----

function measureComplexity(text: string, tokens: string[]): number {
  const avgWordLength = tokens.reduce((s, t) => s + t.length, 0) / (tokens.length || 1);
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const wordsPerSentence = tokens.length / (sentences || 1);
  const uniqueRatio = new Set(tokens).size / (tokens.length || 1);

  const lengthScore = Math.min(avgWordLength / 10, 1);
  const sentenceScore = Math.min(wordsPerSentence / 25, 1);
  const vocabScore = uniqueRatio;

  return (lengthScore + sentenceScore + vocabScore) / 3;
}

// ============================================================
// PUBLIC API
// ============================================================

export function analyzeText(text: string): SemanticResult {
  const tokens = tokenize(text);
  const stems = removeStopWords(tokens).map(stem);
  const bigrams = nGrams(stems, 2);
  const trigrams = nGrams(stems, 3);
  const sentiment = analyzeSentiment(tokens);
  const { score: toxicity, signals: context_signals } = scoreToxicity(text);
  const intent = detectIntent(text, toxicity, tokens);
  const topics = extractTopics(tokens);
  const entities = extractEntities(text);
  const language = detectTextLanguage(text);
  const complexity = measureComplexity(text, tokens);
  const fingerprint = computeFingerprint(text);
  const content_class = inferContentClass(text, toxicity, context_signals);

  return {
    tokens,
    stems,
    bigrams,
    trigrams,
    sentiment,
    toxicity,
    intent,
    topics,
    entities,
    context_signals,
    language,
    content_class,
    complexity,
    fingerprint,
  };
}

export function computeSimilarity(a: SemanticResult, b: SemanticResult): number {
  const setA = new Set([...a.stems, ...a.bigrams]);
  const setB = new Set([...b.stems, ...b.bigrams]);

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  const jaccardSim = union > 0 ? intersection / union : 0;

  const topicOverlap = a.topics.filter((t) => b.topics.includes(t)).length / Math.max(a.topics.length, b.topics.length, 1);
  const sentimentSim = 1 - Math.abs(a.sentiment - b.sentiment) / 2;
  const toxicitySim = 1 - Math.abs(a.toxicity - b.toxicity);

  return jaccardSim * 0.4 + topicOverlap * 0.2 + sentimentSim * 0.15 + toxicitySim * 0.25;
}

export function isLikelyHarmful(result: SemanticResult): { harmful: boolean; confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = result.toxicity;

  if (result.intent === 'harmful_explicit') {
    score += 0.3;
    reasons.push('Explicit harmful intent detected');
  } else if (result.intent === 'harmful_subtle') {
    score += 0.15;
    reasons.push('Subtle harmful indicators');
  }

  const harmfulSignals = result.context_signals.filter((s) => s.category === 'harmful_indicator');
  const safeSignals = result.context_signals.filter((s) => s.category === 'safe_indicator');

  for (const s of harmfulSignals) reasons.push(`Harmful: ${s.signal}`);
  for (const s of safeSignals) reasons.push(`Safe context: ${s.signal}`);

  if (result.sentiment < -0.5) {
    score += 0.1;
    reasons.push('Strongly negative sentiment');
  }

  const confidence = Math.min(Math.max(score, 0), 1);
  return { harmful: confidence > 0.55, confidence, reasons };
}
