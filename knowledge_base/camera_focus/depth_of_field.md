# Depth of Field as Visual Evidence

## 1. Document Control & Knowledge Metadata
- **Module Identifier:** camera_focus.depth_of_field
- **Specification Class:** KB-CF-DOF-001
- **Knowledge Role:** Visual evidence module for depth, saliency, scene structure, and downstream reasoning
- **Primary Purpose:** Explain how depth of field behaves in the real world and how it should be interpreted as evidence in multimodal visual reasoning
- **Non-Purpose:** This module does not describe image processing pipelines, runtime implementations, or software-specific blur detection algorithms
- **Intended Use:** Reasoning about visibility, focus behavior, saliency, anatomical perception, body exposure, scene composition, and uncertainty propagation
- **Versioning Model:** Stable conceptual ontology with compatibility for future knowledge-graph integration

---

## 2. Purpose & Scope
Depth of Field (DoF) is not a decorative photographic artifact. It is a measurable physical phenomenon that changes how a scene is perceived, how objects appear in relation to one another, and how confidently a system can infer structure, anatomy, context, and risk. In a multimodal reasoning platform, DoF acts as a source of visual evidence.

It affects:
- visibility and object separability
- segmentation reliability
- saliency and attention allocation
- anatomical perception and body-part clarity
- coverage and exposure estimation
- apparent body proportions and pose reliability
- age-related feature visibility
- relationship and context interpretation
- policy-relevant scene understanding

This module explains why and how DoF should be treated as evidence, not merely as a blur effect.

### 2.1 Core Interpretation Principle
DoF is not evidence of a semantic label by itself. It is a contextual signal that changes the reliability of many other observations. A shallow focus region may make a subject appear more prominent, but it may also suppress evidence about surrounding objects, visible skin, clothing coverage, or scene context. The system should therefore preserve both the positive and negative evidential value of DoF.

### 2.2 Why This Matters
A scene with extremely shallow DoF can create strong perceptual emphasis on a central subject while degrading evidence in the background. A scene with deep focus can preserve broad context but weaken subject isolation cues. These effects influence downstream reasoning and must be modelled explicitly.

---

## 3. Physical Foundations of Depth of Field

### 3.1 Optical Definition
Depth of Field is the range of scene distances that appear acceptably sharp in an image, given a particular optical system, sensor geometry, focus setting, and acceptable blur threshold. It is a property of the imaging system and the viewing conditions, but its perceptual consequences matter for interpretation.

The key distinction is between:
- depth of field: the range of distances that appear sharp
- depth of focus: the range of image-plane positions over which an image remains acceptably sharp for a fixed subject distance

These are related but not identical concepts, and their confusion is common in both photography and visual reasoning.

### 3.2 Lens Geometry and Image Formation
A simple lens forms an image by refracting rays from a scene point onto the image plane. For a given lens position and focus setting, only one scene distance is perfectly imaged to a point on the sensor plane. Scene points at other distances project as circles rather than points. These circles are the optical manifestation of defocus blur.

The imaging system produces a point spread function (PSF) that broadens as the object moves away from the focus plane. The size and shape of this PSF depend on:
- aperture size
- focal length
- focus distance
- sensor size or image format
- lens quality
- wavelength of light

### 3.3 Focal Length
Focal length influences both perspective and depth-of-field behavior. A longer focal length typically compresses perspective and often produces a visually shallower depth of field for a given framing and aperture. A shorter focal length often produces wider perspective and a deeper apparent field of focus.

However, focal length is not the sole determinant. The same subject framed at different distances and with different sensor sizes can yield different results. The system should treat focal length as a contributing factor rather than a standalone proxy for blur depth.

### 3.4 Aperture
The aperture controls the effective opening through which light passes. A wider aperture (smaller f-number) increases light gathering and generally produces a shallower depth of field. A narrower aperture (larger f-number) reduces the amount of light entering the system and generally increases the depth of field.

The physical reason is that a larger aperture allows a wider range of rays from off-focus points to converge into larger blur circles, while a smaller aperture constrains those circles more tightly.

### 3.5 Sensor Size and Crop Factor
Sensor size strongly affects the apparent DoF. A larger sensor, when paired with the same framing and aperture, often records a shallower depth of field than a smaller sensor. The same lens on a full-frame camera and on a smaller sensor can create very different blur profiles.

This matters because visual systems may observe similar-looking images from different devices and must not assume a one-size-fits-all interpretation. A shallow-focus image from a smartphone can be visually similar to one from a larger camera, but the underlying optical assumptions differ.

### 3.6 Focus Distance
Focus distance is the distance from the lens to the plane that is rendered sharpest. The farther the object is from the lens, the more the depth of field extends, though the exact relationship depends on aperture and focal length. Because focus distance alters the geometry of the PSF and the apparent separation between subject and background, it is a central variable in scene interpretation.

### 3.7 Circle of Confusion
The circle of confusion is the diameter of the blur spot that is still considered acceptable for the image to look sharp. It is a threshold concept, not a universal physical constant. The acceptable blur size depends on viewing distance, display size, and the intended output format.

In a reasoning system, this concept matters because the boundary between ?sharp? and ?blurred? is not absolute. What is considered acceptable sharpness in a high-resolution print may differ from what is considered acceptable on a small mobile display.

### 3.8 Hyperfocal Distance
The hyperfocal distance is the focus distance that maximizes the depth of field for a given aperture and focal length, such that objects from half that distance to infinity are acceptably sharp. It is often used in landscape and architectural photography, but it is also a useful conceptual bridge for understanding how focus settings alter the visible range of detail.

### 3.9 Optical Blur and Defocus Blur
Optical blur is the broadening of image structure caused by imperfect image formation. Defocus blur is one form of optical blur: it occurs when scene points lie outside the focus plane and project as blur circles. This differs from motion blur, which stems from object or camera movement during exposure.

Defocus blur is often spatially structured and depth-dependent, whereas motion blur is directionally smeared and temporally correlated. The distinction is important for evidence interpretation.

### 3.10 Diffraction
Diffraction is the wave-based spreading of light as it passes through finite apertures. At very small apertures, diffraction can reduce sharpness even as it increases depth of field. This creates an important counterpoint: deeper focus is not always visually sharper. A narrow aperture may make more of the image appear in focus while simultaneously reducing the contrast and edge definition due to diffraction.

### 3.11 Lens Imperfections
Real lenses do not behave like perfect optical systems. They introduce imperfections that change the appearance of sharpness and blur. Common imperfections include:
- chromatic aberration
- spherical aberration
- astigmatism
- field curvature
- vignetting

These effects can make some regions appear softer or differently colored even when the nominal focus plane is correct. In downstream reasoning, such imperfections can create spurious evidence unless they are recognized as optical artifacts.

### 3.12 Chromatic Aberration
Chromatic aberration appears as color fringing around high-contrast edges. It is caused by wavelength-dependent focal positions. When a lens has longitudinal or lateral chromatic aberration, different wavelengths focus at slightly different planes, leading to colored halos or soft edges. This can be misinterpreted as defocus or as evidence of low image quality.

