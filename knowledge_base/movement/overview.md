# Human Movement Intelligence Architecture
**Document Version:** 2.0.0  
**Subsystem Reference:** `MOVEMENT_OVERVIEW_INTELLIGENCE_CORE`  
**Module Responsibility:** human movement understanding, movement ontology, temporal movement reasoning, biomechanical reasoning, movement evidence generation, movement semantics, movement state transitions, movement context integration, movement explainability, and movement orchestration.

---

## 1. Purpose and Responsibility

### 1.1 Core Purpose
The movement overview subsystem is the architectural orchestration layer for all movement-related reasoning. It integrates upstream evidence from pose estimation, tracking, object recognition, environment understanding, relationship reasoning, interaction intent, behavioral signals, and temporal analysis into coherent movement semantics that support downstream reasoning without performing lower-level perception or policy enforcement.

### 1.2 In-Scope Responsibilities
This module is responsible for:
* defining a reusable movement ontology of primitive, composite, functional, sports, medical, domestic, educational, occupational, social, and recreational movement concepts;
* modeling how movement emerges from visual observations, joint dynamics, biomechanics, and temporal evolution;
* generating structured movement evidence, including temporal, biomechanical, interaction, and context signals;
* interpreting movement in relation to purpose, intent, environment, objects, and relationships;
* producing explainable movement conclusions with clear evidence, confidence, uncertainty, and alternative interpretations;
* mediating movement evidence for downstream policy, risk, medical, sports, and educational subsystems.

### 1.3 Out-of-Scope Responsibilities
This module is not responsible for:
* raw pose estimation or skeletal tracking,
* direct object recognition,
* clothing understanding,
* environment classification,
* sports classification,
* medical diagnosis,
* policy enforcement,
* content moderation decision-making,
* sensor-specific motion capture.

These responsibilities remain with dedicated upstream and downstream subsystems. Movement Overview consumes their outputs and provides aligned movement evidence.

### 1.4 Architectural Principles
The movement architecture is governed by the following principles:
* progressive semantic layering rather than flat activity labels;
* evidence accumulation across temporal, biomechanical, interaction, and contextual domains;
* explicit confidence and uncertainty propagation from upstream to downstream stages;
* explainability for every major movement conclusion;
* dependency-aware design with clearly defined inputs, outputs, and failure modes;
* future compatibility with evidence graphs, movement knowledge graphs, world models, and embodied AI.

---

## 2. Movement Semantic Pipeline

### 2.1 Overview
Movement semantics are constructed through a progressive pipeline in which each layer becomes valid only when sufficient evidence accumulates from the previous stage:

1. Visual Observation
2. Pose Evidence
3. Joint Dynamics
4. Body Mechanics
5. Movement Primitives
6. Movement Patterns
7. Functional Activities
8. Behavioral Meaning
9. Intent Evidence
10. Contextual Interpretation
11. Explainable Movement Understanding
12. Policy Evidence

Each transition is governed by explicated evidence and uncertainty.

### 2.2 Visual Observation
Visual observation is the first layer of evidence. It includes:
* detection of human form and body silhouette,
* boundaries of visible limbs,
* contextual surfaces and support structures,
* apparent object contact zones.

Visual observation is necessary but not sufficient for movement semantics. It provides the raw scene structure that enables subsequent pose and motion evidence.

### 2.3 Pose Evidence
Pose evidence captures the spatial configuration of body joints and segments. It includes:
* joint locations,
* limb orientations,
* body segment angles,
* relative alignment of torso, pelvis, and head.

Pose evidence becomes valid when pose estimation confidence is adequate and temporal consistency supports a stable skeletal interpretation.

### 2.4 Joint Dynamics
Joint dynamics represent the temporal evolution of joint movement. Evidence includes:
* joint velocity,
* joint acceleration,
* angular velocity,
* joint trajectory curvature.

This layer makes movement inference valid because it distinguishes static posture from active motion and supports biomechanical analysis.

### 2.5 Body Mechanics
Body mechanics combines joint dynamics with alignment, ranges of motion, balance, and coordination. It includes:
* movement planes,
* joint kinematics,
* postural stability,
* weight transfer,
* symmetry.

Body mechanics provides the physical explanation for how movement is being executed and why certain movement primitives are plausible.

### 2.6 Movement Primitives
Movement primitives are atomic movement units such as:
* step,
* reach,
* bend,
* lift,
* push,
* pull,
* squat,
* twist,
* rotate,
* extend,
* contract.

Primitives become valid when body mechanics indicates a repeatable mechanical pattern and when temporal evidence shows execution over time.

### 2.7 Movement Patterns
Movement patterns are structured groups of primitives that exhibit recognizable temporal and spatial structure. Examples include:
* gait cycle,
* jump sequence,
* throw motion,
* carry transition,
* turn and pivot.

Patterns become valid when multiple primitives occur in a consistent sequence and when supporting contextual evidence aligns with a known activity domain.

