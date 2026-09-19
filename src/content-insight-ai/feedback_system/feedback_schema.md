# Feedback Schema

Har bir feedback quyidagi ma'lumotlarni o'z ichiga oladi:

## Asosiy maydonlar

| Maydon | Turi | Tavsif |
|--------|------|--------|
| `id` | string | Unikal identifikator |
| `type` | enum | `false_positive` / `false_negative` / `suggestion` / `general` |
| `content_type` | enum | `text` / `image` / `video` / `pose` / `movement` / `body_shape` |
| `verdict_given` | enum | AI bergan qaror: `safe` / `harmful` / `uncertain` |
| `verdict_correct` | enum | To'g'ri qaror: `safe` / `harmful` / `uncertain` |
| `confidence_before` | float | AI ning feedback oldidagi ishonch darajasi (0-1) |
| `confidence_after` | float | O'rganishdan keyingi ishonch darajasi |
| `description` | string | Foydalanuvchi izohi |
| `screenshot_urls` | string[] | Qo'shilgan screenshot URL lari |
| `video_url` | string? | Video yozuv URL |
| `related_knowledge_file` | string? | Bog'liq knowledge fayl nomi |
| `tags` | string[] | Teglar |
| `status` | enum | `pending` / `reviewing` / `learned` / `rejected` / `rolled_back` |
| `created_at` | datetime | Yaratilgan sana |
| `reviewed_at` | datetime? | Ko'rib chiqilgan sana |
| `learned_at` | datetime? | O'rganilgan sana |

## Status hayot sikli

```
pending → reviewing → learned → (rolled_back)
                    → rejected
```
