# Multi-Person Movement Intelligence Framework

## Document Metadata
* **Module Name:** Multi-Person Movement Intelligence
* **Document Version:** 2.0.0
* **Architectural Role:** Group Interaction Evidence Layer
* **Domain:** Movement, Interaction Dynamics, Shared Activity, Group Behavior
* **Primary Responsibility:** multi-person movement understanding, interaction dynamics, coordinated motion reasoning, shared activity semantics, group interaction evidence, collective behavior interpretation, interaction explainability, temporal interaction evolution
* **Design Intention:** architecture-first, evidence-driven, concept-focused, implementation-agnostic, multimodal-compatible, future-ready

---

## 1. Purpose and Responsibilities

### 1.1 Primary Purpose
Multi-Person Movement Intelligence is the authoritative explanation layer for interaction evidence within the movement subsystem. It identifies when people are interacting through coordinated movement, shared task structure, and temporal-spatial relationships, and produces explainable interaction evidence that downstream subsystems consume.

### 1.2 In-Scope Responsibilities
This module is responsible for:
* recognizing coordinated movement as an interaction signal rather than a single-person action;
* modeling how shared motion emerges from individual motion, relative motion, spatial configuration, and temporal evolution;
* distinguishing cooperative, collaborative, competitive, supportive, educational, medical, social, and collective movement structures;
* generating structured interaction evidence objects with semantic categories, confidence, uncertainty, and provenance;
* documenting interaction initiation, persistence, separation, regrouping, participant roles, and collective goals;
* providing explainable interaction conclusions with supporting evidence, alternative interpretations, and uncertainty profiles;
* preserving strict boundaries by consuming pose, tracking, behavior, environment, object, and relationship signals rather than performing identity, affect, age, or policy decisions.

### 1.3 Out-of-Scope Responsibilities
This module is explicitly not responsible for:
* relationship classification;
* identity recognition;
* age estimation;
* emotion recognition;
* intent prediction;
* violence detection;
* policy decisions.

These responsibilities belong to dedicated downstream subsystems. Multi-Person Movement Intelligence only produces structured interaction evidence.

### 1.4 Architectural Principles
The module is governed by these principles:
* interaction is a semantic layer derived from movement and context, not a raw proximity label;
* evidence accumulates progressively from individual observation to explainable interaction understanding;
* every major conclusion preserves explicit confidence and uncertainty;
* dependency contracts define required inputs and acceptable failure modes;
* explainability is mandatory for all interaction evidence;
* terminology is standardized, stable, and aligned with the broader movement knowledge base;
* ontology consistency is enforced to avoid duplication with pose, tracking, objects, relationship, behavior, intent, environment, medical, educational, sports, and policy modules;
* the module is compatible with evidence graphs, interaction knowledge graphs, social graphs, and future embodied AI reasoning.

---

## 2. Architectural Responsibility and Subsystem Boundaries

### 2.1 Subsystem Responsibility Definition
This module is responsible for:
* multi-person movement understanding;
* interaction dynamics;
* coordinated movement reasoning;
* shared activity semantics;
* group interaction evidence;
* collective behavior interpretation;
* interaction explainability;
* temporal interaction evolution.

It is not responsible for any determination that requires direct personal attributes or policy judgments.

### 2.2 Subsystem Boundary Principles
Boundaries are drawn along the following lines:
* Upstream modules provide raw movement, pose, tracking, environment, object, behavioral, and relationship signals.
* This module integrates those upstream signals into interaction evidence.
* Downstream modules such as Relationship, Interaction Intent, Behavioral Signals, Sports, Medical, Risk Assessment, and Policy Reasoning consume this evidence to make higher-level conclusions.
* Interaction evidence is always an intermediate semantic product, not a final classification of identity, intent, emotion, age, or policy risk.

### 2.3 Boundary Enforcement
The module ensures boundaries by:
* avoiding direct identity or personal attribute inference;
* using relationship signals only as supporting context, not as primary interaction evidence;
* presenting interaction evidence as evidence objects with provenance that downstream subsystems can refine;
* providing explicit uncertainty when upstream evidence is weak or conflicting.

---

## 3. Multi-Person Semantic Pipeline

### 3.1 Overview
Interaction evidence is built through a progressive semantic pipeline. Each stage is validated by evidence accumulation from the previous stage and carries forward both confidence and uncertainty.

Pipeline stages:
1. Individual Observation
2. Individual Movement
3. Relative Motion
4. Spatial Configuration
5. Interaction Evidence
6. Shared Activity
7. Collective Behavior
8. Context Evidence
9. Intent Evidence
10. Explainable Interaction Understanding
11. Policy Evidence

