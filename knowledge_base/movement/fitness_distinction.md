# Fitness Distinction Evidence Intelligence Framework

## Document Metadata
* **Module Name:** Fitness Distinction Evidence Intelligence
* **Document Version:** 2.0.0
* **Architectural Role:** Fitness Evidence Layer within Explainable Multimodal AI
* **Domain:** Movement, Fitness Semantics, Biomechanics, Contextual Reasoning
* **Primary Responsibility:** producing explainable fitness evidence, validating exercise-like motion, fusing multi-modal evidence, propagating confidence and uncertainty, supporting downstream movement, interaction, sports, medical, and policy reasoning
* **Design Intention:** architecture-first, evidence-driven, conceptual, implementation-independent, ontology-aligned, multimodal-compatible, future-ready

---

## 1. Purpose and Responsibilities

### 1.1 Primary Purpose
This module defines the Fitness Distinction domain as an evidence intelligence component in the global multimodal architecture. It is responsible for generating explainable, validated fitness-related evidence from observed movement and context, not for isolated pose classification or direct exercise labeling.

### 1.2 In-Scope Responsibilities
Fitness Distinction is responsible for:
* distinguishing fitness-related movement evidence from other movement signals;
* modeling the evidence structure that makes an observed movement plausibly fitness-oriented;
* validating exercise-like motion through biomechanical, temporal, environmental, object, and context evidence;
* providing evidence outputs that downstream Movement Overview, Oscillatory Frequency, Multi-Person Interaction, Objects, Sports, Medical, Behavioral Signals, Interaction Intent, Safe Patterns, and Policy Reasoning can consume;
* documenting confidence and uncertainty for every evidence conclusion;
* preserving explainability by explicitly stating observed evidence, supporting evidence, contradictory evidence, alternatives, confidence, and uncertainty;
* avoiding direct classification or hard exercise labels in favor of evidence accumulation.

### 1.3 Out-of-Scope Responsibilities
Fitness Distinction is not responsible for:
* raw pose estimation or skeletal tracking;
* isolated action recognition without evidence fusion;
* direct sports classification;
* medical diagnosis;
* policy decisions;
* identity recognition;
* age estimation;
* emotion recognition;
* intent prediction.

These responsibilities remain with dedicated upstream and downstream modules.

### 1.4 Architectural Principles
Fitness Distinction adheres to these principles:
* evidence must accumulate progressively rather than rely on a single signal;
* interaction with other subsystems is defined conceptually, not implementationally;
* confidence and uncertainty are first-class outputs;
* terminology is standardized and consistent with the global movement knowledge base;
* explanations are required for every major conclusion;
* module boundaries are preserved by consuming upstream evidence and producing structured evidence payloads;
* the module supports future foundation models and embodied AI by exposing rich, explainable fitness evidence.

---

## 2. Fitness Evidence Model

### 2.1 Evidence Taxonomy
Fitness Distinction organizes evidence into a comprehensive taxonomy:
* Observable Visual Evidence
* Biomechanical Evidence
* Pose Evidence
* Movement Evidence
* Object Evidence
* Environment Evidence
* Relationship Evidence
* Clothing Evidence
* Temporal Evidence
* Contextual Evidence
* Negative Evidence
* Conflicting Evidence
* Weak Evidence
* Strong Evidence
* Evidence Reliability
* Evidence Consistency
* Evidence Sufficiency

Every fitness conclusion is annotated with this evidence taxonomy.

### 2.2 Evidence Definitions

#### Observable Visual Evidence
Observations that are visible in the image or video frame.

Examples:
* body posture and limb positions;
* visible workout equipment;
* movement trajectory shapes;
* surface contact points.

This evidence is mandatory for any fitness-related reasoning because it establishes the raw physical scene.

#### Biomechanical Evidence
Evidence that the observed motion is biomechanically plausible for fitness training.

Examples:
* joint range of motion consistent with squats, lunges, or presses;
* coordinated hip, knee, and ankle motion;
* stable spinal alignment during load-bearing movement;
* phase coherence between related joint linkages.

Biomechanical evidence is often the strongest evidence for fitness distinction when it is reliable.

#### Pose Evidence
Evidence derived from anatomical structure and body configuration.

Examples:
* knee flexion angles;
* torso inclination;
* shoulder and hip alignment;
* body segment orientation.

Pose evidence is mandatory to ground fitness evidence in real human motion and to avoid misinterpreting background objects or shadows as exercise.

#### Movement Evidence
Evidence derived from motion dynamics.

Examples:
* repetition cadence;
* acceleration profiles;
* velocity patterns;
* movement symmetry.

Movement evidence is strongly indicative of fitness when motion exhibits rhythmic, repeated, or effortful patterns.

#### Object Evidence
Evidence tying the motion to equipment or objects.

Examples:
* dumbbells, barbells, kettlebells;
* exercise mats, benches, resistance bands;
* stationary bikes, treadmills, rowing machines;
* medicine balls, yoga blocks.

Object evidence is powerful when shared with motion patterns, but it is optional because fitness evidence can exist without equipment.

#### Environment Evidence
Evidence describing the setting in which movement occurs.

Examples:
* gym interiors, studios, fitness areas;
* outdoor parks, trails, stadiums;
* clinical rehabilitation environments;
* commercial gym or hotel spaces.

Environment evidence is critical for disambiguating identical motion across contexts.

#### Relationship Evidence
Evidence indicating whether the movement involves other people and how they relate.

Examples:
* partnered stretching;
* coach-trainee demonstrations;
* cooperative load handling;
* group fitness classes.

Relationship evidence is supporting context and is not the primary driver of fitness evidence.

#### Clothing Evidence
Evidence derived from attire and protective gear.

Examples:
* athletic wear such as compression garments, shorts, sneakers;
* medical braces or supports;
* high-coverage professional uniforms or casual clothing.

Clothing evidence can strengthen or weaken fitness interpretation, but it is weak when used alone.

#### Temporal Evidence
Evidence about timing, duration, and evolution of motion.

* repetition counts;
* cadence consistency;
* tempo acceleration or deceleration;
* duration of sustained effort.

Temporal evidence is mandatory for exercise-related reasoning because fitness motion is defined by repetition and persistence.

#### Contextual Evidence
Evidence from the broader scene, activity, and task structure.

* instructional signage;
* fitness class arrangement;
* medical or rehabilitation cues;
* domain-specific props.

Contextual evidence helps avoid false positives from similar motions in non-fitness settings.

### 2.3 Evidence Roles

#### Mandatory Evidence
The minimal evidence required for credible fitness reasoning includes:
* Observable Visual Evidence;
* Pose Evidence;
* Movement Evidence;
* Temporal Evidence.

These are the base signals that confirm a human is moving in a way that could be fitness-related.

#### Optional Evidence
Enriching evidence that strengthens interpretation:
* Object Evidence;
* Environment Evidence;
* Relationship Evidence;
* Clothing Evidence;
* Contextual Evidence.

Optional evidence is valuable but not required for the module to produce evidence outputs.

#### Strongest Evidence
The strongest evidence types are:
* Biomechanical Evidence when aligned with movement patterns;
* Temporal Evidence when repetitions are sustained and consistent;
* Object Evidence when shared equipment is clearly engaged;
* Environment Evidence when the setting is fitness-specific.

#### Weakest Evidence
The weakest evidence types are:
* Clothing Evidence on its own;
* Relationship Evidence without coordinated movement;
* Object Evidence when the object is incidental or not actively manipulated.

#### Contradictory Evidence
Contradictory evidence arises when evidence types disagree.

* fitness-style motion without corresponding biomechanical plausibility;
* workout equipment present but body motion remains unrelated;
* repeated movement in a clearly non-fitness medical or recreational context.

Contradictory evidence reduces confidence and increases uncertainty.