### 2.8 Functional Activities
Functional activities link movement patterns to purpose. Examples include:
* walking to transport,
* lifting to load,
* reaching to grasp,
* stepping to climb,
* bending to inspect.

Functional activities become valid when environmental and object evidence indicate a goal-oriented behavior rather than arbitrary motion.

### 2.9 Behavioral Meaning
Behavioral meaning interprets activities in social and relational terms, such as:
* cooperative assistance,
* defensive avoidance,
* instructional demonstration,
* caregiving support,
* recreational play.

Behavioral meaning becomes valid when movement evidence interacts with relationship, intent, and contextual evidence.

### 2.10 Intent Evidence
Intent evidence is inferred from the alignment of movement, objects, environment, and interaction. It includes:
* goal-directed motion,
* directional persistence toward an object or location,
* coordination with others,
* preparatory and concluding actions.

Intent evidence becomes valid when sufficient functional activity and context evidence support a coherent purpose.

### 2.11 Contextual Interpretation
Contextual interpretation situates movement within the broader setting and domain. It integrates evidence from environment, room type, activity category, and known social or task conventions.

It becomes valid when upstream movement and context evidence converge on a consistent scene interpretation.

### 2.12 Explainable Movement Understanding
This layer produces traceable movement conclusions with explicit supporting evidence, conflicting evidence, confidence, uncertainty, and alternatives.

It becomes valid when the reasoning chain from visual observation to context is documented and coherent.

### 2.13 Policy Evidence
Policy evidence translates movement understanding into signals that can inform downstream moderation, safety, or risk engines without making policy decisions.

It becomes valid when movement conclusions are sufficiently supported and when uncertainty is quantified.

## 3. Movement Knowledge Model

### 3.1 Biomechanics
Biomechanics is the scientific foundation of movement understanding. It includes:
* joint kinematics,
* segmental forces,
* balance and stability,
* leverage and moment arms,
* posture quality.

Movement Overview uses biomechanical reasoning to distinguish efficient movement from awkward or potentially unsafe motion.

### 3.2 Motor Control
Motor control describes how the central nervous system organizes movement. Movement Overview models:
* feedforward planning,
* feedback correction,
* rhythm and timing,
* coordination between limbs.

This reasoning layer is applied conceptually through observed movement smoothness, repetition consistency, and adaptive transitions.

### 3.3 Functional Movement
Functional movement is the relationship between motion and task goals. It includes:
* transport,
* manipulation,
* stabilization,
* exploration,
* communication.

Functional movement is essential for moving beyond mere motion to meaningful activity.

### 3.4 Purpose
Purpose describes the intended outcome of motion. It may be explicit, such as reaching for a cup, or inferred, such as moving to evacuate a building.

Purpose is validated by combining movement, object, environment, and relationship evidence.

### 3.5 Environment
Environment shapes movement choices and constraints. Evidence includes:
* surface type,
* obstacles,
* available tools,
* spatial affordances.

Movement semantics are adjusted by environmental context.

### 3.6 Objects
Objects are integral to many movements. Object evidence includes:
* contact points,
* manipulation trajectories,
* object affordances.

Movement Overview uses object evidence to infer whether motion is carrying, pushing, pulling, holding, or avoiding.

### 3.7 Relationships
Relationship evidence captures how movement is coordinated with others, including assistance, cooperation, competition, and proximity management.

This evidence is essential for interpreting social and interactive movements.

### 3.8 Human Intent
Human intent is the cognitive direction behind movement. It is inferred from movement persistence, preparatory actions, and contextual goals.

Intent evidence is not a direct observation but a higher-order interpretation anchored in movement and context.

### 3.9 Temporal Evolution
Temporal evolution captures how movement changes over time, including initiation, continuation, interruption, completion, and transition.

This model prevents movement interpretation from relying solely on isolated frames.

### 3.10 Context
Context includes activity domain, social setting, physical location, and purpose. It is used to ground movement semantics in real-world meaning.

Movement Overview integrates context to avoid misclassification of generic motion.

## 4. Movement Evidence Architecture

### 4.1 Evidence Categories
The movement architecture classifies evidence into:
* Primary Evidence,
* Supporting Evidence,
* Temporal Evidence,
* Biomechanical Evidence,
* Pose Evidence,
* Interaction Evidence,
* Object Evidence,
* Environmental Evidence,
* Behavioral Evidence,
* Relationship Evidence,
* Context Evidence,
* Negative Evidence,
* Conflicting Evidence,
* Weak Evidence,
* Strong Evidence,
* Evidence Reliability,
* Evidence Consistency,
* Evidence Sufficiency.

Each movement category is defined by these evidence dimensions.

### 4.2 Primary Evidence
Primary evidence includes direct observations that strongly support a movement hypothesis, such as:
* a full gait cycle captured across frames,
* a distinct lifting posture with object contact,
* a coordinated partner lift visible in sequence.

Primary evidence is necessary to establish strong movement confidence.

