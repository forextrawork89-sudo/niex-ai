# Subject–Background Separation Intelligence Framework
This document is the authoritative research-grade foundation for subject–background separation within the environment subsystem.
It defines how subjects are separated from backgrounds through figure–ground organization, perceptual grouping, depth reasoning, saliency, context, temporal consistency, confidence, uncertainty, and explainability.
It is conceptual, not implementation-specific. It avoids runtime detail and detector implementation, focusing instead on perceptual structure, scene understanding, and knowledge integration.

## 1. Purpose, Scope, and Foundational Commitments
This framework exists to rebuild the existing subject–background separation knowledge base as an encyclopedia-level research resource for scene understanding.
It covers how subjects are inferred, how backgrounds are interpreted, how figure-ground organization emerges, and how environmental context supports explainable separation decisions.
The scope includes primary and secondary subjects, background typologies, visual components, perceptual grouping, depth cues, temporal intelligence, confidence, uncertainty, and subsystem integration.

## 1.1 Foundational Commitments
- Separation is a layered reasoning problem that integrates multiple evidence sources rather than a simple binary mask extraction.
- Figure and ground are determined by salience, depth, semantics, motion, context, and perceptual organization.
- A robust system must preserve ambiguity and explain why a region remains uncertain or contested.
- Temporal continuity is essential: a subject hypothesis that persists across time is more reliable than an isolated frame decision.
- The system must differentiate between visual distinctiveness and semantic subjectness, allowing backgrounds to be prominent without being subjects.

## 2. Foundational Theory of Visual Perception and Scene Organization
This section describes the perceptual foundations that underlie subject-background separation, including visual attention, Gestalt organization, depth perception, and ecological vision.
The visual system solves figure-ground by grouping features, applying depth heuristics, and using semantic expectations about what is likely to be central in a scene.
The framework translates these perceptual principles into a structured reasoning process for multimodal AI systems.

## 2.1 Visual Perception
1. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
2. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
3. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
4. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
5. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
6. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
7. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
8. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
9. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
10. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
11. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
12. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
13. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
14. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
15. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
16. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
17. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
18. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
19. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
20. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
21. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
22. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
23. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
24. Visual perception of scenes depends on the integration of color, contrast, texture, motion, depth, and semantic knowledge to determine what is visually important.
## 2.2 Gestalt Psychology
- Proximity: nearby elements tend to be grouped together as part of the same region.
- Similarity: visually similar elements are perceived as belonging to a unified structure.
- Continuity: aligned edges and contours lead the eye to follow a coherent shape.
- Closure: incomplete boundaries are often mentally completed into a meaningful contour.
- Common fate: elements moving together are perceived as a group.
- Connectedness: direct connections between elements strongly bind them into one entity.
- Symmetry: symmetric arrangements attract attention and are interpreted as cohesive shapes.
- Repetition: repeated visual patterns support grouping and figure formation.
## 3. Definitions and Ontology
This section establishes the terminology for subjects, backgrounds, primary and secondary entities, and the core attributes used in reasoning.
The ontology is designed to support both visual and semantic evidence, making it possible to interpret complex scenes with layered content.

### 3.1 Primary Subjects
#### Humans
Observable evidence: humans appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: humans are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: humans can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: humans may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: humans contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

#### Animals
Observable evidence: animals appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: animals are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: animals can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: animals may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: animals contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

#### Vehicles
Observable evidence: vehicles appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: vehicles are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: vehicles can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: vehicles may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: vehicles contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

#### Products
Observable evidence: products appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: products are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: products can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: products may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: products contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

#### Buildings
Observable evidence: buildings appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: buildings are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: buildings can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: buildings may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: buildings contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

#### Vegetation
Observable evidence: vegetation appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: vegetation are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: vegetation can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: vegetation may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: vegetation contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

#### Landmarks
Observable evidence: landmarks appear as visually distinct entities with characteristic shape, texture, and structure cues that separate them from the surrounding environment.
Semantic evidence: landmarks are often central to the scene because they match categories that attract human attention and carry functional or narrative meaning.
Spatial evidence: landmarks can occupy central regions, foreground planes, or compositional anchor points in the scene.
Ambiguity sources: landmarks may be confused with background patterns, reflections, shadows, or printed representations when visual cues are degraded.
Downstream interpretation: landmarks contribute to subject hypothesis formation and are tested against depth, motion, and context evidence.

