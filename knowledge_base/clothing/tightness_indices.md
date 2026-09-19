# Garment Tightness, Compression, and Anatomical Conformity Intelligence Framework

This document is the authoritative knowledge base for understanding garment tightness in visual systems.
It defines how garments conform to the human body, how compression behaves, how contour visibility emerges, how tightness differs across anatomical regions, and how tightness should be interpreted safely.

This framework is conceptual and research oriented. It focuses on human body geometry, garment behavior, anatomical conformity, contour perception, material response, temporal change, confidence modeling, uncertainty handling, and explainable reasoning.

The central principle is simple:

* tightness is not risk by itself,
* tightness is a signal within a broader garment-understanding framework,
* tightness must be interpreted with body variation, garment behavior, context, and temporal evidence.

---

## 1. Document Purpose and Scope

### 1.1 Purpose

The purpose of this framework is to provide a comprehensive intellectual foundation for understanding garment tightness as a visual and biological phenomenon.
It supports explanation of:

* how clothing conforms to the body,
* how compression alters body shape perception,
* how contour visibility emerges through fabric,
* how tightness varies by region, body type, garment type, and motion,
* how tightness should be interpreted safely in human-facing analysis systems.

### 1.2 Scope

This framework covers:

* body variation and its impact on visual tightness interpretation,
* garment mechanics and material response,
* anatomical region-specific conformity behavior,
* confidence and uncertainty structures,
* temporal changes caused by posture and motion,
* false positive protection, edge cases, failure modes, adversarial analysis, explainability, and governance.

### 1.3 Non-Scope

This document does not provide execution architecture, runtime scheduling, telemetry schemas, deployment strategy, hardware optimization, memory management, GPU-oriented implementation, or platform-specific execution design.
It is a conceptual knowledge architecture intended for future explainable visual understanding systems.

## 2. Foundational Definitions

### 2.1 Tightness

Tightness refers to the degree to which a garment follows the contours of the body and holds its form relative to the underlying anatomy.
It is a relationship between garment geometry, body geometry, tissue prominence, fabric elasticity, and surface contact behavior.

### 2.2 Compression

Compression is the force or effect by which a garment reduces the visible or geometric freedom of a body region.
Compression may be strong, moderate, or minimal depending on material, structure, fit, and body shape.

### 2.3 Conformity

Conformity describes how closely a garment tracks the body while maintaining a stable relationship to its surface.
Conformity is not identical to compression. A garment may conform strongly without applying high compression, and a garment may compress without following every contour equally well.

### 2.4 Contour Visibility

Contour visibility is the appearance of body shape through or around a garment.
It can arise from drape, stretch, pressure, sub-surface shadowing, or fabric tension.

### 2.5 Surface Contact

Surface contact describes the degree to which fabric meets the body across a region rather than remaining suspended above it.
High surface contact can produce high conformity, but it can also appear misleading under poor lighting or with padding.

### 2.6 Drape Behavior

Drape behavior governs how fabric hangs and flexes around the body.
Drape can create apparent tightness when fabric falls in a body-following manner and apparent looseness when it hangs away from the body.

### 2.7 Recovery Behavior

Recovery behavior describes how a material returns to its original shape after stretching or deformation.
Strong recovery can maintain a body-following form across motion.

### 2.8 Tension Distribution

Tension distribution describes how force is spread across body regions.
A garment may be tight in one region and loose in another, and an expert interpretation must consider these local variations rather than treating the whole garment as uniform.

## 3. Core Principles of Tightness Interpretation

### 3.1 Tightness Is Multidimensional

Tightness is not captured by a single visual effect. It emerges from several interacting dimensions:

* body geometry,
* garment structure,
* fabric elasticity,
* drape and recovery,
* posture and motion,
* illumination and viewing angle,
* region-specific anatomy,
* cultural and functional intent.

### 3.2 Tightness Is Region Specific

A garment can be tight at the waist while loose at the hips, or tight across the upper thigh while relaxed near the knee.
Interpretation must remain region aware.

### 3.3 Tightness Is Context Dependent

Athletic compression garments, medical support wear, protective equipment, performance uniforms, dancewear, shapewear, and many other garments have different expectations for tightness.
A high-conformity garment may be normal in one context and suspicious in another.

### 3.4 Tightness Should Be Interpreted Relative to the Body

A garment that looks tight on one body type may look ordinary on another.
Interpretation must be body-relative, garment-relative, and posture-relative.

### 3.5 Tightness Should Be Interpreted Relative to the Garment

A lightweight knit and a heavy woven garment can both appear body-following despite very different mechanical behavior.
The material class matters.

### 3.6 Tightness Is Not Equivalent to Exposure

A close-fitting garment may preserve coverage. A loose garment may reveal body shape through drape or movement. Tightness should never be treated as a direct proxy for exposure or risk.

## 4. Body Variation Framework

The body is not a single geometry. Tightness must be interpreted through body diversity.

### 4.1 Body Shape Diversity

Body shape diversity includes:

* hourglass forms,
* rectangle forms,
* pear forms,
* inverted triangle forms,
* apple forms,
* athletic forms,
* asymmetrical forms,
* angular forms,
* soft-curved forms,
* broad-shouldered forms,
* narrow-shouldered forms,
* long-torso forms,
* short-torso forms,
* long-limb forms,
* short-limb forms,
* low-waist forms,
* high-waist forms,
* broad-hip forms,
* narrow-hip forms,
* compact forms,
* elongated forms,
* stocky forms,
* linear forms.

Each form changes how a garment appears when it is fitted.
A garment may look snug on one torso shape and merely relaxed on another.

### 4.2 Body Fat Variation

Body fat variation alters surface softness, contour prominence, and the visual gap between garment and anatomy.

* lower-body fat can make contours more angular and more sharply defined,
* higher-body fat can create smoother transitions and softer body outlines,
* central fat distribution can change waist and abdominal appearance,
* peripheral fat distribution can change hip and thigh contours,
* localized fat deposits can create volume that pushes fabric outward,
* soft tissue shifts under clothing can alter visual tightness locally,
* garment tension may concentrate around protruding or prominent regions,
* body-fat distribution can cause a garment to look tighter in one zone and looser in another.

### 4.3 Muscular Variation

Muscular variation changes how garments sit and how tension is distributed.

* highly muscular shoulders can create wider upper torso geometry,
* defined arms can create tension around biceps and triceps,
* muscular legs can increase curvature and tension at the upper thigh,
* muscular torsos can create more pronounced contour lines,
* lean bodies can make a garment appear more form-fitting even when the material is not highly elastic,
* bulky muscle groups can create local strain points in a garment,
* muscular movement can increase temporary tightness during dynamic motion,
* garments intended for athletic use can appear highly fitted because they track active musculature.

### 4.4 Age-Related Variation

Age-related variation affects skin elasticity, body proportions, tissue distribution, posture, and movement patterns.

* younger bodies often display more elastic tissue and more fluid movement,
* older bodies can show reduced elasticity and more posture-driven curvature,
* age-related shifts in spinal posture can change waist and torso drape,
* older populations may present less uniform body contours under clothing,
* age-related muscle loss can alter how tightly a garment sits around the shoulders and arms,
* age-related changes in soft tissue can influence contour prominence and compression appearance,
* posture changes can make garments appear more or less fitted depending on the angle.

### 4.5 Adolescent Development

Adolescent development changes body proportions across growth stages.

* growth spurts can create temporary mismatch between garment and body geometry,
* limbs may lengthen faster than torso, affecting perceived fit,
* shoulder breadth and hip breadth may shift at different rates,
* torso proportions can be unstable over a short period,
* developing muscularity can make the same garment appear more or less fitted,
* garments can look tight in one growth phase and ordinary in another.

### 4.6 Elderly Populations

Elderly populations present unique considerations.

* posture may become more kyphotic or stooped,
* body contours can soften and shift,
* skin may hang differently over underlying structure,
* gait and joint movement may alter fabric tension,
* garments may need to accommodate reduced mobility or postural adaptation,
* tightness interpretation should remain sensitive to reduced tissue elasticity and movement restrictions.

### 4.7 Pregnancy

Pregnancy changes body geometry in ways that require careful interpretation.

* abdominal expansion changes waist geometry,
* torso proportions shift forward and laterally,
* garment tension can redistribute across the upper torso and lower abdomen,
* supportive garments may appear tight for physiological reasons rather than stylistic ones,
* drape and compression can differ by trimester and posture,
* garment fit can be highly local rather than uniform.

### 4.8 Disability-Related Variation

Disability-related variation affects body shape, movement, and posture.

* prosthetics can change hip and leg geometry,
* mobility aids can alter garment tension around the torso and shoulders,
* assistive devices can add external contours that mimic or distort garment fit,
* spinal or joint variation can change posture and garment drape,
* muscular asymmetry can create inconsistent tightness across the body,
* gait differences can lead to dynamic tension changes during movement.

### 4.9 Skeletal Diversity

Skeletal diversity changes the visual skeleton beneath the clothing.

* broader clavicles create more visible shoulder structure,
* narrow shoulders create less surface area for garment suspension,
* wide rib cages alter chest garment behavior,
* different pelvis shapes change waist and hip conformity,
* limb bone proportions change how sleeves and trouser legs fit,
* joint geometry changes how garments fold and tension around elbows, knees, and wrists.

### 4.10 Proportional Diversity

Proportional diversity affects relative garment behavior.

* long torsos can make waistbands appear higher or lower,
* short torsos can create unusual contour transitions,
* long limbs can make sleeves and trousers appear more stretched,
* short limbs can make garments look more compact around the body,
* high hip-to-waist ratios alter trouser and skirt conformity,
* low hip-to-waist ratios alter the same garments differently.

### 4.11 Body Variation Interpretation Principles

A body-relative interpretation should account for:

* the region under analysis,
* the garment category,
* the expected fit for that body type,
* visible tissue distribution,
* posture at the moment of observation,
* motion or dynamic deformation,
* cultural and functional intent.

## 5. Garment Behavior Science Framework

Garment behavior is shaped by material structure and mechanical response.

### 5.1 Woven Fabrics

Woven fabrics are built from interlaced yarns.

* woven fabrics often show more structured drape than knitted textiles,
* tightness in woven garments depends strongly on weave density,
* woven garments may hold shape more firmly around the torso and limbs,
* woven garments can appear crisp even when they are not highly elastic,
* tension may concentrate at seams, hems, and waistbands,
* woven garments can preserve contour lines when the fiber content and weave support it,
* woven fabrics may look tailored and structured even if they are not heavily compressive,
* woven garments can reveal body contour through the geometry of folds and seams,
* woven garments often show less stretch than knits but can still appear body-following.

### 5.2 Knitted Fabrics

Knitted fabrics are built from interlocking loops.

* knitted fabrics often follow body curvature with greater fluidity,
* they can stretch more evenly across a region,
* they may appear tight because they cling to the body without rigid structure,
* their drape behavior depends on stitch structure and yarn tension,
* they can produce strong contour retention without high compression,
* their stretch may increase in the direction of loop elongation,
* they may reveal body shape through localized tension rather than rigid structure.

### 5.3 Compression Fabrics

Compression fabrics are designed to apply pressure and support body contour.

* they often have high elastic recovery,
* they may create strong body conformity in targeted zones,
* they can flatten soft tissue visually while still preserving shape,
* their mechanical effect depends on stretch ratio and fabric geometry,
* they may appear tight across the torso, hips, legs, or arms depending on the design,
* they are often used in performance, medical, and recovery garments,
* compression behavior should be interpreted as purposeful, not automatically suspicious.

### 5.4 Elastic Materials

Elastic materials contribute to body-following behavior.

* elastane-rich materials can hold close to the body without rigid form,
* elastic recovery can preserve a fitted appearance during movement,
* stretch may be distributed or localized depending on construction,
* highly elastic garments can look tight even when the underlying body geometry is not highly curved,
* elasticity can produce contour retention when the fabric is under tension.

### 5.5 Athletic Materials

Athletic materials are engineered for movement and performance.

* they often combine stretch, breathability, support, and moisture management,
* they may appear body-following because they are designed to stay in place during motion,
* they can create tension in the upper torso, thighs, calves, and arms,
* their tightness may be purposeful and temporary under dynamic conditions,
* they may look more fitted during active movement than during still posture.

### 5.6 Medical Materials

Medical materials often focus on support, compression, or stabilization.

* medical garments may create controlled pressure gradients,
* they may be intentionally tight in one region and less restrictive in others,
* their form can reflect support goals rather than aesthetic fit,
* pressure distribution may be visible through the fabric as contour holding,
* medical garments are frequently used in rehabilitation, post-operative support, and compression therapy.

### 5.7 Layered Clothing

Layered garments create composite tightness profiles.

* an outer layer may appear close-fitting while an inner layer remains looser,
* layered garments can produce nested contours and multiple tension surfaces,
* the overall appearance may come from the interaction of layers rather than a single garment,
* a loose outer layer can still appear body-following if it drapes tightly over an inner fitted layer,
* layer transitions can create visible folds, ridges, and shape shifts.

### 5.8 Heavy Fabrics

Heavy fabrics create different visual impressions from light fabrics.

* heavy fabrics may appear loose while still following the body because of weight and drape,
* they may show broad, stable contours rather than fine body detail,
* they can produce tension at the shoulders, waist, and hems,
* they may conceal body contour more than lightweight fabrics,
* their apparent tightness can be lower even when the garment is close-fitting.

### 5.9 Lightweight Fabrics

Lightweight fabrics create different visual effects from heavy fabrics.

* lightweight fabrics can reveal body shape more easily,
* they may appear tight because they lie close to the body,
* they can create visible contour lines because of reduced dimensional mass,
* they can appear fitted even when their mechanical compression is moderate,
* they often produce more obvious contour visibility than heavier garments.

### 5.10 Stretch Behavior

Stretch behavior influences how garments engage with anatomy.

* stretch can increase apparent tightness without corresponding pressure increase,
* anisotropic stretch can cause different tension across horizontal and vertical axes,
* stretch may be easier to observe around joints and curvature zones,
* high-elastic garments may appear to be conforming even when only a small portion of the fabric is under strain,
* a stable fit can still display changing tension during movement.

### 5.11 Drape Behavior

Drape behavior shapes the visible form of a garment.

* drape can reduce or exaggerate perceived tightness,
* heavy drape can make a fitted garment appear more relaxed,
* controlled drape can make a garment appear tailored and body-following,
* fabrics with strong memory may hold a contour even when the body moves,
* garments can appear smooth and fitted even when the material itself is not highly compressive.

### 5.12 Contour Retention

Contour retention describes how a garment keeps the body shape after momentary deformation.

