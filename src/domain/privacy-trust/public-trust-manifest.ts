// FR-44: Public Trust Manifest in 3 Languages (Uzbek, Russian, English)

export type TrustLanguage = 'uz' | 'ru' | 'en';

export interface TrustManifestSection {
  title: string;
  items: string[];
}

export interface PublicTrustDocument {
  language: TrustLanguage;
  headline: string;
  subheadline: string;
  whatWeCollect: TrustManifestSection;
  whatWeNeverCollect: TrustManifestSection;
  retentionAndStorage: TrustManifestSection;
  childRightsAndAutonomy: TrustManifestSection;
  securityGuarantees: TrustManifestSection;
}

export const PUBLIC_TRUST_MANIFESTS: Record<TrustLanguage, PublicTrustDocument> = {
  uz: {
    language: 'uz',
    headline: 'NIEX AI Shaffoflik va Ishonch Manifesti',
    subheadline: 'Bolalar xavfsizligi va raqamli maxfiylik o‘rtasidagi halol muvozanat',
    whatWeCollect: {
      title: 'Biz nimalarni yig‘amiz (faqat xavfsizlik uchun zarur me’yorda):',
      items: [
        'Tashrif buyurilgan veb-saytlar domenlari (shaxsiy parametrlar va parollar avtomatik tozalangan holda).',
        'Ilovalardan foydalanish vaqti va davomiyligi (bolaning ekran vaqti me’yori uchun).',
        'Xavfsiz hududlarga (uy, maktab) kirish/chiqish haqidagi geolokatsiya holatlari va oxirgi nuqta.',
        'Favqulodda SOS holati signallari va qurilmaning texnik ish holati (batareya, internet).',
      ],
    },
    whatWeNeverCollect: {
      title: 'Biz nimalarni HECH QACHON yig‘maymiz yoki saqlamaymiz:',
      items: [
        'Hech qachon shaxsiy yozishmalar (Telegram, WhatsApp, SMS va h.k.) yashirincha o‘qilmaydi.',
        'Mikrofon orqali doimiy audio yozib olish mutlaqo yo‘q.',
        'Kamera orqali yashirin suratga olish yoki kuzatish taqiqlangan.',
        'Klaviaturada yozilgan harflarni (keylogger) yozib olish yo‘q.',
        'Biometrik yuzni tanish yoki xarakter/psixiatrik tashxis qo‘yish taqiqlangan.',
      ],
    },
    retentionAndStorage: {
      title: 'Ma’lumotlarni saqlash va o‘chirish:',
      items: [
        'Batafsil texnik hodisalar faqat 7 kun saqlanadi, so‘ngra to‘liq o‘chiriladi.',
        'Umumlashgan oylik statistika 90 kundan keyin tozalanadi.',
        'Ota-ona yoki bola xohlagan paytda hisobdagi ma’lumotlarni to‘liq o‘chirish huquqiga ega.',
      ],
    },
    childRightsAndAutonomy: {
      title: 'Bolaning huquqlari va voyaga yetish:',
      items: [
        'Bola o‘zining qaysi ma’lumotlari vasiy bilan ulashilayotganini istalgan payt ko‘ra oladi.',
        'Noto‘g‘ri bloklangan saytlar yoki ortiqcha nazorat bo‘yicha e’tiroz (dispute) bildirish huquqi mavjud.',
        'Bola 18 yoshga to‘lgan paytda barcha ota-ona monitoringi tizim tomonidan qat’iy to‘xtatiladi.',
      ],
    },
    securityGuarantees: {
      title: 'Xavfsizlik kafolatlari:',
      items: [
        'Barcha ma’lumotlar tranzitda va saqlashda zamonaviy TLS 1.3 hamda AES-256 bilan shifrlanadi.',
        'Ma’lumotlar hech qachon reklama beruvchilarga sotilmaydi yoki uchinchi shaxslarga berilmaydi.',
      ],
    },
  },
  ru: {
    language: 'ru',
    headline: 'Манифест доверия и прозрачности NIEX AI',
    subheadline: 'Честный баланс между безопасностью ребенка и уважением к частной жизни',
    whatWeCollect: {
      title: 'Что мы собираем (строго в рамках детской безопасности):',
      items: [
        'Домены посещаемых сайтов (параметры запросов и пароли предварительно удаляются).',
        'Время использования приложений для учета экранного времени.',
        'Факты прибытия/убытия из безопасных зон (дом, школа) и последняя известная геолокация.',
        'Сигналы экстренной помощи SOS и техническое состояние устройства (батарея, связь).',
      ],
    },
    whatWeNeverCollect: {
      title: 'Что мы НИКОГДА не собираем и не отслеживаем:',
      items: [
        'Мы никогда не читаем личные переписки в мессенджерах (Telegram, WhatsApp и др.).',
        'Никакой скрытой постоянной аудиозаписи через микрофон.',
        'Никаких скрытых снимков с камеры или тайного видеонаблюдения.',
        'Никакого перехвата нажатий клавиш (кейлоггеров).',
        'Никакого биометрического распознавания лиц и психиатрических диагнозов.',
      ],
    },
    retentionAndStorage: {
      title: 'Хранение и удаление данных:',
      items: [
        'Детальные события хранятся не более 7 дней, после чего безвозвратно удаляются.',
        'Агрегированная статистика хранится 90 дней.',
        'Родитель и ребенок имеют право в любой момент запросить полное удаление данных.',
      ],
    },
    childRightsAndAutonomy: {
      title: 'Права ребенка и взросление:',
      items: [
        'Ребенок в приложении всегда видит, какие именно данные видит родитель.',
        'Доступна подача апелляции при ошибочных блокировках или спорах о границах контроля.',
        'При достижении 18 лет родительский мониторинг автоматически прекращается.',
      ],
    },
    securityGuarantees: {
      title: 'Гарантии безопасности:',
      items: [
        'Шифрование данных по протоколам TLS 1.3 и AES-256.',
        'Данные никогда не продаются рекламодателям и третьим лицам.',
      ],
    },
  },
  en: {
    language: 'en',
    headline: 'NIEX AI Transparency & Public Trust Manifest',
    subheadline: 'A respectful balance between child protection and digital privacy',
    whatWeCollect: {
      title: 'What we collect (strictly for safety purposes):',
      items: [
        'Visited web domains (query parameters and sensitive data scrubbed).',
        'App screen time durations for healthy habit enforcement.',
        'Arrival and departure events from safe zones, plus latest known location.',
        'Emergency SOS signals and technical battery/connectivity health.',
      ],
    },
    whatWeNeverCollect: {
      title: 'What we NEVER collect or monitor:',
      items: [
        'We NEVER read private chat messages (Telegram, WhatsApp, etc.).',
        'No stealth microphone recording or continuous background listening.',
        'No secret camera capture or visual surveillance.',
        'No keystroke logging.',
        'No biometric facial identification or psychiatric profiling.',
      ],
    },
    retentionAndStorage: {
      title: 'Data retention & erasure:',
      items: [
        'Raw telemetry events are pruned after 7 days.',
        'Aggregated summaries are kept for 90 days.',
        'Families can trigger immediate data deletion at any time.',
      ],
    },
    childRightsAndAutonomy: {
      title: 'Child rights & age milestones:',
      items: [
        'Children have full transparency into what information is shared with guardians.',
        'Dispute mechanism for false blocks and monitoring concerns with 72h SLA.',
        'Parental monitoring automatically terminates upon the child turning 18.',
      ],
    },
    securityGuarantees: {
      title: 'Security commitments:',
      items: [
        'End-to-end data transit encryption using TLS 1.3 and AES-256 at rest.',
        'Zero data monetization, sharing, or advertising brokerage.',
      ],
    },
  },
};

export class PublicTrustManifestService {
  public getManifest(language: TrustLanguage = 'uz'): PublicTrustDocument {
    return PUBLIC_TRUST_MANIFESTS[language] || PUBLIC_TRUST_MANIFESTS.uz;
  }
}