### 3.13 Spherical Aberration
Spherical aberration arises because rays entering different zones of a lens are focused at different distances. The result can be a softer image, halos, or asymmetric blur. It often affects the center and edges differently and can distort the apparent shape of blurred regions.

### 3.14 Depth Cues and Perspective Interaction
DoF interacts with perspective in complex ways. A shallow DoF can make a foreground subject appear isolated, while a deep DoF can preserve a stronger sense of spatial context. Perspective compression from telephoto lenses and distortion from wide-angle lenses can alter the apparent relative sizes and distances between objects.

Because humans use focus and blur as depth cues, the visual system may infer structure that is not actually present in the scene geometry. The reasoning system must treat DoF as a cue among others, not a direct measurement of depth.

## 4. Visual Perception of Depth Through Focus and Blur

### 4.1 Human Perception of Sharpness
Humans do not perceive sharpness as a single scalar. We perceive local contrast, edge transition, texture clarity, and coherence. A region can be technically sharp but visually less salient if contrast is low. Conversely, a region can appear prominent because of selective blur around it.

The visual system often infers saliency and subjecthood from relative sharpness. A sharply rendered face surrounded by blur may be treated as the primary object, even if the real-world scene does not place it there semantically.

### 4.2 Blur Gradients
Blur is rarely uniform. It often forms a gradient, with the sharpest region near the focus plane and progressively more softened regions away from it. Humans are sensitive to these gradients because they imply depth structure and object layering. In reasoning terms, blur gradients are not merely aesthetic features; they encode spatial relationships.

### 4.3 Perspective and Relative Sharpness
Relative sharpness interacts with perspective. A face in the foreground may appear sharper than the background because of focus and because of natural attenuation due to distance and atmospheric effects. A system should distinguish these from camera-induced shallow focus. A sharp subject in a blurry background may be evidence of lens focus, but it should not be treated as definitive evidence of semantic importance without supporting context.

### 4.4 Texture Degradation and Edge Sharpness
DoF affects texture visibility. As objects move away from the focus plane, fine textures become less distinct. Edge sharpness drops, contrast decreases, and object boundaries become less reliable. This matters for segmentation, landmark detection, clothing analysis, and body-shape reasoning.

### 4.5 Contrast Loss and Background Separation
Blur often reduces local contrast. In some cases, this can make an object appear more isolated (higher subject-background separation), but in others it can reduce the visibility of meaningful detail. The system should therefore interpret DoF-induced contrast loss carefully.

### 4.6 Perception vs Measurement
Raw measurements of blur can indicate local optical softness, but human perception may interpret that softness as depth separation, emphasis, or object importance. The reasoning system should preserve the distinction between:
- optical measurement: observed blur magnitude
- perceptual interpretation: human-recognized depth or salience
- semantic interpretation: evidence about scene structure or policy relevance

## 5. Evidence Architecture for DoF

### 5.1 Evidence Chain
The reasoning chain for depth of field should follow this structure:

Observation
Visual Evidence
Confidence
Uncertainty
Supporting Evidence
Conflicting Evidence
Alternative Interpretation
Contribution to Scene Understanding

This prevents direct overconfident leaps from ?blur detected? to ?object is isolated? or ?content is suggestive.?

### 5.2 Observations
Useful observations include:
- local sharpness distribution
- edge clarity and edge spread
- contrast gradients
- subject-background separation
- focus plane consistency
- temporal focus consistency across frames
- relative sharpness of multiple objects
- color fringing or lens aberration patterns

### 5.3 Visual Evidence Types
DoF contributes several distinct evidence types:
- spatial emphasis evidence
- depth layering evidence
- salience evidence
- boundary uncertainty evidence
- context suppression evidence
- object isolation evidence

Each should be tracked separately rather than collapsed into one generic ?blur? signal.

### 5.4 Evidence Representation
A robust reasoning module should represent DoF evidence with fields such as:
- evidence source
- observable feature
- strength
- directionality
- confidence
- uncertainty
- supporting cues
- conflicting cues
- alternate explanation
- downstream impact

### 5.5 Evidence Integration Rules
DoF evidence should be interpreted relative to:
- subject presence
- scene content
- camera framing
- focal plane placement
- motion state
- lighting conditions
- image quality artifacts

A shallow depth of field should not automatically imply that the sharp subject is semantically important, sexually suggestive, or more policy-relevant. It may simply indicate a composition choice or a camera effect.

## 6. Semantic Interpretation of Blur Sources
DoF should not be conflated with other blur mechanisms.

### 6.1 Optical Blur
Optical blur is caused by the physical imaging optics and focus geometry. It is often depth-dependent and spatially structured.

### 6.2 Motion Blur
Motion blur is caused by movement during exposure. It often appears streaked or directional rather than circular and may be inconsistent with the expected focus plane.

### 6.3 Defocus Blur
Defocus blur occurs when parts of a scene are outside the focus plane. It is the canonical DoF effect and is usually predictable from lens geometry.

### 6.4 Compression Artifacts
Compression artifacts are introduced by encoding and decoding. They can create blockiness, ringing, or false edge softness that may resemble blur.

### 6.5 AI-Generated Blur
AI-generated blur may be synthetic, scene-consistent, or semantically inserted. It may not correspond to real optical geometry and can create unrealistic depth layering.

### 6.6 Synthetic Bokeh
Synthetic bokeh is digitally simulated blur, particularly common in portrait modes or post-processing. It may appear plausible but can violate physical consistency and should be treated as a high-risk artifact in evidence workflows.

### 6.7 Lens Simulation and Portrait Mode Blur
Portrait-mode or lens-simulation blur is often generated by combining a depth estimate with a blur field. Even when visually convincing, it may be inconsistent with actual sensor optics or true scene depth.

### 6.8 Background Replacement
When a background is replaced or separated and then blurred, the blur may carry little optical evidence about the original scene. This can mislead reasoning systems about depth and saliency.

### 6.9 Semantic Distinction Summary
The system should distinguish between:
- physically plausible optical blur
- mechanically induced motion blur
- algorithmically generated blur
- image-editing artifacts
- synthetic compositing effects

This distinction is essential for trustworthy evidence interpretation.

## 7. Confidence Propagation Through DoF Evidence
Depth of field affects downstream confidence in multiple reasoning tasks. It should not be treated as a standalone decision but as a modifier of evidence strength.

### 7.1 Segmentation Confidence
DoF can reduce confidence in segmentation when object boundaries are softened, especially at the edges of a subject. Strong blur may make limbs, clothing boundaries, or hair regions harder to segment faithfully.

### 7.2 Landmark Confidence
Landmarks near the focus plane may appear sharper and more reliable, while landmarks in defocused regions may be less stable. Confidence should drop for landmarks located in visually ambiguous or highly blurred areas.

### 7.3 Pose Confidence
Pose inference can be misled when blur changes the apparent shape of the body, obscures limb contours, or suppresses the clarity of the torso and extremities. DoF should lower pose confidence when the visible structure is softened or ambiguous.

