---
id: ni_ex/clothing_context_multimodal_v1
source: NIEX
provenance: "authored:ni_ex_team"
confidence: 0.72
category: clothing
tags: [clothing, multimodal, contextual]
---

# NIEX: Multimodal Clothing Context Guidance

Summary:
- Clothing appearance alone is neutral. This knowledge entry documents contextual modifiers that change interpretation when combined with pose, movement, camera framing, or temporal persistence.

Key contextual modifiers:
- Pose alignment: clothing that reveals body contours may be neutral in sports or fashion, but becomes suggestive when combined with explicit pose+camera framing patterns.
- Movement transitions: rapid clothing transitions or changes in visible skin percentage across frames are context signals, not direct harm labels.
- Camera framing: repeated low-angle or tight lower-body framing increases interpretive weight when other signals align.

Safe contexts (do not signal harm):
- Sports, fitness, medical, artistic/editorial, documentary contexts where intent is informational or demonstrative.

Examples (non-explicit):
- Safe: athletic swimwear shown in sports training with neutral framing.
- Ambiguous: fashion editorial with brief close-ups; context and sequence determine interpretation.
- High-risk pattern: clothing transitions + persistent lower-body framing + suggestive captions/hashtags.

Provenance: authored by NIEX safety team. Use as contextual modifiers, not hard rules.
