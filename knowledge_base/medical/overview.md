# Medical Context Intelligence Architecture Framework
This document is the authoritative medical intelligence architecture framework for the `medical/` subsystem.
It defines how multimodal evidence from clinical environments, medical workflows, patient interactions, and procedural activity is fused into explainable medical understanding.
It is explicitly architecture-first and concept-driven, not a runtime implementation or optimization guide.

## 1. Purpose
The purpose of this architecture is to describe how medical scene understanding, clinical workflow reasoning, medical intent inference, temporal consistency, evidence fusion, confidence propagation, uncertainty propagation, explainable medical interpretation, and policy support are orchestrated together.
It positions the medical subsystem as the core decision-support layer for healthcare-relevant content and clinical context validation.
It defines the medical ontology, evidence categories, environment taxonomy, workflow stages, and reasoning pipeline needed for robust clinical inference.

## 2. Architectural Principles
Medical reasoning must be evidence-driven, not heuristic-driven. It must aggregate multiple independent evidence sources before trusting a medical interpretation.
Medical context must be grounded in domain-specific clinical knowledge, patient safety concerns, and care workflow semantics.
Explainability is required for every inference: the system must expose which evidence supported the conclusion, where uncertainty remains, and how confidence was computed.
Uncertainty must be preserved throughout the pipeline rather than collapsed into a single binary label.
Confidence must reflect both the quantity and quality of medical evidence across modalities, workflow, environment, and time.
Policy support must be informed by clinical severity, care intent, patient privacy, and safety-critical risk, not by superficial scene appearance.
The medical subsystem must differentiate true clinical activity from educational simulation, staged demonstration, synthetic media, and deceptive mimicry.

## 3. Medical Foundations
Medical understanding requires a unified framework that combines clinical reasoning, medical informatics, healthcare operations, patient-centered care, biomedical perception, and multimodal evidence fusion.
The subsystem must treat medical content as a structured inferential process that moves from observation to interpretation to policy-relevant conclusion.
Foundations include the semantics of clinical roles, the structure of care workflows, the taxonomy of medical environments, and the meaning of medical intent.

## 3.1 Clinical Reasoning Foundations
- Clinical reasoning begins with the identification of a patient problem, a care context, and the evidence available to resolve the problem.
- It uses differential reasoning to compare candidate clinical contexts such as emergency care, surgery, outpatient consultation, and rehabilitation.
- Medical intent is inferred by asking why an action is being taken and whether the evidence is consistent with a healthcare goal.
- Clinical reasoning must preserve alternative explanations and rank them by evidence strength and plausibility.

## 3.2 Healthcare Workflow Foundations
Healthcare workflows describe the ordered progression of tasks, roles, and transitions that occur during clinical care. These workflows are critical for interpreting medical scenes because the same objects or postures mean different things at different stages.
### 1. Intake and triage
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Patient registration forms, waiting room layout, initial vital signs recording, triage coding, rapid assessment of urgency, and front-desk interaction.

### 2. History taking and examination
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Clinician conversation with patient, medical history forms, focused physical exam maneuvers, stethoscope use, palpation, and inspection of symptoms.

### 3. Diagnostic evaluation
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Measurement devices, point-of-care tests, imaging orders, lab specimen collection, clinician review of results, and diagnostic reasoning gestures.

### 4. Treatment planning
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Care plan documentation, medication review, treatment options discussion, shared decision-making, and coordination of follow-up appointments.

### 5. Procedure preparation
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Sterile field setup, instrument tray arrangement, patient positioning, anesthesia equipment checks, skin preparation, and surgical counts.

### 6. Intervention and treatment
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Active procedural actions, instrument manipulation, medication administration, device therapy application, and targeted clinical intervention.

### 7. Monitoring and adjustment
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Continuous observation of patient state, alarm response, titration of therapy, documentation updates, and interdisciplinary coordination.

### 8. Post-procedure recovery
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Patient stabilization, wound dressing management, mobility assessment, pain control, and preparation for transfer or discharge.

### 9. Discharge and follow-up
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Patient education, medication instructions, referral documentation, appointment scheduling, and care continuity planning.

### 10. Telehealth consultation
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Remote video interaction, patient home environment observation, digital diagnostics, peripheral device readings, and telehealth documentation.

