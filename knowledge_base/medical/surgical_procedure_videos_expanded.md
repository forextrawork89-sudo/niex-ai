# Surgical Procedure Intelligence Framework

## Document Metadata
* **Module Name:** Surgical Procedure Intelligence
* **Document Version:** 2.0.0
* **Architectural Role:** Evidence-Centric Surgical Reasoning Layer within the Medical Subsystem
* **Domain:** Surgical Procedure Understanding, Clinical Workflow, Perioperative Evidence
* **Design Intention:** Architecture-first, evidence-driven, clinical-context-sensitive, explainability-focused, uncertainty-aware, and implementation-independent

---

## 1. Purpose and Scope

### 1.1 Primary Purpose
This module defines the surgical procedure intelligence framework for the medical subsystem. Its purpose is to accumulate and validate surgical evidence across visual, spatial, temporal, clinical, and workflow dimensions, and to provide downstream decision systems with structured, explainable surgical evidence. It is explicitly not a simple surgical scene detector or a classifier based on operating room appearance alone.

### 1.2 Scope
The module is responsible for:
* identifying evidence that supports the presence of a surgical procedure;
* distinguishing surgical workflows from other medical, educational, simulated, documentary, and non-surgical clinical scenes;
* validating evidence across anatomy, instruments, team interactions, patient state, procedure stages, environment, motion, and context;
* generating evidence outputs with confidence, uncertainty, provenance, alternatives, and failure modes;
* integrating with adjacent subsystems in the medical and multimodal pipeline while preserving strict architectural boundaries.

The module is not responsible for:
* raw object detection or pose estimation algorithms;
* diagnosis of medical conditions;
* direct policy decisions;
* identity or demographic inference;
* direct surgical step classification without supporting evidence fusion.

### 1.3 Architectural Constraints
The module must:
* avoid reliance on any single evidence source;
* express reasoning as evidence accumulation rather than hard labels;
* preserve the distinction between surgical evidence and medical or clinical evidence generally;
* support downstream interpretation by policy, risk, and educational reasoning modules;
* maintain terminology consistency with the broader medical knowledge base.

---

## 2. Surgical Evidence Model

The surgical evidence model categorizes evidence into twelve foundational types. Each type is defined in terms of reliability, mandatory and optional components, supporting evidence, contradictory evidence, missing evidence, and quality assessment.

### 2.1 Anatomical Evidence
Anatomical evidence describes the patientâ€™s observed anatomy and the interaction of surgical sites with the body.

#### Description
Anatomical evidence captures body location, tissue configuration, surgical site preparation, and relevant anatomical landmarks.

#### Evidence Reliability
High when the surgical field includes clearly visible anatomy, stable orientation, and recognizable patient positioning. Lower when anatomy is partially occluded, draped, or viewed at extreme angles.

#### Mandatory Evidence
* presence of an anatomical target area such as abdomen, chest, head, spine, pelvis, limb, or oral cavity;
* evidence of surgical field preparation around that area, such as drapes or exposure of tissue;
* anatomical markers consistent with a recognized surgical region.

#### Optional Evidence
* detailed internal anatomical features such as vessels, nerves, organs, bones, or cavities;
* surgical landmarks like the inguinal canal, femoral triangle, or retroperitoneal space;
* visible patient positioning devices that constrain anatomy.

#### Supporting Evidence
* tissue retraction revealing anatomy;
* surgical field orientation aligned with typical procedural approaches;
* patient positioning consistent with the target site.

#### Contradictory Evidence
* identical instruments used on a non-surgical model or simulator without actual anatomy;
* visual evidence limited to an anatomical poster, chart, or mannequin;
* surgical drapes present but no underlying anatomy visible.

#### Missing Evidence
* absence of a discernible anatomical target under the drape;
* surgical accessories present without anatomical exposure;
* patient body minimized to only hands or extremities with no procedure site.

#### Quality Assessment
Assess whether the anatomical evidence is explicit, contextual, or inferred. Explicit evidence is direct anatomy in the surgical field; contextual evidence is derived from positioning and drapes; inferred evidence is assumed from surrounding instruments or team actions.

### 2.2 Surgical Instrument Evidence
Surgical instrument evidence captures the presence, identity, and use of clinical tools associated with surgery.

#### Description
This evidence type includes scalpels, forceps, retractors, suturing devices, electrosurgical units, laparoscopic instruments, orthopaedic drills, and other tools that are purpose-built for surgical intervention.

#### Evidence Reliability
Reliable when instruments are clearly present and actively manipulated. Less reliable when object identity is ambiguous or when instruments appear incidentally.

#### Mandatory Evidence
* at least one surgical instrument in the immediate surgical field;
* evidence of instrument engagement with anatomy, surgical materials, or the operative site;
* instruments consistent with the claimed procedure category.

