# Surgical Procedure Intelligence Framework

This document is a research-grade knowledge base for understanding surgical procedures as structured clinical scenes rather than as isolated object detections. It explains how surgical environments, team roles, instruments, anatomy, workflow phases, temporal progression, and uncertainty combine to yield explainable medical interpretation.

The purpose is not to identify a room by appearance alone, not to classify a scene by clothing or equipment alone, and not to infer surgery from superficial cues. The purpose is to build clinically meaningful reasoning around the evidence that makes a procedure recognizable, auditable, and safe to interpret.

Every section below is written as conceptual knowledge. It avoids implementation detail and focuses on the medical semantics that should guide perception, interpretation, confidence, and policy.

## 1. Foundational Principles
Surgical interpretation begins with evidence fusion across anatomy, instruments, sterile workflow, team coordination, patient state, and temporal sequence.
A procedure is recognized when multiple independent evidence streams converge around a coherent clinical narrative.
The strongest surgical reasoning comes from a combination of visible anatomy, instrument use, team behavior, procedural stage, patient positioning, and environmental organization.
A single cue such as a drape, a scalpel, or a mask is insufficient on its own because many non-surgical and educational scenes contain similar signals.
The medical subsystem must therefore distinguish between surgical appearance, surgical workflow, real operative intervention, and simulated or documentary imitation.

## 2. Operating Room Foundations
Operating rooms are carefully structured environments built to support asepsis, rapid intervention, close monitoring, team coordination, imaging access, and patient safety.
The room layout is organized by zones: sterile operative field, instrument field, anesthesia field, monitoring field, circulation path, and access corridor.
Sterile zones are not merely visual regions. They represent controlled clinical responsibility and contamination boundaries.
The sterile field is defined by the patient, the operative site, drapes, instruments placed for active use, and the team members who are operating within that field.
The non-sterile field includes circulation, documentation, supply movement, and team coordination outside the operative field.
Environmental evidence includes equipment placement, room architecture, lighting quality, floor markings, supply racks, monitor arrays, and the relationship between people and devices.
The room may contain imaging equipment, robotic systems, anesthesia carts, instrument tables, sharps disposal, suction systems, and patient warming devices.
In a real operative environment, these elements follow surgical logic rather than arbitrary decoration or generic medical staging.
The room organization is therefore a form of clinical grammar that supports scene understanding and explainability.

### 2.1 Room Layout and Spatial Semantics
The operating room is a layered environment with explicit spatial semantics.
The operative table occupies the central clinical locus for intervention.
The anesthesia workstation stands near the patient head or torso, depending on the procedure type.
Instrument tables hold tools prepared for immediate use, while back tables may hold additional sterile supplies.
Monitoring equipment is positioned to observe the patient and to support the anesthesia team.
A circulation path allows personnel movement without crossing the sterile field.
Imaging equipment, light towers, and robotic consoles may occupy peripheral or dedicated zones depending on the procedure.
The spatial arrangement indicates whether the room is functioning as a procedural environment or simply resembling one.
A genuine room will show purposeful placement of devices according to procedural need rather than random clustering.

### 2.2 Sterile Workflow Semantics
Sterile workflow is a conceptual system of controlled contact, material movement, contamination prevention, and role-specific behavior.
Sterile instruments are handled by staff in sterile gloves or through sterile barriers.
Sterile draping creates an explicit barrier between the operative site and the broader room.
Non-sterile personnel remain outside the field or interact with materials only through controlled exchange.
The distinction between sterile and non-sterile behavior is often easier to infer than the distinction between objects and rooms.
Observations such as instrument passing, safe field coverage, dressing movement, and team repositioning are meaningful because they indicate procedural discipline.
Sterility is not a simple visual score. It is a behavioral and spatial logic that must be reconstructed across time.

## 3. Surgical Workflow Intelligence
Surgical workflow intelligence describes the progression of a procedure through phases that are clinically meaningful and visually distinguishable to varying degrees.
A workflow is not merely a series of actions. It is a sequence of roles, instruments, environmental changes, patient state changes, and team coordination events.
A recognizable workflow contains continuity. One phase flows into another with coherent changes in actions, materials, and attention.
Workflow reasoning is essential because a single instrument or a single room cannot establish surgery by itself.
The more a scene shows coordinated progression across phases, the more confidently it can be interpreted as a genuine procedure.

