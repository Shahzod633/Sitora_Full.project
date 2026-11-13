# ASTER — Chapter 01 storyboard: developer handoff

Chapter 01 ("Where It All Began") was rebuilt from **3 screens into 33 connected story beats** played by a
data-driven storyboard engine. The story and every line of dialogue follow `Demo_chapter1.txt` verbatim.

> **Artwork status:** every illustration in this build is a **temporary placeholder** in the project's flat
> hand-drawn style. No final artwork has been delivered or integrated yet. See [Assets](#assets).

---

## 1. What changed

| Before (prototype) | Now |
|---|---|
| `EarthDeparture` screen: Earth + ship, Continue button | Sequence A, beats B01–B04 on the reusable `orbit` stage |
| `AsterBridge` screen: 6 lines in one static frame | Sequence B, beats B05–B13 on the `cockpit` stage (crew intro, per-line framing, "Mara smiles", Moon approach) |
| `ApolloLegacy` screen: 7 lines, hotspot opens a modal | Sequences C–F, beats B14–B32 across `orbit`, `lunarBase`, `apolloSite` and `archive` |
| `ChapterEndScreen` | B33 on the `ending` stage (Replay + Credits & Sources) |
| 13 of 18 screenplay lines | **all 18 lines**, including the 5 post-flashback lines that were missing |

The three old scene components were removed: their layouts now live as data in `stages.ts`.
`StoryController`, the dialogue system (`DialogueBox`, `DialogueText`, voice blips), the audio engine,
`SceneArt`, `InteractiveHotspot`, `HistoricalInfoPanel`, `StartScreen` and the end screen were kept and extended.

## 2. Architecture

```
StoryController            start screen → StoryboardPlayer (key = run, so Replay remounts) · Credits dialog
└─ StoryboardPlayer        React shell: subscribes to Director snapshots, renders stages + chrome
   ├─ Director             progression state machine, GSAP timelines, camera, transitions, timers
   ├─ StageView × 1–2      renders one stage from data (2 only while transitioning)
   │  └─ cam planes        one per top-level layer; camera transform × layer depth = parallax
   │     └─ layer          artwork (SceneArt) | character (CharacterFigure) | effect (Fx)
   ├─ ChapterFrame         masthead + 6-part sequence progress
   ├─ Captions             comic captions (scene title, narration, location)
   ├─ DialogueBox          typewriter + voice blips + expression-aware portrait
   └─ DevOverlay           development only (lazy-loaded, stripped from production)
```

| File | Responsibility |
|---|---|
| `src/chapters/chapter01/script.ts` | The 18 screenplay lines, verbatim, each with an id, speaker and expression. Single source of dialogue. |
| `src/chapters/chapter01/stages.ts` | **Composition manifest**: 6 stages, their layers (asset, responsive box, portrait box, parallax depth, initial state, attachments) and named camera shots. |
| `src/chapters/chapter01/storyboard.ts` | **The 33 beats** (pure data). |
| `src/story/types.ts` | Content model (Beat, Stage, Layer, CameraShot, Advance…). |
| `src/story/Director.ts` | Turns beats into GSAP timelines; owns progression, input locking, camera, transitions, preloading. |
| `src/story/camera.ts` | Pure camera math (frame a layer/point at a zoom or fill ratio, parallax transforms, responsive boxes). |
| `src/story/fx.tsx`, `storyboard.css` | Reusable effect layers and ambient CSS loops. |
| `src/story/validate.ts` | Development check of the chapter data. |
| `src/data/assetManifest.ts` | Asset ids, bundled fallbacks, final-art slots, aspect ratios, mobile variants, preloading cache, NASA photo slots. |
| `src/data/characters.ts` | Character looks per costume (flight / EVA), expression art, portrait crops, emote anchors. |

**Content and animation are separate.** Beats only declare states ("Aster at dx 2, scale 1 over 3.4 s",
"camera on `pipClose`"). The Director builds the timelines. React never re-renders per animation frame:
camera and layer motion are written straight to the DOM, and React renders only on beat, line or
expression changes.

### Beat fields

| Brief requirement | Field |
|---|---|
| id, sequence | `id` (`B01`…`B33`), `slug`, `sequence` (`A`–`F`), `title` |
| background / visual layers | `stage` (which illustrated stage) + `from` (instant states) + `layers` (tweened states, or keyframe arrays) |
| camera configuration | `camera: { from?, to: move \| move[] }`, using named shots from the stage or inline shots |
| character positions | layer boxes in `stages.ts` plus `dx/dy/scale` offsets in beats |
| active speaker / dialogue IDs | `dialogue: LineId[]` (speaker comes from the script), `onLine` per-line cues |
| expression changes | `expressions`, plus each line's `expression` in `script.ts` |
| animation preset | `transition.kind` (`cut`, `crossfade`, `black`, `push`, `archive`, `present`) + layer keyframes |
| sound events | `sound: [{ cue, at }]` (`computer`, `scan`, `save`, `hotspot`, `archive`, `rumble`) |
| interaction requirement | `advance: { mode: 'interaction', target, hint }` |
| automatic / manual progression | `advance.mode`: `auto` (hold seconds, click fast-forwards), `dialogue`, `interaction`, `confirm`, `end` |
| wordless pauses | `outro: { hold, focus, expressions, camera }` after the last line (e.g. "Mara smiles") |
| next beat | `next` (defaults to the following beat) |

**State model.** Layer states accumulate within an uninterrupted visit to a stage, starting from each layer's
`initial` state. Any beat can therefore be entered directly (dev jump, re-entering a stage) with its exact
state, and when the reader skips ahead, unfinished tweens are completed instead of being left half-visible.

## 3. The 33 beats

Progression: **A** = automatic (click / Space fast-forwards), **D** = dialogue (reader-paced),
**I** = interaction, **C** = confirm button, **E** = end.

| Beat | Seq | Stage | Mode | What happens | Lines |
|---|---|---|---|---|---|
| B01 Earth | A | orbit | A 5.2 s | Fade in from black; slow parallax drift over Earth; sun light swells. Caption: scene title + "The late 21st century." | |
| B02 A distant object | A | orbit | A 4 s | A tiny Aster appears at the frame edge and slowly approaches. | |
| B03 Aster reveal | A | orbit | A 6 s | Aster crosses in front of Earth (2 keyframes), sun glint, thruster flicker. Narration caption. | |
| B04 Entering the spacecraft | A | orbit | A 2.2 s | Camera pushes into Aster's cockpit window (4.2×). | |
| B05 Cockpit establishing | B | cockpit | A 3.8 s | **Push** match transition through the window; camera settles on the wide cockpit; Pip's diagnostics on. | |
| B06 Introducing the crew | B | cockpit | A 8.2 s | Three camera moves (Mara → Eli → Pip) with comic name tags from the screenplay. | |
| B07 Eli's coffee comment | B | cockpit | D | Eli close-up. | eli-coffee |
| B08 Mara's response | B | cockpit | D | Shift to Mara; wry expression. | mara-preparation |
| B09 Eli's reaction | B | cockpit | D | Small push on Eli; grin. | eli-priorities |
| B10 Pip interrupts | B | cockpit | D | Pip close-up; "analyzing" face screen + diagnostic display. | pip-caffeine |
| B11 Eli interrupts Pip | B | cockpit | D | 0.32 s snap cut to Eli (comedic timing). | eli-dont-start |
| B12 Pip's joke | B | cockpit | D + pause | Pip/Mara two-shot, deadpan face; then wordless **"Mara smiles"** (2.2 s). | pip-disabling-concern |
| B13 Approaching the Moon | B | cockpit | A 5.8 s | Flight-computer readout "Approaching the Moon" + chime; console light change; Moon grows in the window; camera pushes to it. | |
| B14 Lunar orbit | C | orbit | A 5.2 s | **Push** out to space; Moon, Earth and Aster as independent layers; slow zoom toward the surface. | |
| B15 Lunar descent | C | lunarBase | A 5.6 s | Crossfade; the base revealed; Aster descends (keyframes) with gentle tracking; soft downward glow, no flames. | |
| B16 Landing and refuelling | C | lunarBase | A 6.6 s | Touchdown dust, engine glow off, gantry coupler lights, refuelling gauge fills. Fictional facility. | |
| B17 Lunar exploration | C | apolloSite | A 6.2 s | Crossfade; Mara/Eli in sealed EVA suits and Pip walk in; screenplay narration. | |
| B18 Apollo 11 discovery | C | apolloSite | A 5.4 s | The crew stops; camera pulls wide to reveal the small descent stage inside a beacon perimeter. | |
| B19 Mara and Eli | D | apolloSite | D | Mara + lander two-shot, then reframe to Eli. | mara-really-apollo, eli-hundred-years |
| B20 Pip scans the lander | D | apolloSite | D | Scan waves from Pip that fade before reaching the site; "Scan · no contact" reticle; scan sound. | pip-object-identified |
| B21 Eli corrects Pip | D | apolloSite | D | Quick cut to Eli, then Pip, deadpan. | eli-historical-artifact, pip-old-equipment |
| B22 The final joke | D | apolloSite | D + pause | Crew shot, Pip close-up, then a pause as the camera drifts to the lander. | mara-exactly, pip-humans-strange |
| B23 Interactive discovery | E | apolloSite | I | Pulsing hotspot with label on the lander, bottom hint, "Apollo 11 Flashback" title. The hotspot is auto-focused for keyboard users. | |
| B24 Transition to 1969 | E | archive | A 6.6 s | **Archive** transition (desaturate → sepia → grain → crossfade); "Documented history · 1969 — Apollo 11"; **illustrated reconstruction** of the first step, labelled "not archival footage". | |
| B25 The first lunar landing | E | archive | C | Documented-history panel: NASA facts, quote, 3 NASA photo slots (placeholders), sources, fact/fiction note. Button: "Return to the present". | |
| B26 Return to the future | E | apolloSite | A 5 s | **Present** transition (colour returns from sepia); silent observation. | |
| B27 Reflection | F | apolloSite | D | Restrained, slow two-shot. | mara-never-imagined, eli-neither-can-we |
| B28 Pip's question | F | apolloSite | D + pause | Pip/Eli; then Pip **processing** (face screen dots). | pip-still-important, eli-exactly |
| B29 Saving the memory | F | apolloSite | D + pause | "Saving" progress on Pip's face + save sound; then Pip's first, subtle **smile**. | pip-saving-memory |
| B30 Leaving Apollo | F | apolloSite | A 6 s | The crew turns and walks back; the site is left undisturbed. | |
| B31 Departure | F | lunarBase | A 5.6 s | Crossfade; Aster lifts off (2 keyframes), dust, low rumble, camera tilts up. | |
| B32 Toward Mars | F | orbit | A 6.6 s | Aster shrinks toward a red Mars glint; camera pulls back from the Moon. | |
| B33 Chapter ending | F | ending | E | Fade to black; CHAPTER 01 COMPLETE / WHERE IT ALL BEGAN / TO BE CONTINUED... / NEXT DESTINATION: MARS; Replay Chapter, Credits & Sources. | |

The screenplay gives the flight computer no wording, so B13's on-screen readout ("Approaching the Moon")
comes from the stage direction. It is not a dialogue line. Captions quote or condense the screenplay's narration.

## 4. Cinematic transitions and effects

| Effect | Implementation | Used in |
|---|---|---|
| Camera pan / zoom | `Director.moveCamera` — named shots solved per viewport (`target` + `zoom`/`fill`, `focus`, `screen`) | every stage |
| Parallax | each layer's camera plane receives `depth ×` the camera transform (stars 0.04–0.08, globes 0.3–0.42) | B01–B04, B13, B14, B32 |
| Slow object movement / spacecraft movement | layer keyframes (`dx/dy/scale/rotation`), thruster flicker attachment | B02–B04, B14–B16, B31, B32 |
| Character focus | non-speakers dim to 62 %, speaker glow, per-line reframing via `onLine` | dialogue beats |
| Expression changes | Pip face screen (9 states), Mara smile art, emote marks (sparkle, sweat, anger, !, …, ~) | B07–B13, B19–B29 |
| Light changes | `glow` layers (sun, amber console, base lights, cool lander rim) tweened per beat | B01, B03, B13, B16, B18, B23 |
| Scene crossfade | `crossfade` | B15, B17, B31, B32 |
| Match cut / push-through | `push` (old world scales into the window, new stage settles from 1.14×) | B05, B14 |
| Fade through black | `black` | B01, B33 |
| Historical transition | `archive` / `present` (grayscale + sepia + grain overlay) | B24, B26 |
| Soft reveal | opacity tweens on tags, reticle, HUD, hotspot, panels | B06, B13, B20, B23, B25 |
| Dialogue entrance | CSS slide/fade of the box, portrait swap animation, emote pop | dialogue beats |

**Reduced motion** (`prefers-reduced-motion: reduce`): camera moves become cuts, layer tweens shorten to
≤ 0.3 s, transitions to ≤ 0.4 s fades, ambient CSS loops stop, typing is instant (existing behaviour) and
automatic holds shorten by 25 %, never below 1.5 s.

## 5. Input and reliability

* Click/tap anywhere, **Space**, **Enter** or **→**: completes the current line, then advances; during
  cinematic beats it fast-forwards (first press finishes the animation, second continues).
* Input lock (160–400 ms) after each line, beat and interaction, so rapid clicks don't skip dialogue.
* Auto-advance uses a visibility-aware timer (pauses while the tab is hidden) instead of animation frames.
* When the next beat starts, the previous beat's tweens are completed rather than killed, so no layer is left
  half-faded. Stage transitions always finish before the old stage unmounts.
* The start screen entrance is CSS (time-based), so the title and Begin button can never stay hidden.
* Preloading: on every beat, the assets of the next 4 beats' stages are decoded and cached. Only Chapter 01
  assets are referenced. The three large SVGs are separate cached files; small ones are inlined.

## 6. Responsive composition

Layer boxes are written in container units (`cqw`, `cqh`, `cqmin`) of the story viewport. Every stage has
**portrait boxes** that recompose the scene for phones held upright, for example stacking the crew under the
cockpit window, instead of shrinking the desktop frame. Camera shots have portrait overrides. `fill`-based
shots adapt to any aspect ratio. In-world labels divide their size by the live zoom (`--cam-z`), so they read
the same at any framing. Characters on the Moon stand above a band of ground reserved for the dialogue box,
and safe-area insets are respected.

## 7. Assets

### Reused from the existing project (unchanged files)
`space.svg` (starfield), `earth.svg` (Earth, also in the cockpit window and lunar sky), `bridge.svg` (cockpit),
`moon.svg` (lunar ground), `facility.svg` (lunar base, also on the horizon), `apollo.svg` (descent stage),
`aster.svg` (spacecraft), `mara.svg`, `eli.svg`, `pip.svg` (kept for reference), the Barlow Condensed font,
`click-placeholder.wav`, the synthesized voice profiles.

### New temporary placeholders added (same style; replace with final art)
`moon-globe.svg`, `pip-full.svg` (original Pip + forearms, hands, legs, magnetic feet), `pip-lunar.svg`,
`mara-eva.svg`, `eli-eva.svg`, `mara-smile.svg`, `refuel-gantry.svg`, `recon-lander.svg`, `recon-astronaut.svg`.

### Missing artwork needed from the art team
| Slot (`assetManifest.ts`) | Needed for | Notes |
|---|---|---|
| `moonGlobe` | B13, B14, B32 | Moon from space, transparent background |
| `pipFull` | cockpit | Pip full body: face screen, arms, hands, short legs, magnetic feet. **Also supply the outline of the face screen** (or an expression sheet) and update `SCREEN` in `PipFace.tsx`. |
| `pipLunar` | Moon | Same Pip with lunar kit |
| `maraEva`, `eliEva` | B17–B30 | Sealed pressurised suits, full body, standing (walk-cycle frames welcome) |
| `maraSmile` + expression sheets | B12 and dialogue | Mara and Eli: smile, wry, sarcastic, grin, exasperated, surprised, awed, reflective (map them in `characters.ts → expressions`) |
| Aster landing/landed pose | B15, B16, B31 | The temporary `aster.svg` has its engine burn baked in, so it still shows exhaust when landed. Ideally deliver the engine glow as a separate layer. |
| `refuelGantry` | B16 | Fictional refuelling arm |
| `reconLander`, `reconAstronaut` | B24 | Illustrated 1969 reconstruction, clearly not photographic |
| NASA photos | B25 | AS11-40-5903, AS11-40-5878, AS11-44-6642: save to `public/assets/nasa/<id>.jpg`, set `available: true` in `archivePhotos`, and confirm usage rights for each file |
| Finals for every temporary slot | all | starfield, Earth, cockpit (transparent windows), lunar ground, base, descent stage, Mara/Eli flight busts |

### How to drop in final artwork
1. Put the file in `public/assets/...` (source images are never modified by the app).
2. Set `src` (and optionally `mobileSrc`) for that id in `src/data/assetManifest.ts`, and set `aspect` to the
   file's width / height.
3. If the composition changes, adjust that layer's `box` / `portrait` in `stages.ts`. Camera shots follow layers
   automatically.

The bundled placeholder stays visible until the final file has decoded, and also stays if the file fails to load.

## 8. Development tools (dev server only)

* **Storyboard overlay** (bottom-left): sequence, beat id/slug, stage, phase, line n/m, beat picker, and data
  validation status. Toggle with **`**; jump with **[** / **]**.
* **Deep link**: `http://localhost:5173/?beat=B17` starts at a beat (after Begin Chapter).
* **Validation**: `validateChapter()` checks 33 beats for unknown layers/shots/lines, dialogue in non-dialogue
  beats, interaction targets, and that **every screenplay line appears exactly once and in order**.
* **Automation hooks**: `window.__aster` (Director) and `window.__gsap`.
* `npm run typecheck` runs strict TypeScript (`tsconfig.json` added); `npm run build` is unchanged for Vercel.

None of these are in the production bundle (verified by searching `dist/`).

## 9. Browser test report

Tested in the Claude desktop app's built-in Chromium browser, against the dev server and the production
build (`vite preview`).

**Testing constraint:** the browser pane was hidden for the whole session, so the page received no animation
frames between captures. Animation was therefore checked by **reading the timeline state** (Director snapshots,
camera transforms, layer boxes) and by **capturing frames after forcing a GSAP tick** (dev hook). Playback was
not watched in real time, so smoothness and timing feel are **not verified**.

| # | Check | Result |
|---|---|---|
| 1 | Start screen loads (desktop + 375×812) | ✅ title, subtitle, chapter label, Begin, Credits, sound toggle |
| 2–4 | Earth, Aster approach, push into the ship | ✅ B01–B05 captured; push transition captured mid-way |
| 5–6 | Cockpit; Mara, Eli, Pip consistent; Pip smaller with legs/feet | ✅ |
| 7 | Every screenplay line in order | ✅ automated full run (dev): 18/18 lines, in order; repeated on the **production build** using only keyboard input |
| 8 | Speaker portraits match | ✅ automated: speaker name and portrait matched for all 18 lines. ⚠️ **Voice blips not heard** (no audio output verified) |
| 9–10 | Moon approach, landing, refuelling | ✅ B13–B16 captured |
| 11 | EVA suits with sealed helmets on the Moon | ✅ |
| 12–13 | Apollo discovery, Pip scan + dialogue | ✅ B18–B20 captured (scan framing fixed during testing) |
| 14 | Hotspot activates the flashback | ✅ real DOM click; hotspot auto-focused; aligned with the lander on desktop and 390×844 (measured) |
| 15 | History distinguishable from fiction | ✅ archive stage, "Documented history" badge, reconstruction label, fact/fiction note |
| 16 | Return to the story | ✅ "Return to the present" button → colour-return transition |
| 17 | Final conversation | ✅ B27–B29 incl. Pip's processing/saving/smile faces |
| 18–19 | Departure, completion screen | ✅ B31–B33 captured |
| 20 | Replay | ✅ dev and production |
| 21 | No broken image paths | ✅ production network log: all 200 |
| 22 | No console errors | ✅ dev and production consoles empty |
| — | Viewports | ✅ 1920×1080, 1366×768, 1024×768, 390×844, 844×390 (emulated); fixes applied for 844×390 and 390×844 |
| — | `npm run build` / `npm run typecheck` | ✅ both pass |

**Not tested:** real phones and Safari/Firefox, `prefers-reduced-motion` (could not be emulated in this browser),
audible sound, and the touch-specific path (only mouse and keyboard events).

## 10. Known limitations

* All artwork is temporary (see §7). Final visual quality depends on the art team's files.
* Mara's and Eli's expressions are mostly emote marks; only "Mara smiles" has expression art.
* Walking is a gentle bob, not a walk cycle. Heads do not turn and characters do not blink.
* Pip's face overlay is drawn for the placeholder's face-screen shape and must be updated with final Pip art.
* The `Voices/` MP3s are not used (git-ignored, rights unclear). Voices and cues are original synthesized audio.
* Expressions per line (in `script.ts`) are an interpretation; writers can change them in one place.

## 11. Historical sources

* NASA, Apollo 11 mission page: https://www.nasa.gov/mission/apollo-11/
* NASA NSSDC Apollo 11 archive and photo catalogue: https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html
* NASA (2011), *Recommendations to Space-Faring Entities: How to Protect and Preserve the Historic and
  Scientific Value of U.S. Government Lunar Artifacts* (75 m artifact boundary around the Apollo 11 descent stage).