Every transition explicitly states:
* why the next stage becomes valid;
* which evidence supports it;
* what uncertainty remains.

### 3.2 Individual Observation
Individual Observation is the first evidence layer. It establishes who is present and whether they exhibit motion or posture relevant to interaction.

Key evidence:
* visible human bodies or silhouettes;
* pose confidence and skeletal stability;
* motion presence or stillness;
* individual spatial occupancy.

Validity conditions:
* individuals must be detected with sufficient confidence;
* temporal continuity must exist for at least one observation window;
* uncertainty sources such as occlusion, low resolution, and viewpoint ambiguity are documented.

### 3.3 Individual Movement
Individual Movement is the second layer. It models the movement behavior of each participant independently.

Key evidence:
* joint dynamics, velocity, acceleration;
* movement primitives such as reach, walk, step, bend, lift, push, pull, carry;
* motion direction and magnitude;
* segment-level coordination.

This stage becomes valid when:
* per-person pose and tracking evidence is reliable;
* motion is distinguished from static posture or noise;
* movement primitive evidence is stable across a short temporal window.

### 3.4 Relative Motion
Relative Motion identifies how individual movements relate to each other.

Key evidence:
* converging or diverging trajectories;
* motion vectors that are aligned, mirrored, complementary, or opposing;
* temporal correlations in movement onset, pace, and rhythm;
* relative speeds and accelerations.

This stage becomes valid when:
* individual movement evidence is strong for the involved participants;
* spatial reference frames between participants are consistent;
* relative motion has sufficient duration to exclude momentary coincidence.

### 3.5 Spatial Configuration
Spatial Configuration captures the arrangement of participants in space.

* interpersonal distance;
* body orientation and facing direction;
* formation structures such as line, circle, pair, cluster, row, or opposing sides;
* personal space boundaries and overlap patterns.

* spatial measurements are stable over time;
* body orientations can be estimated with confidence;
* configuration is not entirely explained by projection artifacts or viewpoint distortions.

### 3.6 Interaction Evidence
Interaction Evidence is the first multi-person semantic layer.

* sustained relative motion that suggests coordination or response;
* spatial configurations consistent with shared activity;
* temporal synchronization or sequential anticipation;
* shared attention indicators such as mutual facing and aligned motion.

* relative motion and spatial configuration evidence both support interpersonal engagement;
* alternative explanations such as independent motion in crowded space are evaluated and sufficient uncertainty is documented;
* evidence sufficiency is reached for an interaction hypothesis.

### 3.7 Shared Activity
Shared Activity situates the interaction within an emergent task or group process.

* repeated collaborative motion;
* object-mediated coordination;
* common movement goals such as transporting, holding, assisting, or demonstrating;
* coherent activity dynamics across participants.

* interaction evidence persists across multiple cycles or phases;
* participants exhibit behavior that aligns with a shared task structure;
* context evidence supports a plausible joint activity.

### 3.8 Collective Behavior
Collective Behavior interprets the group as a cohesive entity with a shared pattern.

* group-level formations;
* coordinated tempo and rhythm across multiple participants;
* role specialization such as leader, follower, carrier, supporter;
* coordinated phase transitions and group evolution.

* shared activity evidence is strong;
* at least three participants contribute to a coherent group dynamic or a well-defined dyadic interaction exhibits role structure;
* group behavior consistency is observed across time.

### 3.9 Context Evidence
Context Evidence is external information that grounds the interaction.

* environment type and affordances;
* objects engaged by the group;
* domain cues such as sports equipment, medical devices, classroom layout, or social artifacts;
* relationship and role signals from upstream modules.

* context signals are reliable;
* interaction evidence can be mapped to plausible real-world scenarios;
* alternative contexts have been considered.

### 3.10 Intent Evidence
Intent Evidence is a higher-order judgement supporting why the participants may be interacting.

* directional persistence toward a collective goal;
* preparation and follow-through sequences;
* adaptive coordination to changing circumstances;
* shared task structure.

* enough interaction and context evidence exists to support purpose inference;
* uncertainty about the inferred purpose is explicitly documented;
* the conclusion is presented as provisional evidence rather than a hard intent classification.

### 3.11 Explainable Interaction Understanding
This stage produces the final interaction evidence summary.

Required explanation elements:
* observed participants;
* movement evidence;
* relative motion evidence;
* spatial configuration evidence;
* temporal evidence;
* supporting contextual evidence;
* conflicting evidence;
* alternative interpretations;
* confidence profile;
* uncertainty profile;
* subsystem contribution summary.

It becomes valid when:
* the reasoning chain from individual observation through collective behavior is coherent;
* evidence sufficiency is met or uncertainty is properly quantified;
* no unsupported interaction labels are presented.

