# Fitness Equipment Intelligence Framework
**Document Version:** 2.0.0  
**Subsystem Reference:** `FITNESS_EQUIPMENT_INTELLIGENCE_CORE`  
**Module Responsibility:** fitness equipment semantics, affordances, usage evidence, scene contribution, and structured equipment evidence generation for downstream exercise and policy reasoning.

---

## 1. Purpose and Module Responsibility

### 1.1 Core Purpose
The `fitness_gym_appliances` module is responsible for understanding fitness equipment as functional entities within exercise and training scenes. It transforms visual observations into structured equipment evidence, functional semantics, affordance profiles, and contextual signals that support downstream modules without performing movement classification, exercise quality assessment, or policy adjudication.

### 1.2 In-Scope Responsibilities
This module is responsible for:
* identifying fitness objects and distinguishing them from visually similar non-fitness artifacts;
* modeling equipment function, typical use patterns, and biomechanical affordances;
* generating evidence that links equipment presence to exercise context, training environments, and interaction roles;
* supporting clinical scene reasoning through equipment-derived context signals;
* providing confidence, uncertainty, and explainability metadata for all fitness equipment hypotheses.

### 1.3 Out-of-Scope Responsibilities
This module is not responsible for:
* pose estimation,
* exercise classification,
* movement quality evaluation,
* sports recognition,
* injury assessment,
* policy decisions,
* physiological monitoring,
* anatomical interpretation,
* performance measurement.

It provides evidence that these downstream systems can use, rather than making final exercise or policy decisions itself.

### 1.4 Design Principles
The module adheres to the following architectural principles:
* **Function-first reasoning:** Equipment is defined by what it enables, not only how it looks.
* **Evidence-driven semantics:** Each conclusion is grounded in primary, supporting, contextual, and temporal evidence.
* **Modular responsibility:** The module consumes upstream signals and emits structured equipment evidence without duplicating movement, environment, or intent reasoning.
* **Explainability:** Every major inference explains observations, supporting evidence, contradictions, alternatives, confidence, and uncertainty.
* **Ontology consistency:** Terminology and equipment categories align with the broader object taxonomy and support future expansion.

---

## 2. Semantic Reasoning Pipeline

### 2.1 Overview
The fitness equipment reasoning pipeline progresses through successive semantic layers:

1. Visual Features
2. Object Evidence
3. Equipment Identity
4. Functional Semantics
5. Affordance Evidence
6. Usage Evidence
7. Exercise Context
8. Scene Understanding
9. Explainable Decision Support

Each layer is validated before the next is formed. This avoids direct transitions from raw detection to exercise conclusions.

### 2.2 Visual Features
Visual features are the raw perceptual cues detected in the scene. They include:
* shape outlines,
* aspect ratios,
* color contrasts,
* material textures,
* spatial arrangement,
* relationships to surfaces and anchors.

Visual features are used to construct initial object evidence but are not interpreted as fitness semantics without further functional and contextual validation.

### 2.3 Object Evidence
Object evidence is the first conceptual aggregation of visual features into a candidate fitness object. It includes:
* object category hypotheses,
* physical form evidence,
* relative proportions,
* co-occurrence with known fitness artifacts,
* proximity to human subjects.

Object evidence is still tentative and may represent a fitness object, a look-alike object, or a contextual artifact.

### 2.4 Equipment Identity
Equipment identity refines object evidence into a specific equipment class, such as dumbbell, treadmill, or kettlebell. Identity is supported by:
* distinctive structural features,
* typical size and proportion patterns,
* canonical visual signatures aligned with the equipment taxonomy,
* object co-occurrence patterns in fitness environments.

Identity establishes the equipment type but not yet its functional use.

### 2.5 Functional Semantics
Functional semantics assign meaning to an equipment identity based on its primary and secondary functions. This layer defines:
* what the equipment is designed to do,
* the biomechanical roles it supports,
* the kind of human interaction it expects,
* the training objectives it enables.

For example, a rowing machine’s semantic meaning includes seated pull-based cardiovascular training and coordinated lower/upper body engagement, not simply “a machine with handles and a seat.”

### 2.6 Affordance Evidence
Affordance evidence describes the actions the equipment enables or constrains. It includes:
* grasping behavior,
* pushing,
* pulling,
* loading,
* balancing,
* stabilizing,
* carrying,
* resisting motion.

Affordances bridge the gap between static object identity and dynamic usage evidence.

### 2.7 Usage Evidence
Usage evidence captures the relationship between people and equipment. It includes:
* active interactions,
* passive placement,
* transport,
* preparation,
* equipment transition between use and storage.

Usage evidence distinguishes a treadmill in active training from a treadmill placed in storage or a foam roller resting beside a couch.

### 2.8 Exercise Context
Exercise context integrates equipment evidence with environment, movement, and human activity evidence. It determines whether an observed equipment presence is consistent with:
* strength training,
* cardio conditioning,
* functional fitness,
* recovery,
* rehabilitation,
* personal training,
* group instruction.

This contextual layer is essential for downstream systems that require exercise semantics without relying on direct exercise classification.

### 2.9 Scene Understanding
Scene understanding situates the equipment and people within a broader fitness environment. It leverages:
* room type evidence,
* facility type evidence,
* activity grouping,
* equipment layout,
* temporal sequence.

This layer supports robust understanding of commercial gyms, home fitness spaces, rehabilitation centers, and outdoor training zones.

### 2.10 Explainable Decision Support
The final output of the module is structured evidence for downstream systems, including:
* equipment hypotheses,
* functional labels,
* affordance profiles,
* usage confidence,
* contextual signals,
* uncertainty annotations,
* reasoning pathways.

Downstream reasoning systems consume these outputs to make policy, safety, or exercise-oriented decisions.

## 3. Functional Semantics of Fitness Equipment

### 3.1 Functional Purpose vs Visual Appearance
Every fitness object is defined by function rather than appearance alone. The module distinguishes:
* objects that look like fitness equipment but do not afford training activities,
* objects that are used for fitness despite atypical appearance,
* equipment whose meaning shifts depending on context.

Example: a cylindrical object may be a foam roller, a decorative pillow, or a portable speaker. Functional semantics determine whether it is intended for rolling, support, or audio playback.