#### Optional Evidence
* instrument trays, sterilized back tables, or surgical carts;
* disposable packaging or sterile covers;
* instrument-specific peripherals such as laparoscopic towers, power cords, or irrigation lines.

#### Supporting Evidence
* instrument motion synchronized with tissue interaction;
* instrument positioning inside the sterile field;
* instrument type matching the procedure stage.

#### Contradictory Evidence
* surgical instrument-like shapes used for non-surgical tasks (e.g., kitchen knives, scissors in crafts);
* instrument presence without any evidence of surgical workflow or clinical context;
* reusable tool appearances in a simulation environment lacking patient interaction.

#### Missing Evidence
* no surgical instruments visible despite the presence of surgical drapes or sterilization indicators;
* only generic medical tools (stethoscopes, bandages) visible;
* instrument handles visible but tips absent from the operative field.

#### Quality Assessment
Evaluate instrument evidence based on clarity of identity, active use, and placement relative to the sterile field. High quality arises from direct tool-anatomy interaction; medium quality from clear instruments near the field; low quality from ambiguous shapes or distant instruments.

### 2.3 Surgical Team Evidence
Surgical team evidence documents the roles, coordination, and interactions of clinical staff within the procedure.

#### Description
This evidence type captures the visible presence of surgeons, assistants, scrub nurses, circulating nurses, anesthesiologists, and surgical technologists, as well as their actions.

#### Evidence Reliability
High when team members display role-specific attire, spatial relationships, and procedural behavior. Lower when team presence is implied or when the scene is crowded.

#### Mandatory Evidence
* at least one team member within the sterile field or adjacent to it;
* evidence of role-specific activity, such as instrument passing, retraction, or anesthesia monitoring;
* visible teamwork behaviors that align with surgical workflow.

#### Optional Evidence
* scrub caps, masks, gowns, gloves, and eye protection;
* verbal or gestural communication among team members;
* role-specific equipment like anesthesia machines or instrument trays.

#### Supporting Evidence
* coordinated movement around the sterile field;
* consistent sterile and non-sterile zones with team members respecting boundaries;
* team members handing instruments or verifying counts.

#### Contradictory Evidence
* multiple people in a clinical scene but no evidence of surgical coordination;
* team uniforms mixed with non-medical attire in a way inconsistent with surgery;
* individuals resembling a team but acting like observers or trainees outside the field.

#### Missing Evidence
* single-person scene with surgical instruments but no supporting team;
* team members in the background without surgical activity;
* indistinct human figures that cannot be attributed to surgical roles.

#### Quality Assessment
Assess team evidence by clarity of role, relevance to the procedure, and whether team actions contribute to the surgical workflow. High-quality evidence shows active, role-consistent team behavior; low quality is passive presence or non-sterile actions.

### 2.4 Patient Evidence
Patient evidence captures the patientâ€™s clinical state, position, preparation, and interaction with the surgical procedure.

#### Description
This evidence includes patient positioning, anesthesia interfaces, vital monitoring, drape placement, and physiological exposure relevant to the operative site.

#### Evidence Reliability
High when patient evidence is direct and clearly associated with the procedure. Lower when the patient is only partially visible or when non-patient objects resemble patient features.

#### Mandatory Evidence
* a patient body or relevant patient portion in the surgical field;
* evidence of patient positioning devices such as arm boards, leg holders, shoulder braces, or surgical tables;
* patient preparation artifacts such as antiseptic solutions, adhesive markers, or surgical draping.

#### Optional Evidence
* visible anesthesia devices attached to the patient, such as endotracheal tubes, intravenous lines, or monitoring leads;
* patient skin preparation patterns, hair removal, or surgical site marking;
* patient-specific support devices like foam pads, towels, or bladder scanners.

#### Supporting Evidence
* stable patient position appropriate for the procedure;
* direct patient-instrument interaction;
* perioperative monitoring visible alongside the patient.

#### Contradictory Evidence
* instruments and drapes present without a patient or patient surrogate;
* patient-like mannequins or cadaver models presented as live surgery;
* patient transfer equipment that indicates transport rather than surgery.

#### Missing Evidence
* absence of a clearly identifiable patient body part within the operative field;
* patient-related equipment present but not connected to a live patient;
* visible patient area outside the surgical zone with no procedural alignment.

#### Quality Assessment
Evaluate patient evidence for directness of connection to the surgical event. Highest quality arises from patient anatomy in contact with surgical action; lower quality arises from indirect patient presence or surrogate models.

### 2.5 Procedure Stage Evidence
Procedure stage evidence describes the current step within the surgical workflow and the evidence that differentiates it from adjacent stages.

