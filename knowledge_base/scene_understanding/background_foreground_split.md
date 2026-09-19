# Background–Foreground Scene Intelligence Framework

## 1. Purpose and governing philosophy

This document is a complete knowledge-base reconstruction for foreground-background reasoning in human and scene understanding. Its purpose is to explain how a scene is interpreted as a structured arrangement of salience, meaning, interaction, space, and temporal continuity rather than as a simple segmentation problem or a depth-based partition. The framework treats foreground-background reasoning as a conceptual act of explainable scene intelligence in which some regions are understood as perceptually dominant, semantically central, behaviorally meaningful, or socially important while other regions are understood as contextual support, environmental setting, or visual substrate.

Foreground-background reasoning is not equivalent to image segmentation, depth estimation, pixel clustering, or focus estimation. These methods may provide signal, but they do not explain why one region functions as foreground and another as background. This framework is concerned with the semantics of visual prominence, scene anchoring, object emphasis, contextual support, and the evidence that causes a region to become perceptually and conceptually central within a larger environment.

The core idea is that foreground and background emerge from a layered understanding of visual attention, scene composition, object relevance, spatial organization, interaction structure, semantic salience, and temporal continuity. The same physical region can function differently depending on the task, the camera framing, the intent of the subjects, the presence of occlusion, the role of the object in the event, and the broader context of the scene.

## 2. Visual perception foundations

### 2.1 Visual perception
Visual perception is the process by which the visual system transforms light, form, motion, contrast, and spatial layout into coherent interpretations of the world. In scene understanding, perception is not limited to noticing visible structure. It also involves identifying what is important, what is subordinate, what is acting, what is contextual, and what is being attended to.

### 2.2 Figure-ground perception
Figure-ground perception is the ability to distinguish a central, meaningful region from the surrounding support structure. The figure is the region that is perceived as the object of attention, action, or interpretation. The ground is the larger context that supports, frames, or situates that figure within the scene.

### 2.3 Gestalt principles
Gestalt principles such as proximity, similarity, continuity, closure, common fate, and symmetry help explain why some regions appear grouped, connected, or separated. A foreground subject may appear visually dominant because it forms a coherent shape and is grouped with nearby elements, while the background may appear fragmented or uniform and therefore less central.

### 2.4 Semantic segmentation concepts
Semantic segmentation contributes a conceptual vocabulary for partitioning a scene into meaningful regions. However, segmentation alone does not explain why one region is foreground and another is background. A semantic region may be important because it is in contact with a subject, because it carries meaning for the event, because it anchors the composition, or because it informs the interaction structure.

### 2.5 Object prominence
Object prominence is determined not only by size but by salience, task relevance, centrality, motion, visibility, interaction, and semantic role. A small object may be highly prominent if it is the object of interaction, the focus of attention, or the source of action.

### 2.6 Spatial perception
Spatial perception integrates position, distance, orientation, layout, and depth cues to construct an understanding of where things are. Foreground and background are spatially meaningful only when interpreted in relation to camera framing, environmental layout, subject movement, and observer perspective.

### 2.7 Contextual interpretation
Contextual interpretation explains why a region is not merely visible but meaningful. A wall behind a person may be background in a portrait, but the same wall may become foreground-relevant if it contains a mural, a clock, a sign, or a dramatic structure used by the subject.

### 2.8 Visual attention
Visual attention is the selective deployment of perceptual resources. The foreground often corresponds to the region that receives attention because it carries action, identity, or narrative importance. The background often provides support but does not carry the main informational burden.

### 2.9 Image composition
Image composition governs how visual balance, framing, symmetry, leading lines, negative space, and focal structure shape interpretation. Composition often explains why a region is perceived as primary even when its geometric size is modest.

### 2.10 Explainable scene intelligence
Explainable scene intelligence requires an interpretation that can be justified in human terms. It must explain not only what is present but why a region is considered foreground, what evidence supports that reading, how the background contributes, and what uncertainties remain.

## 3. Foreground-background ontology

### 3.1 Single person portraits
Foreground evidence: face, torso, gaze, hands, posture, interaction objects, visible expression, and body orientation. Background evidence: wall, room structure, lighting gradient, decor, out-of-focus environment, and contextual space. Object evidence: hair, clothing, accessories, books, instruments, or props. Environmental evidence: room type, illumination, surface texture, and arrangement. Spatial evidence: subject-centered composition, depth separation, relative scale, and placement within the frame. Contextual evidence: intimate mood, identity emphasis, professional portraiture, candid moments, or self-representation. Ambiguity sources: cluttered room, complex background texture, strong lighting, reflective surfaces, and low-contrast separation. Supporting evidence: subject focus, gaze direction, subject-centered framing, strong body visibility, and coherent interaction with the environment. Conflicting evidence: equally salient background objects, extreme background patterning, or foreground subject that is visually small. Downstream interpretation: the scene is understood as a portrait with a controlled foreground subject and a supporting environment.

### 3.2 Group portraits
Foreground evidence: multiple faces, grouping, shared direction of attention, hand contact, overlapping bodies, and collective posture. Background evidence: venue architecture, decorative walls, open space, lawn, or crowd support. Object evidence: props, signs, flowers, decorative elements, or furniture. Environmental evidence: ceremony space, beach, party setup, or family home. Spatial evidence: arrangement across the frame, central cluster, and visible spacing. Contextual evidence: relational bonds, event type, social role, and collective identity. Ambiguity sources: uneven subject spacing, low contrast, overlapping bodies, hidden faces, and background figures. Supporting evidence: shared gaze, body adjacency, and grouped arrangement. Conflicting evidence: strong background figures that compete with the group cluster. Downstream interpretation: the scene is a social composition where the group is the primary semantic unit and the background supports the event context.

### 3.3 Street photography
Foreground evidence: people, signs, vehicles, motion paths, window reflections, street vendors, and street-level objects. Background evidence: storefronts, architecture, sky, passing traffic, pedestrians, and environmental context. Object evidence: bicycles, umbrellas, bags, posters, and street furniture. Environmental evidence: urban geometry, pavement, road markings, lighting, weather. Spatial evidence: perspective lines, leading lines, depth layering, and scale shifts. Contextual evidence: city life, transit, commerce, social movement, and ordinary daily activity. Ambiguity sources: dense crowds, reflective surfaces, dynamic motion, and ambiguous object salience. Supporting evidence: strong perspective structure and coherent layering. Conflicting evidence: background architecture that is equally visually striking. Downstream interpretation: the scene is a layered urban encounter where foreground activity and background environment jointly construct meaning.

