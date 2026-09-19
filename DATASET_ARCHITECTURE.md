# NIEX Dataset Architecture

## Mission Alignment

NIEX is not a simple NSFW classifier. It is an AI Safety Platform that must reason over harmfulness, context, intent, multimodal evidence, and policy boundaries. The dataset architecture therefore needs to support:

- evaluation of harmfulness with evidence and explanation
- safe-content coverage to reduce false positives
- robust generalization to real-world content
- long-term maintainability and legal compliance

This document proposes a production-grade dataset architecture for NIEX.

---

## 1. Core Design Principles

1. Balance safety and utility
   - The platform must learn both what is harmful and what is benign.
2. Evidence-first labeling
   - Every sample should carry labels, rationale, and policy context.
3. Multi-modal support
   - Images, video frames, audio, speech, OCR text, website structure, and text should all be represented.
4. Long-term maintainability
   - Versioning, license tracking, hashing, and provenance are mandatory.
5. Auditability
   - Every dataset slice should be traceable to its source and transformation history.

---

## 2. Recommended Directory Structure

```text
datasets/
  raw/
    public/
    licensed/
    internal_curated/
  processed/
    safe/
    unsafe/
    ambiguous/
    evaluation/
    training/
    validation/
    testing/
    golden/
    stress/
    edge_cases/
    adversarial/
    multilingual/
    multimodal/
  metadata/
    datasets.json
    samples.jsonl
    licenses.csv
    checksums.sha256
    provenance.json
  reports/
    quality_reports/
    drift_reports/
    license_audit/
    annotation_reports/
```

---

## 3. Category Folders

### 3.1 Safe Content

Purpose: train the model to recognize benign and allowed content.

Suggested subfolders:

- safe/schools
- safe/families
- safe/medical_education
- safe/sports
- safe/swimming_beach
- safe/art_museums
- safe/pregnancy_fitness
- safe/news
- safe/gaming
- safe/youtube_tiktok_instagram_like
- safe/education
- safe/religious
- safe/children
- safe/animals
- safe/food
- safe/technology
- safe/business
- safe/nature
- safe/travel

### 3.2 Unsafe Content

Purpose: capture harmful or policy-violating content.

Suggested subfolders:

- unsafe/pornography
- unsafe/partial_nudity
- unsafe/explicit_nudity
- unsafe/sexual_context
- unsafe/sexual_humor
- unsafe/adult_conversation
- unsafe/gambling_casino
- unsafe/betting_platforms
- unsafe/scams_phishing
- unsafe/malware_pages
- unsafe/violence
- unsafe/self_harm
- unsafe/illegal_content
- unsafe/advertisements
- unsafe/hate_or_harassment

### 3.3 Ambiguous and Sensitive

Purpose: support nuanced decisions.

Suggested subfolders:

- ambiguous/medical_nudity
- ambiguous/artistic_nudity
- ambiguous/fitness_clothing
- ambiguous/educational_sex_ed
- ambiguous/pregnancy_related
- ambiguous/romantic_context

### 3.4 Evaluation and Benchmarking

Purpose: hold fixed evaluation sets.

Suggested subfolders:

- evaluation/standard
- evaluation/hidden_holdout
- evaluation/robustness
- evaluation/multilingual
- evaluation/multimodal

### 3.5 Training / Validation / Testing

Purpose: standard ML partitioning.

Suggested splits:

- training/ 70%
- validation/ 15%
- testing/ 15%

### 3.6 Golden / Stress / Edge / Adversarial

Purpose: benchmark the hardest and most important cases.

- golden/ fixed benchmark set
- stress/ long-tail and noisy cases
- edge_cases/ ambiguous and boundary conditions
- adversarial/ crafted misleading examples

---

## 4. Metadata Schema

Each sample should have a metadata record in JSON or JSONL.

Suggested schema:

