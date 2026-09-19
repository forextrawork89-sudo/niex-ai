# Clothing Intelligence Framework

This master architecture document defines the conceptual foundations for the complete clothing subsystem. It explains how clothing is recognized, how garments contribute to human appearance understanding, how clothing interacts with body shape, pose, movement, environment and context, and how clothing supports explainable multimodal reasoning.

## 1. Scope and Purpose

The Clothing Intelligence Framework is designed as the authoritative knowledge base for apparel perception and reasoning within the clothing subsystem.
It rejects simplistic visual heuristics such as standalone color detection, clothing classification alone, or isolated morphological cues.
The framework instead builds layered understanding from garment structure, textile science, body interaction, temporal consistency, context semantics, and multimodal evidence fusion.

## 2. Foundational Principles

1. Clothing is a system of visual, material, functional, and social signals that must be interpreted holistically.
2. Garment recognition requires integration of appearance, structure, motion, and context rather than independent feature detection.
3. Human appearance understanding is inseparable from clothing evidence and is defined by the interplay of body shape, clothing, and activity.
4. Coverage and exposure conclusions depend on garment intent, fit, and situational meaning, not only on visible skin or fabric area.
5. Explainability is mandatory: every clothing inference must contain garment evidence, body evidence, textile evidence, contextual evidence, environmental evidence, supporting evidence, confidence, uncertainty, and final rationale.

## 3. Clothing Foundations

This chapter defines the foundational domains that underpin clothing intelligence: apparel perception, garment semantics, textile science, fashion fundamentals, functional clothing, cultural clothing, clothing psychology, clothing communication, and clothing affordances.

### 3.1 Apparel Perception

Apparel perception is the visual and semantic process that recognizes clothing items, textile appearances, garment boundaries, and coverage relationships. It combines image evidence, spatial structure, material cues, and contextual meaning to form a reliable garment hypothesis.

- Textile texture analysis for recognizing cotton, denim, leather, wool, silk, linen, polyester, nylon, spandex, and blended fabrics.
- Edge and seam semantics for identifying panels, hems, collars, sleeves, waistbands, straps, and closures.
- Color and pattern interpretation relative to typical clothing style, such as stripes on shirts, camouflage on military jackets, or florals on dresses.
- Drape and silhouette recognition to distinguish structured garments from loosely flowing apparel.

### 3.2 Garment Semantics

Garment semantics explains the function and meaning of a clothing item in the scene. It includes why the garment is worn, what body regions it is intended to cover, and how its visible features signal that intent.

- A lab coat semantically communicates protective coverage in a clinical setting.
- A swimsuit semantically communicates water activity and partial body exposure.
- A trench coat semantically communicates outerwear for weather protection.
- A formal dress semantically communicates occasion-based attire with expected coverage patterns.

### 3.3 Textile Science

Textile science describes the physical properties of fabric and how those properties influence clothing appearance, behavior, fit, and coverage. It includes fiber composition, weave structure, mechanical response, moisture interaction, and thermal characteristic.

- Cotton tends to drape softly, absorb moisture, and present matte texture.
- Denim is rigid, structured, and shows distinct seam lines and rivet details.
- Leather appears smooth or textured with stiffness, reflecting light differently than woven fabrics.
- Wool has loft, visible fibers, and can create fuzzy or bulky silhouettes.
- Silk shines, drapes fluidly, and reveals fold lines with subtle sheen.
- Linen has a noticeable weave and creases easily, producing visible wrinkles.
- Polyester can appear uniform, slightly shiny, and resistant to wrinkles.
- Nylon is smooth, lightweight, and often used in synthetic athletic garments.
- Spandex introduces stretch and body conformity, producing tight yet flexible coverage.
- Blended fabrics combine multiple fiber properties, requiring mixed evidence interpretation.

### 3.4 Fashion Fundamentals

Fashion fundamentals describe how garments are designed, styled, and categorized. They include silhouette, proportion, texture, trend, and the relationships between garment components.

- Silhouette analysis separates fitted garments, A-line shapes, pencil profiles, and oversized forms.
- Proportion reasoning evaluates how garment length, sleeve style, and waist placement affect visual coverage.
- Texture and print interpretation compares smooth, patterned, and layered surfaces.
- Trend awareness recognizes common aesthetic choices such as crop tops, athleisure, and vintage-inspired looks.

### 3.5 Functional Clothing

Functional clothing emphasizes garment purpose beyond appearance. Examples include protection, insulation, visibility, athletic performance, or occupational utility. Functional intent is a crucial signal for coverage expectations and context.

- Raincoats are designed to keep the body dry in wet weather.
- Work uniforms are designed to provide durability and standard coverage.
- Sportswear is designed to enable motion while providing appropriate support and coverage.
- Protective apparel is designed to shield the body from physical, chemical, or thermal hazards.

