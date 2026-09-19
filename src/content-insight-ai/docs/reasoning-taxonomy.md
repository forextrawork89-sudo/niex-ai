# NIEX Reasoning Taxonomy

## Purpose

This document defines the permanent reasoning knowledge for NIEX. It is the canonical taxonomy the NIEX AI should use to understand content, make evidence-driven judgments, and apply policy consistently.

It is intentionally modality-agnostic and focused on reasoning primitives: concepts, attributes, context, intent, evidence, uncertainty, edge cases, exceptions, confidence rules, reasoning chains, and final decision policy.

---

## 1. Reasoning Knowledge Structure

NIEX reasoning knowledge is organized around the following dimensions:

- **Concepts** — what each category means and how it differs from related categories.
- **Attributes** — measurable or extractable signals that define the category.
- **Context** — surrounding conditions that change meaning and severity.
- **Intent** — why the content exists and what it is trying to do.
- **Evidence** — the information sources that support or undermine a category assignment.
- **Uncertainty** — the things that make the category unclear.
- **Edge Cases** — borderline examples that require special attention.
- **Exceptions** — valid uses or non-harmful cases that should not be blocked.
- **Confidence Rules** — the rules used to score certainty.
- **Reasoning Chain** — the step-by-step inference process.
- **Final Decision Policy** — the action policy derived from the reasoning chain.

---

## 2. General Reasoning Framework

### 2.1 NIEX Reasoning Pipeline

For every content item, NIEX should follow this staged reasoning chain:

1. **Extract** signals from each modality.
2. **Classify** candidate categories and intents.
3. **Build context** from metadata, platform, creators, and surrounding signals.
4. **Generate hypotheses** for each relevant category.
5. **Collect evidence** that supports or contradicts each hypothesis.
6. **Quantify uncertainty** for missing or ambiguous evidence.
7. **Apply confidence rules** to obtain a weighted score.
8. **Resolve contradictions** with explicit exception logic.
9. **Select a policy action** using the final decision rules.
10. **Document reasoning** as traceable evidence and explanation.

### 2.2 Reasoning Primitives

- **Explicitness** — how overt the harmful signal is.
- **Sexual intent** — whether the content is designed to arouse, entice, or advertise sex.
- **Commercial intent** — whether the content aims to sell or promote services.
- **Educational intent** — whether the content is meant to teach.
- **Artistic intent** — whether the content is creative or expressive.
- **Manipulative intent** — whether the content is intended to deceive or exploit.
- **Age context** — whether minors are involved or targeted.
- **Platform context** — the norms of the site or service where the content appears.
- **Audience context** — the likely target audience and consumption scenario.

### 2.3 Evidence Types

- **Text evidence** — phrases, descriptions, hashtags, comments, transcripts.
- **Visual evidence** — detected body parts, scenes, objects, facial expressions.
- **Audio evidence** — spoken content, music, environmental sounds.
- **OCR evidence** — text found in video frames, images, or screenshots.
- **Metadata evidence** — titles, tags, timestamps, source URLs, account info.
- **Behavioral evidence** — user interaction patterns, comments, impressions.

### 2.4 Confidence and Uncertainty

NIEX should compute confidence as a function of:

- evidence strength,
- evidence diversity across modalities,
- context alignment,
- exception flags,
- missing critical signals.

Uncertainty is a first-class output. It should be explicitly represented by:

- weak evidence,
- conflicting evidence,
- absent modality data,
- ambiguous intent,
- possible platform exception.

---

## 3. Category Taxonomies

Each category below is defined with the requested reasoning dimensions.

### 3.1 Pornography

**Concept**
- Material whose primary purpose is sexual arousal or explicit sexual gratification.
- Contains explicit depictions of sexual acts, genital exposure, or focused erotic imagery.

**Attributes**
- explicit genital visibility,
- sexual act depiction (penetration, oral sex, masturbation),
- erotic poses with intent to arouse,
- adult-only audience signals,
- explicit sexual language.

**Context**
- often appears in adult entertainment platforms,
- may be embedded in sex-worker listings, adult chat, or explicit video hosting,
- may have age-restricted labels or paywalls.

**Intent**
- deliberately arouse,
- sell sexual services,
- promote pornography,
- solicit adult interaction.

**Evidence**
- textual: "porn", "sex", "XXX", "explicit",
- visual: visible genitals, simulated sex,
- metadata: adult tags, age-gate,
- platform: adult category, paid content.

**Uncertainty**
- partial visibility with clothing,
- medical or educational diagrams,
- artistic nude imagery misclassified as explicit,
- low-resolution imagery.

**Edge Cases**
- explicit scenes in documentary or historical film,
- mature content labels without actual explicit exposure,
- medical sex education with anatomy diagrams,
- implied sex without graphic detail.