### 11. Clinical education
- Evidence includes the actions, documents, equipment, and human roles that make the workflow stage specific.
- Example: Teaching gestures, simulation supervision, trainee interaction, demonstration of procedures, and feedback conversations.

### 12. Care coordination
- Example: Handoff communication, interdisciplinary summary, referral coordination, and documentation of shared care responsibilities.

### 13. Emergency response
- Example: Rapid team mobilization, emergency equipment deployment, life support initiation, airway management, and urgent transfer activities.

### 14. Preoperative assessment
- Example: Patient consent discussion, anesthesia assessment, preoperative checklist verification, and surgical readiness evaluation.

### 15. Rehabilitation planning
- Example: Functional goal setting, therapy prescription, assistive device selection, and progress note documentation.

## 3.3 Patient-Centered Care Foundations
- Patient-centered care evidence includes patient positioning, consent interactions, privacy measures, comfort objects, and support person involvement.
- The subsystem must detect whether a scene reflects active care for a patient versus training, demonstration, or simulation.
- Privacy and dignity indicators are essential in medical inference, especially when patient exposure or sensitive procedures are present.
- Patient-centered reasoning distinguishes clinical assistance from casual observation and from nonclinical social interaction.

## 3.4 Biomedical Perception Foundations
- Biomedical perception recognizes anatomy, pathology, medical devices, procedural artifacts, and physiological signals.
- It is not limited to skin or body appearance; it also includes object-state relationships, fluid handling, monitor readouts, and procedural preparation.
- Perception quality is judged by clinical specificity, such as recognizing a ventilator circuit versus a decorative hose.
- The system must distinguish genuine medical artifacts from lookalikes such as consumer tools, costumes, or household items.

## 4. Medical Scene Understanding
Medical scene understanding is the process of interpreting a visual or multimodal scene as belonging to a healthcare context with specific clinical meaning.
It combines environment classification, object semantics, human roles, activity dynamics, and workflow stage identification.
Scene understanding provides the necessary foundation for subsequent medical intent, confidence, and policy reasoning.

## 4.1 Scene Understanding Components
- Environment context: hospital wing, clinic room, emergency department, operating room, imaging suite, rehabilitation space, telemedicine setting, ambulance, anatomy laboratory, simulation center.
- Object semantics: medical devices, instruments, consumables, diagnostic tools, monitoring equipment, and patient support devices.
- Human roles: clinician, surgeon, nurse, anesthesiologist, patient, caregiver, trainee, technician, family member.
- Activity dynamics: preparation, assessment, intervention, monitoring, assistance, teaching, documentation.
- Workflow stage: triage, examination, imaging, procedure, anesthesia, therapy, recovery, discharge.
- Temporal continuity: sequence of activity over minutes, hours, days, or repeated visits.
- Evidence provenance: the origin and modality of each signal supporting the interpretation.

## 4.2 Scene Validation Criteria
- Alignment with a known medical environment taxonomy.
- Presence of clinically relevant objects or equipment that support a medical interpretation.
- Human role evidence consistent with care activity rather than performance or entertainment.
- Workflow coherence across adjacent frames or segments.
- Temporal consistency that supports a sustained medical process.
- Absence of strong contradictory evidence such as decorative sets, consumer electronics, or theatrical costuming configured as medical equipment.

## 5. Clinical Environment Framework
This framework enumerates the major clinical environments and describes the evidence patterns that distinguish them.
Medical environments are not interchangeable: each environment imposes its own evidential expectations, risk profile, and workflow semantics.

### Hospital inpatient wards
Evidence includes patient beds with monitoring poles, medication carts, nurse station visibility, visitor chairs, and room signage that denotes clinical specialization.

### Operating rooms
Evidence includes sterile overhead lights, surgical instrument tables, anesthesia machines, sterile draping, surgical team attire, and clean room boundaries.

### Emergency departments
Evidence includes triage bays, stretcher corridors, rapid response carts, monitoring gear, urgent care signage, and chaotic movement patterns.

### Intensive care units
Evidence includes ventilators, infusion pumps, bedside monitors, isolation curtains, critical care staffing, and high acuity patient support devices.

### Outpatient exam rooms
Evidence includes examination tables, otoscopes, sphygmomanometers, medical cabinets, patient chairs, and clinician desk documentation.