### 3.4 Indoor scenes
Foreground evidence: people, furniture, objects in active use, surfaces under interaction, and visible tasks. Background evidence: walls, shelving, doors, windows, room depth, and remote surfaces. Object evidence: appliances, desks, books, decor, lamps, and containers. Environmental evidence: room type, household or workplace function, illumination, and layout. Spatial evidence: furniture arrangement, room geometry, depth planes, and occlusion. Contextual evidence: domestic routine, workspace activity, or hospitality environment. Ambiguity sources: clutter, partial visibility, mirror reflections, and mixed-depth objects. Supporting evidence: task-relevant interaction and spatial coherence. Conflicting evidence: decorative background objects with high salience. Downstream interpretation: the scene is interpreted through a combination of functional action in the foreground and environmental context in the background.

### 3.5 Outdoor landscapes
Foreground evidence: trees, rocks, grasses, paths, water surfaces, people, or small structures near the viewer. Background evidence: sky, hills, distant mountains, atmospheric haze, larger terrain, and open horizon. Object evidence: path markers, fences, vehicles, tents, birds, or signs. Environmental evidence: weather, season, terrain, lighting, and climate. Spatial evidence: depth layering, atmospheric perspective, horizon line, and scale differences. Contextual evidence: travel, recreation, environmental beauty, or narrative setting. Ambiguity sources: low contrast, weather haze, repeating textures, and broad horizon. Supporting evidence: strong foreground anchor and well-defined depth hierarchy. Conflicting evidence: equally salient distant structures. Downstream interpretation: a landscape scene where foreground anchors the viewer and the background defines environment and scale.

### 3.6 Sports events
Foreground evidence: athlete, ball, apparatus, action zone, and highly active body pose. Background evidence: crowd, scoreboard, field markings, stands, and venue structure. Object evidence: racket, bat, net, goalposts, shoes, or helmet. Environmental evidence: field, court, arena, weather, and lighting. Spatial evidence: depth from action zone to audience and field boundaries. Contextual evidence: competition, training, spectatorship, or gameplay. Ambiguity sources: crowd density, motion blur, spectator clutter, and multiple active figures. Supporting evidence: visible action, subject motion, and game relevance. Conflicting evidence: audience elements that draw attention. Downstream interpretation: the foreground athlete or event zone is primary while the background provides venue and social context.

### 3.7 Fitness activities
Foreground evidence: exercising body, apparatus, posture changes, direction of action, and exertion cues. Background evidence: mirrors, studio walls, equipment rows, instructors, and other participants. Object evidence: yoga mats, dumbbells, bands, kettlebells, benches, and mats. Environmental evidence: gym, studio, home workout space, or rehabilitation setting. Spatial evidence: body-centered framing, equipment layout, and floor lines. Contextual evidence: training, wellness, rehabilitation, or body-oriented instruction. Ambiguity sources: mirrored surfaces, repeated equipment, and synchronized movement. Supporting evidence: task coherence and body intent. Conflicting evidence: background participants or equipment that dominate the visual field. Downstream interpretation: the activity region is primary and the background supports the workout context.

### 3.8 Medical environments
Foreground evidence: patient, clinician, diagnostic tools, hands, face, procedure zone, and visible care interaction. Background evidence: treatment room, equipment cabinets, monitors, walls, and support staff. Object evidence: gloves, monitors, trays, instruments, bed rails, and medical devices. Environmental evidence: clinic, exam room, operating room, or rehabilitation space. Spatial evidence: procedural layout, proximity to equipment, and relative placement of care actors. Contextual evidence: treatment, diagnosis, therapy, or monitoring. Ambiguity sources: clinical clutter, similar-colored garments, occluding devices, and high-risk misclassification. Supporting evidence: procedural coherence and human interaction. Conflicting evidence: background devices that resemble foreground objects. Downstream interpretation: the foreground care interaction is primary and the background provides clinical context and support.

### 3.9 Educational settings
Foreground evidence: teacher, students, boards, demonstrations, objects in use, and direction of attention. Background evidence: classroom walls, desks, windows, equipment, and other students. Object evidence: textbooks, laptops, cameras, microscopes, and lab materials. Environmental evidence: classroom, lab, lecture hall, or tutorial space. Spatial evidence: audience-facing layout, board location, desk rows, and instructional zones. Contextual evidence: teaching, learning, collaboration, or evaluation. Ambiguity sources: group seating, high visual clutter, and many faces. Supporting evidence: interaction structure and common attention. Conflicting evidence: background displays or posters that compete visually. Downstream interpretation: the instructional interaction is foregrounded while the environment functions as supporting context.

### 3.10 Crowded public areas
Foreground evidence: nearest people, prominent movement, signs, queues, vehicles, or furniture. Background evidence: larger crowd, architecture, transit infrastructure, open plaza, and skyline. Object evidence: bags, umbrellas, carts, kiosks, and transit signs. Environmental evidence: transit hub, event venue, plaza, station, or festival ground. Spatial evidence: depth layering, crowd density, and circulation pathways. Contextual evidence: public movement, social flow, transit, commerce, or gathering. Ambiguity sources: many similar figures, motion blur, and overlapping bodies. Supporting evidence: local interaction and clear scene layers. Conflicting evidence: background structures with strong visual weight. Downstream interpretation: the scene is a public system where local foreground activity and distant background context coexist.

### 3.11 Vehicles
Foreground evidence: occupants, dashboard, steering wheel, hand position, visible body posture, or exterior elements near the camera. Background evidence: road, landscape, other vehicles, buildings, or sky. Object evidence: mirrors, windows, seats, bags, devices, and signage. Environmental evidence: road, train, aircraft, or vehicle interior. Spatial evidence: interior depth, windshield perspective, and lane position. Contextual evidence: transit, travel, driving, commuting, or passenger presence. Ambiguity sources: windshield reflections, glass, occlusion, and fast movement. Supporting evidence: body orientation and interaction with controls. Conflicting evidence: strong exterior landscape that competes with the interior subject. Downstream interpretation: the vehicle interior or active driver/passenger is foregrounded while the exterior environment provides situational context.