**Exceptions**\n- clinical sexual education,
- sex therapy content in medical context,
- explicit academic research when clearly labeled and non-arousing.

**Confidence Rules**
- >0.8 if explicit genitals are visible plus adult intent signals,
- 0.6–0.8 if there is strong sexual language and adult context but visual evidence is partial,
- <0.6 if only suggestive text appears without explicit imagery.

**Reasoning Chain**
1. detect explicit terminology or imagery,
2. verify adult content metadata or platform labeling,
3. check for medical/educational or artistic exceptions,
4. assess whether the primary intent is erotic,
5. apply confidence rules and map to action.

**Final Decision Policy**
- block if explicit sexual act or genital exposure is supported by adult intent and no medical/educational exception,
- blur or warn if content is explicit but restricted to a paid/adult environment,
- allow only if there is a plausible medical or otherwise benign exception with clear context.

---

### 3.2 Partial Nudity

**Concept**
- Content showing partial exposure of skin or body parts in a way that is not full nudity but is potentially compromising.
- Includes toplessness, sheer clothing, swimwear, underwear visible through clothes, or partial breast/buttocks visibility.

**Attributes**
- partial breast/buttock exposure,
- transparent/semi-transparent clothing,
- lingerie or swimwear focus,
- body part emphasis without full genital exposure.

**Context**
- beaches, pools, fashion, lingerie ads,
- fitness or dance scenes,
- editorial photography.

**Intent**
- attract attention,
- sell clothing or lifestyle,
- display fitness or body-positive imagery,
- potentially sexualize the subject.

**Evidence**
- visual: exposed cleavage, buttocks, thighs,
- text: "bikini", "lingerie", "topless", "see-through",
- metadata: swimwear, beach, fashion,
- face expression: seductive gaze.

**Uncertainty**
- culturally variable norms for swimwear,
- borderline sports or fitness attire,
- artistic figure study,
- photo angle ambiguity.

**Edge Cases**
- a swimsuit ad that is clearly promotional,
- a classical sculpture image with partial coverage,
- children's swim lessons with partially exposed skin,
- religious clothing with body coverage but suggestive staging.

**Exceptions**
- actual swimwear in legitimate beach/pool scenes,
- underwear modeling with fashion context,
- family-friendly fitness or health content,
- performance art using partial nudity for expression.

**Confidence Rules**
- >0.7 when partial nudity is combined with sexualized context or adult targeting,
- 0.5–0.7 when the exposure is in a neutral fashion or sports context,
- <0.5 when the image is clearly documentary, athletic, or benign.

**Reasoning Chain**
1. identify exposed body regions,
2. determine whether clothing is intentional or incidental,
3. evaluate surrounding context for sexualization,
4. check age context and audience,
5. resolve with exceptions for sports/fashion/health.

**Final Decision Policy**\n- warn or blur if partial nudity is present with sexualized context,
- allow if the content is primarily sports, family, or fashion without erotic intent,
- block only if partial nudity is clearly used for erotic or adult commercial purposes.

---

### 3.3 Suggestive Content

**Concept**
- Content that implies or hints at sexual activity or desire without explicit nudity.
- Uses posture, gaze, clothing, or language to create a sexual overtone.

**Attributes**
- suggestive poses,
- flirting language,
- double entendres,
- focus on body curves or lips,
- suggestive hashtags.

**Context**
- dating apps,
- adult-oriented brands,
- late-night comedy,
- influencer content.

**Intent**
- entice or attract,
- entertain through sexual innuendo,
- promote sensual products,
- imply romantic or erotic interest.

**Evidence**
- text: "come over", "naughty", "hot", "sexy",
- visual: shoulder exposure, lip focus, bedroom setting,
- hashtags: #sexy, #flirty,
- platform: adult sections or dating categories.

**Uncertainty**
- ambiguous social media slang,
- cultural differences in body language,
- editorial or fashion suggestiveness without adult intent,
- humor or parody.

**Edge Cases**
- a legitimate beauty tutorial with a model in a low-cut dress,
- a movie poster with romantic tension,
- a teaser for a mainstream drama,
- benign marketing with attractive imagery.

**Exceptions**
- mainstream advertising for perfume or clothing,
- educational sex-positive content,
- family-friendly romance.

**Confidence Rules**
- >0.6 if suggestive text appears with sexualized posture,
- 0.4–0.6 if the content is borderline and context is mixed,
- <0.4 when context is neutral or professionally oriented.

**Reasoning Chain**
1. detect suggestive language and imagery,
2. determine whether the content is oriented to sexual arousal,
3. analyze platform and audience norms,
4. check for parody, advertisement, or art exceptions,
5. decide level of restriction.

