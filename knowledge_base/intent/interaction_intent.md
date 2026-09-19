# Human Interaction Intent Intelligence Framework
This document defines a research-grade framework for interpreting human interaction intent in multimodal AI systems.
It is anchored in behavioral science, cognitive psychology, social cognition, action understanding, and explainable multimodal intent reasoning.
The framework explains how intentional interaction is distinguished from accidental behavior through pose, movement, object interaction, context, relationship, temporal dynamics, confidence, uncertainty, and governance.

## 1. Framework Role and Scope
### 1.1 Primary Role
Define human interaction intent as a structured semantic layer that complements object detection, pose estimation, and contextual analysis.
Enable systems to infer whether people are greeting, guiding, cooperating, teaching, assisting, or engaging in other purposeful interaction.
Support downstream contextual reasoning and policy decisions by distinguishing intentional interaction from accidental proximity or movement.

### 1.2 Design Principles
Treat intent as an emergent property of multimodal evidence rather than a threshold of proximity or a single gesture.
Preserve explainability at every stage, recording which cues produced the inference and why.
Model interaction as relational and temporal: interaction intent arises from the joint behaviour of actors across time and context.
Retain uncertainty explicitly when evidence is conflicting, incomplete, or ambiguous.

### 1.3 Scope
Interaction intent reasoning covers communication, social behaviour, object handling, professional interaction, family exchanges, sports engagement, and medical interaction.
It spans modalities including vision, pose, motion, language, temporal sequence, environment, and object context.
It supports both short-lived interactions such as a handshake and extended collaborations such as coaching, rehabilitation, or caregiving.

### 1.4 Intended Audience
Multimodal AI architects designing interaction-aware perception systems.
Behavioral scientists and cognitive researchers mapping intentional human actions to computational semantics.
Explainable AI practitioners responsible for auditability of human interaction inference.
Policy designers who need clear boundaries between intentional interaction and incidental behaviour.

## 2. Human Interaction Foundations
This chapter establishes the scientific foundations for the interaction intent framework.
### 2.1 Intention Understanding
Intent understanding studies how observers infer purposeful action from behaviour and context.
It differentiates goal-directed action from reflexive movement and random motion.
In human interaction, intent understanding requires modeling both actor goals and the relational meaning of actions.

### 2.2 Human Interaction Science
Human interaction science examines how individuals coordinate action, share attention, and negotiate meaning through gestures, speech, and activity.
It emphasizes mutual responsiveness, turn-taking, and the co-construction of social situations.
Interaction intent frameworks must capture these relational dynamics rather than only binary action categories.

### 2.3 Cognitive Psychology
Cognitive psychology provides models of attention, intention recognition, decision-making, and mental state attribution.
It explains how humans use cues such as gaze, posture, and action sequencing to infer other peoples’ goals.
The framework uses these principles to interpret interaction evidence in computational systems.

### 2.4 Behavioral Science
Behavioral science analyzes observable patterns of action and their relation to underlying motivations.
It distinguishes habitual behaviour from deliberate social action and helps identify indicators of cooperation, assistance, and communication.
Interaction intent inference must incorporate behavioural norms, social roles, and contextual affordances.

### 2.5 Action Understanding
Action understanding identifies the physical operations that people carry out, such as reaching, grasping, moving, and manipulating.
In interaction reasoning, action understanding is enriched by relational and intentional layers.
The framework integrates action primitives with intent categories such as greeting, helping, and guiding.

### 2.6 Social Cognition
Social cognition studies how people understand others as intentional agents with beliefs, desires, and goals.
It includes theory of mind, empathy, social inference, and attributions of trust and cooperation.
Interaction intent reasoning uses social cognition to interpret communicative gestures and cooperative action.

### 2.7 Multimodal Intent Reasoning
Multimodal intent reasoning combines visual, pose, motion, object, language, contextual, and temporal evidence.
It avoids overreliance on any single modality by requiring cross-modal coherence.
Human interaction intent emerges only when multiple evidence streams agree on relational purpose.

### 2.8 Explainable Behavioral Intelligence
Explainable behavioural intelligence requires that every intent inference can be traced back to specific cues and reasoning steps.
It is essential for trust, debugging, policy compliance, and user understanding.
The framework provides a structured explanation model that records pose evidence, movement evidence, object evidence, context, confidence, and uncertainty.

## 3. Interaction Intent Ontology
This ontology defines interaction categories, evidence dimensions, ambiguity sources, and downstream interpretation for human interaction intent.
### Communication
#### Greeting
Greeting is defined by interaction patterns that involve greeting.
* Observable evidence: eye contact, raised hand, open palm, smile, nod, verbal salutation, wave, or brief approach.
* Behavioral evidence: a directed action that initiates social contact with another person or group.
* Movement evidence: approach, body orientation toward the other person, raised arm, or brief gestural movement.
* Contextual evidence: arrival at a meeting, approaching a host, entering a room, or beginning a conversation.
* Ambiguity sources: gestural motions that resemble waving but are actually stretching or adjusting hair.
* Downstream interpretation: classify as greeting when engagement initiation is clear and the action is directed toward another person.

#### Waving
Waving is defined by interaction patterns that involve waving.
* Observable evidence: repeated hand motion, wrist movement, palm visibility, and a communicative trajectory.
* Behavioral evidence: an attempt to capture attention, signal recognition, or say goodbye.
* Movement evidence: fluid arm movement with intentional rhythm and visual prominence.
* Contextual evidence: distance communication, farewells, attracting attention, or acknowledging presence.
* Ambiguity sources: waving-like motions used to shoo insects or brush clothing.
* Downstream interpretation: classify as waving when the motion is directed at a social partner and serves a communicative function.

#### Pointing
Pointing is defined by interaction patterns that involve pointing.
* Observable evidence: extended index finger, directed arm, shoulder alignment, and gaze toward a target.
* Behavioral evidence: indicating location, object, direction, or emphasis to another person.
* Movement evidence: purposeful extension of the arm and finger, often combined with head turn and shifted gaze.
* Contextual evidence: giving directions, drawing attention, teaching, asking questions, or making a selection.
* Ambiguity sources: reaching for an object with an apparently pointing posture or incidental finger extension.
* Downstream interpretation: classify as pointing when the action clearly references an external target and engages another observer.

#### Explaining
Explaining is defined by interaction patterns that involve explaining.
* Observable evidence: hand gestures, open palms, head nodding, sequential speech, analogies, and illustrative examples.
* Behavioral evidence: a sustained effort to convey information, clarify meaning, or teach a concept to another person.
* Movement evidence: repeated gestural emphasis, paced hand movements, and movement synchronized with explanation segments.
* Contextual evidence: classroom, meeting, tutorial, demonstration, or collaborative problem-solving scenarios.
* Ambiguity sources: animated conversation that appears explanatory but is actually persuasive or entertaining commentary.
* Downstream interpretation: classify as explaining when the speaker’s behaviour aligns with instructive or clarifying intent.

#### Presenting
Presenting is defined by interaction patterns that involve presenting.
* Observable evidence: display of materials, pointing to visuals, deliberate pacing, and rhetorical framing.
* Behavioral evidence: structured delivery of information, position at a focal point, and orientation to an audience.
* Movement evidence: sweeping gestures, transitions between visual aids, and stable posture when addressing a group.
* Contextual evidence: presentation settings, meeting rooms, conference stages, webinar screens, or product demos.
* Ambiguity sources: charismatic speaking in entertainment contexts mistaken for a formal presentation.
* Downstream interpretation: classify as presenting when the actor is delivering organized content to an audience with informational purpose.

