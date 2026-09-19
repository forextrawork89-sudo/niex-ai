# Apparel Coverage Intelligence Framework

This document is the authoritative apparel coverage knowledge base for the clothing subsystem. It defines how apparel coverage is identified, how visible body coverage differs from clothing appearance alone, and how garment type, body regions, layering, fabric behavior, occlusion, and scene context contribute to explainable apparel coverage reasoning.

## 1. Scope and Purpose

The Apparel Coverage Intelligence Framework is designed for research-grade conceptual understanding of apparel coverage in visual media. It rejects simple pixel ratio scoring and segmentation overlap thresholds, emphasizing evidence accumulation across garment semantics, body anatomy, textile behavior, motion, and environmental context.
The framework treats coverage as an inference problem requiring layered reasoning about garment structure, body contact, coverage continuity, occlusion, and policy context.

## 2. Core Definitions

- Apparel coverage: the degree to which clothing, protective layers, or accessories obscure or occupy body regions in the visible scene.
- Visible body coverage: the actual relationship between body regions and clothing boundaries as perceived in the image, independent of garment style or color.
- Garment appearance: observable clothing features such as texture, silhouette, seam patterns, and material without direct inference about underlying body coverage.
- Coverage region: a defined anatomical area such as head, neck, chest, abdomen, hips, arms, legs, hands, or feet used to localize coverage reasoning.
- Coverage continuity: the consistency and completeness of coverage across adjacent regions and over time.
- Semantic coverage inference: reasoning about whether clothing genuinely covers body regions based on garment type, fit, layering, and pose rather than raw overlap metrics.

## 3. Apparel Coverage Reasoning Pipeline

The coverage reasoning pipeline is organized into seven stages: Body Anatomy, Garment Presence, Coverage Regions, Coverage Continuity, Coverage Interpretation, Scene Context, and Policy. Evidence is accumulated and refined at each stage.

### 3.1 Body Anatomy

Body Anatomy establishes the anatomical reference frame for coverage reasoning. It identifies body landmarks, limb segments, torso zones, and joint regions. Anatomical modeling specifies how garments should overlay or reveal each region under normal posture and motion.

### 3.2 Garment Presence

Garment Presence detects and classifies visible apparel items. It distinguishes full body garments, upper body garments, lower body garments, athletic apparel, protective apparel, and cultural apparel. This stage identifies garment boundaries, closures, layers, and structural properties.

### 3.3 Coverage Regions

Coverage Regions maps garment presence onto specific anatomical areas. It determines which regions are directly covered, partially covered, visually occluded, or exposed. This stage produces region-level coverage hypotheses for subsequent continuity analysis.

### 3.4 Coverage Continuity

Coverage Continuity evaluates whether coverage is consistent across adjacent regions and through temporal frames. It checks for gaps, seams, overlays, and transitions that may indicate incomplete coverage or accidental exposure. Continuity analysis distinguishes stable coverage from discontinuous or transient coverage.

### 3.5 Coverage Interpretation

Coverage Interpretation synthesizes anatomy, garment presence, region mapping, and continuity into a final understanding of apparel coverage. It identifies whether apparent exposure results from transparent fabrics, clothing edges, layered items, or true body visibility.

### 3.6 Scene Context

Scene Context evaluates environmental, social, and activity cues that influence coverage interpretation. It uses location semantics, object co-occurrence, group behavior, and event type to calibrate coverage expectations and avoid misclassifying intentional fashion choices or cultural dress.

### 3.7 Policy

Policy uses coverage interpretation to determine safety, compliance, and moderation actions. It maps coverage outcomes to specific policies, regulatory frameworks, and scenario-specific thresholds. Policy decisions incorporate confidence, uncertainty, and contextual evidence.

## 4. Apparel Coverage Foundations

This chapter covers the foundations of apparel coverage reasoning, including apparel perception, garment semantics, body coverage science, clothing taxonomy, apparel psychology, human appearance understanding, clothing interpretation, and coverage reasoning.

### 4.1 Apparel Perception

Apparel perception is the process of visually recognizing clothing, textile details, garment boundaries, and coverage patterns. It includes recognition of fabric texture, color consistency, edge definition, layer separation, and contact with the body. Apparel perception distinguishes clothing from skin, background, and objects through semantic cues.

### 4.2 Garment Semantics

Garment semantics refers to the meaning and function of apparel items. It describes why a garment is worn, what coverage it intends to provide, and how its features imply coverage behavior. Semantic understanding helps determine whether a garment is a covering layer, a decorative overlay, a protective suit, or a fashion statement.

### 4.3 Body Coverage Science

Body coverage science studies the relationship between body regions and clothing. It includes how garments conform to body shape, how they cover anatomical zones, and how they interact with posture and movement. Coverage science defines region-specific coverage expectations for each garment type.

### 4.4 Clothing Taxonomy

