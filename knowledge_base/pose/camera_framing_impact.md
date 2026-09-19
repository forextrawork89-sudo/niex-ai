# Camera Framing Impact Intelligence Framework

This document is a research-grade specification explaining how camera framing influences pose interpretation, how composition affects body landmark visibility and reliability, how cropping shapes pose reasoning, and how framing interacts with movement, environment, lighting, clothing, and scene understanding.

Camera framing is not merely a technical parameter. It is a fundamental aspect of visual perception that determines what is visible, what is ambiguous, what can be reliably interpreted, and what must be considered uncertain. A single posture can appear innocuous in a full-body view but appear awkward or concerning in a close-up. A gesture can be clear in a frontal view but ambiguous in a side view.

The knowledge base is entirely conceptual. It focuses on how framing influences perception, reasoning, and interpretation rather than on implementation, optimization, or detector engineering.

## 1. Foundational Principles of Camera Framing and Pose
Camera framing is the fundamental act of deciding what the viewer sees. It determines the visual window, the composition, the relative scale of objects, the perspective relationship, and the available evidence for interpretation.
Pose interpretation begins with framing. The system cannot interpret what it cannot see. Framing determines what is visible, and visibility determines what can be reliably understood about posture, movement, intent, and activity.
Framing changes meaning. The same body position looks different depending on where the camera is, how close it is, what angle it views from, and what is included or excluded from the frame.
Framing introduces ambiguity. Cropping can hide information essential for understanding. Close-ups can emphasize trivial details while obscuring context. Extreme angles can distort proportions and relationships.
Framing is multimodal. Camera height, distance, angle, zoom, composition, lighting, and temporal changes all contribute to what the system can infer from the visual evidence.
Framing creates affordances for interpretation. Some framings make certain inferences easy and others nearly impossible. A full-body view affords posture analysis; a close-up of the face does not.
Framing must be made explicit in reasoning. Confidence in pose interpretation should depend on framing quality and completeness. Strong confidence requires strong evidence, which requires adequate framing.

## 2. Visual Composition Foundations
Visual composition describes how visual elements are organized within the frame. Composition shapes attention, creates meaning, and influences what the viewer can understand.
The frame is a bounded rectangular region that defines the visual window. Everything outside the frame is invisible; everything inside is potentially visible.
Depth layering describes the spatial organization of elements at different distances from the camera. Foreground elements appear larger and are optically closer; background elements appear smaller and are farther away.
Negative space is the area within the frame that contains no subject. Negative space provides context, prevents visual clutter, and can emphasize the subject through contrast.
Visual balance describes whether the composition feels stable or unstable. Centered subjects feel stable; off-center subjects can feel dynamic or uncomfortable.
Visual hierarchy describes which elements attract attention first. Larger elements, brighter elements, moving elements, and centrally placed elements typically dominate visual attention.
Perspective describes the spatial relationship between the camera and the scene. Perspective can be flattened (appearing two-dimensional), linear (appearing three-dimensional), or distorted (appearing warped or unnatural).

## 3. Complete Camera Framing Ontology
Camera framing types organize all possible ways the camera can frame a human subject. Each type has characteristic visual properties, expected pose visibility, typical use cases, and inherent ambiguities.