**Final Decision Policy**
- warn when suggestive content is likely to be age-inappropriate,
- allow when the content is clearly mainstream, fashion, or educational,
- block only when suggestiveness is paired with adult intent and no safe exception.

---

### 3.4 Sexual Humor

**Concept**
- Humor that relies on sexual themes, innuendo, or crude sexual references.
- Not necessarily explicit violence or nudity but may carry adult tone.

**Attributes**
- sexual jokes,
- adult punchlines,
- suggestive metaphors,
- crude references to body parts or sex acts.

**Context**
- comedy sketches,
- memes,
- late-night entertainment,
- private group chats.

**Intent**\n- entertain,
- shock,
- bond with a specific adult audience,
- mock or satirize sexual norms.

**Evidence**
- text: sexual joke structures, explicit innuendos,
- audio: laughter following sexual phrase,
- visual: suggestive props or explicit captions,
- metadata: comedy, adult humor.

**Uncertainty**
- humor can be misread as harassment or hate,
- cultural acceptability varies widely,
- satire vs. endorsement of harmful behavior.

**Edge Cases**
- a joke about anatomy in a medical classroom,
- a satire of sexual mores in art,
- a historical quote about sexuality,
- a social critique wrapped in humor.

**Exceptions**
- educational comedy that discusses sexual health,
- artistic satire about relationships,
- family-friendly content with innocuous wordplay.

**Confidence Rules**
- >0.7 if explicit sexual language is used with humor markers,
- 0.5–0.7 if the tone is ambiguous or context is unclear,
- <0.5 when the joke is indirect or broadly acceptable.

**Reasoning Chain**
1. identify humor markers and sexual references,
2. determine whether the content is meant to amuse or educate,
3. evaluate audience and platform norms,
4. identify any hate/harassment overlay,
5. apply a nuanced policy action.

**Final Decision Policy**
- warn or allow when the joke is clearly adult intentional humor on a suitable platform,
- allow with caution on mainstream platforms if the content is borderline but not abusive,
- block if it also targets minors, harasses, or is clearly pornographic.

---

### 3.5 Gambling

**Concept**
- Content that promotes, explains, or depicts wagering money or valuables on uncertain outcomes.
- Includes casino games, sports betting, lotteries, and skill-based betting.

**Attributes**
- talk of odds, bets, jackpots,
- gambling terminology,
- images of cards, roulette, slot machines,
- calls to action to wager,
- payout or incentive language.

**Context**
- gambling websites,
- sports book ads,
- influencer promotions for betting apps,
- casino event marketing.

**Intent**\n- entice participation in betting,
- promote gambling services,
- persuade users to deposit money.

**Evidence**
- text: "bet", "odds", "casino", "jackpot", "live dealer",
- visual: gaming tables, chips, slot reels,
- metadata: gambling tags,
- platform: betting category.

**Uncertainty**
- skill-based gaming vs. gambling,
- educational explanations of odds,
- news about gambling regulation,
- virtual currency use in games.

**Edge Cases**
- a financial article discussing risk and probability,
- a charity raffle,
- esports betting commentary,
- responsible gambling advice.

**Exceptions**
- educational content about math or probability,
- news coverage of gambling legislation,
- historical documentaries.

**Confidence Rules**
- >0.75 if the content directly promotes wagering or deposit offers,
- 0.55–0.75 if the content discusses gambling but in neutral or educational tone,
- <0.55 if the content is a high-level news or mathematics discussion.

**Reasoning Chain**\n1. detect any gambling-specific terminology or imagery,
2. verify commercial intent to promote betting,
3. distinguish between gameplay and real-money wagering,
4. examine platform and audience signals,
5. determine whether a policy action is required.

**Final Decision Policy**\n- block or warn on explicit betting promotions aimed at jurisdictions or minors,
- warn on general gambling-related content if the platform restricts it,
- allow if the content is informational, regulatory, or historical without promotional intent.

---

### 3.6 Casino Advertisement

**Concept**
- Promotional content specifically advertising casino venues, online casino platforms, or casino-like services.

**Attributes**
- promotional messaging,
- large jackpot or bonus claims,
- brand logos of casinos,
- imagery of casino floors, dealers, and slot machines,
- incentive phrases like "sign up", "get your bonus".

**Context**
- targeted ads,
- influencer sponsorships,
- online casino landing pages.

**Intent**\n- convert viewers into bettors,
- drive registration and deposit,
- increase traffic for gambling operators.

**Evidence**
- text: "sign up now", "bonus code", "free spins",
- metadata: sponsored content,
- visual: bright promotional design,
- platform: ad placements.