Clothing taxonomy organizes apparel into categories based on body coverage, function, material, and cultural role. It supports evidence-based coverage reasoning by providing garment-specific hypotheses about which body regions should be covered and how coverage should behave.

### 4.5 Apparel Psychology

Apparel psychology examines the expressive and cultural meanings of clothing. It includes how garments signal modesty, identity, profession, status, or intent. Psychological understanding helps distinguish intentional style decisions from accidental exposure by incorporating social and cultural context.

### 4.6 Human Appearance Understanding

Human appearance understanding integrates body shape, exposure, posture, and clothing to form a coherent visual interpretation. It differentiates between appearance artifacts such as shadowing or color matches and real coverage changes. This process is essential for accurate coverage inference in visually complex scenes.

### 4.7 Coverage Reasoning

Coverage reasoning is the structured inference that combines garment evidence, anatomical mapping, temporal cues, and scene semantics. It focuses on whether visible clothing behavior corresponds to genuine coverage of body regions and whether apparent exposure is accidental, intentional, or ambiguous.

## 5. Complete Apparel Coverage Ontology

This chapter defines a complete apparel coverage ontology, including garment categories, observable evidence, body coverage characteristics, expected body regions, interaction with body shape, ambiguity sources, and downstream interpretation.

### 5.1 Full Body Garments

Full body garments cover a large portion of the body and therefore play a central role in coverage reasoning. They may also conceal underlying regions and create layered coverage ambiguities.

### Dresses

Observable evidence:

- continuous torso and skirt silhouette, waist seam, hemline
- visible darts, overlays, straps, sleeves, collar details
- fabric folds and drape across the chest, waist, and hips

Body coverage characteristics:

- full chest coverage, waist shaping, hip coverage, often upper arms or shoulders
- continuous skirt coverage of thighs and knees depending on length
- possible partial back exposure if the dress has an open back or cutouts

Expected body regions:

- head, neck, shoulders, chest, abdomen, waist, hips, thighs, knees
- optional arms and upper back when sleeves or straps are present

Interaction with body shape:

- covers body curvature with drape that can hide underlying limb boundaries
- interacts with bust and waist shape through shaping panels or stretch fabric
- longer hems may conceal hips and upper thighs while shorter hems expose them

Ambiguity sources:

- open-back or low neckline designs that resemble exposure
- sheer overlay fabrics that obscure true coverage levels
- folded skirts or pleats that create shadowed gaps along the body

Downstream interpretation:

- Interpret dress coverage by combining skirt length, bodice structure, and neckline behavior. Verify coverage with waistline continuity and whether cutouts coincide with the intended design rather than displacement.

### Robes

Observable evidence:

- loose wrap-style front, belt or tie closure, broad sleeves
- thick fabric, lapels, collar fall, open-front overlaps
- visible inner layer or under-garment boundaries in the front overlap

Body coverage characteristics:

- torso and waist coverage through a wrapped front panel
- hip and thigh coverage based on length
- shoulder and upper arm coverage through sleeves

Expected body regions:

- head, neck, shoulders, chest, abdomen, waist, hips, thighs, knees
- hands and forearms if sleeves are long; partial ankle coverage if hem is long

Interaction with body shape:

- wrap closure interacts with body shape by tightening at the waist when belted
- loose robe panels may hang away from the body, creating spatial coverage that differs from surface contact
- belted robe lines are a strong signal of secure coverage, while open overlaps are more ambiguous

Ambiguity sources:

- loose front overlap resembles a gap even when the robe is closed
- inner garment visibility may look like exposure when the robe fabric is thin
- belt position shifts can mimic accidental slide or deliberate styling

Downstream interpretation:

- Interpret robe coverage by assessing the integrity of the wrap closure, whether the belt is engaged, and whether the outer panel stays aligned with the torso during motion.

### Gowns

- structured bodice, floor-length skirt, ornate trim, strap or sleeve details
- high waistline, defined neckline, train or flare elements
- apparent rigidity or soft drape depending on fabric choice

- extended torso and hip coverage, often full leg coverage
- chest coverage with varying neckline depth, shoulder coverage with sleeve options
- possible decorative back or side cutouts that create intentional coverage discontinuities

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees
- ankles and feet depending on gown length and floor contact

- body shape interacts with gowns through bodice fit and waist shaping, with the skirt distributing volume around the hips
- heavy fabrics may hold shape away from the body, while lighter fabrics cling to curves
- structured gowns often provide more predictable coverage than very loose designs

- long skirt trains may hide whether the lower legs are exposed
- low necklines or side slits can appear as accidental exposure if not interpreted with garment structure
- ornamental sheer panels may camouflage actual coverage levels

- Interpret gown coverage by locating the bodice seams, verifying that slits and cutouts are deliberate, and ensuring skirt length is consistent with a formal coverage intent.

### Abayas

- loose silhouettes, full head-to-ankle coverage, open front or over-garment styles
- decorative embroidery, cuff detail, collar shapes, wide sleeves
- outer fabric often opaque and uniform in color

