# Human Skin Visibility Intelligence Framework

This document is a complete knowledge-base reconstruction for human skin visibility reasoning. It replaces any fragmented, implementation-oriented treatment of visible skin with a research-grade conceptual framework that explains how visible human skin is interpreted within complete scenes and human appearance contexts.
Skin visibility reasoning is not the same as exposed-area estimation, nudity detection, body segmentation, skin-color detection, or pixel-counting. It is an explainable process for understanding why a specific body region appears visible, covered, occluded, framed, or contextually exposed within a broader visual, anatomical, social, and temporal setting.
The framework treats skin visibility as a structured human-perception problem that depends on anatomy, body-region identity, clothing coverage, posture, camera geometry, lighting, movement, scene semantics, environmental context, and temporal continuity. A skin visibility interpretation is meaningful only when it explains the visible evidence, the body reasoning, and the reasons for the interpretation.

## 1. Foundations of Human Skin Visibility

Human skin visibility is the visible degree to which anatomical regions reveal skin to the viewer through the combination of clothing, body posture, body orientation, body articulation, occlusion, camera framing, environmental conditions, and contextual semantics.
Exposure and visibility are not identical. A body region may be physically present in the image while its skin is visually inaccessible because of clothing, shading, reflection, self-occlusion, distance, blur, or scene composition. Skin visibility reasoning must explain which skin is actually seen and which skin is merely implied.
The framework begins from a simple but important principle: visible skin is not a pixel phenomenon alone. It is a body-interpretation phenomenon that requires anatomical recognition, garment reasoning, posture analysis, viewpoint analysis, environmental interpretation, and social context.
A region may appear visible because the garment stops above it, because the fabric is thin or translucent, because the body is rotated, because the garment is displaced, because the camera angle reveals more of the body, because another object partially exposes the region, or because the light changes the visual salience.

## 2. Skin Visibility versus Adjacent Concepts

Skin visibility reasoning differs from exposed-area estimation because exposed-area estimation measures visible area, while skin visibility reasoning explains the anatomical meaning of that area and the reasons the skin becomes visible.
Skin visibility reasoning differs from nudity detection because nudity detection seeks a broad category label, while visibility reasoning identifies specific regions, explains the body evidence, and distinguishes ordinary exposure from sensitive exposure.
Skin visibility reasoning differs from body segmentation because segmentation identifies body-like regions, while visibility reasoning explains skin availability and coverage relationships within the body topology.
Skin visibility reasoning differs from skin-color detection because color detection identifies chromatic properties, while visibility reasoning identifies body regions and their visibility under clothing, movement, illumination, and occlusion.
Skin visibility reasoning differs from clothing recognition because clothing recognition identifies garments, while visibility reasoning explains the interaction between garments and the underlying anatomy.

## 3. The Human Body as a Skin Visibility System

The body is not a flat surface. It is a layered, articulated, dynamic organism whose visible skin depends on geometry, posture, circulation, tissue shape, clothing interaction, and camera viewpoint.
The head, face, neck, shoulders, upper arms, forearms, hands, chest, upper torso, abdomen, back, waist, hips, upper legs, lower legs, and feet form the principal regions relevant to skin visibility analysis.
Skin visibility is strongly shaped by the geometry of each region. The face reveals skin differently from the forearm, the abdomen differently from the waist, the shoulder differently from the upper leg, and the back differently from the chest.
The body is also asymmetrical in everyday life. One shoulder may be visible while the other remains covered. One side of the torso may show skin while the other side is hidden by overlap. A bent arm can create a visible skin strip along the side of the torso while the chest remains concealed.

## 4. Human Anatomy Foundations

