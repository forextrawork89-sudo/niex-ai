# Surgical Procedure Intelligence Framework

## Document Metadata
* **Module Name:** Surgical Procedure Intelligence
* **Document Version:** 2.0.0
* **Architectural Role:** Evidence-Centric Surgical Reasoning Layer within the Medical Subsystem
* **Domain:** Surgical Procedure Understanding, Perioperative Evidence, Clinical Workflow, Explainable Medical AI
* **Design Intention:** architecture-first, evidence-driven, clinical-context-aware, implementation-independent, uncertainty-sensitive, explainability-focused

---

## 1. Purpose and Architectural Role

### 1.1 Primary Purpose
This module defines the surgical procedure intelligence domain for the medical subsystem. Its purpose is to accumulate structured surgical evidence across anatomy, instruments, team behavior, workflow stages, operating room environment, patient state, motion, and context, and to produce explainable surgical evidence outputs suitable for downstream medical reasoning, risk assessment, and policy decision-making.

### 1.2 Architectural Role
Surgical Procedure Intelligence sits within the medical subsystem as an evidence fusion layer. It is not a simple operating room detector or a surgical scene classifier. Instead, it converts lower-level sensory and semantic inputs into a surgical reasoning payload that includes:
* evidence categories and provenance;
* confidence profiles;
* uncertainty profiles;
* explicit alternative interpretations;
* risk contribution markers;
* policy compatibility descriptors.

### 1.3 Design Constraints
The module must:
* preserve module boundaries by consuming evidence from upstream modules and producing structured outputs for downstream modules;
* avoid direct labels derived only from operating room appearance;
* reason in terms of evidence accumulation rather than single heuristics;
* use scientifically stable terminology and a consistent ontology;
* support future multimodal medical foundation models and evidence graphs;
* remain platform-independent and detector-independent.

### 1.4 In-Scope Responsibilities
This module is responsible for:
* determining whether an observed scene contains surgical procedure evidence;
* distinguishing surgical workflows from other medical, educational, simulation, and non-surgical scenes;
* defining procedure stage evidence and evidence accumulation over time;
* producing explainable surgical interpretations with confidence, uncertainty, alternatives, and provenance;
* supporting downstream modules in medical, policy, behavior, educational, and risk reasoning.

### 1.5 Out-of-Scope Responsibilities
This module is not responsible for:
* raw object detection, pose estimation, or low-level segmentation algorithms;
* medical diagnosis, pathology classification, or clinician decision-making;
* identity inference or demographic estimation;
* generating policy decisions; it only supplies evidence and metrics for policy reasoning;
* replacing specialized clinical subsystems such as interventional radiology or dermatological assessment.

---

## 2. Surgical Evidence Model

Surgical evidence is categorized into twelve foundational types. Each type is defined by evidence reliability, mandatory evidence, optional evidence, supporting evidence, contradictory evidence, missing evidence, and quality assessment.

### 2.1 Anatomical Evidence

#### Definition
Evidence describing the patient anatomy, surgical target site, and tissue exposure.

#### Reliability
High when the patient anatomy and operative site are visible and consistent with surgical access. Lower when anatomy is obscured, draped, partially visible, or represented by surrogates.

#### Mandatory Evidence
* a discernible operative site such as abdomen, chest, head, spine, limb, oral cavity, or ocular region;
* exposure or preparation of tissue in a way consistent with surgical access;
* anatomical landmarks aligned with known surgical procedures.

#### Optional Evidence
* internal anatomy views such as viscera, bone, nerves, vessels, or cavities;
* surgical positioning markers, skin prep lines, or anatomical reference points;
* location-specific supports such as shoulder rolls or leg holders.

#### Supporting Evidence
* retraction revealing underlying anatomy;
* tissue compliance and response to manipulation;
* anatomical orientation matching the procedure category.

#### Contradictory Evidence
* instruments present with no visible anatomy;
* anatomy appears artificial, synthetic, or model-based;
* draping and sterile preparation exist without any discernible surgical target.

#### Missing Evidence
* absence of a visible patient or patient surrogate in the operative field;
* surgical props present but no underlying anatomical region;
* anatomy visible only in unrelated parts of the scene.

#### Quality Assessment
Assess whether anatomical evidence is explicit, contextual, or inferred. Explicit evidence is direct tissue exposure. Contextual evidence is inferred from positioning and drapes. Inferred evidence is assumed from nearby instruments and staff.

### 2.2 Surgical Instrument Evidence

#### Definition
Evidence of surgical tools, their identity, placement, and active use in the procedure.

#### Reliability
Reliable when instruments are clearly identified and appear to be actively engaged with anatomy, surgical materials, or the sterile field. Less reliable when instrument identity is ambiguous or the instrument is distant from the operative site.