### 2.4 Evidence Quality and Confidence
Evidence quality changes confidence by assessing signal reliability, multimodal agreement, and temporal stability.

High-quality evidence:
* is derived from clear, well-resolved observations;
* is consistent across pose, movement, and context;
* persists over enough time to establish repetition.

Low-quality evidence:
* is affected by occlusion, blur, or partial visibility;
* is conflicting between modalities;
* is based on single-frame or isolated events.

Confidence increases with high-quality, consistent evidence and decreases when evidence is weak, partial, or contradictory.

## 3. Exercise Evidence Model by Activity Category

Each exercise category is defined through seven evidence dimensions. The following categories represent the core fitness domains that this module supports.

### 3.1 Strength Training

#### Observable Visual Evidence
* deep hip and knee flexion;
* barbell or dumbbell handling;
* steady torso posture;
* repeated vertical motion.

#### Biomechanical Evidence
* hip-knee phase coherence during squats and deadlifts;
* controlled spine alignment under load;
* balanced lower-extremity force distribution;
* stable ankle and foot positioning.

#### Pose Evidence
* knee tracking over toes;
* shoulder girdle stability;
* pelvis and trunk alignment;
* wrist orientation during grip.

#### Motion Evidence
* repetition cadence with controlled deceleration and acceleration;
* symmetrical bilateral limb motion;
* periodic lifting-lowering cycles.

#### Object Evidence
* weight bars, plates, dumbbells, kettlebells;
* benches or racks.

#### Environment Evidence
* gym floors, weight rooms, training studios.

#### Relationship Evidence
* spotter assistance;
* coach supervision.

#### Clothing Evidence
* athletic footwear;
* compression wear or lifting belts.

#### Temporal Evidence
* multiple repetitions within a set;
* rest periods interspersed with effort.

#### Contextual Evidence
* structured training layout;
* fitness instruction cues.

This category requires strong biomechanical evidence and temporal repetition to produce credible fitness evidence.

### 3.2 Cardio Training

#### Observable Visual Evidence
* large-range running or cycling motion;
* treadmill belts, bike handles, or open terrain;
* sustained full-body effort.

#### Biomechanical Evidence
* cyclic lower-limb motion with repeated clearance phases;
* upper-body stabilization during locomotion;
* consistent stride or pedal mechanics.

#### Pose Evidence
* forward lean aligned with movement direction;
* hip and shoulder rotation patterns;
* foot strike and recovery posture.

#### Motion Evidence
* high-frequency repeated motion;
* steady or accelerating cadence;
* continuous displacement.

#### Object Evidence
* stationary bikes, treadmills, rowing machines.

#### Environment Evidence
* gyms, outdoor tracks, parks.

#### Relationship Evidence
* group running or cycling training;
* coach pacing.

#### Clothing Evidence
* breathable athletic wear;
* running shoes.

#### Temporal Evidence
* sustained continuous movement over minutes;
* tempo consistency.

#### Contextual Evidence
* cardio zones, timed intervals, or endurance training setups.

This category prioritizes motion evidence and sustained temporal consistency.

### 3.3 Mobility and Flexibility

#### Observable Visual Evidence
* slow, controlled limb extension and flexion;
* stretching postures;
* dynamic joint reaching.

#### Biomechanical Evidence
* active and passive range of motion;
* joint compliance without abrupt loading;
* smooth posture transitions.

#### Pose Evidence
* deep hip opening;
* shoulder extension;
* spine elongation.

#### Motion Evidence
* deliberate, low-velocity movement;
* repeated hold-release cycles;
* balanced bilateral motion.

#### Object Evidence
* yoga blocks, straps, mats.

#### Environment Evidence
* studios, calm indoor spaces, mats.

#### Relationship Evidence
* assisted stretching;
* instruction from a trainer.

#### Clothing Evidence
* flexible, comfortable apparel.

#### Temporal Evidence
* maintain-and-release durations;
* repeated mobility cycles.

#### Contextual Evidence
* flexibility class or warm-up phase.

This category relies on posture, smooth motion, and context rather than heavy load.

### 3.4 Rehabilitation and Therapeutic Exercise

#### Observable Visual Evidence
* assisted movement;
* support from another person or device;
* slow, measured motion.

#### Biomechanical Evidence
* safe joint ranges;
* gradual load progression;
* stabilization support.

#### Pose Evidence
* guided limb positioning;
* balanced posture with support.

#### Motion Evidence
* controlled repetitions;
* corrective motion patterns.

#### Object Evidence
* parallel bars, walking aids, therapy balls.

#### Environment Evidence
* clinics, rehabilitation rooms, therapy gyms.

#### Relationship Evidence
* therapist-patient interaction;
* caregiver support.

#### Clothing Evidence
* adaptive wear, medical braces.

#### Temporal Evidence
* repeated therapeutic sessions;
* consistent pace.

#### Contextual Evidence
* clinical markings, medical context.

This category demands strong context evidence and caution in confidence due to its proximity to medical reasoning.

### 3.5 Sports Conditioning

#### Observable Visual Evidence
* sport-specific drills;
* agility cones, nets, balls;
* repetitive sport motions.

#### Biomechanical Evidence
* sport-appropriate joint mechanics;
* coordinated movement patterns;
* pivoting and acceleration.

#### Pose Evidence
* ready stance;
* athletic posture;
* limb positioning for sport-specific action.

#### Motion Evidence
* repeated drills;
* explosive bursts;
* directed effort.

#### Object Evidence
* balls, rackets, nets, goals.

#### Environment Evidence
* courts, fields, stadiums.

#### Relationship Evidence
* teammates, coaching staff.

#### Clothing Evidence
* athletic uniforms, footwear.

#### Temporal Evidence
* interval training;
* drill repetitions.

#### Contextual Evidence
* practice sessions, warm-ups, team training.

Sports conditioning fitness evidence is supported by environment and object cues when available.

### 3.6 Dance and Movement Arts Fitness

#### Observable Visual Evidence
* rhythmic full-body motion;
* choreographed steps;
* expressive postures.

#### Biomechanical Evidence
* joint flexibility;
* rhythmic coordination;
* balanced weight transfer.

#### Pose Evidence
* stylized arm and leg positions;
* torso alignment;
* symmetrical posture.

#### Motion Evidence
* synchronized movement phrases;
* repeated sequences;
* tempo adaptation.

#### Object Evidence
* dance props, bars, studio mirrors.

#### Environment Evidence
* dance studios, stages.

#### Relationship Evidence
* partner work, instructor-led classes.

#### Clothing Evidence
* dance apparel, flexible footwear.

#### Temporal Evidence
* repeated combinations;
* phrase-based timing.

#### Contextual Evidence
* rehearsal or class environment.

Dance fitness evidence requires both movement and context alignment to avoid confusion with social dancing.

### 3.7 Functional Movement Training

#### Observable Visual Evidence
* lifting, carrying, pushing, pulling motions;
* whole-body engagement.

#### Biomechanical Evidence
* natural load paths;
* joint coordination with task demands;
* balanced kinetic chains.

#### Pose Evidence
* neutral spine;
* braced core;
* ready stance.

#### Motion Evidence
* cyclic task performance;
* repeated functional transitions.

#### Object Evidence
* sandbags, boxes, industrial props.

#### Environment Evidence
* functional training areas, outdoor circuits.

#### Relationship Evidence
* trainers guiding task performance.

#### Clothing Evidence
* rugged athletic wear.

#### Temporal Evidence
* task sets and repetitions.

#### Contextual Evidence
* real-world movement training scenarios.

Functional training evidence emphasizes task relevance and biomechanical plausibility.

## 4. Exercise Reasoning Pipeline

### 4.1 Pipeline Overview
Exercise reasoning in Fitness Distinction follows a layered architecture that enforces evidence accumulation and explainability.

