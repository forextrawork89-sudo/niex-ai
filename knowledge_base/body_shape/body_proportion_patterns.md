# Body Proportion Patterns — AI Reasoning Knowledge Base

## 1. Document Metadata

*   **Module Identifier:** `body_proportion_reasoning_v3`
*   **Knowledge Base Class:** KB-BS-PROPORTION-REASONING
*   **Version:** 3.0.0
*   **System Context:** SafeNet Content Safety — On-Device AI Reasoning Layer
*   **Last Review:** June 24, 2026
*   **Purpose:** Defines how AI should reason about human body proportions for content safety, child protection, sexualization detection, and false-positive prevention.

---

## 2. Purpose and Scope

### 2.1 What This Document Defines

This document provides the **reasoning framework** for how AI should interpret, classify, and act on human body proportions in images and video. It answers the question:

> **"How should AI reason about body proportions to protect children and detect sexualized content?"**

Body proportions are one of the strongest anatomical indicators for:
- **Age estimation** — Children, adolescents, and adults have structurally different body ratios.
- **Sexualization detection** — Exaggerated or distorted proportions are a common signal of sexualized intent.
- **Content authenticity** — AI-generated content often produces anatomically impossible proportions.
- **Context disambiguation** — The same proportions mean different things in different contexts (sports, medical, art, fashion).

### 2.2 What This Document Does NOT Define

- Implementation-specific code or runtime engines.
- GPU shader pipelines or WebAssembly binaries.
- Unit test frameworks or performance benchmarks.
- Memory allocation strategies.

Those concerns belong in engineering specification documents, not in the knowledge base.

### 2.3 Relationship to Other Knowledge Base Modules

Body proportion reasoning operates as a **foundational signal** that feeds into and is modified by multiple downstream modules:

```text
                    ┌─────────────────────┐
                    │  body_proportion     │
                    │  (THIS DOCUMENT)     │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │  clothing/   │   │skin_visibility│   │    pose/     │
   │  tightness   │   │  exposure     │   │  posture     │
   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
          │                  │                    │
          ▼                  ▼                    ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │   emotion/   │   │  context/    │   │scene_under-  │
   │  expression  │   │  reasoning   │   │  standing    │
   └──────────────┘   └──────────────┘   └──────────────┘
```

**Key principle:** Body proportions alone are NEVER sufficient for a content safety decision. They must always be evaluated in combination with clothing, skin visibility, pose, context, and scene understanding.

---

## 3. Human Body Proportion Fundamentals

### 3.1 The Head-to-Body Ratio as a Universal Scale

The human head serves as the most reliable internal reference unit for body proportion analysis. Across all ages and body types, the head provides a consistent, self-contained measurement standard.

| Age Group | Approximate Head-to-Body Ratio | Description |
|-----------|-------------------------------|-------------|
| Newborn (0–1 year) | 1:4 | Head is approximately 1/4 of total body height |
| Toddler (1–3 years) | 1:4.5 | Slight lengthening of limbs begins |
| Young child (3–6 years) | 1:5 | Torso begins elongating relative to head |
| Older child (6–10 years) | 1:6 | Limbs lengthen noticeably, head becomes proportionally smaller |
| Pre-adolescent (10–13 years) | 1:6.5 | Growth spurt begins, legs elongate rapidly |
| Adolescent (13–17 years) | 1:7 | Approaching adult proportions but still transitioning |
| Adult (18+ years) | 1:7.5 to 1:8 | Fully mature skeletal proportions |

**AI Reasoning Rule:** A head-to-body ratio significantly above 1:6 (i.e., larger head relative to body) is a strong anatomical indicator that the subject may be a child or adolescent. This signal should increase the sensitivity of all downstream safety checks.

### 3.2 Core Anatomical Ratios

The following ratios form the primary measurement vocabulary used throughout the reasoning framework:

#### 3.2.1 Torso-to-Femur Ratio (R_TF)

The ratio of torso length (shoulder midpoint to hip midpoint) versus upper leg length (hip to knee).

| Classification | R_TF Range | Reasoning |
|---------------|-----------|-----------|
| Pediatric | 1.30 – 1.60+ | Children have proportionally longer torsos and shorter legs |
| Adolescent | 1.15 – 1.35 | Transitional — legs are elongating but torso is still relatively long |
| Standard Adult | 1.00 – 1.20 | Mature proportions with balanced torso-to-leg ratio |
| Atypical / Anomalous | < 0.85 or > 1.65 | May indicate AI-generated content, artistic distortion, or measurement error |

#### 3.2.2 Head-to-Torso Ratio (R_HT)

The ratio of head height (crown to chin approximation) versus torso length.

| Classification | R_HT Range | Reasoning |
|---------------|-----------|-----------|
| Pediatric | 0.38 – 0.50+ | Large head relative to short torso — strong child indicator |
| Adolescent | 0.28 – 0.38 | Head becoming proportionally smaller as torso elongates |
| Standard Adult | 0.20 – 0.28 | Mature ratio — head is roughly 1/4 to 1/5 of torso |

#### 3.2.3 Arm-to-Torso Ratio (R_AT)

Upper arm length (shoulder to elbow) relative to torso length.

| Classification | R_AT Range | Reasoning |
|---------------|-----------|-----------|
| Pediatric | 0.45 – 0.55 | Arms are proportionally short relative to torso |
| Standard Adult | 0.60 – 0.75 | Arms have elongated to mature proportions |

#### 3.2.4 Shoulder-to-Hip Width Ratio (R_SH)

Shoulder width relative to hip width — differs significantly by biological sex and age.

| Classification | R_SH Range | Notes |
|---------------|-----------|-------|
| Pre-pubescent child | 0.95 – 1.10 | Nearly equal shoulder and hip widths |
| Adult female (typical) | 1.05 – 1.25 | Slightly broader shoulders than hips |
| Adult male (typical) | 1.20 – 1.50 | Noticeably broader shoulders |
| Exaggerated / Stylized | > 1.60 or < 0.85 | May indicate artistic exaggeration or AI distortion |

### 3.3 Growth Plate Transitions — Key Reasoning Milestones

AI must understand that body proportions do not change linearly. There are specific developmental milestones where proportions shift dramatically:

1. **Birth to 2 years:** Head is disproportionately large. Limbs are very short. Torso is dominant.
2. **Ages 2–6:** Gradual limb elongation. The "toddler silhouette" — round belly, short limbs — begins fading.
3. **Ages 6–10:** Legs grow faster than the torso. The child begins looking less "top-heavy."
4. **Ages 10–14 (puberty onset):** Rapid and asymmetric growth. Growth plates in the legs activate first, creating a gangly appearance. Hip and shoulder widths begin differentiating by sex.
5. **Ages 14–18:** Proportions approach adult norms. Shoulder-to-hip ratio reaches its adult trajectory.
6. **Ages 18–25:** Final skeletal maturation. Proportions stabilize.

**AI Reasoning Rule:** During puberty (ages 10–14), proportion analysis has the highest error rate because proportions change rapidly and unevenly. AI should widen its uncertainty bands during this age range and rely more heavily on multi-signal fusion (face analysis, context, clothing) rather than proportions alone.