**Uncertainty**
- whether the promotion is for a legal jurisdiction,
- whether the target audience is adult only,
- whether the ad is satirical or critical.

**Edge Cases**
- a news segment showing a casino advertisement,
- a criticism of casino marketing,
- a historical account of gambling advertising.

**Exceptions**
- journalism or research analyzing casino marketing,
- responsible gambling awareness campaigns.

**Confidence Rules**
- >0.8 for direct promotional calls to action,
- 0.6–0.8 for indirect casino branding,
- <0.6 for neutral reporting or analysis.

**Reasoning Chain**\n1. identify promotional phrases and casino imagery,
2. determine if the message is a call to wager or register,
3. assess jurisdiction and age-targeting risk,
4. evaluate whether the content is analytical rather than promotional,
5. decide block/warn/allow.

**Final Decision Policy**\n- block or warn if it is a direct casino ad aimed at minors or restricted regions,
- warn if it is adult-targeted but platform policies require moderation,
- allow if the content is analysis or responsible gambling coverage.

---

### 3.7 Betting

**Concept**
- Content related to placing bets outside of casino environments, such as sports betting, fantasy sports, or prediction markets.

**Attributes**
- bet sizes, odds, spreads,
- sports betting terms,
- references to bookmakers,
- mobile betting app interfaces.

**Context**
- sports feeds,
- betting tipsters,
- fantasy league promotions.

**Intent**\n- persuade users to bet,
- sell betting advice,
- attract deposits.

**Evidence**
- text: "place your bets", "parlay", "spread", "over/under",
- visuals: betting slips, sports lines,
- metadata: sports, prediction market.

**Uncertainty**
- whether the content is educational about odds,
- whether it is a news summary of betting outcomes,
- whether it is fantasy competition rather than real wagering.

**Edge Cases**
- sports journalism discussing bookmakers,
- academic analysis of probability,
- fan discussion of pool results.

**Exceptions**
- responsible betting awareness,
- gambling addiction resources,
- non-monetary prediction contests.

**Confidence Rules**
- >0.75 if there is a direct call to wager with real money,
- 0.5–0.75 for commentary or advice about betting,
- <0.5 for neutral sports reporting.

**Reasoning Chain**\n1. identify explicit betting vocabulary,
2. separate monetary wagering from entertainment discussion,
3. check for promotional intent,
4. assess whether content targets underage or restricted audiences,
5. set policy.

**Final Decision Policy**\n- block if it is an explicit real-money bet solicitation aimed at minors or restricted locales,
- warn if it is adult-oriented betting advice,
- allow if it is neutral news or analysis without promotional call.

---

### 3.8 Scam

**Concept**
- Content designed to deceive, defraud, or mislead users for financial gain or personal data extraction.

**Attributes**
- false promises,
- phishing-like wording,
- get-rich-quick claims,
- fake endorsements,
- urgent or fear-based messaging.

**Context**
- email and message scams,
- fake shopping or service offers,
- investment fraud,
- impersonation of trusted brands.

**Intent**\n- obtain money,
- obtain credentials,
- manipulate victims,
- install malware.

**Evidence**
- text: "you won", "urgent action required", "limited time offer",
- visual: fake logos, cloned websites,
- metadata: unknown sender, spoofed domain,
- behavioral: inconsistent domain name, mismatched links.

**Uncertainty**
- high-pressure marketing can resemble legitimate offers,
- copycat branding in satire or parody,
- new scam formats with similar wording,
- poor translations that make tone ambiguous.

**Edge Cases**
- legitimate sweepstakes and promotions,
- editorial reporting on scams,
- government warnings about fraud,
- training exercises.

**Exceptions**
- consumer education about scams,
- verified financial promotions from reputable institutions,
- security awareness content.

**Confidence Rules**\n- >0.8 if there is fraudulent intent and evidence of deception,
- 0.6–0.8 if the content is suspicious but not definitively malicious,
- <0.6 if the content is likely educational or legitimately promotional.

**Reasoning Chain**\n1. identify deceptive language and false claims,
2. verify source authenticity and domain trust,
3. examine evidence of monetary or data theft intent,
4. distinguish educational coverage from actual scam content,
5. determine action.

**Final Decision Policy**\n- block if it is a likely scam with direct malicious intent,
- warn if it is suspicious but could be a scam-like promotion,
- allow only if it is clearly educational or legitimate.

---

### 3.9 Phishing

**Concept**
- A specific subclass of scam where the attacker impersonates a trusted entity to steal credentials or sensitive data.

**Attributes**
- spoofed sender or URL,
- login/account recovery language,
- urgent security warnings,
- mismatched display names and links.

**Context**
- email, chat, website, or SMS channels,
- corporate account notifications,
- payment confirmation requests.

