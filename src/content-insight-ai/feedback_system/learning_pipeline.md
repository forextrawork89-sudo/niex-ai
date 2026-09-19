# Learning Pipeline — O'rganish quvuri

## Umumiy arxitektura

```
[Feedback kiritildi]
      ↓
[1. Validatsiya] — feedback to'g'ri formatdami?
      ↓
[2. Tahlil] — qaysi pattern xato ishlagan?
      ↓
[3. Prioritizatsiya] — qanchalik shoshilinch?
      ↓
[4. Qoida yaratish/yangilash] — yangi rule yoki mavjudni o'zgartirish
      ↓
[5. Confidence sozlash] — ishonch darajasini yangilash
      ↓
[6. Knowledge xotirani yangilash] — fayllarga yozish
      ↓
[7. Qayta baholash] — o'xshash kontentlarni qayta tekshirish
      ↓
[8. Monitoring] — o'zgarish ta'sirini kuzatish
```

## Bosqichlar tafsiloti

### 1. Validatsiya
- Feedback turi to'g'rimi?
- Tavsif yetarlimi? (min 10 belgi)
- Screenshot/video formatini tekshirish

### 2. Tahlil
- Screenshot → OCR + image classification
- Video → frame extraction + temporal analysis
- Text → NLP pattern extraction
- Qaysi knowledge file ishlaganini aniqlash

### 3. Prioritizatsiya
- CRITICAL: false_negative + video/pose
- HIGH: false_negative + image/text, false_positive + high confidence
- MEDIUM: oddiy false_positive
- LOW: suggestion, general

### 4. Qoida yaratish
- Mavjud qoidaga o'zgartirish kiritish
- YOKI yangi qoida yaratish
- Har bir qoida source='learned' deb belgilanadi

### 5-8. Yuqorida tavsiflangan