#### Teaching
Teaching is defined by interaction patterns that involve teaching.
* Observable evidence: instructional gestures, question prompts, guided practice, scaffolding language, and explanation of procedures.
* Behavioral evidence: a deliberate effort to support another person’s learning or skill development.
* Movement evidence: approach toward learners, demonstration of tasks, pointing to materials, and responsive adaptation.
* Contextual evidence: classrooms, tutoring sessions, training workshops, or mentoring interactions.
* Ambiguity sources: instructional gestures used in coaching or collaborative creation without explicit learning goals.
* Downstream interpretation: classify as teaching when the interaction is oriented toward learner progress and understanding.

#### Questioning
Questioning is defined by interaction patterns that involve questioning.
* Observable evidence: raised eyebrows, head tilt, open hands, verbal question markers, and paused expectant posture.
* Behavioral evidence: seeking information, confirming understanding, or prompting another person to respond.
* Movement evidence: lean forward, sustained eye contact, slight hand motions to invite response.
* Contextual evidence: interviews, discussions, classrooms, assessments, or information-seeking conversations.
* Ambiguity sources: rhetorical questions or expressive gestures that resemble questioning without actual inquiry.
* Downstream interpretation: classify as questioning when the actor clearly solicits a response or verifies understanding.

### Social Interaction
#### Conversation
Conversation is defined by interaction patterns that involve conversation.
* Observable evidence: bidirectional verbal exchange, turn-taking, mutual gaze, and responsive gestures.
* Behavioral evidence: sustained social engagement with attention to another person’s contributions.
* Movement evidence: mirrored posture, rhythmic nodding, shared gaze, and responsive facial expression.
* Contextual evidence: social gatherings, meetings, interviews, family settings, or informal discussions.
* Ambiguity sources: one-sided monologue presented as a conversation due to apparent listener presence.
* Downstream interpretation: classify as conversation when mutual exchange and reciprocity are evident.

#### Cooperation
Cooperation is defined by interaction patterns that involve cooperation.
* Observable evidence: shared focus on a common object, synchronized movements, coordinated timing, and supportive gestures.
* Behavioral evidence: working together to achieve a shared goal or complete a joint task.
* Movement evidence: complementary action patterns, passing objects, aligning trajectories, and adjusting to partner movements.
* Contextual evidence: team projects, joint performances, group assembly, or collaborative problem-solving.
* Ambiguity sources: adjacent action that is independent rather than jointly coordinated, but appears cooperative.
* Downstream interpretation: classify as cooperation when actors coordinate their behaviour intentionally around a shared objective.

#### Celebration
Celebration is defined by interaction patterns that involve celebration.
* Observable evidence: clapping, cheering, shared smiles, raised arms, hugging, and celebratory gestures.
* Behavioral evidence: joint emotional expression that affirms success, enjoyment, or shared achievement.
* Movement evidence: synchronised physical exuberance, jumping, hand slapping, and shared movement patterns.
* Contextual evidence: events, gatherings, ceremonies, sports victories, or personal milestones.
* Ambiguity sources: high-energy movement mistaken for celebration when it is actually strenuous activity.
* Downstream interpretation: classify as celebration when collective positive affect and acknowledgement of an achievement are present.

#### Comforting
Comforting is defined by interaction patterns that involve comforting.
* Observable evidence: gentle touch, proximity, soothing gestures, empathetic expression, and calming speech.
* Behavioral evidence: providing emotional support, reassurance, or consolation to another person.
* Movement evidence: extending an arm, placing a hand on a shoulder, leaning in, or creating physical closeness.
* Contextual evidence: moments of distress, loss, uncertainty, or vulnerability within personal or professional settings.
* Ambiguity sources: physical touch used for functional support rather than emotional comfort.
* Downstream interpretation: classify as comforting when the action is aimed at emotional regulation and support.

#### Helping
Helping is defined by interaction patterns that involve helping.
* Observable evidence: assisting gestures, handing objects, steadying another person, or offering physical support.
* Behavioral evidence: intentional action to reduce effort, risk, or difficulty for another person.
* Movement evidence: reaching toward another, adjusting object position, or sharing load.
* Contextual evidence: everyday assistance, caregiving, emergency response, or collaborative work.
* Ambiguity sources: incidental proximity where movement resembles help but is not intended to support another person.
* Downstream interpretation: classify as helping when the actor’s movement and posture are directed toward easing another person’s task or burden.

#### Guiding
Guiding is defined by interaction patterns that involve guiding.
* Observable evidence: pointing, leading steps, hand placement on back, direction cues, and advisory language.
* Behavioral evidence: intentional direction of another person’s movement or attention toward a goal or location.
* Movement evidence: moving ahead slightly, turning to indicate direction, touching shoulder or arm as a guide.
* Contextual evidence: wayfinding, training, tour guidance, or supervisory coordination.
* Ambiguity sources: following another person closely without an explicit guiding intention.
* Downstream interpretation: classify as guiding when the actor actively shapes another person’s trajectory or focus.

#### Accompanying
Accompanying is defined by interaction patterns that involve accompanying.
* Observable evidence: walking together, matching pace, shared orientation, and periodic interaction cues.
* Behavioral evidence: choosing to remain alongside another person while moving or waiting.
* Movement evidence: parallel trajectories, synchronized steps, and mutual spatial arrangement.
* Contextual evidence: accompaniment in transit, companionship during events, or support during tasks.
* Ambiguity sources: coincidental shared direction caused by route choice rather than intentional accompaniment.
* Downstream interpretation: classify as accompanying when the actor maintains proximity and coordination with another person for social or support reasons.

### Object Interaction
#### Picking Up
Picking Up is defined by interaction patterns that involve picking up.
* Observable evidence: reaching, grasping, wrist flexion, and hand closure around an object.
* Behavioral evidence: initiating interaction with an object to use, inspect, relocate, or transfer it.
* Movement evidence: controlled arm extension, hand shaping, and lifting motion.
* Contextual evidence: tool use, object retrieval, preparation for a task, or responding to a request.
* Ambiguity sources: accidental object contact or exploratory touch that resembles intentional pickup.
* Downstream interpretation: classify as picking up when the action is goal-directed and the object becomes the focus of attention.

#### Handing Over
Handing Over is defined by interaction patterns that involve handing over.
* Observable evidence: offering posture, object presentation, extended arms, and recipient focus.
* Behavioral evidence: transferring possession or sharing an object with another person.
* Movement evidence: controlled release, arm extension, and coordination with the recipient’s grasp.
* Contextual evidence: passing tools, delivering items, serving food, or exchanging documents.
* Ambiguity sources: accidental release or dropping of an object during motion that resembles handing over.
* Downstream interpretation: classify as handing over when the actor intentionally gives the object to another person.

#### Receiving
Receiving is defined by interaction patterns that involve receiving.
* Observable evidence: open hands, cupped palms, leaning toward the object, and attention to the giver.
* Behavioral evidence: preparing to accept an object or item from another person.
* Movement evidence: reaching, anticipatory grasp, and bodily alignment with the transfer path.
* Contextual evidence: receiving tools, gifts, documents, or food in collaborative or social settings.
* Ambiguity sources: reflexive catching motions in response to falling objects rather than intentional receipt.
* Downstream interpretation: classify as receiving when the actor accepts an object as part of a transfer interaction.

#### Inspecting
Inspecting is defined by interaction patterns that involve inspecting.
* Observable evidence: focused gaze, object orientation changes, close proximity, and hand exploration.
* Behavioral evidence: deliberately examining an object’s features, condition, or usability.
* Movement evidence: slow and precise motion, rotation of the object, and shifting gaze between object and related cues.
* Contextual evidence: quality checks, troubleshooting, product evaluation, or learning through observation.
* Ambiguity sources: casual handling of an object without deliberate inspection intent.
* Downstream interpretation: classify as inspecting when the actor seeks information from the object through careful observation.

