# Body Ratio Patterns — AI Reasoning Knowledge Base

## 1. Document Metadata

*   **Module Identifier:** `body_ratio_reasoning_v3`
*   **Knowledge Base Class:** KB-BS-RATIO-REASONING
*   **Version:** 3.0.0
*   **System Context:** SafeNet Content Safety — On-Device AI Reasoning Layer
*   **Last Review:** June 24, 2026
*   **Purpose:** Defines how AI should reason about volumetric body ratios (waist-to-hip, shoulder-to-waist, chest-to-waist) for content safety, sexualized content detection, child protection, and false-positive prevention.

---

## 2. Purpose and Scope

### 2.1 What This Document Defines

This document provides the **reasoning framework** for how AI should interpret, classify, and act on human body ratios — the width-based measurements of the torso and its segments. It answers the question:

> **"How should AI reason about body ratios to detect sexualized content and protect children?"**

Body ratios are distinct from body *proportions* (height-based measurements covered in `body_proportion_patterns.md`). Ratios focus on the **cross-sectional shape** of the human torso:

- **Waist-to-hip ratio (R_WH)** — The narrowness of the waist relative to the hip width.
- **Shoulder-to-waist ratio (R_SW)** — The breadth of the shoulders relative to the waist.
- **Chest-to-waist ratio (R_CW)** — The width of the chest relative to the waist.
- **Torso length index (I_TL)** — The vertical extent of the torso as a normalized value.

These ratios are critical because:
- **Sexualization detection** — Exaggerated ratios (extremely narrow waist, very wide hips) are a primary signal of sexualized or objectifying presentation.
- **Age estimation support** — Children have undifferentiated torso shapes compared to adults.
- **Content authenticity** — AI-generated content frequently produces anatomically impossible body ratios.
- **Context disambiguation** — Athletic builds, fashion photography, and body types produce different ratios that require contextual interpretation.

### 2.2 What This Document Does NOT Define

- Implementation code (TypeScript, C++, WASM, or GPU shaders).
- Pixel-level image processing algorithms.
- Runtime optimization, memory management, or performance budgets.
- Unit test suites or stress testing frameworks.

Those concerns belong in engineering specification documents, not in the knowledge base.

### 2.3 Relationship to Other Modules

Body ratio analysis operates as a **shape-characterization signal** that feeds into and is informed by multiple modules:

```text
                        ┌──────────────────────┐
                        │   body_ratio_patterns │
                        │   (THIS DOCUMENT)     │
                        └──────────┬───────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
 ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
 │  clothing/   │          │skin_visibility│          │    pose/     │
 │  tightness   │          │  exposure     │          │  posture     │
 └──────┬───────┘          └──────┬───────┘          └──────┬───────┘
        │                         │                          │
        ▼                         ▼                          ▼
 ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
 │  emotion/    │          │  context/    │          │scene_under-  │
 │  expression  │          │  reasoning   │          │  standing    │
 └──────────────┘          └──────────────┘          └──────────────┘
```

**Foundational Principle:** A body ratio value alone must NEVER trigger content blocking. Ratios must always be evaluated in combination with clothing, skin visibility, pose, emotion, gaze, scene context, and intent reasoning. A narrow waist-to-hip ratio on a fitness instructor in a gym is completely different from the same ratio in sexualized AI-generated artwork.

### 2.4 Relationship to `body_proportion_patterns.md`

These two documents are complementary:

| Document | Measures | Primary Use |
|----------|----------|-------------|
| `body_proportion_patterns.md` | Height-based: head-to-body, torso-to-leg, arm-to-torso | **Age estimation** — child vs. adult |
| `body_ratio_patterns.md` (this) | Width-based: waist-to-hip, shoulder-to-waist, chest-to-waist | **Shape characterization** — sexualization, body type |

Both documents feed into the same downstream modules, but they measure fundamentally different anatomical features. Proportion patterns answer "how old does this person look?" while ratio patterns answer "is this body shape being emphasized or exaggerated?"

---

## 3. Core Body Ratio Definitions

### 3.1 The Three Primary Ratios

#### 3.1.1 Waist-to-Hip Ratio (R_WH)

The ratio of the narrowest part of the torso (waist) to the widest part of the lower torso (hips).

```text
      ┌──────────────────┐
      │   Shoulders      │  ← S_width
      └────────┬─────────┘
               │
          ┌────┴────┐
          │  Waist  │  ← W_width (narrowest)
          └────┬────┘
               │
      ┌────────┴─────────┐
      │      Hips        │  ← H_width (widest)
      └──────────────────┘

      R_WH = W_width / H_width
```

**Human Population Ranges:**

| R_WH Range | Typical Interpretation |
|-----------|------------------------|
| 0.90 – 1.00 | Minimal waist-hip differentiation (common in males, children, athletic builds) |
| 0.80 – 0.90 | Moderate differentiation (common in both sexes) |
| 0.70 – 0.80 | Noticeable differentiation (common in adult females) |
| 0.60 – 0.70 | Pronounced differentiation (naturally curvy body type) |
| < 0.60 | Extreme differentiation — may indicate corseting, image manipulation, or AI generation |

#### 3.1.2 Shoulder-to-Waist Ratio (R_SW)

The ratio of shoulder width to waist width — indicates the "V-shape" or "inverted triangle" of the upper torso.

| R_SW Range | Typical Interpretation |
|-----------|------------------------|
| 1.00 – 1.15 | Minimal shoulder-waist differentiation (children, some body types) |
| 1.15 – 1.35 | Standard symmetrical build (most adults) |
| 1.35 – 1.55 | Accentuated upper body (athletic males, broad-shouldered builds) |
| 1.55 – 1.80 | Highly accentuated (bodybuilder physiques, or exaggeration) |
| > 1.80 | Extreme — likely artificial exaggeration or AI generation |

#### 3.1.3 Chest-to-Waist Ratio (R_CW)

The ratio of chest width (measured at approximately 25% of the way down the torso) to waist width.

| R_CW Range | Typical Interpretation |
|-----------|------------------------|
| 1.00 – 1.10 | Minimal differentiation (children, slim builds) |
| 1.10 – 1.25 | Moderate differentiation (standard adult build) |
| 1.25 – 1.45 | Noticeable differentiation (athletic or curvaceous build) |
| > 1.45 | Extreme — potential exaggeration or manipulation |

### 3.2 AI Reasoning Principles for Body Ratios

**Principle 1: Ratios Are Descriptive, Not Normative**

Body ratios describe physical shape. They do not inherently indicate anything positive or negative. A ratio of 0.65 R_WH is a measurement — it becomes a safety concern ONLY when combined with other signals (sexualized pose, provocative clothing, objectifying context).

**Principle 2: Natural Human Variation Is Wide**

Real humans exhibit enormous body ratio variation. The AI system must never penalize natural body diversity. The risk assessment is about HOW the body is presented, not WHAT the body looks like.

**Principle 3: Exaggeration Beyond Human Norms Is a Signal**

When body ratios exceed what is anatomically possible for a real human, this signals either:
- Image manipulation or editing
- AI-generated content
- Artistic exaggeration

These are not inherently harmful, but they become risk factors when combined with sexualized context.

### 3.3 Categorical Mapping — AI Reasoning Classification

For AI decision routing, body ratios map to three reasoning categories:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Category        │ R_WH Range    │ R_SW Range    │ AI Reasoning Label  │
├─────────────────┼───────────────┼───────────────┼─────────────────────┤
│ Category_A      │ [0.75, 1.00]  │ [1.00, 1.35]  │ Standard Range      │
│                 │               │               │ No ratio-based       │
│                 │               │               │ risk contribution    │
├─────────────────┼───────────────┼───────────────┼─────────────────────┤
│ Category_B      │ [0.65, 0.74]  │ [1.36, 1.55]  │ Accentuated Shape   │
│                 │               │               │ Requires multi-      │
│                 │               │               │ signal evaluation    │
├─────────────────┼───────────────┼───────────────┼─────────────────────┤
│ Category_C      │ [0.00, 0.64]  │ [1.56, 3.00]  │ Extreme Accentuation│
│                 │               │               │ Elevated scrutiny    │
│                 │               │               │ with context check   │
└────────────────────────────────────────────────────────────────────────┘
```

**Critical Rule:** Category assignment alone does NOT trigger any blocking action. Even Category_C (extreme accentuation) may be entirely safe in context (bodybuilder competition, anatomical illustration, fashion photography with corset).

## 4. Sexualized Content Reasoning

### 4.1 How Body Ratios Interact with Sexualization

Body ratios become content safety signals only when they combine with other indicators of sexualized presentation. This section defines the multi-signal reasoning framework for sexualization detection through body ratios.

### 4.2 Body Ratio × Clothing Tightness

Clothing tightness determines whether body ratios are visually emphasized or concealed.

```text
REASONING FRAMEWORK: RATIO + CLOTHING

