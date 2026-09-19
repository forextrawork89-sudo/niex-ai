# NIEX Dataset Collection Plan

## Mission

NIEX needs a dataset strategy that supports both strong harmful-content detection and safe-content understanding. The collection plan should prioritize public, documented, reusable datasets with clear provenance and stable maintenance.

This plan is intentionally conservative: it favors legally and technically manageable sources over risky or poorly documented internet scraping.

---

## 1. Collection Strategy

### Priority Tier A — High Value and High Quality

These are the first datasets NIEX should acquire or curate from.

### Priority Tier B — Good Supporting Datasets

These fill modality or domain gaps.

### Priority Tier C — Specialized or Review-Required

These are useful, but should be used carefully due to licensing, maintenance, or sensitivity.

---

## 2. Candidate Datasets

| Dataset | Purpose | Content Type | Approx. Size | License / Access | Commercial Use | Research Only | Official Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| COCO | General image understanding, object detection, context, captions | Image | 330K+ images | Custom dataset terms; widely used in research | Usually research-focused; check terms | Yes, broadly research-oriented | https://cocodataset.org | Excellent for contextual visual reasoning and safe/unsafe scene understanding. |
| Open Images V7 | Large-scale image classification, object detection, segmentation, relationships | Image | 9M+ images with many annotations | Google dataset terms; research use is the main intended use | Check current terms | Yes, primarily research use | https://storage.googleapis.com/openimages/web/index.html | Excellent for broad coverage and scale. |
| ImageNet | Broad visual category coverage | Image | 14M+ images | Non-commercial research use historically; terms vary by subset | Not broadly unrestricted | Yes | https://www.image-net.org | Very strong for visual semantics, but licensing is not fully open for all uses. |
| CIFAR-10 / CIFAR-100 | Small but clean benchmark images for classification | Image | 60K images | Public academic benchmark; commonly used in research | Usually acceptable for research and academic use | Yes | https://www.cs.toronto.edu/~kriz/cifar.html | Good for baseline and controlled evaluation, not enough alone for production. |
| Places365 | Scene understanding and benign context | Image | 1.8M+ images | Research-oriented dataset terms | Check terms | Yes | http://places2.csail.mit.edu | Useful for safe-context coverage such as schools, parks, beaches, museums, homes. |
| CUB-200-2011 | Fine-grained bird imagery and fine-grained visual distinctions | Image | 11,788 images | Non-commercial research and educational use | No | Yes | https://www.vision.caltech.edu/datasets/cub_200_2011 | Useful for visual fine-grained complexity, less directly policy-related. |
| Fashion Product Images | Safe consumer imagery, clothing, fashion, shopping contexts | Image | 44K+ products | Kaggle dataset with MIT license visible on the page | Likely yes, subject to dataset page terms | Mixed | https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small | Strong safe-data supplement for clothing, fashion, and everyday lifestyle. |
| AudioSet | Audio event labels for sound understanding | Audio | 2.1M labeled clips | Research-oriented; YouTube-derived data and Google terms | Check terms | Yes | https://research.google.com/audioset | Excellent for audio moderation, speech context, background sounds, and environmental cues. |
| Common Voice | Speech data for ASR and multilingual speech understanding | Audio / Speech | 290+ languages; large community contributions | Mozilla Common Voice terms; open and community-driven | Generally yes, subject to terms | Mostly research/open | https://commonvoice.mozilla.org | Strong for speech, language, and conversational context. |
| LibriSpeech | Clean read-speech benchmark | Audio / Speech | ~1,000 hours | CC BY 4.0 | Yes, with attribution | No, not only research | https://www.openslr.org/12 | Excellent for controlled speech evaluation. |
| PhishTank | Phishing URLs and site indicators | Text / Web | Large live feed | Open API and community-powered; terms apply | Check terms | Mostly research/open use | https://phishtank.org | Useful for scams and phishing detection. |
| Malware Traffic Analysis | PCAPs and malware traffic samples | Network / PCAP | Ongoing archive | Research-oriented, public archive | Check terms | Yes | https://www.malware-traffic-analysis.net | Strong for malware and suspicious behavior evaluation. |
| RICO | Mobile app UI screenshots and layout structure | Image / UI | 66K+ Android app screens | Research-oriented dataset terms | Check terms | Yes, primarily research | http://icompute-ucr.github.io/RICO | Good for website and app layout understanding, OCR, UI structure, and suspicious design patterns. |
| NudeNet / OpenNSFW-style community resources | Explicit content detection and skin exposure signals | Image | Varies | Community-maintained; review required | Unclear / review required | Mixed | Various public repositories | Useful only if legally reviewed and curated carefully; should not be the primary source for production. |
| CIFAR-based safe visual benchmarks | Baseline visual classification and benign class coverage | Image | 60K | Academic benchmark | Usually acceptable | Yes | https://www.cs.toronto.edu/~kriz/cifar.html | Good for controlled experiments and synthetic stress tests. |

---

## 3. Recommended Acquisition Order

### Phase 1 — Core Safe Coverage

Acquire datasets for benign and everyday content:

- COCO
- Open Images V7
- Places365
- Fashion Product Images
- CIFAR-10/100

### Phase 2 — Multimodal Context

Acquire datasets for speech and audio:

- AudioSet
- Common Voice
- LibriSpeech

### Phase 3 — Web and Security Risk

Acquire datasets for scams, phishing, and suspicious web behavior:

- PhishTank
- Malware Traffic Analysis
- RICO

### Phase 4 — High-Risk and Hard Cases

Curate internal benchmark sets from the above sources for:

- explicit content
- sexual context and humor
- gambling and ad-heavy content
- edge-case safe content
- multilingual and adversarial samples

---

## 4. Safe-Content Priority Categories

The safe set should be broad enough to prevent overblocking. Recommended safe sources include:

- schools
- families
- medical education
- sports
- swimming and beach
- art and museums
- pregnancy and fitness
- news
- gaming
- YouTube/TikTok/Instagram-like content
- educational content
- religious content
- children content
- animals
- food
- technology
- business
- nature
- travel

The best way to build this safely is to mix public datasets with carefully selected and documented internal curation.

---

## 5. Harmful-Content Priority Categories

NIEX should collect or derive samples for:

- pornography
- partial nudity
- explicit nudity
- sexual context
- sexual humor
- adult conversation
- gambling
- casino advertisements
- betting platforms
- scams
- phishing
- malware pages
- violence
- self-harm (for safety detection only)
- illegal content
- advertisements
- OCR text
- website layouts
- video frames
- audio and speech
- context and intent
- multi-modal reasoning

---

## 6. Recommended Dataset Mix

A practical first-year mix could be:

- 40% safe and everyday content
- 25% moderate-risk content
- 20% clearly harmful content
- 10% ambiguous or edge cases
- 5% adversarial or stress samples

This balance helps reduce false positives without sacrificing safety coverage.

---

## 7. Collection Rules

1. Prefer official and well-documented sources.
2. Prefer public and research-friendly licenses.
3. Avoid unverified or random scraping.
4. Track provenance and license status at ingestion.
5. Keep a quarantine lane for samples whose legal or policy status is unclear.

---

## 8. Final Recommendation

NIEX should begin with a hybrid collection plan:

- broad public image and audio datasets for general coverage
- web and security datasets for phishing/malware and layout reasoning
- curated safe-content sets to prevent overblocking
- an internal benchmark set for hard and sensitive cases

This strategy balances quality, scale, legality, and long-term maintainability.