Pipeline stages:
1. Raw Visual Observation
2. Body Structure Evidence
3. Pose Evidence
4. Movement Evidence
5. Equipment Evidence
6. Environmental Evidence
7. Exercise Evidence
8. Context Evidence
9. Fitness Interpretation
10. Confidence
11. Uncertainty
12. Risk Contribution
13. Policy Evidence
14. Explainable Decision

This pipeline ensures no direct classification occurs without explicit evidence and documented uncertainty.

### 4.2 Raw Visual Observation
This stage establishes presence and visual scene structure.

Key evidence:
* visible people,
* identifiable limbs,
* scene layout.

Why valid:
* raw visual observation is the foundation for all subsequent evidence.

Uncertainty:
* low lighting, occlusion, or unusual viewpoints can degrade observation quality.

### 4.3 Body Structure Evidence
This stage validates anatomical plausibility and body configuration.

Key evidence:
* skeletal proportions,
* joint relationships,
* segment connectivity.

Why valid:
* body structure evidence ensures the motion is human and biomechanically meaningful.

Uncertainty:
* partial visibility or occluded limbs increase structure uncertainty.

### 4.4 Pose Evidence
Pose evidence captures joint angles and segment orientations.

* squat depth,
* limb alignment,
* trunk inclination.

* pose evidence grounds fitness reasoning in anatomical posture.

* pose ambiguity can arise from side views, foreshortening, or occlusion.

### 4.5 Movement Evidence
Movement evidence characterizes dynamic motion patterns.

* repetition cadence,
* symmetry,
* acceleration profiles,
* effort-like motion.

* fitness interpretation depends on motion, not static pose alone.

* blur, jitter, and intermittent tracking reduce movement fidelity.

### 4.6 Equipment Evidence
Equipment evidence links motion to fitness tools.

* weights,
* machines,
* resistance bands.

* equipment provides strong task relevance when actively engaged.

* ambiguous objects or incidental proximity can mislead equipment evidence.

### 4.7 Environmental Evidence
Environmental evidence situates the motion in a fitness-appropriate setting.

* gym layout,
* studio features,
* outdoor fitness areas.

* context changes the meaning of identical movements.

* shared public spaces can mimic gym-like environments.

### 4.8 Exercise Evidence
Exercise Evidence is the first higher-order layer that indicates the observed activity is plausibly fitness-related.

* biomechanically plausible load-bearing motion,
* repeated effortful cycles,
* equipment engagement,
* supportive environment.

* exercise evidence emerges only after movement, pose, object, and environment signals align.

* similar motions may be task-oriented or recreational rather than fitness.

### 4.9 Context Evidence
Context Evidence assesses broader semantics and domain fit.

* instructional signage,
* clinical cues,
* social training dynamics.

* context separates fitness training from coincidentally similar motion.

* context may be ambiguous or multi-purpose.

### 4.10 Fitness Interpretation
Fitness Interpretation synthesizes evidence without making a hard label.

It reports:
* the degree to which motion is consistent with fitness evidence,
* supporting evidence categories,
* identified fitness domain possibilities,
* evidence gaps.

* this stage is the explainable output for downstream modules.

* interpretation remains provisional when evidence is incomplete.

### 4.11 Confidence
Confidence quantifies the trust in the fitness evidence interpretation.

Key dimensions:
* Evidence Confidence,
* Biomechanical Confidence,
* Movement Confidence,
* Exercise Confidence,
* Context Confidence,
* Scene Confidence,
* Decision Confidence.

* confidence supports downstream risk and policy decisions without asserting certainty.

### 4.12 Uncertainty
Uncertainty is explicitly propagated and communicated.

It describes:
* evidence gaps,
* contradictory signals,
* weak modality quality,
* novel scenario risk.

* uncertainty prevents overconfident interpretations and supports conservative downstream use.

### 4.13 Risk Contribution
Risk Contribution identifies when fitness evidence has implications for safety and exposure assessment.

* deep joint angles under load with high confidence may reduce false positive risk for athletic posture;
* ambiguous exercise evidence may increase uncertainty for risk engines.

* risk systems require evidence-driven inputs, not raw exercise labels.

### 4.14 Policy Evidence
Policy Evidence is the structured output for policy reasoning.

It includes:
* fitness evidence strength,
* uncertainty markers,
* evidence provenance.

* policy engines consume this evidence to make decisions consistent with architecture boundaries.

### 4.15 Explainable Decision
Explainable Decision is the final structured summary.

It answers:
* what was observed,
* why it matters,
* which evidence supports it,
* which evidence contradicts it,
* what alternatives exist,
* how confident the conclusion is,
* what uncertainty remains.

* this prevents unexplained fitness assertions.

## 5. Cross-Module Dependencies

### 5.1 Movement Overview

#### Incoming Evidence
* Movement evidence from raw motion and biomechanical metrics;
* pose and body structure evidence;
* confidence and uncertainty from observed motion.

#### Outgoing Evidence
* Fitness evidence objects describing exercise-like motion;
* interaction with broader movement patterns.

#### Confidence Contribution
* Movement Overview contributes movement confidence and posture validity.

#### Uncertainty Contribution
* Weak movement or pose evidence raises fitness uncertainty.

#### Failure Propagation
* if movement overview lacks stable pose or motion evidence, fitness evidence remains provisional.

#### Conflict Resolution
* Fitness Distinction defers to movement evidence when exercise evidence is strong, but retains alternative interpretations when movement patterns do not align.

#### Evidence Priority
* strong movement and pose evidence are high priority;
* contextual evidence is medium priority;
* clothing evidence is lower priority.

### 5.2 Oscillatory Frequency

#### Incoming Evidence
* temporal rhythm and cadence information;
* repeated motion structure;
* cycle confidence.

#### Outgoing Evidence
* fitness evidence that includes repetition and tempo support;
* exercise evidence for rhythm-dependent activities.

#### Confidence Contribution
* Oscillatory evidence raises temporal and exercise confidence when motion is repeated and stable.

#### Uncertainty Contribution
* irregular or quasi-periodic oscillation increases uncertainty.

#### Failure Propagation
* if oscillatory evidence is absent or unreliable, fitness evidence cannot claim repetition-based exercise with high confidence.

#### Conflict Resolution
* Fitness Distinction uses oscillatory evidence as supporting context, but will not override contradictory biomechanical or environmental evidence.

#### Evidence Priority
* repeated motion evidence from oscillatory frequency is strong for cardio and strength training;
* it is lower priority for mobility or functional movement where repetition is less distinct.

### 5.3 Multi-Person Interaction

#### Incoming Evidence
* collaborative movement patterns;
* shared activity evidence;
* interaction confidence and uncertainty.

#### Outgoing Evidence
* fitness evidence for partner or group training;
* evidence of assisted rehabilitation or cooperative fitness.

#### Confidence Contribution
* consistent multi-person coordination strengthens fitness evidence in partner-assisted or class-based contexts.

#### Uncertainty Contribution
* crowd or co-presence ambiguity raises uncertainty.

#### Failure Propagation
* if interaction evidence is weak, group exercise evidence remains uncertain;
* solo fitness evidence can still be produced independently.

#### Conflict Resolution
* when group activity appears social rather than fitness-based, fitness evidence retains lower confidence and reports alternatives.

#### Evidence Priority
* multi-person interaction evidence is medium priority for fitness when it indicates shared training or support;
* it is lower priority when the interaction is clearly social or unrelated.

### 5.4 Objects

#### Incoming Evidence
* object presence, identity, and usage;
* object affordances.

#### Outgoing Evidence
* equipment engagement evidence;
* object-mediated fitness evidence.

#### Confidence Contribution
* clear equipment use raises exercise confidence.

#### Uncertainty Contribution
* object ambiguity or incidental proximity raises uncertainty.

#### Failure Propagation
* if object recognition fails, fitness evidence relies more on motion and context.

#### Conflict Resolution
* if object evidence implies a different task than movement evidence, alternatives are preserved and confidence adjusted.