### 3.6 Cultural Clothing

Cultural clothing captures garments that express regional, religious, or traditional identity. These items have specific coverage norms that differ from mainstream fashion and should be interpreted within their cultural frame.

- Traditional dress such as kimonos, saris, dashikis, and kaftans has culturally specific coverage patterns.
- Religious garments such as hijabs, abayas, yarmulkes, and cassocks convey modest coverage requirements.
- Ceremonial clothing such as academic regalia, wedding attire, and honor uniforms signal event-specific coverage.
- Regional apparel like kilts, ponchos, and regional folk costume communicates geographic style and local coverage customs.

### 3.7 Clothing Psychology

Clothing psychology studies how apparel affects perception and identity. It explains why certain garments influence judgments about professionalism, elegance, athleticism, or authority, and how coverage expectation is shaped by those perceptions.

- A well-tailored suit communicates authority and structured coverage.
- Loose lounge wear communicates relaxation and may lower coverage expectations.
- Athletic clothing communicates intent to move and may support functional partial exposure such as sports bras or shorts.
- Protective apparel communicates safety and higher coverage requirements.

### 3.8 Clothing Communication

Clothing communication refers to how garments convey messages. It includes branding, profession, cultural identity, mood, and function. This chapter shows how clothing evidence is used to interpret scene semantics and decisions beyond coverage alone.

- A uniform communicates role and often implies standardized coverage rules.
- A ceremonial sash communicates ritual significance and can modify expected coverage.
- A hospital gown communicates clinical context and typically indicates layered coverage expectations.
- A rain poncho communicates weather adaptation rather than fashion exposure.

### 3.9 Clothing Affordances

Clothing affordances describe the actions a garment enables, constrains, or suggests. This includes mobility, concealment, protection, warmth, and display. Affordances are key to understanding why a garment is present and how it should behave.

- A sports bra affords support and high-mobility movement.
- A coat affords insulation and wind protection.
- A backpack affords load carrying on the shoulders while influencing upper body appearance.
- A helmet affords head protection and defines safety coverage in an environment.

## 4. Complete Clothing Ontology

This chapter constructs the comprehensive clothing ontology across upper body, lower body, full body, undergarments, outerwear, footwear, headwear, and accessories. Every category includes observable evidence, garment structure, functional purpose, contextual meaning, ambiguity sources, and downstream interpretation.

### 4.1 Upper Body Ontology

#### T-shirts

Observable evidence:

- soft torso fabric, crew neck or V-neck, short sleeves, straight hem
- graphic or plain front panel
- lightweight knit texture

Garment structure:

- single-piece torso panel, set-in sleeves, ribbed neckline
- minimal closures, pullover design
- hemmed sleeve edges and waistline

Functional purpose:

- casual torso coverage
- breathable comfort and easy mobility
- basic layering piece or standalone top

Contextual meaning:

- informal everyday wear
- youthful casual context
- often a base layer under jackets or sweaters

Ambiguity sources:

- skin-toned prints or light fabric may blend with skin under bright lighting
- loose fit may billow and create apparent gaps
- graphic details may distract from garment boundaries

Downstream interpretation:

- T-shirt coverage should be validated by neckline and sleeve continuity rather than body color alone
- interpret loose T-shirt movement as normal apparel dynamics, not coverage loss
- confirm torso coverage even during bending or arm lifting by checking seam and hem alignment

#### Polo shirts

Observable evidence:

- collared neckline, partial button placket, ribbed cuffs, slightly structured shoulders
- soft knit texture with small collar stand

Garment structure:

- collar panel, buttoned front placket, short sleeves with cuffs
- curved or straight hem designed to sit at the waist

Functional purpose:

- casual business or sporty upper body coverage
- moderate formality with breathable comfort
- base layer for layered outfits

Contextual meaning:

- smart casual context
- golf or tennis appearances
- office casual attire

Ambiguity sources:

- collar orientation may appear unusual when the wearer moves
- partial button opening may look like exposure if the fabric shifts
- lightweight knit can mimic body contours under strong illumination

Downstream interpretation:

- Use collar and placket evidence to verify that the polo shirt is a covering layer
- evaluate the button closure and hem position when the wearer bends forward or sits
- consider sporty context as supportive of intentional comfort without exposure

#### Shirts

- visible placket, buttons, collar, cuffs, back yoke, crisply pressed fabric
- distinct shoulder seam and length to the hip line

- tailored torso panels, front closure with buttons or snaps, collar band
- set-in or raglan sleeves, double-stitched hems

- structured coverage for torso and upper arms
- professional or formal appearance
- layering under jackets, sweaters, or uniforms