## 4. Age-Related Proportion Analysis

### 4.1 Pediatric Proportion Indicators

When AI detects the following combination of proportion signals, it should significantly increase the probability that the subject is a child:

**Strong Pediatric Indicators (each increases child probability by +15 to +25%):**
- Head-to-body ratio ≥ 1:6 (large head relative to body)
- Torso-to-femur ratio ≥ 1.35 (short legs relative to torso)
- Head-to-torso ratio ≥ 0.38 (large head relative to torso)
- Shoulder-to-hip width ratio between 0.95 and 1.10 (undifferentiated body frame)
- Arm-to-torso ratio ≤ 0.55 (short arms relative to torso)

**Moderate Pediatric Indicators (each increases child probability by +8 to +15%):**
- Overall body height suggesting less than 140cm (relative to environmental objects)
- Limb proportions suggesting incomplete growth plate closure
- Torso roundness (convex belly contour) typical of young children
- Facial feature proportions confirming young age (large eyes relative to face, rounded features)

**Critical Rule:** If **3 or more strong pediatric indicators** are present simultaneously, AI should treat the subject as a potential minor regardless of other signals. This triggers elevated protection protocols across all downstream modules.

### 4.2 Adult Proportion Indicators

These signals decrease child probability and increase confidence in adult classification:

**Strong Adult Indicators:**
- Head-to-body ratio ≤ 1:7 (proportionally small head)
- Torso-to-femur ratio between 1.00 and 1.20
- Clear shoulder-to-hip differentiation (R_SH > 1.20 for male-presenting, > 1.10 for female-presenting)
- Arm-to-torso ratio ≥ 0.65
- Visible musculoskeletal definition suggesting physical maturity

**Moderate Adult Indicators:**
- Height suggesting > 160cm relative to environment
- Fully elongated limbs with mature joint positioning
- Hip widening (female-presenting) or shoulder broadening (male-presenting) consistent with post-pubertal development

### 4.3 Ambiguous Age Zone — The Adolescent Challenge

Adolescents (ages 12–17) are the most difficult group for proportion-based age estimation because:

1. Their proportions overlap significantly with both older children and young adults.
2. Growth occurs at different rates for different body segments.
3. Early developers may have near-adult proportions at age 13.
4. Late developers may have child-like proportions at age 16.

**AI Reasoning Strategy for Ambiguous Proportions:**

```text
IF proportion_signals are ambiguous (adolescent range):
    DO NOT rely on proportions alone
    MUST cross-reference with:
        → Face analysis (facial maturity indicators)
        → Context signals (school setting, peer group ages, content metadata)
        → Clothing patterns (school uniforms, age-specific fashion)
        → Scene understanding (playground vs. nightclub)
    IF ambiguity persists after multi-signal fusion:
        → DEFAULT TO HIGHER PROTECTION (treat as potential minor)
        → This is the safe default — protecting a minor is always
          more important than avoiding a false positive on an adult
```

### 4.4 Proportion-Age Confidence Matrix

| Proportion Signal Strength | Face Confirms Child | Face Ambiguous | Face Confirms Adult |
|---------------------------|--------------------|-----------------|--------------------|
| **Strong pediatric proportions** | 🔴 CRITICAL — Block/Review | 🔴 HIGH — Treat as minor | 🟡 MEDIUM — Unusual but possible (short adult, dwarfism) |
| **Ambiguous proportions** | 🔴 HIGH — Treat as minor | 🟡 MEDIUM — Elevated monitoring | 🟢 LOW — Likely adult |
| **Strong adult proportions** | 🟡 MEDIUM — Investigate mismatch | 🟢 LOW — Likely adult | 🟢 MINIMAL — Confirmed adult |

## 5. Adult vs. Child Proportion Patterns — Detailed Comparison

### 5.1 Structural Differences Summary

```text
CHILD (approximate ages 3-10)          ADULT (18+ years)
================================       ================================
┌─────┐                                ┌───┐
│     │ ← Large head                   │   │ ← Small head relative
│     │   (1/5 to 1/6 of height)       │   │   to body (1/7.5 to 1/8)
└──┬──┘                                └─┬─┘
   │                                     │
┌──┴──┐                                ┌─┴──────┐
│     │ ← Narrow, undifferentiated     │        │ ← Broad shoulders
│     │   shoulders ≈ hip width        │        │   (differentiated
│     │                                └───┬────┘   from hips)
│     │ ← Long torso relative              │
│     │   to total height              ┌───┤
└──┬──┘                                │   │ ← Proportional torso
   │                                   │   │
┌──┴──┐                                └───┤
│     │ ← Short legs                       │
│     │   (legs < torso length)        ┌───┤
└──┬──┘                                │   │ ← Long legs
   │                                   │   │   (legs > torso length)
┌──┴──┐                                │   │
│     │                                └───┤
└─────┘                                    │
                                       ┌───┤
                                       │   │
                                       └───┘
```

### 5.2 Critical Proportion Differences for AI Reasoning

| Feature | Child Pattern | Adult Pattern | AI Implication |
|---------|--------------|---------------|----------------|
| Head proportion | Head = 1/5 to 1/6 of body | Head = 1/7.5 to 1/8 of body | Larger head relative to body → higher child probability |
| Torso length | Torso > leg length | Torso ≤ leg length | Long torso + short legs = pediatric signal |
| Shoulder width | ≈ Hip width | Shoulders wider than hips | Undifferentiated frame → pediatric signal |
| Arm length | Arms reach mid-thigh | Arms reach approximately crotch level | Short arms relative to body → pediatric signal |
| Body center of gravity | Higher (near navel) | Lower (below navel) | Higher center of gravity → child indicator |
| Limb thickness | Relatively thick (baby fat) | Proportional to length | Thick, short limbs → young child indicator |
| Waist definition | Minimal | Clear waist indentation | Lack of waist definition → pre-pubescent signal |

### 5.3 Growth-Related Proportion Changes Over Time

```text
Age:    2    4    6    8    10   12   14   16   18   Adult
        │    │    │    │    │    │    │    │    │    │
Head    ████████████████████▓▓▓▓▓▓▓▓░░░░░░░░         ← Decreasing
Ratio   Large ──────────────────────────────→ Small     relative to body

Leg     ░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓████████████████████     ← Increasing
Length  Short ──────────────────────────────→ Long       relative to torso

Shoulder                ░░░░▓▓▓▓▓▓████████████████    ← Diverging
-Hip    Same ──────────────────────────────→ Different   from hip width
Ratio

Waist                        ░░░░▓▓▓▓████████████     ← Developing
Def.    None ──────────────────────────────→ Clear       indentation
```

## 6. Sexualized Body Proportion Cues

### 6.1 Understanding Sexualization Through Proportions

Body proportions become a content safety concern when they are combined with other signals that suggest sexualization. Proportions alone are NEVER sufficient to classify content as sexualized — they must be evaluated alongside clothing, pose, context, and intent signals.

### 6.2 Proportion-Based Sexualization Indicators

The following proportion patterns, **when combined with other risk signals**, may indicate sexualized presentation:

#### 6.2.1 Exaggerated Sexual Dimorphism

**What to look for:**
- Waist-to-hip ratio artificially reduced (extremely narrow waist, exaggerated hips)
- Shoulder-to-hip ratio artificially exaggerated
- Bust-to-waist proportions that exceed normal human ranges
- Hip-to-waist proportions pushed beyond anatomical norms

**Why it matters:** Exaggerated sexual dimorphism is a common technique in both real and AI-generated sexualized content. It emphasizes secondary sexual characteristics beyond what natural human anatomy produces.

**AI Reasoning Rule:**
```text
IF body proportions show exaggerated sexual dimorphism:
    AND clothing reveals significant skin exposure
    AND pose emphasizes the exaggerated features
    THEN → Increase sexualization risk score by +20 to +35%

IF body proportions show exaggerated sexual dimorphism:
    BUT clothing is modest/professional
    AND pose is neutral/professional
    THEN → Likely natural body variation or fashion photography
    THEN → Do NOT increase risk score
```

#### 6.2.2 Anatomically Impossible Proportions

**Indicators:**
- Waist diameter < head diameter (physically impossible for a real person)
- Limb proportions that violate human skeletal constraints
- Joint angles that exceed human range of motion
- Body segment ratios that do not match any known human morphology

**Why it matters:** Anatomically impossible proportions strongly suggest either AI-generated content or heavily edited images. When combined with sexualized context, this creates a higher risk profile.

**AI Reasoning Rule:**
```text
IF proportions are anatomically impossible:
    → Flag as potentially AI-generated or digitally manipulated
    IF content also shows sexualized signals:
        → Elevated risk: AI-generated sexualized content
    IF proportions suggest a child-like body with impossible adult features:
        → CRITICAL: Potential AI-generated CSAM
        → Immediate escalation to highest risk tier
```

#### 6.2.3 Child-Like Body with Adult Sexualization

**This is the highest-risk proportion pattern in content safety.**

**Indicators:**
- Pediatric proportions (head-to-body ratio ≥ 1:6, short limbs, long torso)
- Combined with sexually suggestive pose
- Combined with revealing or age-inappropriate clothing
- Combined with adult facial features artificially applied
- Combined with adult-styled makeup or accessories

```text
IF body proportions indicate pediatric or ambiguous age:
    AND content contains ANY sexualization signal:
        → CRITICAL RISK — Maximum protection response
        → This combination should NEVER pass through the safety system
        → Even a single sexualization signal combined with
          pediatric proportions warrants maximum scrutiny
```

### 6.3 Proportion Manipulation Detection

AI-generated and digitally manipulated content often produces proportion anomalies that do not occur in unedited photographs:

| Anomaly Type | Detection Signal | Risk Level |
|-------------|-----------------|------------|
| Asymmetric limb lengths | Left/right leg or arm length differs by > 15% | Medium — may indicate AI generation |
| Impossible joint angles | Joints exceeding human range of motion | Medium — may indicate AI manipulation |
| Inconsistent scaling | Head size inconsistent with body size for any age | High — likely manipulated |
| Warped proportions near edges | Body proportions change near image borders | Medium — may indicate image editing |
| Mixed age proportions | Child head/face on adult body proportions (or vice versa) | CRITICAL — potential CSAM |

## 7. Context-Aware Proportion Analysis

### 7.1 Why Context Changes Everything

The same body proportions carry completely different safety implications depending on the surrounding context. AI must never evaluate proportions in isolation.

### 7.2 Context Scenarios and Proportion Interpretation

#### 7.2.1 Medical / Anatomical Context

```text
CONTEXT: Medical textbook, anatomical chart, clinical setting
PROPORTION SIGNAL: Any body proportions visible, including pediatric

AI REASONING:
    → Medical context provides strong safe justification
    → Pediatric proportions in medical context = educational content
    → Clinical terminology, anatomical labeling, and medical
      environment confirm educational intent
    → Risk adjustment: -40 to -60% from baseline

REQUIRED CONFIRMATIONS:
    → Medical terminology present in text/labels
    → Clinical or educational environment detected
    → No sexualization signals present
    → Professional presentation format
```

#### 7.2.2 Sports / Athletics Context

```text
CONTEXT: Swimming competition, gymnastics, track and field, dance
PROPORTION SIGNAL: Adult proportions + athletic wear + high skin visibility

AI REASONING:
    → Athletic context normalizes high skin visibility
    → Athletic proportions (muscular, lean) are expected
    → Revealing athletic wear is contextually appropriate
    → Risk adjustment: -25 to -45% from baseline

WATCH FOR:
    → Camera angles that deviate from standard sports photography
    → Zooming on specific body parts rather than athletic performance
    → Absence of sports equipment, audience, or competition markers
    → Pediatric proportions in athletic context still require
      elevated monitoring (young athletes)
```

#### 7.2.3 Fashion / Modeling Context

```text
CONTEXT: Fashion show, catalog photography, editorial fashion
PROPORTION SIGNAL: Adult proportions + fashion clothing + posed

AI REASONING:
    → Fashion context normalizes posed presentations
    → Proportions may appear exaggerated due to clothing design
      (high heels elongate legs, corsets narrow waist)
    → Professional fashion photography has different norms
    → Risk adjustment: -15 to -30% from baseline

CRITICAL WATCH:
    → Adolescent or ambiguous-age models in sexualized fashion
    → Fashion content that crosses into explicit territory
    → "Fashion" framing used to disguise sexualized content
```

#### 7.2.4 Art / Illustration Context

```text
CONTEXT: Fine art, classical sculpture, animated art, illustration
PROPORTION SIGNAL: Stylized or exaggerated proportions

AI REASONING:
    → Art frequently uses non-realistic proportions
    → Classical art (Venus de Milo, David) includes nudity
      without sexualization
    → Anime/manga uses dramatically non-realistic proportions
    → Risk varies enormously by sub-context

DECISION FRAMEWORK:
    IF classical/museum art:
        → Generally safe, low risk
    IF contemporary illustration with exaggerated sexual proportions:
        → Evaluate as potentially sexualized art
    IF illustration with child-like proportions + sexualized elements:
        → CRITICAL — Same protection as photographic content
        → Drawn/animated CSAM receives NO artistic exception
```

#### 7.2.5 Beach / Pool Context

```text
CONTEXT: Beach, pool, water park, outdoor swimming
PROPORTION SIGNAL: Adult proportions + swimwear + high skin visibility

AI REASONING:
    → Beach/pool context normalizes swimwear and skin exposure
    → Family beach context is very different from "bikini model" content
    → Look for family indicators: multiple age groups, children playing,
      recreational activities
    → Risk adjustment varies by sub-context:
        Family beach: -30 to -50%
        Solo swimwear photography: -10 to -20%
        Suggestive swimwear content: no adjustment

CRITICAL WATCH:
    → Children at the beach/pool with sexualized camera focus
    → Voyeuristic angles even in public settings
    → Content emphasizing body parts over activity
```

### 7.3 Context Modifiers — Summary Table