### Rehabilitation clinics
Evidence includes physical therapy equipment, exercise mats, parallel bars, gait training devices, resistance bands, and therapist-patient instruction.

### Imaging suites
Evidence includes MRI or CT gantries, ultrasound probes, X-ray detectors, lead aprons, radiology workstations, and technologist positioning.

### Dental clinics
Evidence includes dental chairs, overhead lights, intraoral cameras, suction devices, dental instruments, protective eyewear, and patient bibs.

### Dermatology clinics
Evidence includes dermatoscopes, magnifying lights, skin lesion maps, clinical photography setups, topical medication trays, and examination gowns.

### Telemedicine setups
Evidence includes webcams, medical-grade microphones, laptops or tablets, remote monitoring devices, patient home environments, and clinician-facing screens.

### Ambulances
Evidence includes stretcher mounts, oxygen tanks, defibrillators, tinted compartment partitions, paramedic uniforms, and emergent transport equipment.

### Medical classrooms
Evidence includes anatomical charts, simulation mannequins, instructor podium, student notebooks, and clinical demonstration tools.

### Simulation laboratories
Evidence includes realistic medical manikins, task trainers, simulated monitors, training props, and instructor feedback systems.

### Dermatology photography booths
Evidence includes standardized lighting, patient positioning, imaging rulers, color calibration cards, and lesion labelling.

### Orthopedic procedure rooms
Evidence includes traction tables, bone drills, power tools, orthopedic implants, and specialized positioning aids.

### Obstetric delivery rooms
Evidence includes fetal monitoring strips, birthing beds, neonatal resuscitation equipment, and obstetric care staff.

### Psychiatric consultation spaces
Evidence includes interview seating, privacy shielding, notes documentation, and low-stimulation room features.

### Laboratory medicine spaces
Evidence includes specimen tubes, centrifuges, biosafety cabinets, diagnostic analyzers, and specimen labeling.

### Ophthalmology clinics
Evidence includes slit lamps, visual acuity charts, autorefractors, ophthalmoscopes, and patient chin rests.

### Oncology infusion centers
Evidence includes infusion pumps, chemotherapy preparation trays, patient recliner chairs, and oncology nurse presence.

## 6. Clinical Role Taxonomy
This taxonomy defines the core clinical and care roles that the medical subsystem must recognize and distinguish.
### Surgeon
Leads operative intervention, manipulates surgical instruments, directs team movements, and remains within the sterile field.
Evidence:
- Role-specific attire, behavior, equipment interaction, and spatial position in the medical scene.
- Documentation or verbal cues that support the role assignment.
- Distinguishing features from other roles in the same environment.

### Anesthesiologist
Manages airway, monitors anesthesia delivery, observes vital sign trends, and adjusts sedation or analgesia during procedures.
Evidence:
- Role-specific attire, behavior, equipment interaction, and spatial position in the medical scene.
- Documentation or verbal cues that support the role assignment.
- Distinguishing features from other roles in the same environment.

### Scrub Nurse
Handles instruments in the sterile field, provides the surgeon with tools, counts sponges, and maintains sterile technique.

### Circulating Nurse
Coordinates nonsterile equipment, documents procedure progress, assists with patient positioning, and communicates with team members outside the sterile field.

### Intensive Care Nurse
Monitors life support devices, titrates infusions, assesses patient response, and collaborates on critical care interventions.

### Emergency Physician
Performs rapid assessment, directs resuscitation, prioritizes interventions, and manages urgent care workflows.

### Primary Care Physician
Conducts general health evaluation, coordinates referrals, performs routine screening, and manages chronic conditions.

### Radiologist
Interprets medical imaging, annotates scans, discusses findings with clinicians, and guides diagnostic decision-making.

### Radiologic Technologist
Positions patients for imaging, operates imaging equipment, ensures safety protocols, and acquires diagnostic images.

### Dermatologist
Examines skin lesions, performs biopsies, documents dermatologic findings, and recommends topical or surgical treatment.

### Physical Therapist
Guides therapeutic movement, assesses functional mobility, adapts exercises, and educates patients on rehabilitation tasks.

### Occupational Therapist
Assesses daily living activities, prescribes adaptive tools, trains patients in functional skills, and monitors recovery.