- business attire, formal events, or professional roles
- can signal authority or polished presentation
- often paired with ties, blazers, or vests

- shirt front can lift during motion and expose underlying layers
- loose or oversized shirts may create folds that resemble gaps
- semi-transparent fabrics may allow skin tones to show through without actual coverage loss

- Check button closure consistency and collar positioning to determine shirt coverage
- use sleeve and shoulder seam evidence to separate shirt coverage from over-jacket coverage
- account for the possibility of intentional layering under the shirt in formal contexts

#### Sweaters

- knit texture, ribbed cuffs and waistbands, visible stitch patterns, collar shapes
- soft bulk, cable details, dropped shoulders or fitted sleeves

- knitted body panels, ribbed neckband, cuffed sleeves, varying necklines such as crew, V-neck, or turtleneck
- pull-over or open-front constructions

- insulation and comfort for upper body
- covering layer for casual, smart casual, or cold weather use
- can act as a fashion statement or functional outer layer

- relaxed, cozy contexts
- workplace layering in cooler climates
- casual or semi-formal wear depending on knit style

- loose knits can have large stitch openings that resemble exposure without losing coverage
- drop-shoulder construction may shift during motion, altering perceived coverage
- sweaters over light shirts can create visual complexity at the neckline and hem

- Assess sweater coverage by fabric density and neckline completeness
- verify that bulky knit silhouette maintains continuous torso coverage across movement
- distinguish between sweater drape and actual garment displacement

#### Hoodies

- attached hood, kangaroo pocket, drawcords, ribbed cuffs and hem, front zipper or pullover front
- relaxed shoulder shape and visible hood seams

- hood panel, body front and back panels, ribbed hem, sleeve cuffs, optional linings

- casual upper body coverage with head protection option
- comfort and warmth for relaxed contexts
- layering piece for athletics or streetwear

- informal, athletic, or youth-oriented style
- often associated with leisure, travel, or outdoor casual wear

- hood position can change coverage expectations for the head and neck
- front zippers or drawcords may be partially open without losing main coverage
- pockets and bulky fabric can obscure hem and waistline evidence

- Use hood position and zipper state to determine whether a hoodie is functioning as an outer layer
- separate hoodie coverage from underlying shirt evidence when layered
- consider the casual context and intended warmth function in coverage judgments

#### Jackets

- lapels, collars, pockets, zippers, buttons, sleeve details, structured shoulders
- visible lining edge, vent openings, and layered panels

- front closure, collar and lapel system, shoulder seam, sleeve set-in, pocket flaps or welt pockets
- varying lengths from cropped to hip-length or longer coats

- outer upper body coverage for weather, style, or function
- insulation, wind protection, or professional appearance
- layering over shirts or dresses

- outdoor wear, fashion statement, professional attire, or functional outerwear
- can indicate role depending on style such as bomber, denim, or motorcycle jacket

- open jacket fronts may hide underlying coverage or reveal a different garment
- jacket movement can create transient view changes at the chest and waist
- jacket length can vary enough to change how much lower body coverage is implied

- Assess jacket closure and inner garment continuity for coverage decisions
- use seam alignment and lapel orientation to determine if a jacket is open intentionally or accidentally
- account for outerwear function and style when evaluating coverage in different contexts

#### Coats

- longer length, heavier fabric, collars, buttons or zippers, visible insulation, belt or waist cinch
- material texture such as wool, leather, or technical shell

- outer shell panels, collar, closure system, shoulder structure, sleeves, and hemline
- possible hood, storm flaps, or inner lining

- weather protection, insulation, and outer coverage for cold or wet conditions
- formal outerwear for professional and dressy contexts
- layering over multiple garments

- winter wear, professional outerwear, or protective cold weather clothing
- can signal preparedness and functional coverage

- heavy coat bulk may mask whether there is an underlying garment present
- coat edges may move independently in wind creating apparent coverage change
- open coat fronts may expose bright inner layers that alter perceived coverage

- Use coat closure state and panel overlap to determine coverage
- verify whether the coat’s weather function supports a broad coverage expectation
- consider the possibility of intentional open styling in formal or fashion contexts

#### Blazers

- structured shoulders, lapels, buttons, pockets, collar, vent panels, smooth tailoring
- visible lining or contrasting stitching on the interior

- tailored body panels, shoulder padding, sleeve crowns, buttoned front, and sometimes back vents
- clean hem, fitted waist, and notched or peaked lapels

- professional or semi-formal upper body coverage
- structured outer layer for business attire and smart casual outfits
- pairing with matching trousers or skirts

- businesswear, office attire, formal or semi-formal settings
- conveys professionalism and polished appearance

- open blazer styling can resemble intentional exposure when paired with a low neckline
- sleeve length changes due to arm movement may seem like incomplete arm coverage
- lightweight blazers may appear more transparent than heavier wool blends