#### Carrying
Carrying is defined by interaction patterns that involve carrying.
* Observable evidence: object supported in hands or arms, stabilized posture, and careful movement.
* Behavioral evidence: transporting an object from one location to another while maintaining control.
* Movement evidence: consistent trajectory, load-bearing posture adjustments, and balancing gestures.
* Contextual evidence: logistical transfer, delivery, moving equipment, or supporting another’s needs.
* Ambiguity sources: holding an object while distracted rather than actively carrying it with a transport goal.
* Downstream interpretation: classify as carrying when the actor maintains intentional movement and stabilization of the object.

#### Placing
Placing is defined by interaction patterns that involve placing.
* Observable evidence: lowering action, guided hand motion, spatial precision, and object alignment.
* Behavioral evidence: positioning an object deliberately in a specific location or orientation.
* Movement evidence: deceleration, fine motor adjustment, and release timing.
* Contextual evidence: setting down tools, arranging materials, staging displays, or completing assembly.
* Ambiguity sources: accidental dropping or uncontrolled release mistaken for placing.
* Downstream interpretation: classify as placing when the action intentionally positions the object according to a plan.

#### Exchanging
Exchanging is defined by interaction patterns that involve exchanging.
* Observable evidence: reciprocal transfer, mutual focus, and shared grasp patterns.
* Behavioral evidence: two-way handing and receiving between people or parties.
* Movement evidence: synchronized timing, coordinated release, and mutual attention.
* Contextual evidence: shared objects, negotiation, collaboration, or gift exchange.
* Ambiguity sources: passing objects without explicit reciprocity appearing like exchange.
* Downstream interpretation: classify as exchanging when both actors participate in a reciprocal transfer of objects.

### Professional
#### Interviewing
Interviewing is defined by interaction patterns that involve interviewing.
* Observable evidence: question-and-answer structure, gaze shifts between interviewer and interviewee, note-taking, and attentive posture.
* Behavioral evidence: gathering information, evaluating responses, or assessing fit for a role.
* Movement evidence: forward lean, head nods, controlled gestures, and periodic pause to listen.
* Contextual evidence: job interviews, research interviews, journalistic interviews, or performance reviews.
* Ambiguity sources: casual conversation mistaken for formal interviewing due to similar posture.
* Downstream interpretation: classify as interviewing when one actor explicitly seeks information from another in a structured evaluative context.

#### Customer Assistance
Customer Assistance is defined by interaction patterns that involve customer assistance.
* Observable evidence: service gestures, product explanation, assistance offers, and problem solving.
* Behavioral evidence: helping a customer select, understand, or use a product or service.
* Movement evidence: oriented approach, pointing to options, handing items, and attentive listening.
* Contextual evidence: retail environments, help desks, restaurant service, or support counters.
* Ambiguity sources: friendly conversation mistaken for customer assistance in a retail context.
* Downstream interpretation: classify as customer assistance when the actor is explicitly engaged in helping another person with purchasing or service needs.

#### Office Collaboration
Office Collaboration is defined by interaction patterns that involve office collaboration.
* Observable evidence: shared documents, meeting gestures, aligned computer displays, and collaborative pointing.
* Behavioral evidence: working together on a common professional task, coordinating roles, or reviewing materials.
* Movement evidence: moving objects between desks, pointing to sections, passing notes, and adjusting shared artifacts.
* Contextual evidence: office spaces, conference rooms, whiteboard sessions, and project work.
* Ambiguity sources: adjacent work performed independently but in the same office area.Downstream interpretation: classify as office collaboration when the interaction involves coordinated professional work and shared decisions.

#### Healthcare Interaction
Healthcare Interaction is defined by interaction patterns that involve healthcare interaction.
* Observable evidence: examination gestures, medical explanations, supportive touch, and patient attentiveness.
* Behavioral evidence: diagnosis, treatment discussion, reassurance, or procedural guidance.
* Movement evidence: controlled medical instrument use, positioning of the patient, and careful hand placement.
* Contextual evidence: clinic rooms, hospital wards, consultation settings, or rehabilitation spaces.
* Ambiguity sources: non-medical touch or conversation in a healthcare-like environment.
* Downstream interpretation: classify as healthcare interaction when clinical intent and patient-focused care are present.

#### Classroom Interaction
Classroom Interaction is defined by interaction patterns that involve classroom interaction.
* Observable evidence: teacher-student exchange, question prompts, board work, and instructional gestures.
* Behavioral evidence: teaching, feedback, guided practice, or assessment during a class session.
* Movement evidence: teacher movement between students, directing attention, and gesturing toward materials.
* Contextual evidence: classroom desks, educational displays, learning materials, and institutional settings.
* Ambiguity sources: informal group discussion that resembles classroom interaction but lacks instructional intent.
* Downstream interpretation: classify as classroom interaction when the primary purpose is learning and educational guidance.

#### Technical Demonstration
Technical Demonstration is defined by interaction patterns that involve technical demonstration.
* Observable evidence: stepwise explanation, tool handling, experimental setup, and feature highlighting.
* Behavioral evidence: demonstrating how a product, device, or system works to an audience or collaborator.
* Movement evidence: precise manipulation, sequential motion, and repeated reference to the object being demonstrated.
* Contextual evidence: product demos, lab showcases, technical presentations, or training sessions.
* Ambiguity sources: polished promotional videos that mimic technical demonstration without substantive explanation.
* Downstream interpretation: classify as technical demonstration when the interaction conveys how a system works through hands-on steps.

### Family
#### Caregiving
Caregiving is defined by interaction patterns that involve caregiving.
* Observable evidence: supportive touch, assistance with mobility, feeding, grooming, or monitoring.
* Behavioral evidence: attending to another person’s physical or emotional needs.
* Movement evidence: careful adjustment, steadying gestures, and protective positioning.
* Contextual evidence: home environments, childcare settings, elder care, or family routines.
* Ambiguity sources: routine proximity mistaken for caregiving when no supportive action occurs.
* Downstream interpretation: classify as caregiving when actions are aimed at maintaining another person’s wellbeing.

#### Supervision
Supervision is defined by interaction patterns that involve supervision.
* Observable evidence: observing, reminding, directing, and maintaining distance with oversight posture.
* Behavioral evidence: overseeing another person’s task or behavior to ensure safety or correctness.
* Movement evidence: periodic scanning, repositioning for better view, and proactive corrections or prompts.
* Contextual evidence: parenting, childcare, tutoring, or workplace supervisory roles.
* Ambiguity sources: passive observation that is not actually supervisory in nature.
* Downstream interpretation: classify as supervision when the actor maintains oversight and intervenes when necessary.

#### Child Assistance
Child Assistance is defined by interaction patterns that involve child assistance.
* Observable evidence: guiding hands, shared activity, simplified explanation, and patient pacing.
* Behavioral evidence: supporting a child in learning, playing, or completing a task.
* Movement evidence: stooping, extending aids, and matching the child’s actions.
* Contextual evidence: family settings, playgrounds, homework assistance, or childcare environments.
* Ambiguity sources: adult interaction with a child that is casual rather than instructional or supportive.
* Downstream interpretation: classify as child assistance when the actor intentionally adapts behaviour to a child’s needs.