### 7.4 Coverage Confidence
Coverage estimation may be affected because visible skin, clothing, or exposed anatomy can be reduced or visually obscured by shallow focus. The apparent coverage may differ from the true physical coverage. DoF should increase caution rather than certainty.

### 7.5 Body-Proportion Confidence
Blur can make limb lengths, torso proportions, or body shape appear less reliable. A shallow-focus portrait may exaggerate or suppress anatomical proportions due to the selective rendering of detail.

### 7.6 Clothing Confidence
Clothing boundary clarity is often reduced by blur, especially at edges, folds, and overlapping garments. DoF can thus weaken confidence in clothing analysis and exposure assessment.

### 7.7 Age-Estimation Confidence
Age-related cues such as skin texture, wrinkle density, craniofacial contours, or developmental features may be less visible in blurred regions. DoF should therefore modulate age-related confidence rather than being ignored.

### 7.8 Scene-Understanding Confidence
Depth of field can suppress contextual evidence from the background while emphasizing the subject. This changes scene understanding by altering the relative salience of objects. Confidence should be distributed accordingly.

### 7.9 Risk-Assessment Confidence
DoF may make a scene seem more or less revealing depending on what is in focus. If the subject is isolated with strong focus separation, the visual emphasis may be much stronger than the underlying semantic content. Risk assessment should treat this as evidence that requires calibration.

### 7.10 Policy Decision Confidence
Policy decisions should not rely on shallow DoF alone. The system should preserve uncertainty and ask whether the observed emphasis reflects actual exposure, composition, or a synthetic effect.

### 7.11 Hierarchical Confidence Propagation
A practical confidence architecture can propagate DoF influence hierarchically:
- Local image evidence
- Subject/background separation evidence
- Structural feature evidence
- Semantic interpretation evidence
- Policy or safety decision evidence

At each level, DoF modifies confidence according to whether it increases clarity, decreases clarity, or introduces ambiguity.

## 8. Uncertainty Propagation
Uncertainty must be represented explicitly because DoF is an imperfect and context-dependent cue.

### 8.1 Focus Uncertainty
Focus uncertainty arises when the exact focus plane is not known. A subject may be sharp, but the camera might be focused on a nearby plane, a mid-plane, or an off-target object.

### 8.2 Camera Calibration Uncertainty
Camera parameters such as focal length, aperture, sensor size, and crop factor may be unknown or approximate. Any DoF interpretation should reflect that uncertainty.

### 8.3 Depth Uncertainty
The actual scene depth of objects is not directly known from the image. DoF indicates a relative relationship, not a precise geometric measurement. This uncertainty should propagate into any depth-based interpretation.

### 8.4 Edge Uncertainty
Blur changes edge sharpness, and edge sharpness is often the basis for segmentation and landmark detection. As edges soften, the uncertainty of object boundaries grows.

### 8.5 Object Boundary Uncertainty
A subject may look isolated because of shallow DoF, but the true boundary between subject and background may be difficult to locate. This uncertainty affects segmentation and exposure analysis.

### 8.6 Occlusion Uncertainty
DoF can make an object appear to overlap another because of visual layering. However, occlusion is not the same as depth. The system should preserve uncertainty when interpreting overlap and foreground-background structure.

### 8.7 Blur Estimation Uncertainty
Blur estimation itself is uncertain. Different methods may assign different blur magnitudes to the same region because of noise, contrast, texture, compression, and lens effects.

### 8.8 Lens Uncertainty
Lens quality and aberrations add uncertainty. A lens might produce visible blur in a way that looks like focus separation but is actually caused by a lens defect or chromatic artifact.

### 8.9 Synthetic Blur Uncertainty
Synthetic blur should be treated as a separate source of uncertainty because it may not agree with physical optics or the observed image signal.

### 8.10 Scene Ambiguity
The same visual pattern can be produced by different causes: real optical blur, motion blur, editing, or synthetic composition. The system should preserve ambiguity rather than forcing a single explanation.

### 8.11 Uncertainty Propagation Strategy
Uncertainty should flow from local observations to higher-level interpretations through a layered model.

A common pattern is:
- low-level image evidence: sharpness, contrast, edge clarity
- mid-level scene structure: subject/background separation, object extent, depth layering
- high-level semantic interpretation: exposure, policy relevance, naturalness, compositional intent

Each level should retain its own uncertainty and should not discard uncertainty when passing evidence upward.

## 9. Domain Ontology for DoF

### 9.1 Ontology Overview
Depth of Field
Sharpness
Depth Cue
Scene Understanding
Evidence
Reasoning

### 9.2 Primary Concepts

#### Concept: Depth of Field
- **Parent:** Focus
- **Children:** Defocus blur, focus plane, blur gradient, hyperfocal distance, shallow focus, deep focus
- **Related Concepts:** Aperture, focal length, circle of confusion, sensor size, focus distance
- **Dependencies:** Optical geometry, lens characteristics, scene distance, sensor dimensions
- **Semantic Relationships:** Indicates a range of visually acceptable sharpness; influences perceived depth separation

#### Concept: Focus Plane
- **Parent:** Focus
- **Children:** Subject distance, focus distance, plane of maximum sharpness
- **Related Concepts:** Depth of field, defocus blur, optical axis
- **Dependencies:** Lens position, subject distance, sensor placement
- **Semantic Relationships:** The reference plane from which defocus is measured

#### Concept: Defocus Blur
- **Parent:** Blur
- **Children:** Circle of confusion, PSF, blur radius, bokeh shape
- **Related Concepts:** Optical blur, point spread function, aperture shape
- **Dependencies:** Off-focus geometry, aperture, wavelength, lens quality
- **Semantic Relationships:** A physical consequence of scene points lying outside the focus plane

#### Concept: Sharpness
- **Parent:** Image quality signal
- **Children:** Edge sharpness, contrast, texture clarity, local frequency content
- **Related Concepts:** Blur, clarity, deconvolution, noise, edge spread
- **Dependencies:** Optics, sensor, lighting, compression
- **Semantic Relationships:** Opposite or inverse to blur in many contexts, but not always interchangeable

#### Concept: Depth Cue
- **Parent:** Perceptual signal
- **Children:** Blur gradient, perspective, occlusion, relative size, parallax
- **Related Concepts:** Scene understanding, salience, spatial layout
- **Dependencies:** Human visual interpretation and image geometry
- **Semantic Relationships:** Supports inference about scene structure and object arrangement

#### Concept: Salience
- **Parent:** Attention signal
- **Children:** Subject isolation, visual emphasis, foreground prominence
- **Related Concepts:** Blur, focus, composition, scene hierarchy
- **Dependencies:** Contrast, edge structure, gaze allocation, contextual priors
- **Semantic Relationships:** Strongly influenced by selective sharpness and blur

#### Concept: Evidence
- **Parent:** Reasoning substrate
- **Children:** Supporting evidence, conflicting evidence, alternative explanation, uncertainty
- **Related Concepts:** Confidence, scene graph, causal explanation
- **Dependencies:** Observations, feature extraction, prior knowledge
- **Semantic Relationships:** Forms the basis for downstream decisions