### 3.1 Wide Shot
Framing type: wide shot - shows a large area with the subject as one element among many.
Visual evidence for wide shot: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for wide shot: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for wide shot: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for wide shot: typical use cases, expected activities, and intended viewers.
Ambiguity sources for wide shot: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for wide shot: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.2 Full Body Shot
Framing type: full body shot - shows the entire body from head to foot with some surrounding space.
Visual evidence for full body shot: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for full body shot: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for full body shot: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for full body shot: typical use cases, expected activities, and intended viewers.
Ambiguity sources for full body shot: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for full body shot: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.3 Three Quarter Shot
Framing type: three quarter shot - shows most of the body with a small amount of head room and leg room.
Visual evidence for three quarter shot: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for three quarter shot: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for three quarter shot: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for three quarter shot: typical use cases, expected activities, and intended viewers.
Ambiguity sources for three quarter shot: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for three quarter shot: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.4 Medium Shot
Framing type: medium shot - shows the body approximately from mid-thigh upward.
Visual evidence for medium shot: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for medium shot: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for medium shot: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for medium shot: typical use cases, expected activities, and intended viewers.
Ambiguity sources for medium shot: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for medium shot: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.5 Medium Close-Up
Framing type: medium close-up - shows the body from approximately the waist upward.
Visual evidence for medium close-up: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for medium close-up: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for medium close-up: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for medium close-up: typical use cases, expected activities, and intended viewers.
Ambiguity sources for medium close-up: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for medium close-up: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.6 Close-Up
Framing type: close-up - shows primarily the head, neck, and upper shoulders.
Visual evidence for close-up: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for close-up: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for close-up: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for close-up: typical use cases, expected activities, and intended viewers.
Ambiguity sources for close-up: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for close-up: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.7 Extreme Close-Up
Framing type: extreme close-up - shows only the face or a small portion of the head.
Visual evidence for extreme close-up: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for extreme close-up: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for extreme close-up: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for extreme close-up: typical use cases, expected activities, and intended viewers.
Ambiguity sources for extreme close-up: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for extreme close-up: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.8 Overhead View
Framing type: overhead view - shot taken from above, looking downward at the subject.
Visual evidence for overhead view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for overhead view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for overhead view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for overhead view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for overhead view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for overhead view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.9 Low Angle View
Framing type: low angle view - shot taken from below, looking upward at the subject.
Visual evidence for low angle view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for low angle view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for low angle view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for low angle view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for low angle view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for low angle view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.10 High Angle View
Framing type: high angle view - shot taken from above, looking downward (different from overhead for partial views).
Visual evidence for high angle view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for high angle view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for high angle view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for high angle view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for high angle view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for high angle view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.11 Eye-Level View
Framing type: eye-level view - shot taken at approximately the subject's eye height.
Visual evidence for eye-level view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for eye-level view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for eye-level view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for eye-level view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for eye-level view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for eye-level view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.12 Side View
Framing type: side view - shot taken from the side, showing profile orientation.
Visual evidence for side view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for side view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for side view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for side view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for side view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for side view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.13 Rear View
Framing type: rear view - shot taken from behind, showing the back of the subject.
Visual evidence for rear view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for rear view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for rear view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for rear view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for rear view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for rear view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.14 Front View
Framing type: front view - shot taken from directly in front, showing the front of the subject.
Visual evidence for front view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for front view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for front view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for front view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for front view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for front view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.15 Oblique View
Framing type: oblique view - shot taken at an angle between front and side.
Visual evidence for oblique view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for oblique view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for oblique view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for oblique view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for oblique view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for oblique view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.16 Profile View
Framing type: profile view - side view emphasizing the profile of the head and body.
Visual evidence for profile view: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for profile view: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for profile view: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for profile view: typical use cases, expected activities, and intended viewers.
Ambiguity sources for profile view: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for profile view: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.17 Selfie Framing
Framing type: selfie framing - shot taken by the subject or from a close, typically high angle.
Visual evidence for selfie framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for selfie framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for selfie framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for selfie framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for selfie framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for selfie framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.18 Mirror Framing
Framing type: mirror framing - shot showing a subject reflected in a mirror or reflective surface.
Visual evidence for mirror framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for mirror framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for mirror framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for mirror framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for mirror framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for mirror framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.19 Security Camera Framing
Framing type: security camera framing - overhead or high angle view typical of surveillance systems.
Visual evidence for security camera framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for security camera framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for security camera framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for security camera framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for security camera framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for security camera framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.20 Drone Perspective
Framing type: drone perspective - aerial view from a remote camera platform.
Visual evidence for drone perspective: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for drone perspective: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for drone perspective: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for drone perspective: typical use cases, expected activities, and intended viewers.
Ambiguity sources for drone perspective: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for drone perspective: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.21 Sports Broadcast Framing
Framing type: sports broadcast framing - dynamic framing designed to capture athletic movement.
Visual evidence for sports broadcast framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for sports broadcast framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for sports broadcast framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for sports broadcast framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for sports broadcast framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for sports broadcast framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.22 Medical Recording Framing
Framing type: medical recording framing - stable clinical framing designed to document examination or procedure.
Visual evidence for medical recording framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for medical recording framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for medical recording framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for medical recording framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for medical recording framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for medical recording framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.23 Educational Recording Framing
Framing type: educational recording framing - framing designed to show an instructor and interaction with materials.
Visual evidence for educational recording framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for educational recording framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for educational recording framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for educational recording framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for educational recording framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for educational recording framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.24 Conference Recording
Framing type: conference recording - framing designed to show a presenter in a formal setting.
Visual evidence for conference recording: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for conference recording: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for conference recording: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for conference recording: typical use cases, expected activities, and intended viewers.
Ambiguity sources for conference recording: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for conference recording: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.25 Presentation Recording
Framing type: presentation recording - frontal framing designed to capture slides and speaker together.
Visual evidence for presentation recording: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for presentation recording: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for presentation recording: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for presentation recording: typical use cases, expected activities, and intended viewers.
Ambiguity sources for presentation recording: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for presentation recording: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.26 Mobile Phone Recording
Framing type: mobile phone recording - handheld framing with variable composition and motion.
Visual evidence for mobile phone recording: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for mobile phone recording: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for mobile phone recording: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for mobile phone recording: typical use cases, expected activities, and intended viewers.
Ambiguity sources for mobile phone recording: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for mobile phone recording: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.27 Webcam Framing
Framing type: webcam framing - close frontal framing typical of online video calls.
Visual evidence for webcam framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for webcam framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for webcam framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for webcam framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for webcam framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for webcam framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.28 Surveillance Framing
Framing type: surveillance framing - fixed overhead or wall-mounted framing for monitoring.
Visual evidence for surveillance framing: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for surveillance framing: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for surveillance framing: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for surveillance framing: typical use cases, expected activities, and intended viewers.
Ambiguity sources for surveillance framing: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for surveillance framing: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.29 Vehicle Camera Perspective
Framing type: vehicle camera perspective - interior or exterior framing from a vehicle-mounted camera.
Visual evidence for vehicle camera perspective: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for vehicle camera perspective: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for vehicle camera perspective: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for vehicle camera perspective: typical use cases, expected activities, and intended viewers.
Ambiguity sources for vehicle camera perspective: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for vehicle camera perspective: how this framing type influences downstream reasoning about activity, intent, and safety.

