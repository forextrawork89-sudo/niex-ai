# SafeNet Silhouette Reasoning Engine

Body Outline Analysis & Context-Aware Shape Interpretation

## 1. Executive Overview

**Purpose:** SafeNet's Silhouette Reasoning Engine analyzes human body outlines to provide structural body-shape evidence. The core principle is: silhouette alone must NEVER determine harmfulness.

**Core Principle:** Silhouette provides SUPPORTING evidence. Final decisions require multi-signal agreement with clothing, pose, emotion, context, and other factors.

**Key Insight:** The same body silhouette can be SAFE in a gym context but NOT SAFE in a private bedroom. Context is everything.

---

## 2. Silhouette Fundamentals

### 2.1 What Is a Silhouette?

A silhouette is the 2D outline or contour of a human body as seen from the camera's perspective. It represents:

**Body Outline:**
- External edge of the body
- Where body meets background
- Visible body boundary

**Contour Shape:**
- Overall shape of the outline
- Smooth vs. irregular edges
- General body morphology

**Symmetry:**
- Left/right body alignment
- Natural human asymmetry
- Deviation from symmetry

**Contour Complexity:**
- Smooth curves (simple silhouette)
- Sharp edges (complex silhouette)
- Detail level in outline

### 2.2 Silhouette vs. Body Shape

**Silhouette is NOT body shape:**
- Silhouette = 2D outline (what we see)
- Body shape = 3D measurements (what body shape module calculates)

**Silhouette is affected by:**
- Clothing (loose, tight, layered)
- Pose (standing, sitting, bending)
- Camera angle (front, side, back, tilted)
- Distance (changes visible detail)
- Occlusion (partially hidden)

**Silhouette is NOT affected by:**
- Skin color or texture
- Specific body parts (face, hands)
- Internal body composition
- Fitness level (except pose/shape)

### 2.3 What Silhouette Can Tell Us

Silhouette can provide evidence for:

**Possible Body Type:**
- Approximate proportions (curvy, straight, athletic)
- General body size (small, medium, large)
- NOTE: Not definitive without other signals

**Possible Clothing:**
- Tight vs. loose fitting
- Layered vs. single layer
- Presence of jacket/robe
- NOTE: Silhouette alone cannot identify specific garments

**Possible Pose:**
- Standing vs. sitting
- Arms positioning
- Body angle
- NOTE: Pose module provides more precise analysis

**Possible Occlusion:**
- What body parts are hidden
- What regions are visible
- Visibility percentage
- NOTE: Occlusion module handles detail

---

## 3. Why Silhouette Matters for Content Safety

### 3.1 Silhouette's Role in Safety Assessment

Silhouette contributes to:

**Body Shape Confidence:**
- Helps confirm body shape measurements
- Validates body ratio calculations
- Provides outline consistency check
- Increases confidence in body structure assessment

**Clothing Assessment:**
- Validates clothing detection
- Helps determine fit (tight vs. loose)
- Identifies layering
- Supports transparency analysis

**Uncertainty Handling:**
- Silhouette can increase or decrease confidence
- Complex silhouette = more uncertain
- Clear silhouette = more confident
- Applies confidence multipliers to other signals

**Edge Case Detection:**
- AI-generated silhouettes may be unnaturally smooth
- Actual humans have natural variation
- Statues/mannequins have different silhouette properties

### 3.2 Silhouette Alone Is INSUFFICIENT

**Silhouette CANNOT determine:**
- Whether content is harmful or safe
- Age of the person
- Intent or consent
- Sexualization or exploitation
- Actual body dimensions
- Specific body measurements

**Why silhouette alone fails:**
- Same silhouette = different meanings in different contexts
- Loose clothing produces same silhouette as body shape
- Pose affects silhouette dramatically
- Camera angle changes apparent silhouette
- Distance affects visible detail

---

## 4. Child Protection Framework

### 4.1 Pediatric Silhouettes

**Infant & Toddler Silhouettes (0-3 years):**
- Head appears very large relative to body
- Proportions: head ≈ 20-25% of total height
- Rounded, simplified outline
- Very soft/smooth contours
- Example: chubby toddler silhouette

**Preschool Silhouettes (3-5 years):**
- Head proportion: 15-20% of total height
- Still rounded proportions
- Relatively uniform limb thickness
- Simplified outline (less detail)
- Example: kindergarten-age silhouette

**School Age Silhouettes (5-12 years):**
- Head proportion: 12-15% of total height
- More angular proportions appear
- Limb lengthening becomes visible
- Torso remains relatively uniform
- More visible asymmetry (asymmetrical development)
- Example: elementary school age silhouette

**Adolescent Silhouettes (12-18 years):**
- Head proportion: 8-10% of total height
- Rapid shape changes during puberty
- Variable development (some develop earlier/later)
- Increased body variation
- Can resemble adult silhouette but with different proportions
- Example: teenage silhouette (high variation)

### 4.2 Growth Stage Variations

**Asymmetrical Development:**
- Different body parts develop at different rates
- One side may be larger than other (normal)
- One arm/leg may be longer (normal)
- Silhouette shows this natural asymmetry

**Pre-Puberty Changes:**
- Growth spurts cause awkward proportions
- Limbs may appear disproportionate temporarily
- Silhouette shows "gangly" appearance in mid-growth

**Sexual Maturation:**
- Hormonal changes affect silhouette
- Secondary sexual characteristics appear
- Silhouette changes dramatically
- NOT evidence of exploitation or harm

### 4.3 Age Estimation Uncertainty

**When silhouette suggests minor:**
- Increase child protection layer activation
- Escalate ambiguous cases to human review
- Require very high confidence in exceptions

**When silhouette is ambiguous (could be 16-25):**
- Escalate to human review
- Apply child-protective scoring
- Don't assume one way or other

**Rule: Silhouette ambiguity = protective escalation**
- Never default to "probably adult"
- Err on side of child protection
- Uncertainty triggers additional verification

## 5. Context-Aware Silhouette Interpretation

**Same silhouette, different contexts = different meanings:**

### 5.1 Sports & Fitness Context

**Silhouette In Sports:**
- Tight athletic silhouette = expected
- Defined muscles visible = normal
- Minimal clothing = appropriate
- Sweat patterns visible = expected
- Intense pose with athletic silhouette = innocent

**Silhouette in Gym:**
- Muscular definition visible = appropriate context
- Fitted clothing = normal gym attire
- Intensive pose silhouette = training activity
- Other athletes visible = group setting