#### Description
This evidence type tracks procedural progress through preparation, incision, exposure, primary intervention, reconstruction, closure, and recovery.

#### Evidence Reliability
Reliable when stage-specific activities, instruments, or materials are visible. Less reliable when stages overlap or the visual sequence is incomplete.

#### Mandatory Evidence
* at least one discernible surgical stage matched to visible workflow cues;
* stage-specific instruments, materials, or actions appropriate to the current phase;
* evidence of progression such as preparation preceding incision or closure following intervention.

#### Optional Evidence
* stage markers such as surgical count boards, time stamps, or procedural checklists;
* distinct stage-specific team behaviors, such as scrubbing versus suturing;
* stage-specific environment changes, such as sterile field expansion.

#### Supporting Evidence
* temporal continuity that aligns with the claimed procedure stage;
* repeated stage evidence across adjacent frames or video segments;
* instrument and anatomy evidence consistent with the stage.

#### Contradictory Evidence
* incision-level instruments used during preparation or closure without supporting context;
* stage labels or voice-over text indicating a different phase;
* visual cues that suggest a different stage than the one inferred.

#### Missing Evidence
* inability to determine the current stage due to limited visual access;
* no stage-specific instruments present;
* only general surgical activity visible without stage differentiation.

#### Quality Assessment
Assess stage evidence by its specificity and alignment with expected procedural progression. High quality occurs when stage evidence is explicit and supported by adjacent workflow cues.

### 2.6 Operating Room Evidence
Operating room evidence captures the physical environment and functional organization of the surgical setting.

#### Description
This evidence type includes the operating theater layout, room classification, environmental controls, and evidence of sterile and non-sterile zones.

#### Evidence Reliability
High when the room contains distinctive surgical architecture, equipment, and sterile field boundaries. Lower when scene elements are generic clinical or laboratory features.

#### Mandatory Evidence
* a room layout or venue that supports surgical activity, such as an operating theater, hybrid OR, ambulatory surgery center room, or emergency surgical suite;
* evidence of environment control measures such as overhead lighting, sterile drape coverage, or room signage;
* spatial zoning between sterile field and peripheral environment.

#### Optional Evidence
* OR-specific architectural elements such as laminar flow ceilings, pendant booms, or integrated cameras;
* adjacent monitoring stations, scrub sinks, or anesthesia workspaces;
* room signage identifying surgical service areas.

#### Supporting Evidence
* sterile field boundaries clearly separated from non-sterile areas;
* staff traffic flow consistent with operating room practice;
* environment cues such as surgical lighting and surgical instrument tables.

#### Contradictory Evidence
* clinical rooms with surgical-like equipment but not set up for active surgery;
* simulation labs or cadaver facilities that reuse OR furniture;
* scenes shot in classrooms, demonstration stages, or television sets using surgical props.

#### Missing Evidence
* no discernible room boundaries or environment context;
* absence of OR-specific environmental controls;
* surgical instruments placed in a generic room without evidence of surgical layout.

#### Quality Assessment
Evaluate operating room evidence by its ability to confirm a surgical workspace. High quality includes explicit OR architecture and sterile layout; medium quality includes surgical equipment in a nondescript clinical space.

### 2.7 Medical Equipment Evidence
Medical equipment evidence captures the broader clinical devices supporting the surgical procedure.

#### Description
This evidence encompasses anesthesia machines, patient monitors, electrosurgical units, suction, insufflators, imaging systems, and other equipment supporting the surgical workflow.

#### Evidence Reliability
Reliable when the equipment is directly connected to the surgical field, clearly active, and consistent with the procedure category. Less reliable when equipment is present but idle or unrelated.

#### Mandatory Evidence
* at least one medical device functionally associated with the surgical procedure;
* evidence of the device being used or ready for use in the operative field;
* device type consistency with procedure stage and patient type.

#### Optional Evidence
* monitoring displays with vital signs, waveform traces, or alarms;
* electrosurgical pencil handles, suction canisters, or insufflation tubing;
* imaging displays for fluoroscopy, endoscopy, ultrasound, or laparoscopic cameras.

#### Supporting Evidence
* direct connection of equipment to the patient or the sterile field;
* devices positioned within the surgical workflow line of sight;
* device activity reflecting real-time procedural status.

#### Contradictory Evidence
* equipment present but not active in the scene;
* clinical devices unrelated to surgery, such as infusion pumps in a ward room;
* imaging devices used for diagnostic scanning separate from surgery.

#### Missing Evidence
* no medical equipment visible despite a surgical-like scene;
* only generic clinical equipment visible;
* devices visible but not clearly connected or relevant.