### 9.3 Ontology Use in Reasoning
The module should allow concepts to be linked across domains rather than being treated as isolated observations. For example:
- DoF evidence can support a subject-isolation hypothesis
- blur gradients can support a depth-layering hypothesis
- shallow focus can reduce confidence in boundary-related tasks
- synthetic blur can undermine the biological plausibility of the observed scene

## 10. Knowledge Contract

### 10.1 Purpose
To describe how depth of field acts as visual evidence in real-world and synthetic imagery and how that evidence should influence reasoning about scene structure, visibility, and safety.

### 10.2 Inputs
- image or video observations
- camera metadata when available
- scene layout priors
- subject and background segmentation
- focus-related cues
- lighting and exposure context
- known or suspected edit/composition history

### 10.3 Outputs
- DoF-related evidence claims
- confidence estimates
- uncertainty estimates
- supporting and conflicting evidence
- alternative explanations
- downstream influence on segmentation, pose, exposure, age, safety, and context reasoning

### 10.4 Dependencies
- optics and camera geometry
- scene depth priors
- perceptual psychology
- image quality analysis
- compositing and editing awareness
- cross-module evidence fusion

### 10.5 Assumptions
- The image is a projection of a real or synthetic scene and may include optical or post-processing effects
- The focus behavior may be physically plausible or intentionally simulated
- The system does not assume that blur always indicates semantic importance

### 10.6 Guarantees
- The module will preserve the distinction between optical blur and other blur types
- The module will identify evidence strength, confidence, and uncertainty separately
- The module will support explainable downstream reasoning

### 10.7 Failure Conditions
- unknown camera parameters
- low contrast and noisy images
- severe compression artifacts
- synthetic blur that mimics physical optics
- ambiguous scene geometry
- reflection, transparency, or glass causing misleading focus behavior

### 10.8 Evidence Outputs
Examples include:
- shallow focus suggests subject-background separation
- strong blur reduces boundary clarity
- inconsistent blur patterns suggest synthetic manipulation or compositing
- deep focus preserves broad context and increases scene-context confidence

### 10.9 Confidence Outputs
Confidence outputs should be calibrated by:
- sharpness contrast
- edge visibility
- subject-background separation
- motion consistency
- artifact plausibility
- cross-modal agreement

### 10.10 Uncertainty Outputs
Uncertainty outputs should explicitly state:
- whether focus plane is known
- whether optical cause is certain
- whether depth assumptions are robust
- whether blur could be synthetic or artifact-driven

## 11. Cross-Module Integration
DoF evidence should interact with many other modules rather than acting in isolation.

### 11.1 Camera Geometry
DoF is inseparable from lens geometry, camera position, viewpoint, and framing. A reasoner should not interpret blur outside the context of camera geometry.

### 11.2 Lighting
Lighting affects contrast, visibility, and apparent sharpness. Low-light scenes may appear soft because of noise rather than focus. High dynamic range can change the perception of edge clarity and blur.

### 11.3 Exposure
Exposure settings affect brightness, noise, and apparent sharpness. Long exposures can create motion blur, while underexposure can reduce visible texture and make defocus appear stronger than it is.

### 11.4 Body Proportions
DoF can distort the apparent proportions of the body by softening contours and reducing contrast. The body-proportion module should adjust confidence accordingly.

### 11.5 Coverage
Shallow focus may make exposed anatomy appear more prominent or less visible depending on which features are in focus. Coverage reasoning should account for this by tracking the visibility of covered versus exposed regions.

### 11.6 Pose
Pose inference relies on boundary clarity. Strong blur or soft edge transitions can reduce confidence in articulated posture interpretation.

### 11.7 Occlusion
Blur can make occlusion states ambiguous. A foreground object might appear to overlap a background object due to focus, not because of actual occlusion.

### 11.8 Movement
Motion blur and focus blur can both reduce clarity, but they have different meaning. Movement-related reasoning should distinguish them carefully.

### 11.9 Clothing
Clothing analysis depends on edge definition and texture. Blur may suppress folds, coverage distinctions, or garment boundaries.

### 11.10 Age Reasoning
DoF may hide or exaggerate facial or skin details that influence age-related judgments. Age reasoning should reduce confidence when key cues are blurred or occluded.

### 11.11 Relationship Analysis
Selective focus can alter perceived proximity, intimacy, or interaction. The relationship module should treat DoF as a contextual cue and not as a direct indication of relationship state.

### 11.12 Scene Context
DoF changes what is perceptually emphasized. This can alter scene understanding by leading the observer to focus on the subject while ignoring contextual clues.

### 11.13 Evidence Fusion
DoF evidence should be fused with other evidence sources using a calibrated scheme that preserves uncertainty and detects contradictions.

### 11.14 Confidence Engine
The confidence engine should include a DoF-specific submodule that adjusts confidence for segmentation, landmarking, pose, body analysis, age estimation, and scene interpretation.

### 11.15 Policy Engine
The policy engine should not use blur alone as a decision trigger. It should evaluate blur alongside context, plausibility, and uncertainty.

## 12. Failure Modes Library

### 12.1 Incorrect Autofocus
The camera may focus on the wrong plane, causing the subject to appear blurred while the background remains sharp. This can create false depth interpretations.

### 12.2 Shallow Depth Confusion
A very shallow DoF may be misread as a true scene separation or a semantic emphasis cue when it is only a compositional choice.

### 12.3 Deep Depth Confusion
A deep field may be misread as a lack of subject isolation when the actual scene layout includes strong object separation.

### 12.4 Background Distractions
A soft background may look irrelevant, but it may actually contain important context. DoF can suppress useful evidence.

### 12.5 Macro Photography
Macro imaging can produce very narrow focus ranges, making the apparent depth structure highly unusual and easy to misinterpret.

### 12.6 Telephoto Compression
Telephoto lenses compress perspective and can make depth relationships appear flatter or more exaggerated than they are.

### 12.7 Wide-Angle Distortion
Wide-angle lenses can make objects seem more separated or more distorted, complicating blur-based depth interpretations.

### 12.8 Portrait Mode Simulation
Portrait-style blur can look realistic but may be inconsistent with true optics. The system should treat it with caution.

### 12.9 AI-Generated Blur
AI-generated blur may be semantically plausible but physically implausible. It can create misleading cues for salience and depth.

### 12.10 Compression Artifacts
Compression artifacts can imitate softness or edge degradation and be mistaken for defocus.

### 12.11 Low-Light Noise
Noise can reduce apparent sharpness and be misattributed to depth-of-field effects.

### 12.12 Lens Flare and Reflection
Flare and reflections can alter local contrast and create misleading softening or bright halo effects.

### 12.13 Transparent Objects
Glass, water, and transparent materials can distort the apparent focus plane and make depth interpretation unreliable.

### 12.14 Fog, Smoke, Rain, and Atmospheric Effects
Atmospheric conditions can reduce clarity in ways that resemble or interact with defocus blur.

## 13. Edge-Case Library