* strong contour retention reveals body shape steadily across posture changes,
* weak contour retention causes the garment to lose form quickly,
* contour retention is especially important in athletic and performance wear,
* contour retention should be considered alongside pressure and fit.

### 5.13 Recovery Behavior

Recovery behavior is the garment's ability to return to its original shape after stretching.

* fast recovery can preserve a fitted form during repetitive motion,
* slow recovery may create visible sag or looseness over time,
* recovery influences whether a garment remains conforming during walking, running, or bending,
* recovery helps distinguish intentional compression from temporary distortion.

### 5.14 Compression Behavior

Compression behavior is a broad mechanical property tied to garment design and fabric architecture.

* compression can create a smoothing effect over the body,
* compression can suppress garment motion relative to the body,
* compression can change how much body contour is visible,
* compression may affect the perception of tightness in both body-following and body-sculpting ways,
* true compression is best understood as a combination of material response, body geometry, and design intent.

## 6. Anatomical Tightness Framework

Tightness must be evaluated region by region rather than as a single garment-wide property.

### 6.1 Neck

* expected garment behavior: collars, necklines, neck gaiters, and high-collar garments may create a tight ring around the neck.
* tightness interpretation: neck tightness can be functional, protective, aesthetic, or purely cultural.
* confidence factors: visible collar geometry, stable neckband structure, fabric tension around the throat.
* uncertainty factors: scarves, accessories, loose collars, posture, and partial occlusion.
* context sensitivity: medical support, weather protection, athletic gear, and uniform wear all change expectations.

### 6.2 Shoulders

* expected garment behavior: shoulder seams, cap sleeves, broad straps, and shoulder panels shape how the garment sits.
* tightness interpretation: shoulder tightness often reflects garment suspension and upper torso fit.
* confidence factors: clear shoulder slope, stable seam alignment, visible fabric tension at the shoulder edge.
* uncertainty factors: padding, jackets, layered garments, and shoulder bags.
* context sensitivity: activewear, dress shirts, structured outerwear, and protective gear all have distinct expectations.

### 6.3 Clavicles

* expected garment behavior: garments with low necklines or close-fitting upper torso forms may reveal or follow the clavicles.
* tightness interpretation: clavicle conformity can be expressive, athletic, or structural.
* confidence factors: body orientation, garment shape around the upper chest, visible clavicle contour under the fabric.
* uncertainty factors: soft tissue changes, posture, and fabric thickness.
* context sensitivity: sportswear, swimwear, and fitted tops differ from ordinary blouses and jackets.

### 6.4 Upper Chest

* expected garment behavior: shirts, bras, compression tops, and fitted jackets shape the upper chest and create local tension.
* tightness interpretation: upper chest tightness may reflect support, compression, or simple fit.
* confidence factors: stable upper torso shape, garment compression around the bust or sternum, contour retention.
* uncertainty factors: padding, layering, posture, extreme arm pose, and body size variation.
* context sensitivity: sportswear and supportive garments often create normal upper chest conformity that should not be confused with exposure or risk.

### 6.5 Lower Chest

* expected garment behavior: lower chest close-fitting garments may create tension across the sternum and ribs.
* tightness interpretation: lower chest conformity can be highly visible in fitted tops and activewear.
* confidence factors: proportionate tension across the body, garment anchoring around the torso, anatomical continuity.
* uncertainty factors: undergarments, chest support, strong lighting, and body shape variation.
* context sensitivity: compression wear, bras, and athletic bibs change the interpretation.

### 6.6 Abdomen

* expected garment behavior: waistbands, crop tops, compression shirts, and fitted dresses may create strong abdominal conformity.
* tightness interpretation: abdominal tightness is highly context dependent because it can indicate support, shaping, athletic function, or simple fit.
* confidence factors: visible waist transition, stable waistband geometry, body contour following.
* uncertainty factors: folds, posture, abdominal distension, and layered garments.
* context sensitivity: performance gear, medical support wear, and shaping garments differ from ordinary casual wear.

### 6.7 Waist

* expected garment behavior: waistbands, belts, skirts, pants, and fitted tops can create a clear waist contour line.
* tightness interpretation: waist conformity is one of the most visually important indicators of garment fit.
* confidence factors: visible waist narrowing, waistband alignment, garment tension at the sides and front.
* uncertainty factors: belts, oversized jackets, fabric gathers, and torso posture.
* context sensitivity: fashion garments, sportswear, and shaping garments each impose different expectations.

### 6.8 Hips

* expected garment behavior: pants, skirts, dresses, shorts, and waistlines often create a fitted profile around the hips.
* tightness interpretation: hip tightness can be shaped by body geometry, garment design, and movement.
* confidence factors: stable side seam geometry, hip curvature, visual contact across the iliac region.
* uncertainty factors: wide belts, pouches, layers, and motion.
* context sensitivity: athletic leggings, structured skirts, and loose trousers all show different hip behavior.

### 6.9 Gluteal Region