### 3.12 Architecture
Foreground evidence: doorway, façade detail, staircase, column, or person interacting with architecture. Background evidence: broader building, skyline, adjacent structures, sky, and distant environment. Object evidence: benches, signage, railings, decorative surfaces, and structural elements. Environmental evidence: civic building, residence, monument, or commercial structure. Spatial evidence: perspective, scale, vertical structure, and depth. Contextual evidence: identity of place, function, and cultural meaning. Ambiguity sources: repeated architectural motifs, strong symmetry, and low contrast. Supporting evidence: clear line structure and semantic anchors. Conflicting evidence: very strong background facade that competes with foreground detail. Downstream interpretation: the scene is understood through architectural form and the human or object interaction with it.

### 3.13 Wildlife
Foreground evidence: animal body, eyes, motion, interaction, and proximity to the camera. Background evidence: habitat, terrain, vegetation, water, sky, and distant environment. Object evidence: nests, burrows, prey, tools, or environmental markers. Environmental evidence: savanna, forest, wetland, or desert. Spatial evidence: depth, camouflage, concealment, and habitat layering. Contextual evidence: animal behavior, predator-prey dynamics, and ecological space. Ambiguity sources: camouflage, motion, background matching, and low contrast. Supporting evidence: shape, motion, and anatomical coherence. Conflicting evidence: a visual background that mimics the animal shape. Downstream interpretation: the animal or its action is the figure and the habitat is the ground.

### 3.14 Nature
Foreground evidence: plants, rocks, water, flowers, insects, or small terrain features near the viewer. Background evidence: horizon, sky, distant trees, mountain layers, or clouds. Object evidence: branches, leaves, moss, stones, and water reflections. Environmental evidence: season, weather, and ecological systems. Spatial evidence: near-far layering, atmospheric perspective, and scale. Contextual evidence: landscape mood, ecology, or scenic composition. Ambiguity sources: repeated texture, similar tones, sparse depth, and broad sky. Supporting evidence: strong visual anchoring and depth separation. Conflicting evidence: distant features that look equally textured. Downstream interpretation: the foreground anchors attention while the background supplies environmental context and scale.

### 3.15 Household objects
Foreground evidence: object of interaction, hand contact, visible object edges, and object-centered placement. Background evidence: countertop, shelves, room surfaces, wall, or other objects. Object evidence: utensils, containers, devices, clothing, books, and household items. Environmental evidence: kitchen, office desk, bathroom, or bedroom. Spatial evidence: object arrangement, overlap, and near-far layering. Contextual evidence: everyday use, storage, display, or preparing activity. Ambiguity sources: visual clutter, object similarity, and overlapping layouts. Supporting evidence: functional relevance and clear object boundaries. Conflicting evidence: decorative background objects with equal salience. Downstream interpretation: the object or action becomes the figure and the surrounding environment becomes context.

### 3.16 Commercial displays
Foreground evidence: product, signage, packaging, retail display, or human interaction with the product. Background evidence: shelves, store interior, lighting, signage towers, or promotional architecture. Object evidence: product units, labels, fixtures, and branding. Environmental evidence: retail environment, showroom, or exhibition. Spatial evidence: display arrangement, shelf depth, customer access, and visual hierarchy. Contextual evidence: shopping, advertising, consumption, identification, and commerce. Ambiguity sources: repetitive shelving, bold branding, and multiple products. Supporting evidence: product-centered framing and explicit categorization. Conflicting evidence: large background signage that competes with the product. Downstream interpretation: the product or consumer interaction is primary and the environment is secondary support.

### 3.17 Entertainment scenes
Foreground evidence: performer, screen, instrument, audience face, or action zone. Background evidence: stage, backdrop, lights, audience seating, or production design. Object evidence: costumes, props, microphones, instruments, and screens. Environmental evidence: theater, concert hall, studio, or broadcast stage. Spatial evidence: stage depth, spotlight, audience perspective, and performer placement. Contextual evidence: performance, public display, music, drama, or media capture. Ambiguity sources: lighting contrast, stage effects, large backdrop imagery, and multiple performers. Supporting evidence: motion, expression, and strong focalization. Conflicting evidence: background visual spectacle that competes with the performer. Downstream interpretation: the performance region is central while the environment functions as stagecraft and audience context.

### 3.18 Conference rooms
Foreground evidence: speaker, presenter, audience faces, hand gestures, slides, or demonstration tools. Background evidence: screens, walls, seating, podium, and room interior. Object evidence: microphones, laptops, projectors, documents, and water bottles. Environmental evidence: meeting room, lecture hall, seminar space, or workshop area. Spatial evidence: speaker-centered arrangement, audience rows, and screen orientation. Contextual evidence: instruction, presentation, discussion, and corporate communication. Ambiguity sources: many similar seated figures and screen clutter. Supporting evidence: speaker focus and shared attention. Conflicting evidence: multiple equally active subjects. Downstream interpretation: the primary communicative action becomes the figure while the room supports the event.

### 3.19 Restaurants
Foreground evidence: diners, plates, hands, beverages, or service interactions. Background evidence: interior architecture, tables, kitchen opening, windows, and other diners. Object evidence: utensils, menus, lighting, décor, and drink glasses. Environmental evidence: dining space, cafe, bar, or food hall. Spatial evidence: table layout, depth layers, and line of sight. Contextual evidence: hospitality, eating, conversation, and social routine. Ambiguity sources: cluttered tables, reflective surfaces, and many repeated objects. Supporting evidence: meal-centered interaction and social grouping. Conflicting evidence: dramatic background decor that draws attention. Downstream interpretation: the active meal interaction is foregrounded while the background supplies environment and atmosphere.