### 3.2 Secondary Subjects
#### Accessories
Observable evidence: accessories are attached to or associated with a primary subject, often sharing a part of the same visual grouping or spatial adjacency.
Semantic evidence: accessories are typically not the scene focus but influence subject interpretation through object interaction or narrative support.
Spatial evidence: accessories are usually close to or overlapping with primary subjects, making boundary decisions more challenging.
Ambiguity sources: accessories may be mistaken for independent subjects when they are detached from the main entity or when their scale is comparable to the primary subject.
Downstream interpretation: accessories should often be attached to the subject hypothesis unless there is strong evidence that they form an independent figure.

#### Carried objects
Observable evidence: carried objects are attached to or associated with a primary subject, often sharing a part of the same visual grouping or spatial adjacency.
Semantic evidence: carried objects are typically not the scene focus but influence subject interpretation through object interaction or narrative support.
Spatial evidence: carried objects are usually close to or overlapping with primary subjects, making boundary decisions more challenging.
Ambiguity sources: carried objects may be mistaken for independent subjects when they are detached from the main entity or when their scale is comparable to the primary subject.
Downstream interpretation: carried objects should often be attached to the subject hypothesis unless there is strong evidence that they form an independent figure.

#### Companions
Observable evidence: companions are attached to or associated with a primary subject, often sharing a part of the same visual grouping or spatial adjacency.
Semantic evidence: companions are typically not the scene focus but influence subject interpretation through object interaction or narrative support.
Spatial evidence: companions are usually close to or overlapping with primary subjects, making boundary decisions more challenging.
Ambiguity sources: companions may be mistaken for independent subjects when they are detached from the main entity or when their scale is comparable to the primary subject.
Downstream interpretation: companions should often be attached to the subject hypothesis unless there is strong evidence that they form an independent figure.

#### Supporting objects
Observable evidence: supporting objects are attached to or associated with a primary subject, often sharing a part of the same visual grouping or spatial adjacency.
Semantic evidence: supporting objects are typically not the scene focus but influence subject interpretation through object interaction or narrative support.
Spatial evidence: supporting objects are usually close to or overlapping with primary subjects, making boundary decisions more challenging.
Ambiguity sources: supporting objects may be mistaken for independent subjects when they are detached from the main entity or when their scale is comparable to the primary subject.
Downstream interpretation: supporting objects should often be attached to the subject hypothesis unless there is strong evidence that they form an independent figure.

### 3.3 Background Types
#### Indoor rooms
Observable evidence: indoor rooms commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: indoor rooms provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: indoor rooms often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: indoor rooms may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: indoor rooms define the support field against which subject hypotheses are evaluated.

#### Outdoor environments
Observable evidence: outdoor environments commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: outdoor environments provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: outdoor environments often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: outdoor environments may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: outdoor environments define the support field against which subject hypotheses are evaluated.

#### Urban environments
Observable evidence: urban environments commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: urban environments provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: urban environments often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: urban environments may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: urban environments define the support field against which subject hypotheses are evaluated.

#### Rural landscapes
Observable evidence: rural landscapes commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: rural landscapes provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: rural landscapes often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: rural landscapes may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: rural landscapes define the support field against which subject hypotheses are evaluated.

#### Beaches
Observable evidence: beaches commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: beaches provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: beaches often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: beaches may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: beaches define the support field against which subject hypotheses are evaluated.

#### Forests
Observable evidence: forests commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: forests provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: forests often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: forests may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: forests define the support field against which subject hypotheses are evaluated.

#### Mountains
Observable evidence: mountains commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: mountains provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: mountains often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: mountains may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: mountains define the support field against which subject hypotheses are evaluated.

#### Offices
Observable evidence: offices commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: offices provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: offices often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: offices may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: offices define the support field against which subject hypotheses are evaluated.

#### Classrooms
Observable evidence: classrooms commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: classrooms provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: classrooms often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: classrooms may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: classrooms define the support field against which subject hypotheses are evaluated.

#### Hospitals
Observable evidence: hospitals commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: hospitals provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: hospitals often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: hospitals may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: hospitals define the support field against which subject hypotheses are evaluated.