- full torso and limb coverage, often including the head and neck when paired with hijab or shayla
- loose drape around shoulders and arms with continuous length to the ankles
- minimal body contour visibility due to the flowing fabric

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles, feet
- arms and hands when sleeves are wide but still cover most of the limb

- body shape has limited direct effect on the outer silhouette, but garment volume should remain consistent across the body
- loose abayas rely on long edges and sleeve width rather than tight fit for coverage
- underlayer or accessory evidence such as head coverings is essential for full coverage interpretation

- dark, solid colors can obscure whether an abaya is open or closed
- layered undergarments may create misleading shape outlines beneath the fabric
- wind or motion can make the loose fabric appear more revealing than it is

- Interpret abaya coverage by verifying front closure alignment, sleeve completeness, and the presence of accompanying head and neck coverings when cultural context indicates full coverage intent.

### Jumpsuits

- single-piece construction, connected top and bottom, zipper or button front closure
- waist seam or elastic, pant legs, shoulder straps or sleeves
- continuous garment lines from torso to legs

- chest and abdomen coverage with a connected lower body section
- hip and thigh coverage with continuity at the waist
- shoulder and upper back coverage if sleeves or straps are present

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles
- hands and feet if sleeves or pant leg length vary

- body shape interacts with jumpsuits through waist fit and leg length, where a tight waist can indicate stable coverage but a loose crotch or leg panel can produce gaps
- stretch jumpsuits may cling to body curves and create ambiguity between fabric and skin
- solid jumpsuits provide easier coverage interpretation than layered or sheer versions

- zippers, buttoned fronts, and waist cinches can be partially open, creating misleading exposure patterns
- seams along the torso and legs may be mistaken for body contours
- pant legs that ride up during movement can reveal more leg than expected

- Interpret jumpsuit coverage by checking the integrity of the torso connection, the closure state at the waist and chest, and how the leg panels follow the wearer’s movement.

### Overalls

- bib front, shoulder straps, side buttons, pant legs
- apron-like upper panel, adjustable straps, utilitarian pockets
- distinct separation between the bib and the lower pants section

- upper torso coverage through the bib, waist and hips coverage through the pant section
- shoulder coverage from straps, often leaving the arms exposed
- possible partial back coverage depending on strap crossing

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles
- arms and hands remain covered by a separate top if worn under the overalls

- overalls interact with body shape by the bib height and waist fit, which can create gaps around the waist and sides if the garment is loose
- strap tension is a key signal for coverage stability, especially during bending or lifting
- overalls worn over other garments require evidence from the underlying top to determine full coverage

- open side buttons or slack straps can make overalls appear to slip
- the bib panel may flatten or fold, concealing whether the chest is truly covered
- the lower pant legs may ride up or gather, altering perceived lower body coverage

- Interpret overall coverage by verifying that the bib is properly aligned, the straps maintain tension, and the underlying top provides the necessary chest and arm coverage.

### 5.2 Upper Body Garments

Upper body garments cover the torso and arms. They are critical for estimating chest, back, shoulder, and arm coverage, and they often participate in layering with jackets, sweaters, and uniforms.

### Shirts

- collars, button plackets, pockets, sleeve cuffs, hemline
- visible seam lines at shoulders and side panels, fabric weave patterns
- buttons or snaps that indicate closure state

- torso coverage across the chest, abdomen, and upper back
- shoulder coverage to the sleeve seam and possibly the upper arm
- partial neck coverage depending on collar style

- head, neck, shoulders, chest, abdomen, back, waist, arms, elbows, forearms, hands depending on sleeve length
- hands may be covered if long sleeves extend to the wrists

- shirt fit interacts with body shape through shoulder width, bust or chest fullness, and torso length
- tailored shirts follow body contours more closely, reducing coverage ambiguity
- loose shirts may create airflow pockets that look like gaps but are not actual exposure

- open buttons or pulled collars can resemble accidental exposure
- sheer or mesh shirt fabrics may let skin tones influence coverage estimates
- tucked or untucked hems may change coverage appearance on the abdomen and hips

- Interpret shirt coverage by confirming closure status, collar fit, and how the fabric lies over the chest and shoulders. Shirt coverage should be evaluated together with any underlying garments or outer layers.

### Jackets

- lapels, zippers, buttons, pockets, collars, shoulder pads
- visible lining, cuff details, and vent openings
- material thickness and panel structure

- upper body coverage across shoulders, chest, upper back, and torso depending on length
- arm coverage through sleeves, often extending to wrists
- possible partial waist and hip coverage for longer jacket styles

- head, neck, shoulders, chest, back, arms, elbows, forearms, hands depending on sleeve length, waist, hips
- coverage of the torso is often supplemental to an underlying shirt or top