### 4.3 Supporting Evidence
Supporting evidence includes related signals that reinforce the primary hypothesis, such as:
* contextual room type,
* object affordances,
* temporal persistence of motion.

Supporting evidence is necessary when primary evidence is incomplete or ambiguous.

### 4.4 Temporal Evidence
Temporal evidence captures how movement evolves over time. Key elements include:
* movement initiation,
* cycle detection,
* repetition counting,
* cadence estimation,
* transition points,
* movement completion.

Temporal evidence makes movement hypotheses robust and less sensitive to isolated frames.

### 4.5 Biomechanical Evidence
Biomechanical evidence includes:
* joint angles,
* limb trajectories,
* center-of-mass movement,
* balance and stability metrics,
* movement planes.

This evidence distinguishes biomechanically plausible movements from improbable or synthetic motion.

### 4.6 Pose Evidence
Pose evidence provides the structural basis for movement. It includes:
* joint positions,
* limb alignment,
* orientation of the trunk,
* head and gaze alignment.

Pose evidence is a prerequisite for most movement interpretations.

### 4.7 Interaction Evidence
Interaction evidence captures how movement engages with other entities, including:
* partner coordination,
* physical contact,
* following and leading dynamics,
* shared object manipulation.

This evidence is key for cooperative and social movement semantics.

### 4.8 Object Evidence
Object evidence links movement to physical artifacts and tools. It includes:
* object contact timing,
* grasp and release patterns,
* object trajectory relative to body motion.

Objects provide clear affordances that shape movement meaning.

### 4.9 Environmental Evidence
Environmental evidence describes the surroundings that constrain and guide movement. It includes:
* floor surfaces,
* stairs,
* furniture,
* open spaces,
* specialized equipment.

This evidence is essential for distinguishing movements such as climbing stairs from stepping in place.

### 4.10 Behavioral Evidence
Behavioral evidence links movement to observable goals or affective states, such as:
* deliberate pacing,
* hesitation,
* exploratory motion,
* escape behavior.

This evidence refines movement semantics beyond physical kinematics.

### 4.11 Relationship Evidence
Relationship evidence captures the social context of movement, such as:
* assisting another person,
* moving together in formation,
* giving way,
* maintaining interpersonal distance.

These signals are important for collaborative, protective, and social movement interpretation.

### 4.12 Context Evidence
Context evidence includes domain-specific signals such as:
* sports venue,
* medical clinic,
* classroom,
* home environment.

Context evidence anchors movement interpretation to meaningful activity categories.

### 4.13 Negative Evidence
Negative evidence includes the absence of expected cues for a movement hypothesis. Examples include:
* no object contact in an expected carrying motion,
* no foot clearance in an apparent stepping action.

Negative evidence reduces confidence and raises uncertainty.

### 4.14 Conflicting Evidence
Conflicting evidence arises when different signals support incompatible interpretations. Examples include:
* a movement pattern consistent with walking while the environment indicates swimming,
* a lifting posture present but no object is visible.

Conflicting evidence is explicitly tracked and used to preserve alternative hypotheses.

### 4.15 Weak Evidence
Weak evidence is low-quality, partial, or noisy. Examples include:
* blurred limb motion,
* occluded joints,
* intermittent tracking loss.

Weak evidence may contribute to a hypothesis only when stronger evidence is absent or when corroborated by other modalities.

### 4.16 Strong Evidence
Strong evidence is clear, repeated, and consistent. It includes:
* complete gait cycles with stable tracking,
* visible object handling with biomechanically plausible motion,
* environmental context that matches the movement category.

Strong evidence supports high movement confidence.

### 4.17 Evidence Reliability
Evidence reliability evaluates the trustworthiness of each source based on:
* signal quality,
* temporal stability,
* modality independence,
* subsystem confidence.

Reliable evidence receives greater weight in movement conclusions.

### 4.18 Evidence Consistency
Evidence consistency measures agreement across sources. Consistent evidence across pose, biomechanics, objects, and context increases confidence.

### 4.19 Evidence Sufficiency
Evidence sufficiency assesses whether the collected evidence is adequate to support a movement hypothesis. It takes into account the quantity, quality, and coherence of evidence.

Evidence sufficiency is required before declaring movement understanding stable and explainable.

## 5. Movement Ontology Enrichment

### 5.1 Hierarchical Movement Ontology
The movement ontology is organized hierarchically into reusable semantic layers rather than flat lists. Layers include:
* primitive movements,
* composite movements,
* functional movements,
* sports movements,
* medical movements,
* occupational movements,
* educational movements,
* domestic movements,
* emergency movements,
* social movements,
* recreational movements,
* collaborative movements,
* protective movements.

This hierarchy supports transfer of knowledge across domains.

### 5.2 Primitive Movements
Primitive movements are the most basic human motions. Examples include:
* reach,
* grasp,
* lower,
* twist,
* rotate.

Primitives are the building blocks for more complex movement patterns.

### 5.3 Composite Movements
Composite movements combine primitives into structured actions. Examples include:
* lunge,
* squat,
* climb,
* throw,
* catch.

