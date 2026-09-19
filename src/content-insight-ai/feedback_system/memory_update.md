# Memory Update — AI xotirasini yangilash

## Xotira turi
AI ning "xotirasi" = knowledge files + learned rules + confidence scores

## Yangilash jarayoni

### 1. Knowledge file yangilash
```
Feedback keldi → pattern ajratildi → tegishli knowledge file topildi
→ fayl ichiga yangi qoida/pattern qo'shildi
→ versiya raqami oshdi
→ o'zgarish tarixi saqlandi
```

### 2. Learned rules
- Har bir o'rganilgan qoida alohida saqlanadi
- `source: 'learned'` deb belgilanadi (vs `source: 'manual'` yoki `source: 'default'`)
- Feedback ID ga bog'langan (rollback uchun)

### 3. Pattern library
- Screenshot'lardan ajratilgan vizual patternlar
- Video'lardan ajratilgan temporal patternlar
- Matndan ajratilgan so'z/ibora patternlari
- Har bir pattern confidence score'ga ega

## Versiyalash
- Har bir knowledge file versiyalanadi (v1, v2, ...)
- O'zgarish tarixi (diff) saqlanadi
- Istalgan versiyaga qaytish mumkin

## Xotira hajmi
- Har 100 feedback dan keyin: eski, past confidence qoidalarni arxivlash
- Ziddiyatli qoidalarni tozalash
- "Eskirgan" patternlarni (6 oy feedback kelmagan) arxivlash