**Intent**\n- capture credentials,
- trick users into providing personal data,
- redirect to fake login pages.

**Evidence**
- domain mismatch,
- fake login forms,
- text: "verify your account", "confirm password", "unauthorized login",
- visual: brand impersonation.

**Uncertainty**
- legitimate security notices can read similar,
- training or awareness content may intentionally mimic phishing,
- benign password reset pages.

**Edge Cases**
- a security team simulation,
- a phishing awareness poster,
- a developer tutorial about phishing,
- a real system notification with urgent language.

**Exceptions**
- verified IT communications,
- security awareness and training materials,
- reported phishing examples used for education.

**Confidence Rules**
- >0.85 with spoofed domain and credential request,
- 0.6–0.85 for suspicious warning language without clear impersonation,
- <0.6 for legitimate security advisories.

**Reasoning Chain**\n1. detect impersonation signals in sender/link,
2. verify whether credentials or data are requested,
3. check whether the content is training or awareness,
4. evaluate the context and destination domains,
5. map to action.

**Final Decision Policy**\n- block if the item is an active credential-harvesting phishing attempt,
- warn if it is suspicious and could trick the user,
- allow if it is a legitimate security communication or educational sample.

---

### 3.10 Violence

**Concept**
- Content depicting or promoting physical harm, injury, threats, abuse, or self-directed violence.

**Attributes**
- violent actions,
- weapons,
- physical harm,
- threats,
- blood or injury imagery.

**Context**
- news reports,
- combat footage,
- abuse documentation,
- video games,
- self-harm content.

**Intent**\n- portray harm,
- intimidate,
- advocate violence,
- report events.

**Evidence**
- text: "kill", "attack", "beat", "hurt",
- visual: fighting, weapons, injuries,
- audio: screams, threats,
- metadata: violence warnings.

**Uncertainty**
- action scenes vs. documentary,
- self-defense vs. attack,
- historical reenactments,
- metaphorical violence in language.

**Edge Cases**
- sports combat coverage,
- police training footage,
- theatrical special effects,
- metaphorical violence in politics.

**Exceptions**
- news and documentary reporting,
- medical training or emergency response,
- self-defense education.

**Confidence Rules**\n- >0.8 for graphic violence or active harm,
- 0.6–0.8 for implied violence or non-graphic threats,
- <0.6 for neutral reporting or reenactments with clear context.

**Reasoning Chain**\n1. identify violent content and target,
2. determine whether the content promotes or merely reports violence,
3. check intent and audience,
4. evaluate platform appropriateness,
5. choose the policy action.

**Final Decision Policy**\n- block graphic or abusive violence when not clearly news or training,
- warn or blur when violence is present in adult-oriented or entertainment contexts,
- allow reporting and educational content with sufficient contextualization.

---

### 3.11 Medical Nudity

**Concept**
- Nudity presented in a medical, clinical, or health education context.
- Intended for diagnosis, treatment, or learning rather than erotic appeal.

**Attributes**
- anatomical or clinical setting,
- medical instruments,
- professional attire,
- educational captions,
- absence of erotic framing.

**Context**
- health tutorials,
- clinical imagery,
- surgical education,
- telemedicine.

**Intent**\n- inform,
- diagnose,
- teach,
- illustrate medical conditions.

**Evidence**
- text: "surgery", "medical exam", "doctor", "clinic",
- visual: examination room, medical tools,
- metadata: health, medical education,
- actor: healthcare professional.

**Uncertainty**
- whether the medical imagery is sensationalized,
- whether the audience is appropriate,
- whether the content is truly educational.

**Edge Cases**
- a clinical image shared in a gossip forum,
- a medical textbook page in a public chat,
- a documentary with both medical and erotic footage.

**Exceptions**
- proper medical education content,
- clinical consultations with patient consent,
- health awareness campaigns.

**Confidence Rules**
- >0.8 if medical context is unambiguous and non-sexual,
- 0.6–0.8 for borderline cases with mixed intent,
- <0.6 if erotic framing is present.

**Reasoning Chain**\n1. detect medical terminology and setting,
2. confirm absence of deliberate erotic emphasis,
3. check for professional or instructional framing,
4. differentiate medical nudity from erotic partial nudity,
5. apply an appropriate allow or warn decision.

**Final Decision Policy**\n- allow medical nudity when the clinical or educational motive is clear,
- warn if the presentation is overly graphic but still educational,
- block only when the imagery is used for erotic or pornographic purposes.

---

### 3.12 Artistic Nudity

**Concept**
- Nudity used in an artistic, cultural, or creative expression, not primarily meant to arouse.

**Attributes**
- art gallery or museum context,
- references to artists, sculpture, painting,
- classical or contemporary art style,
- absence of erotic captions.