| Context | Risk Adjustment | Condition |
|---------|----------------|-----------|
| Medical / Clinical | -40% to -60% | Confirmed medical environment + terminology |
| Sports / Athletics | -25% to -45% | Confirmed sporting context + equipment |
| Classical Fine Art | -30% to -50% | Museum/gallery context + historical art |
| Fashion / Professional | -15% to -30% | Professional fashion photography confirmed |
| Family Beach / Pool | -30% to -50% | Family setting with children, recreational |
| Educational / Scientific | -35% to -55% | Academic context + educational format |
| Pornographic platform | +30% to +50% | Known adult content platform or indicators |
| Anonymous upload | +10% to +20% | No context available, unknown source |
| Sexualized text overlay | +20% to +35% | Suggestive captions or text on image |

## 8. Integration with Other Knowledge Base Modules

### 8.1 Integration with `clothing/`

**How proportions inform clothing analysis:**

Body proportions provide the anatomical baseline against which clothing coverage is measured. The clothing module cannot accurately assess coverage without knowing the underlying body structure.

```text
PROPORTION → CLOTHING INTEGRATION:

1. Body proportion defines the "canvas" that clothing covers
2. Clothing coverage percentage is calculated relative to
   body segment areas derived from proportions
3. Tight clothing on exaggerated proportions = higher sexualization signal
4. Loose clothing on pediatric proportions = may obscure age indicators

KEY REASONING RULES:
    IF pediatric proportions detected:
        AND clothing is age-inappropriate (adult lingerie styles):
            → CRITICAL RISK regardless of skin coverage percentage
    IF adult proportions confirmed:
        AND clothing is revealing but context is appropriate:
            → Moderate to low risk depending on context
    IF proportions are ambiguous:
        AND clothing provides no age-differentiating information:
            → Elevate to cautious monitoring
```

### 8.2 Integration with `skin_visibility/`

**How proportions inform skin exposure assessment:**

The skin visibility module calculates the ratio of visible skin area to total body area. Body proportions are essential for defining what "total body area" means for a given subject.

```text
PROPORTION → SKIN VISIBILITY INTEGRATION:

1. Body proportions define expected skin area for each body segment
2. Skin exposure on a child-proportioned body carries different
   risk weight than on an adult-proportioned body
3. The same percentage of skin exposure has different
   safety implications depending on body proportions

RISK AMPLIFICATION RULES:
    Skin_Risk_Adjusted = Skin_Risk_Base × Proportion_Multiplier

    WHERE Proportion_Multiplier:
        Confirmed adult proportions: 1.0 (no amplification)
        Ambiguous proportions: 1.5 (moderate amplification)
        Pediatric proportions: 2.5 to 3.0 (significant amplification)

    This means: 30% skin exposure on a child-proportioned body
    is treated with equivalent concern as 75-90% skin exposure
    on a confirmed adult body.
```

### 8.3 Integration with `pose/`

**How proportions inform pose analysis:**

The same pose means different things on different body types. A seated cross-legged pose on an adult is neutral; the same pose on a child in certain contexts may require different evaluation.

```text
PROPORTION → POSE INTEGRATION:

1. Proportion data disambiguates pose risk:
   - Spread-leg pose + adult proportions + swimwear = moderate risk
   - Spread-leg pose + pediatric proportions + any context = elevated risk

2. Natural vs. posed assessment requires proportion context:
   - Children naturally sit, play, and move differently than adults
   - A child sitting cross-legged on the floor is natural
   - A child positioned in an adult modeling pose is unnatural

3. Proportion-aware pose safety rules:
   IF pediatric proportions:
       → All sexualized pose categories receive maximum risk weight
       → "Suggestive" poses are reclassified as "concerning"
       → Even borderline poses trigger elevated monitoring
```

### 8.4 Integration with `emotion/`

**How proportions inform emotional expression analysis:**

```text
PROPORTION → EMOTION INTEGRATION:

1. Children express distress and discomfort differently than adults
2. Emotional cues on a child-proportioned body receive different
   safety interpretation
3. If pediatric proportions + distress signals + sexualized context:
   → CRITICAL: Immediate maximum risk classification

4. If adult proportions + neutral/positive emotion + appropriate context:
   → Low risk contribution from emotion module
```

### 8.5 Integration with `scene_understanding/`

**How proportions are informed by scene analysis:**

```text
SCENE → PROPORTION INTEGRATION:

Scene context can CONFIRM or CHALLENGE proportion-based age estimates:

    School/playground scene + pediatric proportions:
        → CONFIRMED: Subject is likely a child
        → All child protection protocols active

    Nightclub/bar scene + pediatric proportions:
        → ALERT: Child-proportioned person in adult environment
        → Requires elevated scrutiny

    Office/professional scene + adult proportions:
        → CONFIRMED: Subject is likely an adult
        → Standard adult safety protocols

    Bedroom scene + ambiguous proportions:
        → ELEVATED RISK: Cannot confirm age in intimate setting
        → Apply conservative (minor-protective) defaults
```

### 8.6 Integration with `context/` (Context Reasoning)

**How contextual reasoning modifies proportion-based decisions:**

```text
CONTEXT → PROPORTION INTEGRATION:

Context reasoning is the FINAL ARBITER when proportion signals conflict:

    IF proportions say "adult" BUT context says "school/children's event":
        → Context should increase scrutiny
        → May be a teacher, but verify

    IF proportions say "child" BUT context says "work environment":
        → Unusual but possible (workplace tours, casual photos)
        → Maintain elevated monitoring

    IF proportions are ambiguous AND context provides no clarity:
        → Apply the SAFE DEFAULT: treat as potential minor
        → Better to over-protect than under-protect
```

## 9. Risk Scoring Framework

### 9.1 Proportion-Based Risk Components

The proportion analysis module contributes the following components to the overall content safety risk score:

#### 9.1.1 Age Classification Confidence

```text
Age_Confidence_Score (ACS):

    Strong adult indicators: ACS = 0.10 (low risk contribution)
    Moderate adult indicators: ACS = 0.25
    Ambiguous (adolescent range): ACS = 0.50
    Moderate pediatric indicators: ACS = 0.70
    Strong pediatric indicators: ACS = 0.90 (high risk contribution)
```

#### 9.1.2 Sexualization Proportion Score

```text
Sexualization_Proportion_Score (SPS):

    Normal, natural proportions: SPS = 0.00
    Mildly exaggerated proportions: SPS = 0.15
    Moderately exaggerated proportions: SPS = 0.35
    Heavily exaggerated proportions: SPS = 0.55
    Anatomically impossible proportions: SPS = 0.70
    Child proportions + any sexualization: SPS = 0.95
```

#### 9.1.3 Composite Proportion Risk Score

```text
Proportion_Risk = (ACS × W_age) + (SPS × W_sex) + (Context_Modifier)

WHERE:
    W_age = 0.60 (age classification carries highest weight)
    W_sex = 0.40 (sexualization carries significant weight)
    Context_Modifier = [-0.60, +0.50] (context can reduce or increase risk)

FINAL INTERPRETATION:
    Proportion_Risk < 0.20: LOW — Minimal safety concern from proportions
    Proportion_Risk 0.20 – 0.45: MODERATE — Monitor with other signals
    Proportion_Risk 0.45 – 0.70: HIGH — Elevated scrutiny required
    Proportion_Risk > 0.70: CRITICAL — Immediate review required
```