Human anatomy is the foundational substrate for skin visibility reasoning because visible skin is meaningful only when it is mapped to a body region, a body contour, and an anatomical context.
### 4.1 Anatomical regions
The face includes the forehead, eyes, cheeks, nose, mouth, chin, and surrounding soft tissue. The neck includes the front of the neck, lateral neck, and collar area. The shoulders include clavicle and upper shoulder contour. The upper torso includes chest, sternum, upper abdomen, and lateral torso. The abdomen includes lower chest and stomach areas. The back includes upper back, mid-back, and lower back. The waist includes the narrow area between torso and hips. The hips include the lateral and frontal pelvic contour. The upper legs include the proximal thigh area. The lower legs include shin and calf contour. The feet include ankles, soles, toes, and dorsum.
### 4.2 Underlying musculoskeletal structure
The skeleton and muscle mass define the visible contour of the body. The clavicle, ribcage, pelvis, scapula, humerus, femur, tibia, and spine create anatomical landmarks that guide the interpretation of visible skin.
### 4.3 Surface morphology
Skin visibility depends on tissue curvature, fat distribution, muscular contour, body shape, and body proportion. A visible patch of skin near the abdomen can be interpreted differently depending on whether it belongs to a flat, muscular, or rounded surface.
### 4.4 Anatomical asymmetry
The body is often asymmetrical, especially during movement or under posture shifts. A body pose can make one side of the torso obviously visible while the other remains hidden by body fold, self-occlusion, or limb position.
### 4.5 Anatomical variation
Humans differ by age, sex, body type, build, mobility, and medical condition. These differences shape not only visible skin contours but also how clothing interacts with that skin.

## 5. Skin Visibility as a Perceptual Problem

Skin visibility is a perceptual problem because the visual system must infer whether the visible region is truly bare skin, a skin-like reflection, a cloth texture, a medical device, a tattoo, a body part under a garment, or a rendered artifact.
The visible skin evidence chain begins with low-level visual evidence such as color variation, edge contrast, texture continuity, and contour. It evolves into body-region interpretation, garment coverage reasoning, contextual scene understanding, and finally an explainable visibility statement.
This chain matters because the same visual patch can have different interpretations. A warm-toned region can be skin, a fabric highlight, a wood surface, or a lighting artifact. The framework resists such collapse by requiring anatomy, garment structure, posture, scene semantics, and temporal continuity.

## 6. Body-Region Understanding