#### Quality Assessment
Evaluate medical equipment evidence for functional relevance and operational engagement. High quality shows active equipment integrated with the procedure; low quality appears incidental.

### 2.8 Motion Evidence
Motion evidence captures the dynamic behavior of the surgical team, patient, and instruments over time.

#### Description
This evidence type includes surgical gestures, instrument trajectories, patient movement, team coordination, and changes in the operative field.

#### Evidence Reliability
High when motion is consistent with surgical manipulation and workflow. Lower when motion is noisy, degraded, or resembling non-surgical movement.

#### Mandatory Evidence
* dynamic motion consistent with surgical action, such as cutting, suturing, retracting, or manipulating tissues;
* motion of instruments and devices in the operative field;
* coordinated team movement around the surgical area.

#### Optional Evidence
* repeated surgical gestures such as suture tying or instrument passing;
* patient micro-movement due to ventilation or anesthetic adjustments;
* motion of fluid, smoke, or irrigation inflow and outflow.

#### Supporting Evidence
* instrument paths aligned with expected surgical actions;
* team members moving with purpose toward the sterile field;
* motion changes matching stage transitions.

#### Contradictory Evidence
* motion patterns more consistent with training drills, demonstration, or non-surgical tasks;
* instrument movement without tissue interaction;
* team movement that appears disorganized or unrelated to the field.

#### Missing Evidence
* static images with no motion context;
* motion within the scene but isolated from the operative field;
* only environmental motion unrelated to surgical action.

#### Quality Assessment
Assess motion evidence based on clarity of surgical activity, continuity across frames, and alignment with procedure stages. High quality is active surgery motion; low quality is incidental motion.

### 2.9 Workflow Evidence
Workflow evidence describes the operational process, sequencing, and coordination of surgical activity.

#### Description
This evidence includes procedural checklists, surgical counts, team roles, stage progression, and coordination mechanisms.

#### Evidence Reliability
Reliable when workflow cues are explicitly visible or logically inferred from stage progression. Less reliable when workflow is assumed from a single frame.

#### Mandatory Evidence
* evidence of organized progression through surgical stages;
* observable workflow artifacts such as count boards, labeled trays, or stage-specific team posture;
* coordination between team members with defined roles.

#### Optional Evidence
* visible surgical checklists, safety briefings, or timeout documentation;
* stage transitions indicated by equipment changes or drape repositioning;
* documented instrument counts or sponges.

#### Supporting Evidence
* repeated workflow cues across multiple segments;
* team actions clearly linked to known surgical workflow elements;
* stage-specific environmental changes.

#### Contradictory Evidence
* apparent workflow disorder, such as instruments scattered randomly;
* procedural steps that contradict the expected stage sequence;
* team members appearing unaware or uncoordinated.

#### Missing Evidence
* lack of observable workflow structure;
* single-frame evidence insufficient to infer workflow;
* team and instrument actions that do not suggest sequence.

#### Quality Assessment
Evaluate workflow evidence on the basis of explicitness and consistency. High quality occurs when workflow structure is visually or temporally evident.

### 2.10 Temporal Evidence
Temporal evidence captures the timing, duration, and sequence of surgical activity.

#### Description
This evidence type includes stage duration, repetition frequency, continuity, and timing relationships among actions.

#### Evidence Reliability
High when a consistent temporal narrative is available. Lower when the media is a single image, highly edited, or missing time context.

#### Mandatory Evidence
* temporal continuity or evidence of sequential surgical stages;
* duration cues such as repeated actions, elapsed time displays, or procedural segments;
* timing consistency with surgical workflow expectations.

#### Optional Evidence
* visible clocks, timers, or time stamps;
* repeated procedural cycles such as suture placement or instrument exchange;
* slow-motion or accelerated playback annotations indicating temporal structure.

#### Supporting Evidence
* stage transitions that proceed in an expected temporal order;
* motion rhythms consistent with surgical tasks;
* multiple frames or clips that preserve the procedural narrative.

#### Contradictory Evidence
* abrupt scene cuts that break workflow continuity;
* missing time information in a video sequence;
* temporal patterns inconsistent with the claimed stage or procedure.

#### Missing Evidence
* isolated still frames with no temporal context;
* video segments cut away from the surgical field;
* missing or unreliable time metadata.

#### Quality Assessment
Assess temporal evidence by continuity and logical stage progression. High quality comes from unbroken surgical sequences; low quality arises from edited or fragmented media.

### 2.11 Clinical Context Evidence
Clinical context evidence links the surgical activity to the broader medical setting.

#### Description
This evidence type includes clinical indication, patient diagnosis, preoperative planning, postoperative goals, and institutional context.

#### Evidence Reliability
Reliable when contextual cues are explicit, such as clinical monitors, documentation, or known surgical service settings. Less reliable when context is vague or absent.