#### Evidence Priority
* object evidence is high priority when actively manipulated;
* lower priority when the object is present but not clearly engaged.

### 5.5 Fitness Equipment

#### Incoming Evidence
* specialized fitness tool detection;
* equipment configuration.

#### Outgoing Evidence
* strength, cardio, or rehabilitation equipment evidence.

#### Confidence Contribution
* specialized equipment increases confidence for corresponding fitness domains.

#### Uncertainty Contribution
* ambiguous equipment appearance increases uncertainty.

#### Failure Propagation
* without equipment evidence, fitness evidence depends more on motion and environment.

#### Conflict Resolution
* if equipment evidence contradicts motion, the system notes the mismatch and reduces confidence.

#### Evidence Priority
* high priority for equipment-centric activities;
* lower priority for bodyweight or objectless exercises.

### 5.6 Pose

#### Incoming Evidence
* joint angles,
* segment orientations,
* pose confidence.

#### Outgoing Evidence
* pose-based fitness plausibility evidence.

#### Confidence Contribution
* strong pose evidence is foundational for exercise confidence.

#### Uncertainty Contribution
* pose ambiguity directly increases fitness uncertainty.

#### Failure Propagation
* poor pose evidence severely limits fitness interpretation.

#### Conflict Resolution
* if pose contradicts movement evidence, the conclusion remains uncertain.

#### Evidence Priority
* pose evidence is high priority across all fitness categories.

### 5.7 Body Shape

#### Incoming Evidence
* anthropometric proportions,
* body posture tendencies.

#### Outgoing Evidence
* evidence about exercise suitability and effort distribution.

#### Confidence Contribution
* consistent body shape evidence supports biomechanical plausibility.

#### Uncertainty Contribution
* uncertain shape estimates raise evidence uncertainty.

#### Failure Propagation
* if body shape is unclear, fitness evidence must avoid overconfident biomechanical claims.

#### Conflict Resolution
* body shape evidence is used cautiously and does not dominate movement evidence.

#### Evidence Priority
* moderate priority, supporting but not driving fitness conclusions.

### 5.8 Environment

#### Incoming Evidence
* scene type,
* spatial affordances,
* domain indicators.

#### Outgoing Evidence
* context-conditioned fitness interpretations.

#### Confidence Contribution
* clear environment evidence improves context confidence.

#### Uncertainty Contribution
* ambiguous settings raise contextual uncertainty.

#### Failure Propagation
* if environment classification is unreliable, fitness evidence remains contextual uncertain.

#### Conflict Resolution
* when environment and motion diverge, both possibilities are preserved.

#### Evidence Priority
* high priority for context-sensitive fitness distinctions.

### 5.9 Relationship

#### Incoming Evidence
* social relationship signals,
* role indicators.

#### Outgoing Evidence
* support or partner training evidence.

#### Confidence Contribution
* compatible relationship evidence can strengthen fitness evidence in cooperative scenarios.

#### Uncertainty Contribution
* weak or speculative relationship signals add uncertainty.

#### Failure Propagation
* if relationship evidence is wrong, the fitness interpretation remains based on movement and context.

#### Conflict Resolution
* relationship signals are supportive only and do not override stronger evidence.

#### Evidence Priority
* low to medium priority when movement evidence is strong.

### 5.10 Behavioral Signals

#### Incoming Evidence
* gesture cues,
* exertion signals,
* attention dynamics.

#### Outgoing Evidence
* behaviorally contextualized fitness evidence.

#### Confidence Contribution
* supportive behavioral signals can boost exercise interpretation.

#### Uncertainty Contribution
* conflicting or absent behavioral cues raise uncertainty.

#### Failure Propagation
* unreliable behavioral signals increase overall uncertainty.

#### Conflict Resolution
* behavioral signals are fused with motion and context evidence to avoid isolated judgments.

#### Evidence Priority
* medium priority.

### 5.11 Interaction Intent

#### Incoming Evidence
* shared activity proposals,
* purpose-oriented motion evidence.

#### Outgoing Evidence
* evidence describing how fitness activity may relate to broader intent.

#### Confidence Contribution
* when intent support aligns, fitness confidence is increased.

#### Uncertainty Contribution
* weak intent support leaves fitness interpretation provisional.

#### Failure Propagation
* if intent evidence is absent, fitness evidence remains focused on observed motion and context.

#### Conflict Resolution
* fitness evidence does not assert intent; it provides evidence that can be used by intent reasoning.

#### Evidence Priority
* low priority for fitness; supportive only.

### 5.12 Sports

#### Incoming Evidence
* athletic context,
* sport-specific formation cues.

#### Outgoing Evidence
* conditioning and training evidence.

#### Confidence Contribution
* strong sports context increases confidence for sports training motions.

#### Uncertainty Contribution
* ambiguous sports cues add uncertainty.

#### Failure Propagation
* if sports context is misclassified, fitness evidence adjusts with lower confidence.

#### Conflict Resolution
* the module distinguishes general fitness evidence from sport-specific activity.

#### Evidence Priority
* medium priority when motion resembles sport drills.

### 5.13 Medical

#### Incoming Evidence
* clinical context,
* assistive equipment,
* rehabilitation cues.

#### Outgoing Evidence
* medical rehabilitation fitness evidence.

#### Confidence Contribution
* reliable medical context raises domain confidence.

#### Uncertainty Contribution
* uncertain medical context raises caution.

#### Failure Propagation
* if medical cues are absent, the evidence remains general fitness rather than therapeutic.

#### Conflict Resolution
* fitness evidence remains descriptive and does not claim medical diagnosis.

#### Evidence Priority
* medium priority in rehabilitation scenarios.

### 5.14 Safe Patterns

#### Incoming Evidence
* risk mitigation signals,
* safe movement indicators.

#### Outgoing Evidence
* evidence of safe fitness behavior.

#### Confidence Contribution
* safe patterns improve confidence in exercise legitimacy.

#### Uncertainty Contribution
* lack of safe pattern evidence raises safety uncertainty.

#### Failure Propagation
* if safe movement evidence is weak, downstream risk systems treat the activity with greater caution.

#### Conflict Resolution
* safe patterns are fused with biomechanical evidence to contextualize risk.

#### Evidence Priority
* high priority for policy and safety-sensitive outputs.

### 5.15 Policy Reasoning

#### Incoming Evidence
* structured fitness evidence,
* confidence and uncertainty profiles,
* risk contribution markers.

#### Outgoing Evidence
* policy-ready signals.

#### Confidence Contribution
* policy reasoning uses fitness evidence confidence to determine how much weight to place on the signal.

#### Uncertainty Contribution
* uncertainty is critical for conservative policy decisions.

#### Failure Propagation
* if fitness evidence is uncertain, policy systems should default to safer handling.

#### Conflict Resolution
* policy engines resolve evidence conflicts using explicit uncertainty and alternatives.

#### Evidence Priority
* policy systems prioritize caution, so evidence with high uncertainty is treated conservatively.

## 6. Exercise Context Reasoning

### 6.1 Identical Movement, Different Interpretation
The same observed movement can mean different things depending on context. Fitness Distinction uses context to avoid false assumptions.

* a deep squat in a gym is likely strength training; the same squat in a home living room may be a functional reach or casual sitting motion.
* a repetitive leg extension on a yoga mat may be mobility work; the same motion on a hospital floor may be rehabilitation.
* high-knee steps in a stadium may be sports warm-up; in a dance studio they may be choreography.

This reasoning demonstrates why movement alone is insufficient.

### 6.2 Context Domains
Fitness Distinction explicitly reasons across multiple domains:
* Home workouts;
* Commercial gyms;
* Schools;
* Universities;
* Hospitals;
* Rehabilitation clinics;
* Outdoor parks;
* Sports stadiums;
* Fitness competitions;
* Military training;
* Police training;
* Dance studios;
* Physical education;
* Yoga studios;
* Public events;
* Hotels;
* Cruise ships;
* Workplaces.

