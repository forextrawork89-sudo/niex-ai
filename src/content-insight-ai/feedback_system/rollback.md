# Rollback — O'zgarishlarni bekor qilish

## Maqsad
AI noto'g'ri o'rgangan bo'lsa, o'zgarishni tez qaytarish.

## Rollback turlari

### 1. Yakka o'rganish rollback
- Bitta feedback asosida qilingan o'zgarishni bekor qilish
- Qoida eski holatga qaytadi
- Confidence eski qiymatga qaytadi
- Feedback status → `rolled_back`

### 2. Batch rollback
- Ma'lum vaqt oralig'idagi barcha o'rganishlarni bekor qilish
- Masalan: "Oxirgi 1 soatdagi barcha o'zgarishlarni qaytarish"

### 3. Knowledge file rollback
- Butun knowledge file'ni oldingi versiyaga qaytarish
- Eng kuchli rollback turi

## Rollback jarayoni

```
1. Foydalanuvchi "Bekor qilish" tugmasini bosadi
2. Tizim o'rganish yozuvini topadi
3. Yangi qoida o'chiriladi / eski qoida tiklanadi
4. Confidence eski qiymatga qaytadi
5. Feedback status = 'rolled_back'
6. O'xshash kontentlar qayta baholanadi
7. Rollback o'zi ham log qilinadi
```

## Himoya
- Rollback faqat 72 soat ichida mumkin
- Rollback qilingan feedback qayta yuborilishi mumkin
- Bir xil feedbackni 3 martadan ortiq rollback qilish → admin ogohlantirish