#### Mandatory Evidence
* indications that the observed activity serves a clinical procedural goal;
* evidence of a surgical service or medical specialty consistent with the observed procedure;
* clinical support devices or documentation in the scene.

#### Optional Evidence
* visible patient charts, surgical notes, or consent forms;
* medical signage, departmental markers, or patient identifiers;
* references to clinical protocols, guidelines, or case type.

#### Supporting Evidence
* clinical devices and personnel consistent with a surgical setting;
* communication cues that reference clinical objectives;
* patient preparation and sterile technique matching the clinical context.

#### Contradictory Evidence
* clinical terminology used only as decoration or misdirection;
* medical-looking equipment in a non-clinical demonstration;
* context that suggests education or entertainment rather than clinical surgery.

#### Missing Evidence
* no visible clinical markers beyond surgical instruments or drapes;
* ambiguous facility type without surgical service indicators;
* patient context absent or unclear.

#### Quality Assessment
Evaluate clinical context evidence by how directly it supports legitimate surgical activity. High-quality evidence includes clear medical objectives; lower quality is implied or indirect.

### 2.12 Educational Context Evidence
Educational context evidence distinguishes teaching, demonstration, and training activity from live clinical surgery.

#### Description
This evidence type includes training aids, commentary, audience presence, and deliberate demonstration technique.

#### Evidence Reliability
Reliable when educational overlays, instructors, or deliberate teaching actions are visible. Lower when educational cues are subtle or the scene mixes clinical and training elements.

#### Mandatory Evidence
* evidence that the scene is intended for teaching, demonstration, or training;
* educational artifacts such as whiteboards, simulators, or audience seating;
* instructor-like behaviors such as explanation, pointing, or step-by-step demonstration.

#### Optional Evidence
* on-screen annotations, voice-over guidance, or curricula references;
* learner presence with observation roles;
* surgical mannequins, cadavers, animal models, or simulation environments.

#### Supporting Evidence
* clear separation of demonstration actions from clinical surgical actions;
* explicit mention of training or educational objectives;
* use of mock setups, models, or staged conditions.

#### Contradictory Evidence
* teaching artifacts in a genuinely live surgery setting used for documentation;
* educational overlays over clinical footage intended to describe real surgery;
* simulated procedures presented as live operations.

#### Missing Evidence
* no explicit teaching or training cues despite a training-like environment;
* educational context inferred solely from the presence of observers;
* ambiguous multimedia overlays that could be documentary rather than instructional.

#### Quality Assessment
Assess educational context evidence by explicitness and separation from clinical intent. High quality indicates actual training or demonstration; low quality is vague or incidental.

## 3. Surgical Reasoning Pipeline

This moduleâ€™s reasoning pipeline is strictly layered and evidence-centric. Each stage depends on the previous one while preserving independence from implementation details.

### 3.1 Pipeline Overview
The surgical reasoning pipeline proceeds as follows:
1. Visual Observation
2. Clinical Scene Evidence
3. Operating Room Evidence
4. Procedure Evidence
5. Workflow Evidence
6. Temporal Evidence
7. Clinical Context
8. Medical Interpretation
9. Confidence
10. Uncertainty
11. Risk Contribution
12. Policy Contribution
13. Explainable Surgical Decision

Each stage refines and integrates evidence, making explicit which sources are used and how uncertainty is propagated.

### 3.2 Visual Observation
This initial stage considers the raw visual input and extracts basic surgical cues.

Key responsibilities:
* identify candidate surgical elements such as drapes, instruments, gloves, and anatomy;
* distinguish between surgical and non-surgical visual patterns;
* preserve uncertainty when the observation is ambiguous.

Evidence outputs:
* candidate surgical visual signals;
* observation confidence level;
* observation uncertainty profile.

### 3.3 Clinical Scene Evidence
This stage assembles visual cues into a coherent clinical scene.

Key responsibilities:
* validate surgical field organization;
* identify sterile and non-sterile zones;
* locate the operative site and supporting equipment.

Evidence outputs:
* clinical scene coherence score;
* sterile field evidence;
* scene layout classification.

### 3.4 Operating Room Evidence
This stage evaluates the environment as an operating room or surgical space.

* confirm operating theater architecture or equivalent surgical venue;
* identify room-specific environmental controls;
* classify room type without relying on appearance alone.

* operating room evidence vector;
* room type category;
* room confidence and uncertainty.

### 3.5 Procedure Evidence
This stage interprets the observed activity as a specific surgical procedure or set of surgical actions.

* map instruments, anatomy, and team actions to procedure categories;
* distinguish operative intervention from preparation and closure;
* preserve alternative interpretations when evidence is incomplete.