#### Mandatory Evidence
* at least one surgical instrument located in or near the operative field;
* evidence of instrument engagement with anatomy, surgical materials, or procedure-related actions;
* instrument types compatible with the claimed surgical category.

#### Optional Evidence
* instrument trays, sterile packs, power cords, laparoscopic towers, or instrument-specific peripherals;
* disposable packaging, sterile covers, or specialized instrument handles;
* instrument-specific equipment such as electrosurgical units, arthroscopy towers, or drills.

#### Supporting Evidence
* instrument motion synchronized with tissue interaction;
* instruments maintained inside the sterile field;
* instrument selection matching the current stage.

#### Contradictory Evidence
* instrument-like objects used for non-surgical tasks (e.g., kitchen knives, household scissors);
* surgical instruments present but not associated with any procedure-related activity;
* surgical instruments used in a purely demonstrative or staged setting unrelated to actual surgery.

#### Missing Evidence
* surgical drapes or sterile setup without any visible instruments;
* only generic medical tools present, such as stethoscopes or bandages;
* instruments visible only outside the sterile or operative area.

#### Quality Assessment
Evaluate instrument evidence by identity clarity, functional placement, and apparent use. High-quality evidence includes direct instrument-anatomy interaction. Lower quality indicates ambiguous shapes or incidental presence.

### 2.3 Surgical Team Evidence

#### Definition
Evidence documenting the roles, coordination, and behaviors of surgical staff.

#### Reliability
High when team members display role-specific attire, proper sterile behavior, and coordinated surgical activity. Lower when team presence is implied or the scene is crowded without clear role differentiation.

#### Mandatory Evidence
* presence of at least one surgical team member participating in the procedure;
* evidence of role-specific activity such as instrument passing, retraction, monitoring, or suctioning;
* team coordination consistent with surgical workflow.

#### Optional Evidence
* scrub caps, masks, gowns, gloves, and eye protection;
* anesthesia providers or circulating nurses engaged in support tasks;
* visible communication, instrument exchange, or mutual verification.

#### Supporting Evidence
* coordinated movement around the sterile field;
* consistent sterile and non-sterile zone behavior;
* evidence of counts, handoffs, or surgical team rituals.

#### Contradictory Evidence
* multiple people present without surgical coordination;
* personnel in surgical attire acting as observers or cameras rather than participants;
* non-clinical personnel or audience members on the field.

#### Missing Evidence
* no human figures visible despite surgical setup;
* team members visible only peripherally with no procedural engagement;
* indistinct human forms that cannot be attributed to surgical roles.

#### Quality Assessment
Assess team evidence by role clarity, procedural relevance, and coordination. High quality demonstrates active participation and sterile behavior; lower quality indicates passive or ambiguous presence.

### 2.4 Patient Evidence

#### Definition
Evidence capturing the patientâ€™s physiological state, positioning, preparation, and relationship to the surgical task.

#### Reliability
High when the patient is clearly present and directly engaged with surgical activity. Lower when patient evidence is partial, indirect, or surrogated by mannequins.

#### Mandatory Evidence
* a visible patient or patient surrogate in the operative context;
* evidence of patient preparation and positioning relevant to surgery;
* physiological support devices, monitors, or airway interfaces connected to the patient when appropriate.

#### Optional Evidence
* anesthesia tubes, IV lines, monitoring leads, or ventilation support;
* patient skin preparation, hair removal, or surgical site marking;
* posture supports such as shoulder rolls, leg holders, or headrests.

#### Supporting Evidence
* stable patient position appropriate for the procedure;
* direct patient-instrument interaction;
* patient care activities such as monitoring and line management.

#### Contradictory Evidence
* instruments and drapes present without a patient;
* mannequins, cadavers, or animal models presented as live patients;
* patient transport equipment indicating a non-surgical scenario.

#### Missing Evidence
* absence of any clearly identifiable patient anatomy within the operative zone;
* patient equipment present but not connected to a live patient;
* patient body visible only outside the surgical context.

#### Quality Assessment
Evaluate patient evidence by its directness and clinical relevance. High quality includes live patient anatomy and active support; lower quality includes surrogates, models, or disconnected monitoring.

### 2.5 Procedure Stage Evidence

#### Definition
Evidence indicating the current stage of the surgical workflow and the progression of operative activity.

#### Reliability
Reliable when stage-specific activities, instruments, and team behaviors are visually or temporally evident. Less reliable when stages overlap, are incomplete, or cannot be distinguished.

#### Mandatory Evidence
* at least one stage-specific indicator consistent with the current procedure stage;
* evidence of progression, such as preparation preceding incision or closure following intervention;
* stage-specific instrument or workflow cues.

#### Optional Evidence
* checklists, count boards, timers, or stage labels;
* stage-specific team postures and coordination;
* visible equipment changeovers or sterile field modifications.

#### Supporting Evidence
* sequential evidence across adjacent frames or segments;
* stage-specific tool use and anatomical action;
* consistent transitions between adjacent stages.

