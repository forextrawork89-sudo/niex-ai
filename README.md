# NIEX AI — Bolalar Xavfsizligi va Ota-Ona Nazorati AI Platformasi
### (Child Safety & Parental Insight Intelligent Platform)

> **Texnik topshiriq (Spetsifikatsiya):** NIEX-TZ-001 v1.2  
> **Platforma:** Web Client (React 18 + Vite 5 + TypeScript) & On-Device AI Engine  
> **Ishchi Muhit:** `/home/asilbek/NIEX.UZ/NIEX AI`

---

## 📌 Loyiha Haqida

**NIEX AI** — bolalarning raqamli xavfsizligini ta'minlash, zararli kontentlardan (kiberbulling, pornografiya, narkotik/psixotrop moddalar, firibgarlik, o'z joniga qasd qilishga undash) himoya qilish hamda ota-onalar uchun bolaning shaxsiy hayotini (privacy) buzmagan holda nazorat imkonini beruvchi multimodal sun'iy intellekt tizimidir.

Tizimning asosiy tamoyili — **"Privacy-First on-device AI"**: bolaning qurilmasidagi xabarlar va shaxsiy ma'lumotlar ochiq matn (raw-text) holatida serverga yoki ota-onaga yuborilmaydi. Tahlil to'liq mahalliy (on-device) neyron tarmoqlar va qoidalar asosida amalga oshiriladi, ota-onaga faqat xavf toifasi, ishonchlilik indeksi va tavsiyalar yetkaziladi.

---

## 🏗️ Arxitektura va Texnologik Stack

```
                                +---------------------------+
                                |      NIEX UI (React)      |
                                | Dashboard, Alerts, Stats  |
                                +-------------+-------------+
                                              |
                                +-------------v-------------+
                                |    Domain Services Layer  |
                                | Web, Time, Geo, SOS, Trust|
                                +-------------+-------------+
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
       +-----------v-----------+                             +-----------v-----------+
       |   Content Insight AI  |                             |   Telegram Adapter    |
       | Fast Pre-Filter (<15ms|                             | Bot API / Webhook     |
       | Uzbek/Eng NLP Engine  |                             | Parent Notifications  |
       +-----------+-----------+                             +-----------------------+
                   |
       +-----------v-----------+
       |  Multimodal AI Core   |
       | Vision / NSFW / Video |
       | Whisper ASR Adapter   |
       | Cognitive Graph / CoT |
       +-----------------------+
```

- **Frontend & UI:** React 18, Vite 5, Tailwind CSS, Lucide Icons, Web Workers (`ai.worker.ts`).
- **Mahalliy AI Core:**
  - **Fast Pre-filter:** Levenshtein masofasi, Prefix Trie, Regex (<15 ms kechikish).
  - **Semantic NLP:** O'zbek tili morfologik normalizatsiyasi, lotin-kirill konversiyasi, 4 ta risk darajasi (safe, low, medium, high/critical).
  - **Multimodal Ingestion:** Web Crypto AES-GCM shifrlangan bilimlar bazasi (KB).
  - **Vision & NSFW:** Canvas/WebGL asosida mahalliy rasm va video freymlar tahlili.
  - **ASR (Speech-to-Text):** Mahalliy Whisper adapteri va Web Speech API fallback.
  - **Cognitive Reasoning Graph:** Gipotezalar generatsiyasi, Bayesian ishonchlilik hisobi va Self-Critique tahlili.
- **Test & Sifat Kafolati:** Vitest, TypeScript (Strict mode, 0 xato), JSDOM.

---

## 📦 Domen Modullari va Funksional Imkoniyatlar (FR-07b — FR-45)

Loyiha 7 ta yirik mustaqil domen xizmatlariga ajratilgan:

### 1. Web Safety & Filtering
- `WebRulesService` (FR-07b): Kategoriya bo'yicha veb-filtrlash, yoshga mos ruxsatlar, oq/qora ro'yxatlar.
- `SafeContextAnalyzer` (FR-20): Ta'limiy (educational/medical) kontekstni anglash va noto'g'ri bloklash (false positive) oldini olish.
- `ActivityHistoryService` (FR-38): Bolaning veb qidiruv va ko'rgan sahifalari tarixi.
- `DomainReputationService` (FR-42): Domen reputatsiyasi va yangi shubhali domenlarni tekshirish.
- `LinkCheckerService` (FR-43): Bola kiritgan havolalarni SSRF himoyasi (private/reserved IP va noxolis portlar) bilan tekshirish va bolaga tushunarli xavf tushuntirishlarini berish.
- `BlockingScreenService` (FR-45): Bloklangan sahifalar o'rniga bolaga qulay tushuntirish va "Ota-onadan ruxsat so'rash" interfeysi.

### 2. App & Screen Time Management
- `TimeLimitsService` (FR-08): Kunlik umumiy ekran vaqti va ilovalar bo'yicha limitlar.
- `ScreenTimeService` (FR-09): Hafta kunlari (dushanba-juma vs dam olish kunlari) bo'yicha tabaqalashgan vaqt jadvallari.
- `QuietHoursService` (FR-10): Tungi uyqu va dars vaqtida avtomatik bloklash.
- `InstalledAppsService` (FR-11) & `AppInstallMonitor` (FR-15): O'rnatilgan ilovalar ro'yxati va yangi o'rnatilgan ilovalarni monitoring qilish.
- `AdditionalTimeService` (FR-13): Bolaning qo'shimcha vaqt so'rashi va ota-ona tomonidan tasdiqlanishi.
- `SharedTimeBudget` (FR-34): Bir nechta ilovalar uchun umumiy vaqt hamyoni (masalan, o'yinlar uchun jami 1 soat).

### 3. Location & Geofencing
- `LocationService` (FR-16): GPS geolokatsiya va batareya tejamkorligi (GPS/Wi-Fi/Cellular).
- `GeofenceService` (FR-17): Xavfsiz zonalar (Uy, Maktab, Bog'cha) va ulardan kirish/chiqish notifikatsiyalari.
- `LocationHistoryService` (FR-18): 30 kunlik marshrut tarixi va vaqt shkalasi.
- `CheckinService` (FR-35): Bolaning bitta tugma orqali "Yetib keldim" (Check-in) signali.
- `ArrivalScheduleService` (FR-36): Jadval bo'yicha belgilangan vaqtda manzilga yetib bormasa ota-onani ogohlantirish.

### 4. Activity AI & Permissioned Safe Text
- `PermissionedTextAnalyzer` (FR-21): Faqat ruxsat berilgan kontekstda matnlarni tahlil qilish, nozik shaxsiy yozishmalarni ota-onaga oshkor qilmaslik.
- `ActivityFeedService` (FR-22): Xavfsizlik hodisalari lentalari (Feed).
- `QuarantineService` (FR-26): Shubhali media va fayllarni vaqtinchalik karantinga olish.
- `AiSummaryService` (FR-32): Ota-onalar uchun kunlik/haftalik AI xulosa va tavsiyalar hisoboti.
- `WhatChangedService` (FR-37): Bolaning odatiy faoliyatidan keskin o'zgarishlar (anomaliyalar) monitoringi.

### 5. SOS, Health & Alerts
- `SosService` (FR-23): SOS favqulodda signal (kamida 3 soniya bosib turish, tasodifiy bosilishdan himoya, Telegram/SMS/Push parallel yuborish, ota-ona ko'rmaguncha har 2 daqiqada takrorlash va yuridik disclaimer).
- `OfflineSmsFallback` (FR-23b): Internet bo'lmaganda SMS/GSM orqali avtomatik favqulodda paket jo'natish mantig'i.
- `TechnicalMonitorService` (FR-33): Bolaning qurilmasi akkumulyator zaryadi (15% dan past), xotira holati va internet mavjudligini monitoring qilish.

### 6. Privacy, Trust & Compliance
- `PrivacyManager` (FR-19, FR-44): Ma'lumotlarni minimallashtirish, raw text saqlanmasligi, AES-GCM shifrlash, barcha ma'lumotlarni to'liq o'chirish (Right to Erasure / GDPR / O'zbekiston Qonunchiligi).
- `ReportingService` (FR-24, FR-25): PDF/CSV eksport, ruxsatsiz yuborilishdan himoya.
- `AgeTransitionService` (FR-27): Bola ulg'aygan sari (masalan, 13 yosh, 16 yosh) nazorat chegaralarini bosqichma-bosqich yengillashtirish.
- `TrustLadderService` (FR-28): Ota-ona va bola o'rtasidagi ishonch reytingi tizimi.
- `TamperProtectionService` (FR-29): Ilovani o'chirib tashlashga urinishdan himoya, PIN-kod tekshiruvi, 3 ta xatolikda 30 daqiqa bloklash.
- `OnboardingHealthCheck` (FR-30): Dastlabki sozlash va barcha ruxsatnomalar (Permissions) to'g'ri berilganligini tekshirish.
- `PublicTrustManifest` (FR-30b): Ochiq xavfsizlik va mustaqillik manifesti.
- `SupportService` (FR-31): Foydalanuvchilar uchun texnik qo'llab-quvvatlash va murojaatlar tizimi.
- `ParentNotificationCenter` (FR-39, FR-40, FR-41): Muhimlik darajalari bo'yicha bildirishnomalar, dars vaqtida chalg'itmaslik rejimi (Quiet hours).

### 7. Telegram Parental Bot Adapter
- `TelegramBotService` (FR-05): Ota-onalar uchun qulay Telegram bot: /start, /status, /limits, /sos, /grant_time, /report komandalari, Webhook va Polling rejimlari.

---

## 🚦 Haqiqiy Status Klassifikatsiyasi (Verification Reality)

Loyiha talablariga professional va xolis baho berilgan:

| Holat | Talablar soni | Ta'rif |
|---|:---:|---|
| **IMPLEMENTED** | 17 | Sof domen mantiqi, algoritmlar, testlar va UI ko'rinishlari Web/Node muhitida 100% mustaqil ishlaydi (masalan: FR-07b, FR-19, FR-20, FR-26, FR-27, FR-28, FR-29, FR-30, FR-30b, FR-31, FR-38, FR-40, FR-41, FR-42, FR-43, FR-44, FR-45). |
| **PARTIAL** | 20 | Barcha domen qoidalari, hisoblash algoritmlari va interfeyslari to'liq yozilgan va xotirada (in-memory) testdan o'tgan. Ishlab chiqarish (Production) uchun tashqi backend/DB (PostgreSQL/Supabase) va SMS/Push provayderlari kerak. |
| **UNSUPPORTED (Web Engine)** | 4 | Brauzer (V8/Web) sandboxing cheklovlari tufayli faqat Android Kotlin (AccessibilityService, UsageStatsManager, SmsManager) yoki iOS Swift native qatlami orqali ishlaydigan xususiyatlar (FR-11 real paket skaneri, FR-12 fondagi OS jarayonlari, FR-15 tizimli broadcast receiver, FR-23b to'g'ridan-to'g'ri GSM drayveri). |

---

## 🔐 Xavfsizlik va Maxfiylik

- **SSRF Guard:** Tashqi havolalar tekshirilganda ichki tarmoqlar (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16-31.x.x`, `[::1]`, `0.0.0.0`) va noxolis portlar qat'iy bloklanadi.
- **Path Traversal Protection:** Vite dev-server API endpointlari (`/api/kb/*`) qat'iy `kbRoot` chegarasi bilan cheklangan.
- **Zero Raw-Text Storage:** Matnlar faqat o'sha paytda xotirada tahlil qilinadi, doimiy xotiraga faqat risk toifasi yoziladi.
- **PIN Brute-Force Himoyasi:** 3 marta noto'g'ri PIN kiritilganda tizim avtomatik ravishda 30 daqiqaga qulflanadi.

---

## 🛠️ O'rnatish va Ishga Tushirish

### Talablar:
- Node.js >= 18.0.0
- npm >= 9.0.0

### Qadamlar:

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Muhit parametrlarini sozlash
cp .env.example .env

# 3. TypeScript tekshiruvidan o'tkazish (0 xatolik)
npm run typecheck

# 4. Barcha 63 ta test to'plamini ishga tushirish (100% pass)
npm test

# 5. Ishlab chiqarish (production) bundle yig'ish
npm run build

# 6. Mahalliy rivojlantirish serverini ishga tushirish
npm run dev
# Browser: http://localhost:5173
```

---

## ⚙️ Muhit O'zgaruvchilari (`.env.example`)

Quyidagi parametrlar `.env` faylida ko'rsatilishi mumkin:

```env
# Telegram Bot integratsiyasi
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_WEBHOOK_URL=https://api.niex.uz/webhook/telegram

# Eskiz.uz SMS Provayderi (Favqulodda SOS uchun)
ESKIZ_SMS_EMAIL=admin@niex.uz
ESKIZ_SMS_PASSWORD=your_secret_password

# Web Push Notifikatsiyalari (VAPID)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:security@niex.uz

# Bilimlar bazasi shifrlash kaliti (Mahalliy Web Crypto)
KB_ENCRYPTION_SECRET=your_32_byte_hex_or_passphrase
```

---

## 📁 Kataloglar Tuzilishi

```
NIEX AI/
├── src/
│   ├── content-insight-ai/       # Asosiy AI/ML & Reasoning yadrosi
│   │   ├── components/           # Tahlil va xulosa chiqarish vizual komponentlari
│   │   ├── lib/
│   │   │   ├── ai-core/          # Multimodal orkestratsiya, qarorlar qabul qilish
│   │   │   ├── asr/              # Ovozli tahlil (Whisper adapteri)
│   │   │   ├── kb-builder/       # Bilimlar bazasini indekslash va shifrlash
│   │   │   ├── reasoning-pipeline/ # Gipotezalar va CoT tahlil oqimi
│   │   │   ├── brain.ts          # AI markaziy muvofiqlashtiruvchisi
│   │   │   └── semantic-analyzer.ts # O'zbek/ingliz tillari semantik tahlili
│   ├── domain/                   # 7 ta biznes domen xizmatlari
│   │   ├── activity-ai/          # Matn tahlili, karantin, AI xulosa
│   │   ├── app-time/             # Ekran vaqti va ilovalar limitlari
│   │   ├── location-geofence/    # GPS geozonalar, check-in, tarix
│   │   ├── notifications/        # Xabarnomalar markazi, quiet hours
│   │   ├── privacy-trust/        # Maxfiylik, GDPR, PIN himoya, ishonch reytingi
│   │   ├── sos-health/           # SOS favqulodda signallar, texnik monitoring
│   │   ├── telegram/             # Telegram bot adapteri
│   │   └── web-safety/           # Veb filtrlash, SSRF tekshiruvi, reputatsiya
│   ├── ui/                       # React foydalanuvchi interfeysi
│   │   ├── dashboard/            # Ota-onalar boshqaruv paneli
│   │   ├── alerts/               # Ogohlantirishlar ro'yxati
│   │   └── settings/             # Sozlamalar va qoidalar
│   └── test-app.tsx              # Asosiy interaktiv sinov ilovasi
├── public/                       # Statik resurslar va Web Worker
├── vite.config.ts                # Vite konfiguratsiyasi (Path traversal himoyalangan)
├── tsconfig.json                 # TypeScript strict sozlamalari
└── package.json                  # Loyiha skriptlari va kutubxonalari
```

---

## 🧪 Sifat Ko'rsatkichlari (Audit Natijalari)

- **TypeScript Kompilyatsiyasi:** 0 ta xato (`npm run typecheck` muvaffaqiyatli).
- **Test Qamrovi:** 63 ta test fayli, 246 ta test — **100% muvaffaqiyatli**, 0 ta o'tkazib yuborilgan (`skipped: 0`).
- **Production Bundle:** `npm run build` orqali toza, optimallashtirilgan CSS va JS fayllar hosil qilinadi.
- **Xavfsizlik:** Zaxira fayllar, kaggle keshlar, qoldiq test matnlari tozalandi va `.gitignore` ga qo'shildi.

---
*Mualliflik huquqi &copy; 2026 NIEX Team. Barcha huquqlar himoyalangan.*