### 9.2 Risk Score Integration with Other Modules

The Proportion_Risk score is ONE component of the overall content safety score. It is combined with scores from other modules using weighted fusion:

```text
Overall_Safety_Score = 
    (Proportion_Risk × 0.20) +
    (Clothing_Risk × 0.15) +
    (Skin_Visibility_Risk × 0.20) +
    (Pose_Risk × 0.15) +
    (Context_Risk × 0.15) +
    (Scene_Risk × 0.10) +
    (Emotion_Risk × 0.05)

CRITICAL OVERRIDE:
    IF Proportion_Risk > 0.85 AND any other module > 0.60:
        → Override composite score → Set to CRITICAL
    IF ACS > 0.80 (strong pediatric) AND SPS > 0.50:
        → Override composite score → Set to CRITICAL
        → This combination should ALWAYS trigger review
```

## 10. False Positive Prevention

### 10.1 Common False Positive Scenarios

Body proportion analysis can generate false positives in several well-understood scenarios. AI must be trained to recognize and handle these cases:

#### 10.1.1 Adults with Naturally Petite or Child-Like Proportions

**Scenario:** Some adults have naturally small body frames that can trigger pediatric proportion indicators.

**Mitigation Strategy:**
```text
IF proportions suggest pediatric BUT:
    → Face analysis indicates adult features (facial hair, aging signs,
      mature bone structure)
    → Context confirms adult environment (workplace, bar, adult event)
    → Clothing is adult-specific (formal wear, professional attire)
    → Height relative to environment suggests adult stature
THEN:
    → Reduce pediatric probability by -30 to -50%
    → Classify as "Petite Adult" rather than "Pediatric"
    → Maintain moderate monitoring but do not block
```

#### 10.1.2 People with Dwarfism / Skeletal Dysplasia

**Scenario:** Individuals with dwarfism have proportions that differ significantly from both standard adult and pediatric norms (shortened limbs, relatively larger head).

**Mitigation Strategy:**
```text
IF proportions show:
    → Shortened limbs with normal or near-normal torso length
    → Head size larger than adult norm but with adult facial features
    → Limb-to-torso ratios outside both pediatric and adult norms
THEN:
    → Recognize as atypical adult morphology
    → Do NOT classify as pediatric
    → Rely more heavily on face analysis and context
    → Apply standard adult safety protocols
```

#### 10.1.3 Tall / Large Children Who Look Older

**Scenario:** Some children (especially during growth spurts) have near-adult proportions at ages 11–14.

```text
IF proportions suggest adult BUT:
    → Face analysis suggests younger age
    → Context is school, playground, or child-specific environment
    → Peer group appears to be minors
THEN:
    → Increase pediatric probability by +20 to +35%
    → Cross-reference with contextual age indicators
    → Apply conservative (protective) classification
```

#### 10.1.4 Mannequins, Dolls, and Statues

**Scenario:** Retail mannequins and realistic dolls have human-like proportions but are not real people.

```text
IF human proportions detected BUT:
    → No micro-movement detected (perfectly static across frames)
    → Skin texture analysis shows uniform, non-organic surface
    → Retail or museum environment detected
    → Multiple identical figures present (store displays)
THEN:
    → Classify as "Non-Human Object"
    → Bypass human safety protocols
    → Exception: Hyper-realistic child-like dolls in sexualized
      contexts should still be flagged
```

#### 10.1.5 Artistic and Stylized Representations

**Scenario:** Cartoons, anime, video game characters, and artistic illustrations use non-realistic proportions.

```text
IF proportions are non-realistic (exceeding human norms) AND:
    → Art style detected (cell shading, cartoon outlines, pixel art)
    → No photographic texture
THEN:
    → Apply art-specific proportion thresholds
    → Anime characters have exaggerated proportions by convention
    → However: sexualized art with child proportions is NOT exempt
    → Drawn/animated child exploitation receives FULL protection
```

### 10.2 False Positive Prevention Decision Tree

```text
Proportions trigger safety concern
│
├── Is the subject a real human?
│   ├── NO → Is it a mannequin/doll/statue?
│   │        ├── YES → Classify as object, bypass (except sexualized child dolls)
│   │        └── NO → Is it art/illustration?
│   │                 ├── YES → Apply art-specific rules
│   │                 └── NO → Insufficient data, maintain caution
│   │
│   └── YES → Continue evaluation
│
├── Do proportions suggest pediatric?
│   ├── YES → Does face analysis confirm child?
│   │        ├── YES → Confirmed child — apply full protection
│   │        └── NO → Face suggests adult?
│   │                 ├── YES → Likely petite adult or atypical morphology
│   │                 │        → Reduce risk, maintain monitoring
│   │                 └── AMBIGUOUS → Apply protective defaults
│   │
│   └── NO → Continue with standard assessment
│
├── Are proportions exaggerated beyond human norms?
│   ├── YES → Possible AI-generated or manipulated content
│   │        → Flag for authenticity review
│   │        → If sexualized, elevate risk
│   └── NO → Proportions within human norms
│            → Standard safety assessment continues
```

## 11. False Negative Prevention

### 11.1 How False Negatives Occur

False negatives in proportion analysis happen when harmful content is NOT flagged because:
1. The subject's proportions are manipulated to appear adult when they represent a minor.
2. The image is cropped, obscured, or angled to hide proportion indicators.
3. AI-generated content creates realistic adult proportions on a conceptually minor character.
4. Clothing or accessories mask the underlying body proportions.

### 11.2 False Negative Prevention Strategies

#### 11.2.1 Partial Body Visibility

**Problem:** If only the upper body is visible, leg proportions cannot be assessed, removing a key age indicator.

**Prevention:**
```text
IF less than 60% of body landmarks are visible:
    → Increase uncertainty in age classification
    → Widen confidence intervals
    → Rely more heavily on visible segments (head-to-torso ratio
      can still be assessed from upper body only)
    → Cross-reference with face analysis and context
    → Do NOT assume adult just because full proportions are unavailable
```

#### 11.2.2 Deliberate Proportion Obscuring

**Problem:** Loose clothing, strategic cropping, or specific poses can hide body proportions.

**Prevention:**
```text
IF body proportions cannot be reliably assessed:
    AND context suggests potential risk (intimate setting, suggestive framing):
        → Elevate monitoring despite lack of proportion data
        → The ABSENCE of proportion data is itself a signal
          when combined with other risk indicators
        → Apply context-based safety rules without proportion confirmation
```

#### 11.2.3 AI-Generated Age Manipulation

**Problem:** AI can generate images where a minor's face is placed on an adult body, or adult proportions are given to a character described or intended as a minor.

```text
IF proportions suggest adult BUT:
    → Face analysis detects potential age manipulation artifacts
    → Metadata or text context refers to a minor
    → Style or genre is associated with child exploitation
THEN:
    → Override proportion-based age estimate
    → Apply maximum protection protocols
    → Text/metadata context referencing minors ALWAYS takes
      precedence over visual proportion analysis
```