#### Shared Activities
Shared Activities is defined by interaction patterns that involve shared activities.
* Observable evidence: participating together in cooking, games, arts, or household tasks.
* Behavioral evidence: collaborative engagement aimed at enjoyment, productivity, or relationship building.
* Movement evidence: coordinated actions, shared object handling, and mutual attention.
* Contextual evidence: family gatherings, recreational activities, or domestic routines.
* Ambiguity sources: parallel activities that occur in the same space but without meaningful interaction.
* Downstream interpretation: classify as shared activities when participation is intentionally coordinated for mutual benefit or connection.

#### Emotional Support
Emotional Support is defined by interaction patterns that involve emotional support.
* Observable evidence: empathetic expression, comforting gestures, supportive words, and attentiveness.
* Behavioral evidence: responding to emotional distress, offering reassurance, or listening carefully.
* Movement evidence: leaning in, moving closer, gentle touch, and open body language.
* Contextual evidence: family crises, comfort sessions, relationship maintenance, or personal hardships.
* Ambiguity sources: neutral social interaction mistaken for emotional support due to friendly posture.
* Downstream interpretation: classify as emotional support when the interaction aims to address another person’s feelings or emotional state.

### Sports
#### Coaching
Coaching is defined by interaction patterns that involve coaching.
* Observable evidence: instruction, demonstration of techniques, feedback, and encouragement.
* Behavioral evidence: guiding athletes or participants through skill development, strategy, or performance improvement.
* Movement evidence: corrected posture, demonstrative action, and spatial organization of practice.
* Contextual evidence: training fields, courts, gymnasiums, or athletic facilities.
* Ambiguity sources: side-line commentary mistaken for coaching when it is actually spectating.
* Downstream interpretation: classify as coaching when the actor actively instructs and adjusts another person’s athletic behaviour.

#### Passing
Passing is defined by interaction patterns that involve passing.
* Observable evidence: releasing a ball or object toward a teammate, directed gaze, and anticipatory positioning.
* Behavioral evidence: sharing possession to advance play, maintain possession, or facilitate team coordination.
* Movement evidence: forceful or precise release, follow-through, and reciprocal motion from the receiver.
* Contextual evidence: team sport play, drills, practice sessions, or cooperative games.
* Ambiguity sources: accidental deflection or misdirected motion that resembles intentional passing.
* Downstream interpretation: classify as passing when the actor intentionally transfers the game object to another player.

#### Teamwork
Teamwork is defined by interaction patterns that involve teamwork.
* Observable evidence: shared strategy, supportive positioning, communication, and role allocation.
* Behavioral evidence: coordinated group effort toward a common athletic objective.
* Movement evidence: complementary movements, aligned timing, and shared physical adjustments.
* Contextual evidence: competitive games, drills, relays, or cooperative training.
* Ambiguity sources: adjacent action on a field that is independent rather than part of a team sequence.
* Downstream interpretation: classify as teamwork when actions are intentionally coordinated to support collective achievement.

#### Competition
Competition is defined by interaction patterns that involve competition.
* Observable evidence: adversarial movement, pursuit, scoring attempts, and strategic positioning.
* Behavioral evidence: acting to outperform an opponent, win a contest, or achieve competitive advantage.
* Movement evidence: rapid direction changes, aggressive gestures, and energy investment aligned with scoring or defense.
* Contextual evidence: sports matches, races, tournaments, or competitive play.
* Ambiguity sources: playful rivalry mistaken for serious competition when stakes are low.
* Downstream interpretation: classify as competition when the interaction goal is adversarial performance rather than cooperative play.

#### Assistance
Assistance is defined by interaction patterns that involve assistance.
* Observable evidence: helping a teammate to stand, reposition, put on equipment, or stabilize after a fall.
* Behavioral evidence: intentional support to maintain performance, safety, or continuity of play.
* Movement evidence: physical support, gentle contact, and coordinated adjustment.
* Contextual evidence: team sport situations, injury response, practice supervision, or athletic training.
* Ambiguity sources: incidental contact during play mistaken for assistance.
* Downstream interpretation: classify as assistance when the actor deliberately aids another player’s physical condition or task completion.

#### Officiating
Officiating is defined by interaction patterns that involve officiating.
* Observable evidence: signaling, rule enforcement, whistle usage, and authoritative posture.
* Behavioral evidence: monitoring, judging, and regulating the conduct of participants.
* Movement evidence: deliberate gesture patterns, positioning for visibility, and authoritative movement.
* Contextual evidence: referees, umpires, judges, and game officials in competitive settings.
* Ambiguity sources: enthusiastic spectator gestures mistaken for officiating signals.
* Downstream interpretation: classify as officiating when the actor is performing a supervisory and adjudicative role in sport.

### Medical
#### Examination
Examination is defined by interaction patterns that involve examination.
* Observable evidence: focused inspection, palpation, patient questioning, and use of medical instruments.
* Behavioral evidence: investigating a patient’s condition through deliberate physical assessment.
* Movement evidence: precise hand placement, controlled palpation, and clinical proximity.
* Contextual evidence: clinic rooms, hospital examination areas, medical tents, or telemedicine consultations.
* Ambiguity sources: non-medical touch that appears clinical due to similar posture.
* Downstream interpretation: classify as examination when the action aims to gather diagnostic information about a patient.

#### Treatment Preparation
Treatment Preparation is defined by interaction patterns that involve treatment preparation.
* Observable evidence: setting up instruments, explaining procedures, adjusting equipment, and preparing the patient.
* Behavioral evidence: organizing materials and ensuring patient readiness for a medical intervention.
* Movement evidence: deliberate and hygienic handling of tools, stable positioning of the patient, and coordinating with staff.
* Contextual evidence: operating theatres, hospital rooms, treatment suites, or emergency response environments.
* Ambiguity sources: preparatory activity that is logistic rather than specifically medical.
* Downstream interpretation: classify as treatment preparation when the behaviour readies a patient or environment for clinical intervention.

#### Rehabilitation Guidance
Rehabilitation Guidance is defined by interaction patterns that involve rehabilitation guidance.
* Observable evidence: demonstration of exercises, corrective feedback, physical assistance, and motivational comments.
* Behavioral evidence: guiding a patient through recovery movements with therapeutic intent.
* Movement evidence: supportive contact, mirrored motion, and careful progression of physical effort.
* Contextual evidence: physiotherapy sessions, rehabilitation clinics, post-injury training, or recovery programs.
* Ambiguity sources: fitness coaching mistaken for rehabilitation guidance without therapeutic context.
* Downstream interpretation: classify as rehabilitation guidance when the interaction focuses on recovery and functional restoration.

#### Patient Support
Patient Support is defined by interaction patterns that involve patient support.
* Observable evidence: gentle touch, reassurance, monitoring, and responsive care gestures.
* Behavioral evidence: attending to patient comfort, emotional state, or immediate needs.
* Movement evidence: calm approach, supportive posture, and careful adjustment of patient position.
* Contextual evidence: bedside care, clinical support, nursing activities, or hospital assistance.
* Ambiguity sources: routine assistance in a medical environment that is logistical rather than supportive.
* Downstream interpretation: classify as patient support when the primary purpose is to provide comfort, stability, or companionship to a patient.

## 4. Interaction Reasoning Pipeline
This pipeline explains how evidence is accumulated from perception to policy inference for interaction intent.
The stages are designed to preserve explicit reasoning and to avoid premature conclusions based on single-frame gestures.
### Visual Evidence
Visual Evidence accumulates evidence relevant to interaction intent.
- Static scene composition, person location, body part visibility, object arrangement, environmental affordances.
- Detecting social groupings, proxemics, scene layout, and potential interaction candidates.
- Observing communicative devices such as signs, screens, tools, or shared attention anchors.