* expected garment behavior: fitted pants, shorts, skirts, leggings, and athletic wear often follow the gluteal contour strongly.
* tightness interpretation: gluteal conformity is often associated with body-following garments rather than exposure alone.
* confidence factors: visible contour retention, stable seam placement, firm fabric tension across the buttocks.
* uncertainty factors: padding, baggy outer layers, posture, and fabric thickness.
* context sensitivity: sportswear and tailored garments can look very different from loose outerwear.

### 6.10 Upper Thighs

* expected garment behavior: leggings, shorts, trousers, and compression garments all create distinct upper thigh tension patterns.
* tightness interpretation: upper thigh conformity can reflect active movement, support, or shape retention.
* confidence factors: visible thigh curvature, structural contact across the upper leg, stabilized fabric around the crotch and side seams.
* uncertainty factors: fabric folds, bags, sitting posture, and layering.
* context sensitivity: athletic wear and fashion wear often differ in their intended close fit.

### 6.11 Lower Thighs

* expected garment behavior: trousers, leggings, and compression wear may tighten around the lower thigh and knee transition.
* tightness interpretation: lower thigh tightness can appear more severe when the garment is influenced by leg position or motion.
* confidence factors: consistent tension across the lower thigh, smooth contour retention, stable hem geometry.
* uncertainty factors: bending, cross-legged posture, and fabric bunching.
* context sensitivity: sportswear and fitted trousers can share similar visible form but differ in purpose.

### 6.12 Knees

* expected garment behavior: knee-focused garments, trousers, skirts, leggings, and protective gear create local tension near the bent joint.
* tightness interpretation: knee tightness is highly posture driven and should not be judged in isolation.
* confidence factors: visible joint curvature, fabric smoothness around the knee, stable tension above and below the joint.
* uncertainty factors: bending, walking, kneeling, fabric stretch, and accessory overlays.
* context sensitivity: sportswear, protective equipment, and casual trousers behave differently.

### 6.13 Calves

* expected garment behavior: socks, leggings, compression sleeves, trousers, and boots can shape the calf region.
* tightness interpretation: calf conformity often reflects either support or fashion styling and should be interpreted with context.
* confidence factors: smooth calf contour retention, stable fabric tension, natural ankle-to-calf transition.
* uncertainty factors: boots, shadows, thick socks, and leg crossing.
* context sensitivity: athletic and medical garments often appear more fitted while still being functional.

### 6.14 Ankles

* expected garment behavior: socks, ankle cuffs, leggings, and fitted trousers change the appearance around the ankle.
* tightness interpretation: ankle tightness often results from cuff geometry, fabric tension, and movement.
* confidence factors: clear contour transition from calf to ankle, cuff alignment, consistent fabric contact.
* uncertainty factors: footwear, socks, loose hems, and partial body occlusion.
* context sensitivity: athletic compression, office wear, and cultural dress can all create similar visual patterns.

### 6.15 Upper Arms

* expected garment behavior: sleeves, shirts, compression sleeves, and outerwear shape the upper arms.
* tightness interpretation: upper arm tightness is often driven by sleeve geometry and posture.
* confidence factors: visible arm shape, smooth sleeve transition, stable fabric over the biceps.
* uncertainty factors: arm bending, jackets, backpack straps, and loose layering.
* context sensitivity: athletic wear and structured jackets produce different visual signatures.

### 6.16 Forearms

* expected garment behavior: sleeves, gloves, wristbands, and fitted jackets create tension around the forearm.
* tightness interpretation: forearm tightness can indicate either function or style and should be evaluated in relation to the rest of the arm.
* confidence factors: smooth material contour along the forearm, wrist transition stability, sleeve cling.
* uncertainty factors: objects in the hands, sleeves rolled up, and strong lighting.
* context sensitivity: sportswear, protective gear, and fashion sleeves all differ.

### 6.17 Regional Interpretation Principles

* regional analysis must remain local and not collapse into a single garment-wide judgment,
* regions with strong bone or muscle contours should be assessed differently from soft tissue regions,
* flexible joints deserve special temporal reasoning,
* garment behavior should be interpreted as an interaction between material, region, and motion.

## 7. Confidence Architecture

A tightness judgment is strengthened by separating confidence into explicit categories.

### 7.1 Pose Confidence

Pose confidence reflects how stable and reliable the body pose estimate is.

* high pose confidence supports accurate evaluation of body geometry and local fit,
* low pose confidence increases uncertainty around body curvature and joint positioning,
* pose confidence is especially important near the shoulders, hips, knees, and elbows.

### 7.2 Contour Confidence

Contour confidence reflects how clearly the body and garment boundaries can be distinguished.

* strong contour confidence supports reliable local fit interpretations,
* poor contour confidence can make tightness appear stronger or weaker than it is,
* contour confidence is affected by lighting, occlusion, and garment texture.

### 7.3 Segmentation Confidence

Segmentation confidence measures how reliably garment regions and body regions are separated.

* strong segmentation confidence helps distinguish fabric boundary from body boundary,
* weak segmentation confidence can confuse body surface with garment surface,
* this is especially important for fitted knitwear and translucent garments.