Scenario A: Category_B ratios + Loose clothing
    → Body shape is not visually emphasized
    → Clothing conceals the underlying ratio
    → Risk contribution from ratio: NEGLIGIBLE
    → Example: Curvy person wearing a winter coat

Scenario B: Category_B ratios + Form-fitting clothing
    → Body shape is visible but not exaggerated
    → Clothing reveals natural body contours
    → Risk contribution from ratio: LOW to MODERATE
    → Depends on context (gym = low, provocative photo = moderate)

Scenario C: Category_C ratios + Ultra-tight clothing
    → Body shape is maximally emphasized
    → Tight clothing actively accentuates extreme ratios
    → Risk contribution from ratio: MODERATE to HIGH
    → Context becomes critical (fashion = moderate, explicit = high)

Scenario D: Category_C ratios + Minimal/no clothing
    → Extreme ratios fully visible
    → Maximum visual emphasis on body shape
    → Risk contribution from ratio: HIGH
    → Context check is mandatory before any decision

DECISION RULE:
    Ratio_Risk_Clothing = Base_Ratio_Risk × Clothing_Emphasis_Factor

    WHERE Clothing_Emphasis_Factor:
        Loose/concealing clothing: 0.3
        Standard fit clothing: 0.6
        Form-fitting clothing: 1.0
        Ultra-tight/revealing clothing: 1.4
        No clothing (nude): 1.6
```

### 4.3 Body Ratio × Skin Visibility

The amount of visible skin modifies how much the body ratio contributes to sexualization assessment.

```text
REASONING FRAMEWORK: RATIO + SKIN EXPOSURE

IF body ratio is Category_A (standard range):
    → Skin visibility has standard risk weight
    → No amplification from body ratio

IF body ratio is Category_B (accentuated):
    → High skin visibility on accentuated body areas
      increases sexualization signal
    → Exposed waist/hip/chest areas carry higher weight
      than exposed arms/legs
    → Risk amplification: 1.3x baseline skin risk

IF body ratio is Category_C (extreme):
    → High skin visibility on extremely accentuated areas
      is a strong sexualization signal
    → Risk amplification: 1.8x baseline skin risk
    → UNLESS context provides safe justification

BODY REGION WEIGHTING:
    Exposed arms/lower legs: 1.0x (standard)
    Exposed midriff/waist area: 1.5x when R_WH < 0.75
    Exposed hip/upper thigh area: 1.8x when R_WH < 0.70
    Exposed chest area: 1.6x when R_CW > 1.30
```

### 4.4 Body Ratio × Pose

Pose determines whether body ratios are being actively displayed or are incidental to the subject's activity.

```text
REASONING FRAMEWORK: RATIO + POSE

NEUTRAL POSES (standing, sitting naturally, walking):
    → Body ratios are visible but not emphasized
    → Pose does not call attention to body shape
    → Ratio risk contribution: MINIMAL
    → Example: Person standing at bus stop

ACTIVITY POSES (exercising, working, playing):
    → Body ratios may become visible due to activity
    → The pose serves a functional purpose
    → Ratio risk contribution: LOW
    → Example: Person stretching before a run

DISPLAY POSES (hands on hips, twisting torso, arched back):
    → Body ratios are being actively presented
    → The pose emphasizes body contours
    → Ratio risk contribution: MODERATE to HIGH
    → Must check if it's fashion/modeling context (acceptable)
      or objectifying context (concerning)

EXPLICITLY SEXUALIZED POSES (spread legs, thrust hips, provocative arch):
    → Body ratios are being maximally emphasized
    → The pose is designed to draw attention to body shape
    → Ratio risk contribution: HIGH
    → Context check required: adult entertainment (expected)
      vs. mainstream platform (concerning)

AMPLIFICATION MATRIX:
    Category_A ratio + Display pose = LOW risk
    Category_B ratio + Display pose = MODERATE risk
    Category_C ratio + Display pose = HIGH risk
    Category_B ratio + Sexualized pose = HIGH risk
    Category_C ratio + Sexualized pose = VERY HIGH risk
    Any category + Neutral pose = MINIMAL ratio-based risk
```

### 4.5 Body Ratio × Emotion and Facial Expression

Emotional signals provide intent context for body ratio presentation.

```text
REASONING FRAMEWORK: RATIO + EMOTION

NEUTRAL/HAPPY/PROFESSIONAL EXPRESSION:
    → Body ratio is incidental to the person's state
    → No intent signal from emotion
    → Ratio risk contribution: not modified

SEDUCTIVE/PROVOCATIVE EXPRESSION:
    → Facial expression suggests intentional sexual presentation
    → Combined with accentuated body ratios = stronger signal
    → Ratio risk amplification: 1.4x
    → This combination is one of the clearest multi-signal
      indicators of sexualized content

DISTRESS/DISCOMFORT EXPRESSION:
    → If combined with exposed accentuated body ratios
    → This combination may indicate non-consensual context
    → Elevate concern level regardless of category
    → Requires careful contextual analysis

NO FACE VISIBLE:
    → Cannot assess emotional intent
    → If body ratio is accentuated AND pose is display-oriented
    → AND face is cropped/hidden → may indicate objectifying framing
    → Increase scrutiny by +15%
```

### 4.6 Body Ratio × Gaze Direction

Gaze direction (both of the subject and the implied camera/viewer gaze) provides critical framing context.

```text
REASONING FRAMEWORK: RATIO + GAZE

SUBJECT'S GAZE:
    Looking at camera with neutral expression:
        → Standard portrait/photo behavior
        → No risk modification

    Looking at camera with seductive expression:
        → Direct engagement suggests intentional sexualized presentation
        → Combined with accentuated ratios = stronger signal
        → Risk amplification: 1.3x

    Looking away / candid shot:
        → May indicate voyeuristic capture
        → If body ratios are accentuated AND skin exposure is high
        → AND subject appears unaware of camera
        → Voyeuristic concern flag: +20% risk

CAMERA GAZE (implied by framing):
    Focused on full person (standard framing):
        → No risk modification from framing

    Focused on specific body region (zoomed on waist/hips):
        → Framing emphasizes body ratio
        → This is a strong objectification signal
        → Risk amplification: 1.5x to 2.0x
        → Even standard ratios become concerning when the camera
          deliberately isolates body segments

    Low angle / upskirt angle:
        → Camera position suggests voyeuristic or sexualizing intent
        → Combined with any body ratio = elevated concern
        → Risk amplification: 1.8x
```

### 4.7 Body Ratio × Scene Context

Context is the single most powerful modifier of body ratio risk.

```text
REASONING FRAMEWORK: RATIO + SCENE

THE SAME BODY RATIO can range from ZERO RISK to CRITICAL
depending entirely on scene context:

    R_WH = 0.68 (Category_B — accentuated)

    In a gym, wearing workout clothes, exercising:
        → ZERO RISK — completely normal athletic context
    In a fashion photoshoot, wearing designer clothes, posed:
        → LOW RISK — expected in fashion context
    In a selfie, wearing casual clothes, neutral pose:
        → ZERO RISK — normal personal photo
    In a bedroom, wearing lingerie, seductive pose:
        → MODERATE to HIGH RISK — sexualized content
    On a known adult platform, minimal clothing, explicit pose:
        → HIGH RISK — adult content classification
    Combined with child proportions in any context:
        → CRITICAL — child protection protocols activated

CONTEXT IS THE ARBITER. Ratios provide measurement.
Context provides meaning.
```

## 5. Child Protection Framework

### 5.1 Child Body Ratio Indicators

Children (pre-pubescent, approximately ages 2–10) have distinctive body ratios that differ fundamentally from adults:

```text
CHILD BODY RATIO PROFILE:

Waist-to-Hip Ratio (R_WH): 0.90 – 1.00
    → Children have minimal waist-hip differentiation
    → The torso is relatively cylindrical
    → Waist and hip widths are nearly equal

Shoulder-to-Waist Ratio (R_SW): 1.00 – 1.15
    → Narrow, undeveloped shoulders
    → Minimal V-shape to the torso
    → Shoulders barely wider than the waist

Chest-to-Waist Ratio (R_CW): 1.00 – 1.08
    → Chest width nearly identical to waist width
    → No chest-waist differentiation
    → Uniform cylindrical torso shape