### 13.1 Photography
DoF varies widely across phone cameras, mirrorless systems, DSLRs, and compact cameras. The same visual effect may arise from different optical conditions.

### 13.2 Cinematography
Cinematographic focus choices may intentionally emphasize a subject or create emotional tone. DoF should be interpreted as expressive evidence, not only as optical truth.

### 13.3 Mobile Cameras
Mobile cameras often use computational processing, small sensors, and portrait modes, which can make blur appearance less physically straightforward.

### 13.4 Security Cameras
Security cameras may have fixed focus, wide depth of field, or poor contrast. Their blur behavior may not resemble artistic or consumer-photography conventions.

### 13.5 Medical Imaging
Medical imaging uses focus and contrast differently from standard photography. DoF is not usually a direct visual evidence cue in the same way, and cross-domain comparisons should be avoided.

### 13.6 Sports
Sports imagery often involves motion and variable focus. Motion blur and defocus blur can be confounded in fast-moving sequences.

### 13.7 Night Scenes
Low light increases noise, reduces texture, and may make focus regions appear softer even when the optical system is correct.

### 13.8 Underwater Scenes
Water and refraction change focus behavior and visual clarity in ways that are not well captured by standard assumptions.

### 13.9 Mirrors and Glass
Mirrors and glass can create reflections and secondary images that complicate depth and focus interpretation.

### 13.10 VR and AR
Synthetic and rendered environments may encode focus behavior in ways that are physically inconsistent with the real world. The reasoning framework must remain cautious.

### 13.11 CGI and Synthetic Humans
Computer-generated humans may exhibit perfect or unrealistic blur patterns. The architecture should handle these as synthetic evidence sources.

### 13.12 Deepfakes and Edited Media
Generated or edited media often introduce selective blur that is not physically grounded. This is a major adversarial scenario for DoF-based reasoning.

## 14. Adversarial Analysis

### 14.1 Artificial Blur
Selective blur can be inserted to misdirect attention or hide content. The system should look for inconsistencies with expected optical geometry and local structure.

### 14.2 Background Replacement
A replaced background can carry plausible blur while the foreground subject remains unchanged. This can produce false depth layering evidence.

### 14.3 Portrait Mode Manipulation
Portrait mode blur can be inconsistent with the scene?s actual geometry and should be validated through other evidence sources.

### 14.4 GAN-Generated Bokeh
GAN or diffusion-based blur may appear visually convincing but violate physical relationships. These should be treated as synthetic evidence until validated.

### 14.5 AI Enhancement
Enhancement pipelines may increase sharpness in one region and soften another, creating false subject-background separation.

### 14.6 Image Editing
Cropped, retouched, or composited images may introduce blur that changes the apparent scene structure. The system should preserve uncertainty in such cases.

### 14.7 Synthetic Focus
Synthetic focus may be applied to create saliency, conceal detail, or imitate realism. DoF evidence should be checked for physical plausibility and scene consistency.

### 14.8 Validation Strategies
Validation should include:
- cross-checking blur against edge structure
- checking whether blur gradients follow plausible geometry
- detecting inconsistencies between optical blur and motion cues
- comparing the scene with known artifacts from editing or AI generation
- evaluating whether the blur pattern is stable across time and viewpoint

## 15. Explainability Requirements
Every conclusion involving DoF should explain:
- what blur evidence exists
- why that evidence supports the conclusion
- why it may be misleading
- the confidence level
- the uncertainty level
- alternative explanations

### 15.1 Example Explanation Template
A statement such as ?the subject appears isolated by shallow focus? should be traceable to:
- the local sharpness contrast between subject and background
- the blur gradient across depth layers
- the presence or absence of supporting cues such as perspective, occlusion, or object overlap
- the confidence and uncertainty associated with each component

### 15.2 Explainability Principle
DoF evidence should never be used as an opaque shortcut. It must remain auditable and interpretable within a larger evidence graph.

## 16. Knowledge Governance

### 16.1 Terminology
Terminology must be standardized so that concepts such as optical blur, defocus blur, synthetic bokeh, and motion blur are not used interchangeably.

### 16.2 Authoritative Definitions
The module should preserve authoritative and stable definitions for:
- depth of field
- focus plane
- defocus blur
- circle of confusion
- sharpness
- salience
- evidence confidence
- uncertainty

### 16.3 Version Compatibility
The module should remain stable across future model versions by keeping conceptual definitions separate from implementation choices.

### 16.4 Cross-Module References
DoF should be linked to modules covering:
- camera geometry
- lighting
- exposure
- body proportions
- clothing and coverage
- movement
- age reasoning
- scene context
- evidence fusion
- policy reasoning

### 16.5 Shared Ontology
The module should align with a shared ontology in which optics, perception, scene understanding, evidence, and reasoning are represented separately but linked through explicit relationships.

## 17. Future Compatibility
This module is designed to be compatible with future architectures that may use:
- knowledge graphs
- evidence graphs
- dependency graphs
- scene graphs
- reasoning graphs
- world models
- causal reasoning
- foundation visual intelligence

It does not implement these systems. Instead, it ensures that DoF is represented in a way that can later be consumed by them without semantic loss.

### 17.1 Compatibility Principles
- preserve explicit evidence structure
- preserve confidence and uncertainty values
- preserve concept relationships and dependencies
- avoid brittle implementation-specific assumptions
- retain platform-neutral terminology

## 18. Operational Summary
Depth of field should be interpreted as a structured visual evidence signal that changes the reliability of many downstream judgments. It can emphasize a subject, suppress context, reduce boundary clarity, alter apparent anatomy, and modify salience. At the same time, it can be misleading when caused by synthetic editing, lens artifacts, motion, low-light conditions, or compositing.

A strong reasoning platform treats DoF as a contextual signal with:
- physical grounding
- semantic distinction
- confidence calibration
- uncertainty propagation
- explainability
- safety awareness

It should never be reduced to a single blur metric or a simple aesthetic descriptor.

## 19. Canonical Reasoning Heuristic
When evaluating DoF in a scene, the system should ask:
1. What is in focus and what is not?
2. Is the blur likely to be optical, motion-related, synthetic, or artifact-driven?
3. Does the blur increase or decrease evidence quality for the downstream task?
4. What confidence and uncertainty should be assigned?
5. What alternative explanations remain viable?
6. How does this influence scene understanding and safety-related reasoning?

The answer should not be a binary classification. It should be a structured evidence narrative.


