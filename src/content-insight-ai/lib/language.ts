export type Lang = 'uz' | 'en';

const UZ_MARKERS = [
  'salom', 'rahmat', 'kerak', 'uchun', 'bilan', 'qanday', 'nima', 'emas',
  'bo\'lsa', 'qilish', 'berish', 'olish', 'ko\'rish', 'bilish', 'ishla',
  'bloklash', 'blokla', 'bloklandi', 'bloklamadi', 'kontenti', 'kontent',
  'noto\'g\'ri', 'xavfsiz', 'zararli', 'yordam', 'taklif', 'holat',
  'bekor', 'qaytarish', 'tushuntir', 'rasm', 'video', 'matn', 'men',
  'sizning', 'iltimos', 'chunki', 'sabab', 'ushbu', 'haqida', 'lekin',
  'yoki', 'va', 'bu', 'shu', 'u', "bo'l", "o'z", "qo'sh",
  'nimaga', 'qachon', 'qaerda', 'kim', 'olib', 'berdi', 'qildi',
];

const EN_MARKERS = [
  'the', 'is', 'are', 'was', 'were', 'have', 'has', 'been', 'being',
  'this', 'that', 'what', 'how', 'why', 'when', 'where', 'which',
  'block', 'blocked', 'content', 'safe', 'harmful', 'image', 'video',
  'help', 'please', 'should', 'would', 'could', 'because', 'about',
  'false', 'positive', 'negative', 'feedback', 'report', 'train',
  'model', 'learning', 'pattern', 'detect', 'classify', 'rollback',
  'screenshot', 'upload', 'stats', 'statistics', 'confidence',
];