**Context**
- fine art, photography, sculpture,
- cultural criticism,
- museum exhibits.

**Intent**\n- express,
- evoke aesthetic response,
- explore the human form,
- educate about art.

**Evidence**
- text: "art", "gallery", "museum", "photography",
- visual: composition, non-sexual gaze,
- metadata: art, culture,
- platform: art community.

**Uncertainty**
- whether the art is erotic art or explicit pornography,
- whether the audience is age-appropriate,
- whether the image is used in a sexualized way outside its original context.

**Edge Cases**
- an art museum promotion with sensual photos,
- a contemporary art piece intentionally erotic,
- a cultural study of the nude in society.

**Exceptions**
- explicit erotic art may still be moderated depending on platform,
- art education without clear protective context.

**Confidence Rules**\n- >0.7 if the content is clearly framed as art,
- 0.5–0.7 for ambiguous visual style,
- <0.5 when erotic intent appears likely.

**Reasoning Chain**\n1. identify art-related signals,
2. evaluate whether nudity is a subject rather than an object,
3. check audience and platform restrictions,
4. compare to pornography and partial nudity rules,
5. decide whether to allow, warn, or block.

**Final Decision Policy**\n- allow if the art context is strong and the content is not pornographic,
- warn if the content is adult artistic material on a mixed-audience platform,
- block only when artistic intent is insufficient and erotic explicitness prevails.

---

### 3.13 Educational Content

**Concept**
- Content intended to teach, explain, or inform on topics that may include sensitive material.

**Attributes**
- pedagogical language,
- explicit mention of training, learning, or tutorial,
- structured format,
- neutral tone.

**Context**
- classrooms,
- online courses,
- tutorials,
- informational websites.

**Intent**\n- educate,
- explain,
- raise awareness,
- demonstrate.

**Evidence**
- text: "how to", "lesson", "tutorial", "explain",
- visual: diagrams, whiteboards,
- metadata: education, course,
- citations and references.

**Uncertainty**
- whether the content is disguised adult material,
- whether the educational context is credible,
- whether the content is for children or adults.

**Edge Cases**
- sex education delivered with suggestive imagery,
- religious instruction on sensitive topics,
- documentaries with both graphic and educational content.

**Exceptions**\n- legitimate academic and clinical education,
- public service announcements,
- professional training content.

**Confidence Rules**
- >0.7 if educational framing is explicit and consistent,
- 0.5–0.7 for mixed messages,
- <0.5 if the content appears sensationalized.

**Reasoning Chain**\n1. identify educational markers,
2. verify whether sensitive content is being presented responsibly,
3. check for appropriate audience and context,
4. determine whether any sensitive elements require moderation,
5. select the least restrictive policy that preserves safety.

**Final Decision Policy**\n- allow educational content with clear learning intent,
- warn if the educational content includes mature or graphic material,
- block only if the content is educational in name but pornographic in practice.

---

### 3.14 Religious Content

**Concept**
- Content whose primary focus is faith, worship, ritual, or spiritual teaching.

**Attributes**
- religious language,
- sacred symbols,
- worship settings,
- scripture references,
- moral guidance.

**Context**
- sermons,
- religious study materials,
- faith-based communities,
- cultural rituals.

**Intent**\n- inspire,
- teach spiritual principles,
- critique religious practices,
- provide guidance.

**Evidence**
- text: deity names, prayer, worship,
- visual: clerical attire, places of worship,
- metadata: religion, faith,
- audience: religious group.

**Uncertainty**
- religious material can include nudity or violence in cultural stories,
- satire or criticism may appear religious but have different intent,
- religious contexts vary widely across cultures.

**Edge Cases**
- religious depictions of creation myths with nudity,
- moral discussions of sexual behavior,
- faith-based health advice.

**Exceptions**
- faith-based counseling,
- interfaith education,
- religious art and history.

**Confidence Rules**
- >0.7 when the content is primarily devotional or educational,
- 0.5–0.7 for critical or ambiguous religious material,
- <0.5 when the religious context is used to justify harmful behavior.

**Reasoning Chain**\n1. identify religious signals,
2. determine if the content is spiritual education or moral commentary,
3. evaluate whether sensitive elements are symbolic or actual harm,
4. assess audience and cultural context,
5. choose the appropriate moderation action.

**Final Decision Policy**\n- allow religious content if it is primarily faith-based and not exploitative,
- warn if religious imagery includes mature material in mixed-audience settings,
- block only if religion is being used as a vehicle for explicit harm or abuse.

---

### 3.15 Children Safety

**Concept**
- Any content that affects the safety, wellbeing, or rights of minors.
- Includes sexualization, abuse, exploitation, self-harm, dangerous behavior, or targeted manipulation.