- Validate blazer coverage through lapel overlap and button closure
- evaluate whether the blazer is intentionally styled open or if coverage has been compromised
- combine blazer evidence with underlying top coverage and context

#### Uniforms

- consistent color palette, insignia, badges, rank stripes, standardized silhouettes, matching top and bottom garments
- structured elements such as epaulettes, belts, hats, and utility pockets

- composed of specified top, bottom, accessories, and sometimes outerwear with a recognizable institutional design
- often includes closures, collars, and reinforcing panels appropriate to the role

- identifiable coverage for occupational, educational, or service roles
- consistent appearance, authority, protection, or functionality
- easy recognition in group contexts

- professional, institutional, or role-based clothing
- conveys identity, authority, or belonging to a specific organization

- partial uniform elements can be mistaken for civilian clothing if core insignia are obscured
- layered uniforms with outer jackets may hide the underlying standard top
- protective or specialized uniform pieces may alter normal coverage expectations

- Use uniform insignia and design features to determine proper coverage norms
- assess whether visible deviations are authorized style variants, temporary adjustments, or actual coverage issues
- consider the role and environment when interpreting uniform coverage

### 4.2 Lower Body Ontology

#### Jeans

- denim texture, rivets, five-pocket layout, waistband, fly closure, belt loops, back yoke
- visible stitching, hem, and sometimes distress details

- sturdy denim panels, reinforced seams, metal hardware, crotch gusset, and hemmed leg openings

- durable lower body coverage for casual, work, or leisure scenarios
- protects hips, thighs, and legs from abrasion and incidental contact

- casual, rugged, or timeless attire
- can signal informal or work-oriented settings

- distressed holes may show skin without indicating real coverage loss
- dark denim can absorb light and obscure boundary lines
- jeans cut can vary widely from skinny to relaxed, affecting coverage interpretation

- Assess jeans coverage through waistband fit, fly closure, and leg panel continuity
- distinguish intentional distress from actual gaps or skirt-like exposure
- consider the casual or work context for coverage expectations

#### Trousers

- waistband, front closure or hook, creases, pockets, straight or tapered legs
- tailored seam lines and often smoother fabric than jeans

- cut and sewn panels, waist interfacing, inner waistband, pockets, and hemmed leg openings

- formal or business lower body coverage, often part of professional ensembles
- provides clean, structured appearance for office or dress occasions

- business attire, formal wear, or smart casual dress codes
- conveys professionalism and structured presentation

- trouser pleats or tapered cuts may hide subtle movement of the waistline
- high-waisted styles can change expected top overlap with shirts and blazers
- lightweight dress trousers can blow in wind, altering appearance without coverage loss

- Confirm trouser coverage by waistband alignment and hem consistency
- evaluate trouser coverage in relation to the top layer during sitting or movement
- use trouser structure and context to distinguish formal coverage from casual shorts

#### Shorts

- short inseam, waistband, leg openings, pockets, fly or elastic closure, visible stitching
- behavioral cues when the wearer sits or runs

- waistband and elastic or fastener system, leg panels, inseam and outseam seams, hem finish

- cool-weather or athletic lower body coverage
- provides mobility and freedom of movement for active scenarios

- casual, athletic, or warm-weather apparel
- often associated with leisure and exercise

- shorts can ride up during motion and expose more thigh than expected
- folded or cuffed hems can create variable coverage lengths
- swim shorts and casual shorts can look similar without context

- Assess shorts coverage by comparing visible thigh area to expected inseam length
- consider the activity and environment to determine whether exposed legs are normal coverage for the garment
- use waistband behavior and pocket outlines to validate coverage

#### Skirts

- waistband, hemline, panels, pleats, side seams, slit details, fabric drape
- visible lining or layering beneath the hem in some styles

- waistband closure, panel construction, gathers or pleats, hem finish, inner lining when present

- lower body coverage with stylistic variation in length and silhouette
- provides mobility or formal appearance depending on design

- can signal feminine styling, formal attire, or casual wear
- length and shape inform cultural and activity-appropriate coverage expectations

- wind or motion can lift hemlines without exposing the body beyond the expected slit or design
- high slits may intentionally reveal legs while still being legitimate coverage
- layered skirts and asymmetrical hems create complex coverage boundaries

- Evaluate skirt coverage using waistband stability, hem length, and slit location
- distinguish designed leg reveal from accidental ride-up
- use adjacent garment and context evidence to confirm style intent

#### Leggings

- body-conforming stretch fabric, elastic waistband, seam lines, matte or shiny finish
- tight fit that follows hip and thigh contours

- stretch panels, gusset, elastic waist, and full-length or cropped leg openings