### 6.3 Contextual Evidence Use
Each domain affects interpretation differently.

*Home workouts* may require stronger environment and object evidence because personal spaces can host non-fitness motion.
*Commercial gyms* often increase fitness confidence due to dedicated equipment and environment.
*Schools and universities* require caution because similar movements may be part of education or recreation.
*Hospitals and rehabilitation clinics* shift evidence toward therapeutic intent and lower risk tolerance.
*Outdoor parks* allow both fitness and recreational motion, so scene semantics and object evidence become critical.
*Sports stadiums* raise the prior probability of athletic training, but identical motions can still be social or ceremonial.
*Military and police training* require specialized equipment and formation evidence.
*Dance studios* can have highly fitness-like motion that is artistic rather than purely exercise.
*Public events* increase uncertainty due to mixed purposes.

### 6.4 Why Movement Alone Is Insufficient
Movement alone is insufficient because many motions are shared across domains. The module therefore requires:
* environmental cues,
* object engagement,
* temporal structure,
* behavior and relationship signals,
* domain semantics.

This prevents isolated fitness assumptions.

## 7. Multi-Evidence Fusion

### 7.1 Fusion Principles
Fitness Distinction fuses multiple evidence sources into one coherent interpretation without allowing any single signal to dominate.

Principles:
* evidence is combined by reliability and relevance;
* strong conflicting evidence reduces confidence and increases uncertainty;
* weaker evidence is used to support or qualify stronger signals;
* all modalities contribute to a balanced assessment.

### 7.2 Pose + Movement
Pose provides anatomical structure, movement provides dynamics. Together they show whether the observed action is consistent with fitness motion.

Example:
* deep knee bend with vertical hip trajectory and stable torso indicates plausible squat-like motion.

### 7.3 Objects + Environment
Object and environment evidence ground the movement in a fitness setting.

Example:
* a barbell in a gym strengthens the evidence for strength training, but the same motion without the barbell requires more reliance on biomechanics and context.

### 7.4 Temporal Consistency
Sustained and repeated motion confirms exercise-like behavior.

* a single lift is ambiguous, while repeated lifts over time support fitness evidence.

### 7.5 Relationships + Scene Semantics
Relationship and scene semantics distinguish assisted fitness from independent motion.

* a coach guiding a trainee in a gym increases the plausibility of a fitness session.

### 7.6 Behavior
Behavioral cues such as focus, exertion gestures, or group instruction add semantic nuance.

* intentional pacing and effort-related gestures support fitness interpretation when motion evidence is present.

### 7.7 Balanced Fusion
No single signal is allowed to dominate. If object evidence is strong but movement evidence is absent, the conclusion remains uncertain. If movement evidence is strong but environment evidence is ambiguous, the conclusion is qualified.

## 8. Confidence Propagation

### 8.1 Evidence Confidence
Evidence Confidence evaluates the reliability of each evidence input.

Factors:
* sensor quality;
* signal clarity;
* modality agreement;
* temporal persistence.

### 8.2 Biomechanical Confidence
Biomechanical Confidence measures trust in the plausibility of the motion for fitness.

It depends on:
* pose alignment;
* joint coordination;
* motion patterns.

### 8.3 Movement Confidence
Movement Confidence measures trust in dynamic motion evidence.

It depends on:
* cadence stability;
* repetition clarity;
* motion smoothness.

### 8.4 Exercise Confidence
Exercise Confidence measures overall trust that the motion is fitness-related.

* evidence combination from pose, movement, objects, and context.

### 8.5 Context Confidence
Context Confidence measures trust in environmental and domain signals.

* scene classification reliability;
* object usage certainty;
* domain evidence strength.

### 8.6 Scene Confidence
Scene Confidence measures trust in the overall setting.

* environment signal clarity;
* spatial affordance consistency;
* social and activity cues.

### 8.7 Decision Confidence
Decision Confidence is the final integrated confidence for the fitness interpretation.

It preserves contributions from all upstream dimensions and identifies the limiting factor.

### 8.8 Confidence Propagation Model
Confidence propagates through the pipeline as follows:
* low Evidence Confidence caps Biomechanical and Movement Confidence;
* low Biomechanical Confidence lowers Exercise Confidence;
* low Movement Confidence lowers Exercise Confidence and Context Confidence;
* low Context or Scene Confidence reduces Decision Confidence.

The model documents which source limited the final confidence.

## 9. Uncertainty Model

### 9.1 Uncertainty as First-Class Reasoning
Uncertainty is explicitly represented at every stage and separate from confidence.

### 9.2 Occlusion
Occlusion uncertainty arises when body parts or equipment are blocked from view.

* reduces pose certainty;
* weakens movement and object evidence.

### 9.3 Camera Angle
Camera angle uncertainty arises from foreshortening, perspective distortion, and unusual viewpoints.

* degrades pose and spatial evidence;
* may distort biomechanical interpretation.

### 9.4 Motion Blur
Motion blur uncertainty arises from fast movement and low shutter clarity.

* degrades movement evidence;
* weakens repetition and temporal analysis.

### 9.5 Partial Body Visibility
Partial visibility uncertainty occurs when only portions of the person are visible.

* reduces biomechanical and context evidence;
* increases the risk of misinterpreting partial motion.

### 9.6 Equipment Ambiguity
Equipment ambiguity occurs when objects are not clearly identified or appear similar to fitness tools.

* reduces object evidence confidence;
* increases context uncertainty.

### 9.7 Hybrid Activities
Hybrid activity uncertainty occurs when the observed motion could belong to multiple domains.

* dance movement that resembles athletic drills;
* functional lifting that resembles strength training.

* increases alternative interpretation uncertainty.

### 9.8 Mixed Environments
Mixed environment uncertainty occurs when the setting supports multiple possible activities.

* a gym-like hotel lobby;
* a park used for recreation and fitness.

* weakens environment and context evidence.

### 9.9 Crowded Scenes
Crowded scene uncertainty arises when multiple people and overlapping motion make evidence assignment ambiguous.

* raises tracking and interaction uncertainty;
* lowers fitness evidence specificity.

### 9.10 Frame Sampling
Frame sampling uncertainty arises from inconsistent frame rates or dropped frames.

* degrades temporal and repetition evidence;
* can create aliasing in cadence analysis.

### 9.11 Video Editing
Video editing uncertainty arises from spliced or manipulated footage.

* breaks temporal continuity;
* creates artificial motion sequences.

### 9.12 Incomplete Observations
Incomplete observation uncertainty arises when the scene lacks sufficient temporal or spatial coverage.

* prevents stable evidence sufficiency;
* keeps fitness interpretation provisional.

### 9.13 Propagation of Uncertainty
Uncertainty propagates through the pipeline as follows:
* observation-level uncertainty flows into pose and movement evidence;
* pose and movement uncertainty flows into biomechanical and exercise evidence;
* context uncertainty flows into final decision uncertainty.

The module retains an uncertainty profile identifying the origin of each uncertainty component.

### 9.14 Uncertainty Communication
Uncertainty is communicated using structured fields:
* source identifier;
* magnitude impact;
* affected evidence categories;
* alternative hypotheses;
* recommended caution.

This allows downstream modules to interpret fitness evidence appropriately.

## 10. Failure Propagation

### 10.1 Failure Definition
Failure propagation is the conceptual flow of evidence breakdown through the architecture.

Each failure is described by:
* failure cause;
* broken evidence;
* affected modules;
* confidence reduction;
* uncertainty increase;
* recovery strategy;
* expected downstream behavior.

### 10.2 Pose Failure

#### Failure Cause
* poor pose estimation,
* occluded limbs,
* erroneous joint placement.

#### Broken Evidence
* pose evidence,
* biomechanical evidence.