Body-region understanding is central to skin visibility because visible skin should be mapped to a body region before it can be interpreted responsibly.
### 6.1 Face region
Observable evidence: visible forehead, cheeks, nose bridge, lips, chin, eyelid, ears, or neck skin. Anatomical evidence: facial geometry, facial planes, eye sockets, nose structure, mouth contour, and jawline. Clothing evidence: hairline coverage, headgear, scarf, sunglasses, mask, veil, hood, or face covering. Environmental evidence: lighting on the face, background depth, shadow on the cheeks, or weather-related shading. Movement evidence: smiling, turning, speaking, head tilt, or chewing. Posture evidence: head rotation, gaze direction, chin uplift, or neck extension. Contextual evidence: conversation, portrait, medical appointment, sports event, performance, or street photography. Temporal evidence: blink, expression change, head movement, or a changing camera framing. Ambiguity sources: low resolution, occlusion by hair, strong shadow, face mask, silhouette, or partial crop. Supporting evidence: contour continuity, facial landmarks, alignment with eyes and jaw, stable region identity. Conflicting evidence: skin patch that resembles a face but lacks consistent geometry. Downstream interpretation: whether the visible skin belongs to identity-bearing facial anatomy or to an unrelated or ambiguous surface.
### 6.2 Scalp and hairline region
Observable evidence: scalp skin around hairline, forehead, temple, or sparse hair. Anatomical evidence: skull contour, hairline shape, temple, and scalp surface. Clothing evidence: cap, helmet, scarf, headband, or hair wrap. Environmental evidence: lighting that reveals skin through hair separation. Movement evidence: head movement or hair shift. Posture evidence: head tilt and upward gaze. Contextual evidence: sports, medical imaging, swimming, sun exposure, or fashion. Temporal evidence: hair movement, head rotation, or cloth change. Ambiguity sources: hair density, low contrast, shadow, or hairstyle concealment. Supporting evidence: contour continuity around the forehead and temples. Conflicting evidence: skin-like reflection near the hairline that is not anatomical skin. Downstream interpretation: whether the visible skin is scalp skin, face skin, or a lighting artifact.
### 6.3 Forehead region
Observable evidence: exposed forehead skin, brow prominence, sweat sheen, or hairline transition. Anatomical evidence: frontal bone contour and brow ridge. Clothing evidence: headband, hat brim, cap, veil, hood, or hair covering. Environmental evidence: sunlight, indoor lighting, shadow, or occlusion by a hand. Movement evidence: eyebrow movement, head movement, or facial expression. Posture evidence: tilt, gaze, and head orientation. Contextual evidence: exercise, heat, medical check, portraiture, or casual setting. Temporal evidence: changing expression or motion blur. Ambiguity sources: shadow, makeup, sweat, glare, or hair covering. Supporting evidence: consistent brow and forehead contour. Conflicting evidence: a bright region near the upper face that is not supported by forehead geometry. Downstream interpretation: whether the forehead is visibly exposed skin or an incidental highlight.
### 6.4 Eyes and eyelids region
Observable evidence: eyelid skin, sclera, lashes, tear film, or eye socket contour. Anatomical evidence: orbital structure, eyelid fold, and eye shape. Clothing evidence: glasses, mask, hair, hood, or face covering. Environmental evidence: reflection, glare, low light, or strong backlight. Movement evidence: blinking, squinting, gaze shifts, or closing eyes. Posture evidence: head rotation or neck tilt. Contextual evidence: medical examination, portrait, sports, sleepwear, or crying. Temporal evidence: blink timing and expression changes. Ambiguity sources: eyelid compression, occlusion by lashes, shadow, or low resolution. Supporting evidence: eyelid geometry and consistent eye location. Conflicting evidence: bright skin-like patches around the eye that do not conform to eyelid anatomy. Downstream interpretation: whether the visible area is eyelid skin or an artifact of illumination.
### 6.5 Ears region
Observable evidence: visible pinna, ear lobe, ear fold, or temple skin. Anatomical evidence: helix curvature, ear lobe shape, and mastoid structure. Clothing evidence: hair covering, cap, headband, or scarf. Environmental evidence: side lighting that emphasizes the ear contour. Movement evidence: head rotation, hair movement, or speaking. Posture evidence: lateral head orientation. Contextual evidence: casual wear, sports, medical environment, or long hair. Temporal evidence: turning of the head or shifting hair. Ambiguity sources: hair occlusion, low resolution, and side-view compression. Supporting evidence: ear contour continuity. Conflicting evidence: texture that resembles ear skin but fails to fit ear geometry. Downstream interpretation: whether ear skin is visible and meaningful or simply visible due to hairstyle and view.
### 6.6 Nose and nostril region
Observable evidence: bridge, nostrils, nostril shadow, or philtrum. Anatomical evidence: nasal ridge, nostril cavity, and soft tissue around the nose. Clothing evidence: glasses, face mask, scarf, or headgear. Environmental evidence: directional light that sharpens the nose. Movement evidence: talking, laughing, turning, or stooping. Posture evidence: front-facing or side-facing orientation. Contextual evidence: portrait, sports, medical, or fashion. Temporal evidence: facial expression and head movement. Ambiguity sources: shadow, blur, occlusion by hand, or low contrast. Supporting evidence: stable nose contour and relation to cheek and mouth. Conflicting evidence: a skin-like patch that does not fit the nose geometry. Downstream interpretation: whether exposed skin around the nose is meaningful facial exposure or a shading artifact.
### 6.7 Cheeks and mouth region
Observable evidence: cheek skin, lips, mouth corner, or jawline. Anatomical evidence: cheek bones, lip contour, and jaw geometry. Clothing evidence: face covering, beard, mask, scarf, or hair. Environmental evidence: illumination that defines cheek planes. Movement evidence: smiling, talking, chewing, or turning. Posture evidence: head tilt, facial direction, and neck length. Contextual evidence: social interaction, speech, performance, or medical visit. Temporal evidence: expression changes and speech movement. Ambiguity sources: shadows, low visibility, blur, or hand occlusion. Supporting evidence: consistent mouth and cheek contour. Conflicting evidence: a smooth skin patch that lacks anatomical support. Downstream interpretation: whether the visible area is facial skin or a misleading brightness region.

## 7. Clothing Coverage and Skin Visibility