- jacket fit interacts with body shape through shoulder width, chest depth, and sleeve length
- structured jackets may maintain coverage even during motion, while soft jackets can move independently
- the presence of a separate top under the jacket means coverage interpretation must include both layers

- partially open jackets can exhibit visible skin without actual exposure if the underlying garments still cover the torso
- wind can inflate or move jacket panels, making coverage appear inconsistent
- sleeve roll-up or push-up may show more forearm while still maintaining coverage intent

- Interpret jacket coverage by checking closure state, lapel overlap, and underlying garment continuity. Outer jacket motion should be evaluated against the inner layer to avoid overestimating exposure.

### Sweaters

- knitted texture, ribbing, neckline, cuffs, waist hems
- visible stitch patterns, cable details, or dropped shoulder seams
- thick or thin fabric appearance indicating stretch behavior

- torso coverage over the chest, back, and abdomen
- arm coverage through sleeves that may be full-length or three-quarter
- neck coverage depending on neckline style

- head, neck, shoulders, chest, back, waist, arms, elbows, forearms, hands if long sleeves
- hips when the sweater extends below the waist

- sweater fit interacts with body shape by conforming to curves or hanging loosely
- tight knit sweaters may reveal body contours that influence coverage perception
- oversized sweaters may hide whether the torso is truly covered due to volume

- transparent knitted sweaters can reveal skin without indicating loss of coverage
- slouchy hems may shift during sitting and look like displacement
- neckline stretch can create an exposure-like opening when it is actually part of the sweater design

- Interpret sweater coverage by examining the mesh density, neckline shape, and whether the fabric maintains consistent coverage over the chest and abdomen during movement.

### Hoodies

- hood, drawstrings, kangaroo pockets, ribbed cuffs and hem, front zipper or pullover construction
- visible hood seam, pocket outlines, and branded graphics or panels

- upper body coverage including chest, back, shoulders, and arms
- neck coverage when the hood is worn over the head or left down
- waist coverage from the hemline to the lower torso

- head, neck, shoulders, chest, back, arms, elbows, forearms, hands if long sleeves, waist, hips
- coverage is often paired with an underlying top such as a T-shirt

- hoodies interact with body shape through their relaxed fit and elastic cuffs
- drawstring tension indicates how much the hood or neckline is secured
- the bulky silhouette can conceal underlying garments and obscure exact coverage boundaries

- pockets and hood drawstrings can create visual distractions that resemble exposure
- pullover hoodies may ride up when lifting the arms, without actual chest exposure
- zippered hoodies may be partially open intentionally while still providing coverage

- Interpret hoodie coverage by assessing whether the chest and torso remain covered under the outer layer and whether the hood or neckline adjustments explain any apparent gaps.

### Coats

- outer shell, lapels, buttons, zippers, collars, pockets, shoulder structure
- visible lining, double-breasted overlap, belt loops, hem length

- head and neck coverage through collars or hoods when present
- full torso, upper back, and often hips coverage depending on coat length
- arm coverage through sleeves with varied cuff detail

- head, neck, shoulders, chest, abdomen, back,waist, hips, thighs, knees depending on length, arms, elbows, forearms, hands
- coats are typically worn over other garments, requiring layered coverage interpretation

- coat fit interacts with body shape through shoulder width, chest volume, and length
- structured coats may preserve coverage under wind or motion, while unstructured coats may move independently
- a well-fitted coat provides reliable visual coverage even when inner garments are uncertain

- open coat fronts can expose inner layers while maintaining mandatory coverage
- flared hems can appear lifted by motion though the coat still covers the legs
- overcoat weight and length may obscure the true position of the underlying garment boundaries

- Interpret coat coverage by verifying closure state and whether the coat remains aligned to the body. Outer layer motion should be understood within the broader layering context.

### Blazers

- tailored structure, lapels, buttons, pockets, shoulder seams, fabric sheen
- vent details, collar shape, inner lining contrast

- torso coverage across the chest, waist, and upper back
- arm coverage through sleeves that usually extend to the wrist
- possible partial hip coverage depending on length

- head, neck, shoulders, chest, abdomen, back, arms, elbows, forearms, hands, waist, hips
- blazer coverage often supplements an inner blouse or shirt

- blazer fit interacts with body shape through shoulder width, bust or chest fit, and waist tapering
- structured tailoring makes coverage reasoning more predictable than unstretched fabrics
- tight or cropped blazers can produce partial exposure above the waist if the underlying layer is short

- open-front blazers may expose significant inner coverage without being intentionally revealing
- blazer sleeve roll can change apparent arm coverage without changing actual skin exposure
- lapel positioning can hide or reveal a shirt collar, affecting coverage interpretation

- Interpret blazer coverage by checking the overlap of the front panels, collar behavior, and the completeness of sleeve coverage. Verify that the garment remains a legitimate outer layer rather than a decorative accessory.

### Uniforms