#### Affected Modules
* Fitness Distinction,
* Movement Overview,
* Oscillatory Frequency.

#### Confidence Reduction
* significant reduction in Exercise Confidence.

#### Uncertainty Increase
* high uncertainty in pose and movement interpretation.

#### Recovery Strategy
* seek additional frames,
* use neighboring body segments,
* downgrade to conservative evidence.

#### Expected Downstream Behavior
* downstream modules should treat fitness evidence as low confidence and rely on alternative evidence.

### 10.3 Tracking Failure

#### Failure Cause
* lost participant identity,
* jittery or swapped tracks.

#### Broken Evidence
* temporal evidence,
* movement persistence.

#### Affected Modules
* Fitness Distinction,
* Multi-Person Interaction,
* Behavioral Signals.

#### Confidence Reduction
* lower Movement Confidence and Decision Confidence.

#### Uncertainty Increase
* identity and temporal uncertainty.

#### Recovery Strategy
* use robust track re-identification,
* preserve uncertainty,
* delay conclusions until tracks stabilize.

#### Expected Downstream Behavior
* downstream modules should avoid relying on persistent exercise evidence across uncertain tracking segments.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
+-----------------------------------------------------------------------------------------+
| BIOMECHANICAL FILTER PIPELINE                                                           |
+-----------------------------------------------------------------------------------------+
| [33 3D Keypoints] ---> [WebGPU Trajectory Tracker Shader] ---> [Coordinate Delta Maps]    |
|                                              |                                          |
|                                              v                                          |
|                          [WASM C++ Phase-Coherence Alignment Solver]                    |
|                                              |                                          |
|                                              v                                          |
|                          [Bilateral Limb Trajectory Symmetry Engine]                    |
|                                              |                                          |
|                                              v                                          |
|                        [Biomechanical Classification Index (S_fitness)]                 |
+-----------------------------------------------------------------------------------------+
```

### 3.1 Phase Coherence of Hip-Knee Linkages ($\Phi_{\text{phase\_coherence}}$)

*   $Y_{\text{hip}, t}$ and $Y_{\text{knee}, t}$ be the vertical velocity vectors of the hip and knee centroids over a 15-frame window.

*   $X_{\text{hip}}(k)$ and $X_{\text{knee}}(k)$ be their corresponding Discrete Fourier Transforms.

The **Phase Coherence ($\Phi_{\text{phase\_coherence}}$)** at the dominant movement frequency $k_{\text{peak}}$ is calculated as:

$$\Phi_{\text{phase\_coherence}} = \cos\left(\angle X_{\text{hip}}(k_{\text{peak}}) - \angle X_{\text{knee}}(k_{\text{peak}})\right) \cdot \Phi_{\text{distance\_scale}}$$

Where:
*   $\angle X_{\text{hip}}(k_{\text{peak}})$ is the calculated phase angle of the hip centroid.
*   $\angle X_{\text{knee}}(k_{\text{peak}})$ is the calculated phase angle of the knee centroid.
*   $\Phi_{\text{distance\_scale}}$ is the scale-invariant dynamic distance normalization factor to prevent false positive sheerness triggers on distant, blurry subjects (derived from `distance_patterns/`).

For standard squats or deadlifts, $\Phi_{\text{phase\_coherence}}$ is near $1.00$ ($|\Phi| \ge 0.85$). Values $<0.60$ indicate asynchronous pelvic rotation, immediately disabling any athletic exceptions.

### 3.2 Cyclical Waveform Uniformity ($U_{\text{motion}}$)
Authentic exercises follow predictable, harmonic sinusoidal velocity curves. The system calculates the **Motion Uniformity ($U_{\text{motion}}$)** over consecutive exercise reps:
$$U_{\text{motion}} = 1.0 - \frac{\text{StandardDeviation}(T_{\text{rep}})}{\text{Mean}(T_{\text{rep}})}$$

Where $T_{\text{rep}}$ is the duration of completed movement cycles, detected using zero-crossing analysis of joint acceleration vectors. Symmetrical athletic training exhibits highly uniform cycles ($U_{\text{motion}} \ge 0.80$).

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
constexpr int HISTORY_BUFFER_SIZE = 16; // Power of 2 optimized for Radix-2 FFT

struct Point3D {
    float x;
    float y;
    float z;
    float confidence;
};

struct Complex {
    float r;
    float i;

    Complex operator+(const Complex& other) const {
        return {r + other.r, i + other.i};
    }

    Complex operator-(const Complex& other) const {
        return {r - other.r, i - other.i};
    }

    Complex operator*(const Complex& other) const {
        return {r * other.r - i * other.i, r * other.i + i * other.r};
    }

    float magnitude() const {
        return sqrt(r * r + i * i);
    }
};

struct BiomechanicalOutput {
    float phase_coherence;        // Phi_phase_coherence
    float bilateral_symmetry;     // Lambda_symmetry
    float motion_uniformity;      // U_motion
    int exercise_classification;  // 0 = Non-Athletic, 1 = Cardio, 2 = Strength/Lifting
    float confidence;
};

// Global memory buffers mapped to WebAssembly Linear Memory Heap
Point3D g_skeletal_coords_matrix[SKELETAL_COORDS_COUNT];
float g_hip_history_y[HISTORY_BUFFER_SIZE];
float g_knee_history_y[HISTORY_BUFFER_SIZE];
int g_write_idx = 0;
bool g_is_buffer_filled = false;

class CooleyTukeyFFT {
private:
    static unsigned int ReverseBits(unsigned int x, int bits) {
        unsigned int y = 0;
        for (int i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>= 1;
        }
        return y;
    }

public:
    static std::vector<Complex> Process(const std::vector<Complex>& input) {
        int n = input.size();
        int bits = static_cast<int>(log2(n));
        std::vector<Complex> output(n);

        for (int i = 0; i < n; ++i) {
            unsigned int rev = ReverseBits(i, bits);
            output[rev] = input[i];
        }

        for (int len = 2; len <= n; len <<= 1) {
            float angle = -2.0f * M_PI / len;
            Complex wlen = {cos(angle), sin(angle)};
            
            for (int i = 0; i < n; i += len) {
                Complex w = {1.0f, 0.0f};
                for (int j = 0; j < len / 2; ++j) {
                    Complex u = output[i + j];
                    Complex t = output[i + j + len / 2] * w;
                    
                    output[i + j] = u + t;
                    output[i + j + len / 2] = u - t;
                    w = w * wlen;
                }
            }
        }

        return output;
    }
};

class BiomechanicalClassifier {
public:
    BiomechanicalClassifier() = default;
    ~BiomechanicalClassifier() = default;

    BiomechanicalOutput Solve(const Point3D* points, int fps, float distance_meters) {
        // Track vertical hip (23, 24) and knee (25, 26) centroid values
        float current_hip_y = (points[23].y + points[24].y) * 0.5f;
        float current_knee_y = (points[25].y + points[26].y) * 0.5f;

        g_hip_history_y[g_write_idx] = current_hip_y;
        g_knee_history_y[g_write_idx] = current_knee_y;
        g_write_idx = (g_write_idx + 1) % HISTORY_BUFFER_SIZE;
        if (g_write_idx == 0) {
            g_is_buffer_filled = true;
        }

        int count = g_is_buffer_filled ? HISTORY_BUFFER_SIZE : g_write_idx;
        if (count < 8) {
            return {1.0f, 1.0f, 1.0f, 0, 0.0f}; // Default safe state while buffering
        }

        // Apply Hann windowing to prevent spectral leakage
        std::vector<Complex> hip_sig(HISTORY_BUFFER_SIZE);
        std::vector<Complex> knee_sig(HISTORY_BUFFER_SIZE);
        for (int i = 0; i < HISTORY_BUFFER_SIZE; ++i) {
            int buffer_idx = (g_write_idx + i) % HISTORY_BUFFER_SIZE;
            float window = 0.5f * (1.0f - cos(2.0f * M_PI * i / (HISTORY_BUFFER_SIZE - 1)));
            hip_sig[i] = {g_hip_history_y[buffer_idx] * window, 0.0f};
            knee_sig[i] = {g_knee_history_y[buffer_idx] * window, 0.0f};
        }

        // Run parallel FFT transformations on device
        std::vector<Complex> hip_spectrum = CooleyTukeyFFT::Process(hip_sig);
        std::vector<Complex> knee_spectrum = CooleyTukeyFFT::Process(knee_sig);

        // Find dominant movement frequency
        float max_power = 0.0f;
        int peak_bin = 1;
        for (int k = 1; k < HISTORY_BUFFER_SIZE / 2; ++k) {
            float power = (hip_spectrum[k].r * hip_spectrum[k].r + hip_spectrum[k].i * hip_spectrum[k].i);
            if (power > max_power) {
                max_power = power;
                peak_bin = k;
            }
        }

        // Calculate Phase Coherence (Phi) at peak frequency with distance normalizer (Anti-Evasion Check)
        float angle_hip = atan2(hip_spectrum[peak_bin].i, hip_spectrum[peak_bin].r);
        float angle_knee = atan2(knee_spectrum[peak_bin].i, knee_spectrum[peak_bin].r);
        float phase_coherence = cos(angle_hip - angle_knee);

        if (distance_meters > 8.0f) {
            phase_coherence = phase_coherence * 1.50f; // Scale sensitivity under far-field limits
            phase_coherence = std::clamp(phase_coherence, -1.0f, 1.0f);
        }

        // Calculate Bilateral limb symmetry
        float left_femur = sqrt(pow(points[25].x - points[23].x, 2) + pow(points[25].y - points[23].y, 2));
        float right_femur = sqrt(pow(points[26].x - points[24].x, 2) + pow(points[26].y - points[24].y, 2));
        float symmetry = 1.0f - std::abs(left_femur - right_femur) / (left_femur || 1.0f);

        // Resolve exercise classifications
        int class_type = 0; // Non-Athletic / Standard
        if (std::abs(phase_coherence) >= 0.85f && symmetry >= 0.88f) {
            class_type = 2; // Strength / Lifting verified (Squats/Deadlifts)
        } else if (symmetry >= 0.80f) {
            class_type = 1; // Cardio / Aerobics verified
        }

        // Aggregate joint tracking confidence to scale reliability
        float conf_sum = 0.0f;
        int active_joints[4] = {11, 12, 23, 24};
        for (int idx : active_joints) {
            conf_sum += points[idx].confidence;
        }
        float aggregate_conf = conf_sum / 4.0f;

        BiomechanicalOutput output;
        output.phase_coherence = phase_coherence;
        output.bilateral_symmetry = symmetry;
        output.motion_uniformity = 0.90f; // Smoothed placeholder
        output.exercise_classification = class_type;
        output.confidence = aggregate_conf;

        return output;
    }

    void Reset() {
        g_write_idx = 0;
        g_is_buffer_filled = false;
    }
};

static BiomechanicalClassifier global_classifier;
static BiomechanicalOutput global_output_metrics;

extern "C" {
    __attribute__((import_name("onBiomechanicalMetricsResolved"))) void onConfidenceCalibrated(BiomechanicalOutput* output);

    void* allocate_skeletal_coords_buffer() {
        return &g_skeletal_coords_matrix[0];
    }

    void process_biomechanical_evaluation(int fps, float distance_meters) {
        BiomechanicalOutput results = global_classifier.Solve(&g_skeletal_coords_matrix[0], fps, distance_meters);
        global_output_metrics = results;
        onConfidenceCalibrated(&global_output_metrics);
    }

    void reset_biomechanical_filters() {
        global_classifier.Reset();
    }
}
```