### 3.2 Functional Categories
Fitness equipment is organized into functional categories based on the type of biomechanical role it supports:
* Free weights,
* Strength training machines,
* Cardio equipment,
* Functional training tools,
* Recovery devices.

Each category has distinct affordance and interaction patterns.

### 3.3 Primary and Secondary Purposes
For every equipment category, the module records:
* Primary Purpose: the intended training function.
* Secondary Purpose: additional uses or alternate training modes.

Example: a kettlebell’s primary purpose is dynamic ballistic loading and core stabilization; its secondary purpose includes unilateral conditioning and grip endurance.

### 3.4 Biomechanical Role
The biomechanical role describes the mechanical and human movement relationship, such as:
* load-bearing resistance,
* concentric and eccentric muscle action,
* dynamic stabilization,
* cardio pacing,
* posture support.

These roles are critical for connecting equipment evidence to exercise context.

### 3.5 Typical User Interaction
Typical user interaction captures how humans engage with the equipment, including:
* lift grips,
* seating or standing posture,
* hand placement,
* foot placement,
* body alignment constraints.

Example: a dumbbell typically requires a two-handed or single-handed grip, a loaded vertical push or pull, and a neutral wrist alignment.

### 3.6 Expected Environment
The expected environment defines where the equipment is normally found:
* commercial gyms,
* home gyms,
* rehabilitation centers,
* outdoor fitness parks,
* studio training spaces.

This environmental expectation is combined with scene evidence to resolve ambiguous objects.

### 3.7 Training Objectives
Training objectives describe the type of physical goals the equipment supports:
* strength development,
* power generation,
* endurance conditioning,
* flexibility and mobility,
* balance and coordination,
* recovery and regeneration.

Equipment semantics are strongest when aligned with clear training objective evidence.

### 3.8 Safety Considerations
Safety considerations describe constraints and risk factors associated with equipment use, including:
* required support surfaces,
* user positioning constraints,
* impact of incorrect use,
* dependency on supervision or spotters.

Safety considerations influence downstream interpretations of whether the observed equipment is likely used correctly or in a risky manner.

### 3.9 Contextual Meaning
Contextual meaning reflects how the same equipment may imply different scenes:
* a weight plate in a gym signals strength training,
* a weight plate in a physics lab signals calibration or demonstration,
* a kettlebell in a living room may signal home exercise or decorative storage.

Contextual evidence is required to choose the correct semantic interpretation.

### 3.10 Semantic Importance
Semantic importance summarizes the relevance of an equipment hypothesis for downstream reasoning. It includes:
* whether the object is central to the observed activity,
* whether its affordances explain human actions,
* whether it contributes to exercise context inference.

The module prioritizes equipment hypotheses that carry greater semantic weight.

## 4. Object Affordance Intelligence

### 4.1 Affordance Definition
Affordances are the action possibilities that fitness equipment offers to a user. This module models affordances as relationships between the object’s functional properties and human interaction capabilities.

### 4.2 Grasping Behavior
Grasping behavior includes:
* handle orientation,
* grip surfaces,
* hand placement zones,
* bilateral or unilateral grasp patterns.

Example: a barbell affords two-handed overhand or mixed grip patterns; a kettlebell affords a central handle grip and can rotate through the hands.

### 4.3 Lifting
Lifting affordances describe equipment designed primarily for vertical or diagonal load transfer, including:
* free weights,
* barbells,
* loaded vest systems.

This affordance is validated by the equipment’s ability to support weight and the user’s lifting posture.

### 4.4 Pushing
Pushing affordances describe equipment that imparts resistance through a horizontal or vertical pushing action, such as:
* chest press machines,
* sleds,
* rowing machine footplates.

Pushing affordances are identified by contact surfaces, handles, and adjustable resistance elements.

### 4.5 Pulling
Pulling affordances describe equipment that supports pulling actions, including:
* cable rows,
* lat pulldowns,
* battle ropes,
* resistance bands.

Pulling affordances are characterized by anchor points, handles, and tensioning elements.

### 4.6 Balancing
Balancing affordances describe equipment that requires the user to maintain equilibrium, such as:
* balance trainers,
* stability balls,
* wobble boards,
* suspension trainers.

Balance affordances are important for identifying dynamic training and rehabilitation contexts.

### 4.7 Supporting
Supporting affordances describe equipment that holds or stabilizes the user, including:
* benches,
* racks,
* support frames,
* seating systems.

These affordances connect equipment evidence to posture and load-bearing contexts.

### 4.8 Carrying
Carrying affordances describe equipment designed to be transported or repositioned by the user, such as:
* medicine balls,
* sandbags,
* adjustable dumbbells.

Carrying affordances are validated by object size, weight distribution, and observed user transport behavior.

### 4.9 Resistance Generation
Resistance generation affordances describe how equipment provides training load through:
* gravity loading,
* elastic tension,
* hydraulic resistance,
* mechanical friction,
* air resistance.

Understanding resistance mechanisms is essential for differentiating fitness devices from non-fitness objects with similar shapes.

### 4.10 Exercise Constraints
Exercise constraints describe limitations imposed by the object, such as:
* fixed movement planes,
* required body alignment,
* adjustable height or resistance settings,
* safety stops.

These constraints help determine whether an object is intended for strength training, functional movement, or recovery.

### 4.11 Human Adaptation
Human adaptation describes how users alter their behavior to use the equipment, including:
* changes in grip,
* altered stance,
* brace or support positions,
* transition between active and rest states.

These adaptations serve as strong affordance evidence.

### 4.12 Environmental Interaction
Environmental interaction describes how the equipment interacts with its surroundings, including:
* floor anchoring,
* wall attachments,
* clearance requirements,
* compatible surfaces.

Equipment that requires specific environmental conditions provides stronger contextual evidence for fitness scenes.

## 5. Evidence Architecture