### Psychiatrist
Conducts mental status evaluation, provides psychotherapy, manages medication, and assesses behavioral health risk.

### Dentist
Examines oral structures, performs dental restoration, manages infection control, and guides oral hygiene care.

### Dental Hygienist
Performs prophylaxis, periodontal assessment, oral hygiene instruction, and assistant support during dental procedures.

### Phlebotomist
Collects blood specimens, labels tubes, follows biosafety protocols, and prepares samples for laboratory analysis.

### Medical Assistant
Prepares exam rooms, collects patient data, administers basic tests, and supports clinician workflow.

### Patient
Receives evaluation, participates in symptom reporting, tolerates procedures, and exhibits physiological responses.

### Caregiver
Provides support, assists with mobility, communicates health history, and helps maintain patient comfort.

### Medical Student
Observes clinical care, asks questions, performs supervised tasks, and engages in educational reflection.

### Simulation Instructor
Designs training scenarios, observes performance, provides feedback, and evaluates trainee competency.

### Paramedic
Delivers prehospital emergency care, stabilizes patients, manages transport equipment, and communicates handoff information.

### Pharmacist
Verifies medication orders, prepares doses, advises on drug interactions, and supports medication safety.

### Clinical Laboratory Scientist
Performs diagnostic assays, validates test results, manages samples, and interprets analytic quality metrics.

### Rehabilitation Aide
Assists therapists, sets up equipment, supports patient transfers, and tracks therapeutic repetitions.

### Clinical Educator
Provides instruction, demonstrates procedures, assesses learners, and maintains educational materials.

## 7. Medical Equipment Taxonomy
This taxonomy categorizes medical equipment and devices by clinical function, environment, and evidentiary role.
### Scalpel
A surgical cutting instrument used for incisions, recognized by its blade, sterile packaging, and presence within the operative field.
- Typical clinical placement, connection, or use in the relevant medical environment.
- Relationship to patient condition, procedure stage, or treatment type.
- Distinctive visual cues that separate it from nonmedical lookalike objects.

### Forceps
A grasping instrument used for tissue handling, typically found near a surgeonâ€™s hand or on a sterile tray.
- Typical clinical placement, connection, or use in the relevant medical environment.
- Relationship to patient condition, procedure stage, or treatment type.
- Distinctive visual cues that separate it from nonmedical lookalike objects.

### Retractor
A device used to hold tissue or organs aside during surgery, visible in the operative field to maintain exposure.

### Endoscope
A tubular optical device inserted into a body cavity for internal visualization, often connected to a display tower.

### Dermatoscope
A handheld skin examination device with polarized lighting used to inspect lesions at high magnification.

### Ultrasound Probe
A transducer used for sonographic imaging, typically held against the patientâ€™s skin and connected to an ultrasound console.

### MRI Gantry
The circular frame of an MRI scanner that houses the magnet and patient bore, used in imaging suites.

### CT Scanner
A ring-shaped imaging device that rotates X-ray source and detectors around the patient, seen in radiology rooms.

### X-ray Detector
A flat panel or cassette used to capture radiographic images, often visible adjacent to a patient table.

### Infusion Pump
A device that delivers fluids, medications, or nutrients at controlled rates, usually attached to an IV pole.

### Ventilator
A life support machine that assists or controls breathing through tubing connected to the patient.

### Anesthesia Machine
A complex system that supplies gases, monitors anesthesia depth, and supports airway management.

### Defibrillator
A device used to deliver electrical shocks for cardiac resuscitation, often with visible pads and a charging display.

### Suction Canister
A container that collects fluid removed from a surgical field or airway, connected to tubing and a vacuum source.

### Electrosurgical Unit
A device that delivers electrical energy for cutting or coagulating tissue, accompanied by a handpiece and grounding pad.

### Patient Monitor
A screen displaying heart rate, oxygen saturation, blood pressure, and respiratory rate, typically at the bedside.

### Pulse Oximeter
A clip placed on a finger or ear that measures oxygen saturation and pulse rate, often with a visible display cable.

### Blood Pressure Cuff
An inflatable cuff used to measure arterial pressure, seen on patient arms or legs during assessment.

### Stethoscope
A clinicianâ€™s auscultation tool draped around the neck or placed on the patientâ€™s chest or back.