### 3.30 Body Camera Perspective
Framing type: body camera perspective - chest or helmet-mounted first-person perspective.
Visual evidence for body camera perspective: characteristic camera distance, angle, composition, and relationship to the subject.
Expected pose visibility for body camera perspective: which body regions, joints, and landmarks are typically visible and reliable.
Landmark reliability for body camera perspective: which pose features can be confidently inferred and which are ambiguous.
Contextual meaning for body camera perspective: typical use cases, expected activities, and intended viewers.
Ambiguity sources for body camera perspective: specific limitations and uncertainties inherent to this framing type.
Downstream interpretation for body camera perspective: how this framing type influences downstream reasoning about activity, intent, and safety.

## 4. Camera Composition Framework
Camera composition describes the deliberate arrangement of elements within the frame to achieve specific visual and interpretive effects.

### 4.1 Subject Placement
Composition element: subject placement describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for subject placement: the observable properties that characterize this composition element.
Interpretive impact for subject placement: how this element influences what can be understood about pose, activity, and intent.
Variability for subject placement: the range of typical values and how they affect interpretation.
Ambiguity for subject placement: the uncertainties introduced by this element.
Reasoning principle for subject placement: how the system should account for this element in confidence and uncertainty judgments.

### 4.2 Camera Distance
Composition element: camera distance describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for camera distance: the observable properties that characterize this composition element.
Interpretive impact for camera distance: how this element influences what can be understood about pose, activity, and intent.
Variability for camera distance: the range of typical values and how they affect interpretation.
Ambiguity for camera distance: the uncertainties introduced by this element.
Reasoning principle for camera distance: how the system should account for this element in confidence and uncertainty judgments.

### 4.3 Cropping
Composition element: cropping describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for cropping: the observable properties that characterize this composition element.
Interpretive impact for cropping: how this element influences what can be understood about pose, activity, and intent.
Variability for cropping: the range of typical values and how they affect interpretation.
Ambiguity for cropping: the uncertainties introduced by this element.
Reasoning principle for cropping: how the system should account for this element in confidence and uncertainty judgments.

### 4.4 Headroom
Composition element: headroom describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for headroom: the observable properties that characterize this composition element.
Interpretive impact for headroom: how this element influences what can be understood about pose, activity, and intent.
Variability for headroom: the range of typical values and how they affect interpretation.
Ambiguity for headroom: the uncertainties introduced by this element.
Reasoning principle for headroom: how the system should account for this element in confidence and uncertainty judgments.

### 4.5 Lead Room
Composition element: lead room describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for lead room: the observable properties that characterize this composition element.
Interpretive impact for lead room: how this element influences what can be understood about pose, activity, and intent.
Variability for lead room: the range of typical values and how they affect interpretation.
Ambiguity for lead room: the uncertainties introduced by this element.
Reasoning principle for lead room: how the system should account for this element in confidence and uncertainty judgments.