#### Sports facilities
Observable evidence: sports facilities commonly include structural elements, environmental textures, and contextual cues that anchor the scene to a recognizable setting.
Semantic evidence: sports facilities provide contextual meaning that shapes whether a potential subject is active, passive, incidental, or central to the scene.
Spatial evidence: sports facilities often occupy broad expanses, background planes, or peripheral regions surrounding the subject.
Ambiguity sources: sports facilities may contain foreground objects, reflections, or signage that mimic subject characteristics if not properly segmented.
Downstream interpretation: sports facilities define the support field against which subject hypotheses are evaluated.

### 3.4 Visual Background Components
#### Sky
Observable evidence: sky are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: sky often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: sky can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: sky may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: sky form the background hypothesis and help define the compositional canvas of the scene.

#### Walls
Observable evidence: walls are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: walls often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: walls can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: walls may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: walls form the background hypothesis and help define the compositional canvas of the scene.

#### Floors
Observable evidence: floors are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: floors often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: floors can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: floors may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: floors form the background hypothesis and help define the compositional canvas of the scene.

#### Ceilings
Observable evidence: ceilings are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: ceilings often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: ceilings can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: ceilings may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: ceilings form the background hypothesis and help define the compositional canvas of the scene.

#### Roads
Observable evidence: roads are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: roads often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: roads can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: roads may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: roads form the background hypothesis and help define the compositional canvas of the scene.

#### Vegetation
Observable evidence: vegetation are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: vegetation often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: vegetation can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: vegetation may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: vegetation form the background hypothesis and help define the compositional canvas of the scene.

#### Water
Observable evidence: water are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: water often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: water can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: water may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: water form the background hypothesis and help define the compositional canvas of the scene.

#### Terrain
Observable evidence: terrain are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: terrain often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: terrain can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: terrain may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: terrain form the background hypothesis and help define the compositional canvas of the scene.

#### Shadows
Observable evidence: shadows are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: shadows often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: shadows can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: shadows may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: shadows form the background hypothesis and help define the compositional canvas of the scene.

#### Reflections
Observable evidence: reflections are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: reflections often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: reflections can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: reflections may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: reflections form the background hypothesis and help define the compositional canvas of the scene.

#### Atmospheric effects
Observable evidence: atmospheric effects are identified by their characteristic color, texture, structure, and typical role in environmental scenes.
Semantic evidence: atmospheric effects often serve as stable context rather than active subject matter, unless the scene is specifically about the component itself.
Spatial evidence: atmospheric effects can span large areas, provide depth planes, or act as enclosing surfaces.
Ambiguity sources: atmospheric effects may resemble subjects when isolated, highly detailed, or aligned with salient visual features.
Downstream interpretation: atmospheric effects form the background hypothesis and help define the compositional canvas of the scene.

## 4. Core Evidence Families for Subject–Background Separation
This section enumerates the families of evidence that a system must consider when inferring subject and background roles.
Evidence fusion is the process of combining these families into a coherent interpretation, with explicit modeling of agreement and disagreement.

