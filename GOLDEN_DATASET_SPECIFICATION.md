# NIEX Golden Dataset Specification

## Purpose

The Golden Dataset is the permanent benchmark for NIEX. It should be stable, curated, and difficult enough to measure genuine progress in moderation quality. It should be used for:

- model benchmarking
- regression testing
- release validation
- policy consistency evaluation
- stress testing and hard-negative analysis

---

## 1. Target Size

A practical production target is:

- 100,000 labeled samples total
- 10,000 hidden holdout samples for final evaluation
- 90,000 public benchmark samples for regular testing

This is large enough to be meaningful, but still manageable for versioned curation.

### Suggested Composition

- 40,000 image/video-frame samples
- 20,000 audio/speech samples
- 20,000 text/web/OCR samples
- 20,000 multimodal or paired samples

---

## 2. Category Balance

The Golden Dataset should not be dominated by one category. Recommended balance:

| Category | Share |
| --- | --- |
| Safe everyday content | 25% |
| Safe but sensitive content | 15% |
| Sexual content / nudity | 15% |
| Sexual context / humor | 10% |
| Gambling / betting / casino | 8% |
| Scams / phishing / malware | 8% |
| Violence / self-harm | 7% |
| Illegal content | 4% |
| Advertisements / web layout / OCR | 8% |
|

This balance helps the model learn both true positives and false-positive boundaries.

---

## 3. Difficulty Strategy

The Golden Dataset should include:

- hard negatives
- ambiguous cases
- cultural and contextual ambiguity
- content that is safe in one context but harmful in another
- adult content presented in medical or educational settings
- artistic nudity and fashion samples
- gambling content embedded in sports or news contexts
- phishing pages that mimic legitimate brands

### Hard Cases Required

- educational sexual content
- artistic nudity
- pregnancy/fitness content
- medical images with sensitive body exposure
- fashion content with body-revealing clothing
- romance or flirtation in benign context
- gambling-related content in entertainment or sports media
- benign web pages that use scam-like layouts

---

## 4. Edge Cases to Include

The Golden Dataset should contain a dedicated edge-case slice with at least 10,000 samples covering:

- minor-related content that is safe and educational
- adult content in documentary or educational contexts
- OCR text that is harmless but misleading or suspicious
- web layouts that resemble phishing pages but are legitimate
- audio with background speech, laughter, or music that changes meaning
- video frames that need temporal context

---

## 5. Labeling Policy for the Golden Set

Each sample should have:

- primary policy label
- severity score
- context tags
- rationale note
- evidence note
- confidence score
- review status

### Example Labels

- safe
- safe_but_sensitive
- sexual_content
- sexual_context
- gambling
- phishing
- malware_page
- violence
- self_harm_risk
- advertisement
- ambiguous

---

## 6. Quality Gates

The Golden Dataset should only include samples that pass all of the following:

- approved license status
- hash and metadata generated
- duplicate check passed
- review status approved
- label confidence above threshold
- rationale present

A small portion should be reserved for adversarial and disagreement-based review.

---

## 7. How Future Samples Should Be Added

Future samples should be added through a controlled workflow:

1. new samples are staged
2. licenses are validated
3. duplicates are checked
4. samples are labeled and reviewed
5. samples enter a candidate pool
6. a curated subset is promoted into the Golden Dataset

The Golden Dataset should be updated in controlled releases rather than by open-ended accumulation.

### Recommended Release Strategy

- annual major refresh
- quarterly minor updates
- monthly patch fixes for metadata and label corrections

---

## 8. Maintenance Policy

The Golden Dataset should maintain:

- versioned manifests
- changelog
- per-sample provenance
- hash index
- annotation version
- review history

---

## 9. Final Recommendation

The Golden Dataset should be a curated, balanced, difficult, and explainable benchmark. It should be the “truth set” for NIEX’s release evaluations and should be designed to remain valuable even as the product evolves.

A strong initial target is:

- 100,000 samples total
- 10,000 hidden holdout samples
- 25% safe content
- 15% hard negatives and ambiguous cases
- full metadata and review history for every sample