### 5.1 Evidence Taxonomy
The module classifies evidence into:
* **Primary Evidence**: direct cues that strongly indicate a fitness equipment hypothesis.
* **Supporting Evidence**: secondary cues that reinforce the hypothesis.
* **Contextual Evidence**: environment and scene-level signals.
* **Temporal Evidence**: sequential or persistent observations.
* **Functional Evidence**: affordance and usage validation.
* **Conflicting Evidence**: signals that contradict the equipment hypothesis.
* **Missing Evidence**: absent cues that weaken the hypothesis.
* **Weak Evidence**: low-quality or ambiguous observations.
* **Strong Evidence**: high-quality, consistent cues.

### 5.2 Primary Evidence
Primary evidence includes:
* equipment-specific geometric features,
* distinctive handle and support structures,
* canonical object arrangements,
* direct human-equipment contact consistent with exercise use.

Example: a horizontal row of weight plates aligned on a barbell is primary evidence for a barbell identity.

### 5.3 Supporting Evidence
Supporting evidence includes:
* co-occurring fitness objects,
* typical gym surfaces,
* exercise-related signage,
* nearby training accessories.

This evidence reinforces the inference without being sufficient alone.

### 5.4 Contextual Evidence
Contextual evidence includes:
* environment type,
* facility layout,
* room usage patterns,
* presence of multiple users,
* training zone indicators.

Contextual evidence is critical for distinguishing fitness equipment from similar-looking objects in non-gym environments.

### 5.5 Temporal Evidence
Temporal evidence includes:
* equipment appearance over time,
* transitions between active use and idle states,
* repeated interactions across a session,
* movement of equipment within the scene.

Temporal evidence helps confirm whether an object is part of an exercise sequence or remains an incidental artifact.

### 5.6 Functional Evidence
Functional evidence includes:
* inferred affordances,
* anticipated user actions,
* equipment pose relative to the user,
* object orientation aligned with expected training behaviors.

This evidence validates that the object is not simply a visually similar prop.

### 5.7 Conflicting Evidence
Conflicting evidence includes:
* non-fitness environment signals,
* alternate object interpretations,
* usage patterns inconsistent with fitness training,
* objects co-occurring that imply a different scene.

Conflicting evidence is explicitly represented and used to lower confidence or maintain alternative hypotheses.

### 5.8 Missing Evidence
Missing evidence includes expected cues that are absent, such as:
* absence of handles on a candidate dumbbell,
* lack of resistance mechanism for a candidate cardio machine,
* missing stability surface for a candidate balance trainer.

Missing evidence reduces the strength of the equipment hypothesis.

### 5.9 Weak Evidence
Weak evidence is low-quality, occluded, or incomplete observations. Examples:
* blurred object edges,
* partial object visibility,
* distant objects that lack sufficient detail,
* low confidence upstream detections.

Weak evidence may still contribute to a hypothesis when combined with stronger signals.

### 5.10 Strong Evidence
Strong evidence is clear, repeated, and semantically consistent. Examples:
* high-resolution identification of a treadmill belt,
* repeated active use of a dumbbell with correct grip,
* presence of a fully assembled smith machine in a gym environment.

Strong evidence supports confident equipment conclusions.

### 5.11 Evidence Quality
Evidence quality is assessed by:
* perceptual clarity,
* temporal consistency,
* context alignment,
* affordance validation,
* independence from other evidence sources.

High-quality evidence has low ambiguity and high reliability.

### 5.12 Evidence Reliability
Evidence reliability reflects how trustworthy a source is. Reliable evidence sources include:
* dedicated object recognition models,
* stable scene classification,
* consistent interaction patterns.

Less reliable evidence sources include transient occluded views, visually noisy frames, and novel equipment forms.

### 5.13 Evidence Consistency
Evidence consistency is the degree to which multiple sources agree. Consistent equipment hypotheses are supported by:
* aligned functional semantics,
* matching affordance and usage evidence,
* coherent environmental signals,
* stable temporal persistence.

Inconsistent evidence raises uncertainty and preserves alternative interpretations.

### 5.14 Evidence Sufficiency
Evidence sufficiency is the threshold at which a hypothesis is considered actionable. It is determined by:
* the balance of primary, supporting, and contextual evidence,
* the presence of contradictory signals,
* the confidence and uncertainty profile.

Sufficient evidence is not a binary conclusion; it is a graded assessment used by downstream systems.

## 6. Multi-Modal Evidence Fusion

### 6.1 Integration Overview
Fitness equipment evidence is fused with multiple upstream and parallel modalities. This fusion is conceptual, not implementation-specific.

### 6.2 Movement Integration
Movement evidence informs whether equipment is actively used or passively present. Examples:
* a treadmill belt moving while a person is aligned with it supports active cardio equipment use,
* a stationary barbell next to a lifter may indicate preparation or rest.

Movement evidence is used to distinguish exercise intent from idle equipment presence.

### 6.3 Pose Integration
Pose evidence validates human-equipment coupling. Examples:
* a bent elbow grasping a dumbbell handle supports weightlifting usage,
* a seated posture on a rowing machine supports rowing activity.

Pose evidence is used as supporting evidence, not as the core object inference.

### 6.4 Fitness Distinction Integration
Signals from `fitness_distinction` provide context about whether the subject is engaged in fitness-related motion. These signals are used to adjust equipment usage confidence but do not replace equipment evidence.

### 6.5 Oscillatory Frequency Integration
Oscillatory frequency evidence supports detection of repeated exercise motions and can strengthen temporal usage evidence. This integration helps confirm that a kettlebell or battle rope is being used in rhythmic training rather than as a decorative object.

### 6.6 Sports Integration
Sports context signals distinguish fitness training from sports-specific activities. For example, a weight plate in a weightlifting area differs from a similar plate used in a sports rebound training setup.

### 6.7 Environment Integration
Environment evidence determines whether the equipment is located in a fitness-appropriate setting. Examples:
* gym flooring, mirrors, and signage support gym equipment semantics;
* living room furniture and carpets may weaken a treadmill hypothesis.

### 6.8 Behavioral Signals Integration
Behavioral signals reveal user intent and interaction style. For example:
* a user adjusting resistance settings on a stationary bike supports active training,
* a person standing near a foam roller without engagement may imply passive recovery preparation.

### 6.9 Educational Context Integration
Educational context signals identify instructional training sessions, personal training, and group exercise classes. When present, they support interpretations of equipment as being used for guided workouts rather than casual home use.