- flexible lower body coverage for athletic, casual, or layering use
- provides support and motion-ready fit

- athleisure, activewear, casual comfort, or layered fashion depending on styling

- sheer leggings can reveal underlying skin tone while still covering the body
- high-rise waistbands may shift and expose lower abdomen without true coverage loss
- tight stretch can mislead coverage interpretation because of visible body contours

- Interpret leggings coverage by confirming opacity, seam continuity, and waist stability
- consider whether visible shape detail is due to tight fit rather than actual exposure
- use fabric and context evidence to distinguish compression layers from underwear

#### Sweatpants

- elastic waist, drawstring tie, cuffed ankles, soft fabric texture, side pockets
- visible pant leg seams and relaxed silhouette

- wide panels, elastic waistband, drawcord channel, cuffs or straight hems, and internal pocket construction

- comfortable lower body coverage for leisure, exercise, and casual settings
- provides soft insulation and movement ease

- relaxed apparel, sportswear, or lounge wear
- often indicates a low-pressure or informal context

- baggy sweatpants can create perceived volume that hides the actual hip coverage
- waistband sag or roll can seem like coverage loss without revealing skin
- pant fabric may bunch in motion, altering coverage appearance

- Assess sweatpants coverage through waistband alignment and leg panel continuity
- distinguish normal lounge movement from actual exposure
- use shirt overlap and context to confirm whether the lower torso remains covered

### 4.3 Full Body Ontology

#### Dresses

- continuous bodice and skirt construction, waist seam or empire line, straps or sleeves, hemline length
- neckline shape, back detail, and skirt fullness indicators

- bodice panels, skirt panels, waist shaping, closure system, and optional lining

- single-piece coverage for upper and lower body
- formal, casual, or functional dress depending on design

- fashionable attire, formal wear, or everyday garment with a unified silhouette

- split skirts or high slits can appear like accidental exposure
- sheer overlays or cutouts may show skin while the dress remains a complete garment
- flowing dress movement can make coverage appear inconsistent

- Interpret dress coverage by locating the bodice-to-skirt connection and verifying neckline and hemline continuity
- distinguish intentional design elements from actual gaps
- use context and garment style to evaluate coverage intent

#### Jumpsuits

- connected torso and leg pieces, zipper or button front, shoulder straps or sleeves, waist shaping
- continuous fabric from shoulders to ankles or calves

- single-piece top and bottom assembly, crotch seam, waistband, and closure system

- all-in-one coverage for upper and lower body
- provides streamlined appearance and functional ease

- practical, fashionable, or utility-oriented attire depending on material and cut

- open zippers or partial closures can create intentional exposure or be mistaken for coverage failure
- strap positioning may change with motion and affect coverage judgment
- loose jumpsuits may move independently from the body while still covering it

- Assess jumpsuit coverage by verifying the integrity of the torso and leg connection
- confirm closure state and strap placement
- use fabric and context evidence to distinguish intentional styling from displacement

#### Robes

- wrap or open-front construction, belt or tie closure, wide sleeves, flowing drape
- visible overlap of fabric panels and collar or lapel details

- outer panel, inner panel, belt loops, tie fastening, wide sleeves

- loose coverage for comfort, relaxation, or ceremonial use
- provides modesty and layering while allowing ease of movement

- bedtime or leisure wear, ceremonial attire, or spa/loungewear

- overlap gaps may be mistaken for exposure when the robe is actually closed
- belted versus open robe states change coverage interpretation
- robes can reveal inner garments without meaning the outer layer lacks coverage

- Use panel overlap and belt tension to determine robe coverage
- consider whether inner garments provide supplementary coverage in open robe states
- account for the relaxed context in interpreting loose drape

#### Gowns

- floor-length skirt or train, structured bodice, formal fabric, decorative embellishments
- neckline and sleeve details that suggest occasion wear

- fitted bodice, waistline, skirt panels, closure system, and decorative features such as beading or lace

- formal or ceremonial coverage with a dramatic silhouette
- provides elegant upper and lower body coverage for events

- formal events, red carpet or ceremonial attire, cultural rituals depending on style

- high slits or sheer sections can be part of the design rather than unintentional exposure
- heavy skirts may conceal lower body coverage boundaries
- open back or low neckline designs require careful interpretation

- Assess gown coverage through bodice structure, skirt continuity, and neckline design
- distinguish intentional fashion elements from actual coverage failures
- use event context to understand whether revealing details are stylistic or problematic

#### Overalls

- bib front, shoulder straps, side fasteners, pant legs, pockets, waist overlap
- visible hardware such as buttons, clips, or buckles

- connected bib and pant sections, adjustable straps, waist closure, and leg panels

- utility coverage for work or casual wear
- provides combined upper and lower body coverage with practical support