#### Contradictory Evidence
* stage-specific instruments appearing in a different stage without supporting context;
* voice-over or text indicating a different phase;
* abrupt scene changes that break stage continuity.

#### Missing Evidence
* inability to determine stage due to limited visibility;
* no stage-specific instruments or workflow cues visible;
* general surgical activity without stage differentiation.

#### Quality Assessment
Assess stage evidence for specificity and temporal consistency. High quality occurs when stage indicators are explicit and supported by workflow transition cues.

### 2.6 Operating Room Evidence

#### Definition
Evidence of the surgical venue and spatial organization of the operative environment.

#### Reliability
High when the environment has distinctive surgical architecture, controls, and sterile field separation. Lower when features are generic clinical or laboratory elements.

#### Mandatory Evidence
* a room layout or venue capable of supporting surgery, such as an operating theater, hybrid OR, ambulatory surgery center room, emergency surgical suite, or procedure suite;
* evidence of environmental control measures such as surgical lighting, sterile drape coverage, or room signage;
* spatial zoning between sterile and non-sterile areas.

#### Optional Evidence
* laminar flow ceilings, pendant booms, integrated cameras, or surgical viewing monitors;
* adjacent scrub sinks, anesthesia workspaces, or nurse stations;
* signage identifying surgical service areas or room types.

#### Supporting Evidence
* clear sterile field boundaries;
* staff traffic flow consistent with OR practice;
* environment cues such as surgical lighting and instrument tables.

#### Contradictory Evidence
* clinical rooms with surgical props but not set up for active surgery;
* simulation labs or cadaver facilities using OR furniture;
* classrooms, television sets, or film sets with surgical styling.

#### Missing Evidence
* no discernible room boundaries or environment context;
* absence of OR-specific environmental controls;
* surgical instruments placed in a generic room without surgical layout evidence.

#### Quality Assessment
Evaluate operating room evidence by its venue confirmation strength. High quality includes explicit OR architecture and sterile layout; medium quality includes surgical equipment in a nondescript clinical space.

### 2.7 Medical Equipment Evidence

#### Definition
Evidence of clinical devices that support surgical procedure functionality.

#### Reliability
Reliable when medical equipment is directly connected to the surgical procedure and actively used. Less reliable when equipment is present but idle, unrelated, or generic.

#### Mandatory Evidence
* at least one medical device functionally associated with a surgical procedure;
* evidence of the device being operational or ready for use in the operative field;
* device type consistent with the procedure stage and patient needs.

#### Optional Evidence
* monitors with waveform traces, alarms, or vital sign readouts;
* electrosurgical pencils, suction lines, insufflators, or imaging systems;
* anesthesia machine interfaces, ventilators, or operating room imaging displays.

#### Supporting Evidence
* direct connection of equipment to the patient or sterile field;
* devices positioned within the surgical workflow line of sight;
* equipment activity consistent with real-time procedural status.

#### Contradictory Evidence
* equipment present but inactive or unrelated to the visible activity;
* clinical devices unrelated to surgery, such as ward infusion pumps;
* imaging devices used for diagnostic scanning separate from the surgical field.

#### Missing Evidence
* no medical equipment visible in a surgical-like scene;
* only generic clinical equipment visible;
* devices visible but not clearly connected or relevant.

#### Quality Assessment
Evaluate medical equipment evidence for functional relevance and engagement. High quality shows active procedural support; low quality indicates incidental presence.

### 2.8 Motion Evidence

#### Definition
Evidence capturing dynamic movement of instruments, staff, patients, and surgical materials over time.

#### Reliability
High when motion aligns with surgical actions and workflow. Lower when motion is noisy, unrelated, or insufficiently distinct from non-surgical activity.

#### Mandatory Evidence
* motion consistent with surgical action, such as cutting, suturing, retracting, or manipulating tissues;
* instrument motion within the operative field;
* coordinated team movement related to the surgical task.

#### Optional Evidence
* repeated surgical gestures such as knot tying or instrument exchange;
* patient micro-movements due to ventilation or anesthetic adjustments;
* fluid motion from suction, irrigation, or cautery plume.

#### Supporting Evidence
* instrument trajectories aligned with an expected surgical task;
* team movements that support a common workflow;
* motion changes corresponding to stage transitions.

#### Contradictory Evidence
* motion patterns suggestive of training drills, demonstrations, or non-surgical tasks;
* instrument movement without tissue interaction;
* disorganized staff movement unrelated to the operative field.

#### Missing Evidence
* static images with no temporal context;
* motion unrelated to the surgical field;
* only environmental motion without operative significance.

#### Quality Assessment
Assess motion evidence by clarity, continuity, and surgical relevance. High quality is active surgical manipulation; low quality is incidental or unrelated movement.

### 2.9 Workflow Evidence