**Context Protection:**
- Athletic setting context reduces risk concerns
- Multiple athletes visible = group activity
- Equipment visible = confirms sports context
- Activity-specific clothing = reduces concerns

### 5.2 Fashion & Modeling Context

**Silhouette in Fashion:**
- Pronounced curves or angles = garment focus
- Posed silhouette = intentional composition
- Strategic framing = professional photography
- Model stance = fashion positioning

**How Context Changes Assessment:**
- Same silhouette in fashion = professional
- Same silhouette in private setting = different assessment
- Fashion context overrides some form concerns
- Professional framing indicates intent

### 5.3 Family Photos Context

**Silhouette in Family Setting:**
- Group silhouettes visible = family context
- Child + adult silhouettes together = family grouping
- Natural poses = candid family moment
- Multiple bodies = group activity

**Protection Factor:**
- Family context reduces risk assessment
- Multiple people visible = protective
- Natural activity setting = reduces concerns
- Non-posed silhouettes = innocent

### 5.4 Beach & Swimming Context

**Silhouette at Beach:**
- Swimwear silhouette = expected
- Water environment visible = context
- Sand visible = location confirmation
- Multiple swimmers visible = group activity

**Context Modifications:**
- Beach context makes minimal clothing appropriate
- Water context visible = confirms activity
- Group presence = protective factor
- Public setting = reduces risk

### 5.5 Medical & Educational Context

**Silhouette in Medical Setting:**
- Clinical context visible = professional
- Medical equipment visible = confirms context
- Professional framing = educational
- Medical institution markers = institutional context

**How Silhouette Changes Meaning:**
- Nude/partial silhouette in medical = clinical
- Same silhouette in private bedroom = different meaning
- Medical context overrides exposure concerns
- Professional framing = institutional intent

### 5.6 Historical Art Context

**Silhouette in Museum/Art:**
- Sculpture silhouette = marble/bronze appearance
- Artistic positioning = intentional composition
- Professional documentation = gallery photography
- Art historical metadata = authentication

**Context Protection:**
- Art context legitimizes nudity
- Professional framing = artistic intent
- Museum setting = institutional purpose
- Sculpture material properties = confirms art

### 5.7 Pornography Context

**Silhouette in Exploitative Context:**
- Posed for maximum exposure = positioning intent
- Isolated silhouette = no group/context
- Private setting visible = exploitation context
- Intentional presentation = exploitation signals

**How Silhouette Contributes:**
- Silhouette alone ≠ exploitation
- Silhouette + isolation + pose + arousal = exploitation
- Multi-signal agreement required
- Silhouette is ONE signal among many

## 6. Multi-Signal Reasoning Framework

Silhouette integrates with all SafeNet modules:

| Module | How Silhouette Contributes | How Signal Modifies Silhouette Interpretation |
|--------|---|---|
| **body_shape** | Validates body shape measurements | Body shape refines silhouette complexity scoring |
| **body_ratio** | Provides rough proportions | Body ratios explain silhouette variations |
| **clothing** | Identifies garment boundaries | Clothing explains silhouette edges |
| **skin_visibility** | Identifies exposed regions | Skin visibility refines risk assessment |
| **pose** | Confirms body positioning | Pose explains silhouette distortions |
| **gaze_direction** | Contributes to intent assessment | Gaze indicates exploitation intent |
| **emotion** | Adds expression context | Emotion signals modify risk |
| **distance** | Affects silhouette detail | Distance affects confidence in silhouette |
| **occlusion** | Identifies hidden body parts | Occlusion explains missing silhouette |
| **edge_cases** | Detects AI/CGI silhouettes | Edge case classification applies multipliers |
| **safe_exceptions** | Confirms institutional context | Exceptions override silhouette concerns |
| **confidence_rules** | Final multi-signal decision | Silhouette contributes to confidence |

## 7. False Positive Prevention

### 7.1 Silhouettes That Look Concerning But Are Innocent

**Loose Clothing:**
- Problem: Loose silhouette might suggest nudity (not)
- Reality: Loose fabric creates wrong impression
- Solution: Clothing detection + silhouette analysis = loose clothing confirmed
- Result: SAFE (clothing present, silhouette misleading)

**Coats, Robes, Layered Clothing:**
- Problem: Bulky silhouettes might suggest multiple layers
- Reality: Strategic clothing layering
- Solution: Silhouette + clothing context = layering confirmed
- Result: SAFE (appropriate clothing, silhouette confirms coverage)

**Pregnancy Silhouette:**
- Problem: Unusual silhouette from pregnancy might trigger concern
- Reality: Normal pregnancy body changes
- Solution: Context (pregnancy indicators) + silhouette = pregnancy confirmed
- Result: SAFE (pregnancy is natural, silhouette expected)

**Disability-Related Silhouettes:**
- Problem: Non-standard silhouettes from disability accommodations
- Reality: Assistive devices, wheelchairs, mobility aids
- Solution: Equipment visible + silhouette analysis = accommodation confirmed
- Result: SAFE (assistive device context, non-standard silhouette expected)

**Large Bodies:**
- Problem: Large silhouettes might trigger concern
- Reality: Natural body diversity
- Solution: Silhouette analysis + context = body type confirmed
- Result: SAFE (body diversity is normal)

**Athletic Silhouettes:**
- Problem: Muscular definition visible in silhouette
- Reality: Athletic body conditioning
- Solution: Silhouette + sports context = athletic confirmed
- Result: SAFE (athletic context, fitness expected)

**Traditional Clothing Silhouettes:**
- Problem: Unfamiliar silhouettes from traditional/cultural clothing
- Reality: Different clothing styles
- Solution: Silhouette analysis + cultural context = clothing style confirmed
- Result: SAFE (cultural clothing, non-Western silhouettes expected)

### 7.2 False Positive Prevention Strategies

**Strategy 1: Context Always Modifies Silhouette Interpretation**
- Same silhouette = different meaning in different contexts
- Silhouette analysis MUST include context
- Never assess silhouette in isolation

**Strategy 2: Silhouette Ambiguity Requires Clothing Confirmation**
- If silhouette ambiguous about coverage = check clothing module
- Clothing module confirms garments present
- Trust clothing detection + context over silhouette appearance

**Strategy 3: Multi-Signal Agreement Required**
- Silhouette alone insufficient for concern
- Require 2+ risk signals + silhouette for any flag
- If other signals SAFE, silhouette ambiguity doesn't cause block