#### 11.2.4 Crowd and Multi-Person Scenes

**Problem:** In images with multiple people, AI may focus on prominent adult figures and miss children in the background or periphery.

```text
FOR EACH detected person in a multi-person scene:
    → Run individual proportion analysis
    → Do NOT skip smaller or partially visible figures
    → If ANY individual in the scene has pediatric proportions:
        → Apply child-safety protocols to the ENTIRE scene
        → Evaluate what activities involve the child
        → Assess proximity and interaction between adults
          and child-proportioned individuals
```

### 11.3 The "When in Doubt" Principle

```text
CORE RULE FOR FALSE NEGATIVE PREVENTION:

When proportion analysis cannot determine age with confidence:
    AND the content contains ANY risk signal (sexualization, nudity,
        suggestive context, intimate setting):
    → ALWAYS default to protective classification
    → It is ALWAYS better to:
        ✓ Over-protect a person who turns out to be an adult
        ✗ Under-protect a person who turns out to be a child
    → This asymmetric error preference is FUNDAMENTAL to SafeNet's design
```

## 12. SafeNet Content Safety Use Cases

### 12.1 Use Case 1: Social Media Upload Screening

**Scenario:** A user uploads a photo to a social media platform. The system needs to assess the content before publication.

```text
INPUT: Uploaded image
PROCESS:
    1. Detect all human figures in the image
    2. For each figure, extract body proportion measurements
    3. Classify proportions: pediatric / adolescent / adult
    4. Cross-reference with clothing, skin visibility, pose, context
    5. Calculate composite safety score

PROPORTION-SPECIFIC ACTIONS:
    IF all subjects have strong adult proportions + appropriate context:
        → Proportion module contributes LOW risk
        → Allow other modules to make final determination

    IF any subject has pediatric proportions:
        → Proportion module contributes ELEVATED risk
        → If combined with any sexualization signal → BLOCK
        → If combined with safe context → ALLOW with monitoring

    IF any subject has ambiguous proportions:
        → Proportion module contributes MODERATE risk
        → Require additional signals for final determination
```

### 12.2 Use Case 2: Real-Time Video Stream Monitoring

**Scenario:** A live video stream is being monitored for content safety violations.

```text
INPUT: Continuous video frames
PROCESS:
    1. Track body proportions across frames (temporal consistency)
    2. Look for proportion changes that indicate:
       - New person entering frame
       - Zoom/crop changes revealing previously hidden proportions
       - Clothing removal revealing body proportions
    3. Maintain rolling proportion assessment for each tracked individual

TEMPORAL REASONING:
    Proportions should be STABLE across frames for real people.
    IF proportions fluctuate wildly between frames:
        → Possible tracking error — increase uncertainty
        → Or possible content manipulation — increase scrutiny

    IF a person with pediatric proportions appears in an adult-context stream:
        → Immediate elevated monitoring
        → Assess interaction between adult and child figures
```

### 12.3 Use Case 3: AI-Generated Content Detection

**Scenario:** Content is suspected of being AI-generated. Proportion analysis helps confirm or deny this.

```text
INPUT: Image suspected of AI generation
PROCESS:
    1. Extract body proportions for all human figures
    2. Check for anomalies:
       - Asymmetric limb lengths (left arm ≠ right arm)
       - Impossible joint angles
       - Proportions that don't match any human age group
       - Mixed age signals (child head on adult body)
    3. Calculate authenticity confidence score

AI-GENERATION INDICATORS:
    Proportion asymmetry index > 15% → Likely AI-generated
    Mixed age proportions → Likely AI-generated or manipulated
    Proportions outside all human norms → Likely AI-generated
    Perfect bilateral symmetry → May be AI-generated (humans are
        naturally slightly asymmetric)

RISK ESCALATION:
    IF AI-generated + sexualized content:
        → HIGH risk regardless of apparent age
    IF AI-generated + pediatric proportions + sexualized:
        → CRITICAL risk — potential AI-generated CSAM
```

### 12.4 Use Case 4: Parent Protection — Protecting Children Online

**Scenario:** A parent-facing tool that monitors content accessible to children, or content that may depict children inappropriately.

```text
PARENT PROTECTION FRAMEWORK:

Two dimensions of child protection:

1. PROTECTING CHILDREN FROM SEEING HARMFUL CONTENT:
    → Proportion analysis of depicted subjects helps classify
      content maturity level
    → Adult-proportioned figures in sexual contexts → Block for children
    → Content that normalizes sexualization → Block for children

2. PROTECTING CHILDREN FROM BEING DEPICTED INAPPROPRIATELY:
    → Proportion analysis identifies when a child may be the subject
    → Any content depicting child proportions + sexualization = CRITICAL
    → This is the PRIMARY mission of the proportion analysis module

PARENTAL CONCERN SCENARIOS:
    → Child's device showing content with sexualized adult proportions
        → Content filter blocks based on adult content classification
    → Unknown person sharing images of children
        → Proportion analysis identifies children in images
        → Monitors for inappropriate framing or context
    → AI tools generating child-like characters
        → Proportion analysis flags child proportions
        → Prevents generation of sexualized child-like content
```

### 12.5 Use Case 5: E-Commerce and Advertising Compliance

**Scenario:** An advertising platform needs to ensure that ads comply with content policies, especially those involving models and body image.

```text
ADVERTISING COMPLIANCE:

    1. Detect if models in advertisements have pediatric proportions
       → Child models in age-inappropriate advertising = BLOCK
    2. Detect exaggerated body proportions in advertising
       → May violate body image and advertising standards
    3. Ensure age-appropriate content matching
       → Children's product ads should feature child-proportioned models
       → Adult product ads should feature adult-proportioned models
       → Mismatches may indicate policy violation
```

## 13. NSFW and Sexualized Content Applications

### 13.1 Proportion Analysis in NSFW Classification

Body proportions play a supporting role in NSFW content classification. They are not the primary classifier but provide critical context:

```text
NSFW CLASSIFICATION SUPPORT:

Proportions contribute to NSFW classification in these ways:

1. AGE GATE:
   Before ANY NSFW classification is applied, proportion analysis
   must first determine whether the subject is likely an adult.
   → If pediatric proportions → Content is NOT "NSFW" — it is
     potentially ILLEGAL (CSAM) and receives maximum protection
   → NSFW classification only applies to adult-proportioned subjects

2. SEXUALIZATION DEGREE:
   Body proportions help distinguish between:
   → Nudity (medical, artistic, non-sexual) — proportions neutral
   → Sexualized content — proportions may be exaggerated
   → Pornographic content — proportions combined with explicit activity

3. CONTENT TYPE DIFFERENTIATION:
   → Normal human proportions + nudity + medical context = Educational
   → Normal proportions + nudity + intimate context = Adult content
   → Exaggerated proportions + nudity + provocative pose = Sexualized
   → Pediatric proportions + ANY nudity beyond age-appropriate = CRITICAL
```

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
CRITICAL PRINCIPLE: THE AGE GATE