Composite movements are recognized through sequential primitive evidence and temporal continuity.

### 5.4 Functional Movements
Functional movements are task-oriented actions performed for practical purposes. Examples include:
* carrying groceries,
* opening a door,
* transferring a patient,
* cleaning a surface.

Functional movements are validated through object and environmental evidence.

### 5.5 Sports Movements
Sports movements are domain-specific actions used in athletic activities. Examples include:
* dribbling in basketball,
* serving in tennis,
* kicking in soccer,
* swinging in baseball.

Sports movements are interpreted through movement patterns together with sports context.

### 5.6 Medical Movements
Medical movements include clinically relevant behaviors such as:
* tremor,
* assisted movement,
* respiratory motion,
* involuntary oscillation.

These movements are distinguished by medical context and diagnostic intent.

### 5.7 Occupational Movements
Occupational movements include work-related actions such as:
* lifting boxes,
* operating machinery,
* typing,
* welding.

These movements are grounded in task and workplace context.

### 5.8 Educational Movements
Educational movements include demonstrations, practice drills, and instructional actions such as:
* demonstrating a technique,
* following a teacher’s movement,
* practicing a sequence.

These movements are interpreted within learning and coaching contexts.

### 5.9 Domestic Movements
Domestic movements include everyday household activities such as:
* walking through a room,
* cleaning,
* preparing food,
* caring for a child.

These movements are aligned with residential environment evidence.

### 5.10 Emergency Movements
Emergency movements include urgent or protective actions such as:
* running to exit,
* assisting a fallen person,
* bracing for impact.

These movements are characterized by speed changes, urgency cues, and safety-critical context.

### 5.11 Social Movements
Social movements include actions that manage interpersonal interaction, such as:
* approaching another person,
* maintaining distance,
* gesturing,
* offering assistance.

These actions are interpreted through relationship and behavioral evidence.

### 5.12 Recreational Movements
Recreational movements include leisure activities such as:
* playing with a ball,
* dancing,
* stretching.

These movements are primarily identified through environment, object, and behavioral context.

### 5.13 Collaborative Movements
Collaborative movements occur when multiple individuals coordinate in a shared task. Examples include:
* carrying a table together,
* synchronized dance,
* team lifting.

These movements are recognized through timing alignment and shared intent indications.

### 5.14 Protective Movements
Protective movements are defensive or safety-oriented, such as:
* shielding oneself,
* catching a falling object,
* stepping back from danger.

These movements are inferred from rapid motion, postural bracing, and threat context.

## 6. Temporal Movement Intelligence

### 6.1 Movement Initiation
Movement initiation captures the first observable change from static posture to motion. Evidence includes:
* preparatory joint tension,
* shifting weight,
* anticipatory reach.

Initiation evidence supports understanding of intent and action onset.

### 6.2 Movement Continuation
Movement continuation tracks ongoing motion after initiation. Evidence includes:
* sustained joint velocities,
* repeated leg cycles,
* continuous directionality.

Continuation distinguishes purposeful movement from transient adjustments.

### 6.3 Movement Interruption
Movement interruption captures sudden pauses, hesitations, or cancellations. Evidence includes:
* abrupt velocity drops,
* stalled joint trajectories,
* changes in direction without completion.

Interruption evidence is important for detecting uncertainty, caution, or external influence.

### 6.4 Movement Completion
Movement completion identifies when an action reaches its intended end state. Evidence includes:
* arrival at a target location,
* final object placement,
* stabilized posture.

Completion evidence validates the success of the inferred activity.

### 6.5 Movement Transitions
Movement transitions describe shifts between different actions or states. Examples include:
* standing to walking,
* walking to reaching,
* lifting to carrying.

Transitions are supported by temporal continuity and pattern matching.

### 6.6 Movement Persistence
Movement persistence measures how long a movement pattern continues. Evidence includes:
* repeated cycles,
* sustained forceful motion,
* prolonged engagement with an object.

Persistence supports confidence in activity recognition.

### 6.7 Behavior Evolution
Behavior evolution captures gradual changes in movement over a session, such as:
* increasing speed,
* decreasing amplitude due to fatigue,
* shifting strategy.

This evidence helps distinguish exercise progression from static motion.

### 6.8 Activity Progression
Activity progression observes the sequence of events within an activity, including:
* warm-up,
* task execution,
* cool-down.

Progression evidence is useful in exercise, rehabilitation, and instructional contexts.

### 6.9 Session History
Session history aggregates movement evidence over longer periods, such as minutes or hours. It includes:
* movement repetition patterns,
* cumulative motion load,
* changes in tempo over time.

Session history supports higher-level interpretations such as workout, work shift, or therapy session.

### 6.10 Long-Term Temporal Consistency
Long-term temporal consistency assesses whether movement interpretations remain stable across multiple scenes or episodes. It prevents overfitting to isolated frames and supports robust reasoning.