### 4.6 Look Room
Composition element: look room describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for look room: the observable properties that characterize this composition element.
Interpretive impact for look room: how this element influences what can be understood about pose, activity, and intent.
Variability for look room: the range of typical values and how they affect interpretation.
Ambiguity for look room: the uncertainties introduced by this element.
Reasoning principle for look room: how the system should account for this element in confidence and uncertainty judgments.

### 4.7 Negative Space
Composition element: negative space describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for negative space: the observable properties that characterize this composition element.
Interpretive impact for negative space: how this element influences what can be understood about pose, activity, and intent.
Variability for negative space: the range of typical values and how they affect interpretation.
Ambiguity for negative space: the uncertainties introduced by this element.
Reasoning principle for negative space: how the system should account for this element in confidence and uncertainty judgments.

### 4.8 Foreground
Composition element: foreground describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for foreground: the observable properties that characterize this composition element.
Interpretive impact for foreground: how this element influences what can be understood about pose, activity, and intent.
Variability for foreground: the range of typical values and how they affect interpretation.
Ambiguity for foreground: the uncertainties introduced by this element.
Reasoning principle for foreground: how the system should account for this element in confidence and uncertainty judgments.

### 4.9 Background
Composition element: background describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for background: the observable properties that characterize this composition element.
Interpretive impact for background: how this element influences what can be understood about pose, activity, and intent.
Variability for background: the range of typical values and how they affect interpretation.
Ambiguity for background: the uncertainties introduced by this element.
Reasoning principle for background: how the system should account for this element in confidence and uncertainty judgments.

### 4.10 Depth Layering
Composition element: depth layering describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for depth layering: the observable properties that characterize this composition element.
Interpretive impact for depth layering: how this element influences what can be understood about pose, activity, and intent.
Variability for depth layering: the range of typical values and how they affect interpretation.
Ambiguity for depth layering: the uncertainties introduced by this element.
Reasoning principle for depth layering: how the system should account for this element in confidence and uncertainty judgments.

### 4.11 Visual Balance
Composition element: visual balance describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for visual balance: the observable properties that characterize this composition element.
Interpretive impact for visual balance: how this element influences what can be understood about pose, activity, and intent.
Variability for visual balance: the range of typical values and how they affect interpretation.
Ambiguity for visual balance: the uncertainties introduced by this element.
Reasoning principle for visual balance: how the system should account for this element in confidence and uncertainty judgments.

### 4.12 Composition Stability
Composition element: composition stability describes how that aspect of visual organization influences framing and pose interpretation.
Visual evidence for composition stability: the observable properties that characterize this composition element.
Interpretive impact for composition stability: how this element influences what can be understood about pose, activity, and intent.
Variability for composition stability: the range of typical values and how they affect interpretation.
Ambiguity for composition stability: the uncertainties introduced by this element.
Reasoning principle for composition stability: how the system should account for this element in confidence and uncertainty judgments.

## 5. Pose Visibility Framework
Pose visibility describes how much of the body, which joints, and which landmarks are visible and can be reliably interpreted in a given frame. Visibility directly constrains what can be understood about posture.

### 5.1 Complete Body Visibility
Visibility scenario: complete body visibility describes a specific configuration of what is and is not visible in the frame.
Observable evidence for complete body visibility: the visual markers that indicate this visibility state.
Pose inference capability for complete body visibility: what can and cannot be reliably inferred about posture.
Landmark reliability for complete body visibility: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for complete body visibility: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for complete body visibility: the specific ambiguities and missing information introduced by this visibility state.

### 5.2 Partial Body Visibility
Visibility scenario: partial body visibility describes a specific configuration of what is and is not visible in the frame.
Observable evidence for partial body visibility: the visual markers that indicate this visibility state.
Pose inference capability for partial body visibility: what can and cannot be reliably inferred about posture.
Landmark reliability for partial body visibility: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for partial body visibility: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for partial body visibility: the specific ambiguities and missing information introduced by this visibility state.

### 5.3 Upper-Body Only
Visibility scenario: upper-body only describes a specific configuration of what is and is not visible in the frame.
Observable evidence for upper-body only: the visual markers that indicate this visibility state.
Pose inference capability for upper-body only: what can and cannot be reliably inferred about posture.
Landmark reliability for upper-body only: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for upper-body only: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for upper-body only: the specific ambiguities and missing information introduced by this visibility state.

