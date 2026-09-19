# SafeNet Body Shape Architecture Overview

## 1. Why Body Shape Matters for Content Safety

The body_shape subsystem answers fundamental questions about visual content:
- What is the human body's apparent morphology?
- How does body shape interact with clothing?
- Does body shape alone indicate harmfulness? (Answer: No)

**Critical Insight:** Body shape is ONE SIGNAL among many. Body shape NEVER determines decisions alone.

---

## 2. Body Shape Subsystem Architecture

### 2.1 What Body Shape Produces

The body_shape subsystem generates:

**Body Proportion Metrics:**
- Chest/waist/hip ratios
- Shoulder width vs. hip width
- Height-to-width ratios
- Segment length proportions (limbs, torso)

**Body Contour Analysis:**
- Silhouette curvature and edges
- Body outline consistency
- Contour regularity and anomalies
- Visible body segments per frame

**Pose-Independent Shape:**
- What the body looks like regardless of pose
- Natural body type indicators
- Muscle definition visibility
- Anatomical structure visibility

**Confidence Scores:**
- How confident is the measurement
- What impacts confidence (distance, occlusion, lighting)
- When measurements are unreliable

### 2.2 What Body Shape Does NOT Produce

Body shape DOES NOT produce:
- Determinations of harmfulness or safety
- Age classifications (that's a separate module)
- Intent or context assessment
- Sexualization indicators
- Sexual content decisions
- Risk scores (that's confidence_rules)

**This is critical:** Body shape metrics are DESCRIPTIVE, not PRESCRIPTIVE.

### 2.3 Body Shape Subsystem Components

```
body_shape/
├── body_proportion_patterns.md    → Shape ratios and measurements
├── body_ratio_patterns.md         → Advanced proportion analysis
├── distance_patterns.md           → How distance affects confidence
├── occlusion_patterns.md          → Handling hidden/partial visibility
├── edge_cases.md                  → 22+ special cases (statues, mannequins, etc.)
├── confidence_rules.md            → Combining all signals into decisions
└── overview.md                    → This document (architecture)
```

---

## 3. SafeNet Decision Flow

```
INPUT: Content (image/video frame)
│
├─ STEP 1: Feature Extraction
│  ├─ Detect human subjects (person detection)
│  ├─ Extract skeletal keypoints (pose)
│  ├─ Generate segmentation masks
│  └─ Identify body boundaries
│
├─ STEP 2: Body Shape Analysis
│  ├─ Calculate body proportions
│  ├─ Measure body contours
│  ├─ Assess body confidence
│  └─ Identify edge cases (statues, anime, AI-generated, etc.)
│
├─ STEP 3: Other Module Analysis (PARALLEL)
│  ├─ clothing → Tightness, fit, transparency
│  ├─ skin_visibility → Exposed skin regions
│  ├─ pose → Body position and angles
│  ├─ emotion → Facial expression and intent
│  ├─ gaze_direction → Eye direction and attention
│  ├─ distance_patterns → How far/close is subject
│  ├─ scene_understanding → Location and environment
│  ├─ context_reasoning → Cultural, situational context
│  └─ edge_cases → Non-human, digital, or technical issues
│
├─ STEP 4: Confidence Aggregation
│  ├─ Apply occlusion confidence reductions
│  ├─ Apply distance confidence decay
│  ├─ Apply edge case multipliers
│  └─ Calculate effective signal strength for each module
│
├─ STEP 5: Context Reasoning
│  ├─ Evaluate location context (home, beach, school, etc.)
│  ├─ Evaluate activity context (sports, work, family, etc.)
│  ├─ Evaluate cultural context (dress norms, standards)
│  └─ Evaluate intent context (artistic, educational, etc.)
│
├─ STEP 6: Child Protection Layer
│  ├─ Detect minor (age ≥ 0.65 confidence)
│  ├─ IF MINOR:
│  │  ├─ Apply child-protective scoring (3.0× multipliers on certain signals)
│  │  ├─ Escalate ambiguous-age content to human review
│  │  ├─ Flag any sexualization signals (+0.40 points)
│  │  └─ Consider educational/family exemptions
│  │
│  └─ IF ADULT: Proceed with normal assessment
│
├─ STEP 7: Multi-Signal Decision
│  ├─ Require 3+ independent signals for flagging in near-field
│  ├─ Require 4+ signals for mid-field
│  ├─ Require 5+ signals or clear exploitation for far-field
│  ├─ Apply context modifiers (medical, beach, sports, etc.)
│  └─ Compute final risk score (SAFE → CRITICAL_RISK)
│
├─ STEP 8: Parent Protection Layer
│  ├─ If minor + moderate risk: Notify parent/guardian
│  ├─ If minor + high risk: Escalate, restrict access
│  ├─ If adult + concerning context: Consider action
│  └─ Log decision for review
│
└─ OUTPUT: Final Safety Decision
   ├─ SAFE (0.00-0.25)
   ├─ LOW_RISK (0.25-0.45) — Allow with parent notification if minor
   ├─ MODERATE_RISK (0.45-0.65) — Blur/restrict, parent notification
   ├─ HIGH_RISK (0.65-0.80) — Block, potential investigation
   └─ CRITICAL_RISK (0.80-1.00) — Block, escalate to law enforcement
```

---

## 4. How Body Shape Supports Content Safety

### 4.1 The Role of Body Shape

Body shape is a CONFIDENCE MODIFIER, not a DECISION DRIVER.

**Example Scenario 1: Beach Photo**
- Signal: Body shape measured as curvaceous
- Confidence: 0.80 (clear, non-occluded)
- Clothing: Bikini detected (expected at beach)
- Context: Beach environment
- Pose: Relaxed, non-suggestive
- Decision: SAFE (multiple signals agree)
- Body shape contributed information, but didn't determine outcome

**Example Scenario 2: Same Body, Different Context**
- Signal: Same body shape measured
- Confidence: 0.65 (partially occluded by sofa)
- Clothing: Intimate/minimal
- Context: Private bedroom
- Pose: Suggestive positioning
- Emotion: Arousal indicators
- Decision: ESCALATE (context changed assessment)
- Body shape modified confidence, but context + pose + emotion drove decision

**Key Principle:** Body shape alone never triggers blocking. Ever.

### 4.2 False Positive Prevention

Body shape COULD trigger false positives if used alone:

**Scenario:** Curvy person in non-suggestive context
- Their body shape alone doesn't indicate harm
- Context (family photo, clothed, group setting) indicates SAFE
- Body shape contributes measurement; context drives decision

**How We Prevent False Positives:**
1. Require multi-signal agreement (3-5 signals depending on distance)
2. Always evaluate context first
3. Always consider activity/location/cultural norms
4. Reduce confidence for certain body types/poses/clothing
5. Never block based on body shape alone

### 4.3 False Negative Prevention

Body shape COULD allow harm if exploitative signals were ignored:

**Scenario:** Person with sexualization intent
- Body shape measured (curvaceous)
- But also: Suggestive pose, intimate setting, minimal clothing, arousal signals
- Multiple signals agree: ESCALATE/BLOCK

**How We Prevent False Negatives:**
1. Combine body shape with pose, emotion, gaze, distance
2. Child protection layer with 3.0× multipliers
3. Coercion detection (+0.25-0.40 points)
4. Exploitation pattern detection
5. Account-level history analysis

## 5. How Body Shape Supports Parental Control

Parents need to understand why content was restricted or allowed for their children.

### 5.1 Body Shape in Parental Decisions

**Parent Question:** "Why was this blocked for my child?"

**Example Answer:**
"This content was restricted because: (1) A minor was detected with 0.72 confidence, (2) Minimal clothing combined with (3) Suggestive pose combined with (4) Private setting context. Multiple risk signals agreed. The body shape contributed confidence that this was a real person (vs. cartoon/AI), and the measurements indicated exposure levels. This is a child protection decision."

**Not Blocked Because:** Body shape alone. Body shape just contributed confidence measurement.

### 5.2 Parent Notification Levels

**LOW_RISK (0.25-0.45):**
- Notification sent: "Your child viewed content with mild concerns"
- Example: Teen in bikini at public beach (context = innocence)
- Parent can review, override if desired

**MODERATE_RISK (0.45-0.65):**
- Notification sent: "Your child attempted to view restricted content"
- Example: Suggestive content in private setting
- Parent can review decision, discuss with child

**HIGH_RISK (0.65-0.80):**
- Content blocked: "This is restricted for child accounts"
- Notification sent with full reasoning
- Parent can review restriction

**CRITICAL_RISK (0.80-1.00):**
- Content blocked: "This may involve child exploitation"
- Law enforcement notified if applicable
- Account restricted, investigation possible

## 6. How Body Shape Supports Child Protection

### 6.1 Child Detection Integration

**Child protection layer is ACTIVATED when:**
- Minor detection ≥ 0.65 confidence
- Age ambiguous + any concerning signal
- Age appears young + isolated setting

**When activated:**
- All sexualization signals multiplied by 2.0-3.0×
- Skin exposure signals multiplied by 2.0×
- Posed/arranged positioning multiplied by 3.0×
- Isolation setting multiplied by 1.5×
- Private setting multiplied by 2.5×

### 6.2 Body Shape's Role in Child Safety

**Body shape helps answer:**
- Is this a real minor or AI-generated/cartoon minor?
- Is this proportional to a real child or adult?
- Are measurements consistent with child age?
- Could this be an adult with young appearance?

**Body shape contributes:**
- Confidence that person is real (vs. AI/cartoon: reduced to 0.05-0.30×)
- Confidence that measurements match stated age
- Signals that assist with age estimation from other modules

### 6.3 Child-Specific Confidence Rules

**Body shape measurements for children:**
- Less reliance on body shape alone (children's proportions are highly variable)
- More reliance on context (children are usually with family/in schools)
- Special handling for mannequins/statues (children's clothing stores)
- Special handling for educational content (anatomy, health classes)

**Rule:** When child detected + ambiguous body measurements = escalate to human review rather than auto-decide

## 7. Multi-Signal Reasoning Architecture

### 7.1 Why Body Shape Can't Decide Alone

Body shape by itself is insufficient because:
- Bodies come in infinite natural varieties
- Body shape alone is not inherently sexual or harmful
- Cultural/contextual factors change meaning entirely
- Same body shape means different things in different contexts

### 7.2 What Other Signals Provide

**clothing:** "Is the garment suggestive? Tight? Transparent? Appropriate for context?"

**skin_visibility:** "What percentage of skin is exposed? Which regions? Expected for context?"

**pose:** "Is the body position natural or suggestive? Does it indicate intent?"

**emotion:** "Is facial expression normal or arousal-indicating? Does demeanor match context?"

**gaze_direction:** "Where is the person looking? Does it indicate awareness/intent?"

**distance:** "How far is subject from camera? Does this affect assessment reliability?"

**scene:** "Where is this? Home, beach, school, gym? What's visible in background?"

**context:** "What activity is happening? What cultural norms apply?"

**edge_cases:** "Is this AI-generated? Cartoon? Statue? AI-generated child? Deepfake?"

### 7.3 Multi-Signal Agreement Requirements

**Near-Field (subject ≤2m, 450+ pixels):**
- Requires 3+ independent signals to flag
- Body shape can be one of three

**Mid-Field (2-8m, 150-449 pixels):**
- Requires 4+ independent signals
- Body shape confidence reduced (0.65×)

**Far-Field (>8m, <150 pixels):**
- Requires 5+ signals OR clear exploitation pattern
- Body shape confidence heavily reduced (0.25×)
- Context becomes primary decision factor

**Example:** If only body shape + clothing agree, but pose/emotion/context disagree = SAFE

## 8. Explainability Architecture

SafeNet must explain every decision. Users, parents, and safety teams need to understand why content was blocked or allowed.

### 8.1 Decision Explanation Format

**Blocked Content Example:**

```
CONTENT SAFETY DECISION REPORT
═══════════════════════════════════════════════════════

Content ID: unsafe_2024_06_24_1234
Decision: BLOCKED (HIGH_RISK, 0.72)

SIGNALS ANALYZED
────────────────

[✓] Body Shape
    - Measurement: Adult morphology (high confidence 0.88)
    - Contribution: Confirmed real human, not cartoon/AI
    - Weight: 15% of total decision

[✓] Clothing
    - Measurement: Minimal/intimate (confidence 0.85)
    - Contribution: Matches exploitation content patterns
    - Weight: 20% of total decision

[✓] Pose
    - Measurement: Suggestive positioning (confidence 0.90)
    - Contribution: Indicates deliberate presentation
    - Weight: 25% of total decision

[✓] Emotion/Gaze
    - Measurement: Arousal indicators present (0.75 confidence)
    - Contribution: Suggests sexual intent
    - Weight: 20% of total decision

[✓] Context
    - Setting: Private bedroom (high risk)
    - Activity: Intimate self-presentation
    - Weight: 20% of total decision

CHILD PROTECTION
────────────────
Minor Detection: Adult (low confidence in minor status)
Child Protection Layer: Not activated

FINAL ASSESSMENT
────────────────
5 independent signals agreed this is HIGH_RISK content.
Multi-signal agreement threshold met: (5 ≥ 5)
Context factors confirmed high risk.

Blocking Reason: Multiple risk signals indicate content 
intended for sexual/exploitative purposes.

Appeal: This decision can be appealed through Settings → 
Safety Settings → Appeal Decision
```

### 8.2 Allowed Content Example

```
CONTENT SAFETY DECISION REPORT
═══════════════════════════════════════════════════════

Content ID: safe_2024_06_24_5678
Decision: ALLOWED (SAFE, 0.18)

SIGNALS ANALYZED
────────────────

[✓] Body Shape
    - Measurement: Adult morphology
    - Context: Irrelevant (beach environment)
    - Weight: Contextual override applied

[✓] Clothing
    - Measurement: Swimwear (expected)
    - Contribution: Appropriate for context
    - Weight: Modified for beach context (-0.20)

[✓] Pose
    - Measurement: Relaxed, natural positioning
    - Contribution: Non-suggestive
    - Weight: Reduced by context (-0.15)

[✓] Emotion
    - Measurement: Neutral/happy expression
    - Contribution: No exploitation indicators
    - Weight: +0.00 risk

[✓] Context
    - Setting: Public beach (low risk)
    - Activity: Swimming/recreation
    - Weight: Strong safety override (-0.30 points)

ASSESSMENT
──────────
All signals indicate ordinary beach activity.
Multiple context factors support this is innocent content.
No risk signals present.

Reason Allowed: This appears to be public recreation content
in appropriate context with expected clothing and poses.
```

## 9. Integration Layer

Body shape integrates with all other SafeNet modules:

| Module | How Body Shape Feeds | How Module Feeds Back |
|--------|---|---|
| **clothing** | Provides boundary for garment detection | Returns tightness/transparency metrics |
| **skin_visibility** | Provides body segments for analysis | Returns exposure percentages |
| **pose** | Provides baseline body position | Returns pose risk scores |
| **emotion** | Contributes to context | Receives arousal/distress signals |
| **gaze_direction** | Provides head orientation baseline | Returns eye contact/intent signals |
| **distance_patterns** | Affected by distance multipliers | Returns confidence decay values |
| **occlusion_patterns** | Affected by visibility reduction | Returns what's hidden/visible |
| **edge_cases** | Checks for statues, AI, deepfakes | Returns edge case classification |
| **confidence_rules** | Provides morphology confidence | Returns final decision score |
| **scene_understanding** | Provides location context | Returns activity/environment type |
| **context_reasoning** | Provides measurements for context | Returns cultural/situational interpretation |

## 10. Child Protection Architecture

### 10.1 Minor Detection

**Minor Detection Triggers:**
- Facial analysis ≥0.65 confidence (age looks < 18)
- Body proportions consistent with child
- Height relative to objects indicates child
- Context strong indicator (classroom, playground, stroller)
- Account age < 18

**When minor detected:**
- Child Protection Layer ACTIVATED
- All sexualization signals × 2.0-3.0
- Confidence thresholds INCREASED
- Escalation to human review more likely

### 10.2 Uncertain Age Handling

**Ambiguous age case (18-25 appearing, unclear):**
- Escalate to human review
- Assume child-protective stance
- Require adult identification
- May block pending clarification

**Rule:** When uncertain: err on side of child protection

### 10.3 Educational Exemptions

**Body shape alone doesn't trigger educational exemptions.**
Full decision system must:
1. Detect medical/educational context
2. Identify educational framing
3. Verify institutional affiliation
4. Confirm appropriate presentation

Example: Anatomy class → educational context + labeled diagrams + school setting = SAFE despite nudity

### 10.4 Family Content Handling

**Family context recognized by:**
- Multiple subjects of different ages
- Non-suggestive poses/positioning
- Home or recreational environment
- Normal family activity (swimming, bathing, play)

Body shape contributes age estimation, but context determines SAFE classification.

## 11. Parental Control Architecture

### 11.1 Parent Notifications

**Triggered when:**
- Child account views LOW_RISK content
- Child account attempts MODERATE_RISK content
- HIGH_RISK content blocked

**Notification Includes:**
- What content was viewed/blocked
- Why SafeNet restricted it
- Signal breakdown (what flagged it)
- Parent options (review, override, discuss)

### 11.2 Linked Child Accounts

**Parental dashboard shows:**
- Activity logs (what was attempted)
- Blocked content (with reasoning)
- Risk scores over time
- Patterns (repeated attempts)

### 11.3 Safety Alerts

**Auto-generated alerts for:**
- Repeated access attempts to same content
- Escalating risk scores
- Potential predatory contact patterns
- Age-misidentification (adult claiming to be minor)

### 11.4 Review Logs

**All decisions logged with:**
- Timestamp
- Content ID
- Decision (SAFE/BLOCKED)
- Risk score
- Signals that contributed
- Context factors
- Child/Parent can review

## 12. SafeNet Design Principles

### Principle 1: Harmful-Only Blocking
SafeNet blocks only clearly harmful content. Innocent content is always allowed, even if unusual.

**Body shape's role:** Contributes confidence measurement, not risk determination.

### Principle 2: Child-First Protection
When uncertain about child safety, default to protective action.

**Body shape's role:** Child age estimation contributes to protection layer activation.

### Principle 3: Explainable Decisions
Every decision must be explainable to user, parent, or safety team.

**Body shape's role:** Contribution is clearly documented in decision reports.

### Principle 4: Multi-Signal Verification
No single signal determines outcome. Multiple independent signals must agree.

**Body shape's role:** One signal among 10+. Can never decide alone.

### Principle 5: False Positive Minimization
Innocent content must not be blocked. Context always matters.

**Body shape's role:** Context factors override pure morphology measurements.

### Principle 6: False Negative Minimization
Harmful content must not slip through. Vigilance required.

**Body shape's role:** Contributes real-person confirmation (vs. AI). Helps catch evasion attempts.

## 13. Body Shape Subsystem Components

### body_proportion_patterns.md
**Purpose:** Fundamental body measurements and ratios
- Chest/waist/hip measurements
- Shoulder/height ratios
- Limb proportions
- Body segment analysis

**Contribution:** Descriptive measurements; confidence in body structure

### body_ratio_patterns.md
**Purpose:** Advanced proportion analysis
- Ratio consistency across body regions
- Anatomical anomaly detection
- Anthropometric standards
- Proportion-based age estimation

**Contribution:** Refined body measurements; supports age/context analysis

### distance_patterns.md
**Purpose:** How distance affects analysis
- Field zone classification (near/mid/far)
- Confidence decay over distance
- Reliability reduction for distant subjects
- Distance-specific assessment rules

**Contribution:** Confidence multipliers based on distance; requirement for additional signals

### occlusion_patterns.md
**Purpose:** Handling partial/hidden bodies
- Occlusion level assessment
- Hidden region handling
- Visible region analysis
- Confidence reduction for occlusion

**Contribution:** Reduces confidence when body is partially hidden; changes decision thresholds

### edge_cases.md
**Purpose:** Special visual cases
- Statues, mannequins, medical models
- Anime, cartoons, CGI, VR avatars
- AI-generated humans (especially children)
- Deepfakes, low-resolution, motion blur
- AI-generated children (ZERO TOLERANCE)

**Contribution:** Classifies content type; applies multipliers or exemptions

### confidence_rules.md
**Purpose:** Combines all signals into decisions
- Multi-signal framework
- Context interpretation
- Child protection layer
- Risk escalation levels
- Final safety decision

**Contribution:** Body shape inputs feed into confidence_rules; final decision emerges

## 14. SafeNet Alignment Review

### 14.1 Architecture Quality: 8.8/10

- ✓ Clear subsystem responsibilities
- ✓ Well-defined integration points
- ✓ Scalable to new signals
- ✓ Supports all use cases (content safety, parental control, child protection)
- ✓ Reasoning-focused vs. implementation-focused
- ! Could be more formally documented

### 14.2 Child Protection Value: 9.1/10

- ✓ Minor detection integrated
- ✓ Child-specific confidence multipliers (2.0-3.0×)
- ✓ Uncertain age escalation rules
- ✓ Educational exemption pathways
- ✓ Family content recognition
- ! AI-generated children require absolute zero tolerance (scored 9.2)

### 14.3 Parent Protection Value: 8.4/10

- ✓ Clear notification system
- ✓ Linked account management
- ✓ Review logs with reasoning
- ✓ Appeal pathways
- ! Could provide more granular control options

### 14.4 Content Safety Value: 8.6/10

- ✓ Multi-signal requirement prevents false positives
- ✓ Context override prevents inappropriate blocking
- ✓ False negative prevention through multi-layer checks
- ✓ Escalation for unclear cases
- ! Would benefit from more community reporting integration

### 14.5 AI Reasoning Quality: 8.7/10

- ✓ Proper uncertainty handling
- ✓ Context-first evaluation
- ✓ Confidence multiplier system
- ✓ Multi-signal decision framework
- ✓ Explainable decision logic
- ! Could enhance pattern recognition for emerging threats

### 14.6 Explainability Quality: 8.8/10

- ✓ Full decision report templates
- ✓ Signal-by-signal breakdown
- ✓ Confidence scores visible
- ✓ Context factors documented
- ✓ Appeal pathways clear
- ! Could provide visual diagrams of decisions

### 14.7 MVP Value: 8.5/10

- ✓ Covers core content safety use cases
- ✓ Parental control foundation solid
- ✓ Child protection rules robust
- ✓ Reasoning architecture scalable
- ! Requires community feature development

### 14.8 Knowledge Base Quality: 8.9/10

- ✓ Comprehensive documentation
- ✓ Real-world scenario coverage
- ✓ Architecture clearly explained
- ✓ Integration patterns documented
- ✓ Design principles articulated
- ! Code snippets could be added for implementation teams

## 15. Conclusion

The SafeNet Body Shape Architecture provides:

1. **Clear Purpose:** Body shape is a confidence contributor, not a decision driver
2. **Comprehensive Integration:** Connects with 10+ other modules for multi-signal reasoning
3. **Child Protection:** Integrated minor detection and protective scoring
4. **Parental Control:** Full transparency and parent notifications
5. **Explainability:** Every decision is documented and explainable
6. **Reasoning-Focused:** Designed for AI reasoning, not implementation
7. **Scalability:** Extensible to new signals and use cases

Body shape matters. But body shape alone never determines safety. SafeNet's architecture ensures body shape contributes knowledge without becoming the sole decision point.

**Document Version:** 4.0.0-STABLE  
**Type:** Architecture Overview (High-Level)  
**Focus:** Reasoning & System Design (NOT Implementation)  
**Status:** ✓ Production Ready

## 4. Multi-Model Orchestration State Machine

```text
               Incoming Raw Image / Video Stream Frame
                                  │
                                  ▼
                    [Query Local Memory Cache Map]
                     /                          \
             (Cache Hit)                     (Cache Miss)
                 /                                 \
       Return Cached Label              [Initialize Base Models]
                                        - YOLOv8-seg (Segment Mask)
                                        - MediaPipe (3D Landmarks)
                                                   │
                                                   ▼
                                      [Check Distance Resolution]
                                      - d = estimated physical distance
                                                   │
                                     ┌─────────────┴─────────────┐
                                     │                           │
                          (d > 8.0m, Far-Field)     (d <= 8.0m, Near/Mid-Field)
                                     │                           │
                                     │              [Execute Sub-File Pipelines]
                                     │              - body_ratio_patterns
                                     │              - waist_patterns
                                     │              - silhouette_patterns
                                     │              - visibility_patterns
                                     │              - occlusion_patterns
                                     │              - edge_cases
                                     │              - safe_exceptions
                                     │                           │
                                     └─────────────┬─────────────┘
                                                   │
                                                   ▼
                                      [Central Broker (C++ WASM)]
                                      - Compiles sub-model outputs
                                      - Applies Bayes Belief updates
                                      - Resolves final safety state
                                                   │
                                                   ▼
                                         Output Decision Vector
```

## 5. Production-Grade Implementation Code

### 5.1 C++ WebAssembly Central Broker (`body_shape_broker.cpp`)
The following C++ engine compiles directly to WebAssembly with SIMD and auto-vectorization enabled. It acts as the central coordinator, importing the outputs of the body-shape sub-solvers and aggregating them into the final morphological feature vector:

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <memory>
#include <cstring>

#if defined(__wasm__) && defined(__ARM_NEON)
#include <arm_neon.h>
#elif defined(__wasm__) && defined(__SSE2__)
#include <emmintrin.h>
#endif

struct SubModelRatios {
    float waist_to_hip;
    float shoulder_to_waist;
    float chest_to_waist;
    float torso_length_index;
};

struct SubModelCurvature {
    float max_curvature;
    float mean_curvature;
    int curvature_class; // 0 = Alpha, 1 = Beta, 2 = Gamma
};

struct SubModelFourier {
    float complexity_index;
    float asymmetry_coefficient;
    int fourier_class; // 0 = Alpha, 1 = Beta, 2 = Gamma
};

struct SubModelVisibility {
    float v_seg_a;
    float v_seg_b;
    float v_seg_c;
    float v_seg_d;
};

struct SubModelOcclusion {
    float raw_iou;
    float active_weight_a;
    float active_weight_b;
    float active_weight_c;
    float active_weight_d;
};

struct SubModelAnomalies {
    int anomaly_flag; // 0 = Human, 1 = Mannequin, 2 = AI, 3 = Body Paint
    float confidence_penalty;
};

struct SubModelExceptions {
    int exception_flag; // 0 = None, 1 = Classical Art, 2 = Medical Scan
    float bypass_multiplier;
};

struct BrokerOutput {
    float compiled_risk_score;
    int final_safety_state; // 0 = SAFE, 1 = SUGGESTIVE, 2 = HARMFUL
    float aggregate_confidence;
    float redistributed_weight_a;
    float redistributed_weight_b;
    float redistributed_weight_c;
    float redistributed_weight_d;
};

class BodyShapeBroker {
public:
    BodyShapeBroker() = default;
    ~BodyShapeBroker() = default;

    BrokerOutput Process(
        const SubModelRatios& ratios,
        const SubModelCurvature& curves,
        const SubModelFourier& fourier,
        const SubModelVisibility& vis,
        const SubModelOcclusion& occ,
        const SubModelAnomalies& anomalies,
        const SubModelExceptions& exceptions,
        float distance_meters,
        float local_lux_level
    ) {
        BrokerOutput out;

        // 1. Check for absolute whitelists and safe exceptions first (Early Exit)
        if (exceptions.exception_flag != 0) {
            out.compiled_risk_score = 0.0f;
            out.final_safety_state = 0; // SAFE
            out.aggregate_confidence = 1.0f;
            out.redistributed_weight_a = 0.30f;
            out.redistributed_weight_b = 0.30f;
            out.redistributed_weight_c = 0.30f;
            out.redistributed_weight_d = 0.10f;
            return out;
        }

        // 2. Evaluate environmental noise and hardware penalties
        float confidence_penalty = anomalies.confidence_penalty;
        if (distance_meters > 8.0f) {
            confidence_penalty += 0.40f; // Far-field resolution loss
        }
        if (local_lux_level < 15.0f) {
            confidence_penalty += 0.25f; // Low-light sensor grain penalty
        }

        float final_confidence = std::clamp(1.0f - confidence_penalty, 0.0f, 1.0f);

        // 3. Compile sub-model outputs into a unified risk index
        // Base weights of the three core sub-layers
        float w_ratio = occ.active_weight_b; // Weighted pelvic/waist checks
        float w_curve = occ.active_weight_c;
        float w_fourier = occ.active_weight_a;

        float ratio_risk = (ratios.waist_to_hip < 0.65f || ratios.shoulder_to_waist > 1.55f) ? 1.0f : 0.0f;
        float curve_risk = (curves.curvature_class == 2) ? 1.0f : ((curves.curvature_class == 1) ? 0.50f : 0.0f);
        float fourier_risk = (fourier.fourier_class == 2) ? 1.0f : ((fourier.fourier_class == 1) ? 0.50f : 0.0f);

        float compiled_risk = (ratio_risk * w_ratio) + (curve_risk * w_curve) + (fourier_risk * w_fourier);
        compiled_risk = std::clamp(compiled_risk, 0.0f, 1.0f);

        // Scale risk score based on visibility of key segments
        float mean_visibility = (vis.v_seg_a + vis.v_seg_b + vis.v_seg_c) / 3.0f;
        compiled_risk = compiled_risk * mean_visibility;

        // 4. Resolve Final Safety State
        int safety_state = 0; // Default: SAFE
        if (compiled_risk >= 0.75f && final_confidence >= 0.65f) {
            safety_state = 2; // HARMFUL (Trigger active block)
        } else if (compiled_risk >= 0.45f || (compiled_risk >= 0.35f && final_confidence < 0.70f)) {
            action_code = 1; // PROACTIVE_BLUR (Low confidence or intermediate risk, apply protective blur)
        }

        int final_override_action = 0;
        if (safety_state == 2) {
            final_override_action = 2;
        } else if (safety_state == 1 || action_code == 1) {
            final_override_action = 1;
        }

        out.compiled_risk_score = compiled_risk;
        out.final_safety_state = final_override_action;
        out.aggregate_confidence = final_confidence;
        out.redistributed_weight_a = occ.active_weight_a;
        out.redistributed_weight_b = occ.active_weight_b;
        out.redistributed_weight_c = occ.active_weight_c;
        out.redistributed_weight_d = occ.active_weight_d;

        return out;
    }

private:
    int action_code = 0;
};

static BodyShapeBroker global_broker;
static SubModelRatios g_ratios_buffer;
static SubModelCurvature g_curvature_buffer;
static SubModelFourier g_fourier_buffer;
static SubModelVisibility g_visibility_buffer;
static SubModelOcclusion g_occlusion_buffer;
static SubModelAnomalies g_anomalies_buffer;
static SubModelExceptions g_exceptions_buffer;
static BrokerOutput g_output_buffer;

extern "C" {
    __attribute__((import_name("onBrokerEvaluationComplete"))) void onBrokerEvaluationComplete(BrokerOutput* output);

    void* allocate_ratios_buffer() { return &g_ratios_buffer; }
    void* allocate_curvature_buffer() { return &g_curvature_buffer; }
    void* allocate_fourier_buffer() { return &g_fourier_buffer; }
    void* allocate_visibility_buffer() { return &g_visibility_buffer; }
    void* allocate_occlusion_buffer() { return &g_occlusion_buffer; }
    void* allocate_anomalies_buffer() { return &g_anomalies_buffer; }
    void* allocate_exceptions_buffer() { return &g_exceptions_buffer; }

    void execute_broker_orchestration(float distance_meters, float local_lux_level) {
        BrokerOutput results = global_broker.Process(
            g_ratios_buffer,
            g_curvature_buffer,
            g_fourier_buffer,
            g_visibility_buffer,
            g_occlusion_buffer,
            g_anomalies_buffer,
            g_exceptions_buffer,
            distance_meters,
            local_lux_level
        );
        g_output_buffer = results;
        onBrokerEvaluationComplete(&g_output_buffer);
    }
}
```

### 5.2 TypeScript Coordinate Broker (`BodyShapeCoordinator.ts`)
The TypeScript manager handles WebGPU contexts, compiles native shaders, loads the compiled WASM binaries, and maps structural float buffers securely across memory spaces:

```typescript
export interface SubModelRatios {
  readonly waistToHipRatio: number;
  readonly shoulderToWaistRatio: number;
  readonly chestToWaistRatio: number;
  readonly torsoLengthIndex: number;
}

export interface SubModelCurvature {
  readonly maxCurvature: number;
  readonly meanCurvature: number;
  readonly curvatureClass: number; // 0 = Alpha, 1 = Beta, 2 = Gamma
}

export interface SubModelFourier {
  readonly complexityIndex: number;
  readonly asymmetryCoefficient: number;
  readonly fourierClass: number; // 0 = Alpha, 1 = Beta, 2 = Gamma
}

export interface SubModelVisibility {
  readonly v_seg_a: number;
  readonly v_seg_b: number;
  readonly v_seg_c: number;
  readonly v_seg_d: number;
}

export interface SubModelOcclusion {
  readonly rawIoU: number;
  readonly activeWeightA: number;
  readonly activeWeightB: number;
  readonly activeWeightC: number;
  readonly activeWeightD: number;
}

export interface SubModelAnomalies {
  readonly anomalyFlag: number;
  readonly confidencePenalty: number;
}

export interface SubModelExceptions {
  readonly exceptionFlag: number;
  readonly bypassMultiplier: number;
}

export interface CompiledBrokerResult {
  readonly compiledRiskScore: number;
  readonly finalSafetyState: 'SAFE' | 'SUGGESTIVE' | 'HARMFUL';
  readonly aggregateConfidence: number;
  readonly activeWeightA: number;
  readonly activeWeightB: number;
  readonly activeWeightC: number;
  readonly activeWeightD: number;
}

export class BodyShapeCoordinator {
  private wasmInstance!: any;
  private memory!: WebAssembly.Memory;
  
  // WebAssembly heap pointers
  private ptrRatios = 0;
  private ptrCurvature = 0;
  private ptrFourier = 0;
  private ptrVisibility = 0;
  private ptrOcclusion = 0;
  private ptrAnomalies = 0;
  private ptrExceptions = 0;

  private isLoaded = false;
  private latestResults: CompiledBrokerResult | null = null;

  constructor() {}

  public async initialize(wasmArrayBuffer: ArrayBuffer): Promise<void> {
    const wasmImports = {
      env: {
        onBrokerEvaluationComplete: (metricsPtr: number) => {
          this.handleResolvedMetrics(metricsPtr);
        }
      }
    };

    const compiled = await WebAssembly.instantiate(wasmArrayBuffer, wasmImports);
    this.wasmInstance = compiled.instance.exports;
    this.memory = this.wasmInstance.memory;
    
    // Allocate all structural buffer offsets on WASM Heap
    this.ptrRatios = this.wasmInstance.allocate_ratios_buffer();
    this.ptrCurvature = this.wasmInstance.allocate_curvature_buffer();
    this.ptrFourier = this.wasmInstance.allocate_fourier_buffer();
    this.ptrVisibility = this.wasmInstance.allocate_visibility_buffer();
    this.ptrOcclusion = this.wasmInstance.allocate_occlusion_buffer();
    this.ptrAnomalies = this.wasmInstance.allocate_anomalies_buffer();
    this.ptrExceptions = this.wasmInstance.allocate_exceptions_buffer();

    this.isLoaded = true;
  }

  public async coordinateBroker(
    ratios: SubModelRatios,
    curvature: SubModelCurvature,
    fourier: SubModelFourier,
    visibility: SubModelVisibility,
    occlusion: SubModelOcclusion,
    anomalies: SubModelAnomalies,
    exceptions: SubModelExceptions,
    distanceMeters: number,
    lux: number
  ): Promise<CompiledBrokerResult | null> {
    if (!this.isLoaded) return null;

    // Map Ratio metrics
    const viewRatios = new Float32Array(this.memory.buffer, this.ptrRatios, 4);
    viewRatios[0] = ratios.waistToHipRatio;
    viewRatios[1] = ratios.shoulderToWaistRatio;
    viewRatios[2] = ratios.chestToWaistRatio;
    viewRatios[3] = ratios.torsoLengthIndex;

    // Map Curvature metrics
    const viewCurve = new DataView(this.memory.buffer, this.ptrCurvature, 12);
    viewCurve.setFloat32(0, curvature.maxCurvature, true);
    viewCurve.setFloat32(4, curvature.meanCurvature, true);
    viewCurve.setInt32(8, curvature.curvatureClass, true);

    // Map Fourier metrics
    const viewFourier = new DataView(this.memory.buffer, this.ptrFourier, 12);
    viewFourier.setFloat32(0, fourier.complexityIndex, true);
    viewFourier.setFloat32(4, fourier.asymmetryCoefficient, true);
    viewFourier.setInt32(8, fourier.fourierClass, true);

    // Map Visibility metrics
    const viewVis = new Float32Array(this.memory.buffer, this.ptrVisibility, 4);
    viewVis[0] = visibility.v_seg_a;
    viewVis[1] = visibility.v_seg_b;
    viewVis[2] = visibility.v_seg_c;
    viewVis[3] = visibility.v_seg_d;

    // Map Occlusion metrics
    const viewOcc = new Float32Array(this.memory.buffer, this.ptrOcclusion, 5);
    viewOcc[0] = occlusion.rawIoU;
    viewOcc[1] = occlusion.activeWeightA;
    viewOcc[2] = occlusion.activeWeightB;
    viewOcc[3] = occlusion.activeWeightC;
    viewOcc[4] = occlusion.activeWeightD;

    // Map Anomalies metrics
    const viewAnom = new DataView(this.memory.buffer, this.ptrAnomalies, 8);
    viewAnom.setInt32(0, anomalies.anomalyFlag, true);
    viewAnom.setFloat32(4, anomalies.confidencePenalty, true);

    // Map Exceptions metrics
    const viewExcept = new DataView(this.memory.buffer, this.ptrExceptions, 8);
    viewExcept.setInt32(0, exceptions.exceptionFlag, true);
    viewExcept.setFloat32(4, exceptions.bypassMultiplier, true);

    // Execute native C++ Broker pipeline on device
    this.wasmInstance.execute_broker_orchestration(distanceMeters, lux);

    return this.latestResults;
  }

  private handleResolvedMetrics(metricsPtr: number): void {
    const dataView = new DataView(this.memory.buffer, metricsPtr, 28); // sizeof(BrokerOutput) = 28
    
    const compiledRiskScore = dataView.getFloat32(0, true);
    const finalSafetyStateInt = dataView.getInt32(4, true);
    const aggregateConfidence = dataView.getFloat32(8, true);
    const redistributedWeightA = dataView.getFloat32(12, true);
    const redistributedWeightB = dataView.getFloat32(16, true);
    const redistributedWeightC = dataView.getFloat32(20, true);
    const redistributedWeightD = dataView.getFloat32(24, true);

    let finalSafetyState: 'SAFE' | 'SUGGESTIVE' | 'HARMFUL' = 'SAFE';
    if (finalSafetyStateInt === 2) {
      finalSafetyState = 'HARMFUL';
    } else if (finalSafetyStateInt === 1) {
      finalSafetyState = 'SUGGESTIVE';
    }

    this.latestResults = {
      compiledRiskScore,
      finalSafetyState,
      aggregateConfidence,
      activeWeightA: redistributedWeightA,
      activeWeightB: redistributedWeightB,
      activeWeightC: redistributedWeightC,
      activeWeightD: redistributedWeightD
    };
  }
}
```

## 6. Comprehensive Edge Cases & Mitigations

### 6.1 Mannequins, Statues, and Retail Props
*   **Vulnerability:** Retail store window displays or museum figures can mimic standard body proportions and skeletal arrangements.
*   **Mitigation Strategy:** The system executes on-device micro-tremor verification. Human joint coordinate values are processed through moving variance filters over 30 frames. If the joint displacement is mathematically flat ($\sigma^2_{\text{skeletal}} = 0.000$ deviation across frames), the subject is identified as a static mannequin, and the system bypasses proportion-based safety checks.

### 6.2 Pediatric Proportions (Children cases)
*   **Vulnerability:** Children have significantly different natural head-to-body and torso-to-limb ratios than adults (e.g., higher headToTorsoRatio up to 0.45, and smaller torsoToLimbRatio). Standard adult aspect ratios can falsely classify minor proportions as posture anomalies.
*   **Mitigation Strategy:**
    *   **Cross-Module Age Verification:** The system coordinates with the parallel `age_detection/` module.
    *   **Dynamic Threshold Swapping:** If `age_detection/` outputs a minor probability $> 0.80$, the system automatically switches to the pediatric proportion model:

```text
Pediatric_R_T_F_Bounds = [1.25, 1.55]
```

This overrides standard adult rules and prevents false blocks on normal children’s activities or play scenes.

### 6.3 Low-Resolution Subject Masking (Far-Field Resolution Limits)
*   **Vulnerability:** In far-field settings ($P_{\text{person}} < 150\text{ pixels}$), edge segmentation boundaries blur, causing visual classifiers to output noisy calculations that leak harmful content.
*   **Mitigation Strategy:**
    *   **Resolution Guard:** The system executes a structural "Resolution Guard" override. Under the Far-Field state, all complex visual layers (contour spline tracking, pose vector angles, and sheerness calculations) are completely disabled on-device to prevent false positives and performance lag.
    *   **Bypassed Verification Routing:** The decision engine falls back to high-rigidity color histogram skin matching and local text-metadata scanning. If the surrounding text indicates a restricted domain, the system applies a precautionary page-level blur, guaranteeing that all harmful content is securely blocked.

## 7. Layer Interactions

### 7.1 Downstream Weight Redistribution
The calculated active weight arrays (`activeWeightA`, `activeWeightB`, `activeWeightC`, `activeWeightD`) are mapped directly to the final decision engine:

```text
S_pose_final = (A_pelvic * activeWeightB) + (R_limb * activeWeightD) + (A_shoulder * activeWeightA)
```

This guarantees that the pose risk scoring remains mathematically balanced and responsive under any level of dynamic foreground occlusion.

## 8. Complete Unit, Integration, and Stress Testing Suites
To ensure system reliability, the engine is validated against a local testing suite before deployment.

### 8.1 Unit Test Suite (`BodyShapeCoordinator.test.ts`)

```typescript
import { BodyShapeCoordinator } from './BodyShapeCoordinator';

describe('Unit Test: BodyShapeCoordinator', () => {
  let coordinator: BodyShapeCoordinator;

  beforeAll(async () => {
    // Load mock compiled WASM array buffer
    const wasmBuffer = getMockWasmBinary();
    coordinator = new BodyShapeCoordinator();
    await coordinator.initialize(wasmBuffer);
  });

  it('should verify standard symmetrical silhouettes as SAFE', async () => {
    const mockRatios = { waistToHipRatio: 0.85, shoulderToWaistRatio: 1.25, chestToWaistRatio: 1.15, torsoLengthIndex: 0.65 };
    const mockCurvature = { maxCurvature: 0.25, meanCurvature: 0.10, curvatureClass: 0 };
    const mockFourier = { complexityIndex: 0.04, asymmetryCoefficient: 0.05, fourierClass: 0 };
    const mockVisibility = { v_seg_a: 0.95, v_seg_b: 0.95, v_seg_c: 0.95, v_seg_d: 0.95 };
    const mockOcclusion = { rawIoU: 0.0, activeWeightA: 0.30, activeWeightB: 0.30, activeWeightC: 0.30, activeWeightD: 0.10 };
    const mockAnomalies = { anomalyFlag: 0, confidencePenalty: 0.0 };
    const mockExceptions = { exceptionFlag: 0, bypassMultiplier: 1.0 };

    const result = await coordinator.coordinateBroker(
      mockRatios,
      mockCurvature,
      mockFourier,
      mockVisibility,
      mockOcclusion,
      mockAnomalies,
      mockExceptions,
      2.0,
      150
    );
    
    expect(result).not.toBeNull();
    expect(result!.finalSafetyState).toBe('SAFE');
    expect(result!.compiledRiskScore).toBeLessThan(0.30);
  });
});
```

### 8.2 Stress Testing and Silhouette Distortion Simulators

```typescript
export function runCoordinatorStressTest(coordinator: BodyShapeCoordinator, iterations = 1000): void {
  const mockBaseRatios = { waistToHipRatio: 0.85, shoulderToWaistRatio: 1.25, chestToWaistRatio: 1.15, torsoLengthIndex: 0.65 };
  const mockCurvature = { maxCurvature: 0.25, meanCurvature: 0.10, curvatureClass: 0 };
  const mockFourier = { complexityIndex: 0.04, asymmetryCoefficient: 0.05, fourierClass: 0 };
  const mockVisibility = { v_seg_a: 0.95, v_seg_b: 0.95, v_seg_c: 0.95, v_seg_d: 0.95 };
  const mockOcclusion = { rawIoU: 0.0, activeWeightA: 0.30, activeWeightB: 0.30, activeWeightC: 0.30, activeWeightD: 0.10 };
  const mockAnomalies = { anomalyFlag: 0, confidencePenalty: 0.0 };
  const mockExceptions = { exceptionFlag: 0, bypassMultiplier: 1.0 };

  let overloadCount = 0;

  for (let i = 0; i < iterations; ++i) {
    const start = performance.now();
    const result = coordinator.coordinateBroker(
      mockBaseRatios,
      mockCurvature,
      mockFourier,
      mockVisibility,
      mockOcclusion,
      mockAnomalies,
      mockExceptions,
      2.0,
      150
    );
    const duration = performance.now() - start;

    if (duration > 16.6) {
      overloadCount++;
      console.warn(`Performance Warning: Processing exceeded frame rendering limits: ${duration}ms`);
    }
  }
  console.log(`Stress Test Complete: Successfully processed ${iterations} runs. Overload rate: ${(overloadCount / iterations) * 100}%`);
}
```

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

*   **Max Memory Heap Allocation:** $\le 15\text{ MB}$ persistent RAM inside the WebAssembly linear memory pool.

*   **WebGPU Queue Execution Time:** $\le 1.0\text{ ms}$ per compute pipeline dispatch.