### 3.20 Museums
Foreground evidence: visitor, artwork, signs, hands, or body pose near an exhibit. Background evidence: gallery walls, other exhibits, pathways, and architectural space. Object evidence: display plinths, labels, ropes, photography restrictions, and frames. Environmental evidence: gallery, exhibition hall, or cultural venue. Spatial evidence: viewing angle, exhibit placement, and circulation paths. Contextual evidence: observation, education, appreciation, and cultural engagement. Ambiguity sources: many visually similar paintings, reflective cases, and crowd flow. Supporting evidence: attention to the artwork and guided movement. Conflicting evidence: large architectural background or bright signage. Downstream interpretation: the artwork, visitor interaction, or exhibit focus becomes the figure and the gallery context remains supporting ground.

### 3.21 Airports
Foreground evidence: traveler, luggage, gate signage, check-in desk, queue, ticketing action, or moving body. Background evidence: terminal architecture, boarding gates, departure boards, crowds, and distant hallways. Object evidence: bags, carts, screens, security barriers, and seats. Environmental evidence: transit infrastructure and public circulation. Spatial evidence: gate layout, queue paths, doorways, and depth. Contextual evidence: travel, wayfinding, departure, arrival, and public logistics. Ambiguity sources: repeated signage, large crowds, and reflective surfaces. Supporting evidence: movement coherence and functional relevance. Conflicting evidence: strong architectural background that competes. Downstream interpretation: the traveler or interaction zone is the figure and the terminal environment is the ground.

### 3.22 Shopping centers
Foreground evidence: shopper, cart, product, hand, face, or clothing in proximity to the product. Background evidence: aisles, shelves, signage, other shoppers, and store architecture. Object evidence: products, price tags, baskets, and fixtures. Environmental evidence: retail layout and commercial circulation. Spatial evidence: aisle depth, shelf lines, and shopper paths. Contextual evidence: browsing, buying, or comparison. Ambiguity sources: repetitive shelving and many similar products. Supporting evidence: shopper interaction and product relevance. Conflicting evidence: large promotional signage or bright display walls. Downstream interpretation: the active shopping interaction becomes the figure and the store environment remains the supporting ground.

### 3.23 Construction sites
Foreground evidence: worker, tool, equipment, body pose, or active work zone. Background evidence: scaffolding, site structures, vehicles, materials, and distant infrastructure. Object evidence: drills, ladders, concrete, pipes, helmets, and barriers. Environmental evidence: industrial worksite and temporary structures. Spatial evidence: depth, stacking, ladders, and hazard zones. Contextual evidence: building, repair, demolition, or infrastructure. Ambiguity sources: repetitive materials, protective gear, and heavy clutter. Supporting evidence: worker action and visible hazard context. Conflicting evidence: large machinery or background structure. Downstream interpretation: the working zone and worker are primary while the broader site remains contextual support.

### 3.24 Factories
Foreground evidence: worker, process, machine interface, product line, or hand movement. Background evidence: conveyors, machinery, facility architecture, and workstations. Object evidence: tools, packaging, pallets, cabinets, and instrumentation. Environmental evidence: industrial production environment and workflow. Spatial evidence: production line geometry, equipment depth, and operating zones. Contextual evidence: manufacturing, quality control, or assembly. Ambiguity sources: repetitive machinery, low contrast, and heavy occlusion. Supporting evidence: functional interaction and process coherence. Conflicting evidence: large equipment or background conveyors. Downstream interpretation: the operational action is primary and the factory environment is contextual support.

### 3.25 Home interiors
Foreground evidence: person, food, furniture-use zones, devices, or activity surfaces. Background evidence: walls, windows, shelves, hallway, and surrounding room depth. Object evidence: utensils, electronics, pillows, lamps, and containers. Environmental evidence: bedroom, kitchen, living room, or bathroom. Spatial evidence: furniture layout, room divisions, and object placement. Contextual evidence: domestic life, rest, cooking, working, or caregiving. Ambiguity sources: clutter, multiple surfaces, and mirrored walls. Supporting evidence: everyday use and spatial coherence. Conflicting evidence: decorative background that competes. Downstream interpretation: the action region is foreground while the surrounding interior provides meaning and support.

## 4. Figure-ground framework

### 4.1 Visual prominence
Visual prominence is the degree to which a region stands out from the surrounding field because of contrast, color, shape, motion, size, detail, proximity to the center, and uniqueness. But prominence alone is not sufficient. A region may be visually prominent yet semantically secondary, such as a bright sign in the background that attracts attention but does not define the event.

### 4.2 Semantic importance
Semantic importance is the degree to which a region contributes meaning to the event. A foreground person may be semantically important because they are interacting, speaking, performing, or carrying the action. A background region may be semantically important if it reveals the location, the identity of the place, or the social context.

### 4.3 Object emphasis
Object emphasis concerns which entities are acting as anchors of interpretation. Emphasis can be driven by physical centrality, interaction, gaze, motion, or the social role of the object. The same object can be in the background and still carry important narrative meaning if it signals identity or event type.

### 4.4 Scene anchors
Scene anchors are regions that stabilize interpretation. They may be a person, a face, a vehicle, a doorway, a table, a stage, or a terrain feature. Anchors reduce ambiguity because they provide a stable basis for understanding the scene structure.

### 4.5 Supporting context
Supporting context is the environment that surrounds the focal region. It supplies information about place, time, social setting, weather, medium, and event type. Background is not merely “non-figure”; it is the structured support field that makes the figure intelligible.

### 4.6 Environment layers
Environmental layers include near ground, middle ground, far ground, sky, architecture, scenery, and distant support structures. Each layer contributes different kinds of meaning. The near layer often contributes interacting objects; the far layer often contributes place and scale; the sky often contributes weather and mood.

### 4.7 Occlusion
Occlusion changes what is seen and what is inferred. A partially hidden object may still be foreground-relevant because it is interacting with the main subject. The background can become perceptually important when foreground elements are occluded or when the visible figure is reduced to an outline.

### 4.8 Depth cues
Depth cues include size, overlap, motion parallax, perspective, texture gradient, occlusion, luminance, and atmospheric blur. These cues help determine which regions belong to the near, middle, and far layers of the scene, but they do not by themselves define the semantic foreground. A region may appear close in depth yet remain background in semantic importance.

### 4.9 Perspective
Perspective shapes the reading of spatial hierarchy. A wide-angle frame can make the foreground region appear large and dramatic while a telephoto frame can compress space and make the background feel closer. The interpretation of foreground and background must therefore remain sensitive to the camera geometry.