### Pose Evidence
Pose Evidence accumulates evidence relevant to interaction intent.
- Joint orientation, limb configuration, body lean, gaze direction, hand shape, and torso alignment.
- Differentiating intentional reach, neutral posture, and reactive balance through pose semantics.
- Recognizing communicative poses such as pointing, shrugging, or open-handed invitation.

### Movement Evidence
Movement Evidence accumulates evidence relevant to interaction intent.
- Velocity, trajectory, acceleration, rhythm, and motion patterns over time.
- Detecting purposeful movement sequences versus accidental shifts or balancing adjustments.
- Associating movement with interaction phases such as approach, retreat, transfer, support, and joint coordination.

### Object Interaction
Object Interaction accumulates evidence relevant to interaction intent.
- Identifying object engagement behaviors such as grasping, carrying, placing, handing over, and inspecting.
- Determining whether object use is intended to support another person, complete a task, or merely affect the object itself.
- Relating object movement to participant roles and the joint activity context.

### Human Interaction
Human Interaction accumulates evidence relevant to interaction intent.
- Mapping relational behaviours such as communication, cooperation, assistance, conflict, and shared attention.
- Recognizing that interaction requires at least two intentional agents acting in relation to each other.
- Evaluating reciprocity, responsiveness, and mutual adaptation in the behavior stream.

### Behavioral Evidence
Behavioral Evidence accumulates evidence relevant to interaction intent.
- Interpreting action purpose, social norms, sequential patterns, and expected outcomes.
- Distinguishing deliberate assistance from incidental co-location through functional behaviour analysis.
- Integrating observed behavior with inferred motivations and social roles.

### Context
Context accumulates evidence relevant to interaction intent.
- Understanding physical setting, activity domain, cultural norms, participant roles, and situational affordances.
- Using environment type to calibrate the meaning of interaction patterns and avoid misinterpretation.
- Incorporating platform metadata, time of day, event type, and known social conventions.

### Interaction Intent
Interaction Intent accumulates evidence relevant to interaction intent.
- Producing a purpose profile representing the likely interaction category or categories.
- Preserving confidence and uncertainty along with the inference.
- Recording the evidence sources that support the selected intent.

### Confidence
Confidence accumulates evidence relevant to interaction intent.
- Aggregating modality-specific confidence scores into an overall belief for the inferred intent.
- Weighting evidence based on relevance, specificity, and consistency across modalities.
- Creating separate confidence dimensions for interaction, behavior, context, temporal dynamics, and evidence quality.

### Uncertainty
Uncertainty accumulates evidence relevant to interaction intent.
- Tracking unresolved ambiguity when evidence streams conflict or are incomplete.
- Preserving uncertainty rather than collapsing to a single label.
- Using uncertainty to moderate downstream actions and to prompt further analysis or user clarification.

### Explainable Decision
Explainable Decision accumulates evidence relevant to interaction intent.
- Generating a rationale that cites pose evidence, movement evidence, behavioral evidence, object evidence, context, confidence, and uncertainty.
- Making the decision traceable to specific observations and decision rules.
- Providing human-readable explanations suitable for audit and policy review.

### Policy
Policy accumulates evidence relevant to interaction intent.
- Aligning the inferred interaction intent with safety rules, privacy constraints, and application-specific policies.
- Applying explicit exceptions for accidental contact, benign co-location, and permitted supportive interaction.
- Ensuring that policy outcomes reflect confidence and uncertainty rather than raw labels alone.

## 5. Behavioral Reasoning Framework
This chapter defines behavioral categories and the reasoning needed to distinguish intentional interaction from unrelated motion.
### 5.1 Intentional Actions
Intentional actions are performed with a goal or purpose in mind and are expressed through coordinated movement, object engagement, and social cues.
They include reaching to hand an object, stepping toward a partner, gesturing to direct attention, and pausing to listen.
Intentionality is confirmed by the congruence of movement, gaze, timing, and context.

### 5.2 Reactive Actions
Reactive actions respond to an external stimulus, such as catching a falling object, stepping aside to avoid collision, or mirroring another person’s motion.
They are distinguished from intentional interaction by their shorter latency and dependence on immediate sensory input.
Reactive behaviour may be part of an interaction if it supports mutual adaptation or safety, but it is not itself sufficient evidence of interaction intent.

### 5.3 Cooperative Behavior
Cooperative behavior involves two or more actors deliberately coordinating their actions toward a shared outcome.
Evidence includes synchronized movement, complementary roles, shared object handling, communication, and mutual adjustment.
Distinguishing cooperation from parallel independent action requires evidence of joint goals and responsiveness.

### 5.4 Independent Behavior
Independent behavior occurs when actors act in the same environment without coordinated interaction.
Evidence includes divergent goals, lack of reciprocal response, different object targets, and spatial separation that does not support interaction.
Independent behaviour can coexist with interaction in crowded settings, making inference more challenging.

### 5.5 Passive Observation
Passive observation is present when an actor watches another without intervening, assisting, or communicating directly.
Evidence includes stable posture, sustained gaze, limited movement, and lack of object engagement.
Passive observation is an important behavioural state that may precede interaction or simply indicate attention to a scene.

### 5.6 Attention Focus
Attention focus refers to where an actor directs their sensory and cognitive resources.
Evidence includes gaze direction, head orientation, body alignment, and pointing gestures.
Interaction intent is more likely when attention is shared between actors and when attention shifts align with interaction goals.

### 5.7 Shared Goals
Shared goals are inferred from evidence that multiple actors are working toward the same objective.
Indicators include common target objects, aligned movements, complementary timing, verbal acknowledgement, and task coordination.
Shared goals strongly support cooperative interaction intent when contrasted with independent or competitive behavior.