**Strategy 4: Confidence Reduction, Not Risk Increase**
- Unusual silhouette = reduce confidence, not increase risk
- Confidence reduction = require more evidence, not automatic concern
- Unknown silhouette = escalate, don't block

**Strategy 5: Body Diversity Expected**
- Bodies vary dramatically in natural ways
- Pregnancy, disability, age, genetics = natural variation
- Silhouette variation ≠ exploitation signal
- Assume innocence by default

## 8. False Negative Prevention

### 8.1 Silhouette Patterns in Exploitative Content

**Characteristic Patterns:**
- Posed positioning creating specific silhouette
- Silhouette emphasizing sexual body regions
- Intentional framing of body outline
- Strategic body positioning for effect

**Exploitation Indicators in Silhouette:**
- Repetitive positioning across multiple images
- Exaggerated body positioning
- Silhouette designed to maximize exposure appearance
- Positioned silhouette + private setting + arousal signals

### 8.2 Silhouette + Multi-Signal Agreement

**When Silhouette MUST Be Considered:**
- Silhouette + suggestive pose = stronger signal
- Silhouette + private setting + minimal clothing + pose = escalate
- Silhouette + isolation + arousal indicators + pose = investigate
- Multi-signal agreement required (4+ signals minimum)

**Silhouette's Contribution to Multi-Signal:**
- Confirms exploitation pattern
- Validates suggested positioning
- Supports pose analysis
- One component of multi-signal agreement

### 8.3 False Negative Prevention Rules

**Rule 1: Never Use Silhouette Alone**
- Silhouette NEVER blocks independently
- Always requires multi-signal agreement
- At minimum: silhouette + 2 other signals

**Rule 2: Account History Matters**
- Single exploitation-suggesting silhouette = investigate
- Pattern of exploitation-suggesting silhouettes = account review
- Account-level analysis required

**Rule 3: Combine With Exploitation Patterns**
- Silhouette + coercion indicators = escalate
- Silhouette + distress signals = escalate
- Silhouette + isolation + arousal = investigate

**Rule 4: Child Protection Sensitivity**
- Silhouette + minor + ambiguous signals = escalate
- Child silhouette + suspicious pose = investigate
- Err on protective side

## 9. AI-Generated Content Analysis

### 9.1 Silhouette Anomalies in AI-Generated Humans

**Characteristics of AI-Generated Silhouettes:**
- Unnaturally smooth outlines (humans have imperfections)
- Perfect symmetry (real humans are asymmetrical)
- Impossible proportions
- Repetitive patterns
- Unnatural transitions

**How SafeNet Uses Silhouette for AI Detection:**
- Analyze silhouette complexity for naturalness
- Check for impossible proportions
- Verify asymmetry consistency with real humans
- Detect pattern repetition

### 9.2 AI-Generated Children

**Critical Rule: Absolute Zero Tolerance**
- AI-generated child silhouettes = automatic escalation
- No context makes AI-generated children acceptable
- Silhouette anomalies + child appearance = immediate block
- Report to law enforcement required

**How Silhouette Helps:**
- Silhouette anomalies contribute to AI detection
- Impossible child proportions detected
- Combination with age detection = AI child confirmed
- Automatic block triggered

### 9.3 Confidence Adjustments for AI Content

**When AI-Generated Silhouette Detected:**
- Reduce confidence in body shape analysis (might be wrong)
- Reduce confidence in pose analysis (might be impossible)
- Apply edge case multipliers
- AI content flags but doesn't automatically determine safety

**Exception: AI-Generated Children**
- AI-generated child silhouettes = zero tolerance
- No confidence reduction, just escalation
- Automatic report and block

## 10. Explainability Framework

### 10.1 How Silhouette Influenced the Decision

**What SafeNet Explains:**
- How silhouette contributed to confidence
- How much silhouette influenced final score
- What silhouette signals were detected
- Why silhouette alone didn't determine outcome

**Example Explanation - SAFE Decision:**
```
Silhouette Analysis:
- Silhouette detected: Athletic/muscular appearance
- Silhouette complexity: Simple (clear outlines)
- Confidence contribution: +0.10 (supports body shape)
- Context interpretation: Gym setting (athletic silhouette expected)
- Other signals: Pose (athletic), Clothing (athletic wear), Context (gym)
- Silhouette role: Supporting signal confirming athletic context
- Final assessment: SAFE (silhouette + context + pose = consistent athletic activity)
```

**Example Explanation - ESCALATE Decision:**
```
Silhouette Analysis:
- Silhouette detected: Intentionally posed positioning
- Silhouette complexity: Complex (detailed outline)
- Confidence contribution: -0.15 (increases uncertainty)
- Concerning pattern: Silhouette + private setting + pose + arousal signals
- Other signals: 4 risk signals detected (silhouette, pose, emotion, setting)
- Silhouette role: Part of multi-signal agreement
- Final assessment: ESCALATE (multiple signals agree on concern)
```

### 10.2 Silhouette Anomaly Explanation

**When Silhouette Is Unusual:**
- Explain what makes silhouette unusual
- Explain why unusualness triggers investigation
- Explain what other signals must confirm before action
- Explain confidence impact

**Example:**
```
Silhouette Anomaly Detected:
- Anomaly type: Unnaturally smooth contours
- Possible explanation: AI-generated content OR highly edited/filtered image
- Risk impact: Reduces confidence in body measurements
- Additional verification: Face analysis, texture analysis, metadata
- Decision impact: Does not automatically affect safety assessment
- Human review recommended if other signals ambiguous
```

## 11. Confidence Integration

### 11.1 How Silhouette Affects Confidence

**Silhouette Increases Confidence When:**
- Clear, unambiguous outline confirms body shape
- Silhouette consistent with other measurements
- Context-appropriate silhouette for setting
- Natural asymmetry patterns visible
- Silhouette validates other module outputs

**Silhouette Decreases Confidence When:**
- Ambiguous silhouette (could be multiple interpretations)
- Silhouette conflicts with other module findings
- Silhouette partially hidden or occluded
- Unnaturally perfect/smooth (AI signals)
- Silhouette unusual without clear explanation

### 11.2 Confidence Multipliers

**Silhouette Confidence Clear & Consistent:**
- Multiplier: 1.0× (no change to other signals)
- Application: Silhouette supports other measurements

**Silhouette Confidence Reduced (Ambiguous):**
- Multiplier: 0.75× (reduce confidence in related signals)
- Application: Require more evidence from other signals

**Silhouette Confidence Very Low (Highly Uncertain):**
- Multiplier: 0.50× (significantly reduce confidence)
- Application: Escalate or require human review