Clothing is one of the primary mediators of visible skin. It transforms anatomical visibility into a coverage pattern, but it also carries social meaning, cultural meaning, functional meaning, and environmental meaning.
A shirt may cover the torso but leave the shoulders exposed. A dress may cover the midsection while revealing the shoulders and legs. A jacket may cover the upper torso while leaving the neck visible. A skirt may cover the hips while exposing the thigh region. A long coat may hide the lower body while exposing the face and neck.
The framework must interpret coverage not as a binary property but as a layered and relational process. The body may appear partially visible because of garment height, garment fit, garment movement, garment overlap, transparency, displacement, and body rotation.
### 7.1 Coverage categories
Coverage categories include full coverage, shoulder exposure, chest exposure, abdomen exposure, waist exposure, hip exposure, upper-leg exposure, lower-leg exposure, back exposure, neck exposure, face exposure, and arm exposure. These are conceptual categories that describe how the garment system reveals the body rather than merely count visible pixels.
### 7.2 Tightness and fit
Tight garments can reveal body contours and skin outlines. Loose garments can hide anatomy under folds. The same body region may appear visible under a fitted shirt but hidden under a loose shirt. Skin visibility reasoning must therefore consider garment fit as a functional variable.
### 7.3 Transparency and fabric properties
Transparent or thin fabric can reveal underlying skin even when the garment is present. Sheer layers, wet clothing, stretch fabrics, and reflective cloth can create visible skin-like geometry that is not equivalent to uncovered skin.
### 7.4 Garment movement
Garments move with the body. A shirt may ride upward during movement, a jacket may slip open, a dress may shift, a sweater may reveal the waist, and a scarf may move away from the neck. Skin visibility reasoning should treat clothing movement as a dynamic source of evidence.
### 7.5 Layering
Layered garments create multi-stage visibility. A jacket over a shirt over a tank top can produce visible chest skin at the neckline while keeping the torso mostly concealed. The framework evaluates each layer and its relation to the body.

## 8. Anatomical Visibility Framework

The anatomical visibility framework explains how skin becomes visible through body-region geometry, posture, occlusion, viewpoint, distance, and articulation.
### 8.1 Body-region visibility
A body region becomes visible when its surface appears within the image and the body geometry supports it. A visible shoulder does not necessarily imply visible chest skin. A visible thigh does not necessarily imply visible hip skin. The framework maps visible skin to the correct anatomical structure.
### 8.2 Partial visibility
Partial visibility occurs when only part of a region is visible. A forearm may be visible while the elbow is hidden. A chest region may be visible only at the upper torso while the lower torso is concealed. The framework treats partial visibility as a structured state rather than a binary mask.
### 8.3 Occlusion
Occlusion occurs when another body part, another person, an object, clothing, a surface, or an environmental element hides part of the body. A hand may cover part of the abdomen, a bag may cover the hip, a blanket may cover the leg, or a chair may cover the back of the thigh.
### 8.4 Body orientation
Body orientation changes which surfaces are visible. Front-facing body regions differ from side-facing and rear-facing regions. The same clothing arrangement may expose a different amount of skin under a different viewpoint.
### 8.5 Camera viewpoint
Camera viewpoint changes visible skin due to perspective. A frontal view may expose the chest, while a three-quarter view may reveal the shoulder and the side of the torso. A telephoto shot can compress the body shape and make a small exposed patch look more significant than it is.
### 8.6 Camera distance
Camera distance affects whether visible skin appears as a genuine body region or as a small localized surface. A close shot may reveal a narrow strip of skin at the waist, while a distant shot may show the same region as part of a broader silhouette.
### 8.7 Posture
Posture changes the relationship between body volume, garment boundaries, and visible skin. A bent torso can reveal the side abdomen. A raised arm can reveal the armpit and upper side torso. A crossed leg can reveal the thigh while hiding the knee.
### 8.8 Layered clothing
Layered clothing can produce visible skin at seams, hems, openings, necklines, sleeves, collars, or openings around the waist. The framework explains where visible skin is likely to appear and why.
### 8.9 Accessories
Accessories such as belts, scarves, glasses, jewelry, backpacks, watches, and towels can alter the visibility pattern. A scarf may hide the neck, a belt may alter the waist exposure, and a backpack may conceal the upper back.
### 8.10 Environmental occlusion
An environment can conceal skin through furniture, curtains, partitions, walls, vehicles, water, snow, or other bodies. Skin visibility reasoning should explain whether the body is hidden by environment or merely not visible in the current frame.
### 8.11 Self-occlusion
Self-occlusion occurs when one body part hides another. A hand near the face can hide part of the neck. An arm across the chest can hide the side torso. A crossed leg can hide the shin. The framework distinguishes self-occlusion from true garment coverage.