export function detectLanguage(text: string): Lang {
  const lower = text.toLowerCase().replace(/[^a-z\s']/g, ' ');
  const words = lower.split(/\s+/).filter(Boolean);

  let uzScore = 0;
  let enScore = 0;

  for (const word of words) {
    if (UZ_MARKERS.some((m) => word.includes(m))) uzScore++;
    if (EN_MARKERS.some((m) => word === m || word.startsWith(m))) enScore++;
  }

  const hasApostrophe = text.includes("'") && /[btkqgsh]'[aeiouldnr]/i.test(text);
  if (hasApostrophe) uzScore += 2;

  if (/\b(ning|dagi|lari|lar|dan|ga|ni|da)\b/i.test(text)) uzScore += 3;

  return uzScore >= enScore ? 'uz' : 'en';
}

type TranslationKey = keyof typeof TRANSLATIONS.uz;

const TRANSLATIONS = {
  uz: {
    greeting_line1: "Salom! Men Content Insight AI ning o'rganish tizimiman.",
    greeting_line2: "Menga quyidagilarni yuborishingiz mumkin:",
    greeting_fp: "**Noto'g'ri bloklandi** — xavfsiz kontentni blokladim (false positive)",
    greeting_fn: "**Bloklanmadi** — zararli kontentni o'tkazib yubordim (false negative)",
    greeting_media: "**Screenshot/Video** — aniqroq tushuntirish uchun",
    greeting_note: "**Izoh** — nima uchun xato ekanini tushuntiring",
    greeting_end: "Men har bir feedbackdan o'rganib, keyingi safar to'g'ri qaror qilishga harakat qilaman.",
    stats_hint: "📊 Statistikani ko'rish uchun yuqoridagi 'Statistika' tugmasini bosing.",
    rollback_hint: "↩️ Oxirgi o'zgarishni bekor qilish uchun 'O'rganish tarixi' bo'limiga o'ting va kerakli yozuvning 'Bekor qilish' tugmasini bosing.",
    help_title: "Men sizning feedbacklaringizdan o'rganaman:",
    help_1: "1️⃣ Feedback turini tanlang (noto'g'ri blokladi / bloklamadi)",
    help_2: "2️⃣ Kontent turini belgilang (text/image/video/...)",
    help_3: "3️⃣ Nima bo'lganini tushuntiring",
    help_4: "4️⃣ Iloji bo'lsa screenshot yoki video yuboring",
    help_end: "Men bu ma'lumotlardan pattern hosil qilib, keyingi safar to'g'ri qaror qilaman.",
    generic_reply: "Tushundim. Batafsil feedback berish uchun pastdagi '+ Yangi feedback' tugmasini bosing — shunda men aniqroq o'rgana olaman.",
    feedback_received: "Feedbackingiz qabul qilindi. Tahlil qilinyapti...",
    rejected_msg: "Tushundim. Sizning fikringiz qayd qilindi, lekin hozircha qoidalarga o'zgartirish kiritilmaydi.",
    learned_msg: "🧠 O'rgandim va xotiramni yangiladim. Bundan keyin shunga o'xshash \"{type}\" kontentini to'g'ri aniqlashga harakat qilaman.",
    new_rule: "📝 **Yangi qoida:**",
    screenshots_received: "📸 {count} ta screenshot qabul qilindi — vizual pattern sifatida saqlanadi.",
    video_received: "🎥 Video yozuv qabul qilindi — frame-by-frame tahlil qilinadi.",
    rollback_available: "↩️ Agar bu o'zgarish noto'g'ri bo'lsa, \"Bekor qilish\" tugmasini bosing.",
    fp_explanation: "AI \"{desc}\" ni zararli deb xato baholagan. Bu turdagi kontentni tanib, bloklashdan chiqarish kerak. Confidence {before}% dan {after}% ga tushirildi.",
    fn_explanation: "AI \"{desc}\" ni xavfsiz deb xato baholagan. Bu turdagi kontentni tanib, bloklash kerak. Confidence {before}% dan {after}% ga oshirildi.",
    fp_rule: "\"{desc}\" ga o'xshash {type} kontentni BLOKLAMA — bu xavfsiz kontent",
    fn_rule: "\"{desc}\" ga o'xshash {type} kontentni BLOKLA — bu zararli kontent",
    fp_pattern: "{type} kontenti noto'g'ri bloklangan: {desc}",
    fn_pattern: "{type} kontenti bloklanmagan: {desc}",
    suggestion_accepted: "Taklif qabul qilindi va ko'rib chiqish navbatiga qo'shildi.",
    suggestion_rule: "Foydalanuvchi taklifi: {desc}",
    content_text: 'Matn', content_image: 'Rasm', content_video: 'Video',
    content_pose: 'Poza/holat', content_movement: 'Harakat', content_body_shape: 'Tana shakli',
    train_started: "🏋️ Model training boshlandi... {count} ta feedback asosida o'rganilmoqda.",
    train_complete: "✅ Training tugadi! Natija: {accuracy}% aniqlik, {patterns} ta yangi pattern o'rganildi.",
    train_no_data: "⚠️ Training uchun yetarli feedback yo'q. Kamida 5 ta feedback kerak.",
    train_export: "📦 Training dataset eksport qilindi: {count} ta yozuv, {format} formatda.",
  },
  en: {
    greeting_line1: "Hello! I'm the Content Insight AI learning system.",
    greeting_line2: "You can send me:",
    greeting_fp: "**Incorrectly blocked** — I blocked safe content (false positive)",
    greeting_fn: "**Not blocked** — I missed harmful content (false negative)",
    greeting_media: "**Screenshot/Video** — for clearer explanation",
    greeting_note: "**Comment** — explain why the decision was wrong",
    greeting_end: "I learn from every feedback and try to make better decisions next time.",
    stats_hint: "📊 Click the 'Statistics' tab above to view stats.",
    rollback_hint: "↩️ Go to 'Learning History' tab and click 'Undo' on the entry you want to revert.",
    help_title: "I learn from your feedback:",
    help_1: "1️⃣ Choose feedback type (incorrectly blocked / not blocked)",
    help_2: "2️⃣ Select content type (text/image/video/...)",
    help_3: "3️⃣ Describe what happened",
    help_4: "4️⃣ Attach screenshot or video if possible",
    help_end: "I'll extract patterns from this data and make better decisions next time.",
    generic_reply: "Got it. Click '+ New feedback' below for detailed feedback — that helps me learn more precisely.",
    feedback_received: "Feedback received. Analyzing...",
    rejected_msg: "Understood. Your feedback has been noted, but no rule changes will be made at this time.",
    learned_msg: "🧠 Learned and updated my memory. I'll try to correctly identify similar \"{type}\" content from now on.",
    new_rule: "📝 **New rule:**",
    screenshots_received: "📸 {count} screenshot(s) received — saved as visual patterns.",
    video_received: "🎥 Video recording received — will be analyzed frame-by-frame.",
    rollback_available: "↩️ If this change is wrong, click the \"Undo\" button.",
    fp_explanation: "AI incorrectly classified \"{desc}\" as harmful. This type of content should be recognized and unblocked. Confidence reduced from {before}% to {after}%.",
    fn_explanation: "AI incorrectly classified \"{desc}\" as safe. This type of content should be recognized and blocked. Confidence increased from {before}% to {after}%.",
    fp_rule: "DO NOT BLOCK content similar to \"{desc}\" ({type}) — this is safe content",
    fn_rule: "BLOCK content similar to \"{desc}\" ({type}) — this is harmful content",
    fp_pattern: "{type} content incorrectly blocked: {desc}",
    fn_pattern: "{type} content not blocked: {desc}",
    suggestion_accepted: "Suggestion accepted and added to the review queue.",
    suggestion_rule: "User suggestion: {desc}",
    content_text: 'Text', content_image: 'Image', content_video: 'Video',
    content_pose: 'Pose/posture', content_movement: 'Movement', content_body_shape: 'Body shape',
    train_started: "🏋️ Model training started... Learning from {count} feedback entries.",
    train_complete: "✅ Training complete! Result: {accuracy}% accuracy, {patterns} new patterns learned.",
    train_no_data: "⚠️ Not enough feedback for training. Need at least 5 entries.",
    train_export: "📦 Training dataset exported: {count} entries in {format} format.",
  },
} as const;

export function t(key: TranslationKey, lang: Lang, vars?: Record<string, string | number>): string {
  let text: string = (TRANSLATIONS[lang][key] ?? TRANSLATIONS.uz[key] ?? key) as string;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export function getContentTypeLabel(ct: string, lang: Lang): string {
  const key = `content_${ct}` as TranslationKey;
  return TRANSLATIONS[lang][key] ?? ct;
}

let currentLang: Lang = 'uz';

export function setLang(lang: Lang) { currentLang = lang; }
export function getLang(): Lang { return currentLang; }
export function autoDetectAndSet(text: string): Lang {
  const detected = detectLanguage(text);
  currentLang = detected;
  return detected;
}