- consistent colors, insignia, badges, belts, structured collars, and matched top and bottom components
- specific workplace or institution design elements such as stripes, epaulettes, or patches

- coverage characteristics vary widely based on uniform type but generally include reliable torso and lower body coverage
- protective uniforms may include additional sleeves, pants, or integrated skirts
- many uniforms intentionally cover the neck and shoulders for professional appearance

- head, neck, shoulders, chest, abdomen, back, arms, elbows, forearms, hands, waist, hips, thighs, knees, calves, ankles, feet depending on uniform type
- uniform coverage may also extend to head coverings or gloves

- uniforms interact with body shape through standardized fit, which can hide individual body contours
- some uniforms are tailored for a snug fit while others are loose for ease of movement
- uniform features such as belts, tabs, and panels provide strong signals about intended coverage

- a uniform top worn open may expose an inner shirt without meaning the wearer is improperly covered
- protective uniform layers can create volume that resembles displacement when moving
- partial removal of a uniform jacket or outer shell can look like exposure depending on the underlying garments

- Interpret uniform coverage by recognizing the uniform type and understanding whether visible deviations from standard fit correspond to intentional layering or actual coverage loss.

### 5.3 Lower Body Garments

Lower body garments cover pelvis, hip, thigh, knee, calf, ankle, and foot regions. They are essential for reasoning about leg coverage, waistline stability, and the interaction between upper and lower layers.

### Trousers

- waistband, front closure or waistband hook, side pockets, creases, hem
- visible belt loops or pleats, seam lines along legs

- hip and waist coverage with a continuous presentation through the upper leg
- thigh and knee coverage depending on leg width and length
- possible ankle coverage for full-length styles

- waist, hips, thighs, knees, calves, ankles, feet depending on length
- abdomen and lower back covered by the waistband region

- trouser fit interacts with body shape through waist size, hip fullness, and leg length
- tailored trousers maintain a predictable coverage line, while relaxed trousers may shift more during motion
- high-waisted trousers interact with torso coverage by overlapping tops

- belts and waistbands can be misaligned, producing a false impression of slippage
- crease lines or pockets can create binding shadows that resemble uncovered gaps
- trousers that fit loosely at the waist may move without actual exposure if a top remains tucked in

- Interpret trouser coverage by observing the continuity of the waistline, the alignment of the front closure, and whether the fabric maintains coverage over the hip and thigh regions during movements like sitting or bending.

### Jeans

- denim texture, waistband, fly, belt loops, rivets, pocket outlines, hem
- visible stitching, back yoke, and thigh seams

- hip and waist coverage with typically firm fabric hold
- thigh and knee coverage with less stretch than active fabrics
- possible lower leg coverage depending on length

- waist, hips, thighs, knees, calves, ankles, feet depending on length
- abdomen and lower back covered by the waistband and front rise

- jeans interact with body shape through rigid denim panels and seam shaping
- tight jeans may reveal body contours but still provide coverage
- loose or distressed jeans may create intentional holes or gaps that require semantic interpretation

- button fly or zipper gaps can look like exposure if partially open
- distressed jeans with holes may expose skin without actual coverage loss across the underlying body region
- waistband roll on sitting may resemble sagging while still covering the body

- Interpret jeans coverage by verifying closure integrity, the presence of underlying layers in distressed regions, and how the denim panels ride with the wearer’s hips and thighs.

### Skirts

- waistband, hemline, pleats, panels, flare or pencil shape
- visible lining, pockets, and texture variation

- hip and waist coverage, varying thigh and knee coverage based on length
- possible partial lower leg coverage for midi or maxi skirts
- often leaves legs and ankles more visible than pants

- abdomen coverage through the waistband and upper skirt section

- skirt fit interacts with body shape through waist size, hip curvature, and hem flare
- flowing skirts move independently of body motion more than fitted pants
- tight pencil skirts constrain leg motion and exhibit different coverage behavior

- skirt lift due to wind or motion can appear as exposing the thighs without actual loss of torso coverage
- skirts with side slits may reveal legs intentionally rather than through displacement
- skater skirts may ride higher when the wearer spins or jumps

- Interpret skirt coverage by assessing hemline stability, waistband tension, and whether visible leg exposure aligns with skirt design rather than garment riding up accidentally.

### Shorts

- waistband, leg openings, side seams, pockets, fly or elastic closure
- visible stretch or loose fabric at the waist and thighs

- hip and waist coverage, upper thigh coverage with short inseam
- possible partial knee coverage for longer shorts
- often leaves lower legs and calves exposed

- abdomen coverage through waistband height and front rise

- shorts interact with body shape through waist fit and thigh clearance
- elastic or drawstring shorts may shift more than tailored shorts
- compression or athletic shorts can appear to cover more due to a tight fit

- shorts riding up during movement may expose more thigh than expected
- loose shorts can create a gap at the waistband even when underwear or an inner layer covers the body
- long shorts that ride down may appear to change coverage despite stable waist closure