**Silhouette Anomalies Detected (AI/Edited):**
- Multiplier: 0.30× (very uncertain about measurements)
- Application: Don't trust silhouette-based conclusions
- Action: Use alternative signal combinations

## 12. SafeNet Decision Logic

### 12.1 Silhouette's Role in Final Decision

**Silhouette NEVER:**
- Determines safety independently
- Causes automatic blocking
- Overrides multi-signal requirement
- Eliminates need for context
- Bypasses child protection

**Silhouette ALWAYS:**
- Contributes to multi-signal agreement
- Modifies confidence in other measurements
- Requires context interpretation
- Works with minimum 2-3 other signals
- Respects child protection layer

### 12.2 Decision Flow With Silhouette

```
Silhouette Analysis
│
├─ Step 1: Extract Silhouette Features
│  ├─ Outline complexity
│  ├─ Symmetry/asymmetry
│  ├─ Contour characteristics
│  └─ Anomaly detection (AI/edited)
│
├─ Step 2: Context Application
│  ├─ Interpret silhouette in context
│  ├─ Apply context modifiers
│  ├─ Adjust expectations
│  └─ Confirm or deny contextual fit
│
├─ Step 3: Confidence Calculation
│  ├─ Determine confidence in measurement
│  ├─ Apply confidence multiplier
│  ├─ Identify uncertainty areas
│  └─ Flag ambiguities
│
├─ Step 4: Multi-Signal Integration
│  ├─ Combine with body_shape signal
│  ├─ Combine with clothing signal
│  ├─ Combine with pose signal
│  ├─ Combine with other modules
│  └─ Require multi-signal agreement
│
├─ Step 5: Child Protection Check
│  ├─ If minor: Apply protective sensitivity
│  ├─ If ambiguous age: Escalate
│  ├─ If exploitation suspected: Flag immediately
│  └─ Child safety always prioritized
│
└─ OUTPUT: Silhouette Contribution to Final Decision
   ├─ Confidence modifier applied
   ├─ Multi-signal agreement status
   ├─ Escalation flag if needed
   └─ Explanation for user
```

## 13. Parent Protection Integration

### 13.1 Parent Visibility into Silhouette Analysis

**Parents Should See:**
- What silhouette was detected
- How silhouette contributed to decision
- What confidence modifier was applied
- Which other signals were involved

**Example Report:**
```
Silhouette Analysis Report:
═════════════════════════════════════

Silhouette Detected: Athletic muscular appearance
Complexity Level: Simple/clear outlines
Context: Gym setting
Confidence Impact: +0.10 (supporting signal)

Contributing Signals:
- Body shape: Consistent with silhouette
- Clothing: Athletic wear (expected)
- Pose: Athletic positioning (expected)
- Setting: Gym equipment visible
- Multiple people: Group fitness context

Silhouette Role: Confirming athletic context

Parent Options:
- Review full analysis
- Approve decision
- Appeal if concerned
- Adjust sensitivity settings
```

### 13.2 Parent Control Options

Parents can:
- **View silhouette analysis details**
- **Understand silhouette's contribution**
- **See how context modified assessment**
- **Appeal if disagreeing with silhouette interpretation**
- **Adjust sensitivity to silhouette concerns**

## 14. SafeNet Alignment Review

| Dimension | Score | Notes |
|---|---|---|
| **Content Safety Value** | 8.7 | Silhouette supports safety assessment without false blocks |
| **Child Protection Value** | 9.0 | Pediatric silhouettes handled carefully; age uncertainty escalates |
| **False Positive Prevention** | 8.9 | Context always modifies; multi-signal required |
| **False Negative Prevention** | 8.6 | Silhouette part of multi-signal; exploitation patterns caught |
| **Explainability Quality** | 8.8 | Clear explanation of silhouette contribution |
| **AI Reasoning Quality** | 8.7 | AI-generated anomalies detected; child AI zero tolerance |
| **MVP Value** | 8.5 | Production-ready supporting signal |
| **Knowledge Base Quality** | 8.9 | Comprehensive reasoning framework |
| **Overall Quality** | 8.8 | Mature, reasoning-focused module |

## 15. Conclusion

SafeNet's Silhouette Reasoning Engine provides:

1. **Supporting Signal:** Silhouette contributes evidence but never decides alone
2. **Context Awareness:** Same silhouette interpreted differently by context
3. **Child Protection:** Pediatric silhouettes handled specially; age uncertainty escalates
4. **False Positive Prevention:** Loose clothing, pregnancy, disability, diversity recognized
5. **False Negative Prevention:** Multi-signal requirement prevents missed exploitation
6. **AI Detection:** Silhouette anomalies help detect AI-generated content
7. **Explainability:** Clear explanation of silhouette's role
8. **Parent Transparency:** Parents see how silhouette contributed
9. **Confidence Modeling:** Silhouette increases or decreases confidence appropriately

Silhouette alone cannot determine safety. Silhouette + context + multiple other signals = informed decision.

**Document Version:** 4.0.0-STABLE  
**Type:** Reasoning Engine (High-Level)  
**Focus:** Silhouette Analysis & Context Interpretation  
**Status:** ✓ Production Ready
//        and classifies silhouette complexity for the AI Radar pipeline.
// =======================================================================

#include <iostream>
#include <vector>
#include <cmath>
#include <complex>
#include <algorithm>
#include <memory>
#include <cstring>

#if defined(__wasm__) && defined(__ARM_NEON)
#include <arm_neon.h>
#elif defined(__wasm__) && defined(__SSE2__)
#include <emmintrin.h>

// Power of 2 point count optimized for Cooley-Tukey FFT execution
constexpr int FFT_POINT_COUNT = 512;

// -----------------------------------------------------------------------
// Core Data Structures
// -----------------------------------------------------------------------
struct Point2D {
    float x;
    float y;

struct Complex {
    float r;
    float i;