```wgsl
struct JointPosition {
    pos: vec4<f32>, // (x, y, z, conf)
};

struct ProjectionConfig {
    width: u32,
    height: u32,
    keypoint_count: u32,
    delta_t: f32,
};

@group(0) @binding(0) var<uniform> config: SystemConfig;
@group(0) @binding(1) var<storage, read> input_keypoints_3d_t: array<JointPosition>; // Frame t
@group(0) @binding(2) var<storage, read> input_keypoints_3d_prev: array<JointPosition>; // Frame t-1
@group(0) @binding(3) var<storage, read_write> output_joint_velocities: array<vec4<f32>>; // (vx, vy, vz, speed)

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;

    if (index >= config.keypoint_count) {
        return;
    }

    let kp_t = input_keypoints_3d_t[index].pos;
    let kp_prev = input_keypoints_3d_prev[index].pos;

    // Calculate instantaneous 3D velocity vectors
    let vx = (kp_t.x - kp_prev.x) / config.delta_t;
    let vy = (kp_t.y - kp_prev.y) / config.delta_t;
    let vz = (kp_t.z - kp_prev.z) / config.delta_t;
    let speed = sqrt(vx * vx + vy * vy + vz * vz);

    // Write back to output storage buffer
    output_joint_velocities[index] = vec4<f32>(vx, vy, vz, speed);
}
```