### 6.11 Importance of Temporal Context
Identical frames may imply different movement interpretations depending on temporal history. For example:
* one frame of a bent knee may be part of a squat, a reaching motion, or a stumble;
* a single hand raised may be reaching, waving, or preparing to catch.

Temporal context resolves these ambiguities.

## 7. Biomechanical Framework

### 7.1 Joint Kinematics
Joint kinematics describe motion at the joint level. Key components include:
* flexion and extension,
* abduction and adduction,
* rotation,
* joint angular velocity.

Kinematic evidence distinguishes movement quality and plausibility.

### 7.2 Body Alignment
Body alignment describes the relative orientation of body segments. Evidence includes:
* spine posture,
* pelvic tilt,
* shoulder alignment,
* head position.

Alignment supports assessment of efficient and safe movement.

### 7.3 Movement Planes
Movement occurs in anatomical planes: sagittal, frontal, and transverse. Evidence includes:
* forward-backward motion,
* side-to-side motion,
* rotational motion.

Plane evidence explains the mechanical demands of a movement.

### 7.4 Range of Motion
Range of motion captures the extent of joint displacement. Evidence includes:
* maximal flexion,
* extension range,
* joint excursion.

This evidence contributes to distinguishing different movement categories and identifying limitations.

### 7.5 Coordination
Coordination describes how limbs and segments move together. Evidence includes:
* sequential timing,
* bilateral symmetry,
* inter-limb rhythm.

Coordination is essential for complex functional and sports movements.

### 7.6 Balance
Balance evidence assesses stability of the center of mass relative to the base of support. It includes:
* weight shifts,
* support limb engagement,
* corrective motions.

Balance evidence distinguishes stable locomotion from unstable or protective movement.

### 7.7 Symmetry
Symmetry evidence evaluates similarity between left and right body segments. It includes:
* bilateral gait parameters,
* symmetric limb loading,
* mirrored joint angles.

Symmetry informs movement quality and can indicate pathology or compensation.

### 7.8 Posture Quality
Posture quality evidence describes whether the body maintains appropriate alignment during movement. It includes:
* neutral spine,
* effective head position,
* relaxed shoulders.

Good posture quality supports safe and purposeful movement interpretation.

## 8. Multi-Person Movement Framework

### 8.1 Cooperative Movement
Cooperative movement occurs when two or more people coordinate actions toward a shared task. Examples include:
* carrying furniture together,
* synchronized lifting,
* team rowing.

Evidence includes temporal alignment, shared object contact, and consistent goals.

### 8.2 Synchronized Movement
Synchronized movement involves individuals matching timing, rhythm, or posture. Examples include:
* group dance,
* military marching,
* partner gymnastics.

Synchronized movement is supported by oscillatory frequency alignment and shared motion patterns.

### 8.3 Team Activities
Team activities involve coordinated movement within a group sport or task. Examples include:
* passing a ball,
* defensive formation,
* collective transport.

Team movement evidence includes role differentiation and interactive timing.

### 8.4 Partner Exercises
Partner exercises are collaborative training movements such as:
* assisted stretching,
* partner resistance drills,
* shared balance challenges.

Evidence includes mutual physical contact and intent signals.

### 8.5 Sports Interactions
Sports interactions include movement patterns specific to competitive play, such as:
* chasing,
* marking,
* passing,
* blocking.

These are interpreted through sports context and movement coordination.

### 8.6 Group Coordination
Group coordination describes how multiple individuals adjust their movements to achieve collective goals. Evidence includes:
* spacing maintenance,
* synchronous transitions,
* shared trajectories.

Group coordination supports social and recreational movement semantics.

## 9. Movement Ontology Examples

### 9.1 Locomotion
Locomotion includes movement patterns that transport the body from one location to another.

#### 9.1.1 Walking
* Observable Evidence: alternating foot contact, heel strike, toe-off, upright posture.
* Temporal Evidence: cadence around 90-130 steps per minute, repeated gait cycles.
* Contextual Evidence: flat surface, pathway, hallway.
* Ambiguity Sources: marching, shuffling, slow running.
* Downstream Interpretation: general transport movement, often safe and everyday.

#### 9.1.2 Running
* Observable Evidence: flight phase, forward lean, higher hip extension.
* Temporal Evidence: increased cadence, greater joint velocities.
* Contextual Evidence: track, road, athletic environment.
* Ambiguity Sources: hurried walking, sprinting drills.
* Downstream Interpretation: higher-intensity transport or athletic activity.

#### 9.1.3 Jogging
* Observable Evidence: moderate speed, rhythmic gait, relaxed stride.
* Temporal Evidence: stable cadence between walking and running.
* Contextual Evidence: park, track, fitness area.
* Ambiguity Sources: leisurely running, brisk walking.
* Downstream Interpretation: conditioning movement with lower intensity than running.

#### 9.1.4 Stair Climbing
* Observable Evidence: upward stepping, knee flexion, handrail use.
* Temporal Evidence: repeated step cycles with vertical displacement.
* Contextual Evidence: stairway, steps, indoor or outdoor stair structure.
* Ambiguity Sources: ladder climbing, step aerobics.
* Downstream Interpretation: vertical transport movement often task-oriented.

