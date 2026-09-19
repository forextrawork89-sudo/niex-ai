# 🚀 Deploy Ready — MVP launch checklist

**Sana:** 29-iyun 2026

## ✅ TAYYOR (production'ga olib chiqishga yaroqli)

### Asosiy funksiyalar
| Modul | Holat | Izoh |
|-------|-------|------|
| **Text moderation** (9 til) | ✅ | UZ, EN, RU, KO, ZH, AR, TR, SW, HA + ko'p tilli patternlar |
| **Image moderation** (NSFW.js) | ✅ | Haqiqiy ML model, IndexedDB cache, Resource Guardian |
| **Video moderation** | ✅ | Poster pre-filter + zich kadr namuna + scene-change |
| **Auto-research** (Wikipedia) | ✅ | Tilni aniqlab, lug'atda qidiradi, qaror qiladi |
| **Feedback learning** | ✅ | Phrase-based, deterministik override, shared backend tayyor |
| **KB shifrlash** | ✅ | AES-256-GCM, obfuskatsiyalangan kalit, 105 fayl bitta blobda |
| **Verdict cache + Fast blocklist** | ✅ | Qizish/batareya tejash |
| **Resource Guardian** | ✅ | Adaptiv throttling, rate limit, batareya-aware, cooldown |
| **Worker Pool** | ✅ | UI muzlamaydi (Web Workers) |
| **Shared learning** | ✅ | Supabase/REST adapter tayyor |

### Sifat
- ✅ **53/53 test o'tadi** (6 fayl: crypto, semantic, brain, fast-decision, learning, resource-guardian)
- ✅ **TypeScript 0 xato**
- ✅ **Production build toza** — `dist/` da plaintext qoldiq YO'Q
- ✅ **Full pipeline crypto test** — 105/105 fayl bayt-darajasida tiklanadi
- ✅ **Resource Guardian tasdiqlangan** — rate limit, cooldown, adaptiv throttle

### Resurs
- ✅ NSFW model IndexedDB'da cache (1 marta yuklab olinadi)
- ✅ Inference vaqti monitoring (qizish aniqlash)
- ✅ Batareya <15% + zaryadlanmasa → og'ir tahlil o'chadi
- ✅ Verdict cache (takror tahlil = 0 CPU)
- ✅ Fast blocklist (aniq zararli = 1ms)

---

## ⚠️ HALOL ESLATMA

### Bilish kerak
1. **Shifrlash obfuskatsiyadir** — professional reverse engineer ochadi. Haqiqiy himoya = server-side (kelajak)
2. **NSFW.js cheklov** — bikini/yelka ochiq portretni "Sexy" deb biroz oshiradi → "uncertain" zonasiga tushadi (bloklanmaydi) — bu **to'g'ri xulq-atvor**
3. **"Lesbienne" kabi orientatsiya so'zlari** — Wikipedia "sexuelle" deb ta'riflasa, bloklanadi. Bu sizning policy qaroringiz (O'zbekiston konteksti)

### Hali qila olmaydi (kelajak)
- ❌ Video **audio** (so'kinish/nutqни tinglash) — Web Speech API yoki Whisper kerak
- ❌ Image'da **zo'ravonlik/qurol/narkotik** — alohida model kerak (NSFW.js faqat jinsiy)
- ❌ Kontekstual chuqur tushunish — haqiqiy LLM kerak (pulli)

---

## 🚀 Launch oldidan qadamlar

### 1. Qo'lda brauzer sinov (siz)
- `npm run dev` → `localhost:5173`
- 📂 KB Folder → `enc` yozib Ishga tushir → "🔒 SHIFRLANGAN KB" 105 fayl
- ⚡ Smart AI'da bir necha matn sinab ko'rish
- 🖼 Rasm/Video tab'da rasm yuklab tahlil qilish

### 2. Production build sinov
```bash
npm run build
npm run preview  # localhost:4173 da production build'ni sinash
```
Brauzerda `localhost:4173` ochib, hammasi ishlashini tasdiqlash.

**Xavfsizlik tasdiqlangan (29-iyun preview test):**
- ✅ `/kb.enc` HTTP 200, 5.2 MB shifrlangan blob
- ✅ `/kb/list` HTTP 200 lekin **HTML qaytaradi** (SPA fallback) — plaintext ro'yxat YO'Q
- ✅ `/kb/file?path=...` HTML qaytaradi — fayl mazmuni YO'Q
- ✅ `dist/` tepa darajadagi fayllar: `assets/`, `index.html`, `kb.enc` (boshqa hech narsa)

### 3. (Tavsiya) Beta launch
- 50-100 tester
- Feedback yig'ish
- 2-4 hafta ichida muammolarni tuzatish

### 4. Public launch
- 8/10 sifat darajasida tayyor
- Server-side KB (haqiqiy xavfsizlik) kelajak v2 uchun

---

## 📋 Yangi npm skriptlar

```bash
npm run dev              # Dev server (localhost:5173)
npm run build            # Auto-shifrlash + production build
npm run preview          # Production build'ni sinash (localhost:4173)
npm test                 # 47 ta test
npm run typecheck        # TypeScript tekshiruvi
npm run encrypt-kb       # KB ni qayta shifrlash (KB o'zgartirilgandan keyin)
npm run rotate-key       # Yangi kalit yaratish (xavfsizlik yangilash)
npm run verify-crypto    # Shifrlash pipeline'ni to'liq sinash
```

---

## 📊 MVP umumiy baho: **7.5/10**

- Asosiy funksiya (jinsiy/qimor/narkotik): **8/10**
- Image moderation: **7/10**
- Video moderation: **6/10**
- Test/ishonchlilik: **6/10**
- Resurs samaradorligi: **8/10**
- Xavfsizlik (obfuskatsiya): **5/10** (server bilan → 9/10)
- Foydalanuvchi tajribasi: **7/10**

**Beta launch'ga TAYYOR. Public launch'ga 1-2 hafta tester feedback'i bilan.**