### Otoscope
A handheld device used to inspect the ear canal, often seen during examination of the head and neck.

### Tonometer
An ophthalmic device used to measure intraocular pressure, visible in eye examination workflows.

### Slit Lamp
An ophthalmic microscope with adjustable illumination used for detailed eye exams, usually with a chin rest.

### Dental Handpiece
A rotary instrument used for dental preparation, visible in oral care settings on a dental tray.

### Dental Suction
A small suction device used to remove saliva and debris from the oral cavity during dental procedures.

### Gait Belt
A belt used by therapists to safely assist patient ambulation, typically wrapped around a patientâ€™s waist.

### Parallel Bars
A rehabilitation device used for gait training and balance practice, consisting of two horizontal bars.

### Exercise Ball
A large inflatable ball used in physical therapy for core strengthening and balance training.

### Wheelchair
A mobility device that indicates patient transport, rehabilitation, or mobility assistance.

### Walker
A patient support device used in mobility therapy or post-surgical recovery.

### Crutches
A mobility aid used to support weight-bearing during lower limb rehabilitation or injury recovery.

### Mobility Scooter
A powered mobility device seen in outpatient rehabilitation or community care settings.

### Blood Glucose Meter
A device used to measure blood sugar levels, often seen in diabetes management or telehealth care.

### ECG Machine
A device that records cardiac electrical activity, often with electrode leads attached to the patient.

### Ultrasound Console
A display and control system for ultrasound imaging, present in sonography rooms.

### Colonoscope
A flexible endoscope used for lower gastrointestinal visualization, typically connected to a tower display.

### Laparoscope
A minimally invasive surgical instrument inserted through small incisions for abdominal surgery.

### Robotic Surgical System
A system with articulated instrument arms controlled by a surgeon from a console, visible in advanced operative suites.

### Surgical Microscope
A high-magnification optical device used in microsurgery, often mounted on an adjustable stand.

### Sterile Drapes
Surgical drapes that isolate the operative field, identifiable by their color, material, and placement.

### Biopsy Punch
A hand instrument used to obtain a skin or tissue sample, often seen in dermatology workflows.

### Cryotherapy Device
A tool used to apply extreme cold to treat lesions, visible in dermatology or outpatient procedure rooms.

### Dermatology Photography Rig
A specialized camera and lighting setup for standardized skin imaging.

### Specimen Tube
A container used to collect blood, urine, or tissue samples for laboratory analysis.

### Centrifuge
A laboratory instrument used to separate specimen components, typically visible in lab medicine areas.

### Biosafety Cabinet
A protective enclosure used in laboratory specimen handling to maintain sterile conditions.

### Medication Cart
A mobile cart stocked with drugs, syringes, and administration supplies used in clinical care areas.

### IV Pole
A stand used to hang intravenous fluid bags and devices such as infusion pumps.

### Oxygen Tank
A cylinder containing medical oxygen used in respiratory support and emergency care.

### Nebulizer
A device that converts liquid medication into aerosol for inhalation therapy.

## 8. Medical Workflow Taxonomy
This taxonomy defines discrete clinical workflow stages and the evidence that anchors them in medical interpretation.
### Patient arrival
Evidence includes registration desks, intake forms, luggage, and arrival communication.
Evidence anchors:
- Physical artifacts, participant actions, documentation, and environment cues that define the stage.
- Distinctive clinical roles and communication behaviors specific to the stage.

### Triage assessment
Evidence includes urgency tags, rapid vital signs, triage history, and priority classification.
Evidence anchors:
- Physical artifacts, participant actions, documentation, and environment cues that define the stage.
- Distinctive clinical roles and communication behaviors specific to the stage.

### Focused history review
Evidence includes clinician-patient questioning, chart review, and symptom documentation.

### Physical examination
Evidence includes inspection, palpation, auscultation, percussion, and functional tests.

### Diagnostic imaging
Evidence includes patient positioning for MRI, CT, ultrasound, X-ray, or other scan modalities.

### Laboratory sample collection
Evidence includes phlebotomy, specimen labeling, and biohazard-safe handling.

### Clinical decision discussion
Evidence includes care plans, medication review, and shared decision-making conversations.

### Procedure consent
Evidence includes signed forms, explanation of risks, and patient affirmation of understanding.