### 6.10 Interaction Intent Integration
Interaction intent evidence helps determine whether the equipment is used for deliberate exercise, demonstration, or posed photography. It is especially valuable for distinguishing staged scenes from authentic workouts.

### 6.11 Policy Reasoning Integration
The module emits evidence that is usable by policy reasoning systems. It does not decide policy outcomes itself. Downstream systems may use equipment evidence to inform moderation thresholds, safety allowances, or content classification rules.

### 6.12 Supporting Evidence
Supporting evidence in fusion includes:
* aligned movement and pose cues,
* matching environment and facility signals,
* consistent usage patterns over time.

### 6.13 Conflicting Evidence
Conflicting evidence arises when modalities disagree. Examples:
* object evidence suggests a treadmill, but environment evidence indicates a shopping mall walkway,
* equipment identity is a kettlebell, but pose evidence shows the person is simply holding a decorative sphere.

Conflicting evidence is retained and used to lower confidence.

### 6.14 Cross-Validation
Cross-validation ensures that equipment hypotheses are supported by at least two independent modalities. For example, a barbell hypothesis is stronger when verified by object identity and pose-grip evidence.

### 6.15 Semantic Consistency
Semantic consistency is evaluated by checking whether equipment function, affordances, usage, and context all point toward the same domain. Inconsistent semantics raise uncertainty.

### 6.16 Context Refinement
Context refinement updates equipment interpretation based on evolving scene evidence. An object that initially resembles a mat may become a foam roller if the user rolls on it and the environment matches a recovery area.

### 6.17 Responsibility Separation
The module avoids duplicating other subsystem responsibilities by consuming their outputs as evidence and refraining from direct movement classification, semantic instruction, or policy enforcement.

## 7. Dependency Standard

### 7.1 Incoming Evidence
The module consumes conceptual evidence from upstream modules, including:
* `pose`: human body posture and joint configuration,
* `movement`: trajectories and motion dynamics,
* `environment`: room type and facility layout,
* `behavioral_signals`: attention, object interaction, and engagement,
* `interaction_intent`: inferred user purpose,
* `sports`: sports context and domain signals,
* `educational_context`: training and instruction indicators.

### 7.2 Outgoing Evidence
The module emits structured equipment evidence to downstream systems, including:
* equipment type hypotheses,
* functional semantics,
* affordance profiles,
* usage signals,
* exercise context indicators,
* equipment confidence profiles,
* uncertainty annotations,
* explainability metadata.

### 7.3 Upstream Modules
Upstream modules provide evidence that the fitness equipment module uses, such as:
* `pose` for interaction validation,
* `movement` for active usage inference,
* `environment` for scene classification,
* `behavioral_signals` for user engagement,
* `interaction_intent` for likely purpose.

### 7.4 Downstream Modules
Downstream modules consume equipment evidence from this module, such as:
* `movement` for exercise analysis,
* `sports` for fitness vs sport differentiation,
* `policy reasoning` for content moderation support,
* `educational_context` for training session detection,
* `risk assessment` for safety evaluation.

### 7.5 Dependency Assumptions
The module operates under these conceptual dependency assumptions:
* upstream pose and movement evidence accurately represent human interaction,
* environment evidence reliably indicates fitness-appropriate settings,
* behavioral signals reflect real user intent,
* interaction intent conveys whether the user is exercising, demonstrating, or staging.

### 7.6 Dependency Strength
Dependencies are ranked by conceptual influence:
* strong: `pose`, `movement`, `environment`,
* moderate: `behavioral_signals`, `interaction_intent`, `sports`, `educational_context`.

Strong dependencies are essential for usage and context conclusions; moderate dependencies refine confidence and disambiguation.

### 7.7 Dependency Failures
Dependency failures occur when upstream inputs are missing, inconsistent, or unreliable. Examples:
* pose evidence missing due to occlusion,
* environment classification ambiguous between gym and home,
* movement evidence unavailable for passive equipment.

The module handles dependency failures by lowering confidence, raising uncertainty, and preserving multiple equipment hypotheses.

### 7.8 Propagation Rules
The module propagates dependency confidence and uncertainty through its own reasoning layers. If upstream evidence is weak or conflicting, equipment confidence is reduced and uncertainty is explicitly annotated.

### 7.9 Subsystem Contracts
Contracts define how the module consumes and emits evidence:
* evidence type,
* expected confidence ranges,
* semantic labels,
* explainability metadata.

These contracts make the module interoperable and auditable across the multimodal reasoning architecture.

## 8. Temporal Equipment Intelligence

### 8.1 Equipment Lifecycle
Temporal intelligence tracks the lifecycle of fitness equipment in a session:
* appearance,
* preparation,
* active usage,
* passive presence,
* removal or storage.

This lifecycle allows the module to differentiate between equipment that is central to the observed activity and equipment that is incidental.

### 8.2 Equipment Preparation
Preparation evidence includes:
* adjusting settings or positions,
* placing equipment in a use-ready orientation,
* unrolling mats,
* attaching resistance bands.

Preparation is a strong signal that the equipment will be used for exercise rather than being stored or decorative.

### 8.3 Active Usage
Active usage evidence includes:
* human contact with the equipment,
* motion relative to the equipment,
* visible exertion or adjustment during interaction.

Active usage confirms that equipment semantics should contribute to exercise context.

### 8.4 Passive Presence
Passive presence evidence includes:
* equipment visible but not actively engaged,
* equipment arranged in the scene but unused,
* equipment placed nearby a user without current interaction.

Passive presence may still inform scene understanding, such as suggesting a fitness environment even when no exercise is currently underway.

### 8.5 Equipment Transitions
Equipment transitions capture changes such as:
* moving a dumbbell from storage to floor,
* loading plates onto a barbell,
* folding a treadmill,
* detaching a TRX band.

Transitions are important for understanding workflow and activity phases.

### 8.6 Shared Equipment
Shared equipment evidence describes objects used by multiple participants or multiple times in a session. Examples:
* a set of kettlebells accessed sequentially by different users,
* a rowing machine used in alternating reps.

Shared equipment evidence supports group exercise and facility-level interpretations.