VISUAL PATTERN:
    Child torso = relatively uniform cylinder
    ┌──────┐
    │      │ ← Shoulders (barely wider)
    │      │ ← Chest (same width)
    │      │ ← Waist (same width)
    │      │ ← Hips (same width)
    └──────┘

    vs. Adult torso = differentiated curves
    ┌────────┐
    │        │ ← Shoulders (wider)
    └──┬──┬──┘
       │  │   ← Waist (narrower)
    ┌──┴──┴──┐
    │        │ ← Hips (wider, especially female)
    └────────┘
```

**AI Reasoning Rule:** A torso with R_WH > 0.90 AND R_SW < 1.15 AND R_CW < 1.10 is a strong indicator of a pre-pubescent body shape. This signal must be combined with body proportion data (head-to-body ratio, limb lengths from `body_proportion_patterns.md`) to confirm age estimation.

### 5.2 Adolescent Body Ratio Indicators

Adolescents (approximately ages 10–17) show transitional body ratios as puberty reshapes the torso:

```text
ADOLESCENT BODY RATIO PROFILE:

Early Adolescent (10–13):
    R_WH: 0.85 – 0.95 (waist-hip differentiation beginning)
    R_SW: 1.10 – 1.25 (shoulders widening, especially males)
    R_CW: 1.05 – 1.15 (chest beginning to differentiate)

Late Adolescent (14–17):
    R_WH: 0.75 – 0.90 (approaching adult ranges)
    R_SW: 1.15 – 1.40 (significant shoulder development)
    R_CW: 1.10 – 1.25 (clear chest-waist differentiation)

CRITICAL CHALLENGE:
    Late adolescent ratios OVERLAP significantly with adult ratios.
    A 15-year-old may have body ratios identical to a 22-year-old.
    Therefore: body ratios ALONE cannot reliably distinguish
    late adolescents from young adults.

    → Must cross-reference with body proportions (height ratios)
    → Must cross-reference with face analysis
    → Must cross-reference with context
    → When ambiguity persists: DEFAULT TO PROTECTION
```

### 5.3 Adult Body Ratio Indicators

Adults (18+) show fully differentiated body ratios:

```text
ADULT BODY RATIO PROFILE:

Adult Female (typical ranges):
    R_WH: 0.67 – 0.85
    R_SW: 1.10 – 1.35
    R_CW: 1.10 – 1.30
    → Clear waist-hip differentiation
    → Moderate shoulder-waist differentiation

Adult Male (typical ranges):
    R_WH: 0.85 – 0.98
    R_SW: 1.20 – 1.55
    R_CW: 1.15 – 1.40
    → Less waist-hip differentiation than female
    → Greater shoulder-waist differentiation (V-shape)

Athletic Adults:
    → Ratios may be more extreme due to muscle development
    → Very broad shoulders + narrow waist = high R_SW (up to 1.60+)
    → This is natural and should NOT be flagged as exaggeration
    → Athletic context confirmation resolves any ambiguity
```

### 5.4 Age-Estimation Support Through Ratios

Body ratios contribute to age estimation as a supporting signal, not a primary classifier:

```text
AGE ESTIMATION CONTRIBUTION:

Body ratios provide MODERATE confidence for:
    → Confirming pre-pubescent status (undifferentiated torso = child signal)
    → Confirming post-pubertal status (clearly differentiated torso = adult signal)

Body ratios provide LOW confidence for:
    → Distinguishing early adolescents from older children
    → Distinguishing late adolescents from young adults

CONFIDENCE-BASED AGE SUPPORT:

    IF R_WH > 0.92 AND R_SW < 1.12 AND R_CW < 1.08:
        → Age_Support_Signal: LIKELY PRE-PUBESCENT
        → Confidence: HIGH (0.75 – 0.90)
        → Combined with proportion data → strong age estimate

    IF R_WH 0.80–0.92 AND R_SW 1.12–1.30:
        → Age_Support_Signal: TRANSITIONAL (adolescent range)
        → Confidence: LOW (0.30 – 0.50)
        → Ratios alone insufficient — need multi-signal confirmation

    IF R_WH < 0.80 AND/OR R_SW > 1.30:
        → Age_Support_Signal: LIKELY POST-PUBERTAL
        → Confidence: MODERATE (0.55 – 0.75)
        → Consistent with adult but does not exclude older adolescent
```

### 5.5 Child Protection Decision Rules

```text
RULE 1: CHILD RATIOS + SEXUALIZATION = CRITICAL
    If body ratios indicate a pre-pubescent torso shape
    AND any sexualization signal is present (clothing, pose,
    context, framing):
        → CRITICAL — Maximum protection response
        → No exceptions, no context overrides
        → This combination must NEVER pass through the safety system

RULE 2: CHILD RATIOS + AGE-INAPPROPRIATE CLOTHING = ELEVATED
    If body ratios indicate a child torso shape
    AND clothing is adult-styled (lingerie, provocative fashion):
        → ELEVATED — Immediate scrutiny
        → Even without explicit sexualized pose
        → Age-inappropriate clothing on a child body is itself a signal

RULE 3: AMBIGUOUS RATIOS DEFAULT TO PROTECTION
    If body ratios fall in the adolescent transition range
    AND content contains any risk signal:
        → Default to treating the subject as a potential minor
        → Over-protection is ALWAYS preferable to under-protection

RULE 4: PREVENT MISCLASSIFICATION IN BOTH DIRECTIONS
    Prevent adult → child misclassification:
        → Petite adults, people with dwarfism, and ectomorphic
          builds may have child-like R_WH values
        → Cross-reference with face analysis and context
        → Adult face + adult context overrides ratio-based child signal

    Prevent child → adult misclassification:
        → Early-developing adolescents may have adult-like R_WH values
        → This is the MORE DANGEROUS error
        → Cross-reference with proportions (head-to-body ratio is
          more reliable for age) and context
        → When uncertain: PROTECT
```

## 6. Context-Aware Interpretation

### 6.1 The Context Principle

The same body ratio measurements produce fundamentally different risk assessments depending on context. AI must never evaluate ratios in isolation.

### 6.2 Context-Specific Interpretation Matrix

#### 6.2.1 Gym / Fitness Context

```text
CONTEXT: Gym, fitness studio, home workout
TYPICAL RATIOS: Category_A to Category_B (athletic builds common)

AI REASONING:
    → Athletic body ratios are EXPECTED and NORMAL in gym context
    → Tight-fitting workout clothing is STANDARD gym attire
    → Accentuated R_SW (broad shoulders) = athletic build, not exaggeration
    → Low R_WH (narrow waist) on fit individual = natural, not manipulated
    → Risk adjustment: -35% to -50% from baseline

CONTEXTUAL CONFIRMATIONS NEEDED:
    → Gym equipment visible (weights, machines, mats)
    → Athletic wear (sports bra, leggings, tank top — not lingerie)
    → Exercise activity in progress or recently completed
    → Other gym-goers or fitness-related elements

WATCH FOR:
    → "Gym selfie" framing that emphasizes body over activity
    → Suggestive poses that are not exercise-related
    → Camera angles focused on specific body parts, not the workout
    → Content marketed as fitness but framed as sexualized
```

#### 6.2.2 Beach / Pool Context

```text
CONTEXT: Beach, swimming pool, water park, lakeside
TYPICAL RATIOS: Full natural range visible due to swimwear

AI REASONING:
    → Swimwear reveals body ratios that are normally covered
    → Beach/pool context normalizes high skin exposure
    → Family beach settings are different from "bikini model" content
    → Risk adjustment varies by sub-context:
        Family beach/pool: -40% to -55%
        Individual beach photos: -15% to -25%
        Swimwear modeling: -5% to -15%
        Suggestive beach content: no adjustment

CONTEXTUAL CONFIRMATIONS:
    → Water, sand, or pool visible
    → Recreational activities (swimming, playing, sunbathing)
    → Multiple people in similar attire (normalizing signal)
    → Family indicators (children, mixed age groups)

WATCH FOR:
    → Zoomed-in framing of body areas
    → Voyeuristic camera angles
    → Children at the beach with inappropriate framing
    → Solo shots emphasizing body ratios over location/activity
```

#### 6.2.3 Sports / Athletics Context

```text
CONTEXT: Professional or amateur sports competition, training
TYPICAL RATIOS: Extreme athletic builds common (Category_B to Category_C)

AI REASONING:
    → Athletes frequently have extreme body ratios due to training
    → Bodybuilders may have R_SW > 1.60 naturally
    → Gymnasts, swimmers, and dancers have accentuated R_WH
    → Athletic competition clothing is regulation, not provocative
    → Risk adjustment: -40% to -55%

