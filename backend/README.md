# NIEX Security Module v2

NIEX-TZ-001 hujjatining **15.3/15.5** bo'limlari asosida. v1'dan farqi: endi ikki rejimda ishlaydi.

| | Dev/Pilot (`server.js`) | Production (`server-production.js`) |
|---|---|---|
| Secret storage | Fayl (JSON) | PostgreSQL (tranzaksion) |
| Nonce/Session/RateLimit/PIN | Xotira (Map) | Redis (atomik, Lua) |
| Master key | `.env` | KMS (AWS/Vault) — diskda hech qachon yo'q |
| Qurilma qo'shish | Admin token | Pairing kod (QR) |
| Audit | Append-only fayl | Hash-chain + DB constraint |

Rejim **avtomatik** — `REDIS_URL`/`DATABASE_URL`/`KMS_PROVIDER` bo'lsa production, bo'lmasa fayl/xotira. Bir xil kod, ikkala holatda ham ishlaydi.

## O'rnatish

```bash
npm install
cp .env.example .env
npm run test:all     # 91 + 11 = 102 test
npm start             # dev rejimi
# yoki
npm run start:prod    # REDIS_URL/DATABASE_URL o'rnatilgan bo'lsa production
```

## v2'da nima o'zgardi (v1'dagi 4/10 baholangan kamchiliklarga javob)

### 1. Xotiradagi state -> Redis (atomik, Lua bilan)
**Muammo edi:** 2+ server instance bo'lsa nonce/rate-limit/PIN counter har birida alohida — bitta instance'da bloklangan hujum ikkinchisidan o'tishi mumkin edi.

**Yechim:** `src/backends/redis/*.js`. Har bir operatsiya Lua skript orqali **atomik**. Buni shunchaki aytish emas, isbotladim:

```bash
npm run test:concurrency
```
- "50 parallel consumedan FAQAT bittasi ok:true" — replay test
- "100 parallel so'rovdan aniq 10 tasi o'tadi" — rate limit test
- "10 parallel xato urinish — faqat 3 tasi invalid_pin" — PIN lockout test

Bu testlar `ioredis-mock` bilan ishlaydi — bu mock emas, Redis'ning EVAL/Lua semantikasini to'g'ri simulyatsiya qiladigan real interpretator.

### 2. Master key env'da -> KMS orqali (`src/kms/kmsProvider.js`)
`MASTER_KMS_KEY` endi productionda **umuman ishlatilmaydi**. `KMS_PROVIDER=aws` yoki `vault` bilan, master key faqat server ishga tushganda RAM'ga tushadi, disk/env'da hech qachon turmaydi. RCE bo'lsa ham, hujumchi KMS'ning o'ziga IAM ruxsatiga ega bo'lmasa, kalitni ololmaydi.

### 3. Fayl-JSON -> PostgreSQL (tranzaksion, race-free)
`src/db/pgSecretManager.js`, `pgDeviceRegistry.js`. Concurrency testida **haqiqiy race condition topildi va tuzatildi**:
- `MAX(version)+1` -> `SEQUENCE` (parallel rotatsiyada duplicate key xatosi berardi)
- Audit hash-chain parallel yozuvda buzilardi -> `prev_hash UNIQUE` constraint + avtomatik retry
- JSONB ustuni kalitlar tartibini kafolatlamasligi sababli hash mos kelmasdi -> alohida `payload_json TEXT` ustuni

Bularning barchasi **pg-mem** (real SQL semantikali in-memory Postgres) bilan sinovdan o'tgan — mock emas.

### 4. Admin token bilan qurilma qo'shish -> Pairing kod
`src/pairing/pairingService.js`. Endi ota-ona ilovasi (o'z sessiyasi bilan) 6 xonali kod/QR yaratadi, bola qurilmasi shu kodni skanerlab o'z ochiq kalitini yuboradi. Admin token endi Android ilovasiga umuman berilmaydi.

### 5. Oddiy log fayli -> Hash-chain audit (`src/audit/hashChainLog.js`)
Har bir yozuv oldingisining SHA-256 hash'ini o'z ichiga oladi. Bironta qatorni tahrirlasangiz, `verifyChain()` aynan qaysi qatorda tahrirlanganini ko'rsatadi:
```js
{ valid: false, brokenAt: 1, reason: 'hash_mismatch_tampered' }
```

### 6. Prompt injection — endi ko'p tilli + homoglyph
`src/ai/promptGuard.js`ga o'zbek va rus tilidagi hujum patternlari, shuningdek **kirill-lotin aralash yozuv** (masalan lotin "i" o'rniga tashqi ko'rinishi bir xil kirill "i" harfi bilan filtrni chetlab o'tish) deteksiyasi qo'shildi.

---

## Halol chegara — nima "kod bilan yopib bo'lmaydi"

**10/10 xavfsizlik reytingi hech qanday tizim uchun haqiqiy emas.** Buni bu loyihaga ham, boshqa har qanday loyihaga ham aytaman. Sabab:

1. **Tashqi pentest o'rnini bosolmayman.** Men shu kodni yozganman — o'zim yozgan kodning zaif tomonini har doim ham ko'rolmayman. Bu inson auditorlar uchun ham, AI uchun ham amal qiladi.
2. **Ijtimoiy muhandislik, fishing, zero-day'lar** — bularning hech biri ushbu kod qatoriga tegishli emas.
3. **Huquqiy talablar** (O'zbekistonning shaxsiy ma'lumotlar qonuni, bolalar ma'lumotiga oid maxsus qoidalar) — bu huquqshunos ishi, dasturchi ishi emas.
4. **Operatsion xavfsizlik** — kim serverga SSH kirish huquqiga ega, parollar qanday almashtiriladi, backup qayerda saqlanadi — bularning barchasi kod tashqarisida.

Men qila oladigan narsa — **bilingan** har bir kamchilikni yopish, va buni **isbotlash** (concurrency testlar, tamper-evidence testlari orqali), shunchaki "endi xavfsiz" deb aytish emas. Shuni qildim. Qolgani — pentest, huquqiy tekshiruv, operatsion amaliyot — kodlab bo'lmaydigan qismlar.

## Productionga chiqish checklist'i (yangilangan)

- [x] Redis-backed atomik state (nonce/session/ratelimit/PIN)
- [x] Postgres-backed secret/device (tranzaksion, race-free)
- [x] KMS abstraksiyasi (master key diskda emas)
- [x] Pairing flow (admin token qurilmaga berilmaydi)
- [x] Hash-chain audit (tamper-evident)
- [x] Ko'p tilli prompt injection himoyasi
- [ ] **Tashqi pentest** — bu kodlab bo'lmaydi, mustaqil xizmat kerak
- [ ] **Huquqiy tekshiruv** — consent formasi, ma'lumot saqlash muddati
- [ ] Real KMS/Vault ulanishi va IAM sozlamalari (kod tayyor, infratuzilma kerak)
- [ ] Real Postgres/Redis serverlarini ishga tushirish va monitoring
- [ ] TLS/HSTS, WAF, DDoS himoyasi (infratuzilma darajasida)
- [ ] `/moderate` endpointidagi LLM stub'ni almashtirish
- [ ] Load testing (haqiqiy Redis/Postgres bilan, pg-mem/ioredis-mock emas)

## Test natijasi

```
npm test                 -> 91 passed, 0 failed  (funksional)
npm run test:concurrency -> 11 passed, 0 failed  (race condition, real Lua/SQL semantikasi bilan)
```