### Surgical preparation
Evidence includes sterile gowning, skin antisepsis, instrument setup, and team briefing.

### Anesthesia induction
Evidence includes airway device placement, vital sign monitoring, and sedation administration.

### Operative intervention
Evidence includes incision, tissue manipulation, hemostasis, and direct surgical action.

### Surgical closure
Evidence includes suturing, stapling, dressing, and final wound inspection.

### Postoperative handoff
Evidence includes transfer from operating room to recovery area, handoff communication, and status report.

### Recovery room monitoring
Evidence includes observation of vital signs, pain control, and readiness for discharge.

### Outpatient consultation
Evidence includes routine exam, counseling, prescribing, and follow-up planning in a clinic.

### Chronic care management
Evidence includes medication adjustment, lifestyle counseling, and longitudinal tracking of conditions.

### Therapy session
Evidence includes therapist instruction, exercise repetition, and functional task practice.

### Rehabilitation reassessment
Evidence includes progress measurement, adaptive goal updates, and equipment modification.

### Home care visit
Evidence includes caregiver assistance, home environment adaptation, and remote supervision.

### Telehealth review
Evidence includes remote symptom discussion, digital device readings, and virtual care coordination.

### Palliative support
Evidence includes symptom management, comfort measures, emotional support, and advance care planning.

### Medication administration
Evidence includes drug preparation, route verification, dose delivery, and monitoring for response.

### Wound care
Evidence includes cleaning, dressing application, infection inspection, and documentation.

### Patient education
Evidence includes printed materials, teaching gestures, demonstration of techniques, and comprehension checks.

### Clinical handoff
Evidence includes team communication, responsibilities transfer, and care plan update.

### Quality review
Evidence includes audit checklists, compliance verification, and process improvement discussion.

### Emergency stabilization
Evidence includes airway support, hemorrhage control, resuscitation drugs, and rapid imaging.

### Adverse event response
Evidence includes complication management, escalation protocols, and immediate care adjustments.

### Discharge planning
Evidence includes patient instructions, medication reconciliation, follow-up appointments, and referrals.

### Follow-up evaluation
Evidence includes symptom reassessment, treatment adjustment, and long-term care coordination.

## 9. Medical Ontology Domains
This ontology describes the major healthcare domains the medical subsystem must distinguish and the evidence categories required for each.
Each domain is defined by observable evidence, environmental evidence, object evidence, behavioral evidence, workflow evidence, ambiguity sources, and downstream interpretation.

## Emergency Medicine
Observable evidence:
- Rapid patient transfer onto stretchers or gurneys.
- Visible triage tags, trauma dressings, and emergency medical technician equipment.
- Clinicians wearing high-visibility or trauma response apparel.
- Aggressive vital sign monitoring with defibrillator readiness and oxygen support.

Environmental evidence:
- The environment is configured for emergency medicine and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
Object evidence:
- Domain-specific devices, tools, and materials that confirm the presence of the medical specialty and workflow.
Behavioral evidence:
- The actions and roles of participants are consistent with the domain, such as surgical teams for surgery or therapists guiding movement for rehabilitation.
Workflow evidence:
- The sequence of tasks, patient preparation, and documentation behavior matches the specialty workflow.
Ambiguity sources:
- Similar-looking activities in nonmedical settings, educational or cosmetic mimics, synthetic imagery, and partially visible scenes.
Downstream interpretation:
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for emergency medicine.

## Surgery
Observable evidence:
- Sterile drapes, surgical instruments, and trained team coordination around an operating field.
- Visible tissue exposure, incision activity, and active hemostasis management.
- Anesthesia machines, surgical lighting, and sterile instrument trays.
- Specialized implants, power tools, and robotics specific to the surgical procedure.

Environmental evidence:
- The environment is configured for surgery and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
Object evidence:
- Domain-specific devices, tools, and materials that confirm the presence of the medical specialty and workflow.
Behavioral evidence:
- The actions and roles of participants are consistent with the domain, such as surgical teams for surgery or therapists guiding movement for rehabilitation.
Workflow evidence:
- The sequence of tasks, patient preparation, and documentation behavior matches the specialty workflow.
Ambiguity sources:
- Similar-looking activities in nonmedical settings, educational or cosmetic mimics, synthetic imagery, and partially visible scenes.
Downstream interpretation:
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for surgery.