### 3.12 Policy Evidence
This module emits policy-relevant evidence markers without policy decisions.

Policy evidence includes:
* interaction risk indicators;
* uncertainty flags;
* evidence provenance;
* explainability references.

It becomes valid when interaction conclusions are sufficiently supported and uncertainty is quantified.

## 4. Interaction Knowledge Model

### 4.1 Multi-Person Movement as Emergent Behavior
Interaction is modeled as emergent behavior that arises when two or more individuals coordinate their motion in space and time.

Core concepts:
* individual trajectories,
* spatial relations,
* relative motion dynamics,
* temporal synchronization,
* shared goals,
* environmental affordances,
* object mediation,
* social context.

### 4.2 Movement Coordination
Movement Coordination is the alignment or complementarity of motion among participants.

Concepts:
* synchronous movement,
* mirrored movement,
* complementary motion,
* leader-follower dynamics,
* turn-taking,
* reciprocal support.

Coordination evidence distinguishes interaction from mere co-presence.

### 4.3 Relative Motion
Relative Motion is the motion of one participant in relation to another.

Concepts:
* converging trajectories,
* diverging trajectories,
* parallel motion,
* opposing motion,
* approaching and retreating,
* relative speed ratios.

Relative motion evidence provides the first multi-person signal beyond individual movement.

### 4.4 Temporal Synchronization
Temporal Synchronization is the timing relationship among movements.

* simultaneous initiation,
* matched tempo,
* phase alignment,
* sequential anticipation,
* rhythmic coupling.

Synchronization evidence is strong support for shared activity and collective behavior.

### 4.5 Shared Goals
Shared Goals are inferred through motion that is consistent with a common purpose.

* object transport,
* joint stabilization,
* collaborative manipulation,
* co-navigating a space,
* jointly supporting a person.

Shared goal evidence binds interaction evidence to task semantics.

### 4.6 Environmental Context
Environmental Context influences how interaction is interpreted.

* affordance compatibility,
* space constraints,
* object availability,
* domain-specific settings.

Context evidence is necessary for responsible interpretation of similar spatial patterns.

### 4.7 Object Mediation
Object Mediation occurs when an object is central to interaction.

* shared object handling,
* passing and receiving,
* carrying together,
* manipulating the same object.

Object evidence distinguishes collaborative interaction from independent activities in proximity.

### 4.8 Behavioral Context
Behavioral Context adds social and cooperative semantics to interaction.

* mutual awareness,
* supportive gestures,
* communication through motion,
* non-verbal coordination.

Behavioral context evidence enriches interaction understanding without becoming relationship or emotion classification.

### 4.9 Task Structure
Task Structure is the temporal and spatial organization of interaction.

* initiation phase,
* active engagement phase,
* transition phase,
* completion phase,
* role changes.

Task structure evidence is essential for explainable interaction reasoning.

### 4.10 Human Intent
Human Intent is the inferred direction of participants' collective action.

* pursuit of a shared objective,
* adjustment to partner motion,
* preservation of group coherence,
* reaction to external demands.

Intent evidence is provisional and should remain under uncertainty until supported by strong upstream interaction and context evidence.

## 5. Interaction Evidence Architecture

### 5.1 Evidence Categories
The module defines a structured evidence taxonomy for interaction reasoning.

Categories include:
* Primary Evidence
* Supporting Evidence
* Movement Evidence
* Spatial Evidence
* Temporal Evidence
* Pose Evidence
* Behavioral Evidence
* Object Evidence
* Environmental Evidence
* Relationship Evidence
* Context Evidence
* Negative Evidence
* Conflicting Evidence
* Weak Evidence
* Strong Evidence
* Evidence Reliability
* Evidence Consistency
* Evidence Sufficiency

Each major interaction conclusion is tagged with one or more categories.

### 5.2 Primary Evidence
Primary Evidence is direct, high-confidence evidence for interaction.

Examples:
* sustained relative motion indicative of response or coordination;
* shared object handling with clear role switching;
* synchronized movements among participants;
* repeated joint action towards a common spatial endpoint.

Primary evidence is required for high-confidence interaction conclusions.

### 5.3 Supporting Evidence
Supporting Evidence reinforces primary interaction signals.

Examples:
* environment and object cues consistent with group activity;
* body orientation alignment;
* temporal persistence of spatial configuration;
* behavioral signals such as gestural communication.

Supporting evidence increases confidence and reduces ambiguity.

### 5.4 Movement Evidence
Movement Evidence is derived from individual motion trajectories and dynamics.

* movement primitive sequences,
* direction changes,
* motion magnitude,
* acceleration patterns.

