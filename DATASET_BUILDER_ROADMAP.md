# NIEX Dataset Builder Roadmap

## Objective

The Dataset Builder is the operational engine that will let NIEX ingest, validate, curate, version, and evaluate datasets at scale. It should eventually support the full lifecycle of dataset management without relying on ad-hoc manual processes.

This roadmap is intentionally engineering-focused. The goal is not to build a prototype quickly, but to create a durable, auditable data platform.

---

## 1. Core Goals

The builder should eventually be able to:

- import datasets from official sources
- validate licenses
- detect duplicates
- generate metadata
- generate hashes
- detect corrupted files
- split data into training / validation / testing
- generate statistics and quality reports
- track dataset versions
- support release management for the Golden Dataset

---

## 2. System Components

### 2.1 Ingestion Layer

Responsibilities:
- download or ingest data from approved sources
- preserve provenance and source URIs
- maintain staging directories

Features:
- source registry
- scheduled sync support
- checksum verification on ingest

### 2.2 License Validation Layer

Responsibilities:
- validate dataset terms
- enforce approved usage categories
- quarantine unclear licenses

Features:
- license policy engine
- per-dataset compliance status
- review queue for restricted content

### 2.3 Deduplication Layer

Responsibilities:
- detect exact and near duplicates
- prevent repeated samples across sources

Features:
- SHA-256 hashing
- perceptual hashing for images
- text similarity checks for OCR/text data
- duplicate report generation

### 2.4 Metadata Generation Layer

Responsibilities:
- generate metadata records
- assign category labels
- create versioned manifests

Features:
- schema validation
- automatic metadata enrichment
- annotation version tracking

### 2.5 Quality Assurance Layer

Responsibilities:
- check file integrity
- flag corrupted or incomplete files
- compute dataset statistics

Features:
- corruption detection
- missing-file report
- distribution monitoring
- label-quality metrics

### 2.6 Splitting and Benchmark Layer

Responsibilities:
- generate train / validation / test splits
- create golden and stress subsets

Features:
- stratified splits
- balanced sampling
- holdout set generation

### 2.7 Reporting Layer

Responsibilities:
- generate quality and coverage reports
- monitor drift and balance over time

Features:
- coverage dashboards
- balance reports
- drift reports
- license audit reports

### 2.8 Versioning and Release Layer

Responsibilities:
- publish dataset versions
- maintain changelogs
- support rollback

Features:
- semantic versioning
- release manifest
- audit trail

---

## 3. Recommended Build Phases

### Phase 1 — Foundation

Build the core infrastructure:

- ingestion pipeline
- storage layout
- metadata schema
- checksum generation
- basic license registry

### Phase 2 — Quality and Validation

Add:

- corruption detection
- duplicate detection
- basic reporting
- stratified splitting

### Phase 3 — Benchmarking

Add:

- golden dataset workflow
- stress and edge-case pipelines
- review queue
- release management

### Phase 4 — Scale and Automation

Add:

- scheduled ingestion from approved sources
- drift monitoring
- quality scorecards
- active maintenance workflow

---

## 4. Core Workflows

### Import Workflow

1. Register source
2. Pull data into staging
3. Validate file integrity
4. Generate hashes
5. Generate metadata
6. Run duplicate detection
7. Send to review queue
8. Publish to processed set

### Release Workflow

1. Curate candidate set
2. Run quality checks
3. Create split files
4. Generate quality report
5. Publish new version
6. Update manifest and changelog

---

## 5. Recommended Outputs

The builder should produce:

- dataset manifest
- per-sample metadata file
- checksum index
- license inventory
- quality report
- split report
- version changelog
- golden benchmark package

---

## 6. Engineering Principles

- treat data as a product, not a one-off artifact
- separate raw, processed, and benchmark data
- make every dataset release traceable
- never publish a version without audit evidence
- keep a quarantine path for ambiguous or restricted samples

---

## 7. Final Recommendation

NIEX should build the Dataset Builder as a long-lived platform component, not a temporary script. It should become the backbone of dataset governance, evaluation, and release management for the product.

The first milestone should be a reliable pipeline that can ingest approved public datasets, validate them, generate metadata, detect duplicates, and publish a versioned benchmark set.
