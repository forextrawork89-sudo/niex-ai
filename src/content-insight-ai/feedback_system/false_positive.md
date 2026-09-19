# False Positive — Noto'g'ri bloklash

## Ta'rif
AI xavfsiz kontentni zararli deb bloklagan holat.

## Sabablar
1. Overfitting — training data'da kam uchraydigan xavfsiz pattern
2. Kontekst tushunmaslik — tibbiy/ilmiy kontent pornografik deb baholash
3. Yuzaki o'xshashlik — xavfsiz rasm zararliga o'xshab ketishi
4. Matn konteksti — "o'ldirish" so'zi kitob sharhi vs tahdid

## O'rganish algoritmi

```
1. Feedback qabul qil
2. Kontentni tahlil qil
3. Qaysi qoida ishlagini aniqla
4. Qoida confidence'ini kamaytir (-0.15)
5. Yangi "safe pattern" qo'sh
6. O'xshash kontentlarni qayta baholash uchun queue'ga qo'y
7. Rollback imkoniyatini saqla
```

## Ustuvorlik
- Agar confidence > 0.8 bo'lsa: HIGH priority (model juda ishonchli xato qilgan)
- Agar tez-tez bir xil false positive: CRITICAL (systematic xato)
- Oddiy holat: MEDIUM

## Oqibat
False positive = foydalanuvchi tajribasini buzish. Xavfsiz kontentni bloklash — bu regression.