ALL content safety decisions involving nudity, sexualization, or
suggestive content MUST pass through the proportion-based age gate:

Step 1: Are body proportions consistent with an adult? (ACS < 0.30)
    → YES: Proceed to standard NSFW classification
    → NO: Go to Step 2

Step 2: Are body proportions consistent with a minor? (ACS > 0.60)
    → YES: Apply maximum child protection — NO exceptions
    → NO: Go to Step 3

Step 3: Are proportions ambiguous? (ACS 0.30 – 0.60)
    → YES: Can face analysis resolve the ambiguity?
        → YES, adult confirmed: Proceed with elevated monitoring
        → YES, minor confirmed: Apply maximum protection
        → NO, still ambiguous: Apply protective default (treat as minor)
```

```text
SCENARIO: Photo of a family at the beach — two adults in swimwear,
          two children (ages ~5 and ~8) in swimsuits

PROPORTION ANALYSIS:
    Person A: R_TF = 1.12, R_HT = 0.24, R_SH = 1.35 → Adult male
    Person B: R_TF = 1.08, R_HT = 0.25, R_SH = 1.15 → Adult female
    Person C: R_TF = 1.48, R_HT = 0.44, R_SH = 1.02 → Child (~5 years)
    Person D: R_TF = 1.38, R_HT = 0.36, R_SH = 1.05 → Child (~8 years)

CONTEXT: Beach environment, recreational activity, family group

DECISION:
    → Children are present but in age-appropriate swimwear
    → Family context is confirmed by mixed age group
    → No sexualization signals detected
    → Camera angle is standard (not voyeuristic)
    → RESULT: ✅ SAFE — Family beach photo
    → No blocking action required
```

```text
SCENARIO: Fashion photograph of a model in designer clothing.
          Model has slim build and youthful appearance.

PROPORTION ANALYSIS:
    R_TF = 1.22, R_HT = 0.30, R_SH = 1.10
    → Proportions fall in adolescent-to-young-adult range
    → Ambiguous age classification

FACE ANALYSIS:
    → Youthful features but no clear pediatric indicators
    → Professional makeup application
    → Ambiguity remains

CONTEXT:
    → Professional fashion photography studio
    → Designer clothing (not revealing)
    → Published in fashion magazine context

DECISION:
    → Proportions are ambiguous but clothing is not sexualized
    → Professional fashion context provides moderate safe signal
    → Face analysis does not confirm minor status
    → RESULT: 🟡 MODERATE — Allow with monitoring
    → Flag for editorial review if platform requires age verification
```

```text
SCENARIO: AI-generated image of a female character. The character
          has a child-like face but adult body proportions.

PROPORTION ANALYSIS:
    R_TF = 1.10, R_HT = 0.24, R_SH = 1.20
    → Body proportions suggest adult

    BUT: Face proportions suggest child/young adolescent
    → Large eyes, rounded features, small nose
    → Mixed age signals = RED FLAG

SEXUALIZATION CHECK:
    → Character is wearing revealing clothing
    → Pose is suggestive
    → Sexualization signals are present

DECISION:
    → Mixed age proportions + sexualization = CRITICAL
    → AI-generated content with child-like face on adult body
      is a known technique for generating borderline CSAM
    → RESULT: 🚫 CRITICAL — Block and flag
    → Face proportions suggesting a minor OVERRIDE body proportions
      suggesting an adult when sexualization is present
```

```text
SCENARIO: Anatomical illustration from a pediatric medical textbook
          showing a child's body with labeled anatomical features.

PROPORTION ANALYSIS:
    → Clear pediatric proportions (R_TF = 1.50, R_HT = 0.42)
    → Anatomical accuracy (no exaggeration)

CONTEXT:
    → Medical textbook format
    → Anatomical labels and clinical terminology present
    → Educational publisher
    → No sexualization signals whatsoever

DECISION:
    → Pediatric proportions are present but in medical/educational context
    → Medical context provides strong safe justification
    → Clinical presentation format confirmed
    → RESULT: ✅ SAFE — Medical educational content
    → No blocking action required
```

```text
SCENARIO: Photo from a youth gymnastics competition. Multiple
          young athletes in leotards performing routines.

PROPORTION ANALYSIS:
    → Multiple subjects with pediatric/adolescent proportions
    → R_TF ranges from 1.25 to 1.40
    → Ages approximately 10–15

CONTEXT:
    → Gymnastics competition arena
    → Audience visible, scoring visible
    → Athletic equipment present
    → Standard sports photography angles

CLOTHING:
    → Regulation gymnastics leotards
    → Age-appropriate athletic wear

DECISION:
    → Children are present in revealing athletic wear
    → BUT: Context is competitive sports, clothing is regulation
    → Camera angles are standard sports photography
    → No sexualization signals detected
    → RESULT: ✅ SAFE — Competitive sports context
    → HOWEVER: If camera angles become voyeuristic or focus
      inappropriately on body parts → RECLASSIFY to HIGH RISK
```

```text
SCENARIO: A photo taken from behind/below of a person walking
          on the street, focused on their lower body.

PROPORTION ANALYSIS:
    → Only partial body visible (lower body)
    → Cannot fully assess proportions
    → What is visible suggests adult proportions

CONTEXT:
    → Street setting
    → Voyeuristic camera angle (from below/behind)
    → Focus on specific body area rather than full scene
    → No consent indicators

DECISION:
    → Voyeuristic framing is itself a risk signal
    → Even with adult proportions, voyeuristic content is problematic
    → Lack of full proportion data prevents age confirmation
    → RESULT: 🟡 MODERATE to 🔴 HIGH depending on explicitness
    → Camera angle and intent signals override proportion data
```

```text
RULE 1: THE AGE GATE MUST ALWAYS COME FIRST
    Before evaluating ANY content for NSFW or sexualization,
    determine the age classification of all subjects through
    proportion analysis. This is non-negotiable.

RULE 2: PEDIATRIC PROPORTIONS + SEXUALIZATION = CRITICAL
    There is NO context that makes sexualized depiction of
    child-proportioned figures acceptable. No artistic, cultural,
    or educational exception applies to sexualized child content.

RULE 3: AMBIGUITY DEFAULTS TO PROTECTION
    When proportion analysis cannot determine age with confidence,
    and the content contains risk signals, default to treating
    the subject as a minor. Over-protection is ALWAYS preferable
    to under-protection.

RULE 4: PROPORTIONS ARE NECESSARY BUT NOT SUFFICIENT
    Body proportions alone cannot make a content safety decision.
    They must always be combined with at least 2–3 other signal
    modules (clothing, skin visibility, pose, context, scene).

RULE 5: CONTEXT CAN REDUCE BUT NEVER ELIMINATE CHILD RISK
    Medical, educational, or athletic context can reduce the risk
    score for pediatric proportions + skin exposure, but they
    can NEVER eliminate it if sexualization signals are present.

RULE 6: AI-GENERATED CONTENT RECEIVES NO LENIENCY
    AI-generated content with child proportions and sexualization
    receives the same maximum protection as photographic content.
    The medium of creation does not affect the harm potential.