### 4.1 Spatial Layout Evidence
- central placement: spatial evidence that influences subject salience and boundary inference in a scene.
- size dominance: spatial evidence that influences subject salience and boundary inference in a scene.
- edge proximity: spatial evidence that influences subject salience and boundary inference in a scene.
- frame anchoring: spatial evidence that influences subject salience and boundary inference in a scene.
- panel organization: spatial evidence that influences subject salience and boundary inference in a scene.
- compositional balancing: spatial evidence that influences subject salience and boundary inference in a scene.
- foreground placement: spatial evidence that influences subject salience and boundary inference in a scene.
### 4.2 Contrast and Boundary Evidence
- luminance contrast: boundary evidence that helps determine where one region ends and another begins.
- color contrast: boundary evidence that helps determine where one region ends and another begins.
- texture discontinuity: boundary evidence that helps determine where one region ends and another begins.
- edge concentration: boundary evidence that helps determine where one region ends and another begins.
- contour continuity: boundary evidence that helps determine where one region ends and another begins.
- shadow edges: boundary evidence that helps determine where one region ends and another begins.
- occlusion boundaries: boundary evidence that helps determine where one region ends and another begins.
### 4.3 Depth and Geometry Evidence
- relative depth ordering: geometric evidence that establishes the depth relationships between subject candidates and background regions.
- linear perspective: geometric evidence that establishes the depth relationships between subject candidates and background regions.
- occlusion patterns: geometric evidence that establishes the depth relationships between subject candidates and background regions.
- parallax consistency: geometric evidence that establishes the depth relationships between subject candidates and background regions.
- scale gradients: geometric evidence that establishes the depth relationships between subject candidates and background regions.
- elevation cues: geometric evidence that establishes the depth relationships between subject candidates and background regions.
- horizon alignment: geometric evidence that establishes the depth relationships between subject candidates and background regions.
### 4.4 Salience and Attention Evidence
- visual prominence: salience evidence that indicates which regions are likely to capture attention and form the figure.
- motion contrast: salience evidence that indicates which regions are likely to capture attention and form the figure.
- feature density: salience evidence that indicates which regions are likely to capture attention and form the figure.
- gaze attraction: salience evidence that indicates which regions are likely to capture attention and form the figure.
- semantic focus cues: salience evidence that indicates which regions are likely to capture attention and form the figure.
- task relevance: salience evidence that indicates which regions are likely to capture attention and form the figure.
- cultural significance: salience evidence that indicates which regions are likely to capture attention and form the figure.
### 4.5 Semantic and Contextual Evidence
- expected category centrality: semantic evidence that helps decide which objects or regions the scene is about.
- action scripts: semantic evidence that helps decide which objects or regions the scene is about.
- social role assumptions: semantic evidence that helps decide which objects or regions the scene is about.
- environmental affordances: semantic evidence that helps decide which objects or regions the scene is about.
- scene genre expectations: semantic evidence that helps decide which objects or regions the scene is about.
- display intent: semantic evidence that helps decide which objects or regions the scene is about.
### 4.6 Temporal Evidence
- continuity over time: temporal evidence that rewards hypotheses consistent across multiple moments in time.
- identity persistence: temporal evidence that rewards hypotheses consistent across multiple moments in time.
- motion coherence: temporal evidence that rewards hypotheses consistent across multiple moments in time.
- stable focus: temporal evidence that rewards hypotheses consistent across multiple moments in time.
- subject switching patterns: temporal evidence that rewards hypotheses consistent across multiple moments in time.
- scene transition consistency: temporal evidence that rewards hypotheses consistent across multiple moments in time.
## 5. Subject–Background Reasoning Pipeline
This pipeline describes the stages through which evidence is accumulated from the raw scene to the final explainable subject-background decision.

### 5.1 Visual Scene
Visual Scene is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.
Evidence accumulation: this stage receives inputs from earlier stages and produces a structured hypothesis with confidence and uncertainty annotations.
Example: during perceptual grouping, the system groups adjacent contours, similar textures, and coherent motion before proposing a subject hypothesis.

### 5.2 Candidate Regions
Candidate Regions is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.
Evidence accumulation: this stage receives inputs from earlier stages and produces a structured hypothesis with confidence and uncertainty annotations.
Example: during perceptual grouping, the system groups adjacent contours, similar textures, and coherent motion before proposing a subject hypothesis.

### 5.3 Perceptual Grouping
Perceptual Grouping is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.

### 5.4 Depth Organization
Depth Organization is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.

### 5.5 Subject Hypothesis
Subject Hypothesis is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.

### 5.6 Background Hypothesis
Background Hypothesis is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.

### 5.7 Context Validation
Context Validation is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.

### 5.8 Explainable Decision
Explainable Decision is a reasoning stage that transforms the scene through a specific kind of evidence or hypothesis.

## 6. Depth Perception Framework
Depth is a fundamental cue for figure-ground organization. This section details the depth heuristics used to separate subjects from backgrounds.

### Perspective
Explanation: perspective is a depth heuristic used to infer which regions are closer or farther in the scene.
Illustrative evidence: describe how this cue manifests in photography, video, or constructed imagery.
Ambiguity sources: note when the cue can be misleading or inconsistent.
Downstream interpretation: explain how the cue affects subject-background hypotheses.

### Relative size
Explanation: relative size is a depth heuristic used to infer which regions are closer or farther in the scene.
Illustrative evidence: describe how this cue manifests in photography, video, or constructed imagery.
Ambiguity sources: note when the cue can be misleading or inconsistent.
Downstream interpretation: explain how the cue affects subject-background hypotheses.

