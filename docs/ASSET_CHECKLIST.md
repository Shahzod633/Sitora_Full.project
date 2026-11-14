# Artist checklist

Compared against the files that actually exist (see `EXISTING_ASSETS_INVENTORY.md`). Nothing already
available and suitable is requested again. Every slot below is a key in `src/data/assetManifest.ts`; the
app runs today with a labelled placeholder in each one.

**General specs.** Scenes: 1920×1080 or larger, 16:9, PNG/WebP/JPEG, no characters baked in where the
notes say "separate layer". Characters and objects: transparent PNG or WebP, trimmed loosely (≈5 % padding),
feet/wheels touching the bottom edge. Talking frames: same canvas size and alignment as the base frame,
only the mouth changes. Style: match the existing paintings (painterly, muted, clean dark outlines).
**No NASA logos or mission insignia** in any artwork — use the ASTER mark.

## 1. Already completed (no action)

| Ch | Use | Manifest key | File |
|---|---|---|---|
| 1 | Title screen + opening | `spaceEarthLimb` | space-earth-limb.jpg |
| 1 | Aster exterior | `aster`, `asterSpace` | aster.webp, aster-space.webp |
| 1 | Cockpit wide (+ Eli talking) | `cockpitWide`, `cockpitWideEli` | cockpit-wide*.jpg |
| 1 | Cockpit two-shot (+ Eli, Mara talking) | `cockpitTwoShot*` | cockpit-twoshot-*.jpg |
| 1 | Galley (+ Eli, Mara talking, Mara glance) | `galley*` | galley-*.jpg |
| 1 | Apollo 11 site | `apolloPainting` | apollo-site.jpg |
| 2 | Observation deck (+ Eli, Mara talking) | `observationDeck*` | observation-*.jpg |
| — | Mara turnaround / portrait | `maraSheet` | mara-turnaround.jpg |

## 2. Reused across beats (deliver once)

`sojourner` is used in Ch2 (reveal, all site shots, the 1997 ramp) **and** Ch3 (nameplate, carry, sunset,
hologram fallback). `marsDigSite` + `marsCloseUp` carry 13 beats of Ch2 and 13 of Ch3. `maraMars`,
`eliMars`, `pipMars` are on stage in 20+ beats and also used for the sunset walk.

## 3. Needs a small edit

| Key | File | Edit |
|---|---|---|
| `moonCrewPainting` | moon-crew.webp | Replace the NASA insignia on all three suits with the ASTER mark; export without the window-control icons. Same canvas size. |

## 4. Needs additional poses or expressions

| Pri | Key | What | Size · alpha | Notes |
|---|---|---|---|---|
| P2 | `pipFull`, `pipLunar` | Pip full body (flight; lunar kit) | ~900 px tall · yes | Still bundled vector placeholders in Ch1. Box head with a **flat face screen** (the app draws his eyes on it — please leave the screen blank and tell us its corner coordinates), two arms, mechanical hands, two legs, magnetic feet. No helmet. |
| P3 | `maraEva`, `eliEva` | Mara / Eli in sealed lunar suits, full body standing | ~1200 px tall · yes | Used only as fallbacks now (the lunar painting covers B17–B30). |
| P3 | Portrait expressions | Mara: smiling, serious, surprised, thoughtful, sad · Eli: happy, sarcastic, surprised, laughing, serious · in **Mars suits** | 512×512 · no | Currently portraits crop the lunar painting and add an emote mark. Add as `expressions` in `src/data/characters.ts` (look `mars`). |

## 5. Still to be drawn — REQUIRED for a complete story (by priority)

