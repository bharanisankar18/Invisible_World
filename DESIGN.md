---
name: InvisibleWorld
description: Cinematic scientific exploration of microscopic, atomic, biological, electromagnetic and neural phenomena that exist beyond naked-eye vision.
colors:
  bg: "#0E1626"
  surface: "#152036"
  text: "#E8EEF8"
  muted: "#9AA9C2"
  border: "#22304A"
  accent: "#4DB2FF"
  on-accent: "#04121F"
typography:
  display:
    fontFamily: Mona Sans
  body:
    fontFamily: Mona Sans
rounded:
  default: "4px"
spacing:
  unit: "4px"
---

# InvisibleWorld: design system

## Overview
Cinematic scientific exploration of the unseen. **Midnight Instrument**: midnight blue to every edge, expanded-light titles like a film credit, photographs and diagrams treated as moonlight. The product is dark-only.

Signature move: a sparse azure particle field behind the landing headline, then stillness.

## Colors
- **bg** `#0E1626`
- **surface** `#152036`
- **surface-2** `#1A2740`
- **text** `#E8EEF8`
- **muted** `#9AA9C2`
- **border** `#22304A`
- **accent** `#4DB2FF`
- **accentInk** `#04121F`
- **warn** `#D4A017` (illustrative vs measured disclaimer only)

Accent covers at most 10% of any screen. No purple-blue gradients, no neon, no pure black.

## Typography
- Display: Mona Sans 300, width 125, tracking -0.01em
- Body: Mona Sans 400, width 100
- Mono (scale numerals): IBM Plex Mono
- Body 16px, line-height 1.55, measure 45–65ch
- h1 clamp(3rem, 6vw + 1rem, 6rem)

## Layout
- 8px base; section gaps 96 / 144 / 176px
- Container ~1280px
- Landing: marquee-hero (poster fold) then feature-stack of five zones
- App screens: workbench (nav + stage)

## Elevation and shape
- Radius 0–4px, square-cut
- Surfaces are lightness steps of the blue; hairline borders only when needed
- No drop shadows, no frosted glass

## Motion
- Ease `cubic-bezier(0.16, 1, 0.3, 1)`
- UI 140/260ms; large surfaces 520ms
- Transform and opacity only; honour prefers-reduced-motion
- One signature motion: landing title fade 0.6 → 1 over 520ms

## Copy
- Specific nouns and numbers. Banned: Unlock, Elevate, Seamless, Revolutionize, Supercharge, Get Started, Learn More.
- Always label illustrative visualizations vs measured scientific values.

## Do's and Don'ts
- Don't: use pure black or neon
- Don't: add frosted glass
- Don't: light sections inside the dark build
- Don't: add a second hue besides azure
- Don't: three identical icon cards
- Do: every control has hover, focus-visible, active, disabled
- Do: 44px touch targets