- Interpret shorts coverage by verifying whether the waistband remains high enough to cover the hips and abdomen and whether any thigh exposure is consistent with the garment’s intended length.

### Leggings

- elastic waist, body-conforming stretch fabric, seam lines, waistband band
- visible contouring of the hips and thighs due to tight fit

- full leg coverage from waist to ankles or calves, depending on length
- hip and waist coverage that depends on waistband height and stretch
- often covers the abdomen tightly as part of the garment fit

- waist, hips, thighs, knees, calves, ankles, feet
- abdomen and lower back coverage through the elastic waist band

- leggings interact with body shape by clinging to curves and showing underlying muscle or joint contours
- tight fit may lead to ambiguous coverage when the fabric is translucent under certain lighting
- a high waist interacts with torso coverage if paired with a cropped top

- sheer leggings can reveal skin color without actual coverage loss
- waistband roll or slippage may expose more lower back than intended
- leggings may show lines from underwear or seams that resemble body exposure

- Interpret leggings coverage by measuring opacity, waistband stability, and whether the garment remains intact across the hip and thigh regions.

### Sweatpants

- elastic waist, drawstring tie, cuffed ankles, side pockets, soft fabric texture
- visible stitching and seam panels typical of athletic loungewear

- waist and hip coverage, full thigh and lower leg coverage depending on length
- arm coverage is not applicable, but the waistband can interact with torso coverage via shirt overlap
- loose fit may create volume that hides body contours

- waist, hips, thighs, knees, calves, ankles, feet; indirectly abdomen coverage through the waistband
- the belly region may be partially visible if the top is cropped or untucked

- sweatpants interact with body shape through waist elasticity and leg fullness
- baggy sweatpants may shift significantly during motion while still covering the lower body
- compression or slim sweatpants behave differently from loose lounge styles

- waistband slippage during sitting can look like sagging without showing actual skin
- side pockets or waistband bulk can deform the silhouette, making coverage inference harder
- cuffed ankles may roll up when walking, altering perceived leg coverage

- Interpret sweatpants coverage by checking waistband fit, leg panel continuity, and whether the garment maintains lower body coverage through motion and postural changes.

### 5.4 Athletic Apparel

Athletic apparel is designed for performance. It includes compression wear, sports uniforms, cycling clothing, swimwear, yoga clothing, and martial arts uniforms. These garments often fit tightly and move dynamically, requiring specialized coverage reasoning.

### Compression wear

- body-hugging panels, high-stretch fabric, targeted mesh zones, support bands
- visible gradient shading, seam reinforcement, and fabric compression lines

- close coverage across the chest, abdomen, hips, thighs, calves, or arms depending on the garment type
- strong body outline visibility with minimal loose fabric
- often provides support without exposing the covered regions

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles, hands depending on sleeve length
- actual coverage is continuous but may be visually confusing due to tightness

- compression wear interacts with body shape by conforming to muscle and joint contours
- the garment may accentuate body geometry, making coverage appear less complete than it is
- fabric opacity and material thickness are key signals in compression coverage interpretation

- tight compression can be mistaken for partial coverage loss because of visible anatomy
- sheer or thin compression fabrics may not fully conceal underlying skin color
- compressive seams may create appearance of gaps along the body if lighting reveals contrast lines

- Interpret compression coverage by focusing on material continuity and seam integrity rather than body contour detail. Confirm that the fabric remains attached across the relevant limb or torso region.

### Sports uniforms

- team colors, logos, numbers, mesh ventilation, coordinated top and bottom pieces
- shoulder stripes, waistband bands, and fabric panels specific to the sport

- sport-specific torso, arm, and leg coverage designed for activity
- coverage may vary by uniform type, such as sleeveless basketball jerseys or full-sleeve cycling kits
- uniforms often include built-in support or protective padding

- head, neck, shoulders, chest, abdomen, back, arms, elbows, forearms, hands, waist, hips, thighs, knees, calves, ankles, feet depending on sport
- certain sports uniforms include helmets, shin guards, or other coverage elements

- sports uniform coverage interacts with body shape through athletic fit and mobility requirements
- tight jerseys and shorts behave differently from loose training kits
- multi-piece uniforms require combined reasoning across all visible layers

- mesh ventilation panels can expose skin while the garment remains intentionally intact
- uniform skirts or shorts may ride up during motion without indicating loss of coverage
- a partially open jacket worn over a uniform should not be treated as coverage loss if the inner uniform provides sufficient coverage

- Interpret sports uniform coverage by identifying the sport-specific garment type and understanding how its design supports both motion and coverage. Evaluate exposure in the context of competition or training activity.

### Cycling clothing

- aerodynamic fabrics, padded shorts, bib straps, tight jersey panels, reflective trim
- visible seam lines, pocket flaps, and integrated support zones