* procedure evidence summary;
* procedure candidate categories;
* procedure stage indicators.

### 3.6 Workflow Evidence
This stage assesses the organization and progression of surgical activity.

* identify structured workflow elements such as counts, checklists, and stage transitions;
* validate coordination among team members;
* detect breaks, interruptions, or atypical flow.

* workflow coherence score;
* workflow stage evidence;
* workflow uncertainty profile.

### 3.7 Temporal Evidence
This stage grounds the surgical activity in time.

* verify continuity, duration, and sequence of actions;
* identify stage length and transition timing;
* detect edits, compression, or missing temporal context.

* temporal continuity score;
* stage duration evidence;
* temporal uncertainty metrics.

### 3.8 Clinical Context
This stage situates the surgical procedure within broader clinical intent and setting.

* link the procedure to clinical goals such as diagnosis, treatment, or rehabilitation;
* differentiate surgery from medical examinations, simulation, or documentary footage;
* identify educational or experimental contexts.

* clinical context profile;
* context reliability assessment;
* context contradiction report.

### 3.9 Medical Interpretation
This stage synthesizes evidence into a surgical interpretation.

* combine anatomy, instruments, team, procedure, workflow, and context evidence;
* preserve explicit alternative hypotheses;
* avoid direct classification based solely on appearance.

* surgical interpretation statement;
* evidence provenance summary;
* alternative interpretations.

### 3.10 Confidence
This stage quantifies trust in the surgical interpretation.

* compute scene, clinical, procedure, workflow, instrument, and decision confidence;
* identify limiting evidence dimensions;
* propagate confidence to downstream modules.

* confidence profile;
* reasoning for confidence values;
* primary confidence contributors.

### 3.11 Uncertainty
This stage identifies and communicates uncertainty.

* identify ambiguity, unknown observations, distribution shift, conflicting evidence, missing observations, and low-quality inputs;
* propagate uncertainty through the evidence pipeline;
* produce explicit uncertainty fields for downstream consumption.

* uncertainty profile;
* uncertainty source attribution;
* uncertainty impact assessment.

### 3.12 Risk Contribution
This stage identifies how surgical evidence affects risk and safety reasoning.

* flag evidence relevant to patient safety, privacy, and regulatory exceptions;
* separate surgical evidence from general medical evidence when determining risk exceptions;
* provide conservative guidance in ambiguous cases.

* risk contribution signals;
* risk evidence categories;
* evidence-driven safety recommendations.

### 3.13 Policy Contribution
This stage prepares the evidence for policy reasoning.

* package surgical evidence with confidence and uncertainty metadata;
* identify policy-relevant boundaries such as medical exception criteria;
* preserve evidence provenance for auditability.

* policy-ready evidence payloads;
* policy contribution descriptors;
* evidence consumption guidance.

### 3.14 Explainable Surgical Decision
This final stage produces a transparent surgical reasoning summary.

* answer what was observed, why it matters, which evidence supports and contradicts the interpretation, what alternatives exist, how confident the conclusion is, what uncertainty remains, and which modules contributed;
* provide downstream modules with a structured, explainable decision rather than a black-box label.

* explainable surgical decision report;
* evidence breakdown by category;
* decision confidence and uncertainty summary.

## 4. Procedural Reasoning and Workflow Progression

This module reasons across surgical procedure stages, accumulating evidence as the case progresses.

### 4.1 Pre-operative Stage

#### Description
The pre-operative stage includes patient evaluation, consent, surgical planning, equipment setup, and team briefing before sterile preparation begins.

#### Evidence Accumulated
* patient identity confirmation and markings;
* preoperative documentation or imaging referenced in the room;
* surgical instrumentation selection and verification;
* team briefing behavior and pre-surgical safety checks;
* anesthesia preparation visible at the room periphery.

#### Why It Matters
Pre-operative evidence distinguishes live surgery from spontaneous operating room access or non-procedural clinical activity.

#### Supporting Evidence
* surgical consent forms or patient charts in view;
* team members engaged in preoperative discussion;
* instruments being arranged but not yet opened;
* anesthesia equipment prepared and ready.

#### Contradictory Evidence
* patient preparation absent despite visible surgical instruments;
* theater lights fully off while surgical staff stand in the room;
* documentation or imagery inconsistent with the active procedure.

#### Alternatives
* instrument tray setup for an educational demonstration;
* a hospital room being prepared for a non-surgical procedure;
* a preoperative photo shoot or staged clinical film.

#### Confidence and Uncertainty
Confidence increases when explicit preoperative artifacts are present. Uncertainty remains when preparation appears staged or when clinical documentation is unclear.

### 4.2 Preparation Stage