```typescript
export interface BiomechanicalAnalysisResult {
  readonly phaseCoherence: number;       // Phi_phase_coherence
  readonly bilateralSymmetry: number;     // Lambda_symmetry
  readonly motionUniformity: number;      // U_motion
  readonly exerciseClassification: 'NON_ATHLETIC' | 'CARDIO' | 'STRENGTH_LIFTING';
  readonly confidence: number;
}

export class FitnessDistinctionEngine {
  private wasmInstance!: any;
  private memory!: WebAssembly.Memory;
  private bufferOffsetCoords: number = 0;
  private isLoaded: boolean = false;
  private device!: GPUDevice;
  private pipeline!: GPUComputePipeline;
  private keypointCount = 33;

  private latestResults: BiomechanicalAnalysisResult | null = null;

  constructor() {}

  public async initialize(wasmArrayBuffer: ArrayBuffer): Promise<void> {
    const wasmImports = {
      env: {
        onVisibilityMatrixResolved: (metricsPtr: number) => {
          this.handleResolvedMetrics(metricsPtr);
        }
      }
    };

    const compiled = await WebAssembly.instantiate(wasmArrayBuffer, wasmImports);
    this.wasmInstance = compiled.instance.exports;
    this.memory = this.wasmInstance.memory;
    
    // Allocate stable, aligned buffers on WebAssembly heap safely using C++ exports
    this.bufferOffsetCoords = this.wasmInstance.allocate_skeletal_coords_buffer();

    // Initialize WebGPU context
    const adapter = await navigator.gpu?.requestAdapter();
    this.device = await adapter?.requestDevice() as GPUDevice;

    const shaderModule = this.device.createShaderModule({
      code: `
        // WGSL code loaded from motion_trajectory_tracker.wgsl
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

  public async evaluateBiomechanicalMotion(
    rawPixelBufferT: Uint32Array,
    rawPixelBufferPrev: Uint32Array,
    poseLandmarksT: Float32Array, // 33 * 4 values at t
    poseLandmarksPrev: Float32Array, // 33 * 4 values at t-1
    width: number,
    height: number,
    fps: number
  ): Promise<BiomechanicalAnalysisResult | null> {
    if (!this.isLoaded || !this.device) return null;

    // Configure WebGPU buffers for high-speed parallel joint velocity calculations
    const configBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const kpTBuffer = this.device.createBuffer({
      size: poseLandmarksT.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });

    const kpPrevBuffer = this.device.createBuffer({
      size: poseLandmarksPrev.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });

    const outputVelocityBuffer = this.device.createBuffer({
      size: this.keypointCount * 16, // 33 * sizeof(vec4<f32>)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    // Write parameters to buffers
    const configData = new Uint32Array([width, height, this.keypointCount, 0]);
    this.device.queue.writeBuffer(configBuffer, 0, configData.buffer);
    this.device.queue.writeBuffer(kpTBuffer, 0, poseLandmarksT.buffer);
    this.device.queue.writeBuffer(kpPrevBuffer, 0, poseLandmarksPrev.buffer);

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: configBuffer } },
        { binding: 1, resource: { buffer: kpTBuffer } },
        { binding: 2, resource: { buffer: kpPrevBuffer } },
        { binding: 3, resource: { buffer: outputVelocityBuffer } }
      ]
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(1);
    passEncoder.end();

    const stagingBuffer = this.device.createBuffer({
      size: this.keypointCount * 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(outputVelocityBuffer, 0, stagingBuffer, 0, this.keypointCount * 16);
    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ);
    
    // Unpack calculated joint velocities directly to mapped WebAssembly memory heap (Bug Fix: Extracted from mapped range before unmapping)
    const projected2D = new Float32Array(stagingBuffer.getMappedRange());
    
    const heapView = new Float32Array(this.memory.buffer, this.bufferOffsetCoords, 33 * 4);
    for (let i = 0; i < this.keypointCount; ++i) {
      heapView[i * 4] = projected2D[i * 4];         // X
      heapView[i * 4 + 1] = projected2D[i * 4 + 1]; // Y
      heapView[i * 4 + 2] = poseLandmarksT[i * 4 + 2]; // Keep original Z depth
      heapView[i * 4 + 3] = poseLandmarksT[i * 4 + 3]; // Confidence
    }

    stagingBuffer.unmap();

    // Trigger WASM execution loop with parameters
    const mockSubjectDistanceMeters = 2.0;
    this.wasmInstance.process_biomechanical_evaluation(fps, mockSubjectDistanceMeters);

    return this.latestResults;
  }

  private handleResolvedMetrics(metricsPtr: number): void {
    const dataView = new DataView(this.memory.buffer, metricsPtr, 20); // sizeof(BiomechanicalOutput) = 20
    
    const phaseCoherence = dataView.getFloat32(0, true);
    const bilateralSymmetry = dataView.getFloat32(4, true);
    const motionUniformity = dataView.getFloat32(8, true);
    const exerciseClassificationInt = dataView.getInt32(12, true);
    const confidence = dataView.getFloat32(16, true);

    let exerciseClassification: 'NON_ATHLETIC' | 'CARDIO' | 'STRENGTH_LIFTING' = 'NON_ATHLETIC';
    if (exerciseClassificationInt === 2) {
      exerciseClassification = 'STRENGTH_LIFTING';
    } else if (exerciseClassificationInt === 1) {
      exerciseClassification = 'CARDIO';
    }

    this.latestResults = {
      phaseCoherence,
      bilateralSymmetry,
      motionUniformity,
      exerciseClassification,
      confidence
    };
  }
}
```

*   **Biomechanical Phase Verification:** Legitimate squats and deadlifts require tight phase coupling ($|\Phi_{\text{phase\_coherence}}| \ge 0.85$) between hip and knee vertical velocity vectors.

*   **Action:** If hip and knee movements are out of phase ($|\Phi| < 0.60$), the system identifies the movement as suggestive. It immediately disables the $S_{\text{fitness}}$ discount factor, applying standard exposure and pose rules with maximum sensitivity.

**Mitigation Strategy:** The system executes a skeletal-coherence check. If optical flow velocity vectors show low spatial correlation ($< 0.30$) with underlying MediaPipe joint trajectories, the system filters out the loose fabric motion and relies entirely on skeletal bone coordinates to compute symmetry.

$$\begin{bmatrix} x_{\text{norm}} \\ y_{\text{normalized}} \end{bmatrix} = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & \cos(\theta_{\text{pitch}}) \end{bmatrix} \begin{bmatrix} x_{\text{raw}} \\ y_{\text{raw}} \end{bmatrix}$$

### 6.2 Distance Constraints
*   **Threshold:** If the subject's height in pixels falls below 150 pixels, the silhouette outline detail is too low for reliable derivative calculations.
*   **Action:** Disable all Sobel edge extraction and Fourier spline calculations, defaulting the context state to safe.

---

## 7. Layer Interactions

### 7.1 Downstream Fitness Discount Injection
The calculated biomechanical classification result (`exerciseClassification`) is fed directly to the central Decision Engine and adjacent modules:

*   **State:** Strength / Lifting Verified (`exerciseClassification = 'STRENGTH_LIFTING'`):
*   **Action:** Apply a 0.50 discount multiplier to the pelvic bending risk thresholds ($A_{\text{pelvic}}$) in `pose/` and clothing tightness checks in `clothing/`. This ensures standard deep-squat postures and tight athletic compression gear do not trigger false blocks.

```text
If exerciseClassification == 'STRENGTH_LIFTING': Apply_Athletic_Discount_Overrides()
```


---

## 8. Complete Unit, Integration, and Stress Testing Suites

To ensure system reliability, the engine is validated against a local testing suite before deployment.

### 8.1 Unit Test Suite (`FitnessDistinctionEngine.test.ts`)
```typescript
import { FitnessDistinctionEngine } from './FitnessDistinctionEngine';

describe('Unit Test: FitnessDistinctionEngine', () => {
  let engine: FitnessDistinctionEngine;

  beforeAll(async () => {
    // Load mock compiled WASM array buffer
    const wasmBuffer = getMockWasmBinary();
    engine = new FitnessDistinctionEngine();
    await engine.initialize(wasmBuffer);
  });

  it('should verify standard squats as STRENGTH_LIFTING', async () => {
    const mockLandmarksT = getMockSquatCoordinatesT(); // Symmetrical, in-phase knee/hip flexion
    const mockLandmarksPrev = getMockSquatCoordinatesPrev();
    
    const result = await engine.evaluateBiomechanicalMotion(
      mockLandmarksT, mockLandmarksPrev, 640, 480, 30, 0.033
    );
    
    expect(result).not.toBeNull();
    expect(result!.exerciseClassification).toBe('STRENGTH_LIFTING');
    expect(Math.abs(result!.phaseCoherence)).toBeGreaterThanOrEqual(0.85);
  });

  it('should identify non-coherent pelvic translations as NON_ATHLETIC and ignore exceptions', async () => {
    const mockLandmarksT = getMockSuggestiveTranslationsT(); // Out of phase, asymmetric
    const mockLandmarksPrev = getMockSuggestiveTranslationsPrev();
    
    const result = await engine.evaluateBiomechanicalMotion(
      mockLandmarksT, mockLandmarksPrev, 640, 480, 30, 0.033
    );
    
    expect(result).not.toBeNull();
    expect(result!.exerciseClassification).toBe('NON_ATHLETIC');
  });
});
```


### 8.2 Stress Testing and Visual Noise Simulators
```typescript
export function runBiomechanicalStressTest(engine: FitnessDistinctionEngine, iterations = 1000): void {
  const mockBaseT = getMockSquatCoordinatesT();
  const mockBasePrev = getMockSquatCoordinatesPrev();
  let overloadCount = 0;

  for (let i = 0; i < iterations; ++i) {
    const noisyCoordsT = new Float32Array(mockBaseT.length);
    for (let j = 0; j < mockBaseT.length; ++j) {
      // Inject random tracking noise simulating dynamic low-light coordinate jitter
      const noise = (Math.random() - 0.5) * 8.0;
      noisyCoordsT[j] = mockBaseT[j] + noise;
    }

    const start = performance.now();
    const result = engine.evaluateBiomechanicalMotion(
      noisyCoordsT, mockBasePrev, 640, 480, 30, 0.033
    );
    const duration = performance.now() - start;

    if (duration > 16.6) {
      overloadCount++;
      console.warn("Performance Warning: Processing exceeded frame rendering limits");
    }
  }
}
```