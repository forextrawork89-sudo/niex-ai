# Skin Visibility Probability Intelligence Framework

This document is a complete knowledge-base reconstruction for skin visibility probability reasoning. It replaces any fragmented or implementation-oriented treatment of skin-likelihood assessment with a research-grade conceptual framework that explains how the probability that an observed region represents visible human skin is inferred within complete scenes and human appearance contexts.
Skin probability reasoning is not the same as skin segmentation, exposed-area estimation, nudity detection, skin-color detection, or a simple confidence score from a classifier. It is an explainable process for understanding why a region is likely to represent human skin, why the evidence is strong or weak, and how anatomical, clothing, illumination, body-pose, scene, temporal, and multimodal evidence combine to support the conclusion.
The framework treats skin probability as a structured human-perception problem that emerges from accumulated evidence rather than from isolated color or mask cues. A skin probability interpretation is meaningful only when it explains the visible evidence, the body reasoning, the uncertainty, and the reasons for the interpretation.

## 1. Foundations of Skin Probability Reasoning

Skin probability reasoning describes how a system forms a judgment about the likelihood that an observed region corresponds to visible human skin. This judgment is not derived from a single pixel pattern or a single threshold. It emerges from a distributed body of evidence spanning anatomy, body regions, clothing coverage, illumination, pose, camera geometry, scene semantics, occlusion, movement, temporal continuity, and multimodal context.
The central premise is that a region is more likely to be human skin when multiple independent cues agree. A region may be visually skin-like in color, but its probability falls if it is inconsistent with body geometry, garment structure, environmental context, or temporal continuity. Probability therefore emerges through consistency across evidence sources rather than through a single feature.
A region may appear likely to be skin because it has the right surface texture, the right body-region placement, the right geometry, the right lighting behavior, the right clothing relationship, and the right contextual meaning. It becomes less likely when it looks like leather, wood, cream-colored cloth, sand, stone, paint, a medical simulator, a prosthetic surface, or a reflection.

## 2. Skin Probability versus Adjacent Concepts

Skin probability differs from skin segmentation because segmentation identifies a region as body-like or skin-like, while probability reasoning explains why that region should be interpreted as likely skin under a larger understanding of anatomy and context.
Skin probability differs from exposed-area estimation because exposed-area estimation measures visible area, while probability reasoning explains the likelihood that a visible patch is human skin rather than another surface with a similar appearance.
Skin probability differs from nudity detection because nudity detection seeks a broad category judgment, while probability reasoning identifies specific regions, explains evidence strength, and distinguishes ordinary visibility from sensitive exposure.
Skin probability differs from skin-color detection because color detection identifies chromatic properties, while probability reasoning uses color only as one cue among many and asks whether the region belongs to the body at all.
Skin probability differs from confidence scores because a confidence score can be a scalar output without explanation, while a probability framework should make visible the evidence chain, the uncertainty, and the reasons for the assigned plausibility.

## 3. Human Skin Perception Foundations

Human skin perception is the process by which the visual system infers whether a visible surface is likely to be skin. This inference depends on contour, texture, color distribution, reflectance, body topology, body motion, lighting behavior, and social context.
The visual system does not rely on color alone. It uses the arrangement of surfaces, the continuity of body shape, the expected relation between body parts, the behavior of light on skin, and the contextual meaning of the scene. A face-like patch might be skin, but only if it fits the body and the scene.
Skin perceptually differs from clothing, leather, plastic, stone, sand, wood, and painted surfaces because skin has a characteristic combination of softness, curvature, reflectance, shading, and anatomical relationship. Yet these cues are not universal. A thin fabric under strong light can look very skin-like, and a painted surface can align with body shape. The framework therefore requires evidence accumulation rather than single-cue classification.

## 4. Anatomical Reasoning for Skin Probability

