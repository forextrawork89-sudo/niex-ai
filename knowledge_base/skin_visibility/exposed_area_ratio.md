# Human Body Exposure Intelligence Framework

This document is a complete knowledge-base reconstruction for human body exposure reasoning. It replaces any fragmented, implementation-oriented exposure analysis with a research-grade conceptual framework that explains how visible body exposure is interpreted within complete scenes.
Exposure reasoning is not the same as nudity detection, skin segmentation, clothing recognition, pixel-ratio estimation, or simple body-part counting. It is an explainable process for understanding why a body region appears visible, covered, occluded, framed, or contextually exposed within a broader visual and social setting.
The framework treats body exposure as a structured phenomenon involving anatomy, clothing, posture, body orientation, scene arrangement, occlusion, lighting, temporal change, and social context. A body exposure interpretation is meaningful only when it explains the visible evidence and the reasons for that interpretation.

## 1. Foundations of Human Body Exposure

Human body exposure is the visible degree to which anatomical regions are available to the viewer through the combination of clothing, pose, posture, occlusion, camera framing, and scene context.
Exposure understanding begins with the principle that visible anatomy is not only a matter of skin pixels. It is a matter of anatomical region identification, clothing coverage, body articulation, environmental constraints, and social meaning.
A region may appear exposed because the clothing is absent, because the clothing is thin, because the body is rotated, because the garment is displaced, because the camera angle reveals more of the body, or because another object partially exposes the region.
The framework therefore treats exposure as a multimodal reasoning problem rather than a single-image measurement problem.

### 1.1 Exposure versus adjacent concepts
Nudity detection seeks to classify whether an image contains nudity. Exposure reasoning explains which anatomical regions are visible, which are covered, why visibility appears, and how that interpretation fits the scene.
Skin segmentation identifies pixel regions associated with skin-tone or skin-like appearance. Exposure reasoning examines anatomy, garment structure, body pose, and the explicit visible boundary of body coverage.
Clothing recognition identifies garments. Exposure reasoning explains how garments alter or reveal anatomy, whether the garment is tight, loose, layered, or displaced, and what that means within the wider context.
Pixel-ratio estimation counts visible skin-like pixels. Exposure reasoning explains whether those pixels correspond to meaningful anatomy or to artifacts such as lighting, reflections, shadows, body crop, or background contamination.

### 1.2 Why exposure reasoning matters
Exposure reasoning matters because the same visible anatomy can be interpreted differently across medical, sports, fashion, beach, occupational, dance, domestic, and protective contexts. The same body region can be ordinary in one scene and sensitive in another.
A robust exposure framework therefore needs to explain not only what is visible but also why that visibility is plausible, what the person appears to be doing, and whether the scene supports or challenges the interpretation.

### 1.3 Exposure as hierarchical explanation
Exposure understanding is built from evidence accumulation. Pixels provide low-level color and structure. Visual features describe edges, contours, texture, and boundaries. Body regions identify anatomy. Clothing coverage describes garment position and openness. Exposure patterns summarize visible body regions. Contextual interpretation links this pattern to setting, action, and social meaning. Policy interpretation then uses the resulting explanation for downstream safety or moderation purposes.

## 2. Human Anatomy Foundations

Human anatomy is the foundation for exposure reasoning because visible body regions are not arbitrary shapes. They are meaningful anatomical structures with expected relationships to posture, movement, clothing, and camera view.

### 2.1 Anatomical regions
The head, face, neck, shoulders, chest, arms, torso, abdomen, back, waist, hips, legs, knees, feet, and hands form the principal anatomy used in exposure reasoning. Each region has different visibility patterns, garment interactions, and social interpretations.
A face is often highly salient and carries strong identity and expression cues. The shoulders and chest are often affected by neckline and shoulder coverage. The abdomen and waist are strongly influenced by fit and garment height. The hips and upper legs are strongly shaped by garment type and body orientation. The back and lower torso depend heavily on posture and clothing overlap.

### 2.2 Skeletal and muscular structure
The skeleton and musculature define the visible form of the body. Exposure reasoning uses anatomical structure to distinguish natural body shape from garment distortion, body crop, or camera perspective.
The pelvis, ribcage, shoulder girdle, spine, femur, humerus, tibia, and scapula create the geometry that shapes visible contours. A visible shoulder blade, protruding hip, or exposed collarbone is not merely a skin patch; it is a region whose visibility is anatomically plausible under a given posture and garment arrangement.

### 2.3 Body proportion and contour
Body proportion changes exposure patterns. A person with a wide torso, narrow hips, long legs, or sloped shoulders may reveal different regions under similar clothing than another person with different anatomy.
Exposure reasoning must therefore be anatomy-aware and not assume that all bodies expose the same regions under the same garments.

### 2.4 Anatomical symmetry and asymmetry
The body is often bilaterally organized, but natural asymmetry, posture, movement, and clothing can make one side more visible than the other. A bent arm may expose one side of the torso while the other is covered. A rotated body may reveal one shoulder but not the other.