Movement evidence distinguishes active interaction from static co-presence.

### 5.5 Spatial Evidence
Spatial Evidence describes the geometric relationships among participants.

* interpersonal distance gradients,
* relative facing directions,
* spatial formations,
* boundary overlap patterns.

Spatial evidence is necessary but not sufficient for interaction conclusions.

### 5.6 Temporal Evidence
Temporal Evidence captures how interaction evolves over time.

* synchronized initiation times,
* matching tempo,
* persistent proximity,
* coordinated phase changes.

Temporal evidence is essential for separating transient proximity from meaningful interaction.

### 5.7 Pose Evidence
Pose Evidence anchors interaction to anatomical structure and orientation.

* facing direction of torso and head,
* arm extension toward another participant,
* grasping posture,
* support postures.

Pose evidence validates that the participants are physically positioned to interact.

### 5.8 Behavioral Evidence
Behavioral Evidence adds social semantics to the interaction signal.

* supportive gestures,
* reciprocal movement adjustments,
* paired movement patterns,
* non-verbal communication through posture.

Behavioral evidence refines interaction meaning without presuming specific relationships.

### 5.9 Object Evidence
Object Evidence connects the interaction to physical tools or objects.

* shared object contact,
* passing and receiving,
* cooperative carrying,
* object-mediated coordination.

Object evidence is a strong signal for collaborative or supportive interaction.

### 5.10 Environmental Evidence
Environmental Evidence grounds interaction in the setting.

* sports court layout,
* medical facility equipment,
* classroom seating,
* crowded public space.

Environmental evidence helps interpret similar motion patterns differently depending on domain.

### 5.11 Relationship Evidence
Relationship Evidence provides supporting context from upstream relationship reasoning.

* co-worker,
* caregiver-patient,
* coach-student,
* partners.

Relationship evidence is used only as supporting context, not as the primary interaction signal.

### 5.12 Context Evidence
Context Evidence merges environment, object, task, social, and domain cues.

* fitness equipment presence,
* medical apparatus,
* educational materials,
* celebratory decorations.

Context evidence situates interaction in real-world semantics.

### 5.13 Negative Evidence
Negative Evidence is the absence of expected interaction signals.

* no shared object contact in a proposed collaborative task;
* uncorrelated movement despite proximity;
* stable configuration without coordinated motion.

Negative evidence reduces confidence and raises uncertainty.

### 5.14 Conflicting Evidence
Conflicting Evidence arises when sources disagree.

* spatial proximity suggests interaction while relative motion does not;
* shared object evidence conflicts with independent movement;
* environment indicates separate activities.

Conflicting evidence is preserved as alternative hypotheses.

### 5.15 Weak Evidence
Weak Evidence is degraded, incomplete, or low-confidence input.

* occluded body regions,
* noisy tracking,
* blurred motion,
* low-resolution participants.

Weak evidence is weighted carefully and cannot alone validate strong interaction.

### 5.16 Strong Evidence
Strong Evidence is clear, consistent, and multimodal.

* synchronized movement with shared object handling;
* stable spatial formation with matching tempo;
* cooperative support postures confirmed by environment and behavior evidence.

Strong evidence supports high-confidence conclusions.

### 5.17 Evidence Reliability
Evidence Reliability rates trustworthiness by considering signal quality, temporal consistency, multimodal agreement, and upstream confidence.

### 5.18 Evidence Consistency
Evidence Consistency measures agreement across categories.

* relative motion aligns with spatial formation;
* pose orientation supports shared activity;
* context evidence reinforces interaction hypotheses.

Consistency increases confidence and reduces uncertainty.

### 5.19 Evidence Sufficiency
Evidence Sufficiency assesses whether evidence is adequate for a stable conclusion.

Criteria:
* duration of interaction evidence;
* number of modalities supporting the hypothesis;
* lack of critical conflicts;
* context alignment.

Sufficiency is required before a conclusion is considered explainable.

## 6. Interaction Ontology Enrichment

### 6.1 Ontology Foundations
The interaction ontology provides hierarchical semantic concepts for shared motion. It is designed to preserve reusable terms and avoid duplication with other modules.

Primary ontology branches:
* Independent Movement
* Passive Co-presence
* Mutual Awareness
* Spatial Coordination
* Shared Motion
* Object-mediated Interaction
* Collaborative Interaction
* Competitive Interaction
* Supportive Interaction
* Educational Interaction
* Medical Interaction
* Emergency Interaction
* Social Interaction
* Collective Interaction

### 6.2 Independent Movement
Independent Movement is co-located motion without interaction semantics.

* unrelated pedestrians walking in the same space;
* separate people using individual equipment side by side;
* multiple listeners standing in a room without mutual coordination.

