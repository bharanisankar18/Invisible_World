---
name: InvisibleWorld
description: Interactive science site for students. Build an atom in 3D, explore its electron clouds, and zoom from a human hair down to a nucleus.
colors:
  bg: "#0D1B4C"
  surface: "#13245F"
  surface-2: "#1A2E72"
  stage: "#071034"
  text: "#F3F6FF"
  muted: "#AEBBE6"
  line: "#2A3F8F"
  proton: "#FF5D73"
  neutron: "#D5DCF2"
  electron: "#4FE3FF"
  p-orbital: "#FFC23D"
  d-orbital: "#9BFF5C"
typography:
  display:
    fontFamily: Anybody (variable, wdth 50–150)
  body:
    fontFamily: Atkinson Hyperlegible
---

# InvisibleWorld: design system

## Idea: the cloud chamber
A cloud chamber makes invisible particles leave visible trails. The site does the same:
a Prussian-blue ground where every bright colour is a particle or an orbital.

## Colour carries physics
| Colour | Means |
| --- | --- |
| Coral `#FF5D73` | proton, positive charge |
| Pale `#D5DCF2` | neutron, neutral; fast muon tracks |
| Cyan `#4FE3FF` | electron, negative charge, s orbitals, s-block |
| Amber `#FFC23D` | p orbitals, p-block |
| Lime `#9BFF5C` | d orbitals, d-block |

Each orbital colour has a second, deeper shade for the opposite wave phase.
Buttons are white on blue (`text` on `bg`) so that colour is never decoration.
The periodic table uses the orbital colours, linking the table's blocks to the clouds.

## Type
- Display: Anybody, `wdth` 108, `wght` 760, tracking −0.018em.
- Hero headline: lines widen from `wdth` 50 to 112 on load, staggered 140 ms, like letters under a lens.
- Body: Atkinson Hyperlegible 17px / 1.6, built for legibility. No monospace, no all-caps labels.

## Shape
- Pills (999px) for buttons, chips and segmented controls.
- 22px for panels, 28px for 3D stages, 10–14px for small controls.
- No drop shadows except glows that represent light.

## Motion
- One orchestrated hero: cloud-chamber tracks burst in, then trickle. Tap to fire a particle.
- 3D motion explains physics: orbiting electrons, the jump-and-photon, nucleon jiggle, cloud twinkle.
- Everything honours `prefers-reduced-motion` (static chamber photograph, still atom).

## Copy
- Sentence case, second person, plain verbs. Say what a button does.
- Always say when a picture is simplified (`.illustrative`).

## Atom lab
- Three views: Shells (Bohr), Clouds (sampled |ψ|² of hydrogen-like orbitals, radii compressed with r^0.6), Nucleus (fcc-packed nucleons).
- Configuration chips light up a subshell; inside it, orbital chips with spin arrows isolate one orbital.
- URL holds state: `/atom?z=11&n=12&e=10&view=shells` is Na⁺.