### 5.8 Interaction Sequencing
Interaction sequencing analyzes the temporal order of actions to determine whether they form a coherent exchange.
Evidence includes invitation, response, adjustment, and closure phases.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
+-----------------------------------------------------------------------------------------+
| INTERACTION INTENT PIPELINE                                                             |
+-----------------------------------------------------------------------------------------+
| [Cursor Coordinates] ---> [WebGPU Trajectory Shader] ---> [Kinematic Velocity Map]      |
|                                              |                                          |
|                                              v                                          |
|                            [WASM C++ Scroll & Dwell Time Solver]                        |
|                                              |                                          |
|                                              v                                          |
|                          [Linguistic Query Lexical Weight Evaluator]                    |
|                                              |                                          |
|                                              v                                          |
|                        [Interaction Intent Score S_interact Matrix]                     |
+-----------------------------------------------------------------------------------------+
```

*   `V_scroll` be the scroll velocity ($px/sec$), measuring if scrolling speeds drop to a near-halt ($<30\text{ px/s}$) over warning boundaries, which indicates deliberate examination.

$$
S_{\text{interact}} = w_{\text{query}} \cdot Q_{\text{score}} + w_{\text{dwell}} \cdot D_{\text{dwell}} + w_{\text{scroll}} \cdot \left(1.0 - V_{\text{scroll}}\right) \cdot \Phi_{\text{resolution\_norm}}
$$

*   $\Phi_{\text{resolution\_norm}}$ is the scale-invariant dynamic resolution normalization factor to prevent false positive triggers on high-resolution screens (derived from `width` and `height` boundary scales).

Let $P_t = (x_t, y_t)$ be the 2D cursor coordinate at time $t$. The system calculates the instantaneous velocity $V_c(t)$ and acceleration $A_c(t)$ to detect erratic, bypass-oriented cursor movements:

$$V_c(t) = \frac{\left\|\begin{bmatrix} (x_t - x_{t-1}) / \text{width} \\ (y_t - y_{t-1}) / \text{height} \end{bmatrix}\right\|_2}{\Delta t}$$
$$A_c(t) = \frac{V_c(t) - V_c(t-1)}{\Delta t}$$

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

constexpr int TRAJECTORY_BUFFER_SIZE = 16;
constexpr int SCROLL_HISTORY_SIZE = 15;
constexpr int TEXT_BUFFER_SIZE = 4096;

struct Point2D {
    float x;
    float y;
    float timestamp_ms;
};

struct ScrollTiming {
    float scroll_y_delta;
    float timestamp_ms;
};

struct IntentOutput {
    float calculated_interaction_score; // S_interact
    float mean_cursor_velocity;         // V_c
    float normalized_scroll_velocity;   // V_scroll
    float raw_dwell_time_seconds;       // D_dwell
    int intent_classification;          // 0 = Academic, 1 = Accidental, 2 = Suspicious Focus
    float confidence;
};

// Global memory buffers mapped to WebAssembly Linear Memory Heap
Point2D g_cursor_trajectory[TRAJECTORY_BUFFER_SIZE];
ScrollTiming g_scroll_history[SCROLL_HISTORY_SIZE];
char g_query_text_buffer[TEXT_BUFFER_SIZE];
int g_cursor_write_idx = 0;
int g_scroll_write_idx = 0;
bool g_is_cursor_filled = false;
bool g_is_scroll_filled = false;

// Double Exponential Smoothing Filter for the output telemetry variables
class TemporalDoubleSmoother {
public:
    TemporalDoubleSmoother() : is_initialized_(false), alpha_(0.70f), beta_(0.20f) {}

    float Apply(float raw_value) {
        if (!is_initialized_) {
            s_ = raw_value;
            b_ = 0.0f;
            is_initialized_ = true;
            return raw_value;
        }

        float prev_s = s_;
        s_ = alpha_ * raw_value + (1.0f - alpha_) * (s_ + b_);
        b_ = beta_ * (s_ - prev_s) + (1.0f - beta_) * b_;
        return s_;
    }

    void Reset() {
        is_initialized_ = false;
    }

private:
    bool is_initialized_;
    float alpha_;
    float beta_;
    float s_;
    float b_;
};

class InteractionSolver {
public:
    InteractionSolver() {
        scroll_smoother_.Reset();
        cursor_smoother_.Reset();
    }
    ~InteractionSolver() = default;

    IntentOutput Solve(float query_score, float hover_start_ms, float current_time_ms, float width, float height) {
        // 1. Calculate average cursor velocity in normalized coordinate bounds (Resolution Invariance)
        int c_count = g_is_cursor_filled ? TRAJECTORY_BUFFER_SIZE : g_cursor_write_idx;
        float velocity_sum = 0.0f;
        float path_entropy_variance = 0.0f; // Mitigates automated bot bypasses

        if (c_count >= 2) {
            std::vector<float> inst_velocities(c_count - 1, 0.0f);
            for (int i = 1; i < c_count; ++i) {
                int curr = (g_cursor_write_idx + i) % TRAJECTORY_BUFFER_SIZE;
                int prev = (g_cursor_write_idx + i - 1 + TRAJECTORY_BUFFER_SIZE) % TRAJECTORY_BUFFER_SIZE;

                float dx = (g_cursor_trajectory[curr].x - g_cursor_trajectory[prev].x) / width;
                float dy = (g_cursor_trajectory[curr].y - g_cursor_trajectory[prev].y) / height;
                float dt = (g_cursor_trajectory[curr].timestamp_ms - g_cursor_trajectory[prev].timestamp_ms) / 1000.0f;

                if (dt > 0.0f) {
                    inst_velocities[i - 1] = sqrt(dx * dx + dy * dy) / dt;
                    velocity_sum += inst_velocities[i - 1];
                }
            }
            float mean_temp_vel = (c_count > 1) ? (velocity_sum / (c_count - 1)) : 0.0f;
            
            // Calculate standard deviation of inst_velocities to detect robotic patterns
            float var_sum = 0.0f;
            for (float vel : inst_velocities) {
                var_sum += pow(vel - mean_temp_vel, 2);
            }
            path_entropy_variance = var_sum / inst_velocities.size();
        }
        float mean_velocity = (c_count > 1) ? (velocity_sum / (c_count - 1)) : 0.0f;

        // 2. Calculate normalized scroll velocity (V_scroll)
        int s_count = g_is_scroll_filled ? SCROLL_HISTORY_SIZE : g_scroll_write_idx;
        float scroll_sum = 0.0f;

        if (s_count >= 2) {
            for (int i = 1; i < s_count; ++i) {
                int curr = (g_scroll_write_idx + i) % SCROLL_HISTORY_SIZE;
                int prev = (g_scroll_write_idx + i - 1 + SCROLL_HISTORY_SIZE) % SCROLL_HISTORY_SIZE;

                float dy = std::abs(g_scroll_history[curr].scroll_y_delta) / height;
                float dt = (g_scroll_history[curr].timestamp_ms - g_scroll_history[prev].timestamp_ms) / 1000.0f;

                if (dt > 0.0f) {
                    scroll_sum += dy / dt;
                }
            }
        }
        float raw_scroll_velocity = (s_count > 1) ? (scroll_sum / (s_count - 1)) : 0.0f;
        float smoothed_scroll = scroll_smoother_.Apply(raw_scroll_velocity);

        // Map scroll velocity to [0.0, 1.0] where 1.0 is extremely slow/static
        float max_standard_scroll = 1.0f; // Normalized px/sec
        float normalized_scroll_inv = 1.0f - std::clamp(smoothed_scroll / max_standard_scroll, 0.0f, 1.0f);

        // 3. Compute Dwell Time (D_dwell)
        float dwell_time = 0.0f;
        if (hover_start_ms > 0.0f) {
            dwell_time = (current_time_ms - hover_start_ms) / 1000.0f; // Convert to seconds
        }
        float normalized_dwell = std::clamp(dwell_time / 10.0f, 0.0f, 1.0f); // Cap dwell-risk mapping at 10 seconds

        // 4. Resolve Interaction Intent Score (S_interact)
        float w_query = 0.50f;
        float w_dwell = 0.30f;
        float w_scroll = 0.20f;

        // If automated robotic movement pattern is identified (exactly flat variance), force suggestive state checks
        if (path_entropy_variance < 1e-6f && c_count >= 10) {
            raw_interact_penalty = 0.40f;
        } else {
            raw_interact_penalty = 0.0f;
        }

        float raw_interact = (query_score * w_query) + (normalized_dwell * w_dwell) + (normalized_scroll_inv * w_scroll) + raw_interact_penalty;
        raw_interact = std::clamp(raw_interact, 0.0f, 1.0f);

        int classification = 0; // Academic / Passive
        if (raw_interact >= 0.75f) {
            classification = 2; // Suspicious Focus
        } else if (raw_interact >= 0.30f) {
            classification = 1; // Accidental Exposure
        }

        IntentOutput out;
        out.calculated_interaction_score = raw_interact;
        out.mean_cursor_velocity = mean_velocity;
        out.normalized_scroll_velocity = smoothed_scroll;
        out.raw_dwell_time_seconds = dwell_time;
        out.intent_classification = classification;
        out.confidence = 1.0f - (std::abs(mean_velocity - raw_scroll_velocity) * 0.001f); // Check for kinematic coherence
        out.confidence = std::clamp(out.confidence, 0.10f, 1.0f);

        return out;
    }

    void Reset() {
        scroll_smoother_.Reset();
        cursor_smoother_.Reset();
    }

private:
    TemporalDoubleSmoother scroll_smoother_;
    TemporalDoubleSmoother cursor_smoother_;
    float raw_interact_penalty = 0.0f;
};

static InteractionSolver global_intent_solver;
static IntentOutput global_output_metrics;

extern "C" {
    __attribute__((import_name("onIntentMetricsResolved"))) void onConfidenceCalibrated(IntentOutput* output);

    void* allocate_cursor_trajectory_buffer() {
        return &g_cursor_trajectory[0];
    }

    void* allocate_scroll_history_buffer() {
        return &g_scroll_history[0];
    }

    void* allocate_query_text_buffer() {
        return &g_query_text_buffer[0];
    }

    void record_cursor_coordinate(float x, float y, float timestamp_ms) {
        g_cursor_trajectory[g_cursor_write_idx] = {x, y, timestamp_ms};
        g_cursor_write_idx = (g_cursor_write_idx + 1) % TRAJECTORY_BUFFER_SIZE;
        if (g_cursor_write_idx == 0) {
            g_is_cursor_filled = true;
        }
    }

    void record_scroll_delta(float scroll_y, float timestamp_ms) {
        g_scroll_history[g_scroll_write_idx] = {scroll_y, timestamp_ms};
        g_scroll_write_idx = (g_scroll_write_idx + 1) % SCROLL_HISTORY_SIZE;
        if (g_scroll_write_idx == 0) {
            g_is_scroll_filled = true;
        }
    }

    void process_intent_evaluation(float query_score, float hover_start_ms, float current_time_ms, float width, float height) {
        IntentOutput results = global_intent_solver.Solve(query_score, hover_start_ms, current_time_ms, width, height);
        global_output_metrics = results;
        onConfidenceCalibrated(&global_output_metrics);
    }

    void reset_intent_filters() {
        global_intent_solver.Reset();
        g_cursor_write_idx = 0;
        g_scroll_write_idx = 0;
        g_is_cursor_filled = false;
        g_is_scroll_filled = false;
    }
}
```