## Dermatology
- Close-up skin examination with dermatoscopes, polarized lighting, and lesion mapping.
- Topical preparation, skin marking, biopsy punches, and photographic documentation.
- Clinical photography rigs and dermatological reference charts.
- Visible skin pathology, rash distributions, and structured examination gestures.

- The environment is configured for dermatology and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for dermatology.

## Radiology
- Imaging devices such as MRI, CT, X-ray, or ultrasound.
- Technologists operating imaging consoles and positioning patients for scans.
- Radiology report workstations, image annotation, and DICOM viewer interfaces.
- Patient positioning aids, shielding devices, and diagnostic markers on the patient.

- The environment is configured for radiology and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for radiology.

## Rehabilitation
- Physical therapy equipment, gait training devices, and therapist-guided exercises.
- Patient balance support, repetition of movement patterns, and assistive devices.
- Rehabilitation progress tracking boards, exercise instructions, and functional goals.
- Therapist coaching, manual mobilization, and adaptive exercise modifications.

- The environment is configured for rehabilitation and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for rehabilitation.

## Pediatrics
- Child-focused equipment, smaller patient positioning, and play-based care elements.
- Parental presence, child distraction tools, and pediatric monitoring devices.
- Growth charts, immunization documentation, and age-specific examination aids.
- Caregiver communication style adapted for children and family-centered care signals.

- The environment is configured for pediatrics and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for pediatrics.

## Intensive Care
- Advanced life support equipment, invasive monitoring lines, and critical care nursing workflows.
- Multiple infusion pumps, ventilators, dialysis machines, and bedside monitors.
- Sedation management, active crisis intervention, and frequent team assessments.
- Isolation protocols, infection control barriers, and high-acuity environment arrangements.

- The environment is configured for intensive care and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for intensive care.

## Outpatient Medicine
- Clinic exam rooms, routine diagnostic instruments, and clinician-patient consultation posture.
- Scheduling boards, electronic medical record devices, and medication samples.
- Routine physical exam maneuvers, screening tests, and patient education materials.
- Short visit workflows with intake, assessment, plan discussion, and follow-up instructions.

- The environment is configured for outpatient medicine and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for outpatient medicine.

## Telemedicine
- Remote consultation devices, clinician-facing cameras, patient home environment cues, and telehealth platforms.
- Peripheral monitoring devices such as blood pressure cuffs, pulse oximeters, and glucose monitors.
- Video-based symptom discussion, visual inspection, and remote guidance gestures.
- Documentation and digital consent indicators specific to telehealth encounters.

- The environment is configured for telemedicine and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for telemedicine.

## Laboratory Medicine
- Specimen handling, labeling, analytical instruments, and biosafety practices.
- Technicians wearing gloves, lab coats, and eye protection while working with test tubes.
- Specimen racks, centrifuges, pipettes, and laboratory information system displays.
- Quality control checks, reagent preparation, and diagnostic analytic workflows.

- The environment is configured for laboratory medicine and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for laboratory medicine.

## Dentistry
- Dental chairs, overhead lights, suction equipment, handpieces, and intraoral examination tools.
- Operators wearing loupes, gloves, masks, and protective eyewear.
- Radiographic positioning devices, dental impressions, and restorative materials.
- Patient mouth retraction, cavity preparation, polishing, and prosthetic fitting activity.

- The environment is configured for dentistry and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for dentistry.

## Ophthalmology
- Slit lamps, visual acuity charts, retinal imaging devices, and refraction instruments.
- Patient chin rests, fixation targets, and optical trial frames.
- Clinician use of ophthalmoscopes, tonometers, and specialized illumination.
- Eye drops, dilation procedures, lens fitting, and ocular surface evaluation.

- The environment is configured for ophthalmology and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for ophthalmology.

## Obstetrics
- Fetal monitoring devices, ultrasound probes, birthing beds, and maternal support equipment.
- Labor progress charts, epidural infusion pumps, and neonatal resuscitation gear.
- Clinician and support staff assisting with labor, delivery, and postpartum care.
- Patient positioning for birth, perineal support, and newborn stabilization activity.

- The environment is configured for obstetrics and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for obstetrics.