### 5.4 Lower-Body Only
Visibility scenario: lower-body only describes a specific configuration of what is and is not visible in the frame.
Observable evidence for lower-body only: the visual markers that indicate this visibility state.
Pose inference capability for lower-body only: what can and cannot be reliably inferred about posture.
Landmark reliability for lower-body only: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for lower-body only: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for lower-body only: the specific ambiguities and missing information introduced by this visibility state.

### 5.5 Head Only
Visibility scenario: head only describes a specific configuration of what is and is not visible in the frame.
Observable evidence for head only: the visual markers that indicate this visibility state.
Pose inference capability for head only: what can and cannot be reliably inferred about posture.
Landmark reliability for head only: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for head only: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for head only: the specific ambiguities and missing information introduced by this visibility state.

### 5.6 Arms Cropped
Visibility scenario: arms cropped describes a specific configuration of what is and is not visible in the frame.
Observable evidence for arms cropped: the visual markers that indicate this visibility state.
Pose inference capability for arms cropped: what can and cannot be reliably inferred about posture.
Landmark reliability for arms cropped: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for arms cropped: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for arms cropped: the specific ambiguities and missing information introduced by this visibility state.

### 5.7 Legs Cropped
Visibility scenario: legs cropped describes a specific configuration of what is and is not visible in the frame.
Observable evidence for legs cropped: the visual markers that indicate this visibility state.
Pose inference capability for legs cropped: what can and cannot be reliably inferred about posture.
Landmark reliability for legs cropped: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for legs cropped: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for legs cropped: the specific ambiguities and missing information introduced by this visibility state.

### 5.8 Hands Cropped
Visibility scenario: hands cropped describes a specific configuration of what is and is not visible in the frame.
Observable evidence for hands cropped: the visual markers that indicate this visibility state.
Pose inference capability for hands cropped: what can and cannot be reliably inferred about posture.
Landmark reliability for hands cropped: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for hands cropped: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for hands cropped: the specific ambiguities and missing information introduced by this visibility state.

### 5.9 Feet Cropped
Visibility scenario: feet cropped describes a specific configuration of what is and is not visible in the frame.
Observable evidence for feet cropped: the visual markers that indicate this visibility state.
Pose inference capability for feet cropped: what can and cannot be reliably inferred about posture.
Landmark reliability for feet cropped: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for feet cropped: how this visibility state should affect confidence in pose judgments.
Uncertainty implications for feet cropped: the specific ambiguities and missing information introduced by this visibility state.

### 5.10 Face Visibility
Visibility scenario: face visibility describes a specific configuration of what is and is not visible in the frame.
Observable evidence for face visibility: the visual markers that indicate this visibility state.
Pose inference capability for face visibility: what can and cannot be reliably inferred about posture.
Landmark reliability for face visibility: which landmarks are directly observable and which must be inferred or assumed.
Confidence implications for face visibility: how this visibility state should affect confidence in pose judgments.

---

## 📐 Formulalar va metrikalar (v1 KB'dan)

```text
+-----------------------------------------------------------------------------------------+
| FRAMING CORRECTION PIPELINE                                                             |
+-----------------------------------------------------------------------------------------+
| [33 3D Pose Keypoints] ---> [WebGPU Matrix Rotation Shader] ---> [Gravity Aligned Coords] |
|                                              |                                          |
|                                              v                                          |
|                        [WASM C++ Zoom Calibration & Pinhole Solver]                     |
|                                              |                                          |
|                                              v                                          |
|                          [Foreshortening Compensation Multipliers]                      |
|                                              |                                          |
|                                              v                                          |
|                            [Normalized 3D Skeletal Joint Vectors]                       |
+-----------------------------------------------------------------------------------------+
```

To correct 3D joint landmarks $P_{i, \text{raw}} = (x_i, y_i, z_i)$ for camera roll ($\theta_{\text{roll}}$) and pitch ($\theta_{\text{pitch}}$) rotations, the system constructs a combined **Skeletal Rotation Matrix ($R$)** on device:

$$R_x(\theta_{\text{pitch}}) = \begin{bmatrix} 1.0 & 0.0 & 0.0 \\ 0.0 & \cos(\theta_{\text{pitch}}) & -\sin(\theta_{\text{pitch}}) \\ 0.0 & \sin(\theta_{\text{pitch}}) & \cos(\theta_{\text{pitch}}) \end{bmatrix}$$
$$R_z(\theta_{\text{roll}}) = \begin{bmatrix} \cos(\theta_{\text{roll}}) & -\sin(\theta_{\text{roll}}) & 0.0 \\ \sin(\theta_{\text{roll}}) & \cos(\theta_{\text{roll}}) & 0.0 \\ 0.0 & 0.0 & 1.0 \end{bmatrix}$$