Evidence:
* spatial proximity without temporal or relative motion coordination;
* facing directions that are independent;
* lack of shared objects or shared task structure.

Ambiguity sources:
* crowded environments,
* overlapping personal spaces.

Downstream interpretation:
* non-interactive co-presence evidence.

### 6.3 Passive Co-presence
Passive Co-presence is shared occupancy of space with minimal engagement.

* people sitting in the same waiting area;
* multiple shoppers browsing a store;
* audience members watching a performance.

Evidence:
* stable proximity,
* largely static postures,
* lack of mutual movement response.

Ambiguity sources:
* incidental alignment,
* shared environmental affordances.

Downstream interpretation:
* co-presence evidence without active interaction.

### 6.4 Mutual Awareness
Mutual Awareness indicates that participants have detected or oriented toward each other.

* facing one another while standing;
* turning heads toward a shared object;
* aligning bodies in preparation for joint action.

* reciprocal facing directions,
* correlated head and body orientation,
* temporal initiation of engagement.

* shared attention to an external event rather than each other.

* awareness evidence supporting possible interaction.

### 6.5 Spatial Coordination
Spatial Coordination is the intentional arrangement of participants in space.

* forming a line to lift a stretcher;
* circling around a central object;
* maintaining side-by-side spacing while walking together.

* stable formation geometry,
* distances that support task execution,
* coordinated positioning relative to shared objects.

* same direction movement in dense crowds.

* spatial coordination evidence for shared activity.

### 6.6 Shared Motion
Shared Motion is motion that participants execute together.

* synchronized steps in marching;
* lifting an object simultaneously;
* moving in the same direction with matched tempo.

* matched velocity profiles,
* parallel and aligned movement vectors,
* reciprocal physical support.

* similar independent activities in a common environment.

* strong interaction evidence when confirmed by context.

### 6.7 Object-mediated Interaction
Object-mediated Interaction is interaction centered on a shared object.

* two people carrying a table;
* passing a ball;
* adjusting equipment together.

* shared contact points,
* coordinated object motion,
* alternating role patterns.

* incidental object proximity.

* collaboration evidence for object-based joint action.

### 6.8 Collaborative Interaction
Collaborative Interaction is joint activity with interdependent roles.

* partner stretching;
* cooperative lifting;
* assisted walking.

* complementary motion patterns,
* role differentiation,
* mutual adjustment.

* one participant following another without actual cooperation.

* shared task evidence with support semantics.

### 6.9 Competitive Interaction
Competitive Interaction is opposing or rivalrous shared movement.

* two players vying for a ball;
* opponent chasing another;
* defensive and offensive positioning.

* converging and diverging motion,
* spatial opposition,
* rapid role switching.

* sportive training drills versus actual competition.

* competition evidence distinguished from cooperation.

### 6.10 Supportive Interaction
Supportive Interaction is movement that assists another person physically.

* two people helping someone stand;
* guiding a person through a doorway;
* steadying a patient during transfer.

* close physical support,
* corrective motion,
* shared stabilization.

* incidental side-by-side movement.

* assistance evidence for caregiving or rehabilitation.

### 6.11 Educational Interaction
Educational Interaction is interaction within a learning or teaching context.

* coach demonstrating a movement;
* students practicing in a group;
* teacher guiding a learner.

* demonstration motion,
* repeated instruction-response sequences,
* spatial arrangement supportive of viewing.

* exercise groups outside education.

* learning evidence for instructional contexts.

### 6.12 Medical Interaction
Medical Interaction is cooperative movement with a clinical purpose.

* caregiver assisting patient transfer;
* therapist guiding a rehabilitation exercise;
* medical team supporting a patient.

* specialized equipment,
* support postures,
* task structure aligned with care.

* physical assistance in non-medical contexts.

* medical interaction evidence to support clinical reasoning.

### 6.13 Emergency Interaction
Emergency Interaction is rapid collaborative action in a safety-critical situation.

* two responders carrying an injured person;
* multiple people helping someone collapse;
* coordinated evacuation assistance.

* urgency in motion,
* close support,
* atypical group response.

* staged emergency drills.

* emergency evidence with caution on authenticity.

### 6.14 Social Interaction
Social Interaction is movement that conveys or supports social exchange.

* greeting with handshake or hug;
* dancing together;
* conversation circles with shared gestures.

* mutual facing,
* communicative gestures,
* coordinated non-task movement.

* mere co-presence during a shared event.

* social evidence distinct from purely task-based interaction.

### 6.15 Collective Interaction
Collective Interaction is coordinated behavior among a larger group.

* choir formation,
* group exercise classes,
* crowd movement in procession.