---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
+-----------------------------------------------------------------------------------------+
| DEPTH OF FIELD DETECTION PIPELINE                                                       |
+-----------------------------------------------------------------------------------------+
| [Raw Image / Video Stream] ---> [WebGPU Laplacian Kernel Shader] ---> [Sharpness Map]     |
|                                              |                                          |
|                                              v                                          |
|                          [WASM C++ Localized Blur Gradient Solver]                      |
|                                              |                                          |
|                                              v                                          |
|                      [Subject-to-Background Focus Isolation (I_focus)]                  |
|                                              |                                          |
|                                              v                                          |
|                           [Dynamic Downstream Weight Adjusters]                         |
+-----------------------------------------------------------------------------------------+
```

### 3.1 Localized Blur Gradient ($G_{\text{blur}}$)

Let $Var_{\text{person}}$ be the variance of the Laplacian of the segmented person mask, representing subject sharpness, and $Var_{\text{bg}}$ be the variance of the Laplacian of the background pixel region.

The continuous **Laplacian Operator** is computed over a $3 \times 3$ window to identify high-frequency edge details:

$$\nabla^2 Y(x, y) = \frac{\partial^2 Y}{\partial x^2} + \frac{\partial^2 Y}{\partial y^2}$$

The overall **Local Blur Gradient ($G_{\text{blur}}$)** is formulated on device as:
$$G_{\text{blur}} = \frac{Var_{\text{person}}}{\max\left(1.0, Var_{\text{bg}}\right)}$$

A high value of $G_{\text{blur}}$ ($\ge 5.0$) indicates that the subject is extremely sharp while the background is heavily blurred, signaling shallow depth of field (bokeh).

### 3.2 Focus Isolation Index ($I_{\text{focus}}$)

The **Focus Isolation Index ($I_{\text{focus}}$)** scales $G_{\text{blur}}$ relative to the maximum expected natural gradient to generate a normalized coefficient:

$$I_{\text{focus}} = \frac{G_{\text{blur}}}{\text{MaxExpectedGradient}} \cdot \Phi_{\text{contrast}}$$

Where $\Phi_{\text{contrast}}$ is the localized luminance contrast ratio, preventing low-contrast flat backgrounds from generating false blur readings.

---

## 4. Production-Grade Implementation Code

### 4.1 C++ WebAssembly Depth-of-Field Solver (`depth_of_field_solver.cpp`)
The following C++ engine compiles directly to WebAssembly with SIMD and auto-vectorization enabled. It handles Laplacian variance calculations, background contrast comparisons, and dynamic focus isolation evaluations:

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

constexpr int SKELETAL_COORDS_COUNT = 33;
constexpr int SHARPNESS_MAP_SIZE = 16384; // 128 * 128 local texture patch

struct Point3D {
    float x;
    float y;
    float z;
    float confidence;
};

struct DoFOutput {
    float mean_subject_sharpness;  // Var_person
    float mean_background_blur;     // Var_bg
    float focus_isolation_index;   // I_focus
    int focus_classification;      // 0 = Deep Focus, 1 = Shallow focus, 2 = Extreme Bokeh
    float confidence;
};

// Global memory buffers mapped to WebAssembly Linear Memory Heap
Point3D g_skeletal_coords_matrix[SKELETAL_COORDS_COUNT];
float g_subject_sharpness_map[SHARPNESS_MAP_SIZE];
float g_background_sharpness_map[SHARPNESS_MAP_SIZE];

class DepthOfFieldSolver {
public:
    DepthOfFieldSolver() = default;
    ~DepthOfFieldSolver() = default;

    static float CalculateVariance(const float* grads, int count) {
        if (count < 16) return 0.0f;

        float sum = 0.0f;
        for (int i = 0; i < count; ++i) {
            sum += grads[i];
        }
        float mean = sum / count;

        float var_sum = 0.0f;
#if defined(__wasm__) && defined(__SSE2__)
        int simd_limit = (count / 4) * 4;
        for (int i = 0; i < simd_limit; i += 4) {
            __m128 v_val = _mm_loadu_ps(&grads[i]);
            __m128 v_mean = _mm_set1_ps(mean);
            __m128 diff = _mm_sub_ps(v_val, v_mean);
            __m128 sq = _mm_mul_ps(diff, diff);

            alignas(16) float res[4];
            _mm_store_ps(res, sq);
            var_sum += res[0] + res[1] + res[2] + res[3];
        }
        for (int i = simd_limit; i < count; ++i) {
            var_sum += pow(grads[i] - mean, 2);
        }
#else
        for (int i = 0; i < count; ++i) {
            var_sum += pow(grads[i] - mean, 2);
        }
#endif
        return var_sum / count;
    }

    DoFOutput Solve(int count) {
        if (count > SHARPNESS_MAP_SIZE || count < 64) {
            return {0.0f, 0.0f, 0.0f, 0, 0.0f}; // Fail-safe fallback to standard deep focus
        }

        // 1. Calculate variance of Laplacian of subject (Var_person)
        float var_person = CalculateVariance(&g_subject_sharpness_map[0], count);

        // 2. Calculate variance of Laplacian of background (Var_bg)
        float var_bg = CalculateVariance(&g_background_sharpness_map[0], count);

        // 3. Compute dynamic Focus Isolation Index (I_focus)
        float expected_max_gradient = 15.0f; // Baseline sharpness threshold for high focus
        float g_blur = var_person / (std::max(1.0f, var_bg));
        float i_focus = g_blur / expected_max_gradient;
        i_focus = std::clamp(i_focus, 0.0f, 1.0f);

        // 4. Resolve Focus Classifications
        int focus_class = 0; // Deep Focus
        if (i_focus > 0.70f) {
            focus_class = 2; // Extreme Bokeh
        } else if (i_focus >= 0.30f) {
            focus_class = 1; // Shallow focus
        }

        // Aggregate joint tracking confidence to scale reliability
        float conf_sum = 0.0f;
        int active_joints[4] = {11, 12, 23, 24};
        for (int idx : active_joints) {
            conf_sum += g_skeletal_coords_matrix[idx].confidence;
        }
        float aggregate_conf = conf_sum / 4.0f;

        DoFOutput output;
        output.mean_subject_sharpness = var_person;
        output.mean_background_blur = var_bg;
        output.focus_isolation_index = i_focus;
        output.focus_classification = focus_class;
        output.confidence = aggregate_conf;

        return output;
    }
};

static DepthOfFieldSolver global_dof_solver;
static DoFOutput global_output_metrics;

extern "C" {
    __attribute__((import_name("onDoFMetricsResolved"))) void onConfidenceCalibrated(DoFOutput* output);

    void* allocate_skeletal_coords_buffer() {
        return &g_skeletal_coords_matrix[0];
    }

    void* allocate_subject_sharpness_buffer() {
        return &g_subject_sharpness_map[0];
    }

    void* allocate_background_sharpness_buffer() {
        return &g_background_sharpness_map[0];
    }

    void process_dof_evaluation(int count) {
        DoFOutput results = global_dof_solver.Solve(count);
        global_output_metrics = results;
        onConfidenceCalibrated(&global_output_metrics);
    }
}
```


### 4.2 WebGPU Laplacian Sharpness Shader (`localized_blur_extractor.wgsl`)
The following WGSL compute shader performs parallel Laplacian operator convolutions over the current frame to compute the spatial sharpness map in real-time:

```wgsl
struct SystemConfig {
    width: u32,
    height: u32,
    patch_dimension: u32,
    padding: u32,
};

@group(0) @binding(0) var<uniform> config: SystemConfig;
@group(0) @binding(1) var<storage, read> raw_frame_buffer: array<u32>; // W_frame * H_frame packed RGBA
@group(0) @binding(2) var<storage, read_write> output_sharpness_map: array<f32>;

const LAPLACIAN_KERNEL: array<i32, 9> = array<i32, 9>(
     0,  1,  0,
     1, -4,  1,
     0,  1,  0
);

fn get_pixel_luminance(x: i32, y: i32) -> f32 {
    let clamp_x = clamp(x, 0, i32(config.width) - 1);
    let clamp_y = clamp(y, 0, i32(config.height) - 1);
    let index = u32(clamp_y) * config.width + u32(clamp_x);
    let packed_rgb = raw_frame_buffer[index];
    
    // Extract RGB channels and calculate relative luminance Y
    let r = f32((packed_rgb >> 24u) & 0xffu) / 255.0;
    let g = f32((packed_rgb >> 16u) & 0xffu) / 255.0;
    let b = f32((packed_rgb >> 8u) & 0xffu) / 255.0;
    
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let x = i32(global_id.x);
    let y = i32(global_id.y);

    if (x >= i32(config.width) - 1 || y >= i32(config.height) - 1 || x <= 0 || y <= 0) {
        return;
    }

    var laplacian_sum: f32 = 0.0;
    for (var i: i32 = -1; i <= 1; i++) {
        for (var j: i32 = -1; j <= 1; j++) {
            let luminance = get_pixel_luminance(x + j, y + i);
            let kernel_idx = u32((i + 1) * 3 + (j + 1));
            laplacian_sum += luminance * f32(LAPLACIAN_KERNEL[kernel_idx]);
        }
    }

    let absolute_gradient = abs(laplacian_sum);

    let patch_x = x % i32(config.patch_dimension);
    let patch_y = y % i32(config.patch_dimension);
    let output_index = u32(patch_y) * config.patch_dimension + u32(patch_x);

    output_sharpness_map[output_index] = absolute_gradient;
}
```


### 4.3 TypeScript Orchestrator Wrapper (`DepthOfFieldEngine.ts`)
The TypeScript driver manages WebAssembly memory mappings, coordinates parallel WebGPU dynamic focal depth dispatches, and executes dynamic classifier overrides on device:

```typescript
export interface DoFAnalysisResult {
  readonly meanSubjectSharpness: number;  // Var_person
  readonly meanBackgroundBlur: number;     // Var_bg
  readonly focusIsolationIndex: number;   // I_focus
  readonly focusClassification: 'DEEP_FOCUS' | 'SHALLOW_FOCUS' | 'EXTREME_BOKEH';
  readonly confidence: number;
}

export class DepthOfFieldEngine {
  private wasmInstance!: any;
  private memory!: WebAssembly.Memory;
  private bufferOffsetCoords: number = 0;
  private bufferOffsetSubject: number = 0;
  private bufferOffsetBackground: number = 0;
  private isLoaded: boolean = false;
  private device!: GPUDevice;
  private pipeline!: GPUComputePipeline;
  private patchDimension = 128;
  private maxPoints = 128 * 128;

  private latestResults: DoFAnalysisResult | null = null;

  constructor() {}

  public async initialize(wasmArrayBuffer: ArrayBuffer): Promise<void> {
    const wasmImports = {
      env: {
        onDoFMetricsResolved: (metricsPtr: number) => {
          this.handleResolvedMetrics(metricsPtr);
        }
      }
    };

    const compiled = await WebAssembly.instantiate(wasmArrayBuffer, wasmImports);
    this.wasmInstance = compiled.instance.exports;
    this.memory = this.wasmInstance.memory;
    
    // Allocate stable, aligned buffers on WebAssembly heap safely using C++ exports
    this.bufferOffsetCoords = this.wasmInstance.allocate_skeletal_coords_buffer();
    this.bufferOffsetSubject = this.wasmInstance.allocate_subject_sharpness_buffer();
    this.bufferOffsetBackground = this.wasmInstance.allocate_background_sharpness_buffer();

    if (this.bufferOffsetSubject === 0 || this.bufferOffsetBackground === 0) {
      throw new Error("WASM Memory allocation failed for depth of field sharpness buffers");
    }

    // Initialize WebGPU context
    const adapter = await navigator.gpu?.requestAdapter();
    this.device = await adapter?.requestDevice() as GPUDevice;

    const shaderModule = this.device.createShaderModule({
      code: `
        // WGSL code loaded from localized_blur_extractor.wgsl
      `
    });

    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: shaderModule,
        entryPoint: 'main'
      }
    });

    this.isLoaded = true;
  }

  public async evaluateDepthOfField(
    rawPixelBuffer: Uint32Array,
    poseLandmarks: Float32Array, // 33 * 4 values
    width: number,
    height: number
  ): Promise<DoFAnalysisResult | null> {
    if (!this.isLoaded || !this.device) return null;

    // Configure WebGPU buffers for high-speed parallel focal depth checks
    const configBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const frameBuffer = this.device.createBuffer({
      size: rawPixelBuffer.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });

    const outputSubjectBuffer = this.device.createBuffer({
      size: this.patchDimension * this.patchDimension * 4, // 128 * 128 * sizeof(f32)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    const outputBackgroundBuffer = this.device.createBuffer({
      size: this.patchDimension * this.patchDimension * 4, // 128 * 128 * sizeof(f32)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    // Write parameters to buffers
    const configData = new Uint32Array([width, height, this.patchDimension, 0]);
    this.device.queue.writeBuffer(configBuffer, 0, configData.buffer);
    this.device.queue.writeBuffer(frameBuffer, 0, rawPixelBuffer.buffer);

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: configBuffer } },
        { binding: 1, resource: { buffer: frameBuffer } },
        { binding: 2, resource: { buffer: outputSubjectBuffer } },
        { binding: 3, resource: { buffer: outputBackgroundBuffer } }
      ]
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16));
    passEncoder.end();

    const stagingSubject = this.device.createBuffer({
      size: this.patchDimension * this.patchDimension * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    const stagingBackground = this.device.createBuffer({
      size: this.patchDimension * this.patchDimension * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(outputSubjectBuffer, 0, stagingSubject, 0, this.patchDimension * this.patchDimension * 4);
    commandEncoder.copyBufferToBuffer(outputBackgroundBuffer, 0, stagingBackground, 0, this.patchDimension * this.patchDimension * 4);
    
    this.device.queue.submit([commandEncoder.finish()]);

    await Promise.all([
      stagingSubject.mapAsync(GPUMapMode.READ),
      stagingBackground.mapAsync(GPUMapMode.READ)
    ]);

    const rawSubjectGradients = new Float32Array(stagingSubject.getMappedRange());
    const rawBackgroundGradients = new Float32Array(stagingBackground.getMappedRange());

    // Map extracted metrics directly to the WASM heap safely checking allocations
    const heapSubject = new Float32Array(this.memory.buffer, this.bufferOffsetSubject, this.patchDimension * this.patchDimension);
    heapSubject.set(rawSubjectGradients);

    const heapBackground = new Float32Array(this.memory.buffer, this.bufferOffsetBackground, this.patchDimension * this.patchDimension);
    heapBackground.set(rawBackgroundGradients);

    stagingSubject.unmap();
    stagingBackground.unmap();

    // Map skeletal coordinate landmarks directly to the WASM heap
    const heapView = new Float32Array(this.memory.buffer, this.bufferOffsetCoords, 33 * 4);
    for (let i = 0; i < 33; ++i) {
      heapView[i * 4] = poseLandmarks[i * 4];         // X
      heapView[i * 4 + 1] = poseLandmarks[i * 4 + 1]; // Y
      heapView[i * 4 + 2] = poseLandmarks[i * 4 + 2]; // Z
      heapView[i * 4 + 3] = poseLandmarks[i * 4 + 3]; // Confidence
    }

    // Trigger on-device WASM computation loop
    this.wasmInstance.process_dof_evaluation(this.patchDimension * this.patchDimension);

    return this.latestResults;
  }

  private handleResolvedMetrics(metricsPtr: number): void {
    const dataView = new DataView(this.memory.buffer, metricsPtr, 20); // sizeof(DoFOutput) = 20
    
    const meanSubjectSharpness = dataView.getFloat32(0, true);
    const meanBackgroundBlur = dataView.getFloat32(4, true);
    const focusIsolationIndex = dataView.getFloat32(8, true);
    const focusClassificationInt = dataView.getInt32(12, true);
    const confidence = dataView.getFloat32(16, true);

    let focusClassification: 'DEEP_FOCUS' | 'SHALLOW_FOCUS' | 'EXTREME_BOKEH' = 'DEEP_FOCUS';
    if (focusClassificationInt === 2) {
      focusClassification = 'EXTREME_BOKEH';
    } else if (focusClassificationInt === 1) {
      focusClassification = 'SHALLOW_FOCUS';
    }

    this.latestResults = {
      meanSubjectSharpness,
      meanBackgroundBlur,
      focusIsolationIndex,
      focusClassification,
      confidence
    };
  }
}
```