CONTEXTUAL CONFIRMATIONS:
    → Sports equipment, playing field, competition venue
    → Athletic performance activity (not posing)
    → Regulation athletic wear (leotards, swimsuits, track uniforms)
    → Audience, judges, or competition markers visible

SPECIAL CASE — YOUTH SPORTS:
    → Young athletes may have developing body ratios
    → Standard sports photography of youth athletes is SAFE
    → BUT: voyeuristic framing of young athletes is CRITICAL risk
    → Camera angle and focus are the decisive signals, not the ratios
```

#### 6.2.4 Education / Academic Context

```text
CONTEXT: Classroom, textbook, educational content, anatomy lesson
TYPICAL RATIOS: All ranges possible in educational content

AI REASONING:
    → Educational context provides strong safe justification
    → Anatomy textbooks display body ratios for academic purposes
    → Biology/health education materials are protected content
    → Risk adjustment: -45% to -60%

CONTEXTUAL CONFIRMATIONS:
    → Academic formatting (textbook layout, diagrams, labels)
    → Scientific or medical terminology
    → Educational institution branding or context
    → Teaching/instructional framing
```

#### 6.2.5 Medical / Clinical Context

```text
CONTEXT: Medical examination, clinical documentation, health assessment
TYPICAL RATIOS: All ranges — medical context covers all body types

AI REASONING:
    → Medical context has the STRONGEST safe justification
    → Body ratios may be the subject of medical assessment
      (waist-to-hip ratio is a clinical health indicator)
    → Clinical documentation requires accurate body representation
    → Risk adjustment: -50% to -65%

CONTEXTUAL CONFIRMATIONS:
    → Medical equipment or clinical environment
    → Clinical terminology and professional formatting
    → Healthcare professional presence or references
    → Diagnostic or treatment context

IMPORTANT: Medical context does NOT override child protection
    → Even in medical context, sexualized presentation of
      children is NEVER acceptable
    → Medical child content should be clinical, not sexualized
```

#### 6.2.6 Fashion / Modeling Context

```text
CONTEXT: Fashion photography, runway, clothing catalog, editorial
TYPICAL RATIOS: Wide range — fashion embraces diverse body types

AI REASONING:
    → Fashion context normalizes posed body presentation
    → Models may have accentuated ratios (industry selection bias)
    → Clothing design can visually alter body ratios
      (corsets narrow waist, padded shoulders widen shoulders)
    → Risk adjustment: -15% to -30%

WATCH FOR:
    → Fashion framing used to disguise sexualized content
    → Young/adolescent models in adult fashion contexts
    → "Fashion" labels on what is effectively provocative imagery
    → The gap between legitimate fashion and exploitative content
      requires careful multi-signal analysis
```

#### 6.2.7 Family Photography Context

```text
CONTEXT: Family photos, personal albums, social media family posts
TYPICAL RATIOS: Natural population range

AI REASONING:
    → Family context strongly normalizes natural body ratios
    → Multiple generations visible = strong family signal
    → Casual, unposed photography = low risk
    → Risk adjustment: -35% to -50%

CONTEXTUAL CONFIRMATIONS:
    → Multiple family members visible (especially mixed ages)
    → Casual, everyday settings (home, park, restaurant)
    → Natural, unposed behavior
    → Family event indicators (birthday, holiday, gathering)
```

#### 6.2.8 Historical Art / Classical Art Context

```text
CONTEXT: Museum, art gallery, art history, classical painting/sculpture
TYPICAL RATIOS: Varied — artists exaggerated proportions throughout history

AI REASONING:
    → Art frequently uses exaggerated or idealized body ratios
    → Venus figures, classical sculpture, Renaissance painting
      all feature accentuated body ratios
    → Artistic context provides strong safe justification
    → Risk adjustment: -35% to -55%

EXCEPTIONS:
    → Art with child-like figures in sexualized compositions
      still requires scrutiny
    → Contemporary art that uses "artistic" framing to present
      sexualized content requires evaluation
    → Drawn/illustrated child exploitation is NOT protected by
      artistic context
```

### 6.3 Context Risk Adjustment Summary Table

| Context | Risk Adjustment | Condition |
|---------|----------------|-----------|
| Medical / Clinical | -50% to -65% | Confirmed clinical environment and terminology |
| Education / Academic | -45% to -60% | Confirmed educational context and formatting |
| Sports / Competition | -40% to -55% | Confirmed athletic activity and regulation attire |
| Family Beach / Pool | -40% to -55% | Family setting with mixed ages, recreational |
| Gym / Fitness | -35% to -50% | Confirmed gym environment and exercise activity |
| Family Photography | -35% to -50% | Multi-generational, casual, natural setting |
| Historical / Classical Art | -35% to -55% | Museum/gallery context, historical artwork |
| Fashion / Professional | -15% to -30% | Confirmed professional fashion context |
| Unknown / No Context | +10% to +20% | No contextual information available |
| Suggestive Text Overlay | +20% to +35% | Provocative captions or text on image |
| Known Adult Platform | +25% to +45% | Platform associated with adult content |
| Sexualized Framing | +30% to +50% | Camera work and composition emphasizes body |

## 7. Multi-Signal Risk Framework

### 7.1 Weighted Reasoning System

Body ratios are ONE component in a multi-signal risk assessment. The following framework defines how body ratio risk integrates with other signals:

```text
BODY RATIO RISK CONTRIBUTION:

Step 1: Calculate Base Ratio Risk (BRR)
    Category_A ratios: BRR = 0.00 – 0.10
    Category_B ratios: BRR = 0.10 – 0.30
    Category_C ratios: BRR = 0.30 – 0.55
    Anatomically impossible ratios: BRR = 0.55 – 0.75

Step 2: Apply Context Modifier
    BRR_contextual = BRR × (1.0 + Context_Adjustment)
    (Context_Adjustment ranges from -0.65 to +0.50 per §6.3)

Step 3: Apply Multi-Signal Amplification
    BRR_final = BRR_contextual × Signal_Combination_Factor

    WHERE Signal_Combination_Factor accounts for:
        Clothing emphasis: ×0.3 to ×1.6 (per §4.2)
        Skin visibility: ×1.0 to ×1.8 (per §4.3)
        Pose emphasis: ×1.0 to ×2.0 (per §4.4)
        Emotion signal: ×1.0 to ×1.4 (per §4.5)
        Gaze signal: ×1.0 to ×2.0 (per §4.6)
```

### 7.2 Composite Safety Score Integration

The body ratio module's final risk score feeds into the overall SafeNet composite:

```text
Overall_Safety_Score =
    (Body_Ratio_Risk × 0.12) +
    (Body_Proportion_Risk × 0.18) +
    (Clothing_Risk × 0.15) +
    (Skin_Visibility_Risk × 0.18) +
    (Pose_Risk × 0.13) +
    (Context_Risk × 0.12) +
    (Scene_Risk × 0.07) +
    (Emotion_Risk × 0.05)

NOTE: Body RATIOS carry LESS weight than body PROPORTIONS
because ratios are shape descriptors (indicate sexualization)
while proportions are age indicators (indicate child safety).
Age-based risks are always weighted higher than shape-based risks.

CRITICAL OVERRIDES:
    IF Body_Ratio indicates child-like shape (pre-pubescent)
    AND ANY sexualization signal is present:
        → Override composite → Set to CRITICAL
        → Ratio module escalates to proportion module for
          age confirmation

    IF Body_Ratio indicates extreme exaggeration (anatomically impossible)
    AND AI-generation markers are present:
        → Flag as AI-generated content
        → If sexualized: ELEVATED risk
        → If combined with child signals: CRITICAL