- precise coverage across the torso, hips, thighs, and legs with a low profile
- coverage is designed to remain stable under high-speed motion and wind
- bib or shorts elements often overlap to cover the lower back and abdomen

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles, feet depending on length
- arms and forearms may be covered by long sleeves, and gloves may cover hands

- cycling clothing interacts with body shape through muscular leg definition and aerodynamic posture
- tight fit reduces ambiguity in coverage but increases importance of fabric opacity and seam integrity
- bib straps and waistband behavior provide strong signals about lower torso coverage

- tight cycling shorts may appear to reveal contours that resemble exposure
- bib straps can shift when entering or exiting a bicycle, creating temporary coverage changes
- ventilation mesh and form-fitting jerseys can make underlying skin tone visible without actual coverage loss

- Interpret cycling coverage by checking that the bib and jersey remain in place and that any visible body contour is due to tight fit rather than conveyor gaps.

### Swimwear

- two-piece or one-piece shapes, straps, elastic edges, mesh panels, and water-saturated fabric appearance
- distinctive swimwear patterns, reflective wet surfaces, and beach or poolside context

- coverage varies greatly by style, from full one-piece torso coverage to minimal two-piece swimwear
- water interaction changes fabric opacity and may alter coverage appearance
- elastic edges and ties provide clues about stability and fit

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, feet depending on design and coverage
- swimwear may intentionally expose shoulders, arms, legs, or midriff

- swimwear interacts with body shape through wet fabric clinging, buoyancy, and surface tension
- water can make coverage appear more transparent than in dry conditions
- split two-piece designs require separate top and bottom coverage reasoning

- water-saturated fabrics may delineate body shape closely while still covering the skin
- swimwear straps can slip from shoulders during motion or waves
- backless or high-cut styles are intentionally revealing and should not be mistaken for accidental exposure if consistent with context

- Interpret swimwear coverage by considering both the dry and wet appearances. Confirm that exposed regions match design intent and that any water-driven shift is consistent with pool or beach activity.

### Yoga clothing

- breathable stretch fabrics, high waistbands, crop tops, fitted leggings, seamless panels
- visible compressive texture, sweat-wicking material, and ergonomic seams

- core coverage for the chest and abdomen with leg coverage that supports range of motion
- tight-fitting coverage that may accentuate body lines
- sleeveless or long-sleeve options depending on the activity

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles, feet depending on length and sleeve style
- hands may be covered by gloves only in certain practice types

- yoga clothing interacts with body shape through flexible panels that follow joint positions
- the fit may be intentionally snug to prevent fabric movement during stretching
- folded or bunched fabric is less common in yoga clothing, making coverage inference simpler if the fabric remains consistent

- tight yoga tops may appear to expose the torso when the wearer bends back or stretches forward
- leggings can show high-contrast body lines under certain lighting, creating ambiguity
- long torso coverage with crop tops may create partial midriff exposure that is intentional rather than accidental

- Interpret yoga clothing coverage by identifying the garment’s design features and whether movement-induced shape changes are normal for the practice.

### Martial arts uniforms

- gi jackets, belts, pants, reinforced collars, sleeve cuffs, and folded lapels
- visible stiffness in the fabric, belt knots, and uniform color or crest

- upper body coverage through a gi jacket or dobok top, lower body coverage through loose-fitting pants
- wide sleeves and pant legs that allow motion while maintaining coverage
- belt area coverage around waist and hips

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles, feet, arms, elbows, forearms, hands
- certain martial arts uniforms may include head coverings or protective gear

- martial arts uniforms interact with body shape through loose fit for kicking and throwing motions
- the uniform’s open lapel and belt closure are key coverage signals
- overlapping panels of the gi jacket provide coverage continuity even when the wearer moves dynamically

- gi jackets may open during sparring, revealing the inner torso while still being a valid uniform configuration
- pants may ride up during a kick without meaning the lower leg is uncovered beyond the garment length
- belt untied or loose lapels can resemble accidental dislodgement but may also be part of the training state

- Interpret martial arts uniform coverage by examining the overlap of the jacket panels, the belt tightness, and whether the loose pants remain aligned through movement.

### 5.5 Protective Apparel

Protective apparel is designed to cover and shield the body. It includes laboratory coats, medical gowns, firefighter suits, police uniforms, military clothing, and industrial PPE. These garments have strict coverage expectations and often require additional scrutiny if any region appears exposed.

### Laboratory coats

- white coat fabric, front buttons or snaps, collar, cuffs, pockets
- knee-length or mid-thigh length with straight hem
- visible laboratory identification or badge area

- torso coverage from shoulders to thighs, sleeves covering arms to wrists, back coverage, and waistline integrity
- often worn over other garments, so coverage includes the combined layers

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, lower legs if the coat is long, arms, elbows, forearms, hands
- the underlying clothing may also contribute to coverage of the chest and abdomen

- laboratory coats interact with body shape through a looser, protective fit that allows movement while covering critical regions
- the button closure and collar provide strong signals for coverage continuity
- the coat’s outer shape may be more informative than the underlying garment silhouette