#### 9.1.5 Hiking
* Observable Evidence: variable terrain gait, occasional use of poles.
* Temporal Evidence: irregular cadence, intermittent rest.
* Contextual Evidence: trail, natural environment.
* Ambiguity Sources: trail running, outdoor walking.
* Downstream Interpretation: sustained outdoor locomotion with endurance emphasis.

### 9.2 Fitness
Fitness movements are goal-directed physical activities for conditioning.

#### 9.2.1 Strength Training
* Observable Evidence: heavy lifting, controlled eccentric and concentric phases.
* Temporal Evidence: repeated reps and sets, pauses between efforts.
* Contextual Evidence: gym equipment, weight plates.
* Ambiguity Sources: manual labor lifting, moving furniture.
* Downstream Interpretation: conditioning activity focused on muscular force production.

#### 9.2.2 Cardio
* Observable Evidence: rhythmic continuous movement, elevated arm and leg motion.
* Temporal Evidence: sustained pace and repetition.
* Contextual Evidence: treadmill, bike, track.
* Ambiguity Sources: dance, brisk walking.
* Downstream Interpretation: endurance activity with cardiovascular emphasis.

#### 9.2.3 Mobility Work
* Observable Evidence: joint-controlled motion, stretching, slow transition.
* Temporal Evidence: low cadence, extended range of motion.
* Contextual Evidence: mat, rehabilitation equipment.
* Ambiguity Sources: yoga, physical therapy exercises.
* Downstream Interpretation: movement focused on flexibility and joint health.

#### 9.2.4 Stretching
* Observable Evidence: static or slow elongation, anchored posture.
* Temporal Evidence: held positions over several seconds.
* Contextual Evidence: gym mat, fitness studio.
* Ambiguity Sources: resting postures, balancing.
* Downstream Interpretation: recovery or preparation movement emphasizing lengthening tissues.

#### 9.2.5 Conditioning
* Observable Evidence: varied motion sequences, moderate intensity.
* Temporal Evidence: repeated circuits, transitional movements.
* Contextual Evidence: training zone, instructor presence.
* Ambiguity Sources: occupational activity, active play.
* Downstream Interpretation: structured physical activity aimed at overall fitness.

### 9.3 Sports
Sports movements occur within competitive or recreational athletic contexts.

#### 9.3.1 Team Sports
* Observable Evidence: passing motions, defensive shifts, strategic positioning.
* Temporal Evidence: quick transitions, coordinated group movement.
* Contextual Evidence: field, court, team uniforms.
* Ambiguity Sources: informal play, group exercise.
* Downstream Interpretation: coordinated athletic movement within a team context.

#### 9.3.2 Racket Sports
* Observable Evidence: swings, lunges, shuttlecock or ball contact.
* Temporal Evidence: rapid directional changes, repeated strokes.
* Contextual Evidence: court lines, net.
* Ambiguity Sources: martial arts forms, performance gestures.
* Downstream Interpretation: sport-specific striking and movement sequences.

#### 9.3.3 Combat Sports
* Observable Evidence: kicks, punches, guard postures, evasive steps.
* Temporal Evidence: bursty action, rhythm of attack and defense.
* Contextual Evidence: ring, mat, gloves.
* Ambiguity Sources: dance combat scenes, staged fight choreography.
* Downstream Interpretation: physical contest movement with defensive and offensive intent.

#### 9.3.4 Swimming
* Observable Evidence: alternating arm strokes, leg kicks, body rolling.
* Temporal Evidence: cyclic motion with fluid resistance.
* Contextual Evidence: pool, water surface.
* Ambiguity Sources: water-based therapy, aquatic play.
* Downstream Interpretation: locomotion within water requiring buoyancy and propulsion.

#### 9.3.5 Rowing
* Observable Evidence: seated pull, synchronized leg extension, handle motion.
* Temporal Evidence: repeated stroke cycles.
* Contextual Evidence: boat, rowing machine.
* Ambiguity Sources: seated rowing rehabilitation, fitness equipment use.
* Downstream Interpretation: coordinated full-body pulling movement for sport or conditioning.

### 9.4 Rehabilitation
Rehabilitation movements support recovery and therapeutic goals.

#### 9.4.1 Physiotherapy
* Observable Evidence: assisted movement, slow controlled range of motion.
* Temporal Evidence: deliberate repetitions, pauses for feedback.
* Contextual Evidence: clinic, therapist presence.
* Ambiguity Sources: fitness classes, coaching.
* Downstream Interpretation: clinically guided movement for restoration.

#### 9.4.2 Gait Training
* Observable Evidence: walking with assistance, use of aids.
* Temporal Evidence: repeated step cycles with guidance.
* Contextual Evidence: therapy room, parallel bars.
* Ambiguity Sources: walking exercise, mobility drills.
* Downstream Interpretation: movement focused on restoring walking function.

