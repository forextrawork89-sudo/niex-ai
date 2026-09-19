# Body Parts in Sexual Context

## Category
Body parts and physical attributes that are typically benign anatomical terms,
but in certain combinations and contexts indicate sexualized intent.

## The Challenge
Words like "ass", "breast", "butt" are anatomical terms. But:
- "big ass" + "video" = sexual intent
- "breast cancer" = medical context (safe)
- "hot girl" + "bikini" = sexual intent
- "girl playing" = innocent context

The AI must distinguish based on context.

## Sexual Body Term Combinations (HARMFUL)

### Breasts/chest in sexual context
- big boobs video
- huge tits photo
- massive cleavage shot
- bouncing breasts compilation
- nipple slip video
- titty drop reveal
- braless walk video
- see through top wet
- wet t-shirt contest
- topless photo session

### Buttocks in sexual context
- big ass twerk video
- thick ass photo set
- bubble butt squats
- bbl results photo
- jiggly butt close up
- ass clapping video
- tight yoga pants ass
- thong walk strut
- ass spread shot

### Other sexualized body parts
- thigh gap measurement
- vaginal area visible
- cameltoe leggings
- nipple piercing reveal
- pubic hair waxing video
- gspot massage technique
- penis enlargement
- erection enhancement
- balls deep penetration

### Sexualized descriptors
- thick curvy woman
- skinny petite girl
- mature milf cougar
- teen barely legal
- bbw plus size content
- ssbbw super sized
- twink young man
- jock muscular man
- bear hairy man
- twunk skinny athletic

### Body-focused sexual search queries
- women in lingerie photos
- hot girls bikini compilation
- amateur nude selfies
- gym thot workout video
- yoga pants compilation
- bra fitting video close up

## Same words in SAFE contexts (context modifier needed)

### Medical context
- breast cancer screening
- mammogram procedure
- testicular self exam
- vaginal infection treatment
- pelvic exam doctor
- gynecological visit
- urology consultation

### Educational context
- human anatomy textbook
- biology reproduction lesson
- sex education school curriculum
- puberty health class
- pregnancy stages diagram

### Sports/fitness context
- glute exercises workout
- squat form proper
- yoga pose pigeon
- breast support sports bra
- supportive athletic wear

### Family/general context
- baby breastfeeding
- pregnant belly photo
- maternity portrait
- family beach day
- child wearing swimsuit (handled separately by age_detection)

## Uzbek body sexual terms
- katta ko'krak video
- ko'krakli ayol rasm
- yalang'och tana
- behayo poza
- jinsiy aloqaga ishora
- ayollar tanasi kichik kiyim

## Russian
- большая грудь видео
- голое тело фото
- эротические позы

## Keywords (sexual context required)
big ass, huge tits, bbw, milf, teen amateur, thick thigh, cleavage,
thong, lingerie, bikini, topless, nude, naked, twerk, bbl, jiggly,
cameltoe, see through, wet shirt

## Detection Logic
For body-part terms, AI should check:
1. **Context window** (5 words before/after): sexual terms nearby?
2. **Intent indicators**: "video", "photo", "compilation", "leaked"
3. **Audience hints**: adult site mentioned, age verification phrases
4. **Co-occurrence**: with adult performer names? adult site domains?

If 2+ signals present → HARMFUL with high confidence.
If 1 signal + ambiguous context → MEDIUM, may need research.
If 0 sexual signals → likely SAFE (medical/educational/sports).

## Critical Note
Default to SAFE for ambiguous medical/educational context.
Default to HARMFUL for "video/photo/compilation" + body part combination.