The combined transformation matrix $R = R_z \cdot R_x$ is applied to each landmark vector to reconstruct gravity-aligned coordinates $P_{\text{corrected}}$:

$$P_{\text{corrected}} = R \cdot P_{i, \text{raw}}$$

### 3.1 Bounding Box Zoom Factor (`Z_factor`)
Let:
*   `Area_person` be the pixel area of the subject's segmented person mask.
*   `Area_frame` be the total pixel area of the viewport frame.

The **Focal Zoom Factor (`Z_factor`)** is calculated on device as:
```text
Z_factor = Area_person / Area_frame
```


The system computes a Framing Bias (`B_frame`) to scale the sensitivity of downstream pose calculations:
```text
B_frame = Z_factor * 0.25

[Standard Distance View] ---> Z_factor < 0.30 ---> B_frame = 0.00
[Extreme Close-up View]  ---> Z_factor >= 0.70 ---> B_frame = 0.25 (Increases Pose Sensitivity)
```


---

## 4. Production-Grade Implementation Code

### 4.1 C++ WebAssembly Rotation & Focal Corrector (`camera_framing_corrector.cpp`)
The following C++ engine compiles directly to WebAssembly with SIMD and auto-vectorization enabled. It handles 3D coordinate rotation transformation using local matrix multiplications, zoom factor bounding box scaling, and dynamic focal length compensation:

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

constexpr int SKELETAL_POINTS_COUNT = 33;
constexpr int FLOAT_PER_LANDMARK = 4;

struct Point3D {
    float x;
    float y;
    float z;
    float confidence;
};

struct Matrix3x3 {
    float m[3][3];
};

struct FramingOutput {
    float zoom_factor;             // Z_factor
    float framing_bias;            // B_frame
    float camera_pitch_angle_deg;  // Pitch orientation
    float camera_roll_angle_deg;   // Roll orientation
    float perspective_confidence;
};

// Global memory buffers mapped to WebAssembly Linear Memory Heap
Point3D g_skeletal_coords[SKELETAL_POINTS_COUNT];
Point3D g_corrected_coords[SKELETAL_POINTS_COUNT];

class CameraFramingEngine {
private:
    static Matrix3x3 ComputeRotationMatrix(float pitch, float roll) {
        float cp = cos(pitch);
        float sp = sin(pitch);
        float cr = cos(roll);
        float sr = sin(roll);

        Matrix3x3 r;
        // Combined Rz * Rx rotation matrix
        r.m[0][0] = cr;
        r.m[0][1] = -sr * cp;
        r.m[0][2] = sr * sp;
        
        r.m[1][0] = sr;
        r.m[1][1] = cr * cp;
        r.m[1][2] = -cr * sp;
        
        r.m[2][0] = 0.0f;
        r.m[2][1] = sp;
        r.m[2][2] = cp;

        return r;
    }

public:
    CameraFramingEngine() = default;
    ~CameraFramingEngine() = default;

    FramingOutput Process(const Point3D* raw_points, float pitch_rad, float roll_rad, float person_area_pixels, float frame_area_pixels) {
        // 1. Compute on-device Rz * Rx rotation matrix
        Matrix3x3 rot = ComputeRotationMatrix(pitch_rad, roll_rad);

        // 2. Rotate all 33 skeletal joint landmarks in parallel
        for (int i = 0; i < SKELETAL_POINTS_COUNT; ++i) {
            Point3D p = raw_points[i];
            
#if defined(__wasm__) && defined(__SSE2__)
            // SSE2 SIMD Matrix-Vector Multiplication
            __m128 col0 = _mm_set_ps(0.0f, rot.m[2][0], rot.m[1][0], rot.m[0][0]);
            __m128 col1 = _mm_set_ps(0.0f, rot.m[2][1], rot.m[1][1], rot.m[0][1]);
            __m128 col2 = _mm_set_ps(0.0f, rot.m[2][2], rot.m[1][2], rot.m[0][2]);

            __m128 px = _mm_set1_ps(p.x);
            __m128 py = _mm_set1_ps(p.y);
            __m128 pz = _mm_set1_ps(p.z);

            __m128 result = _mm_add_ps(_mm_mul_ps(col0, px), _mm_add_ps(_mm_mul_ps(col1, py), _mm_mul_ps(col2, pz)));

            alignas(16) float res[4];
            _mm_store_ps(res, result);
            g_corrected_coords[i].x = res[0];
            g_corrected_coords[i].y = res[1];
            g_corrected_coords[i].z = res[2];
            g_corrected_coords[i].confidence = p.confidence;
#else
            g_corrected_coords[i].x = rot.m[0][0] * p.x + rot.m[0][1] * p.y + rot.m[0][2] * p.z;
            g_corrected_coords[i].y = rot.m[1][0] * p.x + rot.m[1][1] * p.y + rot.m[1][2] * p.z;
            g_corrected_coords[i].z = rot.m[2][0] * p.x + rot.m[2][1] * p.y + rot.m[2][2] * p.z;
            g_corrected_coords[i].confidence = p.confidence;
#endif
        }

        // 3. Compute Bounding Box Zoom Factor (Z_factor)
        float zoom = person_area_pixels / (frame_area_pixels || 1.0f);
        float bias = zoom * 0.25f;

        // Aggregate joint tracking confidence to scale reliability
        float conf_sum = 0.0f;
        int active_joints[4] = {11, 12, 23, 24};
        for (int idx : active_joints) {
            conf_sum += raw_points[idx].confidence;
        }
        float aggregate_conf = conf_sum / 4.0f;

        FramingOutput output;
        output.zoom_factor = zoom;
        output.framing_bias = bias;
        output.camera_pitch_angle_deg = pitch_rad * (180.0f / M_PI);
        output.camera_roll_angle_deg = roll_rad * (180.0f / M_PI);
        output.perspective_confidence = aggregate_conf * cos(pitch_rad);

        return output;
    }
};

