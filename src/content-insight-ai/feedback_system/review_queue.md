# Review Queue — Ko'rib chiqish navbati

## Maqsad
AI avtomatik o'rganadi, lekin ba'zi feedbacklar inson ko'rib chiqishini talab qiladi.

## Avtomatik vs Manual

### Avtomatik o'rganish (inson kerak emas)
- Aniq false_positive: confidence > 0.9 va foydalanuvchi screenshot bergan
- Aniq false_negative: zararli kontent tavsifi aniq
- Takroriy pattern: bir xil xato 3+ marta kelgan

### Manual review kerak
- Noaniq feedback: tavsif yetarli emas
- Ziddiyatli: bir feedback "bloklama", boshqasi "blokla" deyapti
- Yangi kategori: oldin uchramagan kontent turi
- Confidence o'zgarishi katta (>0.3)
- Rollback so'rovi

## Queue tartibi
1. CRITICAL priority birinchi
2. Keyin HIGH
3. Ichki tartib: eng eski birinchi (FIFO)
4. Bir xil pattern feedbacklari guruhlangan