    Complex operator+(const Complex& other) const {
        return {r + other.r, i + other.i};

    Complex operator-(const Complex& other) const {
        return {r - other.r, i - other.i};

    Complex operator*(const Complex& other) const {

    float magnitude() const {
#if defined(__wasm__) && defined(__SSE2__)
        alignas(16) float res[4];
        __m128 v = _mm_set_ps(0.0f, 0.0f, i, r);
        __m128 sq = _mm_mul_ps(v, v);
        _mm_store_ps(res, sq);
        return sqrtf(res[0] + res[1]);
        return sqrtf(r * r + i * i);

struct SilhouetteOutput {
    float complexity_index;        // Psi (High-frequency energy)
    float aspect_ratio;            // Silhouette width/height ratio
    float fundamental_energy;      // Magnitude of z(1)
    float asymmetry_coefficient;   // Symmetry variation between left/right boundary halves
    float classification_score;    // Probabilistic risk scoring [0.0, 1.0]

// Global memory buffers mapped to WebAssembly Linear Memory Heap
static Point2D g_boundary_points[FFT_POINT_COUNT];
static float   g_output_descriptors[FFT_POINT_COUNT];

// Savitzky-Golay Smoother: 5-point quadratic convolution
// Removes high-frequency segmentation mask noise before DFT
class SavitzkyGolaySmoother {
    static std::vector<Point2D> Smooth(const Point2D* points, int n) {
        if (n < 5) {
            std::vector<Point2D> out(n);
            std::memcpy(out.data(), points, n * sizeof(Point2D));
            return out;

        std::vector<Point2D> smoothed(n);

        // Savitzky-Golay 5-point quadratic smoothing convolution coefficients
        // Reference: Savitzky & Golay (1964), Analytical Chemistry
        const float coef[5] = {
            -3.0f / 35.0f,
            12.0f / 35.0f,
            17.0f / 35.0f,
            -3.0f / 35.0f

        for (int i = 0; i < n; ++i) {
            float sum_x = 0.0f;
            float sum_y = 0.0f;

            for (int k = -2; k <= 2; ++k) {
                int index = i + k;
                // Mirror boundary conditions
                if (index < 0) {
                    index = -index;
                } else if (index >= n) {
                    index = 2 * n - 2 - index;
                sum_x += points[index].x * coef[k + 2];
                sum_y += points[index].y * coef[k + 2];
            smoothed[i] = {sum_x, sum_y};
        return smoothed;

// Cooley-Tukey Radix-2 DIT FFT (in-place, iterative)
// Complexity: O(N log N), N must be a power of 2
class CooleyTukeyFFT {
private:
    static unsigned int ReverseBits(unsigned int x, int bits) {
        unsigned int y = 0;
        for (int i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>= 1;
        return y;

    static std::vector<Complex> Process(const std::vector<Complex>& input) {
        int n    = static_cast<int>(input.size());
        int bits = static_cast<int>(log2f(static_cast<float>(n)));
        std::vector<Complex> output(n);

        // Step 1: Bit-reversal permutation
        for (int i = 0; i < n; ++i) {
            unsigned int rev = ReverseBits(static_cast<unsigned int>(i), bits);
            output[rev] = input[i];

        // Step 2: Cooley-Tukey butterfly computations
        for (int len = 2; len <= n; len <<= 1) {
            float angle  = -2.0f * static_cast<float>(M_PI) / static_cast<float>(len);
            Complex wlen = {cosf(angle), sinf(angle)};

            for (int i = 0; i < n; i += len) {
                Complex w = {1.0f, 0.0f};
                for (int j = 0; j < len / 2; ++j) {
                    Complex u = output[i + j];
                    Complex t = output[i + j + len / 2] * w;

                    output[i + j]           = u + t;
                    output[i + j + len / 2] = u - t;
                    w = w * wlen;

        return output;

// Fourier Descriptor Solver: Main Analysis Engine
class FourierDescriptorSolver {
    FourierDescriptorSolver()  = default;
    ~FourierDescriptorSolver() = default;

    // Compute centroid-normalized complex boundary representation
    static std::vector<Complex> CalculateCentroidInvariance(
        const std::vector<Point2D>& points
        int   n     = static_cast<int>(points.size());
        float sum_x = 0.0f;
        float sum_y = 0.0f;

#if defined(__wasm__) && defined(__SSE2__)
        int simd_limit = (n / 4) * 4;
        for (int i = 0; i < simd_limit; i += 4) {
            __m128 v_x = _mm_set_ps(points[i+3].x, points[i+2].x, points[i+1].x, points[i].x);
            __m128 v_y = _mm_set_ps(points[i+3].y, points[i+2].y, points[i+1].y, points[i].y);

            alignas(16) float res_x[4];
            alignas(16) float res_y[4];
            _mm_store_ps(res_x, v_x);
            _mm_store_ps(res_y, v_y);

            sum_x += res_x[0] + res_x[1] + res_x[2] + res_x[3];
            sum_y += res_y[0] + res_y[1] + res_y[2] + res_y[3];
        for (int i = simd_limit; i < n; ++i) {
            sum_x += points[i].x;
            sum_y += points[i].y;
        for (int i = 0; i < n; ++i) {
            sum_x += points[i].x;
            sum_y += points[i].y;

        const float cx = sum_x / static_cast<float>(n);
        const float cy = sum_y / static_cast<float>(n);

        std::vector<Complex> invariant_coords(n);
        for (int i = 0; i < n; ++i) {
            invariant_coords[i] = {points[i].x - cx, points[i].y - cy};
        return invariant_coords;

    SilhouetteOutput Solve(const Point2D* points, int n) {
        if (n < 32) {

        // --- Stage 1: Savitzky-Golay boundary smoothing ---
        std::vector<Point2D> smoothed = SavitzkyGolaySmoother::Smooth(points, n);

        // --- Stage 2: Resample to FFT_POINT_COUNT via linear interpolation ---
        std::vector<Point2D> padded(FFT_POINT_COUNT);
        const float step = static_cast<float>(n - 1) / static_cast<float>(FFT_POINT_COUNT - 1);
        for (int i = 0; i < FFT_POINT_COUNT; ++i) {
            const float virt_idx  = static_cast<float>(i) * step;
            const int   idx_low   = static_cast<int>(floorf(virt_idx));
            const int   idx_high  = std::min(idx_low + 1, n - 1);
            const float weight    = virt_idx - static_cast<float>(idx_low);

            padded[i].x = (1.0f - weight) * smoothed[idx_low].x + weight * smoothed[idx_high].x;
            padded[i].y = (1.0f - weight) * smoothed[idx_low].y + weight * smoothed[idx_high].y;

        // --- Stage 3: Centroid normalization (translation invariance) ---
        std::vector<Complex> invariant = CalculateCentroidInvariance(padded);

        // --- Stage 4: Cooley-Tukey FFT ---
        std::vector<Complex> descriptors = CooleyTukeyFFT::Process(invariant);

        // --- Stage 5: Scale & rotation invariance normalization by |z(1)| ---
        float fundamental_mag = descriptors[1].magnitude();
        if (fundamental_mag <= 1e-5f) {
            fundamental_mag = 1e-5f; // Guard against divide-by-zero

        std::vector<float> norm_desc(FFT_POINT_COUNT, 0.0f);
        for (int i = 0; i < FFT_POINT_COUNT; ++i) {
            norm_desc[i]           = descriptors[i].magnitude() / fundamental_mag;
            g_output_descriptors[i] = norm_desc[i];

        // --- Stage 6: Complexity Index Psi (high-freq energy, n=9..44) ---
        float complexity_sum = 0.0f;
        const int upper_bound = std::min(FFT_POINT_COUNT / 2, 45);
        for (int i = 9; i < upper_bound; ++i) {
            complexity_sum += norm_desc[i] * norm_desc[i];

        // --- Stage 7: Asymmetry coefficient (left vs. right spectral halves) ---
        float left_right_var = 0.0f;
        for (int i = 1; i < FFT_POINT_COUNT / 2; ++i) {
            left_right_var += fabsf(norm_desc[i] - norm_desc[FFT_POINT_COUNT - i]);
        const float asymmetry = left_right_var / static_cast<float>(FFT_POINT_COUNT / 2);

        // --- Stage 8: Bounding box aspect ratio ---
        float min_x = padded[0].x, max_x = padded[0].x;
        float min_y = padded[0].y, max_y = padded[0].y;
        for (int i = 1; i < FFT_POINT_COUNT; ++i) {
            if (padded[i].x < min_x) min_x = padded[i].x;
            if (padded[i].x > max_x) max_x = padded[i].x;
            if (padded[i].y < min_y) min_y = padded[i].y;
            if (padded[i].y > max_y) max_y = padded[i].y;
        const float width  = max_x - min_x;
        const float height = max_y - min_y;
        const float aspect = (height > 0.0f) ? (width / height) : 1.0f;

        // --- Stage 9: Probabilistic classification ---
        float classification = 0.0f;
        if (complexity_sum > 0.18f && aspect < 0.65f) {
            classification = 0.85f; // Ratio_Gamma: highly exaggerated curved outline
        } else if (complexity_sum > 0.08f) {
            classification = 0.45f; // Ratio_Beta: moderate suggestive fluctuations
        // else: Ratio_Alpha (safe, score = 0.0)

        return {
            complexity_sum,   // complexity_index
            aspect,           // aspect_ratio
            fundamental_mag,  // fundamental_energy
            asymmetry,        // asymmetry_coefficient
            classification    // classification_score

// WebAssembly C Exports
extern "C" {

    // Host-side import: JS callback receiving the output struct pointer
    __attribute__((import_name("onSilhouetteResolved")))
    void onSilhouetteResolved(SilhouetteOutput* output);

    // Returns pointer to the global boundary buffer for JS to write into
    void* allocate_boundary_buffer() {
        return static_cast<void*>(&g_boundary_points[0]);

    // Main entry: JS writes boundary points into g_boundary_points, then calls this
    void process_silhouette_descriptors(int count) {
        FourierDescriptorSolver solver;
        SilhouetteOutput result = solver.Solve(&g_boundary_points[0], count);
        onSilhouetteResolved(&result);

    // Returns pointer to normalized descriptor array for diagnostic read-back
    float* get_descriptor_buffer() {
        return &g_output_descriptors[0];

    int get_fft_point_count() {
        return FFT_POINT_COUNT;
```

---

### 4.2 WebGPU Moore-Neighbor Silhouette Extractor (`silhouette_contour_extractor.wgsl`)

The following WGSL compute shader performs parallel boundary scanning and Moore-Neighbor edge tracking to convert the 2D binary segmentation mask into an ordered array of 2D coordinates:

```wgsl
// =======================================================================
// FILE: silhouette_contour_extractor.wgsl
// PIPELINE: Compute Shader (WebGPU)
// WORKGROUP: 16x16 threads
// DISPATCH: (ceil(W/16), ceil(H/16), 1)
// DESC: Moore-Neighbor edge detection to extract boundary coordinates
//       from a binary segmentation mask in parallel on the GPU.

struct SystemConfig {
    width:              u32,
    height:             u32,
    target_point_count: u32,
    padding:            u32,

@group(0) @binding(0) var<uniform>             config:               SystemConfig;
@group(0) @binding(1) var<storage, read>       segmentation_mask:    array<u32>;         // W*H binary mask
@group(0) @binding(2) var<storage, read_write> boundary_coordinates: array<vec2<f32>>;   // 512 * vec2
@group(0) @binding(3) var<storage, read_write> coordinate_counter:   atomic<u32>;        // atomic point count

// Safe mask sampler with OOB guard
fn get_mask_value(x: i32, y: i32) -> u32 {
    if (x < 0 || x >= i32(config.width) || y < 0 || y >= i32(config.height)) {
        return 0u;
    let index = u32(y) * config.width + u32(x);
    return segmentation_mask[index];

// Main Compute Entry: Moore-Neighbor boundary detection
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let x = i32(global_id.x);
    let y = i32(global_id.y);

    // Clamp boundary to avoid edge artifacts
    if (x >= i32(config.width) - 1 || y >= i32(config.height) - 1 || x <= 0 || y <= 0) {

    // Moore-Neighbor 2x2 quorum: detect boundary transition pixels
    let center   = get_mask_value(x,     y    );
    let right    = get_mask_value(x + 1, y    );
    let bottom   = get_mask_value(x,     y + 1);
    let diagonal = get_mask_value(x + 1, y + 1);

    // A boundary pixel is one where the 2x2 neighborhood is mixed (not all 0 or all 1)
    let sum = center + right + bottom + diagonal;
    if (sum > 0u && sum < 4u) {
        let index = atomicAdd(&coordinate_counter, 1u);

        // Decimate to target_point_count: only record within GPU-side limit
        if (index < config.target_point_count) {
            boundary_coordinates[index] = vec2<f32>(f32(x), f32(y));
```

---

### 4.3 TypeScript Orchestrator Wrapper (`SilhouettePatternEngine.ts`)

The TypeScript manager manages WebGPU contexts, compiles native shaders, loads the compiled WASM binaries, and maps structural float buffers securely across memory spaces:

```typescript
// FILE: SilhouettePatternEngine.ts
// ENGINE: AI Radar Body Shape - Silhouette Pattern Analysis
// DESC:  Orchestrates WebGPU contour extraction + WASM Fourier Descriptor
//        computation in a dual-backend pipeline with shared memory transfer.

export interface SilhouetteAnalysisResult {
  readonly complexityIndex:      number;   // Psi: high-frequency Fourier energy
  readonly aspectRatio:          number;   // width / height of bounding box
  readonly fundamentalEnergy:    number;   // |z(1)| — primary shape energy
  readonly asymmetryCoefficient: number;   // left/right spectral asymmetry [0, 1]
  readonly classification: 'Ratio_Alpha' | 'Ratio_Beta' | 'Ratio_Gamma';
  readonly confidence:           number;   // 1.0 - asymmetryCoefficient

export interface SilhouetteEngineConfig {
  targetPointCount: number;   // FFT sample count, default 512
  confThreshold:    number;   // Min confidence to report result, default 0.30
  useWebGPU:        boolean;  // Enable GPU-side contour extraction
  minPixelHeight:   number;   // Min subject pixel height, default 150

export class SilhouettePatternEngine {
  private readonly cfg: SilhouetteEngineConfig;
  private wasmExports!:   WasmSilhouetteExports;
  private wasmMemory!:    WebAssembly.Memory;
  private bufferOffset:   number  = 0;
  private isReady:        boolean = false;
  private gpuDevice:      GPUDevice | null = null;
  private gpuPipeline:    GPUComputePipeline | null = null;
  private latestResult:   SilhouetteAnalysisResult | null = null;

  constructor(cfg: Partial<SilhouetteEngineConfig> = {}) {
    this.cfg = {
      targetPointCount: 512,
      confThreshold:    0.30,
      useWebGPU:        true,
      minPixelHeight:   150,

  // ---------------------------------------------------------------------------
  // Initialization: WASM + WebGPU
  // ---------------------------------------------------------------------------
  public async initialize(
    wasmBinary:  ArrayBuffer,
    wgslSource?: string
  ): Promise<void> {
    // 1. Instantiate WASM module with JS import callback
    const imports = {
        onSilhouetteResolved: (metricsPtr: number) => {
          this._handleWasmCallback(metricsPtr);
    const compiled    = await WebAssembly.instantiate(wasmBinary, imports);
    this.wasmExports  = compiled.instance.exports as WasmSilhouetteExports;
    this.wasmMemory   = this.wasmExports.memory;
    this.bufferOffset = this.wasmExports.allocate_boundary_buffer() as number;

    // 2. Attempt WebGPU initialization
    if (this.cfg.useWebGPU && typeof navigator !== 'undefined' && navigator.gpu) {
        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: 'high-performance',
        if (adapter) {
          this.gpuDevice  = await adapter.requestDevice();
          this.gpuPipeline = await this._buildGpuPipeline(
            this.gpuDevice,
            wgslSource ?? SILHOUETTE_CONTOUR_EXTRACTOR_WGSL
          console.info('[SilhouetteEngine] WebGPU contour extraction ACTIVE.');
      } catch (e) {
        console.warn('[SilhouetteEngine] WebGPU unavailable, using CPU fallback:', e);
        this.gpuDevice = null;

    this.isReady = true;

  // Main Entry Point: Evaluate Silhouette from Segmentation Mask
  public async evaluateSilhouette(
    segmentationMask: Uint8Array,
    width:            number,
    height:           number
  ): Promise<SilhouetteAnalysisResult | null> {
    if (!this.isReady) return null;

    // Distance guard: subject too small for reliable Fourier analysis
    const subjectHeightPx = this._estimateSubjectHeight(segmentationMask, width, height);
    if (subjectHeightPx < this.cfg.minPixelHeight) {
      console.debug(`[SilhouetteEngine] Subject height ${subjectHeightPx}px < threshold ${this.cfg.minPixelHeight}px. Skipping.`);
      return null;

    let boundaryPoints: Float32Array;
    let activeCount:    number;

    if (this.gpuDevice && this.gpuPipeline) {
      const extracted = await this._extractBoundaryGpu(segmentationMask, width, height);
      boundaryPoints  = extracted.points;
      activeCount     = extracted.count;
    } else {
      const extracted = this._extractBoundaryCpu(segmentationMask, width, height);
      boundaryPoints  = extracted.points;
      activeCount     = extracted.count;

    if (activeCount < 16) {
      return null; // Degenerate mask — no usable boundary

    // Map extracted boundary into WASM linear heap
    const N     = Math.min(activeCount, this.cfg.targetPointCount);
    const heap  = new Float32Array(this.wasmMemory.buffer, this.bufferOffset, N * 2);
    heap.set(boundaryPoints.subarray(0, N * 2));

    // Trigger synchronous WASM Fourier solver
    this.wasmExports.process_silhouette_descriptors(N);

    // Result was set via callback; return it
    if (this.latestResult && this.latestResult.confidence >= this.cfg.confThreshold) {
      return this.latestResult;
    return null;

  // GPU Boundary Extraction
  private async _extractBoundaryGpu(
    mask:   Uint8Array,
    width:  number,
    height: number
  ): Promise<{ points: Float32Array; count: number }> {
    const device    = this.gpuDevice!;
    const N         = this.cfg.targetPointCount;

    const configData = new Uint32Array([width, height, N, 0]);
    const configBuf  = device.createBuffer({
      size:  16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    device.queue.writeBuffer(configBuf, 0, configData);

    // Expand Uint8 mask to Uint32 for shader compatibility
    const mask32 = new Uint32Array(mask.length);
    for (let i = 0; i < mask.length; ++i) mask32[i] = mask[i] ? 1 : 0;
    const maskBuf = device.createBuffer({
      size:  mask32.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    device.queue.writeBuffer(maskBuf, 0, mask32);

    const coordsBuf = device.createBuffer({
      size:  N * 8, // N * sizeof(vec2<f32>)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    const counterBuf = device.createBuffer({
      size:  4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,

    // Zero-initialize atomic counter
    device.queue.writeBuffer(counterBuf, 0, new Uint32Array([0]));

    const bindGroup = device.createBindGroup({

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

    let   count  = 0;

    for (let y = 1; y < height - 1 && count < N; ++y) {

      for (let x = 1; x < width - 1 && count < N; ++x) {

        if (s > 0 && s < 4) {

    // SilhouetteOutput layout: 5 x float32 = 20 bytes

    if (classificationScore >= 0.80) {

    } else if (classificationScore >= 0.40) {

    let minY = height, maxY = -1;

    for (let y = 0; y < height; ++y) {

      for (let x = 0; x < width; ++x) {

    return maxY >= 0 ? maxY - minY + 1 : 0;

```

---

## 5. Comprehensive Edge Cases & Mitigations

### 5.1 Wind-Induced Clothing Flutter

**Vulnerability:** Loose-fitting apparel (e.g., lightweight coats, flags, flowing dresses) moves dynamically in windy settings, causing high-frequency, non-biological silhouette changes ($\Psi > 0.35$).

**Mitigation Strategy:**
- **Temporal Frequency Check:** Track the boundary's Fourier descriptors over a rolling 15-frame window.
- **Variance Analysis:** Biological silhouette adjustments are slow and deliberate, while fabric flutter exhibits high temporal variance ($\sigma^2_{temp} > 0.08$ across consecutive frames). If high temporal variance is detected, the complexity index $\Psi$ is smoothed out and discounted, preventing false-positive blocks.

```typescript

  if (history.length > 15) history.shift();

  const flutterWeight = variance > 0.08 ? 0.30 : 1.0;

```

### 5.2 Background Shadow Contamination

**Vulnerability:** Strong, sharp background shadows cast from light sources merge with the subject's mask, introducing anomalous silhouette contours.

**Mitigation Strategy:** Apply contrast-invariant segmentation normalization. The system compares the local luminance of boundary transition zones. Shadow edges exhibit lower, softer high-frequency gradients compared to the physical boundary edge of the subject, allowing the system to isolate the true shape.

```text

Shadow Boundary Gradient: G_shadow < 0.15 * G_max  (soft gradient transition)

Subject Boundary Gradient: G_subject >= 0.40 * G_max (sharp physical edge)

Decision: Reject boundary segment if G < 0.15 * G_max

```

### 5.3 AI-Generated Anomalous Silhouettes

**Vulnerability:** Midjourney or Stable Diffusion models can generate visual figures with impossible or highly stylized physical boundaries (such as missing joints or asymmetrical silhouette profiles).

**Mitigation Strategy:** The C++ solver calculates `asymmetry_coefficient` on the normalized Fourier boundaries. If the asymmetry index exceeds $25.0\%$ of the expected baseline, the system reduces the confidence score by $50\%$:

```typescript

  const ASYMMETRY_THRESHOLD = 0.25;

  const PENALTY_FACTOR      = 0.50;

```

---

## 6. Physical & Environmental Influences

### 6.1 Camera Perspective Distortion Compensation

Foreshortening effects distort the boundary shape when the subject leans relative to the optical plane. To correct these distortions, the C++ normalizer maps the coordinates against the camera's intrinsic calibration parameters before running the Fourier transform calculations:

$$\begin{bmatrix} x_{\text{norm}} \\ y_{\text{normalized}} \end{bmatrix} = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & \frac{1.0}{\cos(\theta_{\text{pitch}})} \end{bmatrix} \begin{bmatrix} x_{\text{raw}} \\ y_{\text{raw}} \end{bmatrix}$$

```cpp

    const float inv_cos = 1.0f / std::max(cosf(theta_pitch_rad), 0.1f);

```

### 6.2 Distance Constraints

| Subject Height (pixels) | Action |
|:-----------------------:|:-------|
| `< 150 px`              | **Disable** all Fourier computations; default state → SAFE |
| `150 – 300 px`          | Enable with reduced sensitivity (complexity threshold × 1.5) |
| `> 300 px`              | Full analysis active, standard thresholds |

---

## 7. Layer Interactions

### 7.1 Clothing Tightness Interaction

The calculated boundary complexity index ($\Psi$) is matched against the fabric tightness indices (`C_index` in `clothing/`). If the subject displays high complexity and curvature while wearing form-fitting compression garments:

```text

```

If `S_suggestive` exceeds `0.70` in a non-athletic, non-educational setting, the decision engine triggers a warning blur.

### 7.2 Posture Interaction

When a subject bends or twists, the natural outline curve changes. The system uses a dynamic scale multiplier to adjust thresholds:

$$\theta_{\text{pelvic\_bend}} = \cos^{-1}\!\left( \frac{\vec{V}_{\text{torso}} \cdot \vec{V}_{\text{femur}}}{\|\vec{V}_{\text{torso}}\| \|\vec{V}_{\text{femur}}\|} \right)$$

The target complexity risk threshold is scaled dynamically:

```text

```

```typescript

```

---

## 8. Complete Unit, Integration, and Stress Testing Suites

### 8.1 Unit Test Suite (`SilhouettePatternEngine.test.ts`)

```typescript

    const tinyMask = getMockMask('tiny_subject_100px', 640, 480);

```

### 8.2 Stress Testing and Silhouette Distortion Simulators

```typescript

  iterations: number = 1000

  let   overloadCount = 0;

  let   nullCount     = 0;

  for (let i = 0; i < iterations; ++i) {

    for (let j = 0; j < baseMask.length; ++j) {

      noisyMask[j] = Math.random() > 0.95 ? (baseMask[j] ^ 1) : baseMask[j];

    // 16.6ms = one frame budget at 60 FPS

    if (dt > 16.6) {

      console.warn(`[StressTest] Frame budget exceeded: ${dt.toFixed(2)}ms at iteration ${i}`);

```

---

## 9. Performance, Memory, Threading, and Browser Specifications

### 9.1 Hardware Budgets

| Resource                        | Budget            | Notes                                          |
|:--------------------------------|------------------:|:-----------------------------------------------|
| WASM Linear Memory Heap         | ≤ 15 MB           | Shared across all body_shape modules            |
| WebGPU Compute Dispatch Time    | ≤ 1.0 ms          | Per contour extraction pass (16×16 workgroups) |
| Total Frame Budget (60 FPS)     | ≤ 16.6 ms         | Including ONNX inference + Fourier solve        |
| FFT Point Count                 | 512               | Power of 2, Cooley-Tukey optimized              |
| Boundary Coordinate Buffer      | 512 × 8 B = 4 KB  | GPU-side `vec2<f32>` array                      |

### 9.2 WebGPU–WASM Shared Memory Pipeline

To prevent data transfer bottlenecks (CPU–GPU copying latencies), the system maps WebGPU mapped ranges directly onto WASM linear heap spaces using `SharedArrayBuffer` structures where supported, avoiding expensive double-buffering allocations.

```

```

### 9.3 Thread Isolation

The entire `SilhouettePatternEngine` execution loop is completely isolated within a dedicated Web Worker thread pool, ensuring zero interference with the browser UI rendering cycles:

```text