## Orthopedics
- Orthopedic drill systems, fixation hardware, external fixators, casting materials, and rehabilitation supports.
- Fracture tables, bone alignment instrumentation, and traction devices.
- Surgeons performing joint replacement, fracture reduction, and soft tissue repair.
- Physical therapy for weight-bearing, range-of-motion, and gait training after orthopedic intervention.

- The environment is configured for orthopedics and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for orthopedics.

## Neurology
- Neurological examination instruments, electroencephalography equipment, neuroimaging devices, and patient coordination assessments.
- Clinician-guided motor and sensory testing, reflex evaluation, and cognitive interaction.
- Monitoring devices for intracranial pressure, seizure detection, or stroke response.
- Patient positioning for spinal procedures, lumbar puncture preparation, and neural rehabilitation.

- The environment is configured for neurology and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for neurology.

## Oncology
- Chemotherapy infusion pumps, radiation therapy setups, oncology consultation materials, and tumor board documentation.
- Clinical signs of cancer care such as central venous catheters, symptom management equipment, and supportive care interventions.
- Patient education materials about treatment options, adverse effect monitoring, and palliative care planning.
- Evidence of multidisciplinary coordination among oncologists, nurses, radiologists, and support specialists.

- The environment is configured for oncology and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for oncology.

## Psychiatry
- Interview-focused room arrangements, privacy curtains, patient seating, clinician note-taking, and therapeutic communication gestures.
- Evidence of mental status assessment, emotional expression observation, and safe environment protocols.
- Family member presence for collateral history, de-escalation equipment, and structured behavioral observation.
- Documentation of consent, structured interview guides, and psychiatric rating scales.

- The environment is configured for psychiatry and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for psychiatry.

## Primary Care
- Generalist exam rooms, routine screening tools, patient counseling materials, and chronic disease management indicators.
- Evidence of comprehensive health evaluation, preventive care, immunization, and longitudinal relationship management.
- Clinician review of medications, lifestyle counseling, and follow-up planning.
- Patient education handouts, care coordination documentation, and referral discussion.

- The environment is configured for primary care and includes the room type, adjacent spaces, and clinical support systems that make the domain plausible.
- The inferred domain supports clinical policy outcomes, content handling, privacy decisions, and evidence summaries for primary care.

## 7. Medical Reasoning Pipeline
The medical reasoning pipeline is a sequence of inference stages that transform raw evidence into explainable clinical interpretation and policy-ready conclusions.
Each stage contributes a distinct type of evidence, maintains confidence and uncertainty, and records provenance for explanation.

### Medical Objects
This stage identifies clinical objects and devices that anchor the scene to medical activity.
Evidence includes medical instruments, diagnostic devices, consumables, protective equipment, and patient support materials.
Concrete examples include scalpels, dermatoscopes, ultrasound probes, infusion pumps, anesthesia circuits, oxygen masks, and wound dressings.

### Clinical Environment
This stage classifies the physical setting and distinguishes hospitals, clinics, operating rooms, emergency departments, rehabilitation spaces, imaging suites, ambulances, telemedicine settings, and educational medical environments.
Environment classification uses spatial layout, room fixtures, signage, fixed equipment, and location-specific artifacts.

### Clinical Workflow
This stage identifies the current clinical phase, such as triage, examination, imaging, procedure, therapy, recovery, or discharge.
Workflow evidence includes task order, role activity, document handling, and procedural materials.

### Healthcare Context
This stage situates the scene in broader healthcare purpose, such as urgent care, elective surgery, chronic disease management, diagnostic evaluation, rehabilitation therapy, or telehealth consultation.
Context considers patient status, care goals, social setting, and care pathway.

### Medical Intent
This stage infers the underlying clinical intent, such as diagnosing, treating, monitoring, educating, rehabilitating, or palliating.
Intent is expressed as a healthcare goal rather than a generic action label.

### Temporal Consistency
This stage evaluates whether the observed evidence is coherent over time and whether the medical intent persists, evolves, or changes according to the workflow.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

*   `skin_visibility/`: If the medical module verifies an active surgical or dermatological scan with high local confidence (`C_med` >= 0.80), standard skin exposure checks are bypassed.

```text
C_med = (Local_Object_Co_Occurrence_Confidence * 0.60) + (On_Device_Texture_Pathology_Score * 0.40)
```