Anatomical reasoning is the core of skin probability because visible skin is meaningful only when it can be attached to a plausible body region, a plausible body contour, and a plausible body configuration.
### 4.1 Anatomical regions
The head, face, scalp, forehead, cheek, nose, mouth, ear, neck, shoulder, upper arm, forearm, hand, chest, upper torso, abdomen, back, waist, hip, upper leg, lower leg, and foot form the anatomy relevant to skin probability. Each region has distinct surface form, curvature, relationship to clothing, and visibility pattern.
### 4.2 Surface morphology
Skin probability depends on tissue curvature, body shape, muscular contour, fat distribution, and soft-tissue transitions. A flat patch does not automatically imply skin, but a curved patch near the shoulder line may be more plausible as skin if its geometry matches the body.
### 4.3 Anatomical consistency
Anatomical consistency asks whether a proposed skin region fits the larger body structure. A patch near the neck should be evaluated relative to the shoulders, face, and torso. A patch near the abdomen should be evaluated relative to the chest, waist, and hips. A patch near the forearm should be evaluated relative to elbow and hand geometry.
### 4.4 Regional plausibility
Regional plausibility asks whether the visible region is the kind of region expected to expose skin under the scene conditions. The face and hands are frequently visible under many contexts, while the abdomen and hips may be visible under more specific clothing and pose conditions.
### 4.5 Body-part topology
The body has a topology of connected parts. A region is more likely to be skin when it plausibly connects to nearby body parts and to the overall body silhouette. A disconnected patch in the wrong place should have lower probability even if it has skin-like appearance.

## 5. Probabilistic Evidence Accumulation

Probability emerges through evidence accumulation. The framework treats skin probability as the result of multiple weak and strong cues that reinforce or weaken one another.
### 5.1 Local evidence
Local evidence includes color, texture, shading, local edge continuity, brightness distribution, reflectance, and simple surface structure. These cues matter, but they are only one part of the reasoning chain.
### 5.2 Global evidence
Global evidence includes body shape, body-region relation, garment structure, scene composition, camera angle, and semantic plausibility. These cues strengthen or weaken the local appearance of skin.
### 5.3 Anatomical consistency
Anatomical consistency evaluates whether the candidate skin region aligns with expected body geometry, body contour, and body topology. A region with skin-like local evidence but inconsistent anatomy should receive lower probability.
### 5.4 Regional consistency
Regional consistency evaluates whether the region looks like the correct part of the body for its location. A patch near the shoulder might be plausible as skin under a sleeveless shirt, but a patch near the lower leg may be less plausible if the scene shows a long coat and boots.
### 5.5 Cross-frame consistency
Cross-frame consistency asks whether the candidate region remains plausible across time. A region that appears skin-like in a single frame but changes into cloth or disappears under motion should receive lower temporal confidence.
### 5.6 Scene consistency
Scene consistency asks whether the visible skin pattern fits the broader scene. Beach scenes, swimming scenes, medical scenes, sports scenes, and gym scenes all create different expectations about body visibility and clothing.
### 5.7 Semantic consistency
Semantic consistency asks whether the visible skin pattern fits the culturally, functionally, or socially expected appearance of the setting. A medical examination may expose skin in an anatomical or protective context, while a winter city scene may keep much of the body covered.
### 5.8 Environmental consistency
Environmental consistency asks whether the visible skin would be expected under the lighting and scene conditions. Sunlight, indoor lighting, water reflection, and weather can all alter the visibility and salience of skin.
### 5.9 Multimodal agreement
Multimodal agreement occurs when different information streams support the same conclusion. For example, body pose, clothing arrangement, scene context, and motion continuity may all reinforce that a shoulder patch is likely skin.

## 6. Probability Hierarchy

Visual Features
Candidate Regions
Anatomical Evidence
Skin Likelihood
Contextual Validation
Scene Interpretation
Policy Interpretation

At the pixels stage, the system receives color, intensity, texture, and edge information. At the visual-features stage, it infers contours, boundaries, shading, and local surface structure. At the candidate-regions stage, it forms hypotheses about where skin might be located. At the anatomical-evidence stage, it evaluates body topology and body-region plausibility. At the skin-likelihood stage, it forms a preliminary probability judgment. At the contextual-validation stage, it tests the hypothesis against garment structure, posture, pose, motion, environment, and scene semantics. At the scene-interpretation stage, it develops a larger narrative of body visibility. At the policy-interpretation stage, it decides how the evidence should be treated for moderation, safety, medical, sports, educational, or entertainment contexts.

## 7. Complete Skin Probability Ontology