#### 9.4.3 Balance Exercises
* Observable Evidence: slow shifting, single-leg stance, support use.
* Temporal Evidence: sustained holds, corrective adjustments.
* Contextual Evidence: balance pads, therapist support.
* Ambiguity Sources: dance practice, yoga.
* Downstream Interpretation: movement aimed at equilibrium and stability.

#### 9.4.4 Post-Operative Recovery
* Observable Evidence: guarded motion, reduced range, assistive devices.
* Temporal Evidence: gradual progression and cautious speed.
* Contextual Evidence: hospital room, recovery area.
* Ambiguity Sources: resting postures, non-clinical assistance.
* Downstream Interpretation: healing-focused movement under clinical supervision.

### 9.5 Dance & Performance
Movement in performance contexts is expressive and choreographed.

#### 9.5.1 Ballet
* Observable Evidence: turnout, pointed feet, extended lines.
* Temporal Evidence: controlled sequences, rhythmic phrasing.
* Contextual Evidence: studio, stage, barre.
* Ambiguity Sources: gymnastics, acrobatics.
* Downstream Interpretation: formal expressive movement with aesthetic goals.

#### 9.5.2 Contemporary Dance
* Observable Evidence: fluid torso articulation, grounded movement.
* Temporal Evidence: variable tempo, improvisational structure.
* Contextual Evidence: studio, rehearsal space.
* Ambiguity Sources: modern fitness movement.
* Downstream Interpretation: artistic movement emphasizing expression.

#### 9.5.3 Stage Performance
* Observable Evidence: exaggerated gestures, audience-facing orientation.
* Temporal Evidence: repeated cues, dramatic timing.
* Contextual Evidence: theatre stage, lighting.
* Ambiguity Sources: live instructional demonstration.
* Downstream Interpretation: performance movement intended for an audience.

#### 9.5.4 Choreography
* Observable Evidence: patterned sequences, synchronized partners.
* Temporal Evidence: repeated motifs, intentional transitions.
* Contextual Evidence: rehearsal or stage environment.
* Ambiguity Sources: group exercise routines.
* Downstream Interpretation: structured artistic movement with compositional intent.

### 9.6 Medical Movement
Medical movements have diagnostic or therapeutic significance.

#### 9.6.1 Tremor
* Observable Evidence: involuntary oscillation of limbs or head.
* Temporal Evidence: rhythmic repetition at a characteristic frequency.
* Contextual Evidence: clinical exam, medication setting.
* Ambiguity Sources: voluntary trembling due to cold, rapid movement artifacts.
* Downstream Interpretation: potential clinical symptom requiring medical evidence.

#### 9.6.2 Assisted Movement
* Observable Evidence: external support, therapist hands guiding limbs.
* Temporal Evidence: slow, controlled trajectories with pauses.
* Contextual Evidence: rehabilitation clinic, hospital.
* Ambiguity Sources: personal training assistance.
* Downstream Interpretation: supported movement for recovery or therapy.

#### 9.6.3 Respiratory Motion
* Observable Evidence: chest and abdominal expansion and contraction.
* Temporal Evidence: cyclical breathing rate.
* Contextual Evidence: clinical setting, monitoring equipment.
* Ambiguity Sources: exercise-induced breathing changes.
* Downstream Interpretation: physiological movement related to respiration.

#### 9.6.4 Involuntary Oscillation
* Observable Evidence: uncontrolled limb or body shaking.
* Temporal Evidence: irregular frequency, inconsistent amplitude.
* Contextual Evidence: medical examination.
* Ambiguity Sources: equipment vibration, external disturbance.
* Downstream Interpretation: movement possibly indicative of neuromuscular condition.

## 10. Confidence Architecture

### 10.1 Confidence Dimensions
Movement confidence is modeled across multiple dimensions:
* Observation Confidence,
* Pose Confidence,
* Movement Confidence,
* Activity Confidence,
* Context Confidence,
* Intent Confidence,
* Decision Confidence.

### 10.2 Observation Confidence
Observation confidence measures the reliability of raw visual input, including:
* image quality,
* detection stability,
* scene illumination,
* visibility.

### 10.3 Pose Confidence
Pose confidence measures trust in the extracted skeletal or joint representation. It influences all downstream movement reasoning.

### 10.4 Movement Confidence
Movement confidence reflects how strongly joint dynamics and temporal patterns support a movement hypothesis.

### 10.5 Activity Confidence
Activity confidence measures trust in the inferred functional activity based on movement patterns and context.

### 10.6 Context Confidence
Context confidence measures trust in environment and domain evidence that grounds movement meaning.

### 10.7 Intent Confidence
Intent confidence measures trust in inferred purpose or goal behind the movement.

### 10.8 Decision Confidence
Decision confidence is the final composite score that downstream systems can use as a graded signal.

### 10.9 Confidence Propagation
Confidence propagates progressively through the movement pipeline. Weak observation or pose confidence reduces movement confidence, which in turn reduces activity and intent confidence. The architecture preserves the source of confidence at each layer.