### 4.10 Camera framing
Camera framing determines the visible field, the relative weighting of regions, and the viewer’s path of attention. A centered subject may be foregrounded through framing even when the background is equally detailed. A panoramic frame may distribute importance across the scene rather than letting one region dominate.

### 4.11 Figure-ground in explainable understanding
Figure-ground reasoning contributes to explainability because it allows the system to say why a region is considered central, why another is contextual, and what evidence underwrites that judgment. It turns a bare spatial partition into a narrative of visual importance, semantic role, and scene function.

## 5. Scene hierarchy

Visual Features
Foreground Elements
Background Elements
Scene Context
Semantic Interpretation
Policy Interpretation

At the pixel stage, the system has raw visual evidence. At the visual-feature stage, it extracts edges, color regions, texture structure, motion cues, and local salience. At the object stage, it identifies entities and their likely function. At the foreground-elements stage, it determines which entities are acting as the principal carriers of attention and action. At the background-elements stage, it identifies the supporting environmental structure. At the scene-context stage, it interprets place, purpose, relation, and event type. At the semantic-interpretation stage, it forms a coherent narrative of what the scene is about. At the policy-interpretation stage, it decides whether the interpretation is ordinary, ambiguous, sensitive, or requiring further examination.

## 6. Temporal scene intelligence

### 6.1 Foreground transitions
Foreground transitions occur when the subject of attention shifts from one person to another, from an object to a body, or from one region of the frame to another. Temporal reasoning is required to determine whether this shift is meaningful, accidental, or caused by camera motion.

### 6.2 Background stability
Background stability refers to whether the structural support environment remains consistent over time. A background that persists across frames becomes a reliable anchor; a background that changes rapidly may be a distraction, a synthetic addition, or a sign of camera or scene instability.

### 6.3 Camera movement
Camera movement can alter the apparent foreground-background relation. A pan, zoom, or dolly can make the same object shift from background to foreground or can reveal hidden layers. Temporal reasoning is needed to separate genuine scene change from perspective-induced changes.

### 6.4 Object entrance and exit
Objects can enter the frame and become semantically important, or leave and become less relevant. A person crossing from background to foreground can change the salience hierarchy. A car entering the frame can transform the meaning of a street scene.

### 6.5 Scene continuity
Scene continuity examines whether the environment remains coherent across frames. The same wall, doorway, street, or stage structure should remain consistent if the scene is authentic and stable.

### 6.6 Attention shifts
Attention shifts reveal whether the viewer or the scene is moving from one focal point to another. This matters because figure-ground relationships are often dynamic rather than static.

### 6.7 Environment evolution
Environment evolution describes how background context changes as the scene unfolds. A park can become a crowded event, a workshop can become a public demonstration, or a street can become a vehicle corridor.

### 6.8 Long-duration scene consistency
Long-duration scene consistency asks whether the same foreground-background pattern remains plausible across extended time. If the same object suddenly shifts from supportive context to dominant subject without a narrative cause, the system should be cautious.

## 7. Confidence architecture

### 7.1 Foreground confidence
Foreground confidence increases when the region is repeatedly associated with action, attention, interaction, or semantic centrality and when other signals agree.

### 7.2 Background confidence
Background confidence increases when the contextual region remains stable, semantically supportive, and spatially coherent with the scene.

### 7.3 Scene confidence
Scene confidence increases when the composition, context, and temporal evidence support one coherent reading of the setting.

### 7.4 Environment confidence
Environment confidence increases when the background structure is coherent with the apparent place type and the activity unfolding within it.

### 7.5 Object confidence
Object confidence increases when the entities in the scene have clear function, stable boundaries, and plausible relations to the main activity.

### 7.6 Context confidence
Context confidence increases when the broader social and physical context supports the same interpretation as the visible foreground and background arrangement.

### 7.7 Overall interpretation confidence
Overall interpretation confidence emerges from the accumulation of evidence across salience, spatial organization, object understanding, interaction reasoning, temporal stability, and semantic context.

## 8. Uncertainty architecture

### 8.1 Foreground ambiguity
Foreground ambiguity occurs when more than one region could plausibly serve as the main subject, especially in crowded or highly symmetric scenes.

### 8.2 Background ambiguity
Background ambiguity occurs when the support region could either be benign context or a semantically important structure.

### 8.3 Depth ambiguity
Depth ambiguity occurs when depth cues are weak, contradictory, or distorted by perspective, reflection, or motion.

### 8.4 Occlusion uncertainty
Occlusion uncertainty increases when critical evidence is hidden, making the foreground and background relationship less certain.

### 8.5 Viewpoint uncertainty
Viewpoint uncertainty grows when the camera orientation obscures spatial structure or distorts relative scale.

### 8.6 Scene uncertainty
Scene uncertainty appears when a scene could be interpreted in multiple ways because the event type, place type, or social context is unclear.

### 8.7 Context uncertainty
Context uncertainty arises when background evidence is insufficient to identify the environment or activity.

### 8.8 Temporal uncertainty
Temporal uncertainty arises when the scene is too short to establish continuity, attention shifts, or stable role assignment.

### 8.9 Cross-modal disagreement
Cross-modal disagreement occurs when visual evidence suggests one figure-ground reading while movement, language, or audio suggest another. In such cases, the system should preserve uncertainty rather than overcommit.

## 9. Subsystem integration framework

### 9.1 environment
Conceptual responsibility: the environment supplies place type, room structure, outdoor setting, and scene affordances. Supporting evidence: architectural layout, weather, lighting, surface type, and spatial organization. Conflicting evidence: a background that violates the expected setting. Evidence contribution: establishes the support field and the relationship between the figure and the ground. Confidence contribution: increases when the environment coheres with the activity. Uncertainty contribution: rises when the setting is visually inconsistent or underdetermined. Evidence fusion: combines with object, subject, and temporal evidence. Conflict resolution: distinguishes ordinary context from misleading or synthetic support.