## 9. Contextual Body Understanding

Skin visibility exists within a social and situational context. The same visible skin can be ordinary in one scene and sensitive in another.
A medical scan can expose the abdomen and face in a clinically appropriate way. A swimming scene can expose shoulders, legs, and back in a sports or leisure context. A gym scene can expose the shoulders and arms while preserving a functional athletic context. A beach scene can expose more skin because the environment and clothing expectations differ. A formal event can expose the shoulders or neckline in a fashion context. A winter scene can reveal the face and hands while keeping the rest of the body heavily covered.
The framework therefore links skin visibility to environment, activity, cultural norm, clothing intent, and social interpretation.

## 10. Scene Semantics and Human Appearance Intelligence

Scene semantics describe the role of the body within the larger visual world. Human appearance intelligence is the discipline of understanding visible human structure, body state, clothing state, interaction state, and scene role.
A person in a clinic is not perceived in the same way as a person on a beach, in a gym, in a portrait studio, in a playground, in a swimming pool, in a laboratory, in a market, in a living room, in a school corridor, or in a public transportation setting.
The framework uses scene semantics to decide whether visible skin is likely to be ordinary, functional, medical, athletic, protective, fashion-related, cultural, intimate, or ambiguous.

## 11. Visual Perception Foundations

Visual perception is the cognitive process by which the brain parses visible form, color, texture, contour, depth, and motion. Skin visibility reasoning depends on those perceptual operations but extends them through anatomical and contextual interpretation.
The visual system uses luminance contrast, texture contrast, contour continuity, depth layering, shape coherence, and motion continuity to infer where skin might be. The knowledge framework uses those perceptual cues but does not treat them as sufficient evidence on their own.
Color alone is not enough. A red region can be skin, clothing, a reflection, a wound, makeup, a prop, or a shadow. The framework asks not merely what color is visible but what anatomical structure, garment relationship, and environmental condition explain that region.

## 12. Explainable Human Appearance Intelligence

Explainable human appearance intelligence requires that every skin visibility interpretation be traceable to visible evidence and body reasoning.
The interpretation should explain the body evidence, the skin evidence, the anatomical evidence, the clothing evidence, the visibility evidence, the context evidence, the supporting evidence, the conflicting evidence, the confidence, the uncertainty, and the final rationale.
It should not merely say that a patch of skin is visible. It should explain why the patch is likely to belong to the face, neck, shoulder, torso, leg, abdomen, back, or hand and why the view, garments, movement, and scene support that conclusion.

## 13. Complete Skin Visibility Ontology