| Pri | Ch / Seq | Manifest key | Description · camera · pose | Size | Alpha |
|---|---|---|---|---|---|
| **P1** | 2 C–G, 3 A–E | `sojourner` | Sojourner, ¾ view facing right, six cleated wheels on a rocker-bogie, flat solar panel, mast, cameras front, APXS at rear. Dust-worn, **clearly not operating**. Plain blank **nameplate on the side** (the app writes "SOJOURNER" on it; tell us its box). | 1600 px wide | yes |
| **P1** | 2 C–G, 3 A–E | `marsDigSite` | Medium-wide: flat dusty ground, low camera at chest height, butterscotch sky, distant hills; **open ground in the lower middle** (crew + rover stand there, ~50 % frame height for humans). No characters, no rover. | 1920×1080 | no |
| **P1** | 2 C, 3 D | `marsCloseUp` | Close-up of the ground at the same site, camera low; only dust, small stones. Rover sits in the middle as a layer. | 1920×1080 | no |
| **P1** | 2, 3 | `maraMars` | Mara in sealed Mars suit, full body, standing ¾ facing right, neutral. | ~1200 px tall | yes |
| **P1** | 2, 3 | `eliMars` | Eli, same suit design, standing (app mirrors him to face left). | ~1200 px tall | yes |
| **P1** | 2, 3 | `pipMars` | Pip with Mars kit (small backpack, lamp), no helmet, standing; blank face screen. | ~900 px tall | yes |
| **P1** | 3 E–F | `pipCarry` | Pip holding **both arms forward, elbows bent, hands open palms-up** at chest height (rover is a separate layer on his hands). Same canvas as `pipMars`. | ~900 px tall | yes |
| **P1** | 3 D | `maraKneel` | Mara on one knee, right hand reaching forward to wipe the nameplate, facing right. | ~900 px tall | yes |
| **P1** | 3 D | `maraSalute` | Mara at attention, right hand to helmet brow in a military salute, facing right. **Same canvas as `maraMars`** so the swap does not jump. | ~1200 px tall | yes |
| **P1** | 3 F | `marsSunset` | Panoramic Martian plain at sunset: warm dusty sky, small pale Sun with the **cool blue glow** real Martian sunsets have, long shadows. Horizon at ~62 %. No characters, no ship. | 2560×1080 or 1920×1080 | no |
| **P2** | 2 B | `marsGlobe` | Mars from orbit (polar cap visible). | 1600×1600 | yes |
| **P2** | 2 B | `marsDescentSky` | High-altitude Mars: curved horizon, thin hazy atmosphere. | 1920×1080 | no |
| **P2** | 2 B–C | `marsLandscape` | Wide plain near the Pathfinder site, room on the right for the landed ship and on the left-middle for a small dust mound. | 1920×1080 | no |
| **P2** | 2 B, 3 F | `asterMars` | Aster **landed** on Mars: landing legs down, dusty, ¾ view. (Today the flying Aster is used as a stand-in.) | 1800 px wide | yes |
| **P2** | 2 E | `reconPathfinder` | Illustrated reconstruction of the Pathfinder lander (petals open, deflated airbags, ramp) in archival tones — must read as an illustration, not a photo. | 1600×1000 | yes |
| **P3** | 2 E | `gameRover`, `gameRock`, `gameRockTarget`, `gameGround` | Mini-game sprites from **directly above**: rover (front = right), plain rock, the knobbly target rock "Barnacle Bill", ground tile 12:7. | rover 260×200 · ground 2400×1400 | yes / no |
| **P3** | 3 A, B | `holoSojourner`, `holoSpirit`, `holoOpportunity`, `holoCuriosity`, `holoPerseverance` | Clean line drawings of each rover, side view, one colour on transparency (the app tints them blue). Spirit/Opportunity may share one drawing; so may Curiosity/Perseverance. | 1200 px wide | yes |

## 6. OPTIONAL

| Key / item | Notes |
|---|---|
| `mobileSrc` crops | Portrait crops of the main paintings for phones (the camera already reframes; crops are a quality bonus). |
| Galley dialogue | `IMG_0105` / `IMG_0106` combination frames are ready if the team writes galley lines. |
| `refuelGantry`, `lunarBase`, `moonGlobe`, `reconLander`, `reconAstronaut`, `moonSurface`, `spaceStars`, `earth` | Ch1 vector placeholders that still render; painted versions would unify the style. |

## 7. NASA photographs (not artwork — download, don't draw)

Save to `public/assets/nasa/<ID>.jpg` and set `available: true` in `assetManifest.ts`:
AS11-40-5903, AS11-40-5878, AS11-44-6642 (Apollo 11) · PIA00634, PIA00638, PIA01466 (Pathfinder) ·
PIA18079 (Opportunity) · PIA16239 (Curiosity) · PIA24542 (Perseverance). Catalogue links are in
`NASA_SOURCES.md`. Until then each shows a labelled "Archival photo placeholder".