### 3.1 Patient Preparation
Observable evidence for patient preparation: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for patient preparation: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for patient preparation: the tools visible are those that would typically be used during patient preparation rather than tools belonging to a different phase.
Environmental evidence for patient preparation: the room arrangement and supply organization reflect the needs of patient preparation rather than closed or unrelated activity.
Temporal evidence for patient preparation: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for patient preparation: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for patient preparation: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for patient preparation: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.2 Anesthesia Induction
Observable evidence for anesthesia induction: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for anesthesia induction: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for anesthesia induction: the tools visible are those that would typically be used during anesthesia induction rather than tools belonging to a different phase.
Environmental evidence for anesthesia induction: the room arrangement and supply organization reflect the needs of anesthesia induction rather than closed or unrelated activity.
Temporal evidence for anesthesia induction: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for anesthesia induction: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for anesthesia induction: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for anesthesia induction: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.3 Sterile Draping
Observable evidence for sterile draping: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for sterile draping: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for sterile draping: the tools visible are those that would typically be used during sterile draping rather than tools belonging to a different phase.
Environmental evidence for sterile draping: the room arrangement and supply organization reflect the needs of sterile draping rather than closed or unrelated activity.
Temporal evidence for sterile draping: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for sterile draping: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for sterile draping: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for sterile draping: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.4 Incision
Observable evidence for incision: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for incision: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for incision: the tools visible are those that would typically be used during incision rather than tools belonging to a different phase.
Environmental evidence for incision: the room arrangement and supply organization reflect the needs of incision rather than closed or unrelated activity.
Temporal evidence for incision: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for incision: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for incision: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for incision: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.5 Exposure
Observable evidence for exposure: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for exposure: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for exposure: the tools visible are those that would typically be used during exposure rather than tools belonging to a different phase.
Environmental evidence for exposure: the room arrangement and supply organization reflect the needs of exposure rather than closed or unrelated activity.
Temporal evidence for exposure: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for exposure: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for exposure: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for exposure: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.6 Exploration
Observable evidence for exploration: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for exploration: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for exploration: the tools visible are those that would typically be used during exploration rather than tools belonging to a different phase.
Environmental evidence for exploration: the room arrangement and supply organization reflect the needs of exploration rather than closed or unrelated activity.
Temporal evidence for exploration: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for exploration: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for exploration: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for exploration: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.7 Intervention
Observable evidence for intervention: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for intervention: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for intervention: the tools visible are those that would typically be used during intervention rather than tools belonging to a different phase.
Environmental evidence for intervention: the room arrangement and supply organization reflect the needs of intervention rather than closed or unrelated activity.
Temporal evidence for intervention: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for intervention: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for intervention: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for intervention: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.8 Hemostasis
Observable evidence for hemostasis: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for hemostasis: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for hemostasis: the tools visible are those that would typically be used during hemostasis rather than tools belonging to a different phase.
Environmental evidence for hemostasis: the room arrangement and supply organization reflect the needs of hemostasis rather than closed or unrelated activity.
Temporal evidence for hemostasis: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for hemostasis: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for hemostasis: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for hemostasis: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.9 Reconstruction
Observable evidence for reconstruction: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for reconstruction: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for reconstruction: the tools visible are those that would typically be used during reconstruction rather than tools belonging to a different phase.
Environmental evidence for reconstruction: the room arrangement and supply organization reflect the needs of reconstruction rather than closed or unrelated activity.
Temporal evidence for reconstruction: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for reconstruction: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for reconstruction: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for reconstruction: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.10 Closure
Observable evidence for closure: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for closure: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for closure: the tools visible are those that would typically be used during closure rather than tools belonging to a different phase.
Environmental evidence for closure: the room arrangement and supply organization reflect the needs of closure rather than closed or unrelated activity.
Temporal evidence for closure: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for closure: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for closure: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for closure: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.11 Dressing
Observable evidence for dressing: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for dressing: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for dressing: the tools visible are those that would typically be used during dressing rather than tools belonging to a different phase.
Environmental evidence for dressing: the room arrangement and supply organization reflect the needs of dressing rather than closed or unrelated activity.
Temporal evidence for dressing: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for dressing: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for dressing: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for dressing: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.12 Transfer
Observable evidence for transfer: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for transfer: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for transfer: the tools visible are those that would typically be used during transfer rather than tools belonging to a different phase.
Environmental evidence for transfer: the room arrangement and supply organization reflect the needs of transfer rather than closed or unrelated activity.
Temporal evidence for transfer: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for transfer: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for transfer: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for transfer: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