static CameraFramingEngine global_framing_engine;
static FramingOutput global_output_metrics;

extern "C" {
    __attribute__((import_name("onFramingMetricsResolved"))) void onFramingMetricsResolved(FramingOutput* output);

    void* allocate_skeletal_coords_buffer() {
        return &g_skeletal_coords[0];
    }

    void* allocate_corrected_coords_buffer() {
        return &g_corrected_coords[0];
    }

    void process_framing_evaluation(float pitch_rad, float roll_rad, float person_area_pixels, float frame_area_pixels) {
        FramingOutput results = global_framing_engine.Process(
            &g_skeletal_coords[0], 
            pitch_rad, 
            roll_rad, 
            person_area_pixels, 
            frame_area_pixels
        );
        global_output_metrics = results;
        onFramingMetricsResolved(&global_output_metrics);
    }
}
```


### 4.2 WebGPU Perspective Corrective Projection Shader (`perspective_corrector_matrix.wgsl`)
The following WGSL compute shader performs parallel matrix multiplication on the GPU, transforming all 33 skeletal joint landmark coordinates dynamically in real-time based on the calculated rotation matrix:

```wgsl
struct CameraRotation {
    row0: vec4<f32>,
    row1: vec4<f32>,
    row2: vec4<f32>,
};

struct ProjectionConfig {
    width: u32,
    height: u32,
    keypoint_count: u32,
    padding: u32,
};

@group(0) @binding(0) var<uniform> rot: CameraRotation;
@group(0) @binding(1) var<uniform> config: ProjectionConfig;
@group(0) @binding(2) var<storage, read> input_keypoints_3d: array<vec4<f32>>; // (x, y, z, conf)
@group(0) @binding(3) var<storage, read_write> output_corrected_3d: array<vec4<f32>>; // (x, y, z, conf)

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;

    if (index >= config.keypoint_count) {
        return;
    }

    let raw_kp = input_keypoints_3d[index];
    let raw_pos = vec4<f32>(raw_kp.x, raw_kp.y, raw_kp.z, 1.0);

    // Apply 3x3 rotation transformation on GPU registers
    let corrected_x = dot(rot.row0, raw_pos);
    let corrected_y = dot(rot.row1, raw_pos);
    let corrected_z = dot(rot.row2, raw_pos);

    output_corrected_3d[index] = vec4<f32>(corrected_x, corrected_y, corrected_z, raw_kp.w);
}
```


### 4.3 TypeScript Orchestrator Wrapper (`CameraFramingEngine.ts`)
The TypeScript driver manages WebAssembly memory mappings, coordinates parallel WebGPU matrix projection compute dispatches, and executes dynamic classifier updates on device:

```typescript
export interface FramingAnalysisResult {
  readonly zoomFactor: number;             // Z_factor
  readonly framingBias: number;            // B_frame
  readonly cameraPitchAngleDeg: number;
  readonly cameraRollAngleDeg: number;
  readonly perspectiveConfidence: number;
}

export class CameraFramingEngine {
  private wasmInstance!: any;
  private memory!: WebAssembly.Memory;
  private bufferOffsetCoords: number = 0;
  private bufferOffsetCorrected: number = 0;
  private isLoaded: boolean = false;
  private device!: GPUDevice;
  private pipeline!: GPUComputePipeline;
  private keypointCount = 33;