### 7.4 Garment Confidence

Garment confidence reflects how clearly the garment class and structure can be inferred.

* high garment confidence supports accurate interpretation of fit expectations,
* low garment confidence weakens assumptions about intended compression or drape,
* garment confidence is modulated by material type, cut, and visible construction details.

### 7.5 Anatomical Confidence

Anatomical confidence measures how reliably the system knows which body region is being observed.

* high anatomical confidence improves region-specific tightness assessment,
* low anatomical confidence can cause misattribution between nearby regions,
* anatomical confidence is sensitive to pose, overlap, and occlusion.

### 7.6 Temporal Confidence

Temporal confidence tracks how consistently the same tightness pattern appears over time.

* repeated evidence across frames strengthens confidence,
* motion-induced transient effects reduce temporal confidence,
* dynamic garments must be evaluated over a sequence rather than a single frame.

### 7.7 Confidence Propagation Models

Multiple propagation strategies can be used conceptually:

* hierarchical propagation, where body and region confidence constrain the conclusion,
* evidence-weighted propagation, where some signals are weighted higher than others,
* temporal smoothing, where repeated observations increase confidence,
* layer-aware propagation, where outer and inner layers are treated separately,
* context-adjusted propagation, where garment type and body variation alter weights.

### 7.8 Confidence Interpretation Principles

* high confidence is not the same as high tightness,
* low confidence must promote caution rather than overstatement,
* confidence should be expressed explicitly as a part of any conclusion,
* different confidence dimensions should remain visible in any explanation.

## 8. Uncertainty Architecture

Uncertainty must be preserved rather than hidden.

### 8.1 Body Uncertainty

Body uncertainty arises from unknown or ambiguous body shape, tissue distribution, and body type.

* body uncertainty can make a fit appear stronger or weaker than it truly is,
* body variation often creates apparent local tightness differences,
* body uncertainty is elevated in unusual poses or atypical proportions.

### 8.2 Contour Uncertainty

Contour uncertainty arises when the body outline and garment outline are hard to separate.

* contour uncertainty increases when fabric lies close to the skin,
* it also increases under low contrast and strong shading.

### 8.3 Pose Uncertainty

Pose uncertainty occurs when body posture makes body geometry ambiguous.

* arms across the torso, bent knees, twisted spine, and crossed legs all distort perceived fit,
* pose uncertainty should reduce confidence in one-frame interpretations.

### 8.4 Segmentation Uncertainty

Segmentation uncertainty reflects the inability to isolate garment regions precisely.

* layered clothing increases segmentation uncertainty,
* partially occluded garments also weaken the segmentation explanation.

### 8.5 Garment Uncertainty

Garment uncertainty arises when the garment type or structure is ambiguous.

* many garments share similar silhouettes but have different mechanical behavior,
* thick outerwear can resemble fitted garments under some lighting conditions,
* garment uncertainty should be treated as separate from body uncertainty.

### 8.6 Temporal Uncertainty

Temporal uncertainty reflects changing fit over time.

* running, bending, breathing, and shifting posture all alter fit moments,
* transient tightness should not be treated as stable fit without repeated evidence.

### 8.7 Uncertainty Propagation Models

Conceptual propagation models include:

* additive uncertainty when several factors independently weaken confidence,
* multiplicative uncertainty when one strong ambiguity dominates interpretation,
* hierarchical uncertainty where region ambiguity reduces whole-garment certainty,
* temporal uncertainty where unstable motion reduces confidence significantly,
* context-sensitive uncertainty where garment category and body type alter the effect.

### 8.8 Uncertainty Interpretation Principles

* uncertainty is not a flaw,
* uncertainty is a necessary part of a truthful explanation,
* high uncertainty should promote careful interpretation and review.

## 9. Temporal Tightness Analysis

Tightness changes across time. Static interpretation is incomplete.

### 9.1 Movement-Induced Compression

Movement can increase or decrease observed tightness.

* walking can create momentary tension changes in the shoulders and hips,
* running can increase tension around the torso and thighs,
* arm movement can alter sleeve geometry and upper torso fit,
* friction with the body can increase visible contour retention.

### 9.2 Posture Changes

Posture changes reshape the body and alter apparent fit.

* slouching can make shirts and jackets look looser at the shoulders,
* standing tall can create more visual waist definition,
* lifting the arms changes sleeve tension and chest geometry,
* sitting changes hip and thigh conformity dramatically.

### 9.3 Stretching Events

Stretching events are important for understanding the relationship between motion and short-term fit.

* stretching can increase tension across a fabric,
* stretching can reveal the difference between a fitted knit and a structured woven garment,
* dynamic strain can create temporary contour emphasis.

### 9.4 Dynamic Fabric Behavior

Dynamic fabric behavior includes:

* stretching under motion,
* recovery during pauses,
* wrinkling from bending,
* relaxation around the waist or hips,
* tension variation during walking and running,
* shear changes at the torso and limbs,
* opening and closing at garment seams,
* shifting of fabric over curves.