**Attributes**
- child appearance,
- school or playground settings,
- content targeted to minors,
- references to parenting or guardianship.

**Context**
- family content,
- children’s media,
- educational apps,
- child protection resources.

**Intent**\n- protect,
- educate guardians,
- exploit,
- manipulate minors.

**Evidence**
- text: "kid", "child", "teen", "school",
- visual: children in uniforms, playgrounds,
- metadata: kids content,
- warnings: child safety flag.

**Uncertainty**
- age estimation errors,
- teenage vs. adult distinction,
- caretaker context vs. predatory context,
- cultural differences in age-related portrayal.

**Edge Cases**
- family beach photos with swimwear,
- educational content on puberty,
- young athletes in sports coverage,
- minors in medical treatment.

**Exceptions**\n- legitimate child education,
- children’s news,
- harmless family moments.

**Confidence Rules**
- >0.85 when sexual or exploitive content involves minors,
- 0.7–0.85 when child safety risk is present but unconfirmed,
- <0.7 when the age context is ambiguous or clearly benign.

**Reasoning Chain**\n1. identify minor-related signals,
2. determine whether there is a safety or exploitation risk,
3. verify the presence of sexual, violent, or manipulative intent,
4. apply a conservative policy when minors are implicated,
5. favor protection and reduction of harm.

**Final Decision Policy**\n- block child sexualization, abuse, or exploitation content,
- warn or blur potentially risky minor-related content,
- allow benign children’s content with appropriate age-based classification.

---

### 3.16 Social Media

**Concept**
- Content created for or shared on social platforms, carrying norms and signals specific to social interaction.

**Attributes**
- posts, comments, likes, shares,
- hashtags, mentions,
- influencer language,
- social-native formatting.

**Context**
- conversational tone,
- viral or trending themes,
- community norms,
- platform moderation categories.

**Intent**\n- engage,
- persuade,
- entertain,
- influence.

**Evidence**\n- text: social slang and tags,
- metadata: platform source,
- visual: story format, feed cards,
- behavioral: comment threads.

**Uncertainty**
- platform-specific slang,
- context lost outside the social thread,
- memes and irony.

**Edge Cases**
- curated promotional posts,
- platform-wide challenges,
- private group communications.

**Exceptions**\n- platform-native support content,
- benign community announcements.

**Confidence Rules**
- >0.75 for adult-targeted risky content on social feeds,
- 0.5–0.75 for ambiguous viral posts,
- <0.5 for clearly supportive or informative social content.

**Reasoning Chain**\n1. detect social media structure,
2. infer audience and post intent,
3. evaluate how the platform amplifies or normalizes the content,
4. integrate social metadata into the final policy,
5. decide action.

**Final Decision Policy**\n- apply platform-aware moderation such as warning for borderline social posts,
- allow benign social interactions,
- block harmful social content that violates safety norms.

---

### 3.17 YouTube

**Concept**
- Video content on YouTube with platform-specific features like titles, descriptions, comments, thumbnails, and community guidelines.

**Attributes**
- video metadata,
- thumbnail visuals,
- comments,
- channel type,
- age restriction flags.

**Context**
- video publishing,
- creator channels,
- ad-supported or sponsored content.

**Intent**\n- entertain,
- inform,
- monetize,
- persuade.

**Evidence**\n- title/description: keywords like "tutorial", "reaction", "vlog",
- thumbnail: imagery framed to attract clicks,
- comments: audience reaction,
- channel indicators: education, entertainment.

**Uncertainty**
- clickbait titles,
- seemingly innocent thumbnails that hide explicit video,
- mixed-content channels.

**Edge Cases**
- educational documentaries with explicit footage,
- music videos with suggestive imagery,
- live streams with unpredictable content.

**Exceptions**\n- clearly labeled educational or news segments,
- age-gated explanatory content.

**Confidence Rules**\n- >0.8 for explicit violations in the video or thumbnail,
- 0.6–0.8 for high-risk but contextualized content,
- <0.6 for mainstream or informational YouTube content.

**Reasoning Chain**
1. collect video metadata and thumbnail cues,
2. analyze the video’s stated purpose and audience,
3. determine whether YouTube’s platform signals support a safe exception,
4. integrate across modalities,
5. action based on both content and platform policy.

**Final Decision Policy**\n- block or age-restrict explicit content if YouTube policies require it,
- allow educational, documentary, or creative content with proper labeling,
- warn if the content is likely harmful but not obviously policy-violating.

---

### 3.18 TikTok

**Concept**
- Short-form video content with trends, music, editing, and youth-oriented culture.