#### Definition
Evidence of surgical process organization, coordination, sequencing, and team behavior.

#### Reliability
Reliable when workflow cues are explicit or can be logically inferred from stage progression. Less reliable when inferred from isolated frames or when stage sequence is unclear.

#### Mandatory Evidence
* evidence of organized progression through surgical stages;
* observable workflow artifacts such as checklists, count boards, or team posture;
* coordinated activity among team members with defined roles.

#### Optional Evidence
* visible surgical timeouts, checklists, or count documentation;
* stage transitions reflected by equipment changes or field modifications;
* documented instrument counts or sponge tracking.

#### Supporting Evidence
* repeated workflow cues across segments;
* team actions linked to standard surgical workflow elements;
* stage-specific changes in environment or instruments.

#### Contradictory Evidence
* apparent workflow disorder, such as scattered instruments or uncoordinated staff;
* procedural steps inconsistent with expected stage order;
* team members appearing unaware of operative tasks.

#### Missing Evidence
* no observable workflow structure;
* single-frame evidence insufficient for workflow inference;
* actions that do not suggest sequence.

#### Quality Assessment
Measure workflow evidence on explicitness and consistency. High quality is visible, repeatable workflow structure; low quality is vague or absent.

### 2.10 Temporal Evidence

#### Definition
Evidence describing timing, duration, continuity, and chronological ordering of surgical activity.

#### Reliability
High when a coherent temporal narrative exists. Lower when media is single-frame, edited, or missing time context.

#### Mandatory Evidence
* temporal continuity or stage sequencing cues;
* duration indicators such as repeated actions, clocks, or elapsed time markers;
* timing consistent with surgical workflow expectations.

#### Optional Evidence
* visible time stamps, clocks, or video counters;
* repeated cycles such as suturing, instrument exchange, or irrigation;
* playback annotations indicating temporal structure.

#### Supporting Evidence
* stage transitions following expected order;
* rhythms consistent with surgical tasks;
* multiple frames or clips preserving procedure narrative.

#### Contradictory Evidence
* abrupt scene cuts or spliced segments;
* missing time metadata or inconsistent timestamps;
* temporal patterns inconsistent with the inferred stage.

#### Missing Evidence
* isolated still images without sequence;
* video segments cut away from the operative field;
* unreliable or absent time cues.

#### Quality Assessment
Assess temporal evidence by continuity and logical progression. High quality is sustained, coherent sequence; low quality is fragmented or absent.

### 2.11 Clinical Context Evidence

#### Definition
Evidence linking the surgical procedure to broader medical goals, diagnosis, care setting, and clinical intent.

#### Reliability
High when clinical cues are explicit and consistent with surgery. Lower when context is vague, implied, or mixed with educational content.

#### Mandatory Evidence
* indications of clinical procedural intent such as treatment, diagnosis, or therapeutic repair;
* evidence of surgical service, department, or specialty relevant to the procedure;
* clinical support devices, documentation, or patient monitoring consistent with surgical intent.

#### Optional Evidence
* visible patient charts, consent forms, or surgical notes;
* departmental markers, hospital signage, or care team identifiers;
* references to clinical protocols, guidelines, or preoperative imaging.

#### Supporting Evidence
* clinical devices and personnel consistent with the surgical setting;
* communication or behavior referencing patient care goals;
* patient preparation and sterile technique aligned with clinical treatment.

#### Contradictory Evidence
* clinical terminology used decoratively or as misdirection;
* medical-looking equipment in a non-clinical demonstration;
* context suggesting education, documentary, or entertainment rather than clinical surgery.

#### Missing Evidence
* no clinical markers beyond instruments and drapes;
* ambiguous facility type without surgical service indicators;
* patient context absent or unclear.

#### Quality Assessment
Evaluate clinical context evidence by directness and relevance. High quality is explicit clinical goal alignment; low quality is implied or indirect.

### 2.12 Educational Context Evidence

#### Definition
Evidence that the scene is intended for teaching, demonstration, documentation, or simulation rather than purely therapeutic surgery.

#### Reliability
High when educational cues are explicit, such as narration, audience presence, or modeled teaching. Lower when educational and clinical evidence co-occur.

#### Mandatory Evidence
* evidence that the scene is designed for instruction, demonstration, or training;
* educational artifacts such as whiteboards, simulators, audience seating, or commentary;
* instructor-like behavior such as explanation, pointing, or staged demonstration.

#### Optional Evidence
* on-screen annotations, voice-over guidance, or curriculum references;
* learner presence or observer roles;
* use of mock setups, mannequins, animal models, or simulation environments.

#### Supporting Evidence
* separation of demonstration actions from clinical intervention;
* explicit mention of teaching objectives;
* training-specific materials or overlays.

#### Contradictory Evidence
* teaching artifacts present in a live surgical recording intended as clinical documentation;
* educational overlays over actual surgery footage without clear distinction;
* simulated procedures presented as real operations.

