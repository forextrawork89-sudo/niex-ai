# False Negative — Bloklanmagan zararli kontent

## Ta'rif
AI zararli kontentni xavfsiz deb o'tkazib yuborgan holat.

## Sabablar
1. Yangi pattern — training data'da bu turdagi kontent yo'q
2. Yashirin kontent — overlay, steganografiya, yashirin matn
3. Kam tanilgan til/format
4. Edge case — ikki xavfsiz narsa birga zararli bo'lishi

## O'rganish algoritmi

```
1. Feedback qabul qil — CRITICAL priority
2. Kontentni tahlil qil (screenshot/video)
3. Pattern ajrat: nima zararli qilgan?
4. Yangi "harmful pattern" qo'sh
5. Confidence'ni oshir (+0.2)
6. O'xshash kontentlarni darhol qayta skanla
7. Agar video: frame-by-frame pattern extraction
8. Rollback imkoniyatini saqla
```

## Ustuvorlik
- Video false negative: CRITICAL (eng xavfli)
- Image false negative: HIGH
- Text false negative: HIGH
- Pose/movement: CRITICAL

## Oqibat
False negative = bolani zararli kontentdan himoya qilmaslik. Bu eng jiddiy xato turi.