### 9.5 Running

Running changes tightness patterns strongly.

* the torso can compress differently during each stride,
* leg apparel may become more taut as the body moves,
* fabrics can shift toward more body-following behavior under acceleration,
* the same garment may look looser at rest and tighter during motion.

### 9.6 Jumping

Jumping can temporarily alter the tension profile.

* the garment may ride upward or downward,
* compression may increase in the lower torso and thighs,
* fabric may migrate across the body,
* visual tightness can change as movement changes the body surface.

### 9.7 Sitting

Sitting changes fit dramatically.

* hips and thighs become more compressed in the seated posture,
* waistbands may shift or gather,
* fabric can bunch at the knees or around the hip crease,
* overlap and tension can create a different visual profile from standing posture.

### 9.8 Bending

Bending changes both body geometry and garment tension.

* the torso may become more curved,
* the waistline can be visually altered,
* garment folds can form at the abdomen or hips,
* sleeve and trouser tension may intensify across joints.

### 9.9 Athletic Motion

Athletic motion produces high variability.

* acceleration and deceleration change body tension,
* arm swing alters sleeve fit and upper-body contour,
* leg movement shifts pant and legging tension,
* repeated movement can make fitted garments appear more stable or more dynamic depending on material recovery.

### 9.10 Temporal Interpretation Principles

Temporal analysis should preserve:

* sequence continuity,
* dynamic stability,
* posture-based variation,
* movement-induced tension changes,
* garment recovery behavior.

## 10. Policy Profiles and Calibration Methodology

Tightness assessment should not rely on fixed rigid thresholds.

### 10.1 Configurable Policy Profiles

Policy profiles should be configurable for different contexts:

* everyday casual fit,
* athletic performance fit,
* medical support fit,
* protective fit,
* fashion fit,
* cultural dress fit,
* ceremonial dress fit,
* rehabilitation garment fit,
* dancewear fit,
* aquatic performance fit.

### 10.2 Adaptive Thresholding

Adaptive thresholds should be derived from:

* regional anatomy,
* body proportions,
* body shape,
* garment category,
* posture,
* lighting,
* motion state,
* garment material properties.

### 10.3 Body-Relative Thresholds

Body-relative thresholds compare the garment to the body rather than to a universal standard.

* broad shoulders may require different fit expectations than narrow shoulders,
* wider hips may need different contour expectations than narrow hips,
* muscular torsos may appear more fitted than soft-tissue torsos.

### 10.4 Garment-Relative Thresholds

Garment-relative thresholds compare the garment to its own expected structure.

* a loose woven jacket should not be evaluated as if it were a compression knit,
* a structured evening dress should not be judged with the expectations of a performance bodysuit,
* a medical compression sleeve should be interpreted with support-specific logic.

### 10.5 Calibration Methodology

A calibration framework should include:

* comparison across body types,
* comparison across garment classes,
* separate calibration for each anatomical region,
* separate calibration for each motion state,
* separate calibration for each material class,
* calibration for lighting and viewing conditions,
* calibration for cultural and functional context,
* calibration using human review feedback.

### 10.6 Calibration Principles

* use body-relative evidence rather than universal constants,
* use garment-relative evidence rather than single-size heuristics,
* preserve explanatory traces for all major judgments,
* incorporate feedback from observed real-world variation.

## 11. False Positive Protection Framework

False positive protection is essential because high conformity is common in ordinary garments.

### 11.1 Protection Principles

* high apparent conformity alone does not imply exposure or risk,
* garment purpose must be considered,
* body anatomy and body shape must be considered,
* garment material and structure must be considered,
* motion and posture must be considered,
* cultural and functional context must be considered.

### 11.2 Legitimate High-Tightness Scenarios

The following scenarios are legitimate and should not automatically elevate risk.