#### Missing Evidence
* no explicit teaching or training cues despite a training-like environment;
* educational inference based solely on observer presence;
* ambiguous multimedia overlays.

#### Quality Assessment
Assess educational context evidence by explicitness and intent. High quality indicates deliberate teaching or training; low quality is vague or incidental.

## 3. Surgical Reasoning Pipeline

The pipeline is a layered evidence architecture. Each stage refines the evidence set and forwards structured outputs to the next stage.

### 3.1 Pipeline Stages
1. Visual Observation
2. Clinical Scene Evidence
3. Operating Room Evidence
4. Procedure Evidence
5. Workflow Evidence
6. Temporal Evidence
7. Clinical Context Evidence
8. Medical Interpretation
9. Confidence
10. Uncertainty
11. Risk Contribution
12. Policy Contribution
13. Explainable Surgical Decision

The pipeline mandates explicit evidence handoff at every stage. No stage should produce a final decision without the preceding evidence context.

### 3.2 Visual Observation

#### Role
Capture the raw surgical cues present in the scene and preserve uncertainty for ambiguous inputs.

#### Incoming Evidence
* basic visual signals from objects, pose, color, and texture.

#### Outgoing Evidence
* candidate surgical indicators,
* observation confidence,
* observation uncertainty.

#### Evidence Characteristics
* candidate drapes, gloves, instruments, patients, and equipment;
* note of ambiguous or unknown items;
* recording of low-quality observations such as blur, occlusion, or lighting issues.

### 3.3 Clinical Scene Evidence

#### Role
Assemble visual cues into a coherent clinical surgical scene.

#### Incoming Evidence
* visual observations of sterile field, instruments, personnel, anatomy, and environment.

#### Outgoing Evidence
* clinical scene coherence score,
* sterile field evidence,
* operative field layout evidence.

#### Evidence Characteristics
* sterility boundaries,
* instrument field placement,
* patient-or-anatomy presence.

### 3.4 Operating Room Evidence

#### Role
Evaluate the venue and environment suitability for surgery.

#### Incoming Evidence
* scene layout, room features, environmental controls, and venue cues.

#### Outgoing Evidence
* operating room evidence vector,
* room type category,
* room confidence and uncertainty.

#### Evidence Characteristics
* OR architecture,
* overhead surgical lighting,
* sterile and non-sterile zones.

### 3.5 Procedure Evidence

#### Role
Interpret activity as a surgical procedure or set of surgical actions.

#### Incoming Evidence
* anatomy, instruments, team actions, and early stage cues.

#### Outgoing Evidence
* procedure evidence summary,
* candidate procedure categories,
* stage indicators.

#### Evidence Characteristics
* instrument-anatomy correlation,
* stage-specific actions,
* procedure category plausibility.

### 3.6 Workflow Evidence

#### Role
Assess the organization and sequencing of surgical activity.

#### Incoming Evidence
* team coordination, stage transitions, and process artifacts.

#### Outgoing Evidence
* workflow coherence score,
* stage evidence,
* workflow uncertainty profile.

#### Evidence Characteristics
* rhythms,
* count signals,
* team posture and communication.

### 3.7 Temporal Evidence

#### Role
Establish continuity, duration, and sequence of surgical events.

#### Incoming Evidence
* repeated motion, time indicators, and sequential segments.

#### Outgoing Evidence
* temporal continuity score,
* stage duration evidence,
* temporal uncertainty metrics.

#### Evidence Characteristics
* elapsed time cues,
* repeated actions,
* uninterrupted segments.

### 3.8 Clinical Context Evidence

#### Role
Situate the surgical activity within broader clinical intent and setting.

#### Incoming Evidence
* documentation, signage, clinical markers, and personnel identifiers.

#### Outgoing Evidence
* clinical context profile,
* context reliability assessment,
* context contradiction report.

#### Evidence Characteristics
* treatment goals,
* department affiliation,
* patient diagnosis hints.

### 3.9 Medical Interpretation

#### Role
Synthesize all surgical evidence into an interpretation while preserving alternatives and uncertainty.

#### Incoming Evidence
* fused evidence from anatomy, instruments, team, procedure stage, workflow, temporal, and context.

#### Outgoing Evidence
* surgical interpretation statement,
* evidence provenance summary,
* alternative hypotheses.

#### Evidence Characteristics
* explicit reasoning about what the evidence supports and what it does not;
* alternative interpretations such as training, simulation, or non-surgical intervention.

### 3.10 Confidence

#### Role
Quantify trust in the surgical interpretation across dimensions.

#### Incoming Evidence
* evidence reliability ratings, stage strength, context clarity, and workflow coherence.

#### Outgoing Evidence
* confidence profile,
* limiting evidence identification.