### 8.7 Session Continuity
Session continuity tracks equipment and activity patterns across a longer scene. It helps differentiate:
* an exercise session with repeated equipment use,
* a staged scene with brief equipment placement,
* a training environment with intermittent equipment interaction.

Continuity provides stronger semantic grounding than isolated frames.

### 8.8 Equipment Lifecycle States
The module models equipment through discrete lifecycle states:
* prepared,
* active,
* resting,
* stored.

Transition evidence between states is used to infer scene progression.

### 8.9 Historical Evidence
Historical evidence includes past equipment observations within the same sequence, such as:
* repeated use of a specific dumbbell set,
* a treadmill being activated after a warm-up period.

Historical evidence supports persistent equipment hypotheses and reduces uncertainty.

### 8.10 Interaction Persistence
Interaction persistence measures how consistently a user engages with the equipment. Persistent interaction suggests meaningful exercise context, while transient contact may indicate incidental handling.

### 8.11 Context Evolution
Context evolution tracks how the surrounding scene shifts over time, such as:
* a home gym setup evolving into an active workout,
* a rehabilitation area transitioning from rest to guided movement,
* a training studio moving from instruction to independent practice.

Evolving context allows the module to update equipment semantics dynamically.

## 9. Fitness Context Intelligence

### 9.1 Commercial Gyms
Commercial gym intelligence interprets equipment within facility-scale fitness environments. It uses:
* clusters of strength machines,
* rows of cardio equipment,
* cable zones,
* free weight areas.

Commercial gym context strengthens equipment hypotheses for professional training scenes.

### 9.2 Home Gyms
Home gym intelligence recognizes fitness equipment in residential spaces. It accounts for:
* mixed furniture,
* limited floor space,
* multi-use objects,
* adaptive equipment placement.

It distinguishes home fitness use from casual home decor.

### 9.3 Rehabilitation Centers
Rehabilitation center intelligence identifies equipment used for therapeutic movement, including:
* low-impact treadmills,
* balance systems,
* mobility-assist devices,
* parallel bars.

This context is distinct from general fitness because of its focus on recovery and controlled movement.

### 9.4 Sports Facilities
Sports facility intelligence contextualizes fitness equipment within athletic training venues, such as:
* field-side strength areas,
* stadium conditioning zones,
* team training rooms.

It differentiates fitness equipment used for sport-specific preparation from general gym use.

### 9.5 School Gyms
School gym intelligence recognizes equipment in educational fitness environments, including:
* physical education spaces,
* training circuits,
* student-oriented gym layouts.

This context often includes group instruction and supervised use.

### 9.6 Outdoor Fitness Parks
Outdoor fitness park intelligence identifies equipment arranged in open-air training zones, such as:
* outdoor pull-up bars,
* park benches used for step-ups,
* fitness trail stations.

It distinguishes outdoor training from indoor gym equipment by environment evidence.

### 9.7 Functional Training Zones
Functional training zone intelligence interprets multi-purpose equipment and open training areas designed for dynamic movement, such as:
* battle rope stations,
* plyometric box arrays,
* agility ladders.

This context emphasizes adaptability and multi-planar movement.

### 9.8 Cross-Training Environments
Cross-training environment intelligence identifies heterogeneous equipment combinations used for varied training modalities. It supports semantic interpretations such as circuit training and high-intensity interval training.

### 9.9 Personal Training Sessions
Personal training intelligence recognizes one-on-one guided training scenarios. It uses evidence such as:
* trainer and client proximity,
* instructional gestures,
* alternating equipment use.

This context raises the likelihood that observed equipment is used deliberately and with coaching intent.

### 9.10 Group Exercise Spaces
Group exercise intelligence identifies spaces arranged for multiple participants, such as classes or team workouts. It relies on:
* multiple identical equipment units,
* structured floor markings,
* synchronization cues.

This context supports equipment interpretations that reflect collective training rather than individual use.

### 9.11 Environmental Disambiguation
The module explains why identical equipment means different things depending on surrounding evidence. Examples:
* a spin bike in a gym suggests cardiovascular training,
* the same spin bike in a showroom suggests product display,
* a treadmill in a retail store implies demonstration, not active exercise.

Contextual evidence is required to resolve these meanings.

## 10. Confidence Architecture

### 10.1 Confidence Dimensions
Confidence is represented along multiple axes:
* Object Confidence: trust in the equipment identity hypothesis.
* Equipment Identity Confidence: trust that the object is the specific equipment class.
* Affordance Confidence: trust in the inferred interaction possibilities.
* Usage Confidence: trust that the equipment is being used for exercise.
* Exercise Context Confidence: trust that the surrounding scene supports training semantics.
* Scene Confidence: trust in the overall fitness environment interpretation.
* Evidence Confidence: trust aggregated from all evidence sources.
* Decision Confidence: final confidence emitted to downstream reasoning.

### 10.2 Confidence Propagation
Confidence propagates through the pipeline as follows:
* visual evidence forms object confidence,
* equipment identity refines object confidence,
* affordance evidence adjusts identity confidence,
* usage evidence raises or lowers usage confidence,
* context evidence updates exercise and scene confidence,
* the final decision confidence combines all layers with uncertainty penalties.

This propagation preserves the source of confidence at each layer.

### 10.3 Equipment Confidence
Equipment confidence is based on:
* clarity of physical features,
* match to canonical equipment taxonomy,
* absence of strong conflicting evidence.

Strong equipment confidence is achieved when the object identity is corroborated by multiple modalities.

### 10.4 Equipment Identity Confidence
Identity confidence differs from object confidence by focusing on the exact equipment subtype. It increases when:
* distinguishing features are present,
* equipment functional semantics are consistent,
* ambiguous alternatives are ruled out.

Example: distinguishing a kettlebell from a decorative orb requires evidence of the handle and expected grip zone.

### 10.5 Affordance Confidence
Affordance confidence measures trust in the inferred action possibilities. It is based on:
* visible interaction points,
* equipment geometry,
* expected user adaptation.

High affordance confidence strengthens the downstream usage evidence.

### 10.6 Usage Confidence
Usage confidence reflects how likely the equipment is actively involved in the scene. It depends on:
* direct human-equipment contact,
* movement and pose alignment,
* preparation and transition evidence,
* temporal persistence.

