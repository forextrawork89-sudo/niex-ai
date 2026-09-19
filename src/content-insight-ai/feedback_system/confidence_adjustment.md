# Confidence Adjustment — Ishonch darajasini sozlash

## Mexanizm
AI har bir kontent turi uchun confidence score saqlaydi (0.0 — 1.0).
Feedback asosida bu score o'zgaradi.

## Formulalar

### False Positive uchun (confidence kamayadi)
```
new_confidence = old_confidence - base_delta * severity_multiplier
base_delta = 0.15
severity_multiplier = {
  first_time: 1.0,
  repeated: 1.5,    // bir xil pattern 2+ marta
  systematic: 2.0   // 5+ marta bir xil xato
}
```

### False Negative uchun (confidence oshadi)
```
new_confidence = old_confidence + base_delta * severity_multiplier
base_delta = 0.20
severity_multiplier = {
  text: 1.0,
  image: 1.2,
  video: 1.5,
  pose/movement: 1.5
}
```

## Chegaralar
- Minimum confidence: 0.05 (hech qachon 0 bo'lmasin)
- Maximum confidence: 0.99 (hech qachon 100% bo'lmasin)
- Har bir o'zgarish log qilinadi
- 10 tadan ortiq tez o'zgarish = ogohlantirish (model instability)

## Decay
- 30 kun davomida feedback kelmasa, confidence sekin-asta o'rtaga (0.5) qaytadi
- Bu "unutish" emas — bu "ishonchsizlanish"