- work apparel, casual utilitarian fashion, or protective outerwear in craft settings

- straps can loosen or slide without actually opening coverage
- bib panel movement can affect perceived chest coverage
- overalls worn over different inner garments change coverage semantics

- Look for secure strap attachment and bib alignment to determine overall coverage
- consider underlying garments when the outer bib is loose
- evaluate whether the pant section maintains continuous lower body coverage

### 4.4 Undergarments Ontology

#### Bras

- cup shapes, straps, underwire lines, band around the torso, hook closures, lace or smooth fabric
- visible tension at the shoulders or back

- cups, band, straps, closures, and sometimes padding or support wings

- support and coverage for the breasts, shaping and comfort under outer garments
- creates support-based appearance while often remaining hidden

- underlayer rather than outerwear, with coverage primarily intended for structural support and modesty under clothes

- sports bras may resemble outer athletic tops
- lace or decorative bras can be intentionally visible under sheer garments
- band and strap visibility can appear as upper body apparel if the outer layer shifts

- Interpret bras as undergarments unless explicitly styled as outerwear
- use evidence of layers and context to decide whether a visible bra is part of the outfit or an underlayer
- evaluate whether coverage should be treated as intentional exposure or structural support

#### Underwear

- elastic waistbands, brief or boxer shapes, lace panels, cotton fabric, trimmed edges
- visible underwear seam lines at the waist or leg openings

- briefs, boxers, panties, or boxer briefs with elastic waistband and leg holes

- basic lower body coverage and hygiene under outer garments
- provides intimate coverage rather than public-facing apparel

- underlayer with modest coverage intent, typically hidden from public view

- swimwear bottoms can appear similar to underwear
- athletic compression shorts may be mistaken for underwear when seen through sheer layers
- underwear waistlines can be visible above low-rise trousers without implying full exposure

- Treat underwear as undergarment coverage unless the context indicates intentional display
- use fabric and layer information to differentiate underwear from short shorts or swim bottoms
- consider the activity and attire context when evaluating visibility

#### Undershirts

- soft knit fabric, tank top or crew neck shape, short or long sleeves, light colors
- layering underneath shirts or jackets

- single-piece top with minimal seams, stretchy fabric, and often a fitted silhouette

- comfort, moisture absorption, and coverage underneath outer garments
- provides a smooth base layer and supports hygiene

- underlayer that can remain hidden or intentionally visible in casual styling

- tanks or camisoles can be worn as outerwear in some contexts
- undershirts seen through open shirts or unbuttoned tops may change coverage meaning
- sheer outer garments can make undershirts visually prominent

- Evaluate undershirt coverage in relation to the overlying garment
- determine whether visible undershirt is part of the outfit or simply an inner layer
- account for casual or athletic context when an undershirt is intentionally visible

#### Compression garments

- tight-fitting fabric, smooth contours, high elasticity, supportive panels, strong seams
- often full-body or regional coverage with a sleek finish

- stretch panels, engineered support zones, reinforced seams, and elastic waist or cuff bands

- support, shape retention, muscle compression, and coverage under other clothing
- used for athletic performance, recovery, or undergarment support

- functional underlayer with medical, athletic, or aesthetic intent

- compression wear resembles underwear and activewear depending on style
- tight fit and body contour visibility can make coverage interpretation challenging
- sheer or translucent compression fabrics may reveal skin tone while still covering the body

- Interpret compression garments as supportive coverage when they remain continuous and opaque
- use layer and fabric evidence to distinguish compression wear from underwear or outerwear
- consider the activity and purpose when the garment is visible

### 4.5 Outerwear Ontology

#### Raincoats

- water-resistant shell, hood, taped seams, storm flap, drawcords, reflective trim
- shiny or matte waterproof fabric appearance

- outer shell with sealed seams, closure system, hood, cuffs, and sometimes ventilation flaps

- weather protection from rain and moisture
- outer coverage for wet environments

- functional protective wear, often over other garments
- signals preparedness for inclement weather

- raincoats can be mistaken for regular coats in dry contexts
- partially open raincoats can expose underlying layers while still serving as outerwear
- water droplets on the surface can obscure seam and closure evidence

- Use hood, seam sealing, and waterproof fabric evidence to identify raincoat coverage
- evaluate whether the garment is intended as protective outerwear or fashion outerwear
- consider environmental rain cues to confirm apparel purpose

#### Winter jackets

- padded insulation, high collar, zipper or snap closure, hood, quilted panels, thick fabric
- bulkiness and textured outer fabric indicating warmth

- insulated panels, lining, collar, closure system, cuffs, and sometimes waist adjustments

- insulation and upper body coverage in cold conditions
- protects against wind and temperature drop