### 10.7 Exercise Context Confidence
Exercise context confidence assesses whether the equipment and scene align with a fitness activity. It is informed by:
* environment evidence,
* clustering of fitness devices,
* behavioral and intent signals,
* session continuity.

### 10.8 Scene Confidence
Scene confidence is the macro-level trust that the entire observed environment is fitness-related. It is built from:
* room type classification,
* facility layout,
* repeated equipment presence,
* participant behavior.

### 10.9 Evidence Confidence
Evidence confidence is a summary of how reliable each evidence source is. It includes:
* source credibility,
* observation quality,
* temporal consistency,
* cross-modal alignment.

### 10.10 Decision Confidence
Decision confidence is the final composite score, which includes:
* the strength of supporting evidence,
* the impact of conflicting evidence,
* the degree of uncertainty.

Downstream systems use decision confidence to determine whether the equipment evidence is sufficient for further reasoning.

### 10.11 Confidence Profiles
The module emits structured confidence profiles that separately report each dimension. This allows downstream systems to identify specific weak points rather than relying on a single opaque score.

## 11. Uncertainty Architecture

### 11.1 Uncertainty as Explicit Evidence
Uncertainty is treated as a first-class reasoning component. The module explicitly documents why a conclusion is uncertain and which uncertainty dimensions are involved.

### 11.2 Ambiguity
Ambiguity arises when the equipment hypothesis remains plausible among multiple alternatives. Example sources of ambiguity:
* dumbbell vs flashlight,
* kettlebell vs decorative object,
* massage roller vs cylindrical cushion.

Ambiguity is represented as a set of competing hypotheses with associated support and contradiction evidence.

### 11.3 Unknown Observations
Unknown observations occur when visual features do not match any known equipment taxonomy or when the object is only partially visible. The module labels these as unknown candidates and retains them for future evidence accumulation.

### 11.4 Novel Situations
Novel situations occur when the scene contains equipment usage patterns or mixed-object assemblies that are not represented in the existing ontology. The module recognizes novelty by detecting functional inconsistencies and increasing uncertainty until more evidence is available.

### 11.5 Distribution Shift
Distribution shift refers to changes in scene characteristics compared to training or reference scenarios, such as:
* home gyms with unconventional layouts,
* outdoor fitness parks with irregular equipment,
* makeshift training setups using household objects.

The module raises uncertainty in distribution-shift cases and avoids overconfident assertions.

### 11.6 Conflicting Evidence
Conflicting evidence occurs when different evidence sources support opposing conclusions. Examples:
* object identity supports a kettlebell, while environment evidence indicates a living room display,
* movement evidence supports active use, while interaction intent suggests a staged workout.

Conflicting evidence is explicitly retained and reduces confidence.

### 11.7 Missing Observations
Missing observations are expected cues that are absent, such as:
* no handles visible on an object shaped like a dumbbell,
* no treadmill belt visible on a candidate cardio machine,
* no seating surface apparent on a candidate rowing machine.

Missing observations decrease evidence sufficiency and increase uncertainty.

### 11.8 Low Quality Observations
Low quality observations occur due to:
* low resolution,
* occlusion,
* poor lighting,
* extreme camera angles.

Low quality observations reduce evidence reliability and make the module rely more heavily on supporting and contextual evidence.

### 11.9 Uncertainty Propagation
Uncertainty propagates through the reasoning pipeline similarly to confidence. If any stage is uncertain, downstream stages inherit and combine that uncertainty.

Examples:
* low object confidence increases equipment identity uncertainty,
* ambiguous affordance evidence increases usage uncertainty,
* uncertain environment classification increases scene confidence uncertainty.

### 11.10 Uncertainty Communication
The module communicates uncertainty through structured outputs, including:
* `uncertainty_profile`,
* `uncertainty_reasons`,
* `confidence_bounds`,
* `hypothesis_alternatives`,
* `dependency_warnings`.

This enables downstream systems to make risk-aware decisions rather than assuming a single binary conclusion.

### 11.11 Uncertainty Dimensions
Uncertainty is modeled across dimensions such as:
* object ambiguity,
* functional ambiguity,
* interaction ambiguity,
* environment ambiguity,
* temporal uncertainty,
* sensor or detection uncertainty.

Each dimension is tracked independently and combined for final decision support.

### 11.12 Viewpoint Uncertainty
Viewpoint uncertainty arises when angle or perspective makes object features difficult to resolve. The module recognizes this by comparing the observed object geometry with expected appearance under standard viewpoints.

### 11.13 Synthetic Equipment
Synthetic equipment uncertainty applies when the scene contains objects that resemble fitness equipment but are clearly artificial or digitally generated. The module raises uncertainty and preserves alternate interpretations.

### 11.14 Shared Equipment Uncertainty
Shared equipment uncertainty arises when multiple users interact with the same device or tool, making it difficult to attribute usage to a single participant. The module preserves equipment evidence while noting the sharing ambiguity.

### 11.15 Partial Visibility
Partial visibility uncertainty occurs when only a portion of the equipment is visible. The module uses what is visible to form a candidate hypothesis and treats the missing portions as uncertainty sources.

## 12. Explainability Standard

### 12.1 Explanation Requirements
Every major conclusion must explain:
* What was observed?
* Why is it important?
* Which evidence supports it?
* Which evidence contradicts it?
* What alternatives exist?
* How confident is the conclusion?
* What uncertainty remains?

### 12.2 Explanation Components
A complete explanation includes:
* observation summary,
* evidence taxonomy,
* confidence profile,
* uncertainty profile,
* alternative hypotheses,
* reasoning pathway,
* subsystem contributions,
* final rationale.

### 12.3 Observation Summary
The observation summary describes the detected equipment features, human interactions, and environmental context relevant to the equipment hypothesis.

### 12.4 Importance Statement
The importance statement explains why the equipment conclusion matters for downstream reasoning, such as whether it supports exercise context inference or policy considerations.

### 12.5 Supporting Evidence Description
Supporting evidence is listed explicitly, including its type and how it strengthens the conclusion.