```

### 7.3 Multi-Signal Combination Matrix

| Body Ratio | Clothing | Skin Exposure | Pose | Context | Combined Assessment |
|-----------|---------|--------------|------|---------|-------------------|
| Standard | Modest | Low | Neutral | Professional | ✅ SAFE — no signals |
| Standard | Swimwear | High | Standing | Beach | ✅ SAFE — contextual |
| Accentuated | Tight workout | Moderate | Exercise | Gym | ✅ SAFE — athletic |
| Accentuated | Form-fitting | Moderate | Display | Fashion | 🟡 LOW — fashion context |
| Accentuated | Revealing | High | Suggestive | Bedroom | 🔴 HIGH — sexualized |
| Extreme | Lingerie | High | Provocative | Studio | 🔴 HIGH — explicit |
| Extreme | None | Full | Explicit | Adult site | 🔴 VERY HIGH — adult content |
| Child-like | Any revealing | Any | Any suggestive | Any | 🚫 CRITICAL — protection |
| Impossible | Sexualized | Any | Any | Any | 🔴 HIGH — AI-gen + sexualized |

## 8. False Positive Prevention

### 8.1 Why False Positives in Body Ratio Analysis Occur

Body ratio analysis can generate false positives when:
- Natural body diversity is misinterpreted as exaggeration.
- Athletic or muscular builds trigger accentuation flags.
- Clothing artificially alters visible body ratios.
- Camera angles distort apparent body shape.
- Cultural dress or uniforms change apparent ratios.

### 8.2 False Positive Scenarios and Mitigations

#### 8.2.1 Athletes and Fitness Professionals

**Scenario:** A competitive swimmer or bodybuilder has naturally extreme R_SW (very broad shoulders, narrow waist) that triggers Category_C classification.

```text
MITIGATION:
    IF Category_C ratios detected AND:
        → Athletic context confirmed (gym, competition, training)
        → Athletic wear confirmed (regulation sportswear)
        → Activity is exercise/sport-related
        → Body ratios are bilaterally symmetric (natural, not manipulated)
    THEN:
        → Reclassify as "Athletic Build — Category_A Equivalent"
        → Apply athletic context risk adjustment (-40% to -55%)
        → The person's natural body type is NOT a risk signal

    REASONING: A bodybuilder with R_SW = 1.65 is within the natural
    range for that body type. Flagging this would be punishing
    people for their physical characteristics.
```

#### 8.2.2 Swimmers and Divers

**Scenario:** Swimmers in competition swimwear have fully visible body ratios with high skin exposure.

```text
MITIGATION:
    IF accentuated ratios detected AND:
        → Swimming/diving context confirmed (pool, ocean, competition)
        → Regulation swimwear confirmed (not suggestive fashion swimwear)
        → Athletic activity context (competition, training, recreation)
    THEN:
        → Apply sports context adjustment
        → Skin exposure is normalized by aquatic sports context
        → Risk from ratio: NEGLIGIBLE

    SPECIAL ATTENTION: Youth swimming competitions
        → Same mitigation applies for age-appropriate context
        → Standard sports photography of youth swimmers is SAFE
        → BUT: voyeuristic framing of young swimmers = CRITICAL
```

#### 8.2.3 Dancers and Performers

**Scenario:** Ballet dancers, contemporary dancers, and performers wear form-fitting costumes that reveal body ratios.

```text
MITIGATION:
    IF accentuated ratios detected AND:
        → Dance/performance context confirmed (stage, studio, rehearsal)
        → Performance costume confirmed (leotard, dance wear, costume)
        → Artistic performance activity (dancing, rehearsing, performing)
    THEN:
        → Apply performance context adjustment (-30% to -45%)
        → Dance costumes are functional, not provocative
        → Body ratios visible through dance wear are contextually normal

    WATCH: "Dance" content that is actually suggestive/provocative
        → Legitimate dance has choreographic purpose
        → Provocative "dance" with no artistic structure is different
        → Assess choreographic coherence as a contextual signal
```

#### 8.2.4 Medical Examination Documentation

**Scenario:** Clinical photographs for medical records or textbooks show body ratios in a medical context.

```text
MITIGATION:
    IF any body ratios detected AND:
        → Medical/clinical context confirmed
        → Clinical environment or formatting
        → Professional medical purpose evident
    THEN:
        → Apply maximum safe adjustment (-50% to -65%)
        → Medical documentation of body measurements is clinical
        → R_WH is an actual clinical health metric (WHO uses it
          for cardiovascular risk assessment)
        → Medical context produces ZERO ratio-based risk
```

#### 8.2.5 Fitness Education Content

**Scenario:** A fitness instructor creates educational content about body composition, body types, or exercise techniques, showing body measurements.

```text
MITIGATION:
    IF accentuated ratios in educational fitness content AND:
        → Educational formatting (tutorial, instruction, demonstration)
        → Fitness terminology and techniques discussed
        → Instructor role clearly established
    THEN:
        → Apply educational context adjustment (-35% to -50%)
        → Body ratio visibility serves educational purpose
        → Risk contribution: MINIMAL
```

#### 8.2.6 Anatomy Education and Art References

**Scenario:** Art students or anatomy students study body ratios as part of their education.

```text
MITIGATION:
    IF body ratio content in educational/artistic context AND:
        → Academic or artistic learning environment
        → Reference materials (anatomy textbooks, art reference books)
        → Educational purpose clearly established
    THEN:
        → Apply educational context adjustment (-40% to -55%)
        → Studying body ratios is a legitimate academic activity
        → Art reference models and anatomical diagrams are educational
```

#### 8.2.7 Clothing-Induced Ratio Changes

**Scenario:** Certain clothing (corsets, padded shoulders, high-waisted skirts) artificially changes apparent body ratios, making natural body shapes appear as Category_B or Category_C.

```text
MITIGATION:
    IF accentuated ratios detected BUT:
        → Clothing type known to alter body ratios is detected
        → (Corsets, structured garments, padded clothing)
        → AND underlying skeletal landmarks suggest standard body shape
    THEN:
        → Distinguish between actual body ratio and clothing-modified ratio
        → The clothing-modified ratio may be of interest to
          the clothing module, but should NOT be treated as
          evidence of body-based risk
        → If skeletal landmarks indicate Category_A body under
          Category_C clothing → risk assessment should use Category_A
```

### 8.3 False Positive Prevention — Decision Tree

```text
Body ratio triggers Category_B or Category_C
│
├── Is the person in an athletic context?
│   ├── YES → Are ratios consistent with athletic body type?
│   │         ├── YES → Reclassify as Athletic Build → LOW risk
│   │         └── NO → Continue evaluation
│   └── NO → Continue
│
├── Is the person in a medical/educational context?
│   ├── YES → Apply maximum safe context adjustment → MINIMAL risk
│   └── NO → Continue
│
├── Is the ratio altered by clothing?
│   ├── YES → Use skeletal-based ratio, not clothing-outline ratio
│   └── NO → Continue
│
├── Is the person's face confirming adult age?
│   ├── YES → Adult body ratios are normal diversity → standard assessment
│   └── NO/AMBIGUOUS → Check body proportions for age
│
├── Is the context clearly non-sexualized?
│   ├── YES → Apply context adjustment → LOW risk
│   └── NO/AMBIGUOUS → Multi-signal evaluation continues
│
└── Do multiple other signals confirm safety?
    ├── YES → FALSE POSITIVE IDENTIFIED → reduce or eliminate ratio risk
    └── NO → Maintain ratio-based risk contribution
```

## 9. False Negative Prevention

### 9.1 How False Negatives Occur in Body Ratio Analysis

False negatives happen when harmful content is NOT flagged because:
1. Body ratios appear within standard ranges but other signals are strongly sexualized.
2. Ratios are deliberately obscured or manipulated to avoid detection.
3. The AI focus on ratios causes it to miss other concerning elements.
4. AI-generated imagery produces realistic ratios on manipulated content.

### 9.2 False Negative Prevention Strategies

#### 9.2.1 Suggestive Clothing on Standard Ratios

**Problem:** A person with Category_A body ratios (standard range) wears highly sexualized clothing. The ratio module sees "no risk" but the overall content is sexualized.

```text
PREVENTION:
    Body ratio module should contribute ZERO RISK for standard ratios.
    This is CORRECT behavior.
    The clothing module, pose module, and context module should
    independently detect the sexualization signals.

    KEY INSIGHT: Not every module needs to flag every concern.
    Standard body ratios with sexualized clothing = the clothing
    module's job, not the ratio module's job.

    However: the ratio module SHOULD note that standard ratios
    combined with deliberately provocative clothing is a pattern
    worth recording for the downstream fusion system.
```

#### 9.2.2 Sexualized Posing That Exaggerates Ratios

**Problem:** Specific poses (arched back, twisted torso, angled hips) visually exaggerate body ratios beyond their neutral-standing measurements.

```text
PREVENTION:
    IF body ratios CHANGE significantly between poses:
        → The change itself is informative
        → A neutral-standing R_WH of 0.82 that becomes 0.68 in
          a specific pose suggests the pose is designed to
          accentuate body shape
        → This dynamic ratio change should increase the pose
          module's risk assessment
        → Ratio module should provide both neutral and posed
          measurements to downstream modules

    REPORT BOTH:
        Ratio_Standing: the body's natural ratio (if available)
        Ratio_Posed: the visually apparent ratio in current pose
        Ratio_Difference: the degree to which posing exaggerates ratios