#### Evidence Characteristics
* scene confidence,
* clinical confidence,
* procedure confidence,
* workflow confidence,
* instrument confidence,
* medical context confidence,
* decision confidence.

### 3.11 Uncertainty

#### Role
Capture and propagate uncertainty through the surgical reasoning chain.

#### Incoming Evidence
* ambiguous, unknown, low-quality, conflicting, missing, or novel observations.

#### Outgoing Evidence
* uncertainty profile,
* source attribution,
* uncertainty impact assessment.

#### Evidence Characteristics
* ambiguity categories,
* distribution shift indicators,
* evidence conflict reports.

### 3.12 Risk Contribution

#### Role
Translate surgical evidence into risk-relevant signals for safety and exception handling.

#### Incoming Evidence
* decision confidence, uncertainty, procedure stage, and clinical context.

#### Outgoing Evidence
* risk contribution signals,
* safety flags,
* evidence-driven recommendations.

#### Evidence Characteristics
* medical exception indicators,
* surgical sensitivity markers,
* conservative handling guidance.

### 3.13 Policy Contribution

#### Role
Prepare surgical evidence for policy reasoning and decision-making.

#### Incoming Evidence
* structured surgical evidence, confidence metrics, uncertainty fields, and risk signals.

#### Outgoing Evidence
* policy-ready evidence payloads,
* policy contribution descriptors,
* evidence consumption guidance.

#### Evidence Characteristics
* provenance,
* confidence breakdown,
* uncertainty level.

### 3.14 Explainable Surgical Decision

#### Role
Produce a transparent, evidence-based surgical decision summary.

#### Incoming Evidence
* complete evidence profile, confidence and uncertainty dimensions, alternatives, and relevant downstream guidance.

#### Outgoing Evidence
* explainable surgical decision report,
* evidence breakdown by category,
* decision confidence and uncertainty summary.

#### Evidence Characteristics
* what was observed,
* why it matters,
* supporting evidence,
* contradictory evidence,
* alternatives,
* confidence,
* uncertainty,
* module contributions.

## 4. Procedural Reasoning Across Surgical Stages

This module reasons through surgical stages by accumulating evidence and tracking transitions from pre-operative preparation through post-operative care.

### 4.1 Pre-operative Stage

#### Description
Patient evaluation, team briefing, instrument preparation, and initial room setup prior to formal sterile preparation.

#### Evidence Accumulated
* patient identification and surgical marks;
* preoperative imaging or documentation references;
* equipment selection and verification;
* team briefing and timeout behavior;
* anesthesia preparation at the room periphery.

#### Importance
Distinguishes a live surgical episode from casual clinical activity, photography, or staged scenes.

#### Supporting Evidence
* consent forms or charts in view;
* team discussion around surgical plans;
* trays prepared but not yet opened;
* anesthesia equipment staged but not yet connected.

#### Contradictory Evidence
* instruments arranged for display only;
* darkened lights with staff in the room;
* visible documentation inconsistent with active surgery.

#### Alternatives
* educational setup for training;
* OR preparation without planned surgery;
* staged medical filming.

#### Confidence and Uncertainty
High when explicit preparation cues exist; uncertainty remains when the scene could be a demonstration or classroom setup.

### 4.2 Preparation Stage

#### Description
Formation of the sterile field, draping, antiseptic application, and final readiness checks.

#### Evidence Accumulated
* sterile drape placement around the operative site;
* surgical site marking and antiseptic application;
* instrument table draping;
* staff gowning, gloving, and hand scrubbing.

#### Importance
A strong surgical signal that marks the transition from generic medical space to active operative readiness.

#### Supporting Evidence
* drapes conforming to a surgical target;
* sterile coverage of instruments and equipment;
* staff in sterile attire preparing the field.

#### Contradictory Evidence
* drapes used decoratively or for non-surgical separation;
* antiseptic applied to wounds in a non-operative context;
* sterile technique displayed without actual surgery planned.

#### Alternatives
* surgical simulation or demonstration;
* cosmetic procedures using similar preparation;
* clinical photography session.

#### Confidence and Uncertainty
High when sterile field formation is explicit; uncertainty when preparation appears staged or model-based.

### 4.3 Sterile Field Stage

#### Description
Clear establishment and maintenance of a sterile barrier and separation of sterile from non-sterile zones.

#### Evidence Accumulated
* instrument trays draped sterily;
* team monitoring sterile boundaries;
* controlled sterile access paths.

#### Importance
A core requirement for surgical intervention and a key distinguisher from non-surgical clinical tasks.

#### Supporting Evidence
* only scrubbed personnel within the sterile field;
* sterile drapes extending to the operative site;
* sterile instrument handling and passing.

#### Contradictory Evidence
* non-sterile contact with sterile instruments;
* sterility displayed only superficially;
* intervention occurring outside clear sterile boundaries.

#### Alternatives
* sterile technique demonstrations;
* staged surgical sets.