### Occlusion
Explanation: occlusion is a depth heuristic used to infer which regions are closer or farther in the scene.

### Overlap
Explanation: overlap is a depth heuristic used to infer which regions are closer or farther in the scene.

### Atmospheric perspective
Explanation: atmospheric perspective is a depth heuristic used to infer which regions are closer or farther in the scene.

### Focus blur
Explanation: focus blur is a depth heuristic used to infer which regions are closer or farther in the scene.

### Stereoscopic cues
Explanation: stereoscopic cues is a depth heuristic used to infer which regions are closer or farther in the scene.

### Motion parallax
Explanation: motion parallax is a depth heuristic used to infer which regions are closer or farther in the scene.

### Elevation
Explanation: elevation is a depth heuristic used to infer which regions are closer or farther in the scene.

### Horizon cues
Explanation: horizon cues is a depth heuristic used to infer which regions are closer or farther in the scene.

## 7. Visual Grouping Framework
This section explains the Gestalt and perceptual grouping principles that drive subject formation.

### Proximity
Explanation: proximity describes how local visual structure contributes to global figure perception.
Examples: concrete visual patterns or scene arrangements that illustrate the principle.
Failure modes: explain how the principle can be violated or produce ambiguous grouping.

### Similarity
Explanation: similarity describes how local visual structure contributes to global figure perception.
Examples: concrete visual patterns or scene arrangements that illustrate the principle.
Failure modes: explain how the principle can be violated or produce ambiguous grouping.

### Continuity
Explanation: continuity describes how local visual structure contributes to global figure perception.

### Closure
Explanation: closure describes how local visual structure contributes to global figure perception.

### Common fate
Explanation: common fate describes how local visual structure contributes to global figure perception.

### Connectedness
Explanation: connectedness describes how local visual structure contributes to global figure perception.

### Symmetry
Explanation: symmetry describes how local visual structure contributes to global figure perception.

### Repetition
Explanation: repetition describes how local visual structure contributes to global figure perception.

### Visual hierarchy
Explanation: visual hierarchy describes how local visual structure contributes to global figure perception.

## 8. Saliency and Attention Framework
This section details how saliency is computed and how attention competition influences subject selection.

### Visual saliency
Explanation: visual saliency is a dimension of attentional importance that informs which regions become subjects.
Illustrative cases: describe a concrete scenario where this saliency type dominates subject selection.
Ambiguity sources: describe when the saliency signal is weak or conflicting.
Downstream interpretation: explain how this saliency type modifies confidence in the subject hypothesis.

### Semantic saliency
Explanation: semantic saliency is a dimension of attentional importance that informs which regions become subjects.
Illustrative cases: describe a concrete scenario where this saliency type dominates subject selection.
Ambiguity sources: describe when the saliency signal is weak or conflicting.
Downstream interpretation: explain how this saliency type modifies confidence in the subject hypothesis.

### Task-driven attention
Explanation: task-driven attention is a dimension of attentional importance that informs which regions become subjects.

### Contextual saliency
Explanation: contextual saliency is a dimension of attentional importance that informs which regions become subjects.

### Motion saliency
Explanation: motion saliency is a dimension of attentional importance that informs which regions become subjects.

### Object importance
Explanation: object importance is a dimension of attentional importance that informs which regions become subjects.

### Attention competition
Explanation: attention competition is a dimension of attentional importance that informs which regions become subjects.

## 9. Environmental Context Framework
This section explains how environment elements such as lighting, weather, terrain, architecture, and furniture interact with subject-background separation.

### Lighting
Explanation: lighting shapes the scene context and influences whether a region is interpreted as subject or background.
Scene examples: describe a concrete scenario where this environmental component is central to separation reasoning.
Ambiguity sources: discuss how the component can create deceptive cues or competing structures.
Downstream interpretation: explain how the component evidence interacts with subject selection and background validity.

### Weather
Explanation: weather shapes the scene context and influences whether a region is interpreted as subject or background.
Scene examples: describe a concrete scenario where this environmental component is central to separation reasoning.
Ambiguity sources: discuss how the component can create deceptive cues or competing structures.
Downstream interpretation: explain how the component evidence interacts with subject selection and background validity.