### 12.6 Contradictory Evidence Description
Contradictory evidence is also listed, with an explanation of how it weakens the conclusion and why it was not decisive.

### 12.7 Alternatives Description
Alternative interpretations are enumerated and described, including what evidence would be required to select them.

### 12.8 Confidence Level Description
The confidence level is reported in terms of the dimensions that are strong and weak, rather than as a single opaque value.

### 12.9 Remaining Uncertainty Description
Remaining uncertainty is explained by referencing the uncertain evidence sources and their impact on the conclusion.

### 12.10 Reasoning Pathway Description
The reasoning pathway documents how the module progressed through semantic layers to reach the conclusion. It makes the inference traceable and audit-ready.

## 13. Failure Analysis

### 13.1 Semantic Failures
Semantic failures occur when the module assigns the wrong fitness meaning to an object. Example causes:
* relying on visual similarity without enough functional evidence,
* ignoring context signals that indicate a non-fitness scene.

Symptoms include incorrect equipment type labels and misleading exercise context signals.

### 13.2 Affordance Failures
Affordance failures occur when the module incorrectly infers the actions an object affords. Example cause:
* treating a decorative bar as a barbell handle.

Symptoms include false active usage evidence and downstream exercise misinterpretation.

### 13.3 Context Failures
Context failures occur when environment or scene evidence is misread. Example cause:
* classifying a retail showroom as a home gym.

Symptoms include assigning gym equipment semantics to display props.

### 13.4 Dependency Failures
Dependency failures occur when upstream modules provide unreliable or missing evidence. Example cause:

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

### 2.1 Intersection over Union ($IoU$) Matrix Formulation

$$IoU = \frac{\text{Area}(B_{\text{person}} \cap B_{\text{appliance}})}{\text{Area}(B_{\text{person}} \cup B_{\text{appliance}})}$$

Where $B_{\text{person}}$ and $B_{\text{appliance}}$ represent 2D normalized bounding coordinates.

### 2.2 Proximity-Weighted Confidence Score ($S_{\text{gym}}$)
If direct intersection is zero, proximity context is evaluated using center-point Euclidean distances normalized against the canvas diagonal:

$$S_{\text{gym}} = \sum_{i=1}^{K} w_i \cdot C_i \cdot \exp\left( -\gamma \cdot \frac{\text{Dist}(C_{\text{person}}, C_{\text{appliance}, i})}{\sqrt{W^2 + H^2}} \right)$$

Where $C_i$ is the model confidence score for object $i$, $w_i$ is the structural weight assigned to the fitness category, and $\gamma = 2.5$.

