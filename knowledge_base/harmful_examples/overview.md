# Harmful Examples Overview

## Purpose
This folder contains **explicit harmful pattern examples** used to train the AI classifier.
Unlike `clothing/` or `pose/` which contain analytical RULES, this folder contains
ACTUAL HARMFUL PATTERNS that the AI should recognize and block.

## Structure
Each file targets one category of harmful content:
- `sexual_explicit.md` — Sexual content keywords, phrases, search queries
- `profanity_multilang.md` — Profanity in English, Uzbek, Russian
- `violence_weapons.md` — Violence, weapons, terrorism
- `drugs_substances.md` — Drug-related terms
- `gambling.md` — Gambling, betting sites
- `self_harm.md` — Self-harm, suicide
- `cyber_threats.md` — Hacking, phishing, malware
- `scam_fraud.md` — Scams, fraud schemes
- `adult_websites.md` — Adult website names and patterns
- `sexual_celebrities.md` — Adult content creator names
- `body_sexual_terms.md` — Body parts in sexual context

## Added safety taxonomy (2026-08-07)
The canonical KB should also preserve structured evidence for real-world social-media manipulation patterns that are not purely keyword-based:
- Uzbek scam/phishing persuasion: `akkount`, `parol`, `tekshiring`, `bonus`, `yutuq`, `hozir bosing`, `tezda`
- Suggestive euphemistic bait: `maxsus taklif`, `faqat a'zo bo'lsangiz`, `qizg'in content`, `jalb qiluvchi content`
- Manipulative gambling invitation: `tez pul`, `yutuq kafolati`, `ro'yxatdan o'ting`, `bonus olish`
- Social-media engagement bait: urgent claims, deceptive rewards, implied exclusivity, and pressure to click or act immediately

These patterns should be treated as contextual risk signals rather than as automatic blocks. They require corroborating evidence from intent, surrounding language, and platform context.

## Format
Each file contains:
1. Category description
2. Example phrases (one per line, prefix with `-`)
3. Keywords list
4. Common variations and misspellings (leet speak, intentional typos)

## Loading
The KB folder loader treats this folder as `semantic_label: harmful`:
- ALL chunks are added as harmful training data
- LocalLLM learns these patterns as harmful embeddings
- Knowledge Graph creates harmful pattern nodes