## 11. Uncertainty Architecture

### 11.1 First-Class Uncertainty
Uncertainty is represented explicitly across movement reasoning stages rather than being implied by low confidence.

### 11.2 Tracking Ambiguity
Tracking ambiguity arises when the identity or position of body segments is unclear. Evidence includes intermittent joint visibility and sudden tracking jumps.

### 11.3 Pose Ambiguity
Pose ambiguity occurs when multiple plausible skeletal configurations fit the available visual data.

### 11.4 Movement Ambiguity
Movement ambiguity arises when observed motion could correspond to different primitives or activities.

### 11.5 Interaction Ambiguity
Interaction ambiguity arises when it is unclear whether movement is independent or part of a coordinated interactive behavior.

### 11.6 Context Ambiguity
Context ambiguity occurs when environment or domain evidence is insufficient to determine whether movement is recreational, occupational, or medical.

### 11.7 Environment Ambiguity
Environment ambiguity occurs when the scene lacks clear spatial or functional cues.

### 11.8 Identity Ambiguity
Identity ambiguity occurs when it is unclear whether repeated movement frames correspond to the same individual or different people.

### 11.9 Partial Visibility
Partial visibility uncertainty arises when body segments are occluded by objects, people, or scene elements.

### 11.10 Motion Blur
Motion blur uncertainty arises from rapid movement relative to sensor exposure, leading to degraded evidence quality.

### 11.11 Viewpoint Uncertainty
Viewpoint uncertainty occurs when camera angle distorts the apparent motion or occludes critical joints.

### 11.12 Novel Movements
Novel movement uncertainty arises when the observed behavior does not fit known movement taxonomies.

### 11.13 Synthetic Movements
Synthetic movement uncertainty arises when motion appears generated or manipulated, such as by animation or frame interpolation.

### 11.14 Conflicting Observations
Conflicting observation uncertainty occurs when different sources disagree about the same movement.

### 11.15 Uncertainty Propagation
Uncertainty flows from low-level observations through pose and movement reasoning to activity and intent interpretation. If upstream uncertainty is high, downstream conclusions inherit that uncertainty and require more conservative interpretation.

### 11.16 Uncertainty Communication
The module communicates uncertainty through structured outputs such as:
* uncertainty profile,
* uncertainty reasons,
* alternative hypotheses,
* dependency warnings.

This allows downstream systems to treat movement evidence appropriately.

## 12. Explainability Framework

### 12.1 Explainability Requirements
Every important movement conclusion must explain:
* observed evidence,
* why the evidence matters,
* which evidence supports the conclusion,
* which evidence contradicts it,
* temporal evidence of motion,
* biomechanical evidence,
* behavioral evidence,
* object evidence,
* environmental evidence,
* confidence levels,
* remaining uncertainty,
* alternative interpretations,
* reasoning chain,
* subsystem contributions,
* final rationale.

### 12.2 Explanation Components
Explanations include:
* observation summary,
* evidence taxonomy,
* confidence profile,
* uncertainty profile,
* dominant reasoning pathway,
* alternatives considered,
* final semantic label.

### 12.3 Traceability
Explanations are traceable from the final conclusion back to the specific evidence sources and reasoning stages.

## 13. Dependency Graph

### 13.1 Required Inputs
Required movement inputs include:
* pose and joint evidence,
* tracking continuity,
* environment classification,
* interaction information,
* object contact evidence,
* behavioral signals.

### 13.2 Optional Inputs
Optional inputs include:
* sports domain signals,
* medical context signals,
* educational context signals,
* room type evidence,
* multi-person interaction signals.

Optional inputs enrich movement semantics but are not always necessary.

### 13.3 Produced Outputs
Movement Overview produces:
* movement hypotheses,
* functional activity labels,
* temporal evidence summaries,
* biomechanical interpretation,
* intent signals,
* confidence profiles,
* uncertainty profiles,
* explainability payloads.

### 13.4 Evidence Dependencies
Movement reasoning depends on evidence from upstream modules such as pose, tracking, objects, environment, and relationship. It requires multi-modal corroboration to resolve ambiguous motion.

### 13.5 Context Dependencies
Context dependencies link movement interpretation to environment, activity domain, and social setting. Without context, movement labels remain provisional.

### 13.6 Confidence Dependencies
Movement confidence depends on upstream observation and pose confidence, and on the consistency of movement, biomechanical, and contextual evidence.

### 13.7 Failure Dependencies
Failure dependencies occur when upstream inputs fail or disagree. Examples include occluded pose, misclassified environment, and tracking loss. Movement Overview documents these failures and reduces confidence accordingly.

### 13.8 Temporal Dependencies
Temporal dependencies are essential for movement interpretation. Movement evidence depends on prior frames, motion continuity, and session history.

### 13.9 Subsystem Contracts
Subsystem contracts define how movement evidence is consumed and produced. They specify:
* input types,
* required confidence levels,
* uncertainty annotations,
* output semantics,