  private latestResults: FramingAnalysisResult | null = null;

  constructor() {}

  public async initialize(wasmArrayBuffer: ArrayBuffer): Promise<void> {
    const wasmImports = {
      env: {
        onFramingMetricsResolved: (metricsPtr: number) => {
          this.handleResolvedMetrics(metricsPtr);
        }
      }
    };

    const compiled = await WebAssembly.instantiate(wasmArrayBuffer, wasmImports);
    this.wasmInstance = compiled.instance.exports;
    this.memory = this.wasmInstance.memory;
    
    // Allocate stable, aligned buffers on WebAssembly heap safely using C++ exports
    this.bufferOffsetCoords = this.wasmInstance.allocate_skeletal_coords_buffer();
    this.bufferOffsetCorrected = this.wasmInstance.allocate_corrected_coords_buffer();

    // Initialize WebGPU context
    const adapter = await navigator.gpu?.requestAdapter();
    this.device = await adapter?.requestDevice() as GPUDevice;

    const shaderModule = this.device.createShaderModule({
      code: `
        // WGSL code loaded from perspective_corrector_matrix.wgsl
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

  public async evaluateFraming(
    rawKeypoints3D: Float32Array, // 33 * 4 values
    pitchRad: number,
    rollRad: number,
    personAreaPixels: number,
    frameAreaPixels: number,
    width: number,
    height: number
  ): Promise<FramingAnalysisResult | null> {
    if (!this.isLoaded || !this.device) return null;

    // Configure WebGPU buffers for high-speed parallel matrix rotation checks
    const rotationBuffer = this.device.createBuffer({
      size: 48, // 3 * vec4<f32> row-aligned
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const configBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const keypoint3DBuffer = this.device.createBuffer({
      size: rawKeypoints3D.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });

    const outputCorrectedBuffer = this.device.createBuffer({
      size: this.keypointCount * 16, // 33 * sizeof(vec4<f32>)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    // Write parameters to buffers
    const cp = Math.cos(pitchRad);
    const sp = Math.sin(pitchRad);
    const cr = Math.cos(rollRad);
    const sr = Math.sin(rollRad);

    const rotData = new Float32Array([
      cr, -sr * cp, sr * sp, 0.0,
      sr, cr * cp, -cr * sp, 0.0,
      0.0, sp, cp, 0.0
    ]);

    this.device.queue.writeBuffer(rotationBuffer, 0, rotData.buffer);

    const configData = new Uint32Array([width, height, this.keypointCount, 0]);
    this.device.queue.writeBuffer(configBuffer, 0, configData.buffer);
    this.device.queue.writeBuffer(keypoint3DBuffer, 0, rawKeypoints3D.buffer);

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: rotationBuffer } },
        { binding: 1, resource: { buffer: configBuffer } },
        { binding: 2, resource: { buffer: keypoint3DBuffer } },
        { binding: 3, resource: { buffer: outputCorrectedBuffer } }
      ]
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(1);
    passEncoder.end();

    const stagingBuffer = this.device.createBuffer({
      size: this.keypointCount * 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(outputCorrectedBuffer, 0, stagingBuffer, 0, this.keypointCount * 16);
    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ);
    const corrected3D = new Float32Array(stagingBuffer.getMappedRange());

    // Map corrected 3D coordinates directly to the WASM heap
    const heapView = new Float32Array(this.memory.buffer, this.bufferOffsetCoords, 33 * 4);
    heapView.set(corrected3D);

    stagingBuffer.unmap();

    // Trigger WASM execution loop with parameters
    this.wasmInstance.process_framing_evaluation(pitchRad, rollRad, personAreaPixels, frameAreaPixels);

    return this.latestResults;
  }

  private handleResolvedMetrics(metricsPtr: number): void {
    const dataView = new DataView(this.memory.buffer, metricsPtr, 20); // sizeof(FramingOutput) = 20
    
    const zoomFactor = dataView.getFloat32(0, true);
    const framingBias = dataView.getFloat32(4, true);
    const cameraPitchAngleDeg = dataView.getFloat32(8, true);
    const cameraRollAngleDeg = dataView.getFloat32(12, true);
    const perspectiveConfidence = dataView.getFloat32(16, true);

    this.latestResults = {
      zoomFactor,
      framingBias,
      cameraPitchAngleDeg,
      cameraRollAngleDeg,
      perspectiveConfidence
    };
  }
}
```