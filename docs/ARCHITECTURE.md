# Architecture

React 18 + TypeScript + Vite + GSAP, Web Audio. No backend. Deploys to Vercel as a static site.

```
Story (StoryController)        title screen → Chapter 1 → 2 → 3, replay, restart, chapter select
 └ Chapter (chapters/chapterNN) script.ts · stages.ts · storyboard.ts · interactions/ · index.ts
    └ Sequence (A–G)            progress ticks in the masthead
       └ Beat (B01…, M01…, L01…) pure data: stage, camera moves, layer states, dialogue, sound, music,
                                 progression (auto · dialogue · interaction · confirm · end)
          └ Stage               reusable illustrated location: layers (art, characters, fx) + named camera shots
```

## Key files

| File | Role |
|---|---|
| `src/components/story/StoryController.tsx` | Screen-level flow; lazy-loads each chapter (`src/chapters/index.ts`), preloads the next. |
| `src/components/story/StoryboardPlayer.tsx` | Mounts a `Director`, renders stages, dialogue box, pause menu, HUD slot; keyboard and click input. |
| `src/story/Director.ts` | Plays a chapter: one controlled state machine (no scattered timeouts) — GSAP timelines, camera, stage transitions (cut, crossfade, black, push, archive, present), pause/resume, music cues, preloading. |
| `src/story/types.ts` | The content model (Beat, Stage, Layer, Camera, Advance…). |
| `src/story/validate.ts` | Dev check: every screenplay line shown exactly once and in order; every layer/shot/target exists. Shown in the dev overlay. |
| `src/story/fx.tsx` + `fxRegistry.ts` | Built-in effect layers; chapters register their own (`registerFx`) — dust, rover game, timelines, holograms. |
| `src/components/dialogue/*` | Undertale-style box: portrait, name, typewriter, per-letter voice blips, click-to-complete then click-to-advance, lip-sync events. |
| `src/components/audio/*` | `DialogueAudio` (voice/sfx/music buses → master), `MusicBed` (synthesized ambience per mood), `SoundSettings`. |
| `src/data/assetManifest.ts` | Every image slot + NASA photo list. |
| `src/data/characters.ts`, `voiceManifest.ts`, `audioManifest.ts`, `missions.ts` | Characters/portraits, voice profiles, music patches, verified history. |

## Activities (interactive moments)

An activity is a layer whose `fx` component renders the interaction and calls `interact(layerId)` when done.
The beat uses `advance: { mode: 'interaction', target: layerId }`. Instructions render into the HUD slot
(`ActivityHud`) so they keep a readable size whatever the camera does.

| Interaction | Component | Mouse / touch | Keyboard / accessible alternative |
|---|---|---|---|
| A Apollo 11 | `InteractiveHotspot` | click/tap the site | focused automatically; Enter/Space |
| B Dust | `chapter02/interactions/DustReveal.tsx` | drag to brush (canvas mask, progress grid, 70 % threshold) | **Brush here** button sweeps a band per press |
| C Rover + APXS | `chapter02/interactions/RoverGame.tsx` | on-screen pad (hold) or tap-to-move; rocks block | arrow keys / WASD, Space to analyse; **Drive there for me** |
| D Rover timeline | `chapter03/interactions/RoverTimeline.tsx` | click tabs | ARIA tabs with arrow/Home/End; **Continue the story** always available |

## Audio

Audio starts only after the Begin click (autoplay policy). Voice blips fire on newly revealed letters/digits
only (not spaces or punctuation), every N letters per profile; completing a line instantly paints the rest
silently. Pause suspends the AudioContext; unmounting a chapter stops voices and music. Volumes and mute
persist in `localStorage` (wrapped in try/catch). To use team-supplied audio: `sampleUrl` in
`voiceManifest.ts`, `file` in `audioManifest.ts`.

## Responsive and accessibility

Stages lay out in container units; layers and shots have `portrait` overrides that recompose for upright
phones; the camera re-solves on resize. Reduced motion shortens tweens and shows text instantly. Dialogue
is announced via `aria-live`; pause menu and credits are native `<dialog>`s (Esc closes).

## Dev tools

`?chapter=N` picks the chapter on the title screen; `?beat=M10` (dev only) starts at a beat. Dev overlay:
`` ` `` toggles, `[` `]` step beats. `window.__aster` exposes the Director in dev builds only.
