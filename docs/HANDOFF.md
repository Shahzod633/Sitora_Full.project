# Handoff

## State (November 2026, branch `feat/three-chapters`)

All three chapters are playable start to finish with placeholder art where final art is missing. Chapter 1
is preserved (safe point: git tag `checkpoint/chapter1-prototype`). `npm run typecheck` and `npm run build`
pass.

## What was verified in a browser (dev server, Chromium, 1366×768 and 390×844)

- Title screen → Begin; `?chapter=2` → "Begin Chapter 02"; Chapter 2 end card → **Continue to Chapter 03**.
- Storyboard validator: Ch1 34 beats, Ch2 27, Ch3 18 — all "valid"; no console errors.
- Chapter 1: opening with the new Earth painting, galley beat B13A, Eli lip-sync in the wide cockpit (B11).
- Chapter 2: prologue dialogue with Eli's frames and Mara's portrait from her character sheet; Mars orbit,
  entry, landing, crew walk; dust brushing by mouse drag **and** by "Brush here" (progress bar, reveal,
  auto-continue); rover game by keyboard and "Drive there for me" → APXS → documented result → timeline
  ("Show everything", bars 7/83 sols) → return to present; dialogue scenes; chapter card.
- Chapter 3: holograms, rover timeline (click + arrow keys, progress count, active/ended status), nameplate
  wipe, salute, Pip lifting Sojourner, sunset walk, glowing line, closing lines, THE END + replay.
- Pause menu (button and Esc), resume; mobile portrait: dialogue, dust activity, rover board — no
  horizontal scroll.

**Not verified:** actual sound output (the test browser cannot listen; the audio graph is built and runs
without errors), real touch devices, Safari/Firefox, mobile landscape (CSS exists, not viewed), a single
uninterrupted full playthrough at reading speed (beats were checked by jumping), screen readers.
Testing was done with the pane hidden, so animation-frame timing was simulated in the page for the rover.

## Placeholders still in the app

All Mars art, Sojourner, Mars suits, Mara kneel/salute, Pip carry/Mars/flight, sunset, holograms,
mini-game sprites, landed Aster (flying Aster stand-in), the Mars EVA portraits (cropped from the lunar
painting) and several Ch1 vector placeholders. Scenes using them show a "Placeholder art" label. Full list:
`ASSET_CHECKLIST.md`. (The 9 NASA photographs are included.)

## Decisions for the team

1. "Days" vs "sols" in Mara's line (see `NASA_SOURCES.md`).
2. NASA insignia on `moon-crew.webp` suits must be repainted.
3. Complete the illustration section of `AI_DISCLOSURE.md`.
4. Runtime is ~10–11 min vs the 7–9 target — trim holds if needed (`hold` values in storyboards).

## Next polish steps

Deliver P1 art → re-place feet/markers in `chapters/shared/marsSite.ts`; add Mars-suit portrait
expressions; a real device pass (iOS Safari audio unlock, touch dragging); listen-through of voice and
music levels; optional composed music via `audioManifest.ts`.
