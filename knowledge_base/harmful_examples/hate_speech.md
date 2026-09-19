# Hate Speech and Discrimination

## Category
Hate speech targeting groups based on race, religion, gender, orientation, ethnicity.

## Example Phrases

### Racial slurs and discrimination
- racist jokes blacks
- white supremacist ideology
- ethnic cleansing reasons
- great replacement theory
- racial purity goals
- segregation arguments justification
- jim crow nostalgia
- n-word casual use
- slur compilation video

### Religious hatred
- islamophobia jokes muslim
- antisemitic jewish conspiracy
- hindu nationalist violence
- christian persecution complex
- atheist mocking believers
- ban religion from public

### Anti-LGBTQ+
- transphobic jokes content
- gay slur compilation
- conversion therapy success
- groomer accusation lgbtq
- trans women not women
- pride is degeneracy
- homosexuality unnatural arguments

### Misogyny
- women belong kitchen
- female inferiority arguments
- incel manifesto blackpill
- mra red pill ideology
- domestic violence justification
- women can't drive jokes
- get back to kitchen
- feminazi insult

### Ethnic stereotypes
- ethnic group stereotype jokes
- nationality based insults
- immigrant blame everything
- xenophobic content
- migrant crime fearmongering

### Group violence calls
- kill all members of group
- gas the [slur]
- send back to country
- final solution applied to
- exterminate target group

### Ableism
- retard insult casual
- disabled people leeches
- autism is fake
- mental illness made up
- depression weakness

## Uzbek
- millat haqorat
- diniy haqorat
- jinsiy diskriminatsiya
- guruh nafrat
- millatchilik haqorat

## Russian
- расистские шутки
- националистический контент
- межнациональная вражда
- религиозная ненависть

## Slurs Pattern Detection
Direct slurs (avoid listing actual slurs in training data, but pattern-match):
- N-word variations (n*gger, n*gga, n!gga)
- Anti-Asian slurs (ch*nk, g**k)
- Anti-Arab slurs (s*nd n*gger, t*welhead)
- Anti-Hispanic (b*aner, sp*c, w*tback)
- Anti-LGBTQ (f*g, f*ggot, tr*nny, d*ke)
- Anti-Jewish (k*ke, h*b)
- Anti-Roma (g*psy as slur)
- Anti-women (b*tch, c*nt in misogynistic context)
- Anti-disabled (r*tard, sp*z)

## Detection Logic
Hate speech detected when:
1. Slur used in attack context (not reclamation)
2. Generalized negative claims about group
3. Calls for violence against group
4. Dehumanizing language ("vermin", "rats", "subhuman")
5. Conspiracy theories targeting group

NOT hate speech when:
1. Educational discussion ABOUT hate speech
2. Marginalized community reclaiming slur (context-dependent)
3. News reporting on hate incidents
4. Counter-speech and de-radicalization content

## Context
Hate speech is harmful when:
- Targeting protected groups
- Calling for discrimination or violence
- Using slurs in attack mode
- Reinforcing harmful stereotypes
- Promoting supremacist ideologies

Hate speech IS NOT:
- Academic critique of religion or ideology
- Criticism of specific people's actions
- Comedy that punches up (context-sensitive)
- Quoting hate speech for educational refutation

Default: BLOCK direct hate speech. CAREFUL with edge cases (comedy, news, education).