```

#### 9.2.3 Exaggerated Body Emphasis Through Framing

**Problem:** Camera framing (extreme close-ups, tilted angles, selective focus) emphasizes body ratios even when the ratios themselves are within normal range.

```text
PREVENTION:
    The ratio module should detect FRAMING EMPHASIS:
        → If the image is cropped to show only the torso area
        → If the framing centers on the waist-to-hip region
        → If background blur (bokeh) isolates the body area
    THEN:
        → The framing is drawing attention to body ratios
        → Increase ratio risk contribution by +15% to +25%
        → Even standard ratios become concerning when the entire
          image is composed to emphasize them

    FRAMING EMPHASIS INDICATORS:
        → Torso occupies > 60% of image area → framing emphasis
        → Waist/hip region is in exact center of frame → intentional
        → Depth of field isolates body from background → emphasis
        → Multiple images of same subject from different angles
          all emphasizing body area → pattern of emphasis
```

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
PREVENTION:
    WATCH FOR AI-GENERATION MARKERS IN RATIOS:
        → Perfect bilateral symmetry (real bodies are slightly asymmetric)
        → Ratios that are "too perfect" (exactly matching idealized values)
        → Smooth transitions that lack natural body texture variation
        → Impossible waist sizes (waist narrower than spine could support)

    IF AI-generation suspected AND body ratios are accentuated:
        → Increase scrutiny for sexualized AI-generated content
        → AI-generated sexualized content is higher risk than
          photographed equivalent because:
            a) AI content can be produced at scale
            b) AI content can target specific body types
            c) AI content can be designed to evade detection
            d) AI-generated CSAM is a critical threat

    IF AI-generation suspected AND ratios suggest child-like body:
        → CRITICAL — Potential AI-generated CSAM
        → Immediate maximum protection response
```

```text
CORE FALSE NEGATIVE PREVENTION RULE:

In content safety, false negatives are MORE HARMFUL than false positives.

    False positive: An innocent image is flagged for review
        → Inconvenience, but no one is harmed

    False negative: Harmful content passes through undetected
        → A child may be exploited, a victim may be harmed

Therefore: When the ratio module cannot determine whether content
is safe, it should ALWAYS lean toward flagging for additional review
rather than passing content through without assessment.

This bias toward protection is INTENTIONAL and is a core design
principle of the SafeNet system.
```

```text
EXPLANATION TEMPLATE:

1. WHAT WAS MEASURED:
   "Body ratio analysis detected [R_WH value], [R_SW value], [R_CW value]
    on [subject description]."

2. HOW IT WAS CLASSIFIED:
   "These ratios fall within [Category_A/B/C] range, indicating
    [standard / accentuated / extreme] body shape."

3. WHAT CONTEXT WAS DETECTED:
   "The detected context is [context type], which [increases/decreases]
    the risk assessment by [percentage]."

4. HOW IT COMBINED WITH OTHER SIGNALS:
   "Combined with [clothing type], [pose type], [skin visibility level],
    the multi-signal assessment is [risk level]."

5. WHAT DECISION WAS REACHED:
   "The body ratio module contributes [risk value] to the composite
    safety score. Recommendation: [PASS / MONITOR / REVIEW / BLOCK]."

6. WHY THIS DECISION:
   "This decision was reached because [specific reasoning].
    [If blocking:] The primary concern is [specific concern].
    [If passing:] Safety was confirmed by [specific safe signals]."
```

```text
BODY RATIO ASSESSMENT:
1. MEASURED: R_WH = 0.82, R_SW = 1.28, R_CW = 1.18
2. CLASSIFIED: Category_A (Standard Range)
3. CONTEXT: Gym environment detected (exercise equipment visible,
   athletic wear, exercise activity)
4. SIGNALS: Tight workout clothing, moderate skin exposure,
   exercise pose, neutral expression
5. DECISION: Ratio module contributes 0.03 risk (MINIMAL)
   Recommendation: PASS
6. REASONING: Standard body ratios in confirmed athletic context.
   Tight clothing is contextually appropriate gym attire.
   No sexualization signals detected. Natural body shape in
   appropriate setting.
```

```text
BODY RATIO ASSESSMENT:
1. MEASURED: R_WH = 0.62, R_SW = 1.48, R_CW = 1.35
2. CLASSIFIED: Category_C (Extreme Accentuation)
3. CONTEXT: Bedroom or indoor private setting detected.
   No educational, medical, or athletic context.
4. SIGNALS: Revealing lingerie, high skin exposure,
   provocative arched-back pose, seductive expression,
   direct camera gaze.
5. DECISION: Ratio module contributes 0.58 risk (HIGH)
   Recommendation: REVIEW — likely adult sexualized content
6. REASONING: Extreme body ratios combined with revealing
   clothing, provocative pose, and seductive expression in
   private setting. Multiple signals converge on sexualized
   content classification. Age confirmation needed — if adult
   confirmed, classify as adult content. If age ambiguous,
   escalate to CRITICAL.
```

```text
BODY RATIO ASSESSMENT:
1. MEASURED: R_WH = 0.94, R_SW = 1.08, R_CW = 1.04
2. CLASSIFIED: Child-like torso shape (undifferentiated,
   pre-pubescent profile)
3. CONTEXT: No clear safe context detected.
4. SIGNALS: Age-inappropriate clothing, suggestive pose,
   body proportion module confirms pediatric indicators.
5. DECISION: Ratio module contributes 0.92 risk (CRITICAL)
   Recommendation: BLOCK — child protection triggered
6. REASONING: Body ratios indicate pre-pubescent torso shape
   (R_WH > 0.90, R_SW < 1.12, R_CW < 1.08). Combined with
   age-inappropriate clothing and suggestive pose, this triggers
   maximum child protection response. Body proportion module
   cross-reference confirms pediatric classification.
   No context override is available for sexualized child content.
```

```text
INTEGRATION:
    body_ratio_patterns → body_shape/overview (orchestrator)
        → Ratio classification (Category_A/B/C)
        → Base ratio risk score
        → Age-support signal (child/adolescent/adult body shape)
        → Confidence level

    The orchestrator combines ratio data with:
        → body_proportion_patterns (height-based measurements)
        → silhouette_patterns (outline shape)
        → waist_patterns (waist-specific analysis)
        → visibility_patterns (visibility assessment)
    To produce the complete Morphological Feature Vector.
```

```text
RATIO → CLOTHING INTEGRATION:

1. TIGHTNESS ASSESSMENT:
   Body ratios define the underlying body shape against which
   clothing tightness is measured.
   
   Clothing_Tightness_Index = 1.0 - (Clothing_Width - Body_Width) / Body_Width
   
   → Tightness > 0.75: Ultra-tight → amplifies body ratio visibility
   → Tightness 0.50–0.75: Form-fitting → moderately reveals ratios
   → Tightness < 0.50: Loose → conceals body ratios

2. COVERAGE INTERACTION:
   Which body segments are covered affects ratio risk:
   → Covered waist/hip area → ratio is concealed → lower risk contribution
   → Exposed waist/hip area → ratio is visible → standard risk contribution
   → Tight clothing on high-ratio areas → amplified risk contribution

3. AGE-APPROPRIATENESS:
   Body ratios inform whether clothing is age-appropriate:
   → Child-like ratios + adult lingerie-style clothing = CRITICAL mismatch
   → Adult ratios + age-appropriate clothing = standard assessment

CROSS-REFERENCES:
    → clothing/tightness_indices.md — fabric compression index
    → clothing/suggestive_combinations.md — provocative clothing patterns
    → clothing/coverage_scoring.md — body segment coverage metrics
```

```text
RATIO → SKIN VISIBILITY INTEGRATION:

1. AREA CALCULATION:
   Body ratios help define the expected total body surface area
   against which skin exposure percentage is calculated.
   → Wider hips = larger hip area → more skin surface in that region
   → Narrower waist = smaller waist area → less skin surface in that region

2. RISK WEIGHTING:
   Skin exposure on high-ratio body areas carries different risk weight:
   → Exposed skin on standard-ratio areas: 1.0x base risk
   → Exposed skin on accentuated waist area: 1.4x when R_WH < 0.72
   → Exposed skin on accentuated hip area: 1.5x when R_WH < 0.70
   → Exposed skin on accentuated chest: 1.5x when R_CW > 1.25

3. CHILD PROTECTION AMPLIFICATION:
   If body ratios indicate child-like shape:
   → ALL skin exposure risk is amplified by 2.5x – 3.0x
   → Even modest skin exposure on a child-shaped body carries
     elevated safety weight

CROSS-REFERENCES:
    → skin_visibility/exposed_area_ratio.md — exposure calculations
    → skin_visibility/skin_probability_map.md — skin detection
```