#### Description
The preparation stage covers sterile draping, surgical site marking, antiseptic application, and final team readiness.

#### Evidence Accumulated
* sterile drapes placed around the operative site;
* surgical skin marking lines or adhesive indicators;
* antiseptic solutions being poured or swabbed onto skin;
* instrument tables being draped and arranged;
* team members performing surgical hand scrub or gowning.

#### Why It Matters
Preparation evidence is a strong surgical signal because it reflects the transition from general clinical space to an active sterile field.

#### Supporting Evidence
* drape placement conforming to a surgical site;
* sterile covers on instruments and equipment;
* team members in gowns and gloves moving toward the field.

#### Contradictory Evidence
* drapes used as simple environmental cover in a non-surgical scene;
* antiseptic application to a non-operative area such as a bandaged wound;
* surgical attire worn for infection control in a non-operative patient room.

#### Alternatives
* demonstration of sterile technique on a model;
* a cosmetic treatment using similar draping and cleaning;
* a clinical photography setup for wound imaging.

#### Confidence and Uncertainty
Preparation stage confidence is high when sterility and surgical site preparation are explicit. Uncertainty arises when drapes and markers are visible but not clearly tied to a real patient or procedure.

### 4.3 Sterile Field Stage

#### Description
The sterile field stage is the formation and maintenance of the sterile barrier around the operative site and instruments.

#### Evidence Accumulated
* clear separation of sterile and non-sterile zones;
* instrument tables draped with sterile covers;
* staff maintaining sterile positions and passing instruments appropriately;
* sterile access paths and restricted movement zones.

#### Why It Matters
A properly established sterile field is a core surgical requirement and distinguishes surgery from non-sterile clinical tasks.

#### Supporting Evidence
* surgical instruments handled only within sterile zones;
* scrubbed personnel standing inside the sterile field and circulators outside it;
* sterile drapes extending to the anatomy and covering non-operative areas.

#### Contradictory Evidence
* team members touching sterile instruments with non-sterile gloves;
* sterile drapes arranged poorly or used as visual props;
* active intervention occurring outside a clearly defined sterile field.

#### Alternatives
* sterile demonstration for training rather than live surgery;
* a sterile setup prepared for an invasive diagnostic procedure that is not surgical;
* a staged operating room scene for film production.

#### Confidence and Uncertainty
Confidence is highest when sterile field boundaries and aseptic behavior are visible. Uncertainty persists when the sterile layout is incomplete or when staff behavior is ambiguous.

### 4.4 Patient Positioning

#### Description
Patient positioning covers orientation and support of the patient to provide surgical access.

#### Evidence Accumulated
* position-specific apparatus such as shoulder rolls, arm boards, leg holders, or headrests;
* patient orientation consistent with the surgical target area;
* use of padding, supports, and stabilization devices;
* alignment of the patient with surgical access points.

#### Why It Matters
Positioning evidence confirms the procedure is tailored to a specific anatomical approach and distinguishes surgical preparation from general patient care.

#### Supporting Evidence
* prone, supine, lateral, lithotomy, or sitting positions matched to the procedure;
* fixation devices securing the patient safely;
* exposure of the operative site while protecting non-operative body parts.

#### Contradictory Evidence
* patient position inconsistent with the claimed surgical site;
* positioning devices used for transport rather than surgical access;
* patient movement suggesting a non-surgical environment.

#### Alternatives
* an imaging procedure with a similar patient orientation;
* a physical therapy setup using supportive devices;
* a staged photography session with a medical mannequin.

#### Confidence and Uncertainty
Confidence is high when positioning devices are explicit and consistent. Uncertainty increases when patient positioning is visible but the target site remains unclear.

### 4.5 Anesthesia Stage

#### Description
The anesthesia stage includes airway management, monitoring, and physiological support needed for surgery.

#### Evidence Accumulated
* anesthesia devices such as ventilators, endotracheal tubes, laryngeal masks, or infusion pumps;
* monitoring equipment displaying vital signs, blood pressure, oxygen saturation, and capnography;
* anesthesiology personnel managing the patientâ€™s condition.

#### Why It Matters
Anesthesia evidence is a specialized clinical signal that supports surgical intervention and patient safety.

#### Supporting Evidence
* airway management devices connected to the patient;
* active monitoring traces displayed on screens;
* anesthesiologist or anesthesia team presence near the head of the patient.

#### Contradictory Evidence
* monitoring equipment present in a non-surgical intensive care setting;
* airway devices used for emergency resuscitation rather than planned surgery;
* anesthesia-like equipment visible without patient connection.

#### Alternatives
* intensive care or emergency medicine scenarios with similar monitoring;
* sedation for non-surgical procedures such as endoscopy or dental surgery;
* training manikins with simulated anesthesia setups.