```wgsl
struct SystemConfig {
    width: u32,
    height: u32,
    buffer_capacity: u32,
    padding: u32,
};

struct CursorPoint {
    x: f32,
    y: f32,
    timestamp_ms: f32,
    padding: f32,
};

@group(0) @binding(0) var<uniform> config: SystemConfig;
@group(0) @binding(1) var<storage, read> raw_cursor_inputs: array<CursorPoint>; // Coordinates history buffer
@group(0) @binding(2) var<storage, read_write> output_kinematics: array<vec4<f32>>; // (vx, vy, acc, jitter)

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;

    if (index >= config.buffer_capacity || index <= 1u) {
        return;
    }

    let p_curr = raw_cursor_inputs[index];
    let p_prev = raw_cursor_inputs[index - 1u];
    let p_old = raw_cursor_inputs[index - 2u];

    let dt = (p_curr.timestamp_ms - p_prev.timestamp_ms) / 1000.0;
    let dt_prev = (p_prev.timestamp_ms - p_old.timestamp_ms) / 1000.0;

    if (dt <= 0.0 || dt_prev <= 0.0) {
        return;
    }

    // Calculate instantaneous velocity vectors
    let vx = (p_curr.x - p_prev.x) / dt;
    let vy = (p_curr.y - p_prev.y) / dt;

    let vx_prev = (p_prev.x - p_old.x) / dt_prev;
    let vy_prev = (p_prev.y - p_old.y) / dt_prev;

    // Calculate acceleration vectors
    let ax = (vx - vx_prev) / dt;
    let ay = (vy - vy_prev) / dt;
    let acc = sqrt(ax * ax + ay * ay);

    // Calculate directional jitter (path deviation)
    let speed = sqrt(vx * vx + vy * vy);
    let path_coherence = dot(vec2<f32>(vx, vy), vec2<f32>(vx_prev, vy_prev)) / (speed * sqrt(vx_prev * vx_prev + vy_prev * vy_prev) + 0.01);

    output_kinematics[index] = vec4<f32>(vx, vy, acc, 1.0 - path_coherence);
}
```