1. a athletic compression shirt worn during training, because it is designed to provide supportive tension and stable body guidance.
2. a rehabilitation sleeve worn during a rehabilitation session, because it is a functional garment intended for movement and compression.
3. a medical compression garment worn during a medical treatment routine, because it serves a protective or therapeutic role rather than exposure.
4. a protective athletic singlet worn during a competitive event, because the garment is engineered to remain in place during active motion.
5. a performance running top worn during a performance, because the close fit is a normal part of athletic or medical use.
6. a sports uniform base layer worn during a school athletics activity, because the garment is intended to reduce motion and support the body.
7. a swim training suit worn during a sports warm-up, because the material behavior is purposeful and controlled rather than accidental.
8. a cycling bib worn during a dance rehearsal, because the garment maintains coverage while following body contours.
9. a dancewear bodysuit worn during a fitness class, because the fit is consistent with the garment category and its purpose.
10. a compression legging worn during a race, because the observed conformity is part of a recognized support garment design.
11. a protective undergarment worn during outdoor exercise, because the region is intentionally supported and stabilized by the garment.
12. a supportive bracing garment worn during physical therapy, because the close fit reflects specialized compression rather than exposure.
13. a warm-up compression set worn during a martial arts drill, because a supportive garment can follow anatomy without violating coverage norms.
14. a rehabilitation support wrap worn during a protective training exercise, because the garment class expects body-following geometry and appropriate tension.
15. a compression sock worn during a medical recovery period, because the visible body contour is a product of controlled compression rather than surface exposure.
16. a sports bra worn during a cycling session, because the garment is designed for movement, support, or protection.
17. a high-support athletic short worn during a swim practice, because the garment is not simply loose fabric but a purpose-built supportive layer.
18. a performance underlayer worn during a football training camp, because the observed tightness should be read through the garment category and context.
19. a medical compression stocking worn during a gym workout, because the garment behavior is common in performance and medical apparel.
20. a protective arm sleeve worn during a protective equipment fit check, because the close fit is structurally expected for this type of garment.
21. a posture support vest worn during a uniform inspection, because it is designed to provide supportive tension and stable body guidance.
22. a tactical compression top worn during a performance rehearsal, because it is a functional garment intended for movement and compression.
23. a ski performance suit worn during a correctional or protective exercise, because it serves a protective or therapeutic role rather than exposure.
24. a martial arts uniform worn during a rehabilitation mobility routine, because the garment is engineered to remain in place during active motion.
25. a gymnastic leotard worn during a running workout, because the close fit is a normal part of athletic or medical use.
26. a triathlon race suit worn during a posture training session, because the garment is intended to reduce motion and support the body.
27. a basketball compression jersey worn during a medical support assessment, because the material behavior is purposeful and controlled rather than accidental.
28. a volleyball compression shorts worn during an athletic warm-up drill, because the garment maintains coverage while following body contours.
29. a soccer training kit worn during a recovery period, because the fit is consistent with the garment category and its purpose.
30. a track warm-up suit worn during a sports conditioning session, because the observed conformity is part of a recognized support garment design.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

For any given cross-sectional segment of a human extremity or torso, the system calculates a localized Tightness Coefficient ($T_c$). Let $A_{\text{mesh}}$ represent the multi-polygon outer mesh boundary of the predicted human anatomy (generated using an unclothed baseline physical model), and let $G_{\text{boundary}}$ represent the segmented polygon boundary of the detected garment.

The Spatial Delta Vector ($\Delta V$) at any point $i$ along the boundary perimeter is defined as:

$$\Delta V_i = \| A_{\text{mesh}}(i) - G_{\text{boundary}}(i) \|$$

The raw Tightness Score ($S_{\text{raw}}$) for a discrete body zone ($Z$) is the inverse variance of the spatial delta across $n$ sampling nodes:
$$S_{\text{raw}}(Z) = \left( \frac{1}{n} \sum_{i=1}^{n} (\Delta V_i - \mu_{\Delta V})^2 \right)^{-1}$$

Where $\mu_{\Delta V}$ represents the mean spatial delta of that specific zone. High tightness produces a highly uniform, low-variance distribution where the garment mimics the exact micro-contours of the body, pushing $S_{\text{raw}}$ toward maximum values.

To prevent false-positive indicators on loose fabrics that happen to press against the body due to external environment forces (such as wind or sudden deceleration), the system cross-references the texture displacement vectors across temporal video sequences ($F_t \dots F_{t+k}$).

* **Low Tightness / Loose Fabric Indicator:** Micro-fluctuations in localized edge frequencies ($>12\text{ Hz}$) and shifting shadow gradients indicating fabric flapping or independent drape.

* **Geometric Definition:** $\Delta V_m > 150\text{mm}$ across $90\%$ of localized sampling nodes.

* **Geometric Definition:** $100\text{mm} < \Delta V_m \le 150\text{mm}$.

* **Geometric Definition:** $50\text{mm} < \Delta V_m \le 100\text{mm}$.

* **Geometric Definition:** $30\text{mm} < \Delta V_m \le 50\text{mm}$.

* **Geometric Definition:** $15\text{mm} < \Delta V_m \le 30\text{mm}$.

* **Geometric Definition:** $5\text{mm} < \Delta V_m \le 15\text{mm}$.

* **Geometric Definition:** $2\text{mm} < \Delta V_m \le 5\text{mm}$.

* **Geometric Definition:** $0\text{mm} \le \Delta V_m \le 2\text{mm}$ (Zero air gap across the entire segment).

* **Geometric Definition:** Negative theoretical delta vectors ($\Delta V < 0$) where fabric actively compresses subcutaneous fat layers.

* **The Mitigation Engine:** The module maps the joint strain vectors via pose estimators. If the tightness is localized strictly to the peak points of a muscle group (e.g., biceps, quadriceps) while showing loose characteristics ($>20\text{mm}$) at the joint insertion points (elbows, knees), the overall score is normalized back down to a TI-4.

* **The Mitigation Engine:** A localized luminance contrast assessment is run before the edge-detection loop. If the local contrast ratio drops below $3:1$, edge detection switches from standard RGB variance to Sobel-filtering on the infrared spectrum or depth maps if available.