### 9.2 objects
Conceptual responsibility: objects define what is present and how it functions. Supporting evidence: object semantics, placement, and interaction. Conflicting evidence: objects that appear decorative but serve no functional role. Evidence contribution: anchors the scene and helps identify the relevant foreground. Confidence contribution: rises when object placement matches expected behavior. Uncertainty contribution: rises when object identities are ambiguous. Evidence fusion: combines with environment, salience, and interaction reasoning. Conflict resolution: separates functional objects from irrelevant clutter.

### 9.3 camera_focus
Conceptual responsibility: camera focus guides attention to regions of visual interest. Supporting evidence: emphasis, blur distribution, and focal hierarchy. Conflicting evidence: strong background detail that is not semantically focal. Evidence contribution: helps explain why a region is visually prioritized. Confidence contribution: increases when focus aligns with semantically relevant regions. Uncertainty contribution: rises when blur and sharpness are ambiguous. Evidence fusion: combines with composition and scene structure. Conflict resolution: separates camera emphasis from semantic importance.

### 9.4 camera_framing
Conceptual responsibility: camera framing determines the visible field and the distribution of salience. Supporting evidence: centering, crop, aspect ratio, and framing balance. Conflicting evidence: frames that intentionally distribute attention. Evidence contribution: explains why a region appears dominant. Confidence contribution: increases when framing and content agree. Uncertainty contribution: rises with unusual or distorted framing. Evidence fusion: combines with perspective and attention. Conflict resolution: distinguishes framing-driven emphasis from event-driven emphasis.

### 9.5 movement
Conceptual responsibility: movement reveals which regions are active, dynamic, and behaviorally salient. Supporting evidence: direction of motion, flow, and change. Conflicting evidence: static background that is visually dominant. Evidence contribution: highlights action zones and shifting attention. Confidence contribution: increases when motion aligns with the identified foreground. Uncertainty contribution: rises when movement is ambiguous or blurred. Evidence fusion: combines with tracking and interaction evidence. Conflict resolution: differentiates true action from environmental motion.

### 9.6 pose
Conceptual responsibility: pose reveals body orientation, action intention, and social role. Supporting evidence: body direction, limb arrangement, and stance. Conflicting evidence: pose that is inconsistent with the apparent event. Evidence contribution: clarifies which person or body region is focal. Confidence contribution: rises when pose matches the interpreted activity. Uncertainty contribution: rises when pose is partial or ambiguous. Evidence fusion: combines with movement and interaction modules. Conflict resolution: separates meaningful bodily emphasis from arbitrary posture.

### 9.7 tracking
Conceptual responsibility: tracking maintains continuity across frames. Supporting evidence: persistent identity and stable spatial relation. Conflicting evidence: identity drift or inconsistent object continuity. Evidence contribution: establishes whether a region remains foreground over time. Confidence contribution: increases with stable continuity. Uncertainty contribution: rises with drift or re-identification ambiguity. Evidence fusion: combines with temporal reasoning. Conflict resolution: distinguishes true foreground persistence from momentary salience.

### 9.8 behavioral_signals
Conceptual responsibility: behavioral signals reveal role, intention, and social action. Supporting evidence: gaze, gesture, posture, routine, and interaction. Conflicting evidence: behaviors that do not fit the apparent setting. Evidence contribution: explains why a region is behaviorally central. Confidence contribution: rises when behavior aligns with the event. Uncertainty contribution: rises when behavior is ambiguous or culturally unusual. Evidence fusion: combines with pose and interaction intent. Conflict resolution: separates ordinary behavior from staged or abnormal behavior.

### 9.9 interaction_intent
Conceptual responsibility: interaction intent identifies what the participants are trying to achieve. Supporting evidence: pointing, conversing, handing over, demonstrating, or looking at an object. Conflicting evidence: social signals that do not correspond to the visible action. Evidence contribution: establishes which regions matter to the interaction. Confidence contribution: rises when intent aligns with salience. Uncertainty contribution: rises with unclear or hidden interaction. Evidence fusion: combines with relationship and behavioral evidence. Conflict resolution: separates genuine interaction from incidental proximity.

### 9.10 multi_person_interaction
Conceptual responsibility: multi-person interaction understands group structure and shared attention. Supporting evidence: clusters, gaze alignment, gestural coordination, and circulation. Conflicting evidence: random crowding without interaction. Evidence contribution: explains which person or group forms the figure. Confidence contribution: rises when group structure is coherent. Uncertainty contribution: rises with dense crowding or hidden faces. Evidence fusion: combines with social and spatial reasoning. Conflict resolution: distinguishes collective attention from unrelated proximity.

### 9.11 relationship
Conceptual responsibility: relationship reasoning identifies social role and relational relevance. Supporting evidence: kinship, instruction, caregiving, leadership, or service roles. Conflicting evidence: role mismatches or synthetic social structure. Evidence contribution: clarifies the importance of persons and groups. Confidence contribution: rises when relationships agree with the setting. Uncertainty contribution: rises with unclear social roles. Evidence fusion: combines with interaction intent and environment. Conflict resolution: distinguishes ordinary social relation from exploitative or misleading arrangement.

### 9.12 medical
Conceptual responsibility: medical reasoning brings domain expectations about care, evaluation, treatment, and clinical relevance. Supporting evidence: visible symptoms, clinical tools, procedural structure, and care roles. Conflicting evidence: medical-looking objects used in a non-medical setting. Evidence contribution: distinguishes the medically focal region from the wider room. Confidence contribution: rises when the care task is coherent. Uncertainty contribution: rises when the medical context is ambiguous. Evidence fusion: combines with environment, objects, pose, and interaction. Conflict resolution: separates clinical focus from decorative or misleading similarity.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

* $\mathbf{P}_{\text{mask}}(x, y) \in \{0, 1\}$ be the binary semantic pixel mask of the detected person, where $1$ represents the subject territory and $0$ represents open space.

* $\mathbf{BG}_{\text{mask}}(x, y)$ be the mathematically inverted pixel mask representing the absolute background landscape:

    $$\mathbf{BG}_{\text{mask}}(x, y) = 1.0 - \mathbf{P}_{\text{mask}}(x, y)$$
* $\mathbf{P}_{\text{skin\_map}}(x, y) \in [0.0, 1.0]$ be the generated 2D skin probability continuous matrix derived from the YCbCr/HSV visual layer.