RULE 7: TEMPORAL CONSISTENCY MATTERS
    In video content, proportions should be consistent across frames.
    Sudden proportion changes may indicate scene cuts, new subjects,
    or content manipulation — all requiring fresh assessment.

RULE 8: ABSENCE OF DATA IS ITSELF A SIGNAL
    When body proportions cannot be assessed (cropping, occlusion,
    extreme angles), this absence should increase uncertainty,
    not decrease scrutiny. Content that hides proportion data
    while showing other risk signals deserves elevated attention.
```

```text
PROPORTION MODULE WEIGHT IN FINAL DECISION:

    Standard content (no risk signals): 10–15% of final score
    Content with moderate risk signals: 20–25% of final score
    Content with high risk signals: 25–35% of final score
    Content involving potential minors: 35–50% of final score

    The proportion module's weight INCREASES as child risk increases
    because proportion analysis is one of the most reliable
    age indicators available to computer vision systems.
```

```text
WHEN TO ESCALATE FROM PROPORTION MODULE:

AUTOMATIC ESCALATION (no human review needed to flag):
    → Pediatric proportions + any sexualization signal
    → Mixed age proportions (child head/adult body or vice versa)
    → Anatomically impossible proportions + sexualized content
    → Multiple children with no parental/guardian figures

ELEVATED MONITORING (automated monitoring with lower threshold):
    → Ambiguous proportions + intimate setting
    → Pediatric proportions + high skin exposure
      (even if context seems safe — beach, pool)
    → AI-generated content with any proportion anomalies

STANDARD PROCESSING (normal safety pipeline):
    → Adult proportions + appropriate context
    → Adult proportions + moderate risk signals
    → Clearly non-human subjects (mannequins, cartoon characters
      with explicitly non-child proportions)
```

```text
MULTI-SIGNAL REASONING HIERARCHY:

TIER 1 — PRIMARY SIGNALS (highest individual weight):
    → Body proportions (age estimation)
    → Skin visibility (exposure assessment)
    → Face analysis (age confirmation, expression)

TIER 2 — SECONDARY SIGNALS (strong confirmatory weight):
    → Clothing type and coverage
    → Pose classification
    → Scene understanding

TIER 3 — TERTIARY SIGNALS (contextual refinement):
    → Emotion/expression analysis
    → Context reasoning (metadata, text, platform)
    → Object detection (relevant objects in scene)

COMBINATION RULES:
    2+ TIER 1 signals agreeing = HIGH confidence decision
    1 TIER 1 + 2 TIER 2 signals agreeing = MODERATE-HIGH confidence
    1 TIER 1 signal alone = LOW confidence — seek additional signals
    TIER 2 and TIER 3 without TIER 1 = MODERATE confidence at best
```

```text
WHEN SIGNALS AGREE:
    All signals point to same conclusion → High confidence decision
    → Example: Adult proportions + adult face + professional clothing
      + office context → CONFIRMED SAFE with high confidence

WHEN SIGNALS DISAGREE:
    Signals conflict → Requires careful arbitration
    → Example: Adult proportions + child-like face + revealing clothing
      + ambiguous context → REQUIRES INVESTIGATION

    DISAGREEMENT RESOLUTION PRIORITY:
    1. When in doubt about age → Protect as if minor
    2. Child protection signals take priority over safe signals
    3. Sexualization signals cannot be overridden by context alone
       when age is ambiguous
    4. Multiple weak risk signals can accumulate to HIGH risk
       even if no single signal is individually concerning
```

```text
AMPLIFICATION: When signals combine, risk may be MORE than additive

    Pediatric proportions (moderate risk alone)
    + Revealing clothing (moderate risk alone)
    = Combined risk is HIGH (not just moderate + moderate)

    This is because certain combinations are more concerning
    than the sum of their parts. The proportion module defines
    amplification rules for its interactions with other modules:

    AMPLIFIED COMBINATIONS:
    → Pediatric proportions + high skin exposure = 2.5x base risk
    → Pediatric proportions + suggestive pose = 3.0x base risk
    → Pediatric proportions + adult clothing = 2.0x base risk
    → Pediatric proportions + sexualized context = 4.0x base risk
    → Ambiguous proportions + intimate setting = 1.8x base risk
    → Exaggerated proportions + provocative pose = 1.5x base risk

    ATTENUATED COMBINATIONS:
    → Any proportions + medical context + clinical format = 0.4x
    → Pediatric proportions + family setting + appropriate clothing = 0.5x
    → Athletic proportions + sports context + competition = 0.5x
```

```text
ATHLETIC BUILD:
    → Shoulder-to-hip ratio may be 1.2x to 1.4x standard
    → Arm-to-torso ratio may increase by +0.05 to +0.10
    → Does NOT change head-to-body ratio (most reliable age indicator)

ECTOMORPHIC (THIN) BUILD:
    → All ratios shift slightly toward longer, thinner proportions
    → Torso-to-femur ratio may decrease by -0.05
    → Head-to-torso ratio may increase by +0.03

ENDOMORPHIC (HEAVY) BUILD:
    → Ratios may be obscured by adipose tissue
    → Shoulder-to-hip ratio may compress toward 1.0
    → Rely more heavily on head-to-body ratio and skeletal landmarks
    → Confidence in proportion analysis may decrease

VARIANCE NOTE:
    The ± values in the table above represent ONE standard deviation.
    Proportions within ± 2 standard deviations are considered normal.
    Proportions beyond ± 2 standard deviations may indicate:
        → Atypical body type (still normal — dwarfism, gigantism, etc.)
        → Image manipulation or AI generation
        → Measurement error (require re-evaluation)
```

```text
OCCLUSION TYPES AND RESPONSES:

Self-occlusion (arms covering torso, crossed legs):
    → Estimate occluded proportions from visible segments
    → Reduce confidence by -15% to -25%
    → Maintain current age classification unless contradicted

Object occlusion (behind furniture, partially in frame):
    → Cannot assess hidden body segments
    → Rely on visible proportions + face + context
    → Increase uncertainty proportionally to occlusion percentage

Multi-person occlusion (person partially behind another):
    → Attempt to assess each person independently
    → If child-proportioned person is partially hidden behind adult:
      → This is a NOTABLE pattern — assess carefully
      → Could be innocent (parent carrying child)
      → Or could indicate concerning positioning

Clothing occlusion (loose robes, blankets, costumes):
    → Skeletal landmarks may be unreliable
    → Head-to-body height ratio is still assessable
    → Face analysis becomes more important
    → Context reasoning carries more weight
```

```text
IMPORTANT: Body proportions vary across populations.

    → Average body proportions differ by ethnicity and geography
    → The reference values in Section 17.1 represent global averages
    → AI must NOT systematically misclassify any demographic group

    SAFEGUARDS:
    → Use wide confidence intervals that accommodate human diversity
    → Never classify based on a single ratio — require multiple signals
    → Validate that false-positive rates are approximately equal
      across demographic groups
    → The head-to-body ratio is the MOST culturally stable indicator
      (least affected by population-level variation)
```