## 3. Body Visibility and Body Perception

Visual body perception is the process by which visible anatomy is parsed from image evidence. It depends on contour, color contrast, garment boundaries, pose, body shape, and scene composition.

### 3.1 Visible anatomy
Visible anatomy is not determined solely by the absence of clothing. A body region may be visible because the garment stops above it, because the garment is transparent, because the body is twisted, because the garment is shifted, or because the region is visible through a gap between clothing layers.

### 3.2 Clothing coverage as an anatomical filter
Clothing coverage determines how much anatomy is visible, but not always in a simple binary way. A shirt may cover the torso while exposing the shoulders. A skirt may cover the hips while revealing the thigh region. A long coat may cover the torso and legs while leaving the neck visible.

### 3.3 Layering and partial exposure
Layered garments create complex exposure patterns. A jacket may overlap a shirt, which overlaps the torso. A scarf may cover the neck while leaving the face uncovered. A dress may expose one shoulder while covering the torso. Exposure reasoning must evaluate each layer and its relative position.

### 3.4 Body orientation and view
The same body can look very different from frontal, profile, three-quarter, or rear views. A side profile can expose the shoulder line while hiding the mid-torso. A rear view can reveal the back and the upper legs while hiding the face and chest.

## 4. Clothing Coverage and Garment Semantics

Clothing is one of the primary mediators of body exposure. It transforms anatomy into coverage patterns, but it also carries social, cultural, functional, and contextual meaning.

### 4.1 Coverage categories
Coverage categories include full coverage, shoulder exposure, chest exposure, abdominal exposure, waist exposure, hip exposure, upper leg exposure, lower leg exposure, and partial exposure. These are not merely visual labels; they are conceptual descriptions of how the body is revealed within the garment system.

### 4.2 Tightness and fit
Tight garments increase visibility of anatomical contours and can expose body lines that loose garments would obscure. A fitted shirt may reveal the torso outline and the waist shape, while a loose shirt may hide the same areas under fabric folds.

### 4.3 Transparency and cloth properties
Some fabrics reveal anatomy through translucency, sheen, or thinness. A thin dress or transparent shirt may reveal the body contour even if the garment is nominally present. Exposure reasoning must consider whether visible anatomy is a consequence of transparency rather than garment absence.

### 4.4 Garment movement
Garments move with the body. A shirt may ride upward during movement, exposing the waist. A dress may shift to reveal the shoulder. A hoodie may slip and expose the neck or upper back. Exposure reasoning should therefore include garment movement as a dynamic evidence source.

## 5. Body Exposure Ontology

The exposure ontology organizes body exposure into a structured taxonomy of visible body regions, garment relations, posture conditions, and contextual states.