```text
RATIO → POSE INTEGRATION:

1. DYNAMIC RATIO ADJUSTMENT:
   Certain poses alter visible body ratios:
   → Bending forward: compresses torso, changes R_WH appearance
   → Twisting: shifts visible width measurements
   → Arching back: accentuates waist-hip differentiation
   
   The ratio module should provide POSE-ADJUSTED ratios
   when non-neutral poses are detected.

2. POSE INTENT ANALYSIS:
   Body ratios help interpret whether a pose is emphasizing body shape:
   → Accentuated ratio + display pose = body emphasis pattern
   → Standard ratio + neutral pose = no emphasis pattern
   → The COMBINATION determines intent, not either signal alone

3. NATURAL vs. POSED ASSESSMENT:
   → Functional poses (sitting, exercising, working) are natural
   → Display poses (hands on hips, arched back) may be intentional
   → The ratio module should flag when a pose appears designed
     to maximize visible body ratio differentiation

CROSS-REFERENCES:
    → pose/ module — posture classification and intent analysis
```

```text
RATIO → EMOTION INTEGRATION:

1. EXPRESSION-RATIO COMBINATION:
   Facial expression provides intent context for body presentation:
   → Accentuated ratios + seductive expression = sexualization signal
   → Accentuated ratios + professional expression = normal presentation
   → Accentuated ratios + distress expression = potential concern

2. CHILD PROTECTION:
   → Child-like body ratios + any negative emotion (fear, discomfort)
     + any physical exposure = CRITICAL concern
   → Emotional distress on a child-shaped body requires immediate
     protective response

CROSS-REFERENCES:
    → emotion/ module — facial expression and emotional state analysis
```

```text
SCENE → RATIO INTEGRATION:

Scene understanding provides the CONTEXT that determines how
body ratios are interpreted:

1. SCENE CLASSIFICATION:
   → Gym/sports → athletic ratios are expected → safe adjustment
   → Bedroom/intimate → body ratios carry higher weight → elevated scrutiny
   → Professional → body ratios are incidental → minimal weight
   → Public → standard assessment applies

2. ENVIRONMENT OBJECTS:
   Object detection within the scene provides contextual confirmation:
   → Exercise equipment → fitness context → safe adjustment
   → Medical instruments → clinical context → safe adjustment
   → Bedroom furniture + dim lighting → intimate context → higher scrutiny
   → Professional setting objects → business context → safe adjustment

CROSS-REFERENCES:
    → scene_understanding/ module — environment classification
    → context/ module — contextual reasoning and disambiguation
```

```text
CONTEXT → RATIO INTEGRATION:

Context reasoning is the FINAL ARBITER for body ratio interpretation:

1. METADATA CONTEXT:
   → Platform type, content source, and publishing context
   → Educational platform → ratios carry minimal risk
   → Adult content platform → ratios expected in adult context
   → Children's platform → any accentuated body emphasis is concerning

2. TEXT CONTEXT:
   → Accompanying text/captions modify ratio interpretation
   → Medical terminology → clinical context confirmed
   → Sexualized language → confirms sexualized intent
   → Educational language → confirms academic purpose
   → Objectifying language → amplifies body ratio risk

3. TEMPORAL CONTEXT:
   → How does the content fit into a sequence?
   → Progressive exposure (gradual clothing removal) is a pattern
   → The ratio module should track ratio VISIBILITY changes over time
```

```text
RATIO → PARENTAL CONTROL INTEGRATION:

Two parental protection dimensions:

1. CONTENT FILTERING FOR CHILDREN:
   → Body ratios help classify content maturity level
   → Sexualized content with accentuated ratios → block for children
   → Age-appropriate content with standard ratios → allow

2. CHILD DEPICTION PROTECTION:
   → Body ratios help identify when a child may be depicted
   → Child-like body ratios trigger elevated monitoring
   → Parental control systems can use ratio-based age signals
     to flag content depicting children in inappropriate contexts

PARENTAL CONTROL THRESHOLDS:
   → Strictest: Flag any accentuated body ratio content
   → Standard: Flag accentuated ratios + additional risk signal
   → Minimal: Flag only extreme ratios + sexualization confirmation
```

```text
SCENARIO: Retail mannequin with human-like body ratios

REASONING:
    → Mannequins have human body ratios by design
    → Detection cues: perfect stillness (zero micro-tremor),
      uniform skin texture, retail environment context
    → If confirmed non-human: bypass ratio-based risk assessment

EXCEPTION:
    → Hyper-realistic child-sized dolls in sexualized contexts
      should still be flagged — the object's status as "not real"
      does not eliminate the concerning nature of the context
```

```text
SCENARIO: Extensive body paint or tattoos alter skin appearance

REASONING:
    → Body paint/tattoos do not change actual body ratios
    → They may confuse skin detection algorithms
    → Ratio analysis should use skeletal landmarks, not skin color
    → If skin-based measurement fails, fall back to skeletal width

IMPACT ON RISK:
    → Body paint that accentuates body curves (contouring)
      may artificially lower R_WH appearance
    → If paint/tattoo pattern is designed to emphasize body shape,
      this is an additional emphasis signal (+10% risk modifier)
```

```text
SCENARIO: Gym mirror or bathroom mirror duplicates body image

REASONING:
    → Mirror reflections create duplicate body detections
    → The reflection should be identified via depth analysis
      (reflection is on a flat plane behind the subject)
    → Only assess the primary (non-reflected) body

RISK CONSIDERATION:
    → "Mirror selfie" is a common photo type — usually safe
    → Mirror selfie with sexualized pose = assess as sexualized content
    → The mirror does not change the ratio assessment, only the
      number of body instances to analyze
```

```text
SCENARIO: Pregnant person with altered body ratios

REASONING:
    → Pregnancy changes waist width → increases R_WH
    → This is a natural, temporary body change
    → The ratio module should NOT flag pregnancy-related
      ratio changes as anomalies
    → If pregnancy is detected (context, visible pregnancy):
      → Adjust ratio baselines for pregnant body norms
      → Apply pregnancy context as a safe modifier

RISK CONSIDERATION:
    → Pregnancy content is almost always safe
    → Maternity fashion, pregnancy documentation, medical context
    → Exception: sexualized pregnancy content exists but is assessed
      through other signals (pose, clothing, context), not body ratios
```

```text
CAMERA ARTIFACTS AFFECTING BODY RATIOS:

Wide-angle lens (barrel distortion):
    → Edges of frame become stretched
    → Person near edge may appear wider
    → Can artificially lower R_WH (wider hips)
    → Mitigation: compensate for known lens distortion profiles

Telephoto compression:
    → Flattens depth, can compress body width perception
    → May artificially increase R_WH (less differentiation)
    → Lower impact on ratio analysis than wide-angle

Extreme camera angles:
    → Top-down: compresses vertical, widens horizontal → affects all ratios
    → Bottom-up: elongates body, may change perceived ratios
    → Side angle: only one axis of width is measurable
    → Mitigation: estimate camera angle and apply correction matrix

Low resolution:
    → Imprecise width measurements → wider confidence intervals
    → At very low resolution (subject < 150px tall):
      → Ratio confidence drops below usable threshold
      → Module should report "cannot assess" rather than a guess
```

```text
CULTURAL CONSIDERATIONS:

    → Different cultures have different clothing norms
    → Some traditional garments (saris, kimonos, abayas, dashikis)
      alter visible body ratios dramatically
    → The ratio module should recognize that clothing-altered ratios
      are NOT body ratios — they are garment silhouettes
    → When traditional/cultural dress is detected:
      → Use skeletal landmark ratios instead of outline-based ratios
      → Cultural dress context provides strong safe modifier (-30% to -45%)

    → Body ratio norms also vary across populations
    → The system must NOT systematically produce different error rates
      for different ethnic or racial groups
    → Use wide confidence intervals that encompass human diversity
```

```text
CONFIDENCE FORMULA:

C_ratio = (W_skeletal × Avg_Keypoint_Confidence +
           W_segmentation × Segmentation_Quality) ×
          Φ_lighting × Φ_angle × Φ_distance

WHERE:
    W_skeletal = 0.60 (skeletal landmark weight)
    W_segmentation = 0.40 (body outline weight)
    Avg_Keypoint_Confidence = average confidence of shoulder + hip landmarks
    Segmentation_Quality = quality of body outline detection
    Φ_lighting = penalty for poor lighting (< 15 lux → 0.70, else 1.00)
    Φ_angle = penalty for extreme angles (cos(pitch) × cos(yaw))
    Φ_distance = penalty for distance (scales linearly below 600px subject height)

CONFIDENCE THRESHOLDS:
    C_ratio ≥ 0.75: HIGH confidence → full weight in decisions
    C_ratio 0.50–0.74: MODERATE confidence → reduced weight (0.6x)
    C_ratio 0.30–0.49: LOW confidence → minimal weight (0.3x)
    C_ratio < 0.30: UNRELIABLE → report "cannot assess"
                     → do NOT contribute to risk score
                     → do NOT reduce other modules' risk assessments
```