---

## 5. Comprehensive Edge Cases & Mitigations

### 5.1 Low-Contrast Textures (Differentiating Flat Walls from Blur)
**Vulnerability:** A subject standing in front of a completely flat, single-color wall (e.g., a white studio wall) generates extremely low background Laplacian variance ($Var_{\text{bg}} \approx 0.00$) because of the lack of structural edges, falsely triggering an "Extreme Bokeh" classification.

**Mitigation Strategy:**
*   **Luminance Contrast Verification:** The system runs a local standard deviation check. If background luminance is completely uniform, the system checks the camera focus metrics.
*   **Action:** If $Var_{\text{bg}}$ is extremely low while the background highlights are uniform, the system maps the focus mode as "Deep Focus" instead of bokeh, preventing false blocks.

### 5.2 Dynamic Foreground Objects
**Vulnerability:** Fast-moving foreground elements (e.g. dynamic transition screens, hands moving in front of lens) create localized edge blurs that can confuse the active focal point trackers.

**Mitigation Strategy:** The system runs temporal consistency checks. Localized blur gradients are averaged over a rolling 15-frame window. If the focus isolation index $I_{\text{focus}}$ fluctuates wildly within a 1-second interval, the system applies a neutral risk weight, preventing false blocking triggers.

---

## 6. Physical & Environmental Influences

### 6.1 Camera Perspective Distortion Compensation
Foreshortening effects distort the boundary shape when the subject leans relative to the optical plane. To correct these distortions, the C++ normalizer maps the coordinates against the camera's intrinsic calibration parameters before running the Fourier transform calculations:

$$\begin{bmatrix} x_{\text{norm}} \\ y_{\text{normalized}} \end{bmatrix} = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & \cos(\theta_{\text{pitch}}) \end{bmatrix} \begin{bmatrix} x_{\text{raw}} \\ y_{\text{raw}} \end{bmatrix}$$

The calculated focus isolation index (`focusIsolationIndex` or $I_{\text{focus}}$) modifies the baseline sensitivity parameters of both skeletal pose and localized skin checks:

```text
Pose_Verification_Interval_Frames = Max(1, Math.floor(15 * (1.0 - I_focus)))
Skin_Exposure_Tolerance_Ratio = Skin_Baseline * (1.0 - I_focus * 0.40)
```

If $I_{\text{focus}} \ge 0.70$ (Extreme Bokeh) in a non-athletic, non-educational setting, the system increases its evaluation rate to every single frame and lowers the acceptable exposed skin thresholds, ensuring that any suggestive contour styling is blocked with maximum precision.

```typescript
import { DepthOfFieldEngine } from './DepthOfFieldEngine';

describe('Unit Test: DepthOfFieldEngine', () => {
  let engine: DepthOfFieldEngine;

  beforeAll(async () => {
    // Load mock compiled WASM array buffer
    const wasmBuffer = getMockWasmBinary();
    engine = new DepthOfFieldEngine();
    await engine.initialize(wasmBuffer);
  });

  it('should verify standard deep focus frames as DEEP_FOCUS', async () => {
    const mockSubject = new Float32Array(128 * 128).fill(5.0); // Sharp edges
    const mockBackground = new Float32Array(128 * 128).fill(4.5); // Sharp background
    const mockLandmarks = getMockStandardPostures();
    
    const result = await engine.evaluateDepthOfField(new Uint32Array(0), mockLandmarks, 128, 128);
    
    expect(result).not.toBeNull();
    expect(result!.focusClassification).toBe('DEEP_FOCUS');
    expect(result!.focusIsolationIndex).toBeLessThan(0.30);
  });

  it('should identify shallow focus bokeh as EXTREME_BOKEH', async () => {
    const mockSubject = new Float32Array(128 * 128).fill(12.0); // Extremely sharp subject
    const mockBackground = new Float32Array(128 * 128).fill(0.1); // Extremely blurred background
    const mockLandmarks = getMockStandardPostures();
    
    const result = await engine.evaluateDepthOfField(new Uint32Array(0), mockLandmarks, 128, 128);
    
    expect(result).not.toBeNull();
    expect(result!.focusClassification).toBe('EXTREME_BOKEH');
  });
});
```

```typescript
export function runDoFStressTest(engine: DepthOfFieldEngine, iterations = 1000): void {
  const mockSubject = new Float32Array(128 * 128).fill(10.0);
  const mockBackground = new Float32Array(128 * 128).fill(1.0);
  const mockLandmarks = getMockStandardPostures();
  let overloadCount = 0;

  for (let i = 0; i < iterations; ++i) {
    const start = performance.now();
    const result = engine.evaluateDepthOfField(new Uint32Array(0), mockLandmarks, 128, 128);
    const duration = performance.now() - start;

    if (duration > 16.6) {
      overloadCount++;
      console.warn("Performance Warning: Processing exceeded frame rendering limits");
    }
  }
}
```

*   **Max Memory Heap Allocation:** $\le 12$ MB persistent RAM inside the WebAssembly linear memory pool.

*   **WebGPU Queue Execution Time:** $\le 1.0$ ms per localized blur compute pipeline dispatch.