* group formation geometry,
* tempo consistency,
* common directionality.

* coincident crowd flow.

* collective behavior evidence for group-level reasoning.

## 7. Spatial-Temporal Intelligence

### 7.1 Interaction Initiation
Interaction initiation is the transition from individual motion or co-presence to coordinated engagement.

* approach trajectories converging toward each other;
* mutual facing and body orientation alignment;
* change in motion patterns when participants become aware of each other.

Why valid:
* initiation marks the first time individual observations begin to relate meaningfully.

Uncertainty:
* approach may be incidental in crowded scenes;
* facing may be toward a shared environment rather than another person.

### 7.2 Coordination Development
Coordination development tracks how participants adjust their movement to work together.

* tempo matching or complementary pacing;
* role establishment such as one participant leading and another following;
* mutual motion adjustments.

Why valid:
* developed coordination signifies the interaction has moved beyond a single moment of co-presence.

Uncertainty:
* apparent coordination may stem from both participants reacting to external events.

### 7.3 Role Transitions
Role transitions occur when participants shift responsibilities or behavior within the interaction.

* leader-follower changes;
* alternating object manipulation roles;
* shifting from passive supporter to active mover.

* role changes indicate structured group dynamics and meaningful shared activity.

* apparent role change could be due to individual fatigue or distraction.

### 7.4 Interaction Persistence
Interaction persistence measures how long interaction evidence remains coherent.

* continued relative motion coordination;
* sustained spatial configuration;
* ongoing shared object handling.

* persistence helps distinguish transient encounters from meaningful interactions.

* persistence may be interrupted and resumed, requiring careful temporal analysis.

### 7.5 Group Evolution
Group evolution captures how the composition and structure of the interaction changes.

* participant arrival and departure;
* group splitting and merging;
* formation changes.

* dynamic groups require reasoning about evolving interaction semantics.

* group changes may be caused by unrelated external factors.

### 7.6 Participant Arrival
Participant arrival is an event when a new person enters the interaction context.

* new individual moves into the spatial configuration;
* changes in relative motion patterns;
* adjustment of shared activity to include the newcomer.

* arrival affects the interaction structure and evidence composition.

* arrival may be independent if the newcomer does not join the interaction.

### 7.7 Participant Departure
Participant departure is an event when someone leaves the interaction context.

* increasing distance from the group;
* loss of coordinated motion;
* completion of a shared phase.

* departure impacts group behavior and may signify activity completion.

* departure may be temporary or unrelated to the interaction.

### 7.8 Group Splitting
Group splitting occurs when participants separate into smaller subgroups.

* diverging trajectories;
* independence of motion patterns;
* formation fragmentation.

* splitting changes the collective evidence structure.

* splitting may reflect a natural transition phase rather than an end to interaction.

### 7.9 Group Merging
Group merging occurs when separate participants or subgroups come together.

* converging spatial configurations;
* synchronization onset;
* shared activity initiation.

* merging signifies new interaction evidence and possible collective activity.

* merging may be incidental if participants remain independent after joining.

### 7.10 Historical Interaction Evidence
Historical Interaction Evidence compares current patterns to previous interactions.

* repeated coordination signatures;
* consistent participant roles over time;
* similar group formations in repeated sessions.

* history supports stronger interaction hypotheses and reveals stable group behavior.

* history may bias the model if the current interaction is intentionally different.

### 7.11 Long-Term Interaction Consistency
Long-term interaction consistency evaluates whether group dynamics remain stable over extended time.

* persistent coordination patterns;
* stable shared goals;
* continuous group formation structure.

* consistent interactions are more reliable for downstream reasoning.

* long-term consistency must account for natural variation and adaptation.

### 7.12 Identical Spatial Configurations with Different Meaning
Identical spatial configurations may imply different interactions depending on temporal evolution.

Example:
* two people standing side by side may simply be co-present, or they may be waiting together, assisting each other, or preparing to move in coordination.

* identical static layouts must be disambiguated with temporal and movement evidence.

* static evidence alone is insufficient; temporal evolution is required to resolve meaning.

## 8. Multi-Modal Evidence Fusion

### 8.1 Integration with Movement Overview
Movement Overview consumes interaction evidence to enrich global movement semantics.

Incoming evidence:
* interaction hypotheses,
* coordination confidence,
* group formation evidence,
* shared activity indicators.

Outgoing evidence:
* refined group movement summaries,
* interaction risk cues,
* collaboration metrics.

Evidence weight:
* interaction evidence strengthens movement semantics when it aligns with pose and movement patterns;
* interaction evidence is lower weight when spatial or temporal signals are weak.