```text
WHEN CONFIDENCE IS TOO LOW TO ASSESS:

    The ratio module MUST clearly communicate uncertainty:

    CORRECT: "Body ratios could not be reliably assessed.
              Confidence: 0.22. Reason: insufficient resolution
              (subject height 98px). This module provides
              NO RISK OPINION for this assessment."

    INCORRECT: "Body ratio risk: 0.00"
               (This implies ratios were assessed and found safe,
                which is NOT what happened)

    The distinction between "assessed and safe" and
    "not assessed" is CRITICAL for downstream modules.
```

```text
INPUT: Social media post — fitness influencer in gym

RATIO ANALYSIS:
    R_WH = 0.71, R_SW = 1.42, R_CW = 1.28
    Category_B (Accentuated Shape)
    Confidence: 0.88 (HIGH)

CONTEXT SIGNALS:
    → Gym environment confirmed (weights, machines visible)
    → Athletic wear (sports bra, leggings)
    → Exercise activity (holding dumbbells, mid-rep)
    → Neutral/focused facial expression
    → Standard photography angle

MULTI-SIGNAL ASSESSMENT:
    Base Ratio Risk: 0.18 (Category_B baseline)
    Context Adjustment: -45% (gym context)
    Clothing Factor: ×0.8 (athletic wear, not provocative)
    Pose Factor: ×0.9 (exercise pose, functional)
    
    Final Ratio Risk: 0.18 × 0.55 × 0.8 × 0.9 = 0.07

DECISION: ✅ SAFE
EXPLANATION: "Accentuated body ratios detected in confirmed gym context.
Athletic wear and exercise activity confirm fitness purpose.
Body ratio contributes minimal risk (0.07). No safety concern."
```

```text
INPUT: AI-generated digital artwork featuring female figure

RATIO ANALYSIS:
    R_WH = 0.48, R_SW = 1.72, R_CW = 1.52
    Category_C (Extreme Accentuation)
    Confidence: 0.82 (HIGH)
    AI-generation markers: detected (perfect symmetry, impossible R_WH)

CONTEXT SIGNALS:
    → No real-world context (digital artwork)
    → Fantasy/sci-fi costume (revealing but stylized)
    → Display pose (hands on hips, facing camera)
    → No face (masked character)

MULTI-SIGNAL ASSESSMENT:
    Base Ratio Risk: 0.50 (Category_C + anatomically impossible)
    Context Adjustment: +15% (no safe context, digital art)
    Clothing Factor: ×1.3 (revealing costume)
    Pose Factor: ×1.2 (display pose)
    AI-generation flag: +0.10

    Final Ratio Risk: 0.50 × 1.15 × 1.3 × 1.2 + 0.10 = 1.00 (capped)

DECISION: 🔴 HIGH — Adult content classification
EXPLANATION: "Anatomically impossible body ratios (R_WH = 0.48) detected
in AI-generated artwork. Ratios exceed human biological limits. Combined
with revealing costume and display pose, content is classified as
sexualized digital art. Age confirmation required — if any child-like
elements are present, escalate to CRITICAL."
```

```text
INPUT: Pediatric health textbook illustration showing child body

RATIO ANALYSIS:
    R_WH = 0.96, R_SW = 1.06, R_CW = 1.03
    Child-like torso shape (undifferentiated)
    Confidence: 0.79 (MODERATE-HIGH)

CONTEXT SIGNALS:
    → Medical textbook formatting confirmed
    → Anatomical labels and clinical terminology present
    → Educational publisher
    → Clinical illustration style (not photographic)
    → No sexualization signals

MULTI-SIGNAL ASSESSMENT:
    Age Signal: LIKELY PRE-PUBESCENT (child ratios confirmed)
    Base Ratio Risk: 0.40 (child-like shape baseline)
    Context Adjustment: -60% (medical/educational context)
    Clothing: N/A (anatomical illustration)
    Pose: Neutral anatomical reference pose

    Final Ratio Risk: 0.40 × 0.40 = 0.16

DECISION: ✅ SAFE — Medical educational content
EXPLANATION: "Child-like body ratios detected in confirmed medical
textbook context. Pediatric anatomical illustration with clinical
terminology and educational formatting. Medical educational context
provides strong safe justification. No sexualization signals present.
Risk: minimal."
```

```text
INPUT: Social media image — young person in revealing clothing

RATIO ANALYSIS:
    R_WH = 0.86, R_SW = 1.18, R_CW = 1.12
    Transitional range (early adolescent to young adult overlap)
    Confidence: 0.85 (HIGH)

CONTEXT SIGNALS:
    → Home/bedroom environment
    → Revealing clothing (crop top, short shorts)
    → Mirror selfie pose
    → Neutral facial expression
    → No clear adult or child context indicators

MULTI-SIGNAL ASSESSMENT:
    Age Signal: AMBIGUOUS — ratios in transitional range
    Body Proportion Cross-Check: ambiguous (proportions also transitional)
    Face Analysis: youthful features, age 14–20 estimated range
    Base Ratio Risk: 0.15 (transitional range)
    Context Adjustment: +15% (private setting, no safe context)
    Clothing Factor: ×1.2 (revealing clothing)
    
    Final Ratio Risk: 0.15 × 1.15 × 1.2 = 0.21

    BUT: Age is ambiguous → Protective default activated
    Age-Adjusted Risk: 0.21 × 1.8 (ambiguous age multiplier) = 0.38

DECISION: 🟡 MODERATE — Elevated monitoring, possible review
EXPLANATION: "Body ratios fall in adolescent-to-young-adult transitional
range. Age cannot be confidently determined. Revealing clothing in private
setting without clear safe context. Due to age ambiguity, protective
default is applied (treat as potential minor until age confirmed).
Recommendation: flag for age verification review if platform supports it."
```

```text
RULE 1: RATIOS NEVER BLOCK ALONE
    A body ratio measurement, regardless of how extreme, must
    NEVER be the sole reason for blocking content. Body ratios
    require at least 2 additional confirming signals (clothing,
    pose, skin exposure, context) before contributing to a
    blocking decision.

RULE 2: CONTEXT IS MANDATORY
    Every body ratio assessment MUST include context evaluation.
    Ratios without context are meaningless for content safety.
    "No context available" is itself a context signal (+10-20% risk).

RULE 3: CHILD-LIKE RATIOS ESCALATE TO PROPORTION MODULE
    When body ratios indicate a pre-pubescent torso shape,
    the module MUST escalate to body_proportion_patterns for
    age confirmation through height-based analysis.
    Ratio-based child detection is a TRIGGER, not a conclusion.

RULE 4: NATURAL BODY DIVERSITY IS NEVER PENALIZED
    The system must never treat a person's natural body type
    as inherently risky. Risk comes from PRESENTATION (how the body
    is shown) not POSSESSION (what body type exists).

RULE 5: EXPLAIN EVERY DECISION
    Every risk score MUST include a human-readable explanation.
    Unexplained risk values are system failures.

RULE 6: CONFIDENCE GATES ALL DECISIONS
    Risk assessments from the ratio module are weighted by confidence.
    Low-confidence measurements should have proportionally low
    influence on final decisions.

RULE 7: AI-GENERATED CONTENT GETS NO PASS
    AI-generated anatomically impossible ratios combined with
    sexualization receive the same treatment as photographic content.
    The generation method does not reduce the harm.

RULE 8: ABSENCE OF DATA ≠ ABSENCE OF RISK
    When ratios cannot be assessed (low resolution, heavy occlusion,
    loose clothing), this means "unknown risk" not "zero risk."
    Other modules' assessments remain fully valid.
```

```text
BODY RATIO MODULE WEIGHT IN FINAL DECISION:

    Standard content (no risk signals): 8–12% of final score
    Content with moderate risk signals: 12–18% of final score
    Content with sexualization signals: 15–22% of final score
    Content involving potential minors: 10–15% of final score
        (proportion module carries higher weight for age assessment;
         ratio module provides supporting shape signal only)

    The ratio module weight INCREASES as sexualization signals increase
    because body shape emphasis is a key component of sexualized content.

    The ratio module weight DECREASES relative to the proportion module
    when child protection is the primary concern, because proportions
    (height ratios) are more reliable for age estimation than
    ratios (width measurements).
```