**Attributes**
- vertical video format,
- trending hashtags,
- music-driven content,
- challenges.

**Context**
- viral challenges,
- influencer marketing,
- youth culture and memes.

**Intent**\n- entertain,
- trend,
- advertise,
- influence.

**Evidence**
- hashtags: #foryou, #trend,
- audio clips: popular songs,
- editing style: jump cuts, filters,
- comment style: meme language.

**Uncertainty**
- youth audience by default,
- satire and irony,
- platform-specific slang.

**Edge Cases**
- sound-alike audio used for adult material,
- dance challenges that border on sexual suggestiveness,
- socially motivated activism content.

**Exceptions**\n- trend analysis,
- dance tutorials,
- harmless comedy.

**Confidence Rules**\n- >0.8 when sexual or harmful intent is explicit in short-form format,
- 0.6–0.8 for ambiguous trending content,
- <0.6 for mainstream creative TikToks.

**Reasoning Chain**
1. identify TikTok-specific metadata and format,
2. determine audience maturity,
3. infer whether the content is trend-driven or promotional,
4. evaluate whether the platform context amplifies risk,
5. decide on moderation.

**Final Decision Policy**\n- block harmful TikTok content that targets minors or violates platform safety,
- warn or blur suggestive or risky trends,
- allow benign creative and informative content.

---

### 3.19 Instagram

**Concept**
- Visual-first social content with images, short videos, stories, and influencer marketing.

**Attributes**
- aesthetic photography,
- hashtags,
- sponsored content labels,
- user-generated captions.

**Context**
- lifestyle posts,
- brand promotions,
- personal storytelling.

**Intent**\n- share,
- brand,
- influence,
- express.

**Evidence**
- captions and hashtags,
- image style,
- account type,
- story or reel format.

**Uncertainty**
- curated fashion content can appear suggestive,
- influencer marketing may mix safe and adult themes,
- sponsored tags can mask intent.

**Edge Cases**
- fitness influencers in activewear,
- art exhibitions shared through Instagram,
- beauty ads with borderline sensuality.

**Exceptions**\n- legitimate brand storytelling,
- body-positive campaigns,
- photojournalism.

**Confidence Rules**
- >0.75 for direct erotic or harmful Instagram content,
- 0.5–0.75 for borderline fashion or lifestyle posts,
- <0.5 for purely personal or art-oriented posts.

**Reasoning Chain**\n1. identify Instagram format and social signals,
2. determine whether the content is personal, commercial, or promotional,
3. evaluate whether the imagery is sexualized or harmful,
4. check platform and audience context,
5. map to action.

**Final Decision Policy**\n- block or warn harmful influencer or promotional posts,
- allow body-positive and lifestyle content that is non-exploitative,
- apply stricter moderation when minors are likely involved.

---

## 4. Cross-Category Reasoning Rules

### 4.1 Conflict Resolution

When multiple categories are active:

- prioritize child safety over all else,
- prioritize explicit harmful content over suggestive or artistic labels,
- allow exceptions only when evidence strongly supports the exception,
- use a weighted policy matrix when categories overlap.

### 4.2 Evidence Aggregation

- strong evidence from multiple modalities should dominate weak evidence from a single signal,
- contradictory evidence triggers uncertainty and a lower confidence score,
- missing modalities should not produce a final block unless explicit harmful evidence is already strong.

### 4.3 Platform Sensitivity

- social media content should be judged more conservatively,
- platform-specific norms (YouTube, TikTok, Instagram) influence whether an adult or suggestive post is allowed,
- user-generated content is more likely to require warning than professional media.

### 4.4 Exception Hierarchy

1. medical education
2. artistic expression
3. religious content
4. scholarly or news reporting
5. private or consented contexts

Each exception requires explicit evidence and should only override a harmful category when the evidence is as strong as the harmful signals.

### 4.5 Confidence Thresholds

- **block** if confidence > 0.75 and there is strong supporting evidence,
- **warn/blur** if confidence is 0.5–0.75 or if the harm is not explicit,
- **allow** if confidence < 0.5 and safe or exception evidence is strong,
- **request_more_analysis** if evidence is conflicting or critical modalities are missing.

---

## 5. Applying the Taxonomy in NIEX

NIEX should store this taxonomy as its permanent reasoning knowledge base and use it to guide:

- modality analyzers,
- context builders,
- intent classifiers,
- evidence scorers,
- contradiction detectors,
- final policy decisions.

This document should be referenced by all policy rules, model prompt engineering, and reasoning chain orchestration.

---

## 6. Maintenance

- Review and update the taxonomy as platforms, language, and policy requirements evolve.
- Add new categories when new harmful content forms emerge.
- Keep the same structure for each category to ensure consistent reasoning and auditability.