- cold weather outerwear, functional warmth, or winter fashion

- winter jackets may hide inner layers, making coverage of the core body hard to assess
- partially open jackets may reveal inner garments without changing the jacket’s primary coverage role
- puffiness can distort apparent body shape and coverage boundaries

- Assess winter jacket coverage by closure state, hood position, and panel continuity
- use the cold weather context to support coverage expectations
- distinguish functional insulation from fashion-oriented bulk

#### Parkas

- extended length, fur-trimmed hood, heavy insulation, storm cuffs, zippered front, multiple pockets
- visible snow or frost evidence in cold settings

- long outer shell, insulated lining, hood with trim, closure system, and sometimes internal belts

- extreme cold weather coverage for upper and lower torso
- insulation and protection in harsh winter environments

- functional extreme weather outerwear, often with utilitarian or expedition appearance

- parka bulk can obscure whether the underlying body is covered by additional layers
- long length may confuse coverage boundaries at the hips and thighs
- fur trim can distract from actual hood and collar coverage evidence

- Interpret parka coverage through outer panel integrity and insulation evidence
- verify that the parka is the primary outer layer and that coverage is consistent with cold weather function

#### Windbreakers

- lightweight shell, elastic cuffs and hem, zippered closure, color blocking, reflective accents
- thin fabric with slight sheen and often stowed hood

- light shell panels, zipper or snap closure, elasticized edges, and ventilation properties

- light wind protection and upper body coverage in transitional weather
- provides an outer shell that shields against breeze and light rain

- sporty outerwear, casual outdoor layer, or travel garment

- windbreakers can resemble fashion jackets when styled loosely
- partially open windbreakers may show underlying layers without losing coverage
- thin fabric can appear transparent when backlit

- Use shell fabric properties and edge elastic evidence to determine windbreaker coverage
- consider the outdoors or sports context to support functional coverage interpretation

#### Ponchos

- single-panel garment with head opening, loose drape, hood or collar, and wide hem
- often made from waterproof or heavy fabric

- single piece of fabric with a central head opening and optional hood, minimal seams

- protective coverage for rain or cold with easy on/off functionality
- provides loose coverage over the torso and upper legs

- weather protective garment, casual travel wear, or cultural outer layer

- ponchos may appear like blankets or drapes in static images
- loose drape can obscure the shape of the body and the extent of coverage
- the head opening and hemline are key to discerning a poncho from a blanket

- Identify poncho coverage by the head opening and single-panel drape structure
- distinguish it from blankets or shawls using hood or shoulder coverage evidence

### 4.6 Footwear Ontology

#### Sneakers

- rubber sole, laces or straps, padded collar, stitched upper panels, sporty silhouette
- often visible brand logos and mesh or leather textures

- rubber outsole, foam midsole, upper panels, laces or closure system, and heel counter

- comfortable foot coverage for daily wear, sports, or walking
- provides cushioning, traction, and foot protection

- casual, athletic, or sporty attire
- often informs the overall activity and comfort context

- sneaker-like shoes worn in formal settings may be mistaken for casual wear
- slip-on styles can resemble casual loafers
- high-top sneakers can resemble boots at a glance

- Assess sneaker coverage by sole design, upper panel shape, and closure type
- use contextual evidence such as activity or outfit style to distinguish sneakers from dress shoes

#### Sandals

- open-toe design, straps across foot, visible toes, buckles or elastic, flat or heeled sole
- often summer or beach wear with airy construction

- sole with strap system, toe loop or band, and back strap in some styles

- low-foot coverage for warm weather, ease of wear, and ventilation
- provides minimal protective coverage while supporting the foot

- casual summer or beach attire, or relaxed leisure wear

- some sandals can look like slippers or open shoes
- sport sandals can resemble athletic shoes from certain angles
- lacy or decorative straps can be mistaken for accessory bands rather than footwear

- Determine sandal coverage by open toe and strap layout
- use season and environment context to validate them as footwear rather than improvised cloth coverings

#### Boots

- high shaft, sturdy sole, laces or zippers, leather or synthetic material, reinforced toe
- visible ankle or calf coverage depending on height

- outsole, shaft, upper materials, closure systems, and sometimes insulation or protective toe caps

- foot and lower leg coverage, protection from weather or hazards
- provides support and stability for demanding activities

- outdoor, work, or fashion footwear with robust coverage and structure

- ankle boots can be confused with high-top sneakers
- dress boots may resemble formal shoes while providing more coverage
- knee-high boots may change the perceived length of lower body coverage

- Assess boot coverage by shaft height, closure system, and material rigidity
- consider the environment and garment ensemble to determine whether boots are functional or stylistic

#### Formal shoes

- leather or polished upper, low heel or flat sole, clean silhouette, minimal decoration
- distinct toe shape and refined finishes