### 5.1 Full Body Coverage
Observable evidence: the visual indicators that make full body coverage recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why full body coverage is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for full body coverage.
Posture evidence: the body orientation, curvature, limb position, and articulation that make the region appear more or less exposed.
Contextual evidence: the social, occupational, cultural, or situational context that makes the exposure pattern plausible.
Environmental evidence: the surroundings, lighting, weather, and scene arrangement that shape how the exposure appears.
Ambiguity sources: the conditions that can make full body coverage difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of full body coverage.
Conflicting evidence: the cues that weaken or challenge the interpretation of full body coverage.
Downstream interpretation: the implications of recognizing full body coverage for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.2 Head Visibility
Observable evidence: the visual indicators that make head visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why head visibility is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for head visibility.
Posture evidence: the body orientation, curvature, limb position, and articulation that make the region appear more or less exposed.
Contextual evidence: the social, occupational, cultural, or situational context that makes the exposure pattern plausible.
Environmental evidence: the surroundings, lighting, weather, and scene arrangement that shape how the exposure appears.
Ambiguity sources: the conditions that can make head visibility difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of head visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of head visibility.
Downstream interpretation: the implications of recognizing head visibility for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.3 Face Visibility
Observable evidence: the visual indicators that make face visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why face visibility is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for face visibility.
Ambiguity sources: the conditions that can make face visibility difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of face visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of face visibility.
Downstream interpretation: the implications of recognizing face visibility for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.4 Neck Exposure
Observable evidence: the visual indicators that make neck exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why neck exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for neck exposure.
Ambiguity sources: the conditions that can make neck exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of neck exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of neck exposure.
Downstream interpretation: the implications of recognizing neck exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.5 Shoulder Exposure
Observable evidence: the visual indicators that make shoulder exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why shoulder exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for shoulder exposure.
Ambiguity sources: the conditions that can make shoulder exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of shoulder exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of shoulder exposure.
Downstream interpretation: the implications of recognizing shoulder exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.6 Upper Arm Exposure
Observable evidence: the visual indicators that make upper arm exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper arm exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for upper arm exposure.
Ambiguity sources: the conditions that can make upper arm exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper arm exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper arm exposure.
Downstream interpretation: the implications of recognizing upper arm exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.7 Forearm Exposure
Observable evidence: the visual indicators that make forearm exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why forearm exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for forearm exposure.
Ambiguity sources: the conditions that can make forearm exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of forearm exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of forearm exposure.
Downstream interpretation: the implications of recognizing forearm exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.8 Hand Visibility
Observable evidence: the visual indicators that make hand visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why hand visibility is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for hand visibility.
Ambiguity sources: the conditions that can make hand visibility difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of hand visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of hand visibility.
Downstream interpretation: the implications of recognizing hand visibility for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.9 Chest Coverage
Observable evidence: the visual indicators that make chest coverage recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why chest coverage is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for chest coverage.
Ambiguity sources: the conditions that can make chest coverage difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of chest coverage.
Conflicting evidence: the cues that weaken or challenge the interpretation of chest coverage.
Downstream interpretation: the implications of recognizing chest coverage for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.10 Upper Torso Exposure
Observable evidence: the visual indicators that make upper torso exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper torso exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for upper torso exposure.
Ambiguity sources: the conditions that can make upper torso exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper torso exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper torso exposure.
Downstream interpretation: the implications of recognizing upper torso exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.11 Abdominal Exposure
Observable evidence: the visual indicators that make abdominal exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why abdominal exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for abdominal exposure.
Ambiguity sources: the conditions that can make abdominal exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of abdominal exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of abdominal exposure.
Downstream interpretation: the implications of recognizing abdominal exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.12 Back Exposure
Observable evidence: the visual indicators that make back exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why back exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for back exposure.
Ambiguity sources: the conditions that can make back exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of back exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of back exposure.
Downstream interpretation: the implications of recognizing back exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.13 Waist Visibility
Observable evidence: the visual indicators that make waist visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why waist visibility is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for waist visibility.
Ambiguity sources: the conditions that can make waist visibility difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of waist visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of waist visibility.
Downstream interpretation: the implications of recognizing waist visibility for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.14 Hip Region Exposure
Observable evidence: the visual indicators that make hip region exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why hip region exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for hip region exposure.
Ambiguity sources: the conditions that can make hip region exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of hip region exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of hip region exposure.
Downstream interpretation: the implications of recognizing hip region exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.15 Upper Leg Exposure
Observable evidence: the visual indicators that make upper leg exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper leg exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for upper leg exposure.
Ambiguity sources: the conditions that can make upper leg exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper leg exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper leg exposure.
Downstream interpretation: the implications of recognizing upper leg exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.16 Lower Leg Exposure
Observable evidence: the visual indicators that make lower leg exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why lower leg exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for lower leg exposure.
Ambiguity sources: the conditions that can make lower leg exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of lower leg exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of lower leg exposure.
Downstream interpretation: the implications of recognizing lower leg exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.17 Feet Visibility
Observable evidence: the visual indicators that make feet visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why feet visibility is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for feet visibility.
Ambiguity sources: the conditions that can make feet visibility difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of feet visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of feet visibility.
Downstream interpretation: the implications of recognizing feet visibility for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.18 Partial Body Visibility
Observable evidence: the visual indicators that make partial body visibility recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why partial body visibility is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for partial body visibility.
Ambiguity sources: the conditions that can make partial body visibility difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of partial body visibility.
Conflicting evidence: the cues that weaken or challenge the interpretation of partial body visibility.
Downstream interpretation: the implications of recognizing partial body visibility for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.19 Occluded Body Regions
Observable evidence: the visual indicators that make occluded body regions recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why occluded body regions is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for occluded body regions.
Ambiguity sources: the conditions that can make occluded body regions difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of occluded body regions.
Conflicting evidence: the cues that weaken or challenge the interpretation of occluded body regions.
Downstream interpretation: the implications of recognizing occluded body regions for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.20 Medical Exposure
Observable evidence: the visual indicators that make medical exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why medical exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for medical exposure.
Ambiguity sources: the conditions that can make medical exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of medical exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of medical exposure.
Downstream interpretation: the implications of recognizing medical exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.21 Sports Exposure
Observable evidence: the visual indicators that make sports exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why sports exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for sports exposure.
Ambiguity sources: the conditions that can make sports exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of sports exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of sports exposure.
Downstream interpretation: the implications of recognizing sports exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.22 Swimming Exposure
Observable evidence: the visual indicators that make swimming exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why swimming exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for swimming exposure.
Ambiguity sources: the conditions that can make swimming exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of swimming exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of swimming exposure.
Downstream interpretation: the implications of recognizing swimming exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.23 Fitness Clothing Exposure
Observable evidence: the visual indicators that make fitness clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why fitness clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for fitness clothing exposure.
Ambiguity sources: the conditions that can make fitness clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of fitness clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of fitness clothing exposure.
Downstream interpretation: the implications of recognizing fitness clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.24 Occupational Clothing Exposure
Observable evidence: the visual indicators that make occupational clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why occupational clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for occupational clothing exposure.
Ambiguity sources: the conditions that can make occupational clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of occupational clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of occupational clothing exposure.
Downstream interpretation: the implications of recognizing occupational clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.25 Winter Clothing Exposure
Observable evidence: the visual indicators that make winter clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why winter clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for winter clothing exposure.
Ambiguity sources: the conditions that can make winter clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of winter clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of winter clothing exposure.
Downstream interpretation: the implications of recognizing winter clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.26 Summer Clothing Exposure
Observable evidence: the visual indicators that make summer clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why summer clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for summer clothing exposure.
Ambiguity sources: the conditions that can make summer clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of summer clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of summer clothing exposure.
Downstream interpretation: the implications of recognizing summer clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.27 Formal Clothing Exposure
Observable evidence: the visual indicators that make formal clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why formal clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for formal clothing exposure.
Ambiguity sources: the conditions that can make formal clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of formal clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of formal clothing exposure.
Downstream interpretation: the implications of recognizing formal clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.28 Casual Clothing Exposure
Observable evidence: the visual indicators that make casual clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why casual clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for casual clothing exposure.
Ambiguity sources: the conditions that can make casual clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of casual clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of casual clothing exposure.
Downstream interpretation: the implications of recognizing casual clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.29 Protective Equipment Exposure
Observable evidence: the visual indicators that make protective equipment exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why protective equipment exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for protective equipment exposure.
Ambiguity sources: the conditions that can make protective equipment exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of protective equipment exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of protective equipment exposure.
Downstream interpretation: the implications of recognizing protective equipment exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.30 Uniform Exposure
Observable evidence: the visual indicators that make uniform exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why uniform exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for uniform exposure.
Ambiguity sources: the conditions that can make uniform exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of uniform exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of uniform exposure.
Downstream interpretation: the implications of recognizing uniform exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.31 Traditional Clothing Exposure
Observable evidence: the visual indicators that make traditional clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why traditional clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for traditional clothing exposure.
Ambiguity sources: the conditions that can make traditional clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of traditional clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of traditional clothing exposure.
Downstream interpretation: the implications of recognizing traditional clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.32 Beach Exposure
Observable evidence: the visual indicators that make beach exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why beach exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for beach exposure.
Ambiguity sources: the conditions that can make beach exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of beach exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of beach exposure.
Downstream interpretation: the implications of recognizing beach exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.33 Dance Costume Exposure
Observable evidence: the visual indicators that make dance costume exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why dance costume exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for dance costume exposure.
Ambiguity sources: the conditions that can make dance costume exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of dance costume exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of dance costume exposure.
Downstream interpretation: the implications of recognizing dance costume exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.34 Layered Garment Exposure
Observable evidence: the visual indicators that make layered garment exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why layered garment exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for layered garment exposure.
Ambiguity sources: the conditions that can make layered garment exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of layered garment exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of layered garment exposure.
Downstream interpretation: the implications of recognizing layered garment exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.35 Transparent Clothing Exposure
Observable evidence: the visual indicators that make transparent clothing exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why transparent clothing exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for transparent clothing exposure.
Ambiguity sources: the conditions that can make transparent clothing exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of transparent clothing exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of transparent clothing exposure.
Downstream interpretation: the implications of recognizing transparent clothing exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.36 Nightwear Exposure
Observable evidence: the visual indicators that make nightwear exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why nightwear exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for nightwear exposure.
Ambiguity sources: the conditions that can make nightwear exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of nightwear exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of nightwear exposure.
Downstream interpretation: the implications of recognizing nightwear exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.37 Underwear Exposure
Observable evidence: the visual indicators that make underwear exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why underwear exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for underwear exposure.
Ambiguity sources: the conditions that can make underwear exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of underwear exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of underwear exposure.
Downstream interpretation: the implications of recognizing underwear exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.38 Lingerie Exposure
Observable evidence: the visual indicators that make lingerie exposure recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why lingerie exposure is visible or hidden.
Clothing evidence: the garment boundary, garment fit, overlap, or transparency that changes the exposure pattern for lingerie exposure.
Ambiguity sources: the conditions that can make lingerie exposure difficult to interpret, including distance, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of lingerie exposure.
Conflicting evidence: the cues that weaken or challenge the interpretation of lingerie exposure.
Downstream interpretation: the implications of recognizing lingerie exposure for scene reasoning, safety moderation, medical interpretation, or policy context.

### 5.39 Activewear Exposure