### 7.1 Face Skin
Observable evidence: the visual indicators that make face skin recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why face skin is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for face skin.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for face skin.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how face skin appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make face skin more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of face skin.
Temporal evidence: the way face skin changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make face skin difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of face skin.
Conflicting evidence: the cues that weaken or challenge the interpretation of face skin.
Downstream interpretation: the implications of recognizing face skin for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.2 Scalp
Observable evidence: the visual indicators that make scalp recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why scalp is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for scalp.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for scalp.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how scalp appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make scalp more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of scalp.
Temporal evidence: the way scalp changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make scalp difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of scalp.
Conflicting evidence: the cues that weaken or challenge the interpretation of scalp.
Downstream interpretation: the implications of recognizing scalp for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.3 Forehead
Observable evidence: the visual indicators that make forehead recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why forehead is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for forehead.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for forehead.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how forehead appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make forehead more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of forehead.
Temporal evidence: the way forehead changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make forehead difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of forehead.
Conflicting evidence: the cues that weaken or challenge the interpretation of forehead.
Downstream interpretation: the implications of recognizing forehead for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.4 Cheeks
Observable evidence: the visual indicators that make cheeks recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why cheeks is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for cheeks.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for cheeks.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how cheeks appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make cheeks more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of cheeks.
Temporal evidence: the way cheeks changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make cheeks difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of cheeks.
Conflicting evidence: the cues that weaken or challenge the interpretation of cheeks.
Downstream interpretation: the implications of recognizing cheeks for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.5 Neck
Observable evidence: the visual indicators that make neck recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why neck is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for neck.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for neck.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how neck appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make neck more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of neck.
Temporal evidence: the way neck changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make neck difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of neck.
Conflicting evidence: the cues that weaken or challenge the interpretation of neck.
Downstream interpretation: the implications of recognizing neck for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.6 Shoulders
Observable evidence: the visual indicators that make shoulders recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why shoulders is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for shoulders.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for shoulders.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how shoulders appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make shoulders more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of shoulders.
Temporal evidence: the way shoulders changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make shoulders difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of shoulders.
Conflicting evidence: the cues that weaken or challenge the interpretation of shoulders.
Downstream interpretation: the implications of recognizing shoulders for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.7 Upper Arms
Observable evidence: the visual indicators that make upper arms recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper arms is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for upper arms.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for upper arms.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how upper arms appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make upper arms more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of upper arms.
Temporal evidence: the way upper arms changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make upper arms difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper arms.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper arms.
Downstream interpretation: the implications of recognizing upper arms for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.8 Forearms
Observable evidence: the visual indicators that make forearms recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why forearms is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for forearms.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for forearms.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how forearms appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make forearms more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of forearms.
Temporal evidence: the way forearms changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make forearms difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of forearms.
Conflicting evidence: the cues that weaken or challenge the interpretation of forearms.
Downstream interpretation: the implications of recognizing forearms for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.9 Hands
Observable evidence: the visual indicators that make hands recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why hands is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for hands.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for hands.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how hands appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make hands more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of hands.
Temporal evidence: the way hands changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make hands difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of hands.
Conflicting evidence: the cues that weaken or challenge the interpretation of hands.
Downstream interpretation: the implications of recognizing hands for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.10 Chest
Observable evidence: the visual indicators that make chest recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why chest is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for chest.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for chest.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how chest appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make chest more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of chest.
Temporal evidence: the way chest changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make chest difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of chest.
Conflicting evidence: the cues that weaken or challenge the interpretation of chest.
Downstream interpretation: the implications of recognizing chest for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.11 Upper Torso
Observable evidence: the visual indicators that make upper torso recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper torso is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for upper torso.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for upper torso.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how upper torso appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make upper torso more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of upper torso.
Temporal evidence: the way upper torso changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make upper torso difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper torso.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper torso.
Downstream interpretation: the implications of recognizing upper torso for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.12 Abdomen
Observable evidence: the visual indicators that make abdomen recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why abdomen is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for abdomen.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for abdomen.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how abdomen appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make abdomen more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of abdomen.
Temporal evidence: the way abdomen changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make abdomen difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of abdomen.
Conflicting evidence: the cues that weaken or challenge the interpretation of abdomen.
Downstream interpretation: the implications of recognizing abdomen for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.13 Back
Observable evidence: the visual indicators that make back recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why back is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for back.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for back.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how back appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make back more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of back.
Temporal evidence: the way back changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make back difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of back.
Conflicting evidence: the cues that weaken or challenge the interpretation of back.
Downstream interpretation: the implications of recognizing back for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.14 Waist
Observable evidence: the visual indicators that make waist recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why waist is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for waist.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for waist.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how waist appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make waist more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of waist.
Temporal evidence: the way waist changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make waist difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of waist.
Conflicting evidence: the cues that weaken or challenge the interpretation of waist.
Downstream interpretation: the implications of recognizing waist for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.15 Hips
Observable evidence: the visual indicators that make hips recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why hips is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for hips.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for hips.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how hips appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make hips more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of hips.
Temporal evidence: the way hips changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make hips difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of hips.
Conflicting evidence: the cues that weaken or challenge the interpretation of hips.
Downstream interpretation: the implications of recognizing hips for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.16 Upper Legs
Observable evidence: the visual indicators that make upper legs recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper legs is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for upper legs.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for upper legs.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how upper legs appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make upper legs more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of upper legs.
Temporal evidence: the way upper legs changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make upper legs difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper legs.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper legs.
Downstream interpretation: the implications of recognizing upper legs for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.17 Lower Legs
Observable evidence: the visual indicators that make lower legs recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why lower legs is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for lower legs.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for lower legs.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how lower legs appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make lower legs more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of lower legs.
Temporal evidence: the way lower legs changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make lower legs difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of lower legs.
Conflicting evidence: the cues that weaken or challenge the interpretation of lower legs.
Downstream interpretation: the implications of recognizing lower legs for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.18 Feet
Observable evidence: the visual indicators that make feet recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why feet is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for feet.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for feet.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how feet appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make feet more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of feet.
Temporal evidence: the way feet changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make feet difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of feet.
Conflicting evidence: the cues that weaken or challenge the interpretation of feet.
Downstream interpretation: the implications of recognizing feet for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.19 Partial Body Visibility
Observable evidence: the visual indicators that make partial body visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why partial body visibility is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for partial body visibility.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for partial body visibility.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how partial body visibility appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make partial body visibility more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of partial body visibility.
Temporal evidence: the way partial body visibility changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make partial body visibility difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of partial body visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of partial body visibility.
Downstream interpretation: the implications of recognizing partial body visibility for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.20 Occluded Skin
Observable evidence: the visual indicators that make occluded skin recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why occluded skin is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for occluded skin.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for occluded skin.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how occluded skin appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make occluded skin more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of occluded skin.
Temporal evidence: the way occluded skin changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make occluded skin difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of occluded skin.
Conflicting evidence: the cues that weaken or challenge the interpretation of occluded skin.
Downstream interpretation: the implications of recognizing occluded skin for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.21 Medical Exposure
Observable evidence: the visual indicators that make medical exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why medical exposure is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for medical exposure.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for medical exposure.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how medical exposure appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make medical exposure more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of medical exposure.
Temporal evidence: the way medical exposure changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make medical exposure difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of medical exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of medical exposure.
Downstream interpretation: the implications of recognizing medical exposure for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.22 Sports Exposure
Observable evidence: the visual indicators that make sports exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why sports exposure is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for sports exposure.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for sports exposure.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how sports exposure appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make sports exposure more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of sports exposure.
Temporal evidence: the way sports exposure changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make sports exposure difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of sports exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of sports exposure.
Downstream interpretation: the implications of recognizing sports exposure for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.

### 7.23 Swimming Context
Observable evidence: the visual indicators that make swimming context recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why swimming context is visible or hidden.
Clothing evidence: the garment boundary, fit, overlap, transparency, or displacement that changes the skin probability pattern for swimming context.
Lighting evidence: the way illumination, specular highlight, shadows, and reflectance affect the apparent skin probability for swimming context.
Environmental evidence: the surroundings, weather, water, surface, background, and scene arrangement that shape how swimming context appears.
Pose evidence: the body orientation, limb position, trunk rotation, and posture that make swimming context more or less likely to be skin.
Movement evidence: the body motion or garment motion that changes the visibility of swimming context.
Temporal evidence: the way swimming context changes across time through movement, occlusion, or camera shift.
Ambiguity sources: the conditions that can make swimming context difficult to interpret, including blur, distance, shadow, reflection, crop, occlusion, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of swimming context.
Conflicting evidence: the cues that weaken or challenge the interpretation of swimming context.
Downstream interpretation: the implications of recognizing swimming context for scene reasoning, policy interpretation, medical analysis, sports reasoning, or human appearance understanding.