Conflict resolution:
* Movement Overview compares interaction evidence with individual movement and body mechanics to avoid contradictory conclusions.

Cross-validation:
* interaction evidence is validated against movement primitives, functional activities, and temporal patterns.

Semantic refinement:
* Movement Overview can reclassify a generic movement pattern as a collaborative activity when interaction evidence supports it.

Confidence contribution:
* interaction confidence supplements movement confidence for group activity conclusions.

Uncertainty contribution:
* interaction uncertainty increases movement uncertainty when evidence is weak or conflicting.

### 8.2 Integration with Pose
Pose provides structural evidence for interaction through body orientation and joint configuration.

Incoming evidence:
* person pose and orientation,
* pose confidence,
* joint positions.

Outgoing evidence:
* pose-based interaction cues such as mutual facing and reach posture.

Evidence weight:
* high when pose confidence is strong and visible body parts are unobstructed;
* reduced when pose evidence is degraded.

Conflict resolution:
* interaction evidence will not rely on pose cues when pose orientation is ambiguous or occluded.

Cross-validation:
* pose evidence is cross-checked with movement vectors and spatial configuration.

Semantic refinement:
* pose orientation can refine interaction categories from general co-presence to mutual awareness.

Confidence contribution:
* pose confidence is a core component of interaction confidence.

Uncertainty contribution:
* pose ambiguity feeds directly into spatial and interaction uncertainty.

### 8.3 Integration with Tracking
Tracking provides temporal continuity and participant identity persistence.

* stable track IDs,
* motion trajectories,
* occlusion and recovery indicators.

* temporal interaction continuity,
* participant arrival and departure events.

* high when tracking is continuous;
* reduced when track IDs switch or disappear.

* when tracking ambiguity exists, interaction evidence is downgraded and alternative hypotheses are preserved.

* tracking evidence is validated against spatial formation and relative motion patterns.

* stable tracking allows transformation of transient proximity into sustained interaction evidence.

* tracking confidence heavily influences interaction confidence and temporal uncertainty.

* tracking failures contribute to participant identity ambiguity and group uncertainty.

### 8.4 Integration with Relationship
Relationship signals provide supporting social context for interaction evidence.

* relationship likelihoods,
* conversation or partner signals,
* affiliation cues.

* interaction context hints,
* compatibility of interaction categories.

* relationship evidence is supporting rather than primary.

* interaction reasoning remains independent; relationship evidence cannot override strong motion evidence.

* relationship signals are used to assess whether observed coordination aligns with expected social roles.

* relationship evidence can shift interaction interpretation from neutral collaboration to a supportive or instructional scenario.

* relationship evidence can raise contextual confidence when aligned.

* relationship mismatch increases contextual uncertainty.

### 8.5 Integration with Behavioral Signals
Behavioral signals add higher-order semantics to interaction.

* gestural cues,
* communication dynamics,
* social posture.

* behavioral interaction evidence,
* nonverbal coordination markers.

* behavioral signals are supportive when movement evidence is strong;
* lower weight when behaviors are ambiguous or incidental.

* if behavioral signals contradict interaction movement, uncertainty is increased.

* behavioral signals are compared with spatial and temporal evidence to ensure consistent interaction semantics.

* behavioral evidence helps distinguish cooperative from merely adjacent motion.

* behavioral signals can augment interaction confidence when present.

* absent or conflicting behavior contributes to uncertainty.

### 8.6 Integration with Interaction Intent
Interaction Intent consumes interaction evidence to refine purpose and goal structure.

* shared activity indicators,
* role dynamics,
* collective behavior patterns.

* candidate intent frames,
* interaction goal evidence.

* interaction evidence is primary for intent reasoning, but intent modules add higher-order purpose semantics.

* if inferred intent contradicts interaction evidence, the system retains both and flags uncertainty.

* interaction evidence is compared with inferred intent to avoid false purpose assignment.

* interaction evidence grounds intent hypotheses in explicit movement patterns.

* strong interaction evidence raises intent confidence.

* weak interaction evidence lowers intent confidence and increases uncertainty.

### 8.7 Integration with Environment
Environment provides situational grounding for interaction interpretation.

* room type,
* scene affordances,
* object availability,
* space constraints.

* context-conditioned interaction categories,
* plausibility assessments.

* context is critical when similar movement patterns have different meanings in different environments.

* if environment evidence conflicts with interaction motion, the system preserves alternative interpretations.

* environmental cues validate or invalidate shared activity hypotheses.

* environment evidence can narrow interaction categories from generic collaboration to medical assistance, educational instruction, or sports practice.

* strong environment context increases interaction confidence.

* uncertain environment classification increases contextual uncertainty.

