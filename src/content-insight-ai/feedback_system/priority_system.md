# Priority System — Ustuvorlik tizimi

## Darajalar

| Daraja | Rang | Vaqt chegarasi | Tavsif |
|--------|------|----------------|--------|
| CRITICAL 🔴 | Qizil | Darhol | Zararli video/pose bloklanmagan |
| HIGH 🟠 | Sariq | 1 soat | False negative yoki yuqori confidence xato |
| MEDIUM 🟡 | Sariq-yashil | 24 soat | Oddiy false positive |
| LOW 🟢 | Yashil | 72 soat | Takliflar, umumiy feedback |

## Avtomatik prioritizatsiya qoidalari

```
if (type === 'false_negative') {
  if (content_type in ['video', 'pose', 'movement']) → CRITICAL
  else → HIGH
}

if (type === 'false_positive') {
  if (confidence_before > 0.8) → HIGH
  if (same_pattern_count >= 3) → HIGH
  else → MEDIUM
}

if (type === 'suggestion') → LOW
if (type === 'general') → LOW
```

## Eskalatsiya
- CRITICAL 15 daqiqa ichida ko'rib chiqilmasa → admin xabarnoma
- HIGH 4 soat ichida → admin xabarnoma
- 10+ pending feedback → system alert