```typescript
export interface InteractionAnalysisResult {
  readonly calculatedInteractionScore: number; // S_interact
  readonly meanCursorVelocity: number;         // V_c
  readonly normalizedScrollVelocity: number;   // V_scroll
  readonly rawDwellTimeSeconds: number;       // D_dwell
  readonly intentClassification: 'ACADEMIC' | 'ACCIDENTAL' | 'SUSPICIOUS_FOCUS';
  readonly confidence: number;
}

export class InteractionIntentEngine {
  private wasmInstance!: any;
  private memory!: WebAssembly.Memory;
  private bufferOffsetCoords: number = 0;
  private bufferOffsetScroll: number = 0;
  private bufferOffsetText: number = 0;
  private isLoaded: boolean = false;
  private device!: GPUDevice;
  private pipeline!: GPUComputePipeline;
  private bufferCapacity = 16;

  private latestResults: InteractionAnalysisResult | null = null;

  constructor() {}

  public async initialize(wasmArrayBuffer: ArrayBuffer): Promise<void> {
    const wasmImports = {
      env: {
        onIntentMetricsResolved: (metricsPtr: number) => {
          this.handleResolvedMetrics(metricsPtr);
        }
      }
    };

    const compiled = await WebAssembly.instantiate(wasmArrayBuffer, wasmImports);
    this.wasmInstance = compiled.instance.exports;
    this.memory = this.wasmInstance.memory;
    
    // Allocate stable, aligned buffers on WebAssembly heap safely using C++ exports
    this.bufferOffsetCoords = this.wasmInstance.allocate_cursor_trajectory_buffer();
    this.bufferOffsetScroll = this.wasmInstance.allocate_scroll_history_buffer();
    this.bufferOffsetText = this.wasmInstance.allocate_query_text_buffer();

    if (this.bufferOffsetCoords === 0 || this.bufferOffsetScroll === 0 || this.bufferOffsetText === 0) {
      throw new Error("WASM Memory allocation failed for behavioral analysis buffers");
    }

    // Initialize WebGPU context
    const adapter = await navigator.gpu?.requestAdapter();
    this.device = await adapter?.requestDevice() as GPUDevice;

    const shaderModule = this.device.createShaderModule({
      code: `
        // WGSL code loaded from interaction_trajectory_analyzer.wgsl
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

  public async evaluateInteractions(
    cursorInputs: Array<{ x: number; y: number; timestamp_ms: number }>,
    scrollDeltas: Array<{ y_delta: number; timestamp_ms: number }>,
    queryText: string,
    hoverStartMs: number,
    currentTimeMs: number,
    width: number,
    height: number
  ): Promise<InteractionAnalysisResult | null> {
    if (!this.isLoaded || !this.device) return null;

    // Configure WebGPU buffers for high-speed parallel cursor kinematics evaluation
    const configBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const cursorBuffer = this.device.createBuffer({
      size: this.bufferCapacity * 16, // 16 * sizeof(CursorPoint)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });

    const outputKinematicsBuffer = this.device.createBuffer({
      size: this.bufferCapacity * 16, // 16 * sizeof(vec4<f32>)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    // Write raw cursor coordinates history into GPU buffers
    const rawCoords = new Float32Array(this.bufferCapacity * 4);
    for (let i = 0; i < Math.min(cursorInputs.length, this.bufferCapacity); ++i) {
      const p = cursorInputs[i];
      rawCoords[i * 4] = p.x;
      rawCoords[i * 4 + 1] = p.y;
      rawCoords[i * 4 + 2] = p.timestamp_ms;
      rawCoords[i * 4 + 3] = 0.0; // padding
    }

    // Write parameters to buffers
    const configData = new Uint32Array([width, height, this.bufferCapacity, 0]);
    this.device.queue.writeBuffer(configBuffer, 0, configData.buffer);
    this.device.queue.writeBuffer(cursorBuffer, 0, rawCoords.buffer);

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: configBuffer } },
        { binding: 1, resource: { buffer: cursorBuffer } },
        { binding: 2, resource: { buffer: outputKinematicsBuffer } }
      ]
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(1);
    passEncoder.end();

    const stagingBuffer = this.device.createBuffer({
      size: this.bufferCapacity * 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(outputKinematicsBuffer, 0, stagingBuffer, 0, this.bufferCapacity * 4);
    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ);
    const localOverlapData = new Float32Array(stagingBuffer.getMappedRange()); // Corrected: retrieve before unmapping

    // Map raw coordinate landmarks directly to the WASM heap (Bug Fix: corrected memory offset and map logic)
    // NOTE: This assumes poseLandmarks is available in the broader scope or passed differently. 
    // Assuming poseLandmarks is not needed here or is mock integration, adapting from original code.

    // Map cursor coordinates into the stateful WASM history buffer
    for (let i = 0; i < Math.min(cursorInputs.length, this.bufferCapacity); ++i) {
      const p = cursorInputs[i];
      this.wasmInstance.record_cursor_coordinate(p.x, p.y, p.timestamp_ms);
    }

    // Map scroll coordinates into the stateful WASM history buffer
    for (let i = 0; i < Math.min(scrollDeltas.length, 15); ++i) {
      const s = scrollDeltas[i];
      this.wasmInstance.record_scroll_delta(s.y_delta, s.timestamp_ms);
    }

    // Map search query text securely
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(queryText.substring(0, 4095));
    const heapText = new Uint8Array(this.memory.buffer, this.bufferOffsetText, 4096);
    heapText.fill(0);
    heapText.set(encodedText);

    stagingBuffer.unmap();

    // Calculate lexical risk using offline regular expression matching (Zero Cloud NLP)
    const restrictedKeywords = [/cl3avage/i, /se_xual/i, /bypas/i, /unlock/i, /proxy/i];
    let matchCount = 0;
    for (const regex of restrictedKeywords) {
      if (regex.test(queryText)) {
        matchCount++;
      }
    }
    const queryScore = matchCount / restrictedKeywords.length;

    // Trigger WASM execution loop with parameters (Correction: Invoked correct signature with screen dimensions)
    this.wasmInstance.process_intent_evaluation(queryScore, hoverStartMs, currentTimeMs, width, height);

    return this.latestResults;
  }

  private handleResolvedMetrics(metricsPtr: number): void {
    const dataView = new DataView(this.memory.buffer, metricsPtr, 24); // sizeof(IntentOutput) = 24
    
    const calculatedInteractionScore = dataView.getFloat32(0, true);
    const meanCursorVelocity = dataView.getFloat32(4, true);
    const normalizedScrollVelocity = dataView.getFloat32(8, true);
    const rawDwellTimeSeconds = dataView.getFloat32(12, true);
    const intentClassificationInt = dataView.getInt32(16, true);
    const confidence = dataView.getFloat32(20, true);

    let intentClassification: 'ACADEMIC' | 'ACCIDENTAL' | 'SUSPICIOUS_FOCUS' = 'ACADEMIC';
    if (intentClassificationInt === 2) {
      intentClassification = 'SUSPICIOUS_FOCUS';
    } else if (intentClassificationInt === 1) {
      intentClassification = 'ACCIDENTAL';
    }

    this.latestResults = {
      calculatedInteractionScore,
      meanCursorVelocity,
      normalizedScrollVelocity,
      rawDwellTimeSeconds,
      intentClassification,
      confidence
    };
  }
}
```

**Vulnerability:** A user moving the cursor rapidly across a blurred warning overlay to reach a legitimate button can be falsely flagged as spending dwell time ($D_{\text{dwell}}$), causing accidental over-blocking.

*   **Kinematic Velocity Gate:** The system calculates `meanCursorVelocity` and local acceleration curves ($A_c$). Legitimate target-selection hovering displays zero acceleration and low, stable velocity profiles ($V_c \le 10.0\text{ px/s}$).

*   **Action:** If cursor velocity is high ($V_c \ge 150.0\text{ px/s}$) during overlay intersection, ignore the local dwell-time accumulation ($D_{\text{dwell}} = 0.00$), preventing false positive blocks.

*   **3D Flat-Plane Detection:** Reconstruct joint coordinates over a rolling 15-frame window. While human subjects move in 3D depth planes, printed photos or screen projections are mathematically flat along the optical axis ($Z_{\text{depth}}$ standard deviation $\sigma_z^2 < 0.001$).

```typescript
import { InteractionIntentEngine } from './InteractionIntentEngine';

describe('Unit Test: InteractionIntentEngine', () => {
  let engine: InteractionIntentEngine;

  beforeAll(async () => {
    // Load mock compiled WASM array buffer
    const wasmBuffer = getMockWasmBinary();
    engine = new InteractionIntentEngine();
    await engine.initialize(wasmBuffer);
  });

  it('should verify standard academic searches as ACADEMIC', async () => {
    const mockCursor = [{ x: 100, y: 100, timestamp_ms: 1000 }, { x: 300, y: 300, timestamp_ms: 1200 }]; // High velocity
    const mockScroll = [{ y_delta: 250, timestamp_ms: 1000 }];
    
    const result = await engine.evaluateInteractions(
      mockCursor, mockScroll, "standard biology study tutorial", 0, 0, 1024, 768
    );
    
    expect(result).not.toBeNull();
    expect(result!.intentClassification).toBe('ACADEMIC');
    expect(result!.calculatedInteractionScore).toBeLessThan(0.30);
  });

  it('should identify lingering, very slow scroll focus as SUSPICIOUS_FOCUS', async () => {
    const mockCursor = [{ x: 100, y: 100, timestamp_ms: 1000 }, { x: 101, y: 101, timestamp_ms: 2000 }]; // 0 velocity, lingering
    const mockScroll = [{ y_delta: 5, timestamp_ms: 1000 }, { y_delta: 1, timestamp_ms: 2000 }];       // Slow scroll
    
    const result = await engine.evaluateInteractions(
      mockCursor, mockScroll, "cl3avage bypass proxy", 1000, 5000, 1024, 768 // High dwell time (4.0s) + suggestive query
    );
    
    expect(result).not.toBeNull();
    expect(result!.intentClassification).toBe('SUSPICIOUS_FOCUS');
  });
});
```

```typescript
export function runInteractionStressTest(engine: InteractionIntentEngine, iterations = 1000): void {
  const mockCursor = [{ x: 100, y: 100, timestamp_ms: 1000 }];
  const mockScroll = [{ y_delta: 10, timestamp_ms: 1000 }];
  let overloadCount = 0;

  for (let i = 0; i < iterations; ++i) {
    const start = performance.now();
    const result = engine.evaluateInteractions(
      mockCursor, mockScroll, "Add to cart standard checkout product", 0, 0, 1024, 768
    );
    const duration = performance.now() - start;

    if (duration > 16.6) {
      overloadCount++;
      console.warn("Performance Warning: Processing exceeded frame rendering limits");
    }
  }
}
```

*   **Max Memory Heap Allocation:** $\le 10$ MB persistent RAM inside the WebAssembly linear memory pool.

*   **WebGPU Queue Execution Time:** $\le 0.8$ ms per cursor-trajectory compute pipeline dispatch.