#### Confidence and Uncertainty
Confidence is high when anesthesia equipment is active and connected. Uncertainty arises when equipment is present but not clearly tied to a surgical event.

### 4.6 Incision Stage

#### Description
The incision stage includes the initial entry into body tissue and the first surgical access to the operative site.

#### Evidence Accumulated
* evidence of cutting instruments engaged with tissue;
* visible incisions or opening of skin and fascia;
* surgical exposure devices introduced after the incision.

#### Why It Matters
Incision evidence establishes that the scene has moved from preparation to active surgical intervention.

#### Supporting Evidence
* scalpel or electrosurgical instrument entry into tissue;
* controlled bleeding managed with suction and sponges;
* retraction applied to maintain the incision opening.

#### Contradictory Evidence
* superficial cuts on the skin used for practice or demonstration;
* incisions on a model or cadaver not connected to a live procedure;
* tools touching skin without purposeful incision.

#### Alternatives
* surgical simulation with realistic incision practice;
* cosmetic dermatologic procedures using a similar cut pattern;
* instructional demonstration of incision technique.

#### Confidence and Uncertainty
Confidence is high when incision mechanics and tissue interaction are clearly surgical. Uncertainty remains if the cut is ambiguous or the media is fabricated.

### 4.7 Exposure Stage

#### Description
The exposure stage involves retracting tissues, isolating anatomy, and creating access for the primary intervention.

#### Evidence Accumulated
* retractors, suction, and tissue separators in place;
* anatomical structures visible beyond the incision;
* protective measures such as moist sponges and wound protectors.

#### Why It Matters
Exposure evidence demonstrates the procedureâ€™s progression and the opening of the operative site for substantive work.

#### Supporting Evidence
* instrument-assisted separation of tissue planes;
* anatomy revealed beyond superficial layers;
* fluid management to maintain a clear field.

#### Contradictory Evidence
* retractors used only for demonstration outlines;
* exposure in a cadaver lab where tissue behavior differs from live surgery;
* apparent anatomy that is actually a prop or model.

#### Alternatives
* surgical teaching models with simulated tissue exposure;
* non-surgical wound care with similar retraction;
* production props designed to mimic exposed anatomy.

#### Confidence and Uncertainty
Confidence grows when exposure reveals real tissue behavior and active management. Uncertainty persists if the anatomy appears artificial or if the exposure is inconsistent with live surgery.

### 4.8 Primary Intervention Stage

#### Description
The primary intervention stage includes the main surgical action such as resection, repair, reconstruction, implant placement, or removal.

#### Evidence Accumulated
* instruments actively modifying anatomy;
* target tissue or structure being altered, removed, or repaired;
* primary procedural goals visibly pursued.

#### Why It Matters
Primary intervention evidence is the core of surgical reasoning. It is the moment when surgical intent is most explicit.

#### Supporting Evidence
* direct instrument-tissue interaction producing surgical change;
* active hemostatic control;
* simultaneous visualization and intervention of target structures.

#### Contradictory Evidence
* surgical-like actions that do not affect live tissue;
* primary intervention on a model or simulation without real operatives;
* actions inconsistent with the claimed procedure.

#### Alternatives
* hands-on surgical training with animal or synthetic models;
* educational walkthrough of a surgery using recorded footage without active intervention;
* film production using special effects.

#### Confidence and Uncertainty
Confidence is highest when tissue response and instrument effect are real and consistent. Uncertainty increases if the scene lacks clear evidence of live anatomical change.

### 4.9 Secondary Procedures Stage

#### Description
The secondary procedures stage includes additional interventions such as adjunctive repairs, biopsies, drains, or device placements performed after the primary action.

#### Evidence Accumulated
* new instruments introduced for secondary tasks;
* changes in workflow indicating a follow-up step;
* adjunctive clinical activity such as grafting or reconstructive work.

#### Why It Matters
Secondary procedure evidence differentiates multi-step surgical workflows from shorter, singular interventions.

#### Supporting Evidence
* the operative field being re-evaluated for additional tasks;
* team members adjusting instruments or equipment for the new step;
* surgical materials introduced specifically for reconstruction or finishing.

#### Contradictory Evidence
* repeated actions that are actually part of the same primary intervention;
* scene changes caused by camera edits rather than procedural stages;
* adjunctive tasks performed on non-surgical models.

#### Alternatives
* secondary procedure simulations in training;
* multiple unrelated demonstrations edited together;
* staged repair scenarios for educational content.

#### Confidence and Uncertainty
Confidence is strengthened when stage change is clear and supported by workflow evidence. Uncertainty remains if the segment transitions are abrupt or indistinct.