### 13.1 Face
Observable evidence: the visual indicators that make face recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why face is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for face.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how face appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of face.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make face more or less visible.
Contextual evidence: the social, occupational, cultural, medical, sports, or everyday context that makes the visibility pattern plausible.
Temporal evidence: the way face changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make face difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of face.
Conflicting evidence: the cues that weaken or challenge the interpretation of face.
Downstream interpretation: the implications of recognizing face for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.2 Scalp
Observable evidence: the visual indicators that make scalp recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why scalp is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for scalp.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how scalp appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of scalp.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make scalp more or less visible.
Contextual evidence: the social, occupational, cultural, medical, sports, or everyday context that makes the visibility pattern plausible.
Temporal evidence: the way scalp changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make scalp difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of scalp.
Conflicting evidence: the cues that weaken or challenge the interpretation of scalp.
Downstream interpretation: the implications of recognizing scalp for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.3 Hairline
Observable evidence: the visual indicators that make hairline recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why hairline is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for hairline.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how hairline appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of hairline.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make hairline more or less visible.
Temporal evidence: the way hairline changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make hairline difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of hairline.
Conflicting evidence: the cues that weaken or challenge the interpretation of hairline.
Downstream interpretation: the implications of recognizing hairline for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.4 Forehead
Observable evidence: the visual indicators that make forehead recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why forehead is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for forehead.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how forehead appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of forehead.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make forehead more or less visible.
Temporal evidence: the way forehead changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make forehead difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of forehead.
Conflicting evidence: the cues that weaken or challenge the interpretation of forehead.
Downstream interpretation: the implications of recognizing forehead for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.5 Eyes
Observable evidence: the visual indicators that make eyes recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why eyes is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for eyes.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how eyes appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of eyes.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make eyes more or less visible.
Temporal evidence: the way eyes changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make eyes difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of eyes.
Conflicting evidence: the cues that weaken or challenge the interpretation of eyes.
Downstream interpretation: the implications of recognizing eyes for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.6 Ears
Observable evidence: the visual indicators that make ears recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why ears is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for ears.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how ears appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of ears.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make ears more or less visible.
Temporal evidence: the way ears changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make ears difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of ears.
Conflicting evidence: the cues that weaken or challenge the interpretation of ears.
Downstream interpretation: the implications of recognizing ears for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.7 Nose
Observable evidence: the visual indicators that make nose recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why nose is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for nose.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how nose appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of nose.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make nose more or less visible.
Temporal evidence: the way nose changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make nose difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of nose.
Conflicting evidence: the cues that weaken or challenge the interpretation of nose.
Downstream interpretation: the implications of recognizing nose for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.8 Cheeks
Observable evidence: the visual indicators that make cheeks recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why cheeks is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for cheeks.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how cheeks appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of cheeks.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make cheeks more or less visible.
Temporal evidence: the way cheeks changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make cheeks difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of cheeks.
Conflicting evidence: the cues that weaken or challenge the interpretation of cheeks.
Downstream interpretation: the implications of recognizing cheeks for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.9 Mouth
Observable evidence: the visual indicators that make mouth recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why mouth is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for mouth.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how mouth appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of mouth.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make mouth more or less visible.
Temporal evidence: the way mouth changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make mouth difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of mouth.
Conflicting evidence: the cues that weaken or challenge the interpretation of mouth.
Downstream interpretation: the implications of recognizing mouth for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.10 Neck
Observable evidence: the visual indicators that make neck recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why neck is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for neck.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how neck appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of neck.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make neck more or less visible.
Temporal evidence: the way neck changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make neck difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of neck.
Conflicting evidence: the cues that weaken or challenge the interpretation of neck.
Downstream interpretation: the implications of recognizing neck for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.11 Shoulders
Observable evidence: the visual indicators that make shoulders recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why shoulders is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for shoulders.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how shoulders appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of shoulders.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make shoulders more or less visible.
Temporal evidence: the way shoulders changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make shoulders difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of shoulders.
Conflicting evidence: the cues that weaken or challenge the interpretation of shoulders.
Downstream interpretation: the implications of recognizing shoulders for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.12 Upper Arms
Observable evidence: the visual indicators that make upper arms recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper arms is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for upper arms.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how upper arms appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of upper arms.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make upper arms more or less visible.
Temporal evidence: the way upper arms changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make upper arms difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper arms.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper arms.
Downstream interpretation: the implications of recognizing upper arms for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.13 Forearms
Observable evidence: the visual indicators that make forearms recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why forearms is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for forearms.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how forearms appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of forearms.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make forearms more or less visible.
Temporal evidence: the way forearms changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make forearms difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of forearms.
Conflicting evidence: the cues that weaken or challenge the interpretation of forearms.
Downstream interpretation: the implications of recognizing forearms for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.14 Hands
Observable evidence: the visual indicators that make hands recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why hands is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for hands.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how hands appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of hands.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make hands more or less visible.
Temporal evidence: the way hands changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make hands difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of hands.
Conflicting evidence: the cues that weaken or challenge the interpretation of hands.
Downstream interpretation: the implications of recognizing hands for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.15 Chest
Observable evidence: the visual indicators that make chest recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why chest is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for chest.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how chest appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of chest.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make chest more or less visible.
Temporal evidence: the way chest changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make chest difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of chest.
Conflicting evidence: the cues that weaken or challenge the interpretation of chest.
Downstream interpretation: the implications of recognizing chest for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.16 Upper Torso
Observable evidence: the visual indicators that make upper torso recognizable within the image.
Anatomical evidence: the body structure and body-region geometry that explain why upper torso is visible or hidden.
Clothing evidence: the garment boundary, overlap, fit, transparency, or displacement that changes the skin visibility pattern for upper torso.
Environmental evidence: the lighting, weather, surface, background, and scene conditions that shape how upper torso appears.
Movement evidence: the body motion, gesture, or articulation that changes the visibility of upper torso.
Posture evidence: the body orientation, limb position, trunk rotation, and head position that make upper torso more or less visible.
Temporal evidence: the way upper torso changes across time through movement, camera shift, occlusion, or posture change.
Ambiguity sources: the conditions that can make upper torso difficult to interpret, including blur, distance, shadow, occlusion, reflection, crop, or clothing overlap.
Supporting evidence: the cues that strengthen the interpretation of upper torso.
Conflicting evidence: the cues that weaken or challenge the interpretation of upper torso.
Downstream interpretation: the implications of recognizing upper torso for scene reasoning, policy interpretation, medical analysis, fashion reasoning, or human appearance understanding.