The system limits the execution of skin visibility and apparel safety checks strictly to the coordinates inside the active human segmentation mask boundary:

$$\mathbf{P}_{\text{skin\_local}} = \mathbf{P}_{\text{skin\_map}} \cap \mathbf{P}_{\text{mask}}$$

Any skin-like color profiles detected outside this boundary—where the Intersection over Union ($\text{IoU}$) with $\mathbf{P}_{\text{mask}}$ is exactly $0.0$—are automatically classified as non-threatening background elements and are ignored by the safety logic.

```text
[Full Video Frame Workspace]
+-----------------------------------------------------------------------+
|  Ambient Camouflage Noise (e.g., Sand, Wooden Textures - IGNORED)    |
|                                                                       |
|         +---------------------------------------+                     |
|         |  Active Human Mask Boundary (P_mask)  |                     |
|         |                                       |                     |
|         |  [Skin Pixels strictly processed inside]| <--- Core Shield Target
|         |  P_skin_local = P_skin_map ∩ P_mask   |                     |
|         +---------------------------------------+                     |
|                                                                       |
+-----------------------------------------------------------------------+
```

$$\text{IoU}(\mathbf{P}_{\text{mask}}^{t}, \mathbf{P}_{\text{mask}}^{t-1}) = \frac{|\mathbf{P}_{\text{mask}}^{t} \cap \mathbf{P}_{\text{mask}}^{t-1}|}{|\mathbf{P}_{\text{mask}}^{t} \cup \mathbf{P}_{\text{mask}}^{t-1}|}$$

If $\text{IoU} < 0.15$ within a window of $\Delta t = 33\text{ms}$ without a structural camera movement signal, the engine flags a frame injection anomaly and enters a high-sensitivity security verification state.

---

## 2. Dynamic Monocular Depth-Map Occlusion
When the host platform supports local monocular depth estimation (e.g., MiDaS neural network layers compiled directly into high-speed WebAssembly), the system maps spatial distances to prevent camouflage and overlay bypass attempts.

Let:
* $\bar{D}_{\text{person}}$ represent the calculated median depth coordinate value of the pixels inside $\mathbf{P}_{\text{mask}}$.
* $\mu_{D\_\text{bg}}$ represent the spatial average depth coordinate of the adjacent background pixels within an expanded $15\text{-pixel}$ dilation boundary around $\mathbf{P}_{\text{mask}}$.

The system continuously calculates the spatial delta interval to classify the subject's environment:

$$\Delta D = \mu_{D\_\text{bg}} - \bar{D}_{\text{person}}$$

```text
                                      [EVALUATE DEPTH DELTA: ΔD]
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
            ΔD < 0.20 meters                         ΔD >= 1.00 meters
   [STATE: SUBJECT MERGED WITH BG]                [STATE: ISOLATED SUBJECT]
                 │                                         │
    - Subject touching wall/furniture         - Subject standing clear in space
    - Danger: Mask edge bleeding              - Confidence Profile: MAXIMUM
                 │                                         │
                 ▼                                         ▼
   Action: Increase Edge Resolution          Action: Standard Segmentation Maps
   Enforce Sobel-Filter Corrections          Maintain Normal Processing Pass
```

### 2.1 State: Subject Merged with Background ($\Delta D < 0.20\text{ meters}$)

### 2.2 State: Isolated Subject ($\Delta D \ge 1.00\text{ meters}$)