- open front lab coats can reveal the inner clothing while still providing protective function
- sleeves rolled up for practical reasons may expose forearms without implying inadequate coverage of the torso
- transparent plastic or protective sleeves may appear less opaque and create coverage ambiguity

- Interpret laboratory coat coverage by checking whether the coat remains properly closed and whether the inner garments provide supplementary coverage when the outer coat is partially open.

### Medical gowns

- disposable or reusable gown material, thumb loops, tie straps, back opening, sleeve coverage, neck closure
- colored or patterned material indicating sterile or isolation use

- full front torso coverage, back coverage, upper arm coverage, and often knee-length protection
- seams or ties at the back are essential coverage signals

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, arms, elbows, forearms, hands
- neckline and back closure status are key to distinguishing proper coverage from a loose gown state

- medical gown coverage interacts with body shape minimally since the gown is typically oversized for protection
- the neckline and tie positions are more important than exact fabric contouring
- gowns are designed to cover regardless of underlying clothing, making the outer layer the primary evidence source

- back ties untied or loose can make a gown appear open even when the front remains intact
- thin gown materials may show underlying clothing or skin without losing coverage function
- long sleeves may bunch or ride up during activity, altering apparent arm coverage

- Interpret medical gown coverage by verifying tie integrity, front overlap, and whether the gown still covers essential torso and limb regions despite motion or proximity to other objects.

### Firefighter suits

- insulated layers, reflective tape, helmet attachments, reinforced knees, gloves, boots
- thick fabric, sealed closures, flap covers, and hooded collars

- comprehensive coverage of the body including torso, arms, legs, head or neck when hooded, and often hands and feet through integrated gloves and boots
- wraps and overlapping panels support coverage continuity under extreme conditions

- head, neck, shoulders, chest, abdomen, back, waist, hips, thighs, knees, calves, ankles, feet, arms, elbows, forearms, hands
- coverage is typically complete but may depend on whether helmets or gloves are worn

- firefighter suit coverage interacts with body shape through bulky protective layers that alter the visible silhouette
- reflective tape and panel seams provide strong coverage cues
- bulkiness makes it harder to see whether the body beneath is actually exposed, so the outer layer must be treated as authoritative evidence

- partially unzipped suits may expose inner layers without real skin exposure
- helmet removal can change the apparent coverage of the head and neck

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

While loose clothing drapes naturally and hides body contours, standard computer vision models can generate false positives on flesh-toned fabrics or dynamic shadows. To prevent these errors (avoiding false positives) and ensure that no harmful content leaks through tracking boundaries (avoiding false negatives), this subsystem measures the exact pixel-level intersection over union ($IoU$) of the apparel mask (`M_apparel`) relative to the total person segmentation mask (`M_person`).

### 3.1 Scale-Invariant Apparel Mask Ratio ($R_{\text{app}}$)

Let $M_{\text{apparel}}$ be the binary pixel matrix of the detected apparel mask, and $M_{\text{person}}$ be the binary pixel matrix of the person segmentation mask.

$$R_{\text{app}} = \frac{\text{PixelCount}(M_{\text{apparel}} \cap M_{\text{person}})}{\text{PixelCount}(M_{\text{person}})} \cdot \Phi_{\text{scale}}$$

Where $\Phi_{\text{scale}}$ is the scale-invariant correction factor calculated based on the estimated physical distance ($d$):
$$\Phi_{\text{scale}} = 1.0 + \gamma \cdot \left( \frac{d}{d_{\text{max}}} \right)^2$$

The **Apparel Coverage Score ($S_{\text{cov}}$)** is normalized on device as:

$$S_{\text{cov}} = R_{\text{app}} \cdot 100 \cdot \Phi_{\text{lighting}}$$

Where:
*   $\Phi_{\text{lighting}}$ is the luminance penalty multiplier, calculated as:
    ```text
    If S_lux < 15 lux:   Phi_lighting = 0.70
    If S_lux >= 15 lux:  Phi_lighting = 1.00
    ```


### 3.2 High-Frequency Seam Edge Density ($\Lambda_{\text{seam}}$)
To distinguish flesh-toned fabrics from real skin folds, the system analyzes the density of high-frequency seam edges.

Let $L(x, y)$ be the output of the local WebGPU Laplacian edge extractor. We count the local extrema points (zero-crossings of the second derivative) along the apparel boundaries to resolve the **Seam Edge Density ($\Lambda_{\text{seam}}$)**:
$$\Lambda_{\text{seam}} = \text{Count}\left( \frac{\partial^2 Y}{\partial x^2} = 0 \cap \frac{\partial Y}{\partial x} \neq 0 \right)$$

A high value of $\Lambda_{\text{seam}}$ ($>0.65$) indicates that the analyzed region contains clothing seams, allowing the system to isolate the garment boundary.