```json
{
  "id": "uuid",
  "source_dataset": "open_images_v7",
  "source_uri": "https://...",
  "content_type": "image",
  "modality": ["image", "ocr"],
  "category": "unsafe/explicit_nudity",
  "policy_label": "sexual_content",
  "severity": 3,
  "confidence": 0.92,
  "language": "en",
  "country": "US",
  "age_context": "adult",
  "safe_label": false,
  "harmfulness_score": 0.91,
  "reasoning_tags": ["nudity", "explicit"],
  "evidence": ["visible genital region", "explicit pose"],
  "license": "CC-BY-4.0",
  "license_status": "validated",
  "hash_sha256": "...",
  "duplicates_of": null,
  "created_at": "2026-08-04",
  "updated_at": "2026-08-04",
  "annotation_version": "v1.2",
  "review_status": "approved"
}
```

### Required Fields

- id
- source_dataset
- source_uri
- content_type
- category
- policy_label
- severity
- confidence
- license
- hash_sha256
- annotation_version
- review_status

---

## 5. Labeling Rules

### 5.1 Primary Policy Labels

- safe
- sexual_content
- violence
- self_harm
- gambling
- scam_or_phishing
- malware_or_suspicious_page
- illegal_content
- advertisement
- other_sensitive

### 5.2 Secondary Context Labels

- adult_context
- educational_context
- medical_context
- artistic_context
- family_context
- child_related_context
- sports_context
- religion_context

### 5.3 Severity Scale

- 0 = safe/allowable
- 1 = mild sensitive
- 2 = moderate concern
- 3 = strong policy violation
- 4 = severe or explicit harm

### 5.4 Evidence and Rationale

Every sample should carry either:

- human rationale, or
- policy-based rationale, or
- model-generated rationale pending review

This helps build explanation-aware evaluation.

---

## 6. Versioning Strategy

Use semantic versioning:

- major: schema change or labeling policy change
- minor: new data added or category rebalanced
- patch: metadata corrections or dedupe fixes

Example:

- dataset-v1.0.0 initial release
- dataset-v1.1.0 added safe-family and educational content
- dataset-v1.2.0 improved adversarial split

Each release should have:

- manifest file
- changelog
- checksum index
- license inventory

---

## 7. Quality Control

### Annotation Workflow

1. Source acquisition from approved public datasets
2. License validation
3. Duplicate detection
4. Metadata generation
5. Initial labeling
6. Review by senior annotators
7. Audit sample for policy consistency
8. Publish to processed set

### Quality Gates

- minimum label confidence
- inter-annotator agreement threshold
- policy consistency check
- duplicate rate below threshold
- corruption rate below threshold

### Suggested Quality Metrics

- label agreement > 0.85
- corruption rate < 0.5%
- duplicate rate < 2%
- coverage of edge cases > 10%

---

## 8. Duplicate Detection

Use a layered strategy:

1. Exact file hash (SHA-256)
2. Near-duplicate image hashing (pHash / dHash)
3. OCR/text similarity for text/page samples
4. Embedding-based similarity for semantic duplicates
5. URI-based dedupe for upstream sources

Recommended rule:

- exact duplicates removed immediately
- near duplicates quarantined for review

---

## 9. License Tracking

Each dataset should have:

- license name
- source URL
- allowed use
- commercial use status
- restrictions
- review status

Recommended license states:

- approved_public
- approved_research_only
- review_required
- restricted
- excluded

---

## 10. Dataset Update Workflow

1. Monitor source repositories and official pages
2. Download or ingest new releases
3. Validate license and provenance
4. Run dedupe and corruption checks
5. Generate metadata and hashes
6. Add to staging area
7. Review and publish to a new version

---

## 11. Recommended Initial Build Order

Phase 1: Foundation
- COCO
- Open Images
- ImageNet
- Places365
- CIFAR-10/100
- Fashion Product Images

Phase 2: Speech and Audio
- AudioSet
- Common Voice
- LibriSpeech

Phase 3: Security and Web
- PhishTank
- Malware Traffic Analysis
- RICO

Phase 4: Hard Cases
- adversarial and edge-case datasets built internally from the above sources

---

## 12. Final Recommendation

NIEX should build a hybrid dataset architecture:

- public open datasets for broad coverage
- curated internal sets for high-risk and edge cases
- a hardened golden benchmark for repeatable evaluation

The most important principle is that NIEX should not depend on a single dataset source. It needs a layered, modular, and auditable dataset ecosystem.