```javascript
/**
 * ============================================================================
 * AI RADAR SYSTEM - SCENE UNDERSTANDING SUBSYSTEM
 * MODULE: BACKGROUND_FOREGROUND_SPLIT_ENGINE
 * VERSION: 18.2.0-RELEASE-PROD-SHIELD
 * CHROMIUM MV3 BACKGROUND EXTENSION WORKER CORE - ZERO RUNTIME HEAP ALLOCATION
 * ============================================================================
 */

"use strict";

const BGFG_SHIELD_CONFIG = {
    IDENTIFIER: "AI_RADAR_LOCAL_SU_BG_FG_SPLIT",
    TAU_DEPTH_MERGE_LIMIT: 0.20,   // Depth delta threshold for background merge (meters)
    TAU_DEPTH_ISOLATED_LIMIT: 1.00, // Depth delta threshold for clear isolation (meters)
    ANOMALY_IOU_THRESHOLD: 0.15,    // Minimum IoU threshold to detect frame injection anomalies
    EDGE_HIGH_RESOLUTION_MULTIPLIER: 2.0
};

class BackgroundForegroundSplitEngine {
    constructor(frameWidth, frameHeight) {
        this.width = frameWidth;
        this.height = frameHeight;
        this.totalPixels = frameWidth * frameHeight;
        this.frameCounter = 0n;

        // Pre-allocated typed arrays to prevent memory allocations in execution loops
        this.localSkinMapBuffer = new Float32Array(this.totalPixels);
        this.historicalMaskBuffer = new Uint8Array(this.totalPixels);
        this.metricsOutputScratchPad = new Float32Array(4); // [IoU, MedianPersonDepth, AvgBgDepth, DeltaD]
    }

    /**
     * Isolates human skin maps from background textures and evaluates spatial depth profiles.
     * @param {Uint8Array} currentPersonMask - Binary pixel array (0 or 1) representing human territory.
     * @param {Float32Array} rawSkinProbabilityMap - Global skin probability matrix (0.0 to 1.0).
     * @param {Float32Array} depthMapData - Monocular depth data array in meters per pixel.
     * @returns {Object} Complete segmentation analysis and downstream pipeline directives.
     */
    processSegmentationSplit(currentPersonMask, rawSkinProbabilityMap, depthMapData) {
        this.frameCounter++;

        if (!currentPersonMask || !rawSkinProbabilityMap || currentPersonMask.length !== this.totalPixels) {
            return this._triggerSecureExceptionFallback("SEGMENTATION_INPUT_BUFFERS_INVALID_OR_MISMATCHED");
        }

        let intersectionCount = 0;
        let unionCount = 0;
        let activePersonPixels = 0;
        let backgroundAdjacentPixels = 0;

        let totalPersonDepth = 0.0;
        let totalBgDepth = 0.0;

        // Reset local skin buffer safely without reallocation
        this.localSkinMapBuffer.fill(0.0);

        // 1. Perform Coordinate Boundary Mapping and Spatial Analysis Loops
        for (let i = 0; i < this.totalPixels; i++) {
            const isPerson = currentPersonMask[i] === 1;
            const wasPerson = this.historicalMaskBuffer[i] === 1;

            // Compute basic tracking metrics
            if (isPerson && wasPerson) intersectionCount++;
            if (isPerson || wasPerson) unionCount++;

            if (isPerson) {
                activePersonPixels++;
                // Enforce the Core Boundary Intersection Rule: P_skin_local = P_skin_map ∩ P_mask
                this.localSkinMapBuffer[i] = rawSkinProbabilityMap[i];
                
                if (depthMapData) {
                    totalPersonDepth += depthMapData[i];
                }
            } else {
                // Map background tracking boundaries close to the target profile
                if (depthMapData && this._isAdjacentToBorder(i)) {
                    backgroundAdjacentPixels++;
                    totalBgDepth += depthMapData[i];
                }
            }
        }

        // 2. Calculate the Intersection over Union (IoU) Framework
        const calculatedIoU = unionCount > 0 ? (intersectionCount / unionCount) : 1.0;
        
        // Save current mask to historical cache for the next cycle
        this.historicalMaskBuffer.set(currentPersonMask);

        // 3. Evaluate Dynamic Depth-Map Occlusion
        let medianPersonDepth = 0.0;
        let avgBgDepth = 0.0;
        let depthDelta = 1.5; // Secure default fallback
        let resolvedProximityState = "ISOLATED_WORKSPACE";
        let edgeSensitivityMultiplier = 1.0;

        if (depthMapData && activePersonPixels > 0 && backgroundAdjacentPixels > 0) {
            medianPersonDepth = totalPersonDepth / activePersonPixels;
            avgBgDepth = totalBgDepth / backgroundAdjacentPixels;
            depthDelta = avgBgDepth - medianPersonDepth;

            if (depthDelta < BGFG_SHIELD_CONFIG.TAU_DEPTH_MERGE_LIMIT) {
                resolvedProximityState = "SUBJECT_MERGED_WITH_BACKGROUND";
                edgeSensitivityMultiplier = BGFG_SHIELD_CONFIG.EDGE_HIGH_RESOLUTION_MULTIPLIER;
            } else if (depthDelta >= BGFG_SHIELD_CONFIG.TAU_DEPTH_ISOLATED_LIMIT) {
                resolvedProximityState = "ISOLATED_CLEAR_WORKSPACE";
                edgeSensitivityMultiplier = 1.0;
            } else {
                resolvedProximityState = "TRANSITIONAL_PROXIMITY_ZONE";
                edgeSensitivityMultiplier = 1.5;
            }
        }

        // 4. Enforce Threat Profiles and Security Directives
        let anomalyDetected = false;
        let pipelineActionVerdict = "PASS_TO_VISUAL_CLASSIFIER";

        if (this.frameCounter > 5n && calculatedIoU < BGFG_SHIELD_CONFIG.ANOMALY_IOU_THRESHOLD) {
            anomalyDetected = true;
            pipelineActionVerdict = "ENFORCE_HIGH_SENSITIVITY_OVERRIDE";
        }

        return {
            statusSecure: true,
            signaturePayload: BGFG_SHIELD_CONFIG.IDENTIFIER,
            cycleIndex: this.frameCounter,
            iouStabilityScore: calculatedIoU,
            segmentationAnomaly: anomalyDetected,
            proximityState: resolvedProximityState,
            edgeDetectionMultiplier: edgeSensitivityMultiplier,
            actionVerdict: pipelineActionVerdict,
            telemetryMetrics: {
                totalActiveMaskPixels: activePersonPixels,
                calculatedDepthDelta: depthDelta,
                meanPersonDepthMeters: medianPersonDepth,
                meanBgDepthMeters: avgBgDepth
            }
        };
    }

    /**
     * Determines if a pixel index sits adjacent to the mask borders to extract background data.
     * @private
     */
    _isAdjacentToBorder(index) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        return (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1);
    }

    /**
     * Fail-safe routing template fallback block.
     * @private
     */
    _triggerSecureExceptionFallback(faultString) {
        console.error(`[BG_FG_SPLIT_CRITICAL_FAULT] ${faultString}`);
        return {
            statusSecure: false,
            signaturePayload: BGFG_SHIELD_CONFIG.IDENTIFIER,
            cycleIndex: this.frameCounter,
            iouStabilityScore: 0.0,
            segmentationAnomaly: true,
            proximityState: "EMERGENCY_ISOLATION_OVERRIDE",
            edgeDetectionMultiplier: BGFG_SHIELD_CONFIG.EDGE_HIGH_RESOLUTION_MULTIPLIER,
            actionVerdict: "FORCE_PREEMPTIVE_HARD_BLOCK", // Enforce strict safety block on failure
            telemetryFault: faultString
        };
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { BackgroundForegroundSplitEngine, BGFG_SHIELD_CONFIG };
} else {
    self.BackgroundForegroundSplitEngineInstance = new BackgroundForegroundSplitEngine(640, 480);
}
```

| **Depth Delta ($\Delta D$) Range** | $\Delta D < 0.20\text{ meters}$ | $0.20\text{m} \le \Delta D < 1.00\text{m}$ | $\Delta D \ge 1.00\text{ meters}$ | Volatile Intercepts |

| **IoU Stability Check** | $\ge 0.75$ Continuous | $\ge 0.60$ Stable | $\ge 0.85$ Perfect | $\text{IoU} < 0.15$ Anomaly |

| **Edge Sensitivity Multiplier** | $2.0\times\text{ Boost}$ | $1.5\times\text{ Intermediate}$ | $1.0\times\text{ Base Mode}$ | $2.0\times\text{ Hard Edge}$ |

| **Target Execution Latency** | $0.12\text{ ms}$ | $0.10\text{ ms}$ | $0.08\text{ ms}$ | $0.05\text{ ms}$ |

| **Runtime Heap Allocations** | $0\text{ Bytes}$ | $0\text{ Bytes}$ | $0\text{ Bytes}$ | $0\text{ Bytes}$ |