### 8.8 Integration with Objects
Objects provide functional grounding for interaction.

* shared object contact,
* object motion trajectories,
* object affordance signals.

* object-mediated interaction evidence,
* task-specific coordination markers.

* object evidence is strong when shared handling or collaboration is clear.

* if object evidence implies a different activity than body movement, uncertainty is surfaced.

* object evidence is verified against spatial configuration and relative motion.

* objects can differentiate carrying together from independent walking.

* shared object handling raises interaction confidence substantially.

* absent object evidence leaves some collaborative interaction hypotheses unresolved.

### 8.9 Integration with Educational Context
Educational context refines interactions related to learning and teaching.

* classroom layout,
* instructional gestures,
* demonstration postures.

* educational interaction signals,
* teaching and learning evidence.

* strong when education-specific affordances are present.

* if movement pattern fits exercise but not teaching, the system preserves both interpretations.

* educational context is checked against object and environment cues.

* general collaboration may become instructional interaction.

* strong educational context improves interaction confidence.

* uncertain educational context contributes to higher uncertainty in category selection.

### 8.10 Integration with Medical
Medical context refines interactions involving care and rehabilitation.

* medical equipment,
* support postures,
* clinical setting.

* medical interaction evidence,
* caregiver support markers.

* high when clinical affordances are unmistakable.

* if motion suggests sports rather than care, the system retains both with uncertainty.

* medical evidence is validated against object handling and support postures.

* collaborative motion may become medical assistance.

* clear medical context strongly supports medical interaction evidence.

* uncertain medical cues increase uncertainty about interaction purpose.

### 8.11 Integration with Sports
Sports context refines interactions associated with athletic activity.

* sports equipment,
* field or court layout,
* team formations.

* sports interaction evidence,
* cooperative or competitive athletic markers.

* strong when sports context is explicit.

* if motion is cooperative but environment is social, the system preserves both possibilities.

* sports evidence is checked against object and formation evidence.

* group motion may become team-based coordination.

* explicit sports context reinforces interaction confidence.

* ambiguous sports cues raise contextual uncertainty.

### 8.12 Evidence Weighting Principles
Evidence weight is assigned conceptually based on modality strength:
* high weight: motion coordination, temporal synchronization, shared object handling, environment context;
* moderate weight: spatial formation, pose orientation, behavioral signals;
* low weight: relationship signals, weak or partial evidence.

Weighting supports robust fusion and avoids over-reliance on any single modality.

### 8.13 Conflict Resolution Principles
Conflicts are resolved by preserving hypotheses and making uncertainty explicit.

Principles:
* stronger evidence with higher reliability dominates weaker conflicting signals;
* unresolved conflicts are surfaced rather than hidden;
* alternative conclusions remain available for downstream reasoning.

### 8.14 Cross-validation Principles
Cross-validation confirms interaction semantics across modalities.

* shared object handling should align with coordinated movement and spatial configuration;
* educational gestures should align with classroom context and mutual awareness;
* medical assistance should align with support postures and clinical environment.

Cross-validation reduces false interpretations.

### 8.15 Semantic Refinement Principles
Semantic Refinement updates interaction conclusions when additional evidence arrives.

* a proximity-based hypothesis becomes collaborative interaction when shared motion and object handling appear;
* a group standing together becomes collective interaction when synchronized motion emerges;
* a pair of people walking together becomes a supportive transfer when one person adapts to the other.

Refinement is evidence-driven and avoids premature labelling.

### 8.16 Confidence Contribution Principles
Each modality contributes to interaction confidence.

* tracking confidence strengthens temporal persistence;
* pose confidence strengthens spatial orientation evidence;
* object evidence strengthens collaboration confidence;
* environmental evidence strengthens contextual confidence.

Confidence contributions are preserved for traceability.

### 8.17 Uncertainty Contribution Principles
Each modality contributes to uncertainty when weak or conflicting.

* occluded participants increase interaction ambiguity;
* unreliable pose increases spatial uncertainty;
* ambiguous environment increases contextual uncertainty;
* missing object evidence reduces collaboration certainty.

Uncertainty contributions remain visible in the final evidence payload.

## 9. Dependency Graph

### 9.1 Required Inputs
Required conceptual inputs for interaction evidence:
* individual pose and joint trajectories;
* tracking continuity and identity persistence;
* relative motion vectors and spatial configuration;
* environmental context;
* object contact and usage signals;
* behavioral and mutual awareness signals;

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
Overlap_IoU = Area(BB_person_1 ∩ BB_person_2) / Area(BB_person_1 ∪ BB_person_2)
```

If `Overlap_IoU > 0.35` and distance < 0.50m, system flags close physical proximity state.