### 3.13 Recovery Preparation
Observable evidence for recovery preparation: the scene contains actions, materials, and positioning consistent with that phase rather than a generic medical environment.
Workflow evidence for recovery preparation: team members shift attention in a way that is temporally consistent with the expected order of events.
Instrument evidence for recovery preparation: the tools visible are those that would typically be used during recovery preparation rather than tools belonging to a different phase.
Environmental evidence for recovery preparation: the room arrangement and supply organization reflect the needs of recovery preparation rather than closed or unrelated activity.
Temporal evidence for recovery preparation: earlier or later phases appear absent or only weakly present, indicating the scene is concentrated around the intended phase.
Expected interaction for recovery preparation: clinicians, patient, and devices coordinate around a shared procedural objective without random or unrelated actions.
Ambiguity sources for recovery preparation: incomplete visibility, sparse anatomy, unusual camera angle, or staged props can weaken the interpretation.
Downstream interpretation for recovery preparation: a strong phase-specific interpretation can support limited but meaningful procedural recognition.

## 4. Surgical Team Framework
The surgical team is an interpretive structure. Roles are not only occupational labels; they are evidence-bearing behaviors and spatial patterns.
The lead surgeon is typically the person directing the operative field, manipulating the key instruments, and governing the procedure sequence.
An assistant surgeon may support exposure, retraction, suction, or tissue management while maintaining awareness of surgical goals.
The scrub nurse or scrub technician works within the sterile field and handles instruments, counts materials, and supports aseptic workflow.
The circulating nurse manages non-sterile coordination, documentation, supply exchange, and room logistics.
The anesthesiologist manages the physiological support of the patient and observes monitors, anesthesia delivery, and airway status.
Surgical technologists support setup, instrument readiness, and procedural organization.
Students and observers are usually positioned at the periphery, with less direct involvement in the operative field.
Robotic assistants change the expected geometry of the team because the surgeon may operate from a console while an arm system acts within the field.
Each role leaves a distinct pattern of motion, spatial position, tool use, and collaboration logic.

### 4. Lead surgeon
Responsibility pattern: directs the operative plan, governs instrument use, and controls critical steps.
Observable evidence: body position, tool handling, proximity to the patient, interaction with instruments, and confidence of movement.
Workflow evidence: the role appears where the stage of the procedure would make that role meaningful.
Environmental evidence: the role occupies a location that is consistent with the sterile or non-sterile organization of the room.
Interaction evidence: the role exchanges tools, receives instructions, verifies materials, or manages monitors in a coordinated manner.
Ambiguity sources: similar clothing, poor visibility, crowded scenes, or camera framing may blur role boundaries.
Downstream interpretation: a well-supported role assignment strengthens the interpretive chain for procedure recognition.

### 4. Assistant surgeon
Responsibility pattern: supports exposure, retraction, tissue handling, and procedural continuity.
Observable evidence: body position, tool handling, proximity to the patient, interaction with instruments, and confidence of movement.
Workflow evidence: the role appears where the stage of the procedure would make that role meaningful.
Environmental evidence: the role occupies a location that is consistent with the sterile or non-sterile organization of the room.
Interaction evidence: the role exchanges tools, receives instructions, verifies materials, or manages monitors in a coordinated manner.
Ambiguity sources: similar clothing, poor visibility, crowded scenes, or camera framing may blur role boundaries.
Downstream interpretation: a well-supported role assignment strengthens the interpretive chain for procedure recognition.

### 4. Scrub nurse
Responsibility pattern: maintains sterile technique, passes instruments, and monitors procedural support needs.

### 4. Circulating nurse
Responsibility pattern: coordinates non-sterile supply flow, documentation, and room logistics.

### 4. Anesthesiologist
Responsibility pattern: monitors hemodynamics, oxygenation, anesthesia delivery, and patient stability.

### 4. Surgical technologist
Responsibility pattern: supports preparation, tray setup, and instrument transfer.

### 4. Medical student
Responsibility pattern: observes or assists under supervision and may show uncertainty in motion or positioning.

### 4. Observer
Responsibility pattern: watches the procedure from a vantage point that is usually less active and less central.

### 4. Robotic assistant
Responsibility pattern: provides instrument-controlled assistance and changes the expected human-machine interaction pattern.

### 4. Perfusionist
Responsibility pattern: supports cardiopulmonary bypass and complex hemodynamic management.

### 4. Radiology technician
Responsibility pattern: supports imaging workflows or intraoperative imaging tasks.

### 4. Nurse anesthetist
Responsibility pattern: supports anesthesia delivery, monitoring, and patient stabilization.