### 13.17 Abdomen
Observable evidence: the visual indicators that make abdomen recognizable within the image.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

- **Dilation (Kengaytirish):** $f \oplus s = \max_{(kx, ky)} \{ input(x - kx, y - ky) \}$, ob'ektlar ichidagi mayda yoriq va teshiklarni birlashtiradi.

- **Erosion (Eritish):** $f \ominus s = \min_{(kx, ky)} \{ temporary(x + kx, y + ky) \}$, shishgan chegaralarni normal o'lchamga qaytaradi.

1. **First Pass (Birinchi o'tish):** Matritsa chiziqli skaner qilinadi. Agar joriy piksel faol bo'lsa ($P \ge 0.52$), uning chap va yuqori qo'shnilariga qaraladi. Agar qo'shnilar har xil etiketga (Label) ega bo'lsa, ular **Disjoint-Set (Union-Find)** ekvivalentlik jadvaliga yoziladi.

2. **Second Pass (Ikkinchi o'tish):** Barcha ekvivalent etiketlar **Path Compression** yordamida bitta umumiy ildizga (Root Label) bog'lanadi va har bir klaster uchun piksellar soni, ekstremal koordinatalar ($X_{min}, Y_{min}, X_{max}, Y_{max}$) aniqlanadi.

- **Center-Focus Proximity:** Evklid masofasi asosida kadr markaziga yaqin bo'lgan klasterlarga yuqori og'irlik koeffitsiyenti beriladi ($Multiplier = 1.45$). Chunki markaziy zonadagi fosh bo'lish ehtimoli yuqori riskni bildiradi.

- **Peripheral Edge Dampening:** Kadr chetidagi (chegaradan 15 pikselgacha ichkaridagi) piksellarga pasaytiruvchi og'irlik koeffitsiyenti beriladi ($Factor = 0.55$), chunki ular ko'pincha fon qismlari yoki tasodifiy o'tib ketgan unsurlardir.

Noto'g'ri bloklashlarning oldini olish uchun klasterlarning **Aspect Ratio** ($Width / Height$) ko'rsatkichlari tekshiriladi:

$$\text{Aspect Ratio} = \frac{X_{max} - X_{min} + 1}{Y_{max} - Y_{min} + 1}$$
Agar klasterning Aspect Ratio ko'rsatkichi $0.68 \le AR \le 1.42$ oralig'ida bo'lsa va uning kadrni egallash maydoni $15\%$ dan kam bo'lsa, u **Inson Yuzi (Face Region)** sifatida klassifikatsiya qilinadi. Yuz hududining og'irlik koeffitsiyenti $88\%$ ga kamaytiriladi ($spatialWeight \times 0.12$), chunki yuz ochiqligi behayolik ko'rsatkichi emas.

### E. Yuqori Chastotali Tekstura va Sobel Edge Tahlili
Matolar va g'adir-budur fonlarni silliq inson terisidan farqlash uchun kadrda **Sobel Gradient Magnitude** hisoblanadi:
$$G = \sqrt{G_x^2 + G_y^2}$$

Luminance qiymatining yuqori dispersiyasi (Texture Variance Deviation $> 42.0$) aniqlangan klasterlarning xavflilik ehtimoli pasaytiriladi.