#### Confidence and Uncertainty
Highest when sterile boundaries and aseptic behavior are clear; uncertainty if sterility is incomplete or ambiguous.

### 4.4 Patient Positioning Stage

#### Description
Orientation and stabilization of the patient to allow surgical access to the target anatomy.

#### Evidence Accumulated
* position-specific supports such as arm boards, leg holders, shoulder rolls, or headrests;
* patient alignment matching the procedure site;
* protective padding and stabilization measures.

#### Importance
Confirms the operation is tailored to a specific anatomical approach and distinguishes surgery from general patient handling.

#### Supporting Evidence
* patient posture matched to the surgical site;
* fixation devices securing the patient;
* exposure of the operative area while protecting non-operative anatomy.

#### Contradictory Evidence
* positioning inconsistent with the claimed procedure;
* transport or examination positioning mistaken for surgical positioning.

#### Alternatives
* imaging or therapy positioning;
* staged photography of a mannequin.

#### Confidence and Uncertainty
High when position and supports are explicit; uncertainty when patient orientation is visible but target anatomy is unclear.

### 4.5 Anesthesia Stage

#### Description
Airway management, patient monitoring, and physiological support required for surgery.

#### Evidence Accumulated
* anesthesia devices, ventilators, IV lines, or monitoring screens;
* anesthesia personnel at the head of the patient;
* active vital sign traces and airway connections.

#### Importance
Anesthesia evidence supports surgical intent and patient safety.

#### Supporting Evidence
* airway devices connected to the patient;
* active monitoring displays;
* anesthesiology team presence and engagement.

#### Contradictory Evidence
* monitoring equipment in an ICU or resuscitation context;
* airway devices used for emergency care rather than planned surgery.

#### Alternatives
* sedation for non-surgical diagnostic procedures;
* simulation anesthesia setups.

#### Confidence and Uncertainty
High when anesthesia and patient support are clearly surgical; uncertainty when equipment is present but not clearly linked to surgery.

### 4.6 Incision Stage

#### Description
Initial entry into tissue and the creation of surgical access.

#### Evidence Accumulated
* scalpels or electrosurgical instruments advancing into tissue;
* controlled bleeding and initial tissue separation;
* first appearance of the operative field.

#### Importance
Marks the transition from preparation to active surgical intervention.

#### Supporting Evidence
* instrument-tissue interaction leading to incision;
* blood management with suction or sponges;
* retraction introduced after the incision.

#### Contradictory Evidence
* superficial cuts used for demonstration;
* model incisions without live tissue response.

#### Alternatives
* surgical practice on models;
* cosmetic dermatologic incisions.

#### Confidence and Uncertainty
High when incision mechanics and tissue response are clear; uncertainty when the cut is ambiguous or appears fabricated.

### 4.7 Exposure Stage

#### Description
Creation of access by retracting tissues, isolating anatomy, and clearing the surgical field.

#### Evidence Accumulated
* retractors and tissue separators in place;
* anatomical structures visible beyond the incision;
* fluid and field management.

#### Importance
Demonstrates progression to substantive operative work.

#### Supporting Evidence
* tissue planes separated;
* anatomy exposed beyond superficial layers;
* field clarity maintained by suction and sponges.

#### Contradictory Evidence
* retractors used only as demonstration props;
* exposure of artificial anatomy.

#### Alternatives
* simulation exposure practice;
* non-surgical wound care with retraction.

#### Confidence and Uncertainty
Higher when real tissue exposure is visible; uncertainty when exposure appears artificial.

### 4.8 Primary Intervention Stage

#### Description
The main surgical action, including resection, repair, reconstruction, extraction, or implant placement.

#### Evidence Accumulated
* instruments modifying anatomy;
* tissue removal, repair, or structural alteration;
* definitive surgical goals executed.

#### Importance
This stage is the core surgical signal and the most explicit evidence of active surgery.

#### Supporting Evidence
* direct tissue change from instruments;
* hemostasis during intervention;
* visualization of target structures.

#### Contradictory Evidence
* actions on models or simulators that mimic surgery;
* primary tasks unrelated to live anatomy.

#### Alternatives
* educational surgery simulations;
* film production effects.

#### Confidence and Uncertainty
High when tissue response is genuine; uncertainty if the action lacks evidence of live anatomical change.

### 4.9 Secondary Procedures Stage

#### Description
Additional surgical tasks after the primary intervention, such as biopsies, graft placements, or adjunctive repairs.

#### Evidence Accumulated
* new instruments for secondary work;
* workflow shifts indicating follow-up action;
* adjunctive clinical steps.

#### Importance
Distinguishes longer, multi-step surgical workflows from singular interventions.

#### Supporting Evidence
* the field re-assessed after primary work;
* team adjusting tools for secondary tasks.

#### Contradictory Evidence
* repeated primary actions mistaken for secondary procedures;
* stage shifts due to editing.

#### Alternatives
* training sequences with multiple demonstrations;
* staged post-primary tasks.

#### Confidence and Uncertainty
Confidence strengthens when stage change is clear; uncertainty remains with abrupt transitions.

### 4.10 Hemostasis Stage

#### Description
Control of bleeding and maintenance of a clear surgical field.

#### Evidence Accumulated
* suction, cautery, clips, and sponges managing blood;
* observed reduction in bleeding;
* active hemostatic technique.

#### Importance
A core surgical safety and procedure confirmation signal.

#### Supporting Evidence
* active blood management;
* hemostatic devices in the field.

#### Contradictory Evidence
* absence of blood handling during deep work;
* artificial blood or exaggerated fluid use.

#### Alternatives
* training models with simulated bleeding;
* non-surgical wound dressing.

#### Confidence and Uncertainty
High when blood management is realistic; uncertainty if blood appears fabricated.

### 4.11 Closure Stage

#### Description
Suturing, stapling, sealing, and restoring tissue after the intervention.

#### Evidence Accumulated
* suture materials, staples, or sealants in use;
* layered closure of tissue planes;
* completion of operative repair.

#### Importance
Anchors the surgical workflowâ€™s conclusion.

#### Supporting Evidence
* repeated needle insertion and knot tying;
* appropriate closure technique.

#### Contradictory Evidence
* closure on synthetic surfaces only;
* unrelated superficial dressing.

#### Alternatives
* model suturing practice;
* cosmetic closure demonstrations.

#### Confidence and Uncertainty
High with real tissue handling; uncertainty if materials appear artificial.

### 4.12 Recovery Stage

#### Description
Final assessment, dressing placement, patient transfer planning, and team handoff after closure.

#### Evidence Accumulated
* dressings, drains, and protective coverings;
* transfer equipment and recovery planning;
* conversation about post-operative care.

#### Importance
Confirms completion of the surgical episode and provides a clinical endpoint.

#### Supporting Evidence
* dressing the incision;
* instrument removal from the field;
* recovery-oriented team communication.

#### Contradictory Evidence
* wound care unrelated to surgery;
* staged transition scenes.

#### Alternatives
* educational recovery demonstration;
* non-surgical dressing application.

#### Confidence and Uncertainty
Confidence is highest when recovery follows clear closure; uncertainty remains with abrupt scene cuts.

### 4.13 Post-operative Care Stage

#### Description
Early recovery monitoring, patient transport, and initial post-operative support outside the OR.

#### Evidence Accumulated
* recovery room environment;
* monitoring and handoff activity;
* patient transfer artifacts.

#### Importance
Differentiates actual surgical completion from on-screen closure segments.

#### Supporting Evidence
* recovery monitoring;
* transport planning.

#### Contradictory Evidence
* staged recovery scenes;
* non-clinical post-procedure depictions.

#### Alternatives
* educational post-op footage;
* synthetic handoff demonstrations.

#### Confidence and Uncertainty
High when linked to actual preceding surgery; uncertainty if the endpoint is disconnected.

## 5. Clinical Context Reasoning

Surgical procedure reasoning must distinguish identical visual elements across different medical and quasi-medical domains.

### 5.1 Surgery vs Medical Examinations

#### Distinctions
* Surgery is invasive and requires a sterile field, incision, and closure.
* Medical examinations are observational and diagnostic, using non-invasive tools.

#### Evidence Contrast
* surgical evidence requires instruments in the sterile field and tissue interaction;
* examinations may show stethoscopes, otoscopes, or palpation without incision;
* surgery requires workflow staging and temporal continuity.

#### Example Distinctions
* dermatological rash examination uses light and magnification, not scalpel action;
* ultrasound-guided biopsy may appear surgical but lacks broad sterile workflow when compared to OR surgery.

### 5.2 Surgery vs Simulation Laboratories

#### Distinctions
* live surgery produces tissue response, bleeding, and physiological signs;
* simulation uses mannequins, models, or animal tissues without live physiology.

#### Evidence Contrast
* surgical evidence includes patient monitoring, anesthesia, and active hemostasis;
* simulation evidence often shows uniform synthetic textures and explicit instructional cues.

#### Example Distinctions
* cadaver dissection lacks perfusion and vital sign monitoring;
* VR surgical training can mimic instruments but not actual tissue behavior.

### 5.3 Surgery vs Medical Schools and Educational Programs

#### Distinctions
* educational content focuses on instruction and may include commentary or staged demonstration;
* surgery focuses on therapeutic intervention and patient outcome.

#### Evidence Contrast
* educational evidence includes lecterns, observers, and overlays;
* surgical evidence is anchored in live patient anatomy and clinical intent.

#### Example Distinctions
* a surgical lecture using cadavers is education, not live surgery;
* real surgery footage used for training retains surgical evidence but also educational metadata.