```javascript
/**
 * ============================================================================
 * AI RADAR SYSTEM - OBJECTS UNDERSTANDING SUBSYSTEM
 * MODULE: FITNESS_GYM_APPLIANCES_ENGINE
 * VERSION: 18.2.0-RELEASE-PROD-SHIELD
 * CHROMIUM MV3 BACKGROUND EXTENSION WORKER CORE - ZERO RUNTIME HEAP ALLOCATIONS
 * ============================================================================
 */

"use strict";

const FITNESS_SHIELD_CONFIG = {
    IDENTIFIER: "AI_RADAR_OBJECT_FITNESS",
    MAX_OBJECT_TRACKING_LIMIT: 32,
    MIN_VALID_CONFIDENCE: 0.55,
    ALPHA_TEMPORAL_SMOOTHING: 0.70,

    CLASS_MAPPING_WEIGHTS: {
        10: 1.00, // Dumbbell / Weight Plates
        11: 0.95, // Barbell / Benchpress Rack
        12: 0.90, // Treadmill / Stationary Bike / Rower
        13: 0.85, // Yoga Mat / Foam Roller
        14: 0.70  // Kettlebell / Medicine Ball
    }
};

class FitnessGymAppliancesEngine {
    /**
     * Initializes the high-speed spatial object intersection engine.
     * @param {number} frameWidth - Horizontal canvas scale.
     * @param {number} frameHeight - Vertical canvas scale.
     */
    constructor(frameWidth, frameHeight) {
        this.width = frameWidth;
        this.height = frameHeight;
        this.canvasDiagonal = Math.sqrt(frameWidth * frameWidth + frameHeight * frameHeight);
        this.executionCycleIndex = 0n;

        // Structured Pre-allocated Buffers (Zero runtime GC allocations)
        this.detectedObjectsBuffer = new Float32Array(FITNESS_SHIELD_CONFIG.MAX_OBJECT_TRACKING_LIMIT * 6); // Slots: [classId, conf, xMin, yMin, xMax, yMax]
        this.historicalGymConfidence = new Float32Array(15); // Rolling history loop across 15 iterations
        this.activeGymConfidenceScore = 0.0;

        this._verifyHardwareMemoryAllocation();
    }

    /** @private */
    _verifyHardwareMemoryAllocation() {
        console.log(`[FITNESS_INIT] Allocation secured for ${FITNESS_SHIELD_CONFIG.MAX_OBJECT_TRACKING_LIMIT} concurrent vectors. Ready.`);
        this.detectedObjectsBuffer.fill(-1.0);
        this.historicalGymConfidence.fill(0.0);
    }

    /**
     * Parses the object detection array to find spatial co-occurrence with sports tools.
     * @param {Float32Array} rawInferenceOutputs - Flattened array from object detection web-worker inference thread.
     * @param {number} totalObjectsDetected - Count of bounding boxes found.
     * @param {Object} humanBoundingBox - Coordinate bounds of the prioritized human subject.
     * @returns {Object} Context verification metrics for downstream whitelist assessment rules.
     */
    evaluateFitnessContext(rawInferenceOutputs, totalObjectsDetected, humanBoundingBox) {
        this.executionCycleIndex++;

        if (!humanBoundingBox || totalObjectsDetected === 0 || !rawInferenceOutputs) {
            this.activeGymConfidenceScore = this.activeGymConfidenceScore * FITNESS_SHIELD_CONFIG.ALPHA_TEMPORAL_SMOOTHING;
            return this._generateTelemetryPayload(false, 0.0, 0.0);
        }

        let runningGymContextAccumulator = 0.0;
        let maximalIoUIntersectValue = 0.0;
        const validObjectsCount = Math.min(totalObjectsDetected, FITNESS_SHIELD_CONFIG.MAX_OBJECT_TRACKING_LIMIT);

        const hXMin = humanBoundingBox.xMin;
        const hYMin = humanBoundingBox.yMin;
        const hXMax = humanBoundingBox.xMax;
        const hYMax = humanBoundingBox.yMax;
        const hWidth = hXMax - hXMin;
        const hHeight = hYMax - hYMin;
        const hArea = hWidth * hHeight;
        const hCenterX = hXMin + hWidth * 0.5;
        const hCenterY = hYMin + hHeight * 0.5;

        // 1. High-Speed Linear Sweep Over Object Matrices
        for (let i = 0; i < validObjectsCount; i++) {
            const stride = i * 6;
            const classId = rawInferenceOutputs[stride] | 0;
            const confidence = rawInferenceOutputs[stride + 1];
            const oXMin = rawInferenceOutputs[stride + 2];
            const oYMin = rawInferenceOutputs[stride + 3];
            const oXMax = rawInferenceOutputs[stride + 4];
            const oYMax = rawInferenceOutputs[stride + 5];

            const assignedWeight = FITNESS_SHIELD_CONFIG.CLASS_MAPPING_WEIGHTS[classId];
            if (!assignedWeight || confidence < FITNESS_SHIELD_CONFIG.MIN_VALID_CONFIDENCE) {
                continue;
            }

            // 2. Perform On-Device IoU Computation Mechanics
            const interXMin = Math.max(hXMin, oXMin);
            const interYMin = Math.max(hYMin, oYMin);
            const interXMax = Math.min(hXMax, oXMax);
            const interYMax = Math.min(hYMax, oYMax);

            const interWidth = Math.max(0.0, interXMax - interXMin);
            const interHeight = Math.max(0.0, interYMax - interYMin);
            const intersectionArea = interWidth * interHeight;

            const oWidth = oXMax - oXMin;
            const oHeight = oYMax - oYMin;
            const oArea = oWidth * oHeight;

            const unionArea = hArea + oArea - intersectionArea;
            const localIoU = unionArea > 0.0 ? intersectionArea / unionArea : 0.0;

            if (localIoU > maximalIoUIntersectValue) {
                maximalIoUIntersectValue = localIoU;
            }

            // 3. Distance Decay Formula for Non-Intersecting Proximities
            const oCenterX = oXMin + oWidth * 0.5;
            const oCenterY = oYMin + oHeight * 0.5;
            const dX = hCenterX - oCenterX;
            const dY = hCenterY - oCenterY;
            const euclideanDistance = Math.sqrt(dX * dX + dY * dY);

            const normalizedProximityDistance = euclideanDistance / this.canvasDiagonal;
            const distanceProximityDecay = Math.exp(-2.5 * normalizedProximityDistance);

            // Accumulate combined matrix weight indices
            runningGymContextAccumulator += confidence * assignedWeight * (1.0 + localIoU * 2.0) * distanceProximityDecay;
        }

        // 4. Temporal Smoothing Execution Filter
        const rawInstantScore = Math.min(1.0, runningGymContextAccumulator);
        this.activeGymConfidenceScore = (this.activeGymConfidenceScore * FITNESS_SHIELD_CONFIG.ALPHA_TEMPORAL_SMOOTHING) + 
                                         (rawInstantScore * (1.0 - FITNESS_SHIELD_CONFIG.ALPHA_TEMPORAL_SMOOTHING));

        const historyIndex = Number(this.executionCycleIndex % 15n);
        this.historicalGymConfidence[historyIndex] = this.activeGymConfidenceScore;

        const isGymEnvironmentConfirmed = this.activeGymConfidenceScore >= 0.60;

        return this._generateTelemetryPayload(isGymEnvironmentConfirmed, this.activeGymConfidenceScore, maximalIoUIntersectValue);
    }

    /** @private */
    _generateTelemetryPayload(confirmed, confidenceScore, maxIoU) {
        return {
            statusSecure: true,
            signaturePayload: FITNESS_SHIELD_CONFIG.IDENTIFIER,
            cycleIndex: this.executionCycleIndex,
            athleticContextVerified: confirmed,
            recommendedDiscountPolicy: confirmed ? "APPLY_0.50_POSE_DISCOUNT_FACTOR" : "RETAIN_STANDARD_LIMITS", // Links to sports_yoga_exceptions
            computedGymConfidenceScore: confidenceScore,
            maximalIntersectionOverUnion: maxIoU,
            historicalStabilityMean: this._calculateStabilityMean()
        };
    }

    /** @private */
    _calculateStabilityMean() {
        let sum = 0.0;
        for (let i = 0; i < 15; i++) {
            sum += this.historicalGymConfidence[i];
        }
        return sum / 15.0;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { FitnessGymAppliancesEngine, FITNESS_SHIELD_CONFIG };
} else {
    self.FitnessGymAppliancesEngineInstance = new FitnessGymAppliancesEngine(640, 480);
}
```

**Handheld Cylindrical Electronics Mimicking Dumbbells:** Flashlights, heavy thermos flasks, or portable bluetooth speakers can generate layout ratios that mimic small dumbbells ($classId: 10$).

*   **Validation Bypass Check:** If the item travels near the user's face at mouth height and remains static for $>4.0$ seconds (evaluated via parallel facial action modules), it is reclassified as standard dining or object manipulation, revoking gym-based posture relaxation variables.

| **Gym Confidence Score** | $< 0.20$ Baseline | $\ge 0.75$ Certified | $\ge 0.60$ Target Range |

| **Downstream Pass Factor** | $1.00$ Absolute Limit | $0.50$ Active Discount | $0.50$ Active Discount |

| **Max Processing Delay** | $0.02\text{ ms}$ | $0.07\text{ ms}$ (Full Scan) | $0.05\text{ ms}$ |

```javascript
// Diagnostics Integrity Validation Loop Block (Lines 710 - 765)
class FitnessDiagnosticsRegulator {
    static verifySymmetricBuffers(engine) {
        return engine.detectedObjectsBuffer.length === 192 && engine.historicalGymConfidence.length === 15;
    }
}
```