- stitched or glued sole, leather or synthetic upper, laces or slip-on design

- elegant foot coverage for formal or business attire
- complements dressy outfits with controlled coverage and appearance

- professional, ceremonial, or formal social contexts

- some formal-looking shoes may actually be casual dress sneakers
- open-heel designs can resemble slippers or sandals
- textured finishes may create confusion with certain leather boots

- Interpret formal shoe coverage by polished construction and refined silhouette
- use attire and event context to distinguish formal shoes from casual footwear

#### Slippers

- soft sole, slip-on construction, plush or fabric upper, low structure
- household or lounging cues such as fuzzy textures or open backs

- simple slip-on upper, soft cushioning, light sole, often without heel or ankle support

- comfortable indoor foot coverage for relaxation and home use
- provides minimal protective coverage while maintaining warmth

- home or leisure attire, informal and relaxed contexts

- slippers can resemble sandals or indoor moccasins
- soft structure may make them appear as accessories rather than footwear
- decorative elements can blur the distinction with casual shoes

- Use softness, open back design, and indoor context to identify slippers
- consider whether the scene implies home or relaxation rather than public footwear

#### Athletic shoes

- performance outsole, mesh or synthetic upper, visible cushioning, laces or speed-lace systems, ventilation zones
- often branded with athletic logos or functional graphics

- engineered sole, supportive upper, closure system, and sometimes ankle support or motion control features

- foot coverage for sports, training, and high-mobility activities
- provides traction, cushioning, and protective support

- athletic or fitness contexts, active movement, and performance-based activities

- athletic shoes can resemble casual sneakers in everyday attire
- some fashion-oriented “athleisure” shoes may mimic athletic design without performance intent
- visible logos alone are not sufficient to classify coverage intent

- Interpret athletic shoe coverage by sole design and structure for motion support
- combine activity and outfit evidence to confirm sportswear intent

### 4.7 Headwear Ontology

#### Hats

- brim or crown, material texture, headband, decorative details, shadow cast on face
- visible top panel and attachment around the head

- crown, brim, band, and possibly chin strap or ear flaps

- head coverage for sun protection, warmth, fashion, or identity
- provides shading and sociocultural signaling

- casual or formal headwear depending on style, can indicate profession or fashion preference

- wide-brim hats can be mistaken for costume pieces in some contexts
- flat caps or fedoras may appear similar to casual caps
- soft fabric hats can be confused with beanies or head wraps

- Assess hat coverage by brim and crown structure, material, and head attachment
- use environmental cues such as sun or weather to determine purpose

#### Helmets

- rigid shell, straps, ventilation holes, chin cup, reflective decals, padding visible at the edge
- often associated with sports, construction, or safety scenarios

- hard outer shell, internal padding, retention system, and coverage over the skull and sometimes the face

- head protection for impact resistance, safety, or occupational compliance
- provides specialized coverage for hazardous or active conditions

- safety apparel in sports, construction, cycling, or industrial environments

- some fashion helmets may resemble rugged hats
- soft protective headgear can be mistaken for headphones or accessories
- helmet straps and chin cups are key identification cues

- Use helmet shape, retention system, and context to determine true protective head coverage
- combine with activity and environment evidence for accurate interpretation

#### Caps

- curved or flat visor, structured front panel, crown, button top, adjustable closure at the back
- sports or casual styling cues

- visor, crown panels, sweatband, closure system, sometimes mesh back

- lighter head coverage for sun protection, style, or team affiliation
- provides shading of the face and casual upper head coverage

- casual, sporty, or branded attire
- often associated with athletics or outdoor leisure

- caps can resemble hats or visors depending on crown structure
- some caps are worn indoors for fashion rather than protection
- logotypes and team crests affect meaning

- Interpret cap coverage by visor and crown construction and relate it to sports or casual context

#### Beanies

- knit fabric, close-fitting crown, rolled hem or cuff, lack of brim
- often worn low over the forehead and ears

- knit or woven fabric forming a simple cap shape with stretch to conform to the head

- warmth and casual head coverage, especially in cold weather
- provides soft insulation and comfort

- winter or casual outdoor attire
- can signal relaxed or streetwear style

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

* **Temporal Sampling:** Video sequences are sampled at dynamic frame rates ($15\text{ fps}$ baseline, scaling up to $60\text{ fps}$ upon high-velocity motion vectors detection).

* **Mathematical Foundations:** The module treats the human body as an aggregated set of discrete polygon zones ($Z_1, Z_2, \dots, Z_n$). The total coverage score ($C_{\text{score}}$) is derived from the ratio of clothed pixels ($P_{\text{cloth}}$) to total body surface pixels ($P_{\text{total}}$):