## 5. Instrument and Anatomy Semantics
Instrument understanding is not equivalent to generic object recognition. A surgical instrument matters because of its role in the operative field, its relationship to anatomy, its stage-specific use, and the way it participates in the team workflow.
The same tool may appear in a museum, a demonstration, or a classroom without being part of a genuine operative activity. The distinction is determined by context, patient interaction, workflow continuity, and team behavior.
Anatomy must be interpreted as a patient-specific site that is exposed, prepared, manipulated, or reconstructed. Surgical reasoning is strongest when anatomy, instruments, and procedural intent align.

### 5. Scalpel
Instrument role: used for incision, visible as a blade-handled cutting tool in the operative field.
Observable evidence: the object appears in the procedure-specific region and is handled with procedural intent.
Contextual evidence: the instrument aligns with the anatomy, the team role, and the stage of the procedure.
Interaction evidence: tissue contact, tool exchange, or controlled movement suggests active involvement.
Ambiguity sources: the object may appear as a prop, a teaching aid, or a generic medical device without operative use.
Downstream interpretation: correct instrument interpretation is essential for reconstructing the operative action.

### 5. Forceps
Instrument role: used for grasping tissue, clips, or sutures and often appears in close contact with anatomy.
Observable evidence: the object appears in the procedure-specific region and is handled with procedural intent.
Contextual evidence: the instrument aligns with the anatomy, the team role, and the stage of the procedure.
Interaction evidence: tissue contact, tool exchange, or controlled movement suggests active involvement.
Ambiguity sources: the object may appear as a prop, a teaching aid, or a generic medical device without operative use.
Downstream interpretation: correct instrument interpretation is essential for reconstructing the operative action.

### 5. Retractor
Instrument role: used to hold tissue aside and establish access to deeper structures.

### 5. Suction Device
Instrument role: used to remove fluids and maintain a clear field.

### 5. Electrosurgical Pencil
Instrument role: used for tissue cutting or coagulation under active control.

### 5. Needle Holder
Instrument role: used to drive suture material through tissue.

### 5. Laparoscopic Grasper
Instrument role: used for endoscopic access and tissue manipulation.

### 5. Trocar
Instrument role: used to establish access in minimally invasive surgery.

### 5. Drill
Instrument role: used in orthopedic bone preparation or fixation.

### 5. Saw
Instrument role: used in orthopaedic cutting and osteotomy tasks.

### 5. Stapler
Instrument role: used to close tissue or vessels in a rapid and controlled manner.

### 5. Clips
Instrument role: used for vessel sealing or fixation.

### 5. Microscope
Instrument role: used for high-precision visual access in neurosurgery or microsurgery.

### 5. Endoscope
Instrument role: used for internal spatial visualization in minimally invasive or endoscopic surgery.

### 5. Ultrasound Probe
Instrument role: used to localize structures or guide intervention.

### 5. Vascular Clamp
Instrument role: used to control blood flow during vascular or cardiac procedures.

### 5. Ventricular Assist Device
Instrument role: used in advanced cardiac support and complex intervention.

### 5. Arthroscope
Instrument role: used to visualize the interior of a joint.

### 5. Cautery Unit
Instrument role: used for controlled coagulation and hemostasis.

### 5. Dilator
Instrument role: used for controlled widening of a tract or canal.

### 5. Bone Plate
Instrument role: used for fracture fixation and structural reconstruction.

## 6. Specialty Ontology
The surgical ontology spans general surgery, orthopedic surgery, trauma surgery, neurosurgery, cardiac surgery, thoracic surgery, plastic surgery, ENT surgery, dental surgery, ophthalmology, obstetrics, gynecology, urology, pediatric surgery, vascular surgery, transplant surgery, emergency surgery, minimally invasive surgery, robotic surgery, hybrid operating rooms, simulation laboratories, cadaver laboratories, veterinary surgery, educational surgery, and training demonstrations.
Each specialty is defined by a procedure family, a characteristic evidence profile, and a set of ambiguity hazards.

### General Surgery
Procedure family: General Surgery contains interventions that share a common operative logic, a characteristic anatomy, and a recognizable evidence pattern.
The scene may be interpreted more confidently when visual evidence aligns with specialty-specific instruments, room organization, patient positioning, and team behavior.
#### Procedure example: appendectomy
Observable evidence for appendectomy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for appendectomy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for appendectomy: the instrument selection and room setup are appropriate to appendectomy rather than to unrelated tasks.
Environmental evidence for appendectomy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for appendectomy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for appendectomy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for appendectomy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for appendectomy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: cholecystectomy
Observable evidence for cholecystectomy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for cholecystectomy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for cholecystectomy: the instrument selection and room setup are appropriate to cholecystectomy rather than to unrelated tasks.
Environmental evidence for cholecystectomy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for cholecystectomy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for cholecystectomy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for cholecystectomy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for cholecystectomy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: hernia repair
Observable evidence for hernia repair: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for hernia repair: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for hernia repair: the instrument selection and room setup are appropriate to hernia repair rather than to unrelated tasks.
Environmental evidence for hernia repair: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for hernia repair: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for hernia repair: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for hernia repair: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for hernia repair: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: bowel resection
Observable evidence for bowel resection: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for bowel resection: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for bowel resection: the instrument selection and room setup are appropriate to bowel resection rather than to unrelated tasks.
Environmental evidence for bowel resection: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for bowel resection: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for bowel resection: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for bowel resection: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for bowel resection: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: thyroidectomy
Observable evidence for thyroidectomy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for thyroidectomy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for thyroidectomy: the instrument selection and room setup are appropriate to thyroidectomy rather than to unrelated tasks.
Environmental evidence for thyroidectomy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for thyroidectomy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for thyroidectomy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for thyroidectomy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for thyroidectomy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: mastectomy
Observable evidence for mastectomy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for mastectomy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for mastectomy: the instrument selection and room setup are appropriate to mastectomy rather than to unrelated tasks.
Environmental evidence for mastectomy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for mastectomy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for mastectomy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for mastectomy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for mastectomy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: laparotomy
Observable evidence for laparotomy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for laparotomy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for laparotomy: the instrument selection and room setup are appropriate to laparotomy rather than to unrelated tasks.
Environmental evidence for laparotomy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for laparotomy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for laparotomy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for laparotomy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for laparotomy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: gastrectomy
Observable evidence for gastrectomy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for gastrectomy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for gastrectomy: the instrument selection and room setup are appropriate to gastrectomy rather than to unrelated tasks.
Environmental evidence for gastrectomy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for gastrectomy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for gastrectomy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for gastrectomy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for gastrectomy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

### Orthopedic Surgery
Procedure family: Orthopedic Surgery contains interventions that share a common operative logic, a characteristic anatomy, and a recognizable evidence pattern.
The scene may be interpreted more confidently when visual evidence aligns with specialty-specific instruments, room organization, patient positioning, and team behavior.
#### Procedure example: fracture fixation
Observable evidence for fracture fixation: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for fracture fixation: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for fracture fixation: the instrument selection and room setup are appropriate to fracture fixation rather than to unrelated tasks.
Environmental evidence for fracture fixation: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for fracture fixation: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for fracture fixation: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for fracture fixation: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for fracture fixation: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: arthroscopy
Observable evidence for arthroscopy: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for arthroscopy: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for arthroscopy: the instrument selection and room setup are appropriate to arthroscopy rather than to unrelated tasks.
Environmental evidence for arthroscopy: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for arthroscopy: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for arthroscopy: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for arthroscopy: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for arthroscopy: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

#### Procedure example: joint replacement
Observable evidence for joint replacement: anatomy, draping, positioning, and operative field preparation that support the procedural claim.
Workflow evidence for joint replacement: the procedural stage is consistent with an expected progression from preparation to intervention and closure.
Equipment evidence for joint replacement: the instrument selection and room setup are appropriate to joint replacement rather than to unrelated tasks.
Environmental evidence for joint replacement: room organization, lighting, monitor placement, and resource distribution match the specialty context.
Temporal evidence for joint replacement: the visible sequence suggests a coherent clinical progression rather than an isolated frame or a staged replica.
Expected interaction for joint replacement: clinicians and devices act with coordinated purpose, and the operative site is central to the scene.
Ambiguity sources for joint replacement: teaching demonstrations, mock environments, high-style filming, or partial visibility may distort the interpretation.
Downstream interpretation for joint replacement: a careful specialty-specific reading improves scene understanding and reduces overconfident labeling.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

	```text
	O_surgical_tools = Max(O_scalpel, O_forceps, O_retractor)
	```

	```text
	H_drape = Integrated_Pixels(H_range: [80, 160], S_range: [0.40, 1.00])
	```

```text
P_surgery = (O_surgical_tools * 0.40) + (H_drape * 0.30) + (T_gloves * 0.30)
```

```text
P_surgery >= 0.70   ---> Verified Surgical Operation ---> Safe (Bypass standard filters)
	   P_surgery  Non-Surgical Environment    ---> Normal pipeline execution
```

- **State: Surgical Operation Verified (P_surgery >= 0.70):**The visual